# Yang's Blog

个人技术博客仓库。站点用于记录学习过程、整理结构化笔记，并分享工程实践。

**在线地址：** [https://blog.ywenrou.com](https://blog.ywenrou.com)  
**作者：** [ShwnYANG](https://github.com/ShwnYANG)

## 博客介绍

我喜欢把专业方向和兴趣结合在一起，持续学习新的技术。希望通过这个站点分享学习心得和工程经验，也方便自己日后检索。

当前主要内容包括：

- **后端开发**：Java、Spring Boot / Spring Cloud、中间件、源码阅读
- **Android 开发**：应用开发与 Framework
- **密码学与安全**：现代密码学、同态加密、隐私计算
- **机器学习**：传统机器学习与联邦学习笔记
- **命令手册**：Git、Linux、Docker、Shell 等常用命令整理

座右铭：**尽人事，听天命。**

## 主题

本站基于 [VitePress](https://github.com/vuejs/vitepress) 构建，使用 Vue 3 编写自定义主题组件。站点配置位于 `docs/.vitepress/`，内容以 Markdown 编写在 `docs/` 目录中。

## 本地运行

```bash
yarn install
yarn dev
```

生产构建：

```bash
yarn build
```

站点部署在 Vercel。文档源文件位于 `docs/`。

## Fork 配置

Fork 后只需要修改 [`docs/.vitepress/site.config.ts`](docs/.vitepress/site.config.ts)，即可更新站点名称、作者头像、昵称、简介、建站日期和 GitHub/Email 链接。头像文件放在 `docs/public/img/`，然后将 `author.avatar` 改为对应的 `/img/文件名` 路径。

新增栏目时，在 `sections` 中增加一项，并准备对应的文章目录和目录页：

```ts
{
  id: 'go',
  link: '/go/',
  navTitle: 'Go开发',
  title: 'Go 服务端开发',
  description: 'Go 语言与云原生实践笔记。',
  icon: '/img/go.png',
  accent: '#14b8a6'
}
```

然后新建一个目录页（例如 `docs/00.目录页/06.Go.md`），内容写入 `<Catalogue track="go" />`，再创建 `docs/07.Go开发/` 放入文章。系统会自动生成导航项、栏目侧边栏、首页栏目卡片、文章统计和文章列表中的栏目标签，并扫描该目录下的所有子目录和文章。

## 许可证

仓库代码遵循 MIT License。
