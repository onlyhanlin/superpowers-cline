# Cline Tool Mapping

Skills use Claude Code tool names. When you encounter these in a skill, use your Cline equivalent:

| Skill references | Cline equivalent |
|-----------------|------------------|
| `Read` (file reading) | `read_file` |
| `Write` (file creation) | `write_to_file` |
| `Edit` (file editing) | `replace_in_file` |
| `Bash` (run commands) | `execute_command` |
| `Grep` (search file content) | `search_files` |
| `Glob` (search files by name) | `list_files` (with `recursive: true` and `file_pattern`) |
| `Skill` tool (invoke a skill) | `read_file` — read the skill file directly (e.g., `skills/brainstorming/SKILL.md`), then follow its instructions |
| `TodoWrite` (task tracking) | `task_progress` parameter — include `- [ ]` / `- [x]` checklist in every tool call |
| `WebSearch` | No built-in equivalent — use MCP web search tools if available, or `execute_command` with curl |
| `WebFetch` | No built-in equivalent — use MCP web fetch tools if available, or `execute_command` with curl |
| `Task` tool (dispatch subagent) | No direct equivalent — perform work inline in the current session, or use `use_mcp_tool` if a subagent MCP server is available |
| `EnterPlanMode` / `ExitPlanMode` | `plan_mode_respond` — use this to present plans and get user approval before implementation |
| `ask_user_question` | `ask_followup_question` |

## Skill Invocation in Cline

Cline does NOT have a `Skill` tool. Instead, to "invoke" a skill:

1. **Read the skill file** using `read_file`: read `skills/<skill-name>/SKILL.md`
2. **Follow the skill's instructions exactly** — announce which skill you're using
3. **Track progress** using the `task_progress` parameter (checklist format)

## Key Behavioral Notes

- Cline uses `task_progress` for todo tracking across all tool calls — this replaces both `TodoWrite` and is the primary way to show progress
- Cline cannot dispatch subagents natively — when a skill says "dispatch a subagent", do the work yourself inline
- When `EnterPlanMode` is referenced, use `plan_mode_respond` to present your design and get approval
- When multiple skills are triggered, read them one at a time: process skills first (brainstorming, debugging), then implementation skills

## Complete Workflow Pipeline

When a user requests code changes (features, fixes, refactors), you MUST follow this pipeline. Each stage requires reading a specific skill file. Do NOT skip stages unless the user explicitly tells you to.

```
User: "Build X" / "Fix Y" / "Refactor Z"
  │
  ▼
┌──────────────────────────────────────────────────────────────┐
│ STAGE 1: BRAINSTORMING                                       │
│ read_file skills/brainstorming/SKILL.md                       │
│ → Clarify requirements, propose design, get user approval     │
│ → Save spec to docs/superpowers/specs/                        │
│ Gate: User approves the design document                       │
└───────────────────────┬──────────────────────────────────────┘
                        │ design approved
                        ▼
┌──────────────────────────────────────────────────────────────┐
│ STAGE 2: GIT WORKTREES                                       │
│ read_file skills/using-git-worktrees/SKILL.md                 │
│ → Create isolated workspace (ask consent first)               │
│ → Verify clean test baseline                                  │
│ Gate: Worktree created OR user explicitly skips               │
└───────────────────────┬──────────────────────────────────────┘
                        │ isolated workspace ready
                        ▼
┌──────────────────────────────────────────────────────────────┐
│ STAGE 3: WRITING PLANS                                       │
│ read_file skills/writing-plans/SKILL.md                       │
│ → Decompose design into 2-5 minute tasks                     │
│ → Each task: exact file paths, test code, implementation code │
│ → Save plan to docs/superpowers/plans/                        │
│ Gate: User approves the implementation plan                   │
└───────────────────────┬──────────────────────────────────────┘
                        │ plan approved
                        ▼
┌──────────────────────────────────────────────────────────────┐
│ STAGE 4: EXECUTING PLANS                                     │
│ read_file skills/executing-plans/SKILL.md                     │
│ → Execute each task inline (Cline has no subagents)           │
│                                                               │
│   For EACH task in the plan:                                  │
│   ┌─────────────────────────────────────────┐                │
│   │ read_file skills/test-driven-development/SKILL.md  │      │
│   │ → RED: Write failing test first                     │      │
│   │ → VERIFY RED: Run test, confirm it fails            │      │
│   │ → GREEN: Write minimal code to pass                 │      │
│   │ → VERIFY GREEN: Run test, confirm it passes         │      │
│   │ → REFACTOR: Clean up (only when all tests pass)     │      │
│   │ → Commit                                           │      │
│   └─────────────────────────────────────────┘                │
│                                                               │
│   Between tasks:                                              │
│   ┌─────────────────────────────────────────┐                │
│   │ read_file skills/requesting-code-review/SKILL.md  │       │
│   │ → Review code against the plan                     │       │
│   └─────────────────────────────────────────┘                │
│                                                               │
│ Gate: All tasks completed, all tests pass                     │
└───────────────────────┬──────────────────────────────────────┘
                        │ all tasks done
                        ▼
┌──────────────────────────────────────────────────────────────┐
│ STAGE 5: FINISHING BRANCH                                    │
│ read_file skills/finishing-a-development-branch/SKILL.md      │
│ → Run full test suite                                        │
│ → Present options: merge / PR / keep / discard               │
│ → Clean up worktree                                          │
└──────────────────────────────────────────────────────────────┘
```

### Pipeline Rules

**ABSOLUTE REQUIREMENTS:**
1. **Stage 1 (brainstorming) MUST be read before ANY code is written.** No exceptions.
2. **Stage 4 (executing-plans) requires TDD for EVERY task.** Read `skills/test-driven-development/SKILL.md` before writing any implementation code.
3. **Between tasks, read `skills/requesting-code-review/SKILL.md`** to review the completed task against the plan.
4. **After all tasks complete, read `skills/finishing-a-development-branch/SKILL.md`** to wrap up.

**When users say "this is simple, just do it":** Simple things become complex. Follow the pipeline. The design can be brief, but you MUST follow the process.

**When users explicitly skip a stage:** Respect the instruction. User preferences override pipeline rules.

**Red Flags - STOP and check the pipeline:**
- "I already know what to do" → Read the stage skill anyway
- "This doesn't need a design" → Even simple things need clarifications. Read brainstorming.
- "I'll just write the code first" → NO. TDD requires test first. Read TDD skill.
- "Let me skip to implementation" → You must have a plan first. Read writing-plans.

## Additional Cline-specific tools

These tools are available in Cline but have no Claude Code equivalent:

| Tool | Purpose |
|------|---------|
| `list_code_definition_names` | List classes, functions, methods in a directory — useful for exploring codebase structure |
| `use_mcp_tool` | Call tools from connected MCP servers |
| `access_mcp_resource` | Access resources from connected MCP servers |
| `generate_explanation` | Generate diff view with AI-powered comments explaining git changes |
| `plan_mode_respond` | Present plans and get user approval (equivalent to EnterPlanMode) |