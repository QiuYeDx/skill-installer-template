import { homedir } from 'node:os';
import { join } from 'node:path';

/**
 * 定义所有支持的安装目标路径。
 * 如需增删目标 (如新增 Windsurf 等), 在此数组中添加/移除即可。
 */
export function getTargets(skillName) {
  const home = homedir();
  const cwd = process.cwd();

  return [
    {
      id: 'current',
      label: '📂 当前目录',
      path: join(cwd, skillName),
    },
    {
      id: 'cursor-project',
      label: '📁 Cursor (项目级)',
      path: join(cwd, '.cursor', 'skills', skillName),
    },
    {
      id: 'cursor-global',
      label: '🌐 Cursor (全局)',
      path: join(home, '.cursor', 'skills', skillName),
    },
    {
      id: 'claude-code',
      label: '🤖 Claude Code',
      path: join(home, '.claude', 'skills', skillName),
    },
    {
      id: 'gemini-cli',
      label: '💎 Gemini CLI',
      path: join(home, '.gemini', 'skills', skillName),
    },
    {
      id: 'codex',
      label: '📦 Codex',
      path: join(home, '.agents', 'skills', skillName),
    },
  ];
}
