import { spawn } from 'node:child_process';
import * as fs from 'node:fs/promises';
import * as path from 'node:path';
import * as os from 'node:os';

export interface UnityRunnerOptions {
  unityPath?: string;
  projectPath: string;
  executeMethod: string;
  args?: Record<string, string>;
  logFile?: string;
  timeout?: number;
}

export interface UnityRunnerResult {
  success: boolean;
  exitCode: number;
  logPath: string;
  logTail?: string;
}

/**
 * Attempts to find the Unity Editor executable
 */
export function findUnityPath(): string | null {
  const platform = os.platform();

  if (platform === 'darwin') {
    // macOS: Check Unity Hub default location
    const hubPath = '/Applications/Unity/Hub/Editor';

    try {
      // We'd need to check synchronously or return a promise
      // For now, return common paths
      return '/Applications/Unity/Hub/Editor/2022.3.0f1/Unity.app/Contents/MacOS/Unity';
    } catch {
      return null;
    }
  }

  if (platform === 'win32') {
    return 'C:\\Program Files\\Unity\\Hub\\Editor\\2022.3.0f1\\Editor\\Unity.exe';
  }

  if (platform === 'linux') {
    return '/opt/unity/Editor/Unity';
  }

  return null;
}

/**
 * Runs Unity in batch mode to execute an editor script method
 */
export async function runUnityBatchMode(
  options: UnityRunnerOptions
): Promise<UnityRunnerResult> {
  const unityPath =
    options.unityPath ??
    process.env['UNITY_PATH'] ??
    findUnityPath();

  if (!unityPath) {
    throw new Error(
      'Unity path not found. Set UNITY_PATH environment variable or pass unityPath option.'
    );
  }

  const logFile =
    options.logFile ?? path.join(os.tmpdir(), `unity-batch-${Date.now()}.log`);

  const args = [
    '-batchmode',
    '-nographics',
    '-projectPath',
    options.projectPath,
    '-executeMethod',
    options.executeMethod,
    '-logFile',
    logFile,
    '-quit',
  ];

  // Add custom arguments
  if (options.args) {
    for (const [key, value] of Object.entries(options.args)) {
      args.push(`-${key}`, value);
    }
  }

  console.log(`Running Unity batch mode:`);
  console.log(`  Executable: ${unityPath}`);
  console.log(`  Project: ${options.projectPath}`);
  console.log(`  Method: ${options.executeMethod}`);
  console.log(`  Log: ${logFile}`);

  return new Promise((resolve) => {
    const proc = spawn(unityPath, args, {
      stdio: 'inherit',
      timeout: options.timeout ?? 300000, // 5 minute default timeout
    });

    proc.on('close', async (code) => {
      const exitCode = code ?? 1;
      let logTail: string | undefined;

      try {
        const logContent = await fs.readFile(logFile, 'utf-8');
        // Get last 50 lines of log
        const lines = logContent.split('\n');
        logTail = lines.slice(-50).join('\n');
      } catch {
        // Log file may not exist if Unity failed early
      }

      resolve({
        success: exitCode === 0,
        exitCode,
        logPath: logFile,
        logTail,
      });
    });

    proc.on('error', (error) => {
      console.error('Failed to start Unity:', error.message);
      resolve({
        success: false,
        exitCode: 1,
        logPath: logFile,
        logTail: error.message,
      });
    });
  });
}

/**
 * Checks if a Unity project exists at the given path
 */
export async function isUnityProject(projectPath: string): Promise<boolean> {
  try {
    // Expand ~ to home directory
    const expandedPath = projectPath.replace(/^~/, process.env['HOME'] ?? '');

    const assetsPath = path.join(expandedPath, 'Assets');
    const projectSettingsPath = path.join(expandedPath, 'ProjectSettings');
    const projectVersionPath = path.join(expandedPath, 'ProjectSettings', 'ProjectVersion.txt');

    // Check that all required directories/files exist
    await fs.access(assetsPath);
    await fs.access(projectSettingsPath);
    await fs.access(projectVersionPath);

    return true;
  } catch {
    return false;
  }
}

