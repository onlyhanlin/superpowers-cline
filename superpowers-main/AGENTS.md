@./skills/using-superpowers/references/cline-tools.md

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