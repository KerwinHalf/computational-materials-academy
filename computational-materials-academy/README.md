# Computational Materials Academy

一个面向计算材料科研的静态交互式学习平台。目前包含：

- `linux-shell/`：Linux / Shell Academy · VASP Research Edition
- `cp2k/`：CP2K Academy · VASP Migration Edition
- `source/`：两个学院的完整开发源码、题库、测试与审计文件
- `docs/`：部署和交给其他大模型修改时的操作说明

## 本地打开

直接双击根目录 `index.html` 即可进入总首页。课程页面通过相对路径跳转，因此请保持目录结构不变。

## GitHub Pages

1. 在 GitHub 新建仓库 `computational-materials-academy`。
2. 将本目录全部内容上传到仓库根目录。
3. `Settings → Pages → Build and deployment → Deploy from a branch`。
4. Branch 选择 `main`，目录选择 `/(root)`，保存。
5. 公网地址通常为：`https://<用户名>.github.io/computational-materials-academy/`。

## 学习进度

Linux 使用 `cma-linux-progress-v1`，CP2K 使用 `cma-cp2k-progress-v1`。新版会读取并迁移旧版 key，因此原有浏览器学习记录不会因为这次整合主动丢失。

## 修改课程

长期修改请优先编辑 `source/linux-shell/` 或 `source/cp2k/`，运行各自测试后重新生成单文件，再覆盖发布目录的 `index.html`。不要把两万行单文件 HTML 当成首选开发源文件，那属于主动增加痛苦。
