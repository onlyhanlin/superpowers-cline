# Cline Pipeline Compliance Enhancement

**Date:** 2026-05-30
**Status:** Approved
**Context:** Cline 端 Superpowers agent 不稳定地跳过管道阶段（如跳过 writing-plans 直接进入 executing-plans）

## Problem

Cline 没有原生的 `Skill` 自动匹配机制，全靠 AGENTS.md 中的文本指令驱动。但当前设计有问题：

1. **上下文稀释** — AGENTS.md（25行）引用 cline-tools.md（135行），加上每个阶段读取大量 skill 文件，早期管道指令在注意力窗口中被挤出
2. **无硬性门禁** — 没有程序化强制机制，agent 可以在无明确否定的情况下合理化跳过阶段
3. **无阶段追踪** — 没有持久化记录当前处于哪个阶段、哪些已完成、哪些待做

## Solution: Two-Part Enhancement

### Part A: State Tracking (`.superpowers-state.json`)

在项目根目录创建轻量状态文件，agent 每次操作前先读取，检查当前阶段和门禁条件。

**结构：**

```json
{
  "pipeline": {
    "stage": "brainstorming",
    "stages": {
      "brainstorming": { "status": "active", "gate": "user approved design" },
      "git-worktrees":    { "status": "pending", "gate": "worktree created OR user skipped" },
      "writing-plans":    { "status": "pending", "gate": "user approved plan" },
      "executing-plans":  { "status": "pending", "gate": "all tasks done, all tests pass" },
      "finishing":        { "status": "pending", "gate": "branch resolved" }
    }
  },
  "active_task": null,
  "description": ""
}
```

**状态生命周期：**
- `pending` → 尚未开始
- `active` → 当前正在进行的阶段
- `done` → 已完成，门禁条件已满足
- 一个 stage 标记为 `done` 后，下一个 stage 才能变为 `active`

**强制执行点：** AGENTS.md 最前面明确要求：在任何代码操作之前，先 `read_file .superpowers-state.json`，检查当前阶段状态。如果当前阶段门禁未满足，不得前进到下一阶段。

### Part B: Compact Pipeline Definition (AGENTS.md rewrite)

将当前 AGENTS.md（25行 + 引用 cline-tools.md 135行 = 160行）压缩到一个约 50 行的独立文件。

**内容设计：**

```
Section 1: Pipeline State Rule (5 lines)
  → MUST read .superpowers-state.json first, check stage, don't skip gates

Section 2: Tool Mapping (9 lines)
  → Only Cline-relevant mappings from cline-tools.md

Section 3: 5-Stage Pipeline (10 lines)
  → Each stage = name + skill file to read + gate condition

Section 4: TDD Microcycle (4 lines)
  → RED → VERIFY RED → GREEN → VERIFY GREEN → REFACTOR

Section 5: Authorization Checklist (3 lines)
  → 3 checks required before writing ANY implementation code
```

**去除的内容：**
- 大型流程图 → 紧凑编号列表
- 反模式表格（20行）→ 5行红牌摘要
- 不相关的工具映射（Cline 不用的）→ 删除
- 对 cline-tools.md 的引用 → 工具映射内联

## Scope

**修改文件：**
- `AGENTS.md` — 重写为约 50 行
- `bin/install.js` — 安装时同时创建 `.superpowers-state.json`

**新增文件：**
- `.superpowers-state.json` — 管道状态追踪

**受影响的文件：**
- `skills/using-superpowers/references/cline-tools.md` — 保持不变（其他平台仍需要），但不再被 AGENTS.md 引用

## Out of Scope

- 不在 Claude Code/Gemini/Codex 等有原生 Skill 工具的平台上修改
- 不改动任何 skill 文件内容
- 不添加 npm 依赖

## Verification

1. 安装后项目根目录存在 `.superpowers-state.json`
2. AGENTS.md 文件长度 ≤ 60 行
3. agent 在响应用户消息前会读取 `.superpowers-state.json`
4. agent 不会跳过当前活跃阶段的门禁