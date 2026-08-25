# Computational Materials Academy Integration Audit

## Round 1 · 结构与数据

- 根首页提供 Linux / Shell 与 CP2K 两个正式入口。
- 两个学院仍使用独立发布目录，不互相耦合课程代码。
- Linux / Shell 与 CP2K 学习记录使用不同 `cma-*` localStorage key。
- 两个学院都保留旧 key 读取与迁移逻辑。
- `source/` 保留完整开发源码，不要求以后直接维护巨型单文件 HTML。

## Round 2 · 导航与视觉

- 总首页使用黑金、毛玻璃、粒子标题及鼠标水波排斥效果。
- 子学院加入固定 `← CMA` 返回入口。
- 总首页使用相对路径，适合 GitHub Pages 仓库子路径。
- 首页能读取两个课程的本地答题进度并显示进度条。
- 移动端与 reduced-motion 有降级样式。
