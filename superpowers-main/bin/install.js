#!/usr/bin/env node

/**
 * Superpowers Installer for Cline
 *
 * Usage:
 *   npx superpowers install       - Install into current directory
 *   npx superpowers install /path - Install into specified directory
 *
 * This copies the skills/ directory and creates AGENTS.md
 * for Cline compatibility.
 */

import { execSync } from "node:child_process";
import { existsSync, cpSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join, dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const repoRoot = resolve(__dirname, "..");

const args = process.argv.slice(2);
const command = args[0] || "install";

if (command !== "install") {
  console.log(`
Superpowers - AI Coding Methodology for Cline

Usage:
  npx superpowers install              Install into current working directory
  npx superpowers install /some/path   Install into a specific directory
`);
  process.exit(0);
}

const targetDir = args[1] ? resolve(args[1]) : process.cwd();

// Guard: prevent installing into the source repo itself
if (resolve(targetDir) === resolve(repoRoot)) {
  console.error(`❌ Error: Cannot install into the source repository directory.`);
  console.error(`   Source: ${repoRoot}`);
  console.error(`   Target: ${targetDir} (same as source)`);
  console.error(`\n   Run this command from your PROJECT directory instead:`);
  console.error(`     cd /path/to/your/project`);
  console.error(`     npx superpowers install`);
  console.error(`\n   Or specify a different target directory:`);
  console.error(`     npx superpowers install /path/to/your/project`);
  process.exit(1);
}

console.log(`🔧 Superpowers Installer`);
console.log(`   Target: ${targetDir}\n`);

// 1. Copy skills/ directory
const skillsSrc = join(repoRoot, "skills");
const skillsDest = join(targetDir, "skills");

if (!existsSync(skillsSrc)) {
  console.error("❌ Error: skills/ directory not found in source.");
  process.exit(1);
}

console.log("📁 Copying skills/ directory...");
cpSync(skillsSrc, skillsDest, { recursive: true });
console.log("   ✅ skills/ copied successfully.");

  // 2. Create AGENTS.md (compact pipeline definition)
const agentsMdPath = join(targetDir, "AGENTS.md");
const agentsMdContent = `@./skills/using-superpowers/SKILL.md

# Superpowers Pipeline

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
Read: \`skills/brainstorming/SKILL.md\`
Gate: User approves design → set brainstorming status "done", set git-worktrees status "active"

### 2. Git Worktrees
Read: \`skills/using-git-worktrees/SKILL.md\`
Gate: Worktree created OR user explicitly skips → mark done, set writing-plans active

### 3. Writing Plans
Read: \`skills/writing-plans/SKILL.md\`
Gate: User approves plan → mark done, set executing-plans active

### 4. Executing Plans
Read: \`skills/executing-plans/SKILL.md\`
Per task: Read \`skills/test-driven-development/SKILL.md\` → RED→VERIFY RED→GREEN→VERIFY GREEN→REFACTOR→Commit
Between tasks: Read \`skills/requesting-code-review/SKILL.md\`
Gate: All tasks done, all tests pass → mark done, set finishing active

### 5. Finishing Branch
Read: \`skills/finishing-a-development-branch/SKILL.md\`
Gate: Branch resolved → mark done

## Debugging
"Debug X" / "Why is Y broken" → read_file \`skills/systematic-debugging/SKILL.md\`

## Authorization Checklist
Before writing ANY implementation code, confirm ALL 3:
1. [ ] Current stage read_file completed
2. [ ] Stage gate is not yet satisfied (still "active" or "pending")
3. [ ] Task plan or TDD test written
If any unchecked → STOP and complete the missing step.
`;

console.log("📝 Creating AGENTS.md...");
writeFileSync(agentsMdPath, agentsMdContent, "utf-8");
console.log("   ✅ AGENTS.md created.");

// 3. Create docs/superpowers directories if they don't exist
const specsDir = join(targetDir, "docs", "superpowers", "specs");
const plansDir = join(targetDir, "docs", "superpowers", "plans");

if (!existsSync(specsDir)) {
  mkdirSync(specsDir, { recursive: true });
  console.log("   ✅ Created docs/superpowers/specs/");
}
if (!existsSync(plansDir)) {
  mkdirSync(plansDir, { recursive: true });
  console.log("   ✅ Created docs/superpowers/plans/");
}

// 4. Copy README if it exists
const readmeSrc = join(repoRoot, "README.cline.zh-CN.md");
const readmeDest = join(targetDir, "README.cline.zh-CN.md");
if (existsSync(readmeSrc)) {
  cpSync(readmeSrc, readmeDest);
  console.log("   ✅ README.cline.zh-CN.md copied.");
}

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

  console.log(`\n🎉 Superpowers installed successfully!`);
console.log(`\n下一步：在 Cline 中打开 ${targetDir}，然后说"我们来做一个 React todo list"来验证安装。\n`);
console.log(`Next steps: Open ${targetDir} in Cline, then say "Let's make a React todo list" to verify.\n`);