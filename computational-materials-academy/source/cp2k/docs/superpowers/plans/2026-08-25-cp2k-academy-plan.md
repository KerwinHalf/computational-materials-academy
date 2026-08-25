# CP2K Academy Implementation Plan

**Goal:** 交付可双击打开的 CP2K 交互式 Academy 与完整源码。

**Architecture:** 数据、判题、粒子、应用状态分离；Node test 验证数据完整性和语义判题；单文件构建器用于用户直接使用。

**Tasks:**
1. 测试先行：validator/data/static requirements。
2. 构建 30 章、180 题、官方/社区来源元数据。
3. 实现 CP2K section parser 与安全判题。
4. 实现黑金课程 UI、随机题、BINGO/WRONG、永久答案按钮、localStorage。
5. 实现 Canvas 粒子和滚动动画。
6. 按 2026.2 Manual/Changelog 更新 k-point/DFT+U 兼容信息。
7. 构建单文件 HTML。
8. 运行测试和两轮 audit，生成 README/AUDIT/PROMPT。
