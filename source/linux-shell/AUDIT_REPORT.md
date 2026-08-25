# 二轮检查报告

复核日期：2026-08-25

## Round 1：知识覆盖与正确性

- 30/30 章节存在。
- 每章包含：概念、语法骨架、3+ 示例、常见错误、科研习惯、小结、6 道练习。
- 题目总数：180。
- PBS/VASP 实战章节带来源元数据。
- 已依据 VASP 官方资料复核：
  - VASP Tutorials：基础终端命令 `ls/cd/rm/cp/pwd/bash`，并提及 `tail -f/cat/vim`。
  - Output files / Output：OUTCAR、OSZICAR、CHGCAR、WAVECAR、CONTCAR 等职责。
  - CHGCAR：可用于重启，静态/弛豫计算最后迭代的 CHGCAR 可用于后续准确 band 计算。
  - Band-structure calculation using DFT：先 SCF，再复制 INCAR/POSCAR/POTCAR/CHGCAR，随后 `ICHARG=11` 固定电荷；d 电子体系 `LMAXMIX=4`。
  - LMAXMIX：DFT+U d 电子 fixed-density/band 情形需要 4。
  - Chester 2019：PBS `qsub`、`PBS_O_WORKDIR` 和 VASP HPC 作业脚本案例。
- Forum 报错题仅将 EDDDAV/ZHEGV/BRMIX/non-hermitian/BAD TERMINATION/killed 作为“线索分类”，不把单一关键词写成确定根因。
- 自动测试：12/12 PASS。

## Round 2：设计与交互

- Canvas 粒子组成 LINUX / SHELL 巨型字样。
- 鼠标靠近产生径向排斥/波动，粒子用弹簧阻尼回位。
- 首次向下滚动后 Hero 上移、模糊、渐隐，工作区上滑渐显。
- 黑色/金色渐变、毛玻璃边框、磨砂目录已实现。
- 左侧目录固定、可搜索、章节进度可见。
- 每次仅显示 1 道题，刷新随机换题并清空输入。
- 正确：BINGO + 粒子反馈 + 约 820ms 自动下一题。
- 错误：WRONG，留在原题，保留输入；错误次数达到 2 后开放答案解释。
- Enter 提交；Shift+Enter 可保留换行。
- localStorage 保存章节、正确数、尝试数、连续正确和已解题。
- `prefers-reduced-motion` 下关闭重动画。
- 判题器不执行任何真实 Shell 命令，并拦截广泛破坏性删除。


## 2026-08-25 Answer Explainer 增量审计

- 新增永久可用的“查看答案”按钮。
- 新增永久可用的“逐段详解”按钮。
- 通用解释器覆盖常用 Shell 命令、选项、管道、重定向、变量赋值与 `$(...)`。
- 未命中的命令/选项仍会显示通用解释，不会静默遗漏 token。
- 对 `wc -l` 显式提示：`l` 是 line 的小写 L，不是数字 1。
- 新增执行流程、本题要记住、易混淆字符/陷阱区域。
- 新增 5 个针对答案解释器和 UI 控件的自动测试。
