import { select, confirm } from '@inquirer/prompts';
import chalk from 'chalk';
import ora from 'ora';
import AdmZip from 'adm-zip';
import { existsSync, mkdirSync, writeFileSync, rmSync } from 'node:fs';
import { join, dirname } from 'node:path';

import config from './config.mjs';
import { getTargets } from './targets.mjs';

const IGNORED_ENTRIES = new Set(['.DS_Store', 'Thumbs.db', '__MACOSX']);

// ─── Banner ──────────────────────────────────────────────────

function printBanner() {
  console.log();
  console.log(chalk.cyan.bold(`  🚀 ${config.displayName} 安装器`));
  console.log(chalk.dim(`     ${config.description}`));
  console.log(chalk.dim(`     ${'─'.repeat(40)}`));
  console.log();
}

// ─── Download ────────────────────────────────────────────────

async function downloadZip(url) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 120_000);

  try {
    const res = await fetch(url, {
      redirect: 'follow',
      signal: controller.signal,
    });
    if (!res.ok) {
      throw new Error(`HTTP ${res.status} ${res.statusText}`);
    }
    return Buffer.from(await res.arrayBuffer());
  } catch (err) {
    if (err.name === 'AbortError') {
      throw new Error('下载超时 (120s), 请检查网络连接');
    }
    throw new Error(`下载失败: ${err.message}`);
  } finally {
    clearTimeout(timeout);
  }
}

// ─── Extract ─────────────────────────────────────────────────

function extractZip(zipBuffer, targetPath, stripComponents = 0) {
  if (existsSync(targetPath)) {
    rmSync(targetPath, { recursive: true, force: true });
  }

  const zip = new AdmZip(zipBuffer);

  for (const entry of zip.getEntries()) {
    if (entry.isDirectory) continue;

    const parts = entry.entryName.split('/');

    if (parts.some((p) => IGNORED_ENTRIES.has(p))) continue;

    if (parts.length <= stripComponents) continue;
    const relativePath = parts.slice(stripComponents).join('/');
    if (!relativePath) continue;

    const fullPath = join(targetPath, relativePath);
    mkdirSync(dirname(fullPath), { recursive: true });
    writeFileSync(fullPath, entry.getData());
  }
}

// ─── CLI Flow ────────────────────────────────────────────────

export async function main() {
  printBanner();

  const targets = getTargets(config.name);

  // 1) 选择安装目标
  const targetId = await select({
    message: chalk.bold('请选择安装路径:'),
    choices: [
      {
        value: 'all',
        name: `${chalk.yellow('✨')} 全部安装 ${chalk.dim(`(${targets.length} 个路径)`)}`,
      },
      ...targets.map((t) => ({
        value: t.id,
        name: `${t.label}  ${chalk.dim(t.path)}`,
      })),
    ],
  });

  const selectedTargets =
    targetId === 'all' ? targets : targets.filter((t) => t.id === targetId);

  // 2) 检查已有安装
  const existingTargets = selectedTargets.filter((t) => existsSync(t.path));

  if (existingTargets.length > 0) {
    console.log();
    console.log(chalk.yellow('  ⚠️  以下路径已存在该 Skill:'));
    for (const t of existingTargets) {
      console.log(chalk.yellow(`     • ${t.label}`) + chalk.dim(` ${t.path}`));
    }
    console.log();

    const overwrite = await confirm({
      message: '是否覆盖安装 (可能包含版本更新)?',
      default: false,
    });

    if (!overwrite) {
      console.log(chalk.dim('\n  已取消安装。\n'));
      return;
    }
  }

  // 3) 下载并安装
  console.log();
  const spinner = ora({ text: '正在下载资产包...', color: 'cyan' }).start();

  const zipBuffer = await downloadZip(config.assetUrl);

  for (let i = 0; i < selectedTargets.length; i++) {
    const target = selectedTargets[i];
    spinner.text = `[${i + 1}/${selectedTargets.length}] 正在安装到 ${target.label}...`;
    extractZip(zipBuffer, target.path, config.stripComponents);
  }

  spinner.succeed(chalk.green('安装完成!'));

  // 4) 展示结果
  console.log();
  console.log(chalk.bold('  已安装到:'));
  for (const t of selectedTargets) {
    console.log(chalk.green(`    ✓ ${t.label}`) + chalk.dim(` → ${t.path}`));
  }
  console.log();
}
