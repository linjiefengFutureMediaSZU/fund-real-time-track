---
name: Git Commit Helper
description: 确保 Git 提交信息符合约定式提交规范 (Conventional Commits)。 Invoke when 用户正在提交代码、需要生成 Commit Message 或询问提交规范时。
---

# Git Commit Helper

## Description
协助用户生成符合 Conventional Commits 规范的提交信息，并检查提交格式。

## When to use
- 用户准备提交代码时 (git commit)
- 用户询问如何写提交信息时
- 需要根据变更自动生成提交信息时

## Commit Message Format
```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types
- **feat**: 新功能 (feature)
- **fix**: 修补 bug
- **docs**: 文档 (documentation)
- **style**: 格式 (不影响代码运行的变动)
- **refactor**: 重构 (即不是新增功能，也不是修改 bug 的代码变动)
- **perf**: 性能优化
- **test**: 增加测试
- **chore**: 构建过程或辅助工具的变动
- **revert**: 回滚
- **build**: 打包

### Rules
1. **Subject**: 简短描述变更 (50字符以内)，使用祈使句，结尾不加句号。
2. **Body**: 详细描述变更动机和与之前行为的对比 (可选)。
3. **Footer**: 追踪 Breaking Changes 或关闭的 Issues (可选)。

## Instructions
1. 分析用户的代码变更 (git diff)。
2. 确定变更类型 (Type) 和影响范围 (Scope)。
3. 生成简洁明确的 Subject。
4. 如果变更复杂，生成详细的 Body。
5. 输出完整的 Commit Message 代码块。