/**
 * Creates the Editor bridge script in a Unity project
 */
export async function installEditorBridge(projectPath: string): Promise<string> {
  const editorDir = path.join(projectPath, 'Assets', 'Editor');
  const bridgePath = path.join(editorDir, 'ClaudeAssetBridge.cs');

  await fs.mkdir(editorDir, { recursive: true });

  const bridgeScript = `using UnityEngine;
using UnityEditor;
using System;
using System.IO;

/// <summary>
/// Bridge script for Claude skill to create Unity assets via batch mode
/// </summary>
public static class ClaudeAssetBridge
{
    [MenuItem("Claude/Process Asset Manifest")]
    public static void ProcessManifest()
    {
        string manifestPath = GetCommandLineArg("-manifest");
        if (string.IsNullOrEmpty(manifestPath))
        {
            Debug.LogError("[ClaudeAssetBridge] No manifest path provided. Use -manifest <path>");
            return;
        }

        if (!File.Exists(manifestPath))
        {
            Debug.LogError($"[ClaudeAssetBridge] Manifest not found: {manifestPath}");
            return;
        }

        Debug.Log($"[ClaudeAssetBridge] Processing manifest: {manifestPath}");
        
        string json = File.ReadAllText(manifestPath);
        var manifest = JsonUtility.FromJson<AssetManifest>(json);

        if (manifest == null || manifest.assets == null)
        {
            Debug.LogError("[ClaudeAssetBridge] Failed to parse manifest");
            return;
        }

        int processed = 0;
        foreach (var asset in manifest.assets)
        {
            try
            {
                ProcessAsset(asset);
                processed++;
            }
            catch (Exception ex)
            {
                Debug.LogError($"[ClaudeAssetBridge] Error processing {asset.name}: {ex.Message}");
            }
        }

        AssetDatabase.Refresh();
        Debug.Log($"[ClaudeAssetBridge] Processed {processed}/{manifest.assets.Length} assets");
    }

    static void ProcessAsset(AssetDefinition asset)
    {
        Debug.Log($"[ClaudeAssetBridge] Processing: {asset.type} - {asset.name}");

        switch (asset.type)
        {
            case "prefab":
                // Prefabs are already created as .prefab files
                // Just ensure they're imported correctly
                AssetDatabase.ImportAsset(asset.path, ImportAssetOptions.ForceUpdate);
                break;

            case "scriptable-instance":
                // ScriptableObject instances may need re-importing
                AssetDatabase.ImportAsset(asset.path, ImportAssetOptions.ForceUpdate);
                break;

            default:
                // Most assets just need a refresh
                break;
        }
    }

    static string GetCommandLineArg(string name)
    {
        string[] args = Environment.GetCommandLineArgs();
        for (int i = 0; i < args.Length - 1; i++)
        {
            if (args[i] == name)
                return args[i + 1];
        }
        return null;
    }

    [Serializable]
    class AssetManifest
    {
        public string project;
        public string generatedAt;
        public AssetDefinition[] assets;
    }

    [Serializable]
    class AssetDefinition
    {
        public string name;
        public string type;
        public string path;
    }
}
`;

  await fs.writeFile(bridgePath, bridgeScript);
  console.log(`Installed Editor bridge: ${bridgePath}`);

  // Create meta file
  const metaContent = `fileFormatVersion: 2
guid: a1b2c3d4e5f6789012345678abcdef00
MonoImporter:
  externalObjects: {}
  serializedVersion: 2
  defaultReferences: []
  executionOrder: 0
  icon: {instanceID: 0}
  userData: 
  assetBundleName: 
  assetBundleVariant: 
`;

  await fs.writeFile(bridgePath + '.meta', metaContent);

  return bridgePath;
}
