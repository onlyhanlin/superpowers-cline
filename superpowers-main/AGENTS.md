@./skills/using-superpowers/SKILL.md

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