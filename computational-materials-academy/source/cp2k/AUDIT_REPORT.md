# CP2K Academy 二轮审计报告

复核日期：2026-08-25

## Round 1：知识覆盖与正确性

自动数据审计结果：**21/21 项通过**（其中内容项与功能项合并在 `audit.mjs`）。单元测试：**15/15 通过**。

### 覆盖范围

- 30 个章节。
- 180 道练习，每章 6 题。
- 每道题都有：提示、**随时可点的标准答案**、答案解析、来源元数据。
- 主要内容：CP2K 输入结构、FORCE_EVAL、SUBSYS、KIND、Gaussian basis、GTH pseudopotential、GPW/GAPW、MGRID、QS/EPS_DEFAULT、XC、SCF、diagonalization、mixing、OT、smearing、UKS/AFM、DFT+U、k-points、GEO_OPT、CELL_OPT、restart、MPI/OpenMP/PBS、社区排错、VASP→CP2K 迁移。

### 时效性校正

开发过程中专门重新检查了当前 CP2K 文档，发现一个必须纠正的历史信息：

- 2025 年 CP2K Forum 中，开发者曾说明 OT 和 DFT+U 在主版本中尚未实现一般 k-points。
- **CP2K 2026.2（2026-07-15）已经新增 “DFT+U with k-points for Mulliken methods”。**
- 当前 CP2K K-Points 方法文档的兼容性表写明：标准 diagonalization 支持 k-points；OT 仍不支持；DFT+U 为有限支持，目前限 Mulliken populations。

因此课程第 23 章按 **2026.2 当前状态**编写，并把 2025 Forum 只保留为历史背景，避免用旧帖子冒充现行功能说明。

### 核心官方来源

- CP2K Input Reference: https://manual.cp2k.org/trunk/CP2K_INPUT.html
- FORCE_EVAL: https://manual.cp2k.org/trunk/CP2K_INPUT/FORCE_EVAL.html
- DFT: https://manual.cp2k.org/trunk/CP2K_INPUT/FORCE_EVAL/DFT.html
- Basis Sets: https://manual.cp2k.org/trunk/methods/dft/basis_sets.html
- Pseudopotentials: https://manual.cp2k.org/trunk/methods/dft/pseudopotentials.html
- MGRID: https://manual.cp2k.org/trunk/CP2K_INPUT/FORCE_EVAL/DFT/MGRID.html
- SCF: https://manual.cp2k.org/trunk/CP2K_INPUT/FORCE_EVAL/DFT/SCF.html
- OT: https://manual.cp2k.org/trunk/CP2K_INPUT/FORCE_EVAL/DFT/SCF/OT.html
- MIXING: https://manual.cp2k.org/trunk/CP2K_INPUT/FORCE_EVAL/DFT/SCF/MIXING.html
- SMEAR: https://manual.cp2k.org/trunk/CP2K_INPUT/FORCE_EVAL/DFT/SCF/SMEAR.html
- DFT_PLUS_U: https://manual.cp2k.org/trunk/CP2K_INPUT/FORCE_EVAL/SUBSYS/KIND/DFT_PLUS_U.html
- K-Points methods: https://manual.cp2k.org/trunk/methods/dft/k-points.html
- CP2K changelog: https://manual.cp2k.org/trunk/changelog.html
- Geometry and cell optimization: https://manual.cp2k.org/trunk/methods/optimization/geometry_and_cell_opt.html
- Restarting calculations: https://manual.cp2k.org/trunk/methods/restarting.html

### 社区真实案例类型

课程使用 CP2K Google Groups 中的真实问题做改编练习，包括：金属 SCF、transition metals、SCF oscillation、DFT+U warnings、旧版 k-point 限制、CELL_OPT noisy forces/stress、未收敛 SCF 后继续 MD 等。社区内容只作为案例，不取代当前 Manual。

### 范围声明

本课程**不声称穷尽整个 CP2K Forum 或全部 CP2K 功能**。目标是系统覆盖凝聚态 DFT、磁性、DFT+U、结构优化、HPC 与 VASP→CP2K 迁移所需的主要知识/排错模式。

## Round 2：设计与功能 QA

自动检查确认以下代码路径存在并相互连通：

- Canvas 粒子首屏：`CP2K` + `ACADEMY`，无斜杠。
- pointermove 水波式径向粒子排斥 + spring/damping 回位。
- requestAnimationFrame 动画循环。
- prefers-reduced-motion 降级。
- 首次滚动后 Hero 上移、blur、fade，workspace 渐显上滑。
- 黑金变量、glassmorphism、磨砂 sidebar。
- 左侧 30 章导航 + 搜索 + 进度。
- 单题随机练习。
- 刷新题目时清空输入/状态。
- `BINGO ✓` 正确反馈 + 820 ms 自动下一题。
- `WRONG ×` 错误反馈 + 保留当前题。
- **`查看答案` 从开始就永久可点击，不需要先答错。**
- `答案解析` 永久可点击。
- localStorage 进度恢复。
- Enter 提交。
- 单文件 HTML 构建成功。

### 自动化验证

```text
npm test
15/15 passed

node audit.mjs
21/21 audit checks passed

npm run build:single
built CP2K_Academy_VASP_Migration.html
```

### 运行时视觉验证边界

本环境中的系统 Chromium headless 因 DBus/沙箱运行限制超时，而 Playwright 未预装匹配的浏览器二进制，因此未进行自动像素截图对比。Round 2 的视觉项采用 DOM/CSS/动画代码路径审计与既有黑金组件复用验证。最终单文件可在正常桌面浏览器直接打开人工查看。
