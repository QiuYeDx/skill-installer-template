# skill-installer-template

通用 AI Skill 安装器模板。  
目标是让你只改少量配置，就能快速生成一个支持 `npx` 一键安装的 Skill Installer CLI。

---

## 能力概览

- 通过 `npx <你的包名>` 启动 CLI 安装流程
- 交互式选择安装路径：
  - 全部安装（All）
  - 当前目录
  - Cursor（项目级）
  - Cursor（全局）
  - Claude Code
  - Gemini CLI
  - Codex
- 自动检测目标路径是否已存在同名 Skill，存在则二次确认覆盖
- 支持从指定 `URL` 下载 Skill 资产 `zip`，下载后自动解压安装
- 模板化设计：换 `config` + `package.json` 即可复用

---

## 目录结构

```text
skill-installer-template/
├── package.json
├── bin/
│   └── cli.mjs
└── src/
    ├── config.mjs
    ├── install.mjs
    └── targets.mjs
```

---

## 快速开始（本地开发）

> Node 版本要求：`>=18`

1. 安装依赖

```bash
pnpm install
```

1. 运行本地 CLI

```bash
node bin/cli.mjs
```

---

## 如何把模板改成你的安装器

核心只改两处：

### 1) 修改 `src/config.mjs`

这个文件决定你要安装哪个 Skill，以及从哪里下载 zip。

```js
const config = {
  name: 'my-awesome-skill',
  displayName: 'My Awesome Skill',
  description: '一个很棒的 AI 编程助手 Skill',
  assetUrl: 'https://github.com/user/repo/archive/refs/heads/main.zip',
  stripComponents: 1,
};
```

字段说明：

- `name`：Skill 安装目录名（建议 `kebab-case`）
- `displayName`：CLI 显示标题
- `description`：CLI 副标题
- `assetUrl`：zip 压缩包下载地址（直链）
- `stripComponents`：解压时剥离目录层级
  - `0`：zip 根目录就是 Skill 文件（如 `SKILL.md`）
  - `1`：zip 外层多一层包裹目录（GitHub archive 常见）

### 2) 修改 `package.json`

- `name`：你发布到 npm 的包名
- `bin` 的 key：CLI 命令名

例如：

```json
{
  "name": "@your-scope/install-my-awesome-skill",
  "bin": {
    "install-my-awesome-skill": "./bin/cli.mjs"
  }
}
```

---

## 发布后如何使用

发布 npm 包后，用户可以直接：

```bash
npx @your-scope/install-my-awesome-skill
```

CLI 会自动进入安装流程（路径选择 -> 覆盖确认 -> 下载并安装）。

---

## 示例：做一个 Element Plus Skill 安装器

将 `src/config.mjs` 改成（示例）：

```js
const config = {
  name: 'element-plus-skill',
  displayName: 'Element Plus Skill',
  description: 'Element Plus 组件库使用与工程实践 Skill',
  assetUrl: 'https://github.com/your-org/element-plus-skill/archive/refs/heads/main.zip',
  stripComponents: 1,
};
```

再将 `package.json` 改成（示例）：

```json
{
  "name": "@your-scope/install-element-plus-skill",
  "bin": {
    "install-element-plus-skill": "./bin/cli.mjs"
  }
}
```

发布后用户执行：

```bash
npx @your-scope/install-element-plus-skill
```

---

## 安装路径映射（当前模板）

由 `src/targets.mjs` 定义，默认映射为：

- 当前目录：`<cwd>/<skillName>`
- Cursor（项目级）：`<cwd>/.cursor/skills/<skillName>`
- Cursor（全局）：`~/.cursor/skills/<skillName>`
- Claude Code：`~/.claude/skills/<skillName>`
- Gemini CLI：`~/.gemini/skills/<skillName>`
- Codex：`~/.agents/skills/<skillName>`

如需新增/删减目标平台，直接编辑 `src/targets.mjs` 的返回数组即可。

---

## 注意事项

- `assetUrl` 必须是可访问的 zip 地址
- 如果 zip 内目录层级不符合预期，优先调整 `stripComponents`
- 覆盖安装会删除目标目录后重新写入，请谨慎确认

---

## License

MIT
