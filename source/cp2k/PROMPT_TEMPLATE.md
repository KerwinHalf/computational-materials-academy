# 科研计算交互式 Academy 网页生成提示词

请设计并实现一个“科研计算交互式教学网站”。教学主题为：【填写 CP2K / VASP / Linux Shell / Wannier90 / Quantum ESPRESSO 等】。

## 1. 核心目标

网站不是普通文档，也不是 UI mockup，而是一个长期训练研究生科研计算能力的交互式 Academy。教学必须解释：

1. 参数/命令是什么；
2. 为什么这样设置；
3. 它处于哪个 section / 工作流层级；
4. 什么情况下应该使用；
5. 什么情况下不应该使用；
6. 常见错误；
7. 如何从输出判断是否正常；
8. 遇到异常如何按证据排查；
9. 官方文档如何定义；
10. 官方社区真实用户出现过什么问题。

## 2. 资料规则

优先检索并交叉核对：官方 Manual / Wiki、官方 Methods/How-to、官方 Tutorial、官方 Changelog、官方 GitHub/测试例、官方 Forum / mailing list。

规则：
- 核心定义以当前版本官方文档为最高优先级。
- “不支持/新增支持”之类结论必须检查当前版本 changelog，不能只引用旧论坛。
- 社区案例只用于真实故障模式和开发者补充解释。
- 普通用户经验不能冒充官方结论。
- 每个专业章节保留 `Source / Why this matters / Last reviewed`。
- 不宣称穷尽整个社区，只宣称系统覆盖目标科研工作流的主要模式。

## 3. 课程结构

建立 25–35 个循序渐进章节：基础概念 → 输入结构 → 数值参数 → 电子算法 → 磁性/高级方法 → 优化 → 输出 → restart → HPC → 真实排错 → 完整科研案例。

每章必须包含：Learning Goal、Concept、Syntax Anatomy、3–6 个例子、Common Mistake、Research Habit、官方/社区案例、Mini Recap、配套题库。

## 4. 练习系统

- 每章独立题库，总题数不少于 180。
- 一次只显示 1 道题。
- 随机刷新按钮会换题并清空输入/判题状态。
- 输入答案后 Enter 或 RUN/CHECK 判题。
- 正确：`BINGO ✓` + 轻微金色粒子反馈，约 800 ms 自动下一题。
- 错误：`WRONG ×`，保留题目和输入。
- **“查看答案”必须从题目出现起永久可点击，不得要求先答错。点击只展示标准答案，不计错、不换题。**
- “提示”和“答案解析”也永久可用；解析必须教知识而非只抛答案。

## 5. 判题系统

绝不能真实执行 Shell/科研软件命令。只做安全字符串、语法、section 树或 AST 语义判断。

对于 section 型输入：
- 忽略无意义空格/缩进/大小写差异；
- 允许合理的等价写法；
- 必要关键词必须存在；
- 关键词必须位于正确 section；
- 值与单位必须正确；
- 明确不兼容的组合必须判错。

## 6. 视觉

高级黑金科研风：深黑/炭黑背景，antique gold/champagne gold/warm brass 点缀。所有框架使用半透明深色 glassmorphism：`backdrop-filter: blur(...)`、细金边、内高光、柔和阴影。左侧目录比右侧更磨砂。

## 7. 粒子首屏

打开网页先显示全屏 Canvas 粒子 Hero，粒子拼出巨大课程名，例如：

`CP2K`
`ACADEMY`

不要无意义斜杠。

鼠标靠近文字时，邻近粒子产生径向水波式排斥并通过 spring+damping 回位。用 requestAnimationFrame，并支持 prefers-reduced-motion。

## 8. 滚动动画

首次滚轮下滑后：Hero 上移、blur、scale down、fade；左目录与右知识/练习区域从下方渐显上滑。不能突然切换。

## 9. 主界面

左侧：课程目录、章节编号、进度、搜索、整体完成率、Coverage & Sources。

右侧：章节知识卡、代码块、案例、练习题、黑色 Terminal/Input Lab。

Terminal 必须显示 `SAFE PARSER / NO EXECUTION`。

## 10. 学习记录

localStorage 保存：已答对题、正确数、尝试数、章节正确率、连续答对、最后章节。无需账号和数据库。

## 11. 内容架构

不要把所有代码和数据塞进一个巨型 App。至少拆分：

- `src/data.*`
- `src/validator.*`
- `src/hero.*`
- `src/app.*`
- `styles.css`
- `tests/`

同时构建可双击运行的自包含单文件 HTML。

## 12. 二轮验收

Round 1 内容审计：章节数量、题量、答案/解析完整性、当前版本官方资料一致性、社区案例时效性、重要方法覆盖、来源元数据、版本变更检查。

Round 2 功能/视觉审计：粒子、鼠标水波、滚动渐隐/渐显、黑金毛玻璃、目录、随机题、BINGO、WRONG、永久查看答案、解析、自动下一题、localStorage、Enter、reduced motion、响应式。

最终必须交付：
1. 可直接双击的单文件 HTML；
2. 完整源码 ZIP；
3. README；
4. AUDIT_REPORT；
5. 本提示词文件；
6. 课程来源/覆盖说明。
