---
name: c-implement-s-bdd-feature
description: Lightweight BDD+TDD workflow — Gherkin scenarios AND unit tests first, then implement
allowed-tools: Task, Read, Glob, Grep, Edit, Write, Bash, AskUserQuestion, TodoWrite
---

# Simple BDD Feature Implementation Workflow

You are orchestrating a lightweight BDD + TDD pipeline for small or well-defined features. **Both business scenarios (Gherkin) AND unit tests are written BEFORE implementation.** Follow these phases strictly.

## Phase 1: Planning

### Planning Principles

Before creating the implementation plan, enforce these constraints:

1. **Audit before building** — Search the codebase for existing components, utilities, and patterns that solve similar problems. Reuse first.
2. **No placeholders** — Every requested feature must be fully implemented. Never leave `TODO`, `FIXME`, or stub comments. If scope needs trimming, explicitly ask to defer.
3. **Minimize invention** — Prefer existing libraries, framework features, and project abstractions over custom solutions. Build only what doesn't exist.
4. **Map integration surfaces** — Identify how new code connects to existing systems. Verify APIs, props, and data flows before implementation.

### Planning Tasks

1. **Spawn plan agent** to:
   - Read the feature requirement or file specified by the user ($ARGUMENTS)
   - **Audit existing codebase** for reusable components, utilities, and patterns
   - **Ask clarifying questions** to the user to resolve any ambiguities
   - Create a concise implementation plan
   - Identify files to modify
   - **Flag any existing infrastructure** that can be leveraged instead of built
   - **Draft business scenarios** and **technical test cases**

2. **Present the plan to user** and wait for explicit approval before proceeding.

## Phase 2: Specification (Red Phase)

Once user approves the plan:

1. **Spawn code-tester agent** to write ALL specifications FIRST:

   **BDD Layer:**
   - Create `.feature` files with Gherkin syntax (Given/When/Then)
   - Define business scenarios in domain language

   Example:
   ```gherkin
   Feature: Add Item to Cart
     As a shopper
     I want to add products to my cart
     So that I can purchase them later

     Scenario: Add single item to empty cart
       Given my cart is empty
       When I add product "Blue T-Shirt" to the cart
       Then my cart should contain 1 item
   ```

   **TDD Layer:**
   - Write unit tests for expected behavior
   - Write step definitions for Gherkin scenarios

   **Verify:**
   - **Run all tests to confirm they fail** (Red phase)

## Phase 3: Implementation (Green Phase)

After specifications are written:

1. **Spawn code-architect agent** to implement the feature:
   - Follow the approved plan
   - Write **minimum code necessary** to make ALL tests pass
   - Adhere to existing patterns in the codebase
   - **Run all tests to confirm they pass** (Green phase)

## Phase 4: Simplification & Quality (Refactor Phase)

After tests pass:

1. **Spawn code-refactorer agent** to:
   - Review the new code for unnecessary complexity
   - Improve readability and ensure scalability
   - Apply approved simplifications directly to the codebase
   - **Run all tests after refactoring** to ensure nothing breaks

## Completion

After all phases complete successfully:
- Summarize the changes
- List all modified files
- Report test results (scenarios + unit tests)
- Mark all todos as completed

---

## Important Rules

- **Specs before code** — Never implement before BOTH Gherkin AND unit tests exist
- **Two layers** — BDD for business, TDD for technical correctness
- **Red-Green-Refactor** — Both layers must follow this cycle
