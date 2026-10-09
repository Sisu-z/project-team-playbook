import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const guide = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const script = path.join(guide, 'scripts/bootstrap.mjs');
function fixture(t) {
  const base = fs.mkdtempSync(path.join(os.tmpdir(), 'project-team-bootstrap-test-'));
  t.after(() => {
    assert.ok(path.basename(base).startsWith('project-team-bootstrap-test-'));
    fs.rmSync(base, { recursive: true, force: false });
  });
  return base;
}
function run(target, args = []) {
  return spawnSync(process.execPath, [script, '--target', target, '--name', '离线资料工具', ...args], { encoding: 'utf8' });
}

test('默认预览不创建目录', t => {
  const target = path.join(fixture(t), 'business');
  const result = run(target);
  assert.equal(result.status, 0, result.stderr);
  assert.equal(JSON.parse(result.stdout).mode, 'preview');
  assert.equal(fs.existsSync(target), false);
});

test('生成最小文件并固定指南版本，已有无关文件保持不变', t => {
  const target = fixture(t);
  fs.writeFileSync(path.join(target, 'notes.txt'), 'existing');
  const result = run(target, ['--apply', '--repo', 'example/book-tool', '--guide-ref', 'v0.1.0']);
  assert.equal(result.status, 0, result.stderr);
  const data = JSON.parse(result.stdout);
  assert.equal(data.files.length, 4);
  const project = fs.readFileSync(path.join(target, 'PROJECT.md'), 'utf8');
  assert.ok(project.includes('https://github.com/example/book-tool/issues'));
  assert.ok(project.includes('/blob/v0.1.0/START_HERE.md'));
  assert.ok(!project.includes('{{'));
  assert.equal(fs.readFileSync(path.join(target, 'notes.txt'), 'utf8'), 'existing');
});

test('任一文件冲突先拒绝，不能部分覆盖', t => {
  const target = fixture(t);
  fs.writeFileSync(path.join(target, 'PROJECT.md'), 'keep me');
  const result = run(target, ['--apply']);
  assert.notEqual(result.status, 0);
  assert.equal(fs.existsSync(path.join(target, 'AGENTS.md')), false);
  assert.equal(fs.readFileSync(path.join(target, 'PROJECT.md'), 'utf8'), 'keep me');
});

test('拒绝目标内符号链接，不向外部目录写入', t => {
  const base = fixture(t);
  const target = path.join(base, 'business');
  const other = path.join(base, 'other');
  fs.mkdirSync(target); fs.mkdirSync(other);
  fs.symlinkSync(other, path.join(target, '.github'), 'dir');
  const result = run(target, ['--apply']);
  assert.notEqual(result.status, 0);
  assert.deepEqual(fs.readdirSync(other), []);
  assert.equal(fs.existsSync(path.join(target, 'AGENTS.md')), false);
});

test('没有远端仓库时仅指定单一本地任务源', t => {
  const target = path.join(fixture(t), 'local-project');
  const result = run(target, ['--apply']);
  assert.equal(result.status, 0, result.stderr);
  assert.ok(fs.readFileSync(path.join(target, 'PROJECT.md'), 'utf8').includes('tasks/（本地唯一任务源'));
  assert.equal(fs.existsSync(path.join(target, '.git')), false);
});

test('拒绝换行项目名称和无效远端参数', t => {
  const base = fixture(t);
  assert.notEqual(run(path.join(base, 'a'), ['--name', 'unsafe\nname', '--apply']).status, 0);
  assert.notEqual(run(path.join(base, 'b'), ['--repo', '../../bad', '--apply']).status, 0);
  assert.notEqual(run(path.join(base, 'c'), ['--guide-ref', '../main', '--apply']).status, 0);
  assert.deepEqual(fs.readdirSync(base), []);
});

test('拒绝把指南本身当业务项目', () => {
  const result = run(guide, ['--apply']);
  assert.notEqual(result.status, 0);
  assert.ok(result.stderr.includes('指南仓库'));
});

test('目标根是符号链接时拒绝', t => {
  const base = fixture(t);
  const other = path.join(base, 'other');
  const target = path.join(base, 'business');
  fs.mkdirSync(other); fs.symlinkSync(other, target, 'dir');
  const result = run(target, ['--apply']);
  assert.notEqual(result.status, 0);
  assert.deepEqual(fs.readdirSync(other), []);
});

test('祖先路径别名不能绕过指南仓库边界', t => {
  const base = fixture(t);
  const alias = path.join(base, 'guide-alias');
  fs.symlinkSync(guide, alias, 'dir');
  const child = `boundary-test-${path.basename(base)}`;
  const result = run(path.join(alias, child), ['--apply']);
  assert.notEqual(result.status, 0);
  assert.ok(result.stderr.includes('路径别名'));
  assert.equal(fs.existsSync(path.join(guide, child)), false);
});

test('普通业务目录的祖先别名仍可用', t => {
  const base = fixture(t);
  const actual = path.join(base, 'actual');
  const alias = path.join(base, 'business-alias');
  fs.mkdirSync(actual); fs.symlinkSync(actual, alias, 'dir');
  const result = run(path.join(alias, 'project'), ['--apply']);
  assert.equal(result.status, 0, result.stderr);
  assert.ok(fs.existsSync(path.join(actual, 'project', 'PROJECT.md')));
});
