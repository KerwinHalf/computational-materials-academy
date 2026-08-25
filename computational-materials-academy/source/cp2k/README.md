# CP2K Academy · VASP Migration Edition

面向凝聚态、磁性、DFT+U、结构优化和 HPC 的交互式 CP2K 学习网站。

## 最简单的使用方法

直接双击：

`CP2K_Academy_VASP_Migration.html`

这是完全自包含的单文件版，不依赖服务器，不会执行任何 CP2K 或 Shell 命令。

## 训练规则

- 左侧选择章节。
- 每章右侧都有知识讲解和随机练习。
- 输入 CP2K 关键词或 section 后按 Enter / RUN CHECK。
- 正确显示 `BINGO ✓`，约 0.82 秒自动进入下一题。
- 错误显示 `WRONG ×`，题目保持不变。
- **“查看答案”从第一秒开始一直可点**，不会记错，也不会自动换题。
- “答案解析”解释为什么这样写。
- 随机刷新会清空当前输入和判题状态。
- 进度保存在浏览器 localStorage。

## 内容范围

30 章、180 题，覆盖：CP2K 输入结构、GPW/GAPW、Gaussian basis、GTH pseudopotential、MGRID、SCF、diagonalization、mixing、OT、smearing、UKS/AFM、DFT+U、k-points、GEO_OPT、CELL_OPT、restart、HPC、真实社区排错和 VASP→CP2K 迁移。

特别注意：课程按 2026-08-25 复核。CP2K 2026.2 已新增 **DFT+U with k-points for Mulliken methods**；OT 一般 k-point 路径仍不支持。旧论坛帖子会作为历史案例而不是当前功能结论。

## 开发/测试

```bash
npm test
npm run build:single
```
