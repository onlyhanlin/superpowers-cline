# Superpowers for Cline 使用指南

> 让你的 Cline 编码助手获得"超能力"——在写代码之前，先思考、规划、测试。

---

## 目录

- [什么是 Superpowers](#什么是-superpowers)
- [安装步骤](#安装步骤)
- [工作流程概览](#工作流程概览)
- [详细使用步骤](#详细使用步骤)
  - [第一步：需求梳理（brainstorming）](#第一步需求梳理brainstorming)
  - [第二步：创建隔离分支（git-worktrees）](#第二步创建隔离分支git-worktrees)
  - [第三步：编写实施计划（writing-plans）](#第三步编写实施计划writing-plans)
  - [第四步：执行计划（executing-plans）](#第四步执行计划executing-plans)
  - [第五步：测试驱动开发（TDD）](#第五步测试驱动开发tdd)
  - [第六步：代码审查（code-review）](#第六步代码审查code-review)
  - [第七步：完成分支（finishing-branch）](#第七步完成分支finishing-branch)
- [技能触发规则](#技能触发规则)
- [常见问题](#常见问题)

---

## 什么是 Superpowers

Superpowers 是一套内置于项目中的 **AI 编码方法论**。它由 14 个技能（Skills）组成，Cline 会在合适的时机自动触发对应技能，强制遵循以下流程：

```
你说"我要做X" → Cline 不会直接写代码
                → 而是先问你"你到底想做什么？"
                → 理清需求后出设计方案
                → 你批准后写实施计划
                → 每个任务先写测试，再写代码
                → 自动审查代码质量
                → 完成后清理分支
```

**核心原则：**
- 🧪 **测试驱动开发（TDD）** — 永远先写测试
- 📋 **系统化优于临时方案** — 遵循流程，不要猜测
- 🎯 **降低复杂度** — 简单性是首要目标
- ✅ **证据优于声称** — 验证后再宣布成功

---

## 安装步骤

### 前提条件

- 已安装 **Cline**（VS Code 扩展）
- 已安装 **Node.js** (>=18.0.0，用于 npx 安装)
- 已安装 **Git**

---

### 方式一：npx 一键安装（推荐）

只需在你要使用 Superpowers 的项目目录下执行一条命令：

```bash
cd 你的项目目录
npx superpowers install
```

这将会自动完成以下操作：

1. 📁 将 `skills/` 目录复制到你的项目中
2. 📝 创建 `AGENTS.md`（Cline 引导配置）
3. 📂 创建 `docs/superpowers/` 目录结构

**指定安装目录（可选）：**

```bash
npx superpowers install /path/to/your/project
```

---

### 方式二：手动安装

将此仓库的以下文件/目录复制到你的项目根目录：

```
你的项目/
├── AGENTS.md              ← Cline 启动时自动加载的引导文件
├── skills/                ← 所有技能文件
│   ├── using-superpowers/
│   │   ├── SKILL.md       ← 技能系统核心指引
│   │   └── references/
│   │       └── cline-tools.md  ← Cline 工具映射表
│   ├── brainstorming/     ← 需求梳理技能
│   ├── writing-plans/     ← 编写计划技能
│   ├── executing-plans/   ← 执行计划技能
│   ├── test-driven-development/  ← TDD 技能
│   ├── systematic-debugging/     ← 系统调试技能
│   └── ...更多技能
└── docs/
    └── superpowers/
        ├── specs/         ← 设计文档存放位置
        └── plans/         ← 实施计划存放位置
```

`AGENTS.md` 的内容应为：

```
@./skills/using-superpowers/SKILL.md
@./skills/using-superpowers/references/cline-tools.md
```

---

### 验证安装

安装完成后，在 Cline 中打开项目，发送以下测试消息：

```
我们来做一个 React todo list
```

**预期行为：** Cline 不应该直接开始写代码。它应该首先读取 `brainstorming/SKILL.md` 技能文件，然后开始向你提问来理清需求（比如"你想要哪些功能？""数据需要持久化吗？"）。

如果 Cline 跳过提问直接写代码，说明 Superpowers 没有正确加载。请检查 `AGENTS.md` 文件是否存在且内容正确。

---

## 工作流程概览

Superpowers 的完整工作流程如下：

```
你的需求
    │
    ▼
┌─────────────────────┐
│ 1. BRAINSTORMING    │  ← 自动触发：理清需求，出设计方案
│    需求梳理          │
└────────┬────────────┘
         │ 你批准设计
         ▼
┌─────────────────────┐
│ 2. GIT WORKTREES    │  ← 自动触发：创建隔离的开发分支
│    创建隔离分支      │
└────────┬────────────┘
         │
         ▼
┌─────────────────────┐
│ 3. WRITING PLANS    │  ← 自动触发：拆分任务（每个 2-5 分钟）
│    编写实施计划      │
└────────┬────────────┘
         │ 你批准计划
         ▼
┌─────────────────────┐
│ 4. EXECUTING PLANS  │  ← 选择执行方式：内联执行
│    执行计划          │     （Cline 不支持子 Agent，所有任务在当前会话中执行）
└────────┬────────────┘
         │ 每个任务内:
         ▼
┌─────────────────────┐
│ 5. TDD 循环         │  ← RED → GREEN → REFACTOR
│    测试驱动开发      │     先写测试→看它失败→写代码→看它通过→重构
└────────┬────────────┘
         │ 任务之间:
         ▼
┌─────────────────────┐
│ 6. CODE REVIEW      │  ← 对照计划审查代码
│    代码审查          │
└────────┬────────────┘
         │ 所有任务完成
         ▼
┌─────────────────────┐
│ 7. FINISHING BRANCH │  ← 验证测试→提供合并/PR选项→清理 worktree
│    完成分支          │
└─────────────────────┘
```

**重要提示：** Cline 当前不支持子 Agent（Subagent）功能。因此第 4 步中所有任务会在当前会话中内联执行（而不是并行分发）。这意味着：
- 每个任务按顺序逐个执行
- 代码审查在任务之间进行
- 整体的执行时间可能比 Claude Code 长一些，但质量不打折扣

---

## 详细使用步骤

### 第一步：需求梳理（brainstorming）

**触发条件：** 当你说"我要做 X"或"帮我实现 Y"时自动触发。

**Cline 的行为：**

1. 先探索项目上下文（查看现有文件、文档、最近提交）
2. 如果你要做的东西涉及视觉内容，会询问你是否需要"视觉伴侣"（在浏览器中展示原型图）
3. 逐个提问来理清需求（每次只问一个问题，通常是选择题）
4. 提出 2-3 种实现方案，分析各自优劣，给出推荐
5. 分节展示设计方案，每节结束后等你确认
6. 将最终设计写入 `docs/superpowers/specs/YYYY-MM-DD-<主题>-design.md`
7. 自我审查设计文档（检查遗漏、矛盾、模糊之处）
8. 让你审查设计文档，等你批准

**示例对话：**

```
你：我想做一个用户登录功能

Cline：好的，让我先了解一下项目现状。
      [读取项目文件...]
      
      我看到这是一个 React + TypeScript 项目，目前还没有认证相关的代码。
      
      在开始设计之前，我想确认一下：
      
      你希望支持哪种登录方式？
      A) 邮箱 + 密码
      B) 手机号 + 验证码  
      C) 第三方登录（微信/支付宝）
      D) 以上全部

你：A 和 C

Cline：明白了。下一个问题：
      密码需要支持哪些安全策略？
      A) 基础（最少6位字符）
      B) 中等（8位+，需含字母和数字）
      C) 严格（12位+，需含大小写字母、数字、特殊字符）

... (继续逐个提问)

Cline：根据我们的讨论，我整理了以下设计方案。
      
      ## 架构设计
      使用 JWT token 认证，前端通过 Context API 管理认证状态...
      
      这个架构方案可以吗？有什么需要调整的？

你：可以

Cline：[将设计写入 docs/superpowers/specs/2026-05-29-login-design.md]
      
      Spec 已写入并提交。请查看文件，确认无误后我们开始编写实施计划。

你：确认无误

Cline：好的，现在进入编写实施计划阶段...
```

**关键规则：**
- ⛔ **在设计被批准之前，Cline 绝不写任何代码**
- ✅ 即使是"简单的"功能（如一个工具函数），也要走这个流程
- ✅ 你随时可以要求调整设计

---

### 第二步：创建隔离分支（git-worktrees）

**触发条件：** 设计批准后自动触发。

**Cline 的行为：**

1. 使用 `git worktree` 创建一个独立的工作目录
2. 在新目录中创建新的 git 分支
3. 运行项目初始化命令（如 `npm install`）
4. 运行现有测试确保基线通过

**为什么需要这一步：**
- 隔离开发环境，不影响主分支
- 可以同时开展多个功能开发
- 出问题时可以轻松放弃，不影响主工作区

**注意：** 如果你不想使用 git worktree，可以告诉 Cline 跳过这一步。

---

### 第三步：编写实施计划（writing-plans）

**触发条件：** 设计批准后（第二步之后）自动触发。

**Cline 的行为：**

1. 将设计拆解为一系列 **2-5 分钟** 的小任务
2. 每个任务包含：
   - 精确的文件路径（创建哪些文件、修改哪些文件）
   - 测试代码（先写测试）
   - 实现代码（最小化实现）
   - 运行命令（含预期输出）
   - 提交命令
3. 计划中不允许出现 `TBD`、`TODO`、`实现错误处理` 等占位符
4. 保存到 `docs/superpowers/plans/YYYY-MM-DD-<功能名>.md`
5. 自我审查计划（检查规格覆盖、占位符、类型一致性）
6. 让你审查计划，等待批准

**任务示例：**

```markdown
### Task 3: 验证密码强度

**文件:**
- 创建: `src/utils/passwordValidator.ts`
- 测试: `src/utils/__tests__/passwordValidator.test.ts`

- [ ] **步骤 1: 编写失败的测试**

```typescript
describe('passwordValidator', () => {
  it('至少需要8个字符', () => {
    const result = validatePassword('Abc1!');
    expect(result.valid).toBe(false);
    expect(result.error).toContain('至少8个字符');
  });

  it('需要包含大写字母', () => {
    const result = validatePassword('abcdefg1!');
    expect(result.valid).toBe(false);
    expect(result.error).toContain('大写字母');
  });
});
```

- [ ] **步骤 2: 运行测试，确认失败**

```bash
npx jest src/utils/__tests__/passwordValidator.test.ts
```
预期: FAIL - validatePassword 未定义

- [ ] **步骤 3: 编写最小实现**

```typescript
export function validatePassword(password: string) {
  const errors: string[] = [];
  if (password.length < 8) errors.push('密码至少需要8个字符');
  if (!/[A-Z]/.test(password)) errors.push('密码需要包含大写字母');
  // ... 其他规则
  return { valid: errors.length === 0, errors };
}
```

- [ ] **步骤 4: 运行测试，确认通过**

```bash
npx jest src/utils/__tests__/passwordValidator.test.ts
```
预期: PASS

- [ ] **步骤 5: 提交**

```bash
git add src/utils/passwordValidator.ts src/utils/__tests__/passwordValidator.test.ts
git commit -m "feat: 添加密码强度验证"
```
```

---

### 第四步：执行计划（executing-plans）

**触发条件：** 计划批准后自动触发。

**Cline 的行为：**

1. 读取计划文件
2. 审查计划（有问题提前提出）
3. 逐一执行每个任务
4. 在每个任务中遵循 TDD（见第五步）
5. 任务之间进行代码审查（见第六步）
6. 遇到阻塞时停下来向你求助

**与 Claude Code 的区别：**

| 功能 | Claude Code | Cline |
|------|------------|-------|
| 任务执行 | 派发子 Agent 并行执行 | 在当前会话中内联执行 |
| 审查方式 | 两阶段审查（规格+质量） | 内联审查 |
| 速度 | 较快（并行） | 较慢（串行），但质量同等 |

**你可以选择执行方式：**

计划编写完成后，Cline 会问你：
- **内联执行（Cline 默认）** — 在当前会话中逐个执行任务
- 或者你自己手动按计划执行（如果你更喜欢自己控制）

---

### 第五步：测试驱动开发（TDD）

**触发条件：** 在任何功能实现、Bug 修复、重构时自动触发。

**TDD 铁律：**

> **没有先写失败的测试，就不写任何产品代码。**

**RED-GREEN-REFACTOR 循环：**

```
┌──────────┐
│   RED    │  1. 写一个失败的测试
│  红色阶段 │     描述"代码应该做什么"
└────┬─────┘
     │
     ▼
┌──────────────┐
│  VERIFY RED  │  2. 运行测试，确认它失败了
│  确认失败     │     必须亲眼看到测试失败！
└────┬─────────┘     确认失败原因正确（功能缺失，不是语法错误）
     │
     ▼
┌──────────┐
│  GREEN   │  3. 写最少量的代码让测试通过
│  绿色阶段 │     不要多写任何功能！
└────┬─────┘     不要重构其他代码！
     │           不要"顺便改进"！
     ▼
┌────────────────┐
│  VERIFY GREEN  │  4. 运行测试，确认通过
│  确认通过       │     确认所有测试通过
└────┬───────────┘     确认没有警告和错误
     │
     ▼
┌───────────┐
│ REFACTOR  │  5. 重构（只在测试全通过时）
│  重构阶段  │     - 消除重复代码
└────┬──────┘     - 改善命名
     │            - 提取辅助函数
     │            不要添加新功能！
     ▼
  （回到 RED，继续下一个测试）
```

**示例：修复一个 Bug**

```
Bug：空邮箱被接受了

Step 1 - RED：写测试
  test('拒绝空邮箱', async () => {
    const result = await submitForm({ email: '' });
    expect(result.error).toBe('邮箱不能为空');
  });

Step 2 - VERIFY RED：运行测试
  $ npx jest
  FAIL: 期望 '邮箱不能为空', 实际得到 undefined  ← 亲眼看到失败！

Step 3 - GREEN：最小实现
  function submitForm(data: FormData) {
    if (!data.email?.trim()) {
      return { error: '邮箱不能为空' };
    }
    // ...
  }

Step 4 - VERIFY GREEN：运行测试
  $ npx jest
  PASS  ← 测试通过！

Step 5 - REFACTOR：如果需要，提取验证逻辑为通用函数
```

**常见借口 vs 真相：**

| 借口 | 真相 |
|------|------|
| "太简单了不需要测试" | 简单代码也会出错。写测试只要 30 秒。 |
| "我先写代码，后面补测试" | 后补的测试一开始就通过，证明不了任何事。 |
| "我已经手动测试过了" | 手动测试没有记录，不能重复运行。 |
| "删除已写的代码太浪费" | 沉没成本谬误。保留不可信的代码才是浪费。 |
| "TDD 太教条了，我是实用主义者" | TDD 就是实用主义：它让你在提交前发现 Bug。 |

**如果 Cline 在写测试之前写了代码 → 它必须删除代码，从头用 TDD 重来。**

---

### 第六步：代码审查（code-review）

**触发条件：** 在每个任务完成后自动触发。

**Cline 的行为：**

1. 对照实施计划检查代码
2. 检查：规格是否符合、代码风格、潜在 Bug
3. 按严重程度报告问题
4. 严重问题会阻塞下一步（必须先修复）

**你是最终审查者：** 代码提交前你可以随时检查、要求修改。

---

### 第七步：完成分支（finishing-branch）

**触发条件：** 所有任务完成后自动触发。

**Cline 的行为：**

1. 运行全部测试，确保通过
2. 提供选项：
   - 🎯 **合并到主分支** — `git merge`
   - 📤 **创建 Pull Request** — 推送到远程
   - 📦 **保留分支** — 暂时不合并
   - 🗑️ **丢弃分支** — 删除 worktree
3. 执行你选择的选项
4. 清理 worktree

---

## 技能触发规则

Superpowers 的核心规则很简单：

> **在任何操作之前，先检查是否有适用的技能。即使只有 1% 的可能性，也必须检查。**

### 技能优先级

当多个技能可能适用时：

1. **先流程技能**（brainstorming、debugging）— 这些决定"怎么做"
2. **再实现技能**（TDD、code-review）— 这些指导"做什么"

### 技能类型

- **刚性技能**（TDD、debugging）：严格遵守，不要"灵活变通"
- **柔性技能**（设计模式）：根据上下文调整，但原则不变

### 红牌警告

当 Cline 产生以下想法时，说明它在自我合理化、试图跳过流程：

| 想法 | 真实含义 |
|------|---------|
| "这只是一个简单的问题" | 问题也是任务。检查技能。 |
| "我需要先了解更多上下文" | 技能检查在提问之前。 |
| "让我先探索一下代码库" | 技能告诉你如何探索。先检查。 |
| "这个不需要这么正式" | 如果有技能存在，就用它。 |
| "我记得这个技能的内容" | 技能会更新。读取当前版本。 |
| "技能用在这里是大材小用" | 简单的事也会变复杂。用技能。 |
| "我先做这一件小事" | 在做任何事情之前先检查。 |

---

## 常见问题

### Q: 我不想用 TDD，可以跳过吗？

A: 可以。你是主人。如果你明确告诉 Cline "这个项目不需要 TDD"，Cline 会尊重你的选择。用户指令优先级高于所有技能。

### Q: Cline 和 Claude Code 使用 Superpowers 有什么区别？

A: 主要区别在于 Cline 没有子 Agent（Subagent）功能。在 Claude Code 中，执行计划时会为每个任务派发独立的子 Agent 并行工作；在 Cline 中，所有任务在当前会话中内联执行。

### Q: 计划太详细了，能不能简化？

A: 计划的详细程度是故意设计的。2-5 分钟的小任务确保每一步都可验证。如果你想简化，可以告诉 Cline 你的偏好。

### Q: 如何知道技能是否已正确加载？

A: 最简单的测试：在 Cline 中说"我们来做一个 React todo list"。如果 Cline 开始问你需求问题而不是直接写代码，就说明技能正确加载了。

### Q: 如何用 npx 一键安装？

A: 在你要使用 Superpowers 的项目目录下运行：

```bash
npx superpowers install
```

这会自动将 `skills/` 目录和 `AGENTS.md` 复制到你的项目中，还会创建 `docs/superpowers/` 目录结构。也可以指定目录：

```bash
npx superpowers install /path/to/your/project
```

### Q: 我可以在已有项目中添加 Superpowers 吗？

A: 可以。你可以用 `npx superpowers install` 一键安装，或者将 Superpowers 的 `skills/` 目录和 `AGENTS.md` 文件复制到你的项目根目录即可。Superpowers 会在你的项目上下文中工作。

### Q: 遇到问题怎么办？

A:
- **Superpowers 社区 Discord：** https://discord.gg/35wsABTejz
- **GitHub Issues：** https://github.com/obra/superpowers/issues
- **发布公告：** https://primeradiant.com/superpowers/

---

## 快速参考卡片

```
┌─────────────────────────────────────────────────────┐
│              SUPERPOWERS 快速参考                      │
├─────────────────────────────────────────────────────┤
│                                                       │
│  说"做X" → brainstorming  → 设计 → 你批准              │
│                                ↓                      │
│                          writing-plans → 计划 → 你批准  │
│                                ↓                      │
│                          executing-plans               │
│                                ↓                      │
│                    每个任务: RED → GREEN → REFACTOR    │
│                                ↓                      │
│                          code-review                   │
│                                ↓                      │
│                    全部完成 → finishing-branch         │
│                                                       │
│  铁律: 没有失败的测试 = 没有产品代码                     │
│  铁律: 任何操作前先检查是否有适用的技能                   │
│  铁律: 用户指令 > 技能规则 > 默认行为                    │
│                                                       │
└─────────────────────────────────────────────────────┘