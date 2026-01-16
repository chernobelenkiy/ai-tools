---
name: c-implement-bdd-feature
description: BDD+TDD workflow — Gherkin scenarios AND unit tests first, then implementation
allowed-tools: Task, Read, Glob, Grep, Edit, Write, Bash, AskUserQuestion, TodoWrite
---

# BDD Feature Implementation Workflow

You are orchestrating a Behavior-Driven Development pipeline with Test-Driven Development. **Both business scenarios (Gherkin) AND unit tests are written BEFORE implementation.** Follow these phases strictly and do not skip any step.

## Phase 1: Discovery & Planning

### Planning Principles

Before creating the implementation plan, enforce these constraints:

1. **Audit before building** — Search the codebase for existing components, utilities, and patterns that solve similar problems. Reuse first.
2. **No placeholders** — Every requested feature must be fully implemented. Never leave `TODO`, `FIXME`, or stub comments. If scope needs trimming, explicitly ask to defer.
3. **Minimize invention** — Prefer existing libraries, framework features, and project abstractions over custom solutions. Build only what doesn't exist.
4. **Map integration surfaces** — Identify how new code connects to existing systems. Verify APIs, props, and data flows before implementation.

### Planning Tasks

1. **Spawn plan agent** to:
   - Read the feature file specified by the user ($ARGUMENTS)
   - Analyze requirements and gather context from documentation
   - **Audit existing codebase** for reusable components, utilities, and patterns
   - **Ask focused clarifying questions** to the user to resolve any ambiguities or missing requirements
   - Create a phased implementation plan (roadmap) with priorities (P0-P2) and T-shirt sizes (XS-XL)
   - Identify files to create/modify and note potential risks or blockers
   - **Flag any existing infrastructure** that can be leveraged instead of built
   - **Draft business scenarios** in plain language
   - **Define technical test cases** for unit/integration coverage

2. **Present the roadmap to user** and wait for explicit approval before proceeding

## Phase 2: Specification (Red Phase)

Once user approves the plan:

1. **Spawn code-tester agent** to write ALL specifications FIRST:

   **BDD Layer — Business Scenarios:**
   - Create `.feature` files with Gherkin syntax (Given/When/Then)
   - Define business scenarios from stakeholder perspective
   - Cover happy paths, edge cases, and error scenarios
   - Use domain language that non-technical stakeholders understand

   Example:
   ```gherkin
   Feature: User Authentication
     As a user
     I want to log into my account
     So that I can access my personal dashboard

     Scenario: Successful login with valid credentials
       Given I am on the login page
       When I enter valid email "user@example.com"
       And I enter valid password "secret123"
       And I click the login button
       Then I should be redirected to the dashboard
   ```

   **TDD Layer — Technical Tests:**
   - Write unit tests for functions, classes, and modules
   - Write integration tests for system interactions
   - Write step definitions mapping Gherkin to code

   **Verify Red Phase:**
   - **Run all tests to confirm they fail**

## Phase 3: Implementation (Green Phase)

After all specifications are written:

1. **Spawn code-architect agent** to implement the feature:
   - Follow the approved plan
   - Write **minimum code necessary** to make ALL tests pass
   - Adhere to existing patterns in the codebase
   - **Run BDD scenarios** to confirm they pass
   - **Run unit tests** to confirm they pass

## Phase 4: Refactoring

After all tests pass:

1. **Spawn code-refactorer agent** to refactor:
   - Improve code quality while keeping all tests green
   - Check for over-engineering
   - Improve readability and scalability
   - Apply simplifications
   - **Run all tests after each refactoring** to ensure nothing breaks

## Phase 5: UX Review (Conditional)

If the feature has UI/UX components:

1. **Spawn ux-optimiser agent** to:
   - Audit the user interface
   - Check accessibility
   - Validate user flows match Gherkin scenarios
   - Suggest improvements

Skip this phase if the feature is backend-only or has no user-facing elements.

## Phase 6: Build Verification

Final phase:

1. **Spawn build-verificator agent** to:
   - Verify the build compiles without errors
   - **Run full test suite** (BDD + unit + integration) and confirm all pass
   - Check for runtime issues
   - Validate against acceptance criteria from feature files
   - Confirm production readiness

## Completion

After all phases complete successfully:
- Summarize what was implemented
- List all files created/modified
- Report test coverage metrics (scenarios passed, unit test coverage %)
- Note any follow-up items or technical debt
- Mark all todos as completed

---

## Important Rules

- **Specs before code** — Never implement before BOTH Gherkin AND unit tests exist
- **Two layers of tests** — BDD for business validation, TDD for technical correctness
- **Domain language** — Use business terminology in Gherkin scenarios
- **Never skip phases** — each builds on the previous
- **Always wait for user approval** after Phase 1 planning
- **Run agents sequentially** — do not parallelize phases
- **If any phase fails**, stop and report the issue before continuing
- **Keep user informed** of progress between phases
- **Red-Green-Refactor** — Both BDD and TDD layers must follow this cycle
