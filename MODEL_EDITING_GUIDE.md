# 交给其他网页端大模型修改的说明

优先把整个仓库或 `source/<academy>/` 交给模型，而不是只给发布用单文件 HTML。

推荐提示词：

> 这是一个已经能运行的 Computational Materials Academy 项目。请先阅读 README、项目结构、源码、题库和测试，再修改。不要重写整个项目，不要删除现有课程、粒子首屏、黑金毛玻璃、随机练习、BINGO/WRONG、答案功能或 localStorage。专业知识修改必须先核对官方文档。保持最小改动，并在完成后运行测试，说明修改文件、原因和验证结果。

小范围视觉/文本改动可以直接修改 `linux-shell/index.html` 或 `cp2k/index.html`；大范围题库、判题器或功能修改应改 `source/`。
