# GitHub Pages 发布指南

## 推荐仓库结构

```text
computational-materials-academy/
├── index.html
├── linux-shell/index.html
├── cp2k/index.html
├── source/
├── docs/
└── README.md
```

## 发布

GitHub 仓库 → Settings → Pages → Deploy from a branch → `main` → `/(root)` → Save。

使用相对链接 `./linux-shell/` 和 `./cp2k/`，因此无论仓库用户名是什么都不需要改网址。

## 更新

修改后提交到 `main`。GitHub Pages 会重新部署。建议 commit 信息描述真实变化，例如：

```text
feat: add detailed shell answer explanations
fix: accept equivalent grep flag order
content: add CP2K SCF exercises
```
