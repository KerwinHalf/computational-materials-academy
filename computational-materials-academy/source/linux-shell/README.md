# Linux / Shell Academy · VASP Research Edition

面向科研/HPC/VASP 工作流的 Linux/Shell 交互训练网站。

## 最简单的使用方式

直接双击根目录里的：

`Linux_Shell_Academy_VASP.html`

这是完整单文件版本，不需要安装 Node、React 或任何依赖。

## 开发版

项目源码采用 ES module 拆分：

- `src/data.mjs`：30 章课程、180 道题、VASP 来源元数据
- `src/validator.mjs`：安全语法判题器
- `src/explainer.mjs`：答案逐段详解词典与命令执行流程解释器
- `src/hero.mjs`：Canvas 粒子标题、水波排斥与回弹
- `src/app.mjs`：章节导航、练习终端、BINGO/WRONG、自动下一题、localStorage
- `styles.css`：黑金渐变、毛玻璃、响应式界面
- `tests/*.test.mjs`：判题与数据完整性测试

如果电脑有 Node.js，可运行：

```bash
npm test
npx http-server . -p 8080
```

也可以用 Python：

```bash
python -m http.server 8080
```

然后打开 `http://localhost:8080/`。

## 内容来源原则

VASP 专项内容使用 VASP Wiki、VASP Tutorials 与 VASP Forum 类型案例作为依据，并在页面题目来源区展示。社区持续更新，因此本课程明确不声称穷尽所有 Forum 帖子，只覆盖与 Linux/Shell/HPC/VASP 工作流直接相关的主要模式。

## 答案教学模式

每道练习都可随时点击 **查看答案** 和 **逐段详解**。逐段详解会解释命令名的英文含义/来源、选项、参数、管道与重定向，并给出整句执行流程、本题记忆点和易混淆字符（例如 `wc -l` 中的小写 `l` 与数字 `1`）。查看答案不会计错。
