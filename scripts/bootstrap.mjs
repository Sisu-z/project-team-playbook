import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseArgs } from 'node:util';
import { homedir } from 'node:os';

const guideRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const repository = 'https://github.com/Sisu-z/project-team-playbook';
const files = ['AGENTS.md', 'PROJECT.md', '.github/ISSUE_TEMPLATE/task.md', '.github/pull_request_template.md'];

function refuseSymlink(candidate) {
  if (fs.existsSync(candidate) || fs.lstatSync(candidate, { throwIfNoEntry: false })) {
    if (fs.lstatSync(candidate).isSymbolicLink()) throw new Error(`拒绝符号链接目标：${candidate}`);
  }
}

function physicalDestination(candidate) {
  const missing = [];
  let ancestor = candidate;
  while (!fs.existsSync(ancestor)) {
    refuseSymlink(ancestor);
    const parent = path.dirname(ancestor);
    if (parent === ancestor) throw new Error('无法解析目标目录');
    missing.unshift(path.basename(ancestor));
    ancestor = parent;
  }
  return path.join(fs.realpathSync(ancestor), ...missing);
}

function main() {
  const { values } = parseArgs({ options: {
    target: { type: 'string' }, name: { type: 'string' }, repo: { type: 'string' },
    'guide-ref': { type: 'string' }, apply: { type: 'boolean', default: false }, help: { type: 'boolean' },
  } });
  if (values.help) {
    process.stdout.write('用法：node scripts/bootstrap.mjs --target /绝对/项目路径 --name 项目名 [--repo OWNER/REPO] [--guide-ref 版本] [--apply]\n默认只预览；--apply 生成四个文件，不覆盖，不创建远端仓库，不安装依赖。\n');
    return;
  }
  if (!values.target || !path.isAbsolute(values.target)) throw new Error('--target 必须是业务项目的绝对路径');
  const target = path.resolve(values.target);
  if (target === path.parse(target).root || target === homedir()) throw new Error('请指定具体业务项目目录');
  if (target === guideRoot || target.startsWith(guideRoot + path.sep)) throw new Error('业务项目不能创建在指南仓库内');
  const name = values.name?.trim();
  if (!name || /[\r\n\x00-\x1f]/.test(name) || name.length > 120) throw new Error('--name 必须是单行项目名称（1 至 120 字符）');
  const ref = values['guide-ref'] ?? `v${fs.readFileSync(path.join(guideRoot, 'VERSION'), 'utf8').trim()}`;
  if (!/^[A-Za-z0-9][A-Za-z0-9._-]{0,127}$/.test(ref)) throw new Error('--guide-ref 使用提交 SHA 或简单版本标签');
  if (values.repo && !/^[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+$/.test(values.repo)) throw new Error('--repo 格式应为 OWNER/REPO');
  refuseSymlink(target);
  if (fs.existsSync(target) && !fs.statSync(target).isDirectory()) throw new Error('目标不是目录');
  const physicalTarget = physicalDestination(target);
  const physicalGuide = fs.realpathSync(guideRoot);
  if (physicalTarget === physicalGuide || physicalTarget.startsWith(physicalGuide + path.sep)) throw new Error('业务项目不能通过路径别名创建在指南仓库内');
  if (physicalTarget === fs.realpathSync(homedir()) || physicalTarget === path.parse(physicalTarget).root) throw new Error('请指定具体业务项目目录');
  const replacements = {
    PROJECT_NAME: name,
    GUIDE_REF: ref,
    GUIDE_URL: `${repository}/blob/${ref}/START_HERE.md`,
    REGISTRY_URL: `${repository}/tree/main/registry`,
    TASK_SOURCE: values.repo ? `https://github.com/${values.repo}/issues` : 'tasks/（本地唯一任务源；接入 GitHub 后迁移并停止双写）',
  };
  const plan = files.map(relative => {
    const destination = path.join(target, relative);
    for (let cursor = destination; cursor !== target; cursor = path.dirname(cursor)) {
      refuseSymlink(cursor);
      if (cursor !== destination && fs.existsSync(cursor) && !fs.statSync(cursor).isDirectory()) throw new Error(`目标父级不是目录：${cursor}`);
    }
    if (fs.existsSync(destination)) throw new Error(`拒绝覆盖已有文件：${destination}；请总监选择性整合现有项目`);
    let content = fs.readFileSync(path.join(guideRoot, 'templates/project', relative), 'utf8');
    content = content.replace(/\{\{([A-Z_]+)\}\}/g, (_, key) => {
      if (!(key in replacements)) throw new Error(`未知模板字段：${key}`);
      return replacements[key];
    });
    return { relative, destination, content };
  });
  if (values.apply) {
    for (const item of plan) {
      fs.mkdirSync(path.dirname(item.destination), { recursive: true });
      fs.writeFileSync(item.destination, item.content, { flag: 'wx' });
    }
  }
  process.stdout.write(JSON.stringify({ mode: values.apply ? 'applied' : 'preview', target, guide_ref: ref, files: plan.map(p => p.relative), note: '只生成模板；项目目标、架构、权限与验证由总监据实维护。' }, null, 2) + '\n');
}

try { main(); } catch (error) { process.stderr.write(`未完成：${error.message}\n`); process.exitCode = 1; }
