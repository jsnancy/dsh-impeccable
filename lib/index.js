// dsh-impeccable · Host 半边
//
// 把 impeccable 的确定性检测引擎包成一个本地 HTTP 网关，供浏览器半边（左侧栏面板）调用：
//   GET  /impeccable/api/catalog   技能版本、引擎版本、24 条命令、62 条规则
//   POST /impeccable/api/detect    对一个路径或网址跑一趟 62 条规则，回 findings
//
// 引擎与技能都装在用户家目录：
//   ~/.dsh/skills/impeccable          技能（SKILL.md + reference/ + scripts/）
//   ~/.impeccable/bin/<version>/impeccable  自包含二进制（npx impeccable install 首次运行下载）
// 环境变量 IMPECCABLE_BIN 可以指向一个预装二进制来覆盖发现逻辑。
import { execFile } from 'node:child_process'
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs'
import { homedir } from 'node:os'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { promisify } from 'node:util'
import { CATEGORY_ZH, COMMAND_ZH, RULE_ZH } from './zh.js'

const run = promisify(execFile)

const BASE = '/impeccable'
const HOME = homedir()
const BIN_ROOT = join(HOME, '.impeccable', 'bin')

// 插件自带的技能副本（装完即用），和用户自己 npx impeccable install 装的那份。
// 用户手动装过就优先用用户的（可能是更新版本），否则用包内自带的。
const PKG_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const BUNDLED_SKILL_DIR = join(PKG_ROOT, 'skill')
const USER_SKILL_DIR = join(HOME, '.dsh', 'skills', 'impeccable')

function resolveSkillDir() {
  if (existsSync(join(USER_SKILL_DIR, 'SKILL.md'))) return { dir: USER_SKILL_DIR, source: 'user' }
  if (existsSync(join(BUNDLED_SKILL_DIR, 'SKILL.md'))) return { dir: BUNDLED_SKILL_DIR, source: 'bundled' }
  return null
}

export const name = 'impeccable'
export const inject = ['webServer']

// ---------------------------------------------------------------------------
// 引擎与技能发现
// ---------------------------------------------------------------------------

function compareVersions(a, b) {
  const pa = a.split(/[.-]/).map((part) => Number.parseInt(part, 10) || 0)
  const pb = b.split(/[.-]/).map((part) => Number.parseInt(part, 10) || 0)
  for (let i = 0; i < Math.max(pa.length, pb.length); i += 1) {
    const diff = (pa[i] || 0) - (pb[i] || 0)
    if (diff !== 0) return diff
  }
  return 0
}

function findEngine() {
  const override = process.env.IMPECCABLE_BIN
  if (override && existsSync(override)) return { path: override, version: 'custom', launcher: false }
  try {
    const versions = readdirSync(BIN_ROOT).filter((entry) => existsSync(join(BIN_ROOT, entry, 'impeccable')))
    if (versions.length > 0) {
      versions.sort(compareVersions)
      const version = versions[versions.length - 1]
      return { path: join(BIN_ROOT, version, 'impeccable'), version, launcher: false }
    }
  } catch {
    // 没有缓存目录：退回技能自带的 launcher，它会按需下载。
  }
  const skill = resolveSkillDir()
  if (skill === null) return null
  const launcher = join(skill.dir, 'scripts', 'impeccable')
  return existsSync(launcher) ? { path: launcher, version: 'launcher', launcher: true } : null
}

function readSkill() {
  const skill = resolveSkillDir()
  if (skill === null) return null
  const text = readFileSync(join(skill.dir, 'SKILL.md'), 'utf8')
  const version = /^version:\s*(.+)$/m.exec(text)
  return { text, version: version ? version[1].trim() : null, source: skill.source, dir: skill.dir }
}

