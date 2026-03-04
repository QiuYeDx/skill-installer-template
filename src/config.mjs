// ╔══════════════════════════════════════════════════════════════════╗
// ║  ⬇️  修改此文件 + package.json 即可定制你自己的 Skill 安装器  ⬇️  ║
// ╚══════════════════════════════════════════════════════════════════╝
//
// 定制步骤:
//   1. 修改下方 config 中的各字段
//   2. 修改 package.json 中的 name (npm 包名) 和 bin 的 key (CLI 命令名)
//   3. pnpm install && npm publish
//   4. 用户即可通过 npx <你的包名> 一键安装 Skill
//

const config = {
  // Skill 目录名 (安装时作为文件夹名, 建议使用 kebab-case)
  name: 'my-awesome-skill',

  // 显示名称 (CLI 界面标题展示用)
  displayName: 'My Awesome Skill',

  // 简短描述 (CLI 界面副标题)
  description: '一个很棒的 AI 编程助手 Skill',

  // Skill 资产下载地址 (必须为 zip 压缩包的直链 URL)
  // 示例:
  //   GitHub Release: https://github.com/user/repo/releases/download/v1.0/skill.zip
  //   GitHub Archive: https://github.com/user/repo/archive/refs/heads/main.zip
  //   自建 CDN:      https://cdn.example.com/skills/my-skill-v1.0.zip
  assetUrl: 'https://github.com/user/repo/archive/refs/heads/main.zip',

  // zip 解压时跳过的顶层目录层数
  //   0 = zip 内直接就是 skill 文件 (SKILL.md 等)
  //   1 = zip 有一层包裹目录 (GitHub archive 默认行为: repo-branch/)
  stripComponents: 1,
};

export default config;
