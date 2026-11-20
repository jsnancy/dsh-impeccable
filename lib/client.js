// dsh-impeccable · 浏览器半边
//
//   - 左侧栏加一个「Impeccable」图标，点击进主区域的审校台面板
//   - 面板上半：填路径或网址 → POST /impeccable/api/detect，跑 62 条确定性规则
//   - 面板中间：24 条命令，点一下复制提示词，点右上角箭头直接开新对话
//   - 面板下半：62 条规则目录，可搜索
window.__ModuleLoader__.load({
  id: 'dsh-impeccable',
  factory: (require) => {
    var module = { exports: {} }
    var exports = module.exports
    Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' })

    const React = require('react')
    const h = React.createElement

    const PANEL = 'impeccable'
    const API = '/impeccable/api'
    const STORAGE_TARGET = 'dsh-impeccable:target'

    // ---------------------------------------------------------------------
    // 文案
    // ---------------------------------------------------------------------

    const TEXT = {
      zh: {
        title: 'Impeccable 审校台',
        subtitle: '设计词汇表 · 确定性检测',
        scan: '扫描目标',
        scanPlaceholder: '项目路径或网址，例如 /Users/you/project 或 https://example.com',
        scanAction: '扫描',
        scanning: '扫描中…',
        scanEmpty: '填一个路径或网址，「扫描」会跑 62 条规则，把界面问题一次性列出来。',
        scanClean: '没有发现问题。',
        scanFailed: '扫描失败',
        summary: '{total} 项 · {warning} 警告 · {advisory} 提示',
        summaryRules: '命中 {n} 类规则',
        commands: '命令',
        commandsHint: '点一下复制提示词，点右上角箭头开新对话。',
        rules: '规则目录',
        rulesHint: '{n} 条确定性规则，不用模型、不用 API key。',
        rulesSearch: '搜索规则、分类或说明…',
        showAll: '展开 {n} 条',
        showLess: '收起',
        copied: '已复制',
        openSession: '开新对话',
        engineMissing: '找不到 impeccable 引擎：重装插件，或用 IMPECCABLE_BIN 指向已有二进制。',
        skillMissing: '插件自带的技能文件缺失，重装插件即可恢复。',
        enginePending: '引擎首次运行要下载约 21 MB，正在后台进行；下载完成后即可扫描。',
        warning: '警告',
        advisory: '提示',
        all: '全部',
        prompt: (name, hint, dir) =>
          `用 impeccable 的 ${name} 命令${hint ? `（${hint}）` : ''}，目标是我当前在做的界面。技能文档在 ${dir}/SKILL.md，先读它（含 Setup：读项目和设计上下文），再按 ${dir}/reference/${name}.md 执行。`,
        findingsMore: '还有 {n} 处同类',
        truncated: '结果超过 600 条，只展示前 600 条。',
      },
      en: {
        title: 'Impeccable Studio',
        subtitle: 'Design vocabulary · Deterministic checks',
        scan: 'Scan target',
        scanPlaceholder: 'Project path or URL, e.g. /Users/you/project or https://example.com',
        scanAction: 'Scan',
        scanning: 'Scanning…',
        scanEmpty: 'Give it a path or URL and Scan runs 62 rules, listing what is wrong with the interface in one pass.',
        scanClean: 'No issues found.',
        scanFailed: 'Scan failed',
        summary: '{total} findings · {warning} warning · {advisory} advisory',
        summaryRules: '{n} rules hit',
        commands: 'Commands',
        commandsHint: 'Click to copy the prompt; the arrow opens a new session.',
        rules: 'Rule catalog',
        rulesHint: '{n} deterministic rules, no model or API key required.',
        rulesSearch: 'Search rules, categories or descriptions…',
        showAll: 'Show {n}',
        showLess: 'Show less',
        copied: 'Copied',
        openSession: 'New session',
        engineMissing: 'No impeccable engine found. Reinstall the plugin, or point IMPECCABLE_BIN at one.',
        skillMissing: 'The bundled skill files are missing. Reinstalling the plugin restores them.',
        enginePending: 'First run downloads the engine (about 21 MB) in the background; scanning works once it lands.',
        warning: 'warning',
        advisory: 'advisory',
        all: 'All',
        prompt: (name, hint, dir) =>
          `Run the impeccable ${name} command${hint ? ` (${hint})` : ''} on the interface I am working on. The skill docs live in ${dir}: read ${dir}/SKILL.md first (its Setup section covers project and design context), then ${dir}/reference/${name}.md.`,
        findingsMore: '{n} more like this',
        truncated: 'More than 600 findings; showing the first 600.',
      },
    }

    let LANG = 'zh'
    const langListeners = new Set()

    function setLang(next) {
      const value = next === 'en' ? 'en' : 'zh'
      if (value === LANG) return
      LANG = value
      for (const listener of langListeners) listener(value)
    }

    function useLang() {
      const [lang, set] = React.useState(LANG)
      React.useEffect(() => {
        langListeners.add(set)
        return () => langListeners.delete(set)
      }, [])
      return lang
    }

    function tr(lang, key, vars) {
      const table = TEXT[lang] || TEXT.zh
      const value = table[key] !== undefined ? table[key] : TEXT.zh[key]
      if (typeof value === 'function') return value
      if (vars === undefined) return value
      return String(value).replace(/\{(\w+)\}/g, (match, name) => (vars[name] !== undefined ? String(vars[name]) : match))
    }

    // 切走面板再回来时保留输入和上一次扫描结果
    const memory = { target: null, scan: { status: 'idle' } }

    function loadTarget() {
      if (memory.target !== null) return memory.target
      try {
        memory.target = localStorage.getItem(STORAGE_TARGET) || ''
      } catch {
        memory.target = ''
      }
      return memory.target
    }

    // ---------------------------------------------------------------------
    // 小工具
    // ---------------------------------------------------------------------

    function shortPath(file) {
      const parts = String(file || '').split('/').filter(Boolean)
      if (parts.length <= 2) return String(file || '')
      return `…/${parts.slice(-2).join('/')}`
    }

    function groupFindings(findings) {
      const groups = new Map()
      for (const finding of findings) {
        const key = finding.antipattern || finding.name || 'unknown'
        const current = groups.get(key)
        if (current === undefined) {
          groups.set(key, {
            key,
            name: finding.name || key,
            description: finding.description || '',
            severity: finding.severity || 'warning',
            count: 1,
            items: [finding],
          })
        } else {
          current.count += 1
          current.items.push(finding)
        }
      }
      return [...groups.values()].sort((a, b) => b.count - a.count)
    }

    async function copyText(text) {
      try {
        await navigator.clipboard.writeText(text)
        return true
      } catch {
        return false
      }
    }

    let uiWorkspace = null

    function openSession(prompt) {
      if (uiWorkspace === null) return false
      try {
        uiWorkspace.startSession(undefined, { prompt, whenDraftExists: 'replace' })
        return true
      } catch (error) {
        console.error('[impeccable] 开新对话失败', error)
        return false
      }
    }

    // ---------------------------------------------------------------------
    // 图标
    // ---------------------------------------------------------------------

    function StudioIcon(props) {
      const size = (props && props.size) || 18
      return h('svg', {
        width: size,
        height: size,
        viewBox: '0 0 24 24',
        fill: 'none',
        stroke: 'currentColor',
        strokeWidth: 1.6,
        strokeLinecap: 'round',
        strokeLinejoin: 'round',
      },
        h('path', { d: 'M2.5 12S6 5.6 12 5.6 21.5 12 21.5 12 18 18.4 12 18.4 2.5 12 2.5 12Z' }),
        h('circle', { cx: 12, cy: 12, r: 3.1 }))
    }

    // ---------------------------------------------------------------------
    // 面板
    // ---------------------------------------------------------------------

    function Dot(props) {
      return h('span', { className: `dsh-im-dot dsh-im-dot-${props.tone || 'warn'}`, 'aria-hidden': 'true' })
    }

    function ScanSection(props) {
      const lang = useLang()
      const [target, setTarget] = React.useState(loadTarget)
      const [scan, setScan] = React.useState(memory.scan)
      const [busy, setBusy] = React.useState(false)

      function update(next) {
        memory.scan = next
        setScan(next)
      }

      function onChange(event) {
        const value = event.target.value
        memory.target = value
        setTarget(value)
      }

      async function submit() {
        const value = target.trim()
        if (value === '' || busy) return
        try {
          localStorage.setItem(STORAGE_TARGET, value)
        } catch {
          // 存不下就算了，不影响扫描
        }
        setBusy(true)
        update({ status: 'running' })
        try {
          const response = await fetch(`${API}/detect`, {
            method: 'POST',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify({ target: value }),
          })
          const body = await response.json()
          if (!response.ok || body.ok !== true) throw new Error(body.error || `HTTP ${response.status}`)
          update({ status: 'done', data: body, at: Date.now() })
          // 扫描会让引擎落盘，重新拉一次 catalog 才能拿到规则目录与版本号。
          if (typeof props.onScanned === 'function') props.onScanned()
        } catch (error) {
          update({ status: 'error', error: String((error && error.message) || error) })
        } finally {
          setBusy(false)
        }
      }

      const groups = scan.status === 'done' ? groupFindings(scan.data.findings) : []

      return h('section', { className: 'dsh-im-card' },
        h('div', { className: 'dsh-im-cardhead' },
          h('h2', { className: 'dsh-im-cardtitle' }, tr(lang, 'scan'))),
        h('div', { className: 'dsh-im-scanrow' },
          h('input', {
            className: 'dsh-im-input',
            value: target,
            placeholder: tr(lang, 'scanPlaceholder'),
            spellCheck: false,
            onChange,
            onKeyDown: (event) => {
              if (event.key === 'Enter') submit()
            },
          }),
          h('button', {
            type: 'button',
            className: 'dsh-im-btn',
            disabled: busy || target.trim() === '',
            onClick: submit,
          }, busy ? tr(lang, 'scanning') : tr(lang, 'scanAction'))),

        scan.status === 'idle' ? h('p', { className: 'dsh-im-hint' }, tr(lang, 'scanEmpty')) : null,
        scan.status === 'running' ? h('p', { className: 'dsh-im-hint' }, tr(lang, 'scanning')) : null,
        scan.status === 'error'
          ? h('p', { className: 'dsh-im-error' }, `${tr(lang, 'scanFailed')} · ${scan.error}`)
          : null,

        scan.status === 'done' ? h(React.Fragment, null,
          h('div', { className: 'dsh-im-summary' },
            scan.data.summary.total === 0
              ? h('span', { className: 'dsh-im-ok' }, tr(lang, 'scanClean'))
              : h('span', { className: 'dsh-im-summarytext' },
                tr(lang, 'summary', {
                  total: scan.data.summary.total,
                  warning: scan.data.summary.warning,
                  advisory: scan.data.summary.advisory,
                }),
                ' · ',
                tr(lang, 'summaryRules', { n: scan.data.summary.rules }),
                ` · ${scan.data.ms}ms`)),
          scan.data.truncated ? h('p', { className: 'dsh-im-hint' }, tr(lang, 'truncated')) : null,
          h('div', { className: 'dsh-im-findings' },
            groups.map((group) => h('article', { className: 'dsh-im-finding', key: group.key },
              h('header', { className: 'dsh-im-findinghead' },
                h(Dot, { tone: group.severity === 'advisory' ? 'info' : 'warn' }),
                h('span', { className: 'dsh-im-findingname' }, group.name),
                h('span', { className: 'dsh-im-count' }, `×${group.count}`)),
              group.description ? h('p', { className: 'dsh-im-findingdesc' }, group.description) : null,
              h('ul', { className: 'dsh-im-locations' },
                group.items.slice(0, 6).map((item, index) => h('li', { className: 'dsh-im-location', key: index },
                  h('code', { className: 'dsh-im-file' }, shortPath(item.file) + (item.line ? `:${item.line}` : '')),
                  item.snippet ? h('span', { className: 'dsh-im-snippet' }, item.snippet) : null))),
              group.count > 6
                ? h('p', { className: 'dsh-im-hint' }, tr(lang, 'findingsMore', { n: group.count - 6 }))
                : null)))) : null)
    }

    function CommandsSection(props) {
      const lang = useLang()
      const [category, setCategory] = React.useState(null)
      const [copied, setCopied] = React.useState(null)

      const commands = props.commands
      const skillDir = props.skillDir || 'impeccable/skill'
      const categories = []
      for (const command of commands) {
        if (!categories.includes(command.category)) categories.push(command.category)
      }

      function highlight(name) {
        setCopied(name)
        window.setTimeout(() => setCopied((current) => (current === name ? null : current)), 1400)
      }

      async function onCopy(command) {
        const ok = await copyText(tr(lang, 'prompt')(command.name, command.hint, skillDir))
        if (ok) highlight(command.name)
      }

      function onSession(command) {
        if (openSession(tr(lang, 'prompt')(command.name, command.hint, skillDir))) highlight(command.name)
      }

      const shown = category === null ? commands : commands.filter((command) => command.category === category)

      return h('section', { className: 'dsh-im-card' },
        h('div', { className: 'dsh-im-cardhead' },
          h('h2', { className: 'dsh-im-cardtitle' }, `${tr(lang, 'commands')} ${commands.length > 0 ? `· ${commands.length}` : ''}`),
          h('span', { className: 'dsh-im-cardhint' }, tr(lang, 'commandsHint'))),
        h('div', { className: 'dsh-im-chips' },
          h('button', {
            type: 'button',
            className: `dsh-im-chip${category === null ? ' dsh-im-chip-on' : ''}`,
            onClick: () => setCategory(null),
          }, tr(lang, 'all')),
          categories.map((item) => h('button', {
            type: 'button',
            key: item,
            className: `dsh-im-chip${category === item ? ' dsh-im-chip-on' : ''}`,
            onClick: () => setCategory(item),
          }, item))),
        h('div', { className: 'dsh-im-grid' },
          shown.map((command) => h('div', {
            className: `dsh-im-cmd${copied === command.name ? ' dsh-im-cmd-on' : ''}`,
            key: command.name,
            role: 'button',
            tabIndex: 0,
            title: copied === command.name ? tr(lang, 'copied') : command.description,
            onClick: () => onCopy(command),
            onKeyDown: (event) => {
              if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault()
                onCopy(command)
              }
            },
          },
          h('div', { className: 'dsh-im-cmdtop' },
            h('code', { className: 'dsh-im-cmdname' }, command.name + (command.hint ? ` ${command.hint}` : '')),
            h('button', {
              type: 'button',
              className: 'dsh-im-cmdopen',
              title: tr(lang, 'openSession'),
              'aria-label': tr(lang, 'openSession'),
              onClick: (event) => {
                event.stopPropagation()
                onSession(command)
              },
            }, h('svg', { width: 12, height: 12, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round' },
              h('path', { d: 'M5 12h13M13 6l6 6-6 6' })))),
          h('p', { className: 'dsh-im-cmddesc' }, command.description),
          copied === command.name ? h('span', { className: 'dsh-im-copied' }, tr(lang, 'copied')) : null))))
    }

    function RulesSection(props) {
      const lang = useLang()
      const [open, setOpen] = React.useState(props.initialOpen === true)
      const [query, setQuery] = React.useState('')

      const rules = props.rules
      const needle = query.trim().toLowerCase()
      const matched = needle === ''
        ? rules
        : rules.filter((rule) => [rule.id, rule.name, rule.category, rule.description, ...(rule.scopes || [])]
          .join(' ')
          .toLowerCase()
          .includes(needle))

      return h('section', { className: 'dsh-im-card' },
        h('div', { className: 'dsh-im-cardhead' },
          h('h2', { className: 'dsh-im-cardtitle' }, `${tr(lang, 'rules')} · ${rules.length}`),
          h('button', {
            type: 'button',
            className: 'dsh-im-link',
            onClick: () => setOpen((value) => !value),
          }, open ? tr(lang, 'showLess') : tr(lang, 'showAll', { n: rules.length }))),
        h('span', { className: 'dsh-im-cardhint' }, tr(lang, 'rulesHint', { n: rules.length })),
        open ? h(React.Fragment, null,
          h('input', {
            className: 'dsh-im-input dsh-im-input-sm',
            value: query,
            placeholder: tr(lang, 'rulesSearch'),
            spellCheck: false,
            onChange: (event) => setQuery(event.target.value),
          }),
          h('ul', { className: 'dsh-im-rules' },
            matched.map((rule) => h('li', { className: 'dsh-im-rule', key: rule.id },
              h(Dot, { tone: rule.severity === 'advisory' ? 'info' : rule.severity === 'error' ? 'error' : 'warn' }),
              h('div', { className: 'dsh-im-rulebody' },
                h('div', { className: 'dsh-im-ruletop' },
                  h('code', { className: 'dsh-im-ruleid' }, rule.id),
                  h('span', { className: 'dsh-im-rulecat' }, rule.category)),
                h('div', { className: 'dsh-im-rulename' }, rule.name),
                h('p', { className: 'dsh-im-ruledesc' }, rule.description))))) ) : null)
    }

    function StudioPanel() {
      const lang = useLang()
      const [catalog, setCatalog] = React.useState({ status: 'loading', data: null, error: null })
      const [reloadKey, setReloadKey] = React.useState(0)
      const reloadCatalog = React.useCallback(() => setReloadKey((value) => value + 1), [])

      React.useEffect(() => {
        let alive = true
        fetch(`${API}/catalog`)
          .then((response) => response.json())
          .then((data) => {
            if (alive) setCatalog({ status: 'ready', data, error: null })
          })
          .catch((error) => {
            if (alive) setCatalog({ status: 'error', data: null, error: String((error && error.message) || error) })
          })
        return () => {
          alive = false
        }
      }, [reloadKey])

      const data = catalog.data
      const enginePending = catalog.status === 'ready' && data !== null && data.engine.pending === true
      const engineMissing = catalog.status === 'ready' && data !== null
        && data.engine.found !== true && data.engine.pending !== true
      const skillMissing = catalog.status === 'ready' && data !== null && data.skill.installed !== true

      return h('div', { className: 'dsh-im-root' },
        h('style', null, STYLE),
        h('header', { className: 'dsh-im-head' },
          h('div', { className: 'dsh-im-headtop' },
            h('h1', { className: 'dsh-im-title' }, tr(lang, 'title')),
            h('div', { className: 'dsh-im-badges' },
              data && data.skill.version ? h('span', { className: 'dsh-im-badge' }, `skill ${data.skill.version}`) : null,
              data && data.engine.found ? h('span', { className: 'dsh-im-badge' }, `engine ${data.engine.version}`) : null,
              data && data.rules.length > 0 ? h('span', { className: 'dsh-im-badge' }, `${data.rules.length} rules`) : null)),
          h('p', { className: 'dsh-im-subtitle' }, tr(lang, 'subtitle'))),

        h('div', { className: 'dsh-im-body' },
          catalog.status === 'loading' ? h('p', { className: 'dsh-im-hint' }, '…') : null,
          catalog.status === 'error' ? h('p', { className: 'dsh-im-error' }, catalog.error) : null,
          enginePending ? h('p', { className: 'dsh-im-hint' }, tr(lang, 'enginePending')) : null,
          engineMissing ? h('p', { className: 'dsh-im-error' }, tr(lang, 'engineMissing')) : null,
          skillMissing ? h('p', { className: 'dsh-im-error' }, tr(lang, 'skillMissing')) : null,
          data ? h(ScanSection, { onScanned: reloadCatalog }) : null,
          data && data.commands.length > 0
            ? h(CommandsSection, { commands: data.commands, skillDir: data.skill.dir })
            : null,
          data && data.rules.length > 0 ? h(RulesSection, { rules: data.rules }) : null))
    }

    // ---------------------------------------------------------------------
    // 样式：只用 --dsw-* 主题 token，明暗自动跟随
    // ---------------------------------------------------------------------

    const STYLE = `
.dsh-im-root { position: relative; display: flex; flex-direction: column; height: 100%; min-height: 0; background: var(--dsw-alias-bg-base); color: var(--dsw-alias-label-primary); font-size: 13px; line-height: 1.5; }
.dsh-im-head { padding: 18px 22px 14px; border-bottom: 1px solid var(--dsw-alias-border-l1); }
.dsh-im-headtop { display: flex; align-items: baseline; justify-content: space-between; gap: 12px; flex-wrap: wrap; }
.dsh-im-title { margin: 0; font-size: 17px; font-weight: 600; letter-spacing: -0.01em; }
.dsh-im-subtitle { margin: 4px 0 0; font-size: 12px; color: var(--dsw-alias-label-tertiary); }
.dsh-im-badges { display: flex; gap: 6px; flex-wrap: wrap; }
.dsh-im-badge { font-size: 11px; padding: 2px 8px; border-radius: 999px; border: 1px solid var(--dsw-alias-border-l1); background: var(--dsw-alias-bg-layer-2); color: var(--dsw-alias-label-secondary); font-variant-numeric: tabular-nums; }
.dsh-im-body { flex: 1; min-height: 0; overflow: auto; padding: 16px 22px 48px; display: flex; flex-direction: column; gap: 14px; }
.dsh-im-card { border: 1px solid var(--dsw-alias-border-l1); border-radius: 12px; background: var(--dsw-alias-bg-layer-1); padding: 14px 16px 16px; display: flex; flex-direction: column; gap: 10px; }
.dsh-im-cardhead { display: flex; align-items: center; justify-content: space-between; gap: 10px; }
.dsh-im-cardtitle { margin: 0; font-size: 13px; font-weight: 600; }
.dsh-im-cardhint { font-size: 11px; color: var(--dsw-alias-label-tertiary); }
.dsh-im-scanrow { display: flex; gap: 8px; }
.dsh-im-input { flex: 1; min-width: 0; height: 34px; padding: 0 11px; border-radius: 8px; border: 1px solid var(--dsw-alias-border-l2); background: var(--dsw-alias-bg-base); color: var(--dsw-alias-label-primary); font-size: 12.5px; font-family: inherit; outline: none; transition: border-color .15s ease; }
.dsh-im-input:focus { border-color: var(--dsw-alias-brand-primary); }
.dsh-im-input-sm { height: 30px; }
.dsh-im-btn { height: 34px; padding: 0 16px; border: 1px solid transparent; border-radius: 8px; background: var(--dsw-alias-button-primary-fill); color: var(--dsw-alias-label-primary-inverted); font-size: 12.5px; font-weight: 500; font-family: inherit; cursor: pointer; white-space: nowrap; }
.dsh-im-btn:hover:not(:disabled) { background: var(--dsw-alias-button-primary-hover); }
.dsh-im-btn:disabled { opacity: .5; cursor: default; }
.dsh-im-hint { margin: 0; font-size: 12px; color: var(--dsw-alias-label-tertiary); }
.dsh-im-error { margin: 0; font-size: 12px; color: var(--dsw-alias-state-error-primary); word-break: break-word; }
.dsh-im-ok { font-size: 12px; color: var(--dsw-alias-state-success-primary); }
.dsh-im-summary { display: flex; align-items: center; gap: 8px; }
.dsh-im-summarytext { font-size: 12px; color: var(--dsw-alias-label-secondary); font-variant-numeric: tabular-nums; }
.dsh-im-findings { display: flex; flex-direction: column; gap: 8px; }
.dsh-im-finding { border: 1px solid var(--dsw-alias-border-l1); border-radius: 9px; background: var(--dsw-alias-bg-base); padding: 10px 12px; display: flex; flex-direction: column; gap: 5px; }
.dsh-im-findinghead { display: flex; align-items: center; gap: 7px; }
.dsh-im-findingname { font-size: 12.5px; font-weight: 500; }
.dsh-im-findingdesc { margin: 0; font-size: 11.5px; color: var(--dsw-alias-label-tertiary); }
.dsh-im-count { margin-left: auto; font-size: 11px; color: var(--dsw-alias-label-tertiary); font-variant-numeric: tabular-nums; }
.dsh-im-dot { width: 7px; height: 7px; border-radius: 50%; flex: none; background: var(--dsw-alias-state-warn-primary); }
.dsh-im-dot-info { background: var(--dsw-alias-label-tertiary); }
.dsh-im-dot-error { background: var(--dsw-alias-state-error-primary); }
.dsh-im-locations { margin: 2px 0 0; padding: 0; list-style: none; display: flex; flex-direction: column; gap: 3px; }
.dsh-im-location { display: flex; gap: 8px; align-items: baseline; min-width: 0; }
.dsh-im-file { font-family: ui-monospace, SFMono-Regular, Menlo, monospace; font-size: 11px; color: var(--dsw-alias-label-secondary); white-space: nowrap; flex: none; }
.dsh-im-snippet { font-size: 11.5px; color: var(--dsw-alias-label-tertiary); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.dsh-im-chips { display: flex; gap: 6px; flex-wrap: wrap; }
.dsh-im-chip { height: 24px; padding: 0 10px; border-radius: 999px; border: 1px solid var(--dsw-alias-border-l1); background: transparent; color: var(--dsw-alias-label-secondary); font-size: 11.5px; font-family: inherit; cursor: pointer; }
.dsh-im-chip:hover { background: var(--dsw-alias-interactive-bg-hover); }
.dsh-im-chip-on { background: var(--dsw-alias-bg-layer-3); border-color: var(--dsw-alias-border-l2); color: var(--dsw-alias-label-primary); }
.dsh-im-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(188px, 1fr)); gap: 8px; }
.dsh-im-cmd { position: relative; border: 1px solid var(--dsw-alias-border-l1); border-radius: 9px; background: var(--dsw-alias-bg-base); padding: 9px 11px; cursor: pointer; transition: border-color .15s ease, background .15s ease; display: flex; flex-direction: column; gap: 4px; min-width: 0; }
.dsh-im-cmd:hover { border-color: var(--dsw-alias-border-l2); background: var(--dsw-alias-interactive-bg-hover); }
.dsh-im-cmd-on { border-color: var(--dsw-alias-state-success-primary); }
.dsh-im-cmdtop { display: flex; align-items: center; gap: 6px; }
.dsh-im-cmdname { font-family: ui-monospace, SFMono-Regular, Menlo, monospace; font-size: 11.5px; font-weight: 500; color: var(--dsw-alias-label-primary); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.dsh-im-cmdopen { margin-left: auto; display: flex; align-items: center; justify-content: center; width: 20px; height: 20px; border-radius: 6px; border: none; background: transparent; color: var(--dsw-alias-label-tertiary); cursor: pointer; opacity: 0; transition: opacity .15s ease; flex: none; }
.dsh-im-cmd:hover .dsh-im-cmdopen { opacity: 1; }
.dsh-im-cmdopen:hover { background: var(--dsw-alias-bg-layer-3); color: var(--dsw-alias-label-primary); }
.dsh-im-cmddesc { margin: 0; font-size: 11px; color: var(--dsw-alias-label-tertiary); display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
.dsh-im-copied { position: absolute; top: 6px; right: 8px; font-size: 10px; color: var(--dsw-alias-state-success-primary); background: var(--dsw-alias-bg-layer-2); border-radius: 4px; padding: 0 4px; }
.dsh-im-link { border: none; background: transparent; color: var(--dsw-alias-link); font-size: 12px; font-family: inherit; cursor: pointer; padding: 0; }
.dsh-im-link:hover { text-decoration: underline; }
.dsh-im-rules { margin: 0; padding: 0; list-style: none; display: flex; flex-direction: column; gap: 2px; max-height: 420px; overflow: auto; }
.dsh-im-rule { display: flex; gap: 9px; padding: 7px 2px; border-bottom: 1px solid var(--dsw-alias-border-l1); align-items: flex-start; }
.dsh-im-rule:last-child { border-bottom: none; }
.dsh-im-rule .dsh-im-dot { margin-top: 5px; }
.dsh-im-rulebody { min-width: 0; display: flex; flex-direction: column; gap: 2px; }
.dsh-im-ruletop { display: flex; align-items: baseline; gap: 8px; }
.dsh-im-ruleid { font-family: ui-monospace, SFMono-Regular, Menlo, monospace; font-size: 11px; color: var(--dsw-alias-label-secondary); }
.dsh-im-rulecat { font-size: 10px; color: var(--dsw-alias-label-tertiary); text-transform: uppercase; letter-spacing: .04em; }
.dsh-im-rulename { font-size: 12.5px; }
.dsh-im-ruledesc { margin: 0; font-size: 11.5px; color: var(--dsw-alias-label-tertiary); }
`

    function apply(ctx) {
      ctx.inject(['locale'], (injected) => {
        const push = (snapshot) => {
          const active = snapshot && typeof snapshot.active === 'string' ? snapshot.active : ''
          setLang(/^en\b/i.test(active) ? 'en' : 'zh')
        }
        try {
          push(injected.locale.getSnapshot())
        } catch {
          setLang(/^en\b/i.test(navigator.language) ? 'en' : 'zh')
        }
        injected.on('locale/change', push)
      })

      ctx.inject(['uiWorkspace'], (injected) => {
        uiWorkspace = injected.uiWorkspace
      })

      ctx.slots.inject('sidebar.panellist', () =>
        ctx.slots.register({ name: 'sidebar.panellist', id: PANEL, order: 15, label: () => tr(LANG, 'title') }, StudioIcon))
      ctx.slots.inject('main', () => ctx.slots.register({ name: 'main', key: PANEL }, StudioPanel))
    }

    exports.isPlugin = true
    exports.inject = ['slots']
    exports.apply = apply
    // 调试与测试用：面板各区块的组件引用与内存态
    exports.__parts = { StudioIcon, StudioPanel, ScanSection, CommandsSection, RulesSection, memory, setLang }
    return module.exports
  },
})