// SKILL.md 的 Commands 表：| `craft [feature]` | Build | Deprecated alias … | [ref](…) |
const COMMAND_ROW = /^\|\s*`([a-z][a-z0-9-]*)([^`]*)`\s*\|\s*([A-Za-z]+)\s*\|\s*([^|]+?)\s*\|/

function parseCommands(text) {
  const commands = []
  for (const line of text.split('\n')) {
    const matched = COMMAND_ROW.exec(line)
    if (matched === null) continue
    commands.push({
      name: matched[1],
      hint: matched[2].trim(),
      category: matched[3],
      description: matched[4].trim(),
      // 中文对照：缺项时面板回落到英文原文。
      descriptionZh: COMMAND_ZH[matched[1]] || null,
      categoryZh: CATEGORY_ZH[matched[3]] || null,
    })
  }
  return commands
}

// 引擎自己列规则，结果按引擎路径缓存：这是唯一权威的规则目录。
let rulesCache = null
let rulesCacheFrom = null

async function listRules(engine) {
  if (rulesCache !== null && rulesCacheFrom === engine.path) return rulesCache
  const { stdout } = await run(engine.path, ['detect', '--list-rules', '--json'], {
    timeout: 30_000,
    maxBuffer: 8 * 1024 * 1024,
    windowsHide: true,
  })
  const parsed = JSON.parse(stdout)
  if (!Array.isArray(parsed)) throw new Error('unexpected rule catalog from engine')
  rulesCache = parsed
  rulesCacheFrom = engine.path
  return rulesCache
}

// ---------------------------------------------------------------------------
// 目录与扫描
// ---------------------------------------------------------------------------

async function catalog() {
  const engine = findEngine()
  const skill = readSkill()
  // launcher 状态下跑 --list-rules 会触发引擎下载，把面板卡住；等后台预热完成再报规则。
  const rules = engine === null || engine.launcher === true ? [] : await listRules(engine).catch(() => [])
  return {
    skill: {
      installed: skill !== null,
      version: skill === null ? null : skill.version,
      source: skill === null ? null : skill.source,
      dir: skill === null ? null : skill.dir,
    },
    engine: engine === null
      ? { found: false, version: null, pending: false }
      : engine.launcher === true
        ? { found: false, version: null, pending: true }
        : { found: true, version: engine.version, pending: false },
    commands: skill === null ? [] : parseCommands(skill.text),
    rules: rules.map((rule) => {
      const zhPair = RULE_ZH[rule.id]
      if (Array.isArray(zhPair) && zhPair.length === 2) {
        return { ...rule, nameZh: zhPair[0], descriptionZh: zhPair[1] }
      }
      return { ...rule, nameZh: null, descriptionZh: null }
    }),
  }
}

// 首次装好后引擎还没落盘：后台跑一次 launcher，让它把二进制下载到 ~/.impeccable/bin。
// 失败就静默——用户点扫描时 launcher 还会再试一次，并把真实错误带回来。
let warming = null

function warmEngine() {
  const engine = findEngine()
  if (engine === null || engine.launcher !== true) return null
  if (warming !== null) return warming
  warming = run(engine.path, ['--version'], {
    timeout: 600_000,
    maxBuffer: 4 * 1024 * 1024,
    windowsHide: true,
  })
    .then(() => true)
    .catch(() => false)
    .finally(() => {
      warming = null
    })
  return warming
}

const SCOPE_PATTERN = /^(?:type|layout)(?:,(?:type|layout))*$/
const VIEWPORT_PATTERN = /^\d{2,5}x\d{2,5}$/

function httpError(status, message) {
  return Object.assign(new Error(message), { status })
}

// 目标只能是 http(s) 网址或已存在的绝对路径；相对路径按 Host 进程的 cwd 解析。
function normalizeTarget(raw) {
  const target = String(raw === undefined || raw === null ? '' : raw).trim()
  if (target === '') throw httpError(400, 'target required')
  if (target.length > 800) throw httpError(400, 'target too long')
  if (/^https?:\/\//i.test(target)) return { arg: target, cwd: HOME }
  const abs = resolve(HOME, target)
  if (!existsSync(abs)) throw httpError(400, `path not found: ${target}`)
  const dir = statSync(abs).isDirectory() ? abs : dirname(abs)
  return { arg: abs, cwd: dir }
}

function summarize(findings) {
  let warning = 0
  let advisory = 0
  const rules = new Set()
  for (const finding of findings) {
    if (finding.severity === 'advisory') advisory += 1
    else warning += 1
    if (typeof finding.antipattern === 'string') rules.add(finding.antipattern)
  }
  return { total: findings.length, warning, advisory, rules: rules.size }
}

async function detectWith(engine, options) {
  const args = ['detect', options.arg, '--json']
  if (options.scope) args.push('--scope', options.scope)
  if (options.viewport) args.push('--viewport', options.viewport)
  const started = Date.now()
  let stdout = ''
  let exitCode = 0
  try {
    const result = await run(engine.path, args, {
      cwd: options.cwd,
      timeout: engine.launcher === true ? 600_000 : 180_000,
      maxBuffer: 64 * 1024 * 1024,
      windowsHide: true,
      env: { ...process.env, NO_COLOR: '1', FORCE_COLOR: '0' },
    })
    stdout = result.stdout
  } catch (error) {
    // detect 用非零退出码表示"扫出了问题"（2 命中、1 出错），stdout 仍是 JSON。
    stdout = typeof error.stdout === 'string' ? error.stdout : ''
    exitCode = typeof error.code === 'number' ? error.code : 1
    if (stdout.trim() === '') {
      const detail = String(error.stderr || error.message || '').trim().split('\n')[0]
      throw httpError(502, detail === '' ? 'impeccable detect failed' : detail)
    }
  }
  let findings
  try {
    findings = JSON.parse(stdout)
  } catch {
    throw httpError(502, 'unexpected detect output')
  }
  if (!Array.isArray(findings)) throw httpError(502, 'unexpected detect output')
  // 面板按 rule 分组展示，几百条足够；再多也没人看得完。
  const limit = 600
  const truncated = findings.length > limit
  const shown = truncated ? findings.slice(0, limit) : findings
  return {
    findings: shown,
    truncated,
    summary: summarize(findings),
    ms: Date.now() - started,
    exitCode,
  }
}

// ---------------------------------------------------------------------------
// HTTP 网关
// ---------------------------------------------------------------------------

function sendJson(res, status, body) {
  res.writeHead(status, { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' })
  res.end(JSON.stringify(body))
}

function notFound(res) {
  res.writeHead(404, { 'content-type': 'text/plain; charset=utf-8' })
  res.end('not found')
}

// 只接受同源页面发来的 JSON。
function readJson(req, max = 16 * 1024) {
  return new Promise((resolvePromise, rejectPromise) => {
    const { origin, host } = req.headers
    if (req.method !== 'POST') return rejectPromise(httpError(405, 'method not allowed'))
    if (!/^application\/json\b/.test(req.headers['content-type'] || '')) return rejectPromise(httpError(415, 'json body required'))
    if (origin && origin.replace(/^https?:\/\//, '') !== host) return rejectPromise(httpError(403, 'cross-origin rejected'))
    let size = 0
    const chunks = []
    req.on('data', (chunk) => {
      size += chunk.length
      if (size > max) req.destroy()
      else chunks.push(chunk)
    })
    req.on('end', () => {
      try {
        resolvePromise(JSON.parse(Buffer.concat(chunks).toString('utf8') || '{}'))
      } catch (error) {
        rejectPromise(httpError(400, String(error.message || error)))
      }
    })
    req.on('error', rejectPromise)
  })
}

export function apply(ctx) {
  // 后台预热：首次装好后把引擎拉下来，别让用户第一次点扫描时干等。
  void warmEngine()

  ctx.effect(() =>
    ctx.webServer.register({
      kind: 'prefix',
      path: BASE,
      async handler(req, res) {
        const url = new URL(req.url || '/', 'http://x')
        const rest = decodeURIComponent(url.pathname.slice(BASE.length)) || '/'
        try {
          if (rest === '/api/catalog') {
            if (req.method !== 'GET' && req.method !== 'HEAD') return sendJson(res, 405, { ok: false, error: 'method not allowed' })
            return sendJson(res, 200, await catalog())
          }
          if (rest === '/api/detect') {
            const engine = findEngine()
            if (engine === null) return sendJson(res, 503, { ok: false, code: 'engine-not-found', error: 'impeccable engine not found' })
            const body = await readJson(req)
            const options = normalizeTarget(body.target)
            if (body.scope !== undefined && body.scope !== '') {
              const scope = String(body.scope)
              if (!SCOPE_PATTERN.test(scope)) throw httpError(400, 'unsupported scope')
              options.scope = scope
            }
            if (body.viewport !== undefined && body.viewport !== '') {
              const viewport = String(body.viewport)
              if (!VIEWPORT_PATTERN.test(viewport)) throw httpError(400, 'unsupported viewport')
              options.viewport = viewport
            }
            const result = await detectWith(engine, options)
            return sendJson(res, 200, { ok: true, ...result })
          }
          return notFound(res)
        } catch (error) {
          const status = typeof error.status === 'number' ? error.status : 500
          return sendJson(res, status, { ok: false, error: String(error.message || error) })
        }
      },
    }),
  )
}
