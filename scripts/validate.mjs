import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const problems = [];
const markdown = [];
function walk(directory) {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    if (['.git', 'node_modules'].includes(entry.name)) continue;
    const full = path.join(directory, entry.name);
    if (entry.isSymbolicLink()) { problems.push(`不应发布符号链接：${path.relative(root, full)}`); continue; }
    if (entry.isDirectory()) walk(full);
    else if (entry.name.endsWith('.md')) markdown.push(full);
  }
}
walk(root);
let links = 0;
for (const filename of markdown) {
  const content = fs.readFileSync(filename, 'utf8');
  for (const match of content.matchAll(/\[[^\]]*\]\(([^)]+)\)/g)) {
    const target = match[1].replace(/^<|>$/g, '').split('#')[0];
    if (!target || target.includes('{{') || /^[a-z][a-z0-9+.-]*:/i.test(target)) continue;
    links++;
    const resolved = path.resolve(path.dirname(filename), decodeURIComponent(target));
    if (!resolved.startsWith(root + path.sep) || !fs.existsSync(resolved)) problems.push(`链接无效：${path.relative(root, filename)} -> ${target}`);
  }
  if (/\/Users\/[A-Za-z0-9_-]+\//.test(content)) problems.push(`包含个人绝对路径：${path.relative(root, filename)}`);
  if (/(?:gh[pousr]_[A-Za-z0-9]{30,}|github_pat_[A-Za-z0-9_]{30,}|-----BEGIN (?:RSA |OPENSSH )?PRIVATE KEY-----)/.test(content)) problems.push(`疑似凭据：${path.relative(root, filename)}`);
}
const skill = fs.readFileSync(path.join(root, 'SKILL.md'), 'utf8');
if (!/^---\nname: project-team-playbook\ndescription: .+\n---\n/.test(skill)) problems.push('SKILL.md 必需元数据缺失或不匹配');
if (!/^\d+\.\d+\.\d+\n?$/.test(fs.readFileSync(path.join(root, 'VERSION'), 'utf8'))) problems.push('VERSION 格式无效');
process.stdout.write(JSON.stringify({ markdown_files: markdown.length, local_links: links, problems, scope: '结构、链接和有限公开内容检查；不证明业务事实、权限隔离或协作提效。' }, null, 2) + '\n');
if (problems.length) process.exitCode = 1;
