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

// 2. Create AGENTS.md
const agentsMdPath = join(targetDir, "AGENTS.md");
const agentsMdContent = `@./skills/using-superpowers/references/cline-tools.md

<EXTREMELY-IMPORTANT>
You are running in Cline. Cline does NOT have a Skill tool — the Skill auto-matching mechanism that Claude Code uses is absent. Therefore, you MUST manually enforce the pipeline yourself.

EVERY time you receive a user message, you MUST:
1. Check if ANY skill in skills/ directory applies by reading its frontmatter description
2. If a skill applies (even 1% chance), use read_file to load it BEFORE any response or action
3. Announce which skill you're using and follow it exactly

Pipeline for code changes:
- "Build X" / "Fix Y" / "Refactor Z" → FIRST read_file skills/brainstorming/SKILL.md
- After brainstorming approved → read_file skills/using-git-worktrees/SKILL.md
- After worktree ready → read_file skills/writing-plans/SKILL.md
- During execution → read_file skills/test-driven-development/SKILL.md for EACH task
- Between execution tasks → read_file skills/requesting-code-review/SKILL.md
- After all tasks → read_file skills/finishing-a-development-branch/SKILL.md

For debugging:
- "Debug X" / "Why is Y broken" → read_file skills/systematic-debugging/SKILL.md

This is NOT optional. You CANNOT skip this even for "simple" tasks. Simple things become complex. The design can be brief, but you MUST follow the process.
</EXTREMELY-IMPORTANT>

@./skills/using-superpowers/SKILL.md
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

console.log(`\n🎉 Superpowers installed successfully!`);
console.log(`\n下一步：在 Cline 中打开 ${targetDir}，然后说"我们来做一个 React todo list"来验证安装。\n`);
console.log(`Next steps: Open ${targetDir} in Cline, then say "Let's make a React todo list" to verify.\n`);