# Cline Pipeline Compliance Enhancement Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Enhance Cline's adherence to the Superpowers pipeline via state tracking and compact AGENTS.md

**Architecture:** Two complementary mechanisms: (1) `.superpowers-state.json` tracks pipeline stage and gate conditions, checked before every action; (2) AGENTS.md rewritten as ~50-line self-contained file with inline tool mapping and compact pipeline definition

**Tech Stack:** Node.js (install.js), JSON (state file), Markdown (AGENTS.md)

---

### Task 1: Create .superpowers-state.json Template

**Files:**
- Create: `.superpowers-state.json`

- [ ] **Step 1: Write the state file template**

```json
{
  "pipeline": {
    "stage": "brainstorming",
    "stages": {
      "brainstorming": { "status": "pending", "gate": "user approved design" },
      "git-worktrees": { "status": "pending", "gate": "worktree created OR user skipped" },
      "writing-plans": { "status": "pending", "gate": "user approved plan" },
      "executing-plans": { "status": "pending", "gate": "all tasks done, all tests pass" },
      "finishing": { "status": "pending", "gate": "branch resolved" }
    }
  },
  "active_task": null,
  "description": ""
}
```

- [ ] **Step 2: Commit**

```bash
git add .superpowers-state.json
git commit -m "feat: add pipeline state tracking file"
```

---

### Task 2: Update bin/install.js to Create .superpowers-state.json

**Files:**
- Modify: `bin/install.js:96-123`

- [ ] **Step 1: Add state file creation logic**

In `bin/install.js`, after the "Copy README" section (line ~121), add:

```javascript
// 5. Create .superpowers-state.json
const stateFile = join(targetDir, ".superpowers-state.json");
const stateContent = JSON.stringify({
  pipeline: {
    stage: null,
    stages: {
      brainstorming: { status: "pending", gate: "user approved design" },
      "git-worktrees": { status: "pending", gate: "worktree created OR user skipped" },
      "writing-plans": { status: "pending", gate: "user approved plan" },
      "executing-plans": { status: "pending", gate: "all tasks done, all tests pass" },
      finishing: { status: "pending", gate: "branch resolved" }
    }
  },
  active_task: null,
  description: ""
}, null, 2);

console.log("📝 Creating .superpowers-state.json...");
writeFileSync(stateFile, stateContent, "utf-8");
console.log("   ✅ .superpowers-state.json created.");
```

- [ ] **Step 2: Verify the install.js change reads correctly**

Read the full modified file to confirm the insertion point is correct and the JSON is valid.

- [ ] **Step 3: Commit**

```bash
git add bin/install.js
git commit -m "feat: install.js creates .superpowers-state.json on install"
```

---

### Task 3: Rewrite AGENTS.md as Compact Pipeline Definition

**Files:**
- Modify: `AGENTS.md` (complete rewrite)

- [ ] **Step 1: Write the new AGENTS.md**

```markdown
@./skills/using-superpowers/SKILL.md

# Cline Superpowers Pipeline

<EXTREMELY-IMPORTANT>
Before ANY action (including clarifying questions), read_file .superpowers-state.json to check current stage.
If a pipeline stage has "active" status and its gate is not satisfied, do NOT advance to the next stage.
You MUST read_file skills/<name>/SKILL.md for the current stage BEFORE taking any implementation action.
This is not negotiable. Not optional. No rationalizing your way out.
</EXTREMELY-IMPORTANT>

## Tool Mapping

| Skill ref | Cline tool |
|-----------|------------|
| Read | read_file |
| Write | write_to_file |
| Edit | replace_in_file |
| Bash | execute_command |
| Grep | search_files |
| Glob | list_files |
| Skill | read_file skills/<name>/SKILL.md |
| TodoWrite | task_progress parameter |
| EnterPlanMode | plan_mode_respond |

## Pipeline (DO NOT REORDER OR SKIP)

### 1. Brainstorming
Read: `skills/brainstorming/SKILL.md`
Gate: User approves design → set brainstorming status "done", set git-worktrees status "active"

### 2. Git Worktrees
Read: `skills/using-git-worktrees/SKILL.md`
Gate: Worktree created OR user explicitly skips → mark done, set writing-plans active

### 3. Writing Plans
Read: `skills/writing-plans/SKILL.md`
Gate: User approves plan → mark done, set executing-plans active

### 4. Executing Plans
Read: `skills/executing-plans/SKILL.md`
Per task: Read `skills/test-driven-development/SKILL.md` → RED→VERIFY RED→GREEN→VERIFY GREEN→REFACTOR→Commit
Between tasks: Read `skills/requesting-code-review/SKILL.md`
Gate: All tasks done, all tests pass → mark done, set finishing active

### 5. Finishing Branch
Read: `skills/finishing-a-development-branch/SKILL.md`
Gate: Branch resolved → mark done

## Debugging
"Debug X" / "Why is Y broken" → read_file `skills/systematic-debugging/SKILL.md`

## Authorization Checklist
Before writing ANY implementation code, confirm ALL 3:
1. [ ] Current stage read_file completed
2. [ ] Stage gate is not yet satisfied (still "active" or "pending")
3. [ ] Task plan or TDD test written
If any unchecked → STOP and complete the missing step.
```

- [ ] **Step 2: Verify AGENTS.md line count ≤ 60**

```bash
wc -l AGENTS.md
```

- [ ] **Step 3: Commit**

```bash
git add AGENTS.md
git commit -m "feat: compact AGENTS.md with pipeline state enforcement"
```

---

### Task 4: Final Verification

**Files:** None new

- [ ] **Step 1: Verify all expected files exist**

```bash
ls -la .superpowers-state.json AGENTS.md bin/install.js
```

- [ ] **Step 2: Verify AGENTS.md is compact**

```bash
wc -l AGENTS.md
```
Expected: ≤ 60 lines

- [ ] **Step 3: Verify .superpowers-state.json is valid JSON**

```bash
node -e "JSON.parse(require('fs').readFileSync('.superpowers-state.json','utf8')); console.log('Valid JSON')"
```

- [ ] **Step 4: Self-review checklist**

1. Spec coverage: Tasks 1-3 cover Part A (state tracking) and Part B (AGENTS.md rewrite)
2. Placeholder scan: No TBD, TODO, or incomplete sections
3. Type consistency: Pipeline stage names match between .superpowers-state.json and AGENTS.md

- [ ] **Step 5: Commit any final adjustments**

```bash
git add -A
git commit -m "chore: final verification adjustments"