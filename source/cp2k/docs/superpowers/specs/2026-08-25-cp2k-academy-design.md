# CP2K Academy Design

目标：构建一个中文 CP2K 交互式科研训练网站，以 transferable CP2K knowledge 为主体，以 VASP 迁移、磁性材料、DFT+U、HPC 和真实 Forum 排错为实战上下文。

架构：模块化静态 Web App。`data.mjs` 保存课程/题库/来源；`validator.mjs` 安全解析 CP2K section/keyword，不执行计算；`hero.mjs` 负责 Canvas 粒子；`app.mjs` 负责章节、随机练习、判题、答案、进度和审计界面。另构建自包含单文件 HTML。

关键 UX：黑金毛玻璃；粒子 CP2K/ACADEMY；滚动后工作区渐显；30 章；180 题；BINGO/WRONG；答对自动下一题；答案和解析从题目出现起永久可见；localStorage。

正确性：核心定义优先当前 CP2K Manual/Methods/Changelog；Forum 只做真实案例。功能兼容性必须按当前版本核对，不能复用旧帖子结论。
