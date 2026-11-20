// dsh-impeccable · 浏览器半边
//
//   - 左侧栏加一个「Impeccable」图标，点击进主区域的审校台面板
//   - 面板上半：填路径或网址 → POST /impeccable/api/detect，跑 62 条确定性规则
//   - 面板中间：24 条命令，点一下复制提示词，点右上角箭头直接开新对话
//   - 面板下半：62 条规则目录，可搜索
window.__ModuleLoader__.load({
  id: 'dsh-impeccable-studio',
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
        badgeSkill: '技能',
        badgeEngine: '引擎',
        badgeRules: '条规则',
        catQuality: '质量',
        catSlop: '套路',
        scanMeta: '{n} 毫秒',
        scanHint: '62 条规则，一次把界面问题列出来',
        metricFindings: '处问题',
        metricSpeed: '耗时',
        eyebrow: 'DESIGN REVIEW',
        lede: '24 条设计命令、62 条确定性规则，都在本机跑。不用模型，不用 API key，也不会把代码发出去。',
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
        badgeSkill: 'skill',
        badgeEngine: 'engine',
        badgeRules: 'rules',
        catQuality: 'quality',
        catSlop: 'slop',
        scanMeta: '{n} ms',
        scanHint: '62 rules, one pass over the interface',
        metricFindings: 'findings',
        metricSpeed: 'took',
        eyebrow: 'DESIGN REVIEW',
        lede: '24 design playbooks and 62 deterministic rules, all running on this machine. No model, no API key, nothing leaves the device.',
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

    function groupFindings(findings, ruleMap) {
      const groups = new Map()
      for (const finding of findings) {
        const key = finding.antipattern || finding.name || 'unknown'
        const known = ruleMap instanceof Map ? ruleMap.get(key) : null
        const current = groups.get(key)
        if (current === undefined) {
          groups.set(key, {
            key,
            name: finding.name || key,
            description: finding.description || '',
            nameZh: known && typeof known.nameZh === 'string' ? known.nameZh : null,
            descriptionZh: known && typeof known.descriptionZh === 'string' ? known.descriptionZh : null,
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

    // 命令与规则的中文对照优先，缺项回落英文原文。
    function commandDesc(lang, command) {
      return lang === 'zh' && typeof command.descriptionZh === 'string' ? command.descriptionZh : command.description
    }

    function ruleName(lang, rule) {
      return lang === 'zh' && typeof rule.nameZh === 'string' ? rule.nameZh : rule.name
    }

    function ruleDesc(lang, rule) {
      return lang === 'zh' && typeof rule.descriptionZh === 'string' ? rule.descriptionZh : rule.description
    }

    function categoryLabel(lang, category) {
      if (lang !== 'zh') return category
      if (category === 'quality') return tr('zh', 'catQuality')
      if (category === 'slop') return tr('zh', 'catSlop')
      return category
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

      // findings 里只带英文名，按 antipattern 对回规则目录拿中文名。
      const ruleMap = React.useMemo(() => {
        const map = new Map()
        const list = Array.isArray(props.rules) ? props.rules : []
        for (const rule of list) map.set(rule.id, rule)
        return map
      }, [props.rules])

      const done = scan.status === 'done'
      const total = done ? scan.data.summary.total : 0
      const groups = done ? groupFindings(scan.data.findings, ruleMap) : []

      const metrics = done && total > 0
        ? h('div', { className: 'dsh-im-metrics' },
          h('div', { className: 'dsh-im-metric dsh-im-metric-brand' },
            h('div', { className: 'dsh-im-metricv' }, total),
            h('div', { className: 'dsh-im-metricl' }, tr(lang, 'metricFindings'))),
          h('div', { className: 'dsh-im-metric dsh-im-metric-warn' },
            h('div', { className: 'dsh-im-metricv' }, scan.data.summary.warning),
            h('div', { className: 'dsh-im-metricl' }, tr(lang, 'warning'))),
          h('div', { className: 'dsh-im-metric dsh-im-metric-mute' },
            h('div', { className: 'dsh-im-metricv' }, scan.data.summary.advisory),
            h('div', { className: 'dsh-im-metricl' }, tr(lang, 'advisory'))),
          h('div', { className: 'dsh-im-metric dsh-im-metric-mute' },
            h('div', { className: 'dsh-im-metricv' }, scan.data.ms, h('span', { className: 'dsh-im-metricu' }, 'ms')),
            h('div', { className: 'dsh-im-metricl' }, tr(lang, 'metricSpeed'))))
        : null

      const findingList = done && groups.length > 0
        ? h('div', { className: 'dsh-im-findings' }, groups.map((group) => {
          const name = lang === 'zh' && group.nameZh !== null ? group.nameZh : group.name
          const desc = lang === 'zh' && group.descriptionZh !== null ? group.descriptionZh : group.description
          return h('article', {
            className: `dsh-im-finding dsh-im-finding-${group.severity === 'advisory' ? 'info' : 'warn'}`,
            key: group.key,
          },
          h('header', { className: 'dsh-im-findinghead' },
            h('span', { className: 'dsh-im-findingname' }, name),
            h('span', { className: 'dsh-im-count' }, `×${group.count}`)),
          desc !== '' ? h('p', { className: 'dsh-im-findingdesc' }, desc) : null,
          h('ul', { className: 'dsh-im-locations' },
            group.items.slice(0, 6).map((item, index) => h('li', { className: 'dsh-im-location', key: index },
              h('code', { className: 'dsh-im-file' }, shortPath(item.file) + (item.line ? `:${item.line}` : '')),
              item.snippet ? h('span', { className: 'dsh-im-snippet' }, item.snippet) : null))),
          group.count > 6 ? h('p', { className: 'dsh-im-hint' }, tr(lang, 'findingsMore', { n: group.count - 6 })) : null)
        }))
        : null

      return h('section', { className: 'dsh-im-sec' },
        h('div', { className: 'dsh-im-sechead' },
          h('span', { className: 'dsh-im-num' }, '01'),
          h('h2', { className: 'dsh-im-sectitle' }, tr(lang, 'scan')),
          h('span', { className: 'dsh-im-sechint' }, done && total === 0 ? tr(lang, 'scanClean') : tr(lang, 'scanHint'))),

        h('div', { className: 'dsh-im-search' },
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

        scan.status === 'idle' ? h('p', { className: 'dsh-im-hint dsh-im-pad' }, tr(lang, 'scanEmpty')) : null,
        scan.status === 'running' ? h('div', { className: 'dsh-im-pad' }, h('span', { className: 'dsh-im-bar' })) : null,
        scan.status === 'error'
          ? h('p', { className: 'dsh-im-error dsh-im-pad' }, `${tr(lang, 'scanFailed')} · ${scan.error}`)
          : null,
        done && total === 0 ? h('p', { className: 'dsh-im-ok dsh-im-pad' }, tr(lang, 'scanClean')) : null,
        done && scan.data.truncated ? h('p', { className: 'dsh-im-hint dsh-im-pad' }, tr(lang, 'truncated')) : null,
        metrics,
        findingList)
    }

    function CommandsSection(props) {
      const lang = useLang()
      const [category, setCategory] = React.useState(null)
      const [copied, setCopied] = React.useState(null)

      const commands = props.commands
      const skillDir = props.skillDir || 'impeccable/skill'
      const categories = []
      for (const command of commands) {
        if (categories.some((item) => item.key === command.category)) continue
        categories.push({
          key: command.category,
          label: lang === 'zh' && typeof command.categoryZh === 'string' ? command.categoryZh : command.category,
        })
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

      return h('section', { className: 'dsh-im-sec' },
        h('div', { className: 'dsh-im-sechead' },
          h('span', { className: 'dsh-im-num' }, '02'),
          h('h2', { className: 'dsh-im-sectitle' }, tr(lang, 'commands')),
          h('span', { className: 'dsh-im-sechint' }, tr(lang, 'commandsHint'))),
        h('div', { className: 'dsh-im-chips' },
          h('button', {
            type: 'button',
            className: `dsh-im-chip${category === null ? ' dsh-im-chip-on' : ''}`,
            onClick: () => setCategory(null),
          }, tr(lang, 'all')),
          categories.map((item) => h('button', {
            type: 'button',
            key: item.key,
            className: `dsh-im-chip${category === item.key ? ' dsh-im-chip-on' : ''}`,
            onClick: () => setCategory(item.key),
          }, item.label))),
        h('div', { className: 'dsh-im-grid' },
          shown.map((command) => h('div', {
            className: `dsh-im-cmd${copied === command.name ? ' dsh-im-cmd-on' : ''}`,
            key: command.name,
            role: 'button',
            tabIndex: 0,
            title: copied === command.name ? tr(lang, 'copied') : commandDesc(lang, command),
            onClick: () => onCopy(command),
            onKeyDown: (event) => {
              if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault()
                onCopy(command)
              }
            },
          },
          h('div', { className: 'dsh-im-cmdtop' },
            h('code', { className: 'dsh-im-cmdname' }, command.name),
            command.hint ? h('span', { className: 'dsh-im-cmdhint' }, command.hint) : null,
            h('button', {
              type: 'button',
              className: 'dsh-im-cmdopen',
              title: tr(lang, 'openSession'),
              'aria-label': tr(lang, 'openSession'),
              onClick: (event) => {
                event.stopPropagation()
                onSession(command)
              },
            }, h('svg', { width: 13, height: 13, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.75, strokeLinecap: 'round', strokeLinejoin: 'round' },
              h('path', { d: 'M7 17L17 7M9 7h8v8' })))),
          h('p', { className: 'dsh-im-cmddesc' }, commandDesc(lang, command)),
          copied === command.name ? h('span', { className: 'dsh-im-copied' }, tr(lang, 'copied')) : null))))
    }

    function RulesSection(props) {
      const lang = useLang()
      const [open, setOpen] = React.useState(props.initialOpen !== false)
      const [query, setQuery] = React.useState('')

      const rules = props.rules
      const needle = query.trim().toLowerCase()
      const matched = needle === ''
        ? rules
        : rules.filter((rule) => [
          rule.id,
          rule.name,
          rule.nameZh,
          rule.category,
          categoryLabel(lang, rule.category),
          rule.description,
          rule.descriptionZh,
          ...(rule.scopes || []),
        ].filter((part) => typeof part === 'string').join(' ').toLowerCase().includes(needle))

      const ruleItems = matched.map((rule) => h('li', { className: 'dsh-im-rule', key: rule.id },
        h(Dot, { tone: rule.severity === 'advisory' ? 'info' : rule.severity === 'error' ? 'error' : 'warn' }),
        h('div', { className: 'dsh-im-rulebody' },
          h('div', { className: 'dsh-im-ruletop' },
            h('span', { className: 'dsh-im-rulename' }, ruleName(lang, rule)),
            h('code', { className: 'dsh-im-ruleid' }, rule.id),
            h('span', { className: `dsh-im-rulecat dsh-im-rulecat-${rule.category}` }, categoryLabel(lang, rule.category))),
          h('p', { className: 'dsh-im-ruledesc', title: ruleDesc(lang, rule) }, ruleDesc(lang, rule)))))

      return h('section', { className: 'dsh-im-sec' },
        h('div', { className: 'dsh-im-sechead' },
          h('span', { className: 'dsh-im-num' }, '03'),
          h('h2', { className: 'dsh-im-sectitle' }, tr(lang, 'rules')),
          h('span', { className: 'dsh-im-sechint' }, tr(lang, 'rulesHint', { n: rules.length })),
          h('button', {
            type: 'button',
            className: 'dsh-im-link',
            onClick: () => setOpen((value) => !value),
          }, open ? tr(lang, 'showLess') : tr(lang, 'showAll', { n: rules.length }))),
        open ? h(React.Fragment, null,
          h('div', { className: 'dsh-im-search dsh-im-search-sm' },
            h('input', {
              className: 'dsh-im-input dsh-im-input-sm',
              value: query,
              placeholder: tr(lang, 'rulesSearch'),
              spellCheck: false,
              onChange: (event) => setQuery(event.target.value),
            })),
          h('ul', { className: 'dsh-im-rules' }, ruleItems)) : null)
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
        h('header', { className: 'dsh-im-hero' },
          h('span', { className: 'dsh-im-tag' }, tr(lang, 'eyebrow')),
          h('h1', { className: 'dsh-im-title' }, tr(lang, 'title')),
          h('p', { className: 'dsh-im-lede' }, tr(lang, 'lede')),
          h('div', { className: 'dsh-im-meta' },
            h('span', { className: 'dsh-im-metaitem' },
              `${tr(lang, 'badgeSkill')} `,
              h('b', null, data && data.skill.version ? data.skill.version : '—')),
            h('span', { className: 'dsh-im-metaitem' },
              `${tr(lang, 'badgeEngine')} `,
              h('b', null, data && data.engine.found
                ? data.engine.version
                : (data && data.engine.pending ? '…' : '—'))),
            h('span', { className: 'dsh-im-metaitem' },
              h('b', null, data && data.rules.length > 0 ? data.rules.length : '—'),
              ` ${tr(lang, 'badgeRules')}`))),

        h('div', { className: 'dsh-im-body' },
          catalog.status === 'loading' ? h('p', { className: 'dsh-im-hint dsh-im-pad' }, '…') : null,
          catalog.status === 'error' ? h('p', { className: 'dsh-im-error dsh-im-pad' }, catalog.error) : null,
          enginePending ? h('p', { className: 'dsh-im-hint dsh-im-pad' }, tr(lang, 'enginePending')) : null,
          engineMissing ? h('p', { className: 'dsh-im-error dsh-im-pad' }, tr(lang, 'engineMissing')) : null,
          skillMissing ? h('p', { className: 'dsh-im-error dsh-im-pad' }, tr(lang, 'skillMissing')) : null,
          data ? h(ScanSection, { onScanned: reloadCatalog, rules: data.rules }) : null,
          data && data.commands.length > 0
            ? h(CommandsSection, { commands: data.commands, skillDir: data.skill.dir })
            : null,
          data && data.rules.length > 0 ? h(RulesSection, { rules: data.rules }) : null),

        h('footer', { className: 'dsh-im-foot' },
          h('span', { className: 'dsh-im-footmark' }, 'impeccable'),
          h('span', { className: 'dsh-im-footinfo' },
            data
              ? `${data.skill.version || '—'} · ${data.engine.found ? data.engine.version : '—'} · ${data.rules.length} ${tr(lang, 'badgeRules')}`
              : 'offline')))
    }

    // ---------------------------------------------------------------------
    // 样式：只用 --dsw-* 主题 token，明暗自动跟随
    // ---------------------------------------------------------------------

    const STYLE = `
.dsh-im-root { position: relative; display: flex; flex-direction: column; height: 100%; min-height: 0; background: var(--dsw-alias-bg-base); color: var(--dsw-alias-label-primary); font-family: -apple-system, BlinkMacSystemFont, "Helvetica Neue", "PingFang SC", "Noto Sans SC", sans-serif; font-size: 12.5px; line-height: 1.55; -webkit-font-smoothing: antialiased; font-variant-numeric: tabular-nums; }

/* 头部：方括号标签 + 衬线大字标题，像一本刊物的扉页 */
.dsh-im-hero { position: relative; flex: none; overflow: hidden; padding: 22px 28px 16px; border-bottom: 1px solid var(--dsw-alias-border-l1); }
.dsh-im-hero::before { content: ''; position: absolute; left: 0; top: 0; right: 0; height: 2px; background: linear-gradient(90deg, var(--dsw-alias-brand-primary) 0 84px, var(--dsw-alias-border-l1) 84px); }
.dsh-im-hero::after { content: 'IMPECCABLE'; position: absolute; right: 38px; bottom: -12px; font-family: "Songti SC", "Noto Serif SC", Georgia, serif; font-size: 58px; font-weight: 500; line-height: 1; letter-spacing: 0.05em; color: var(--dsw-alias-brand-primary); opacity: 0.055; pointer-events: none; user-select: none; white-space: nowrap; }
.dsh-im-tag { display: inline-block; font-size: 10px; font-weight: 500; letter-spacing: 0.16em; text-transform: uppercase; color: var(--dsw-alias-label-tertiary); }
.dsh-im-tag::before { content: '['; margin-right: 0.6em; }
.dsh-im-tag::after { content: ']'; margin-left: 0.6em; }
.dsh-im-title { margin: 10px 0 0; font-family: "Songti SC", "Noto Serif SC", "Source Han Serif SC", "Songti TC", Georgia, "Times New Roman", serif; font-size: 26px; font-weight: 500; line-height: 1.15; letter-spacing: 0.01em; }
.dsh-im-lede { margin: 9px 0 0; max-width: 60ch; font-size: 12px; line-height: 1.6; color: var(--dsw-alias-label-tertiary); }
.dsh-im-meta { display: flex; flex-wrap: wrap; gap: 5px 18px; margin-top: 12px; }
.dsh-im-metaitem { font-size: 10.5px; letter-spacing: 0.02em; color: var(--dsw-alias-label-tertiary); }
.dsh-im-metaitem b { font-family: ui-monospace, SFMono-Regular, Menlo, monospace; font-weight: 500; font-size: 11px; letter-spacing: 0.02em; color: var(--dsw-alias-label-secondary); }

.dsh-im-body { flex: 1; min-height: 0; overflow: auto; padding: 0 28px 40px; }

/* 区块：编号 + 标题 + 右侧说明，下压一条细线 */
.dsh-im-sec { padding-top: 22px; }
.dsh-im-sechead { display: flex; align-items: baseline; gap: 11px; padding-bottom: 9px; border-bottom: 1px solid var(--dsw-alias-border-l1); }
.dsh-im-num { flex: none; font-family: "Songti SC", "Noto Serif SC", Georgia, serif; font-size: 19px; font-weight: 500; line-height: 1; letter-spacing: 0.01em; color: var(--dsw-alias-brand-primary); }
.dsh-im-sectitle { margin: 0; font-size: 14px; font-weight: 600; letter-spacing: 0.02em; white-space: nowrap; }
.dsh-im-sechint { margin-left: auto; font-size: 10.5px; color: var(--dsw-alias-label-tertiary); text-align: right; }

/* 输入行：直角，聚焦时整条线变亮 */
.dsh-im-search { display: flex; margin-top: 14px; }
.dsh-im-search-sm { margin-top: 11px; }
.dsh-im-input { flex: 1; min-width: 0; height: 32px; padding: 0 10px; border: 1px solid var(--dsw-alias-border-l2); border-right: none; border-radius: 0; background: transparent; color: var(--dsw-alias-label-primary); font-family: inherit; font-size: 12px; outline: none; transition: border-color 0.15s ease; }
.dsh-im-input:focus { border-color: var(--dsw-alias-label-secondary); }
.dsh-im-input::placeholder { color: var(--dsw-alias-label-tertiary); }
.dsh-im-input-sm { height: 28px; }
.dsh-im-btn { height: 32px; padding: 0 16px; border: 1px solid var(--dsw-alias-label-primary); border-radius: 0; background: var(--dsw-alias-label-primary); color: var(--dsw-alias-bg-base); font-family: inherit; font-size: 11.5px; font-weight: 500; letter-spacing: 0.06em; white-space: nowrap; cursor: pointer; transition: opacity 0.15s ease; }
.dsh-im-btn:hover:not(:disabled) { opacity: 0.82; }
.dsh-im-btn:disabled { border-color: var(--dsw-alias-border-l2); background: transparent; color: var(--dsw-alias-label-tertiary); cursor: default; }

.dsh-im-pad { margin: 11px 0 0; }
.dsh-im-hint { margin: 0; font-size: 11.5px; line-height: 1.6; color: var(--dsw-alias-label-tertiary); }
.dsh-im-error { margin: 0; font-size: 11.5px; color: var(--dsw-alias-state-error-primary); word-break: break-word; }
.dsh-im-ok { margin: 0; font-size: 12px; letter-spacing: 0.02em; color: var(--dsw-alias-state-success-primary); }
.dsh-im-bar { display: block; position: relative; height: 2px; overflow: hidden; background: var(--dsw-alias-border-l1); }
.dsh-im-bar::after { content: ''; position: absolute; top: 0; bottom: 0; width: 28%; background: var(--dsw-alias-label-primary); animation: dsh-im-slide 1.1s ease-in-out infinite; }
@keyframes dsh-im-slide { 0% { transform: translateX(-110%); } 100% { transform: translateX(360%); } }

/* 统计块：大字数字 + 小字标签，块之间只用竖线 */
.dsh-im-metrics { display: flex; flex-wrap: wrap; margin-top: 16px; border: 1px solid var(--dsw-alias-border-l1); }
.dsh-im-metric { position: relative; flex: 1 1 0; min-width: 88px; padding: 10px 13px 9px; border-left: 1px solid var(--dsw-alias-border-l1); }
.dsh-im-metric::before { content: ''; position: absolute; left: 0; top: 0; right: 0; height: 2px; background: var(--dsw-alias-border-l2); }
.dsh-im-metric:first-child { border-left: none; }
.dsh-im-metricv { font-family: ui-monospace, SFMono-Regular, Menlo, monospace; font-size: 20px; font-weight: 400; line-height: 1; letter-spacing: -0.03em; }
.dsh-im-metricu { margin-left: 4px; font-size: 10.5px; letter-spacing: 0; color: var(--dsw-alias-label-tertiary); }
.dsh-im-metricl { margin-top: 5px; font-size: 9.5px; letter-spacing: 0.1em; text-transform: uppercase; color: var(--dsw-alias-label-tertiary); }
.dsh-im-metric-brand .dsh-im-metricv { color: var(--dsw-alias-brand-primary); }
.dsh-im-metric-brand::before { background: var(--dsw-alias-brand-primary); }
.dsh-im-metric-warn .dsh-im-metricv { color: var(--dsw-alias-state-warn-primary); }
.dsh-im-metric-warn::before { background: var(--dsw-alias-state-warn-primary); }
.dsh-im-metric-mute .dsh-im-metricv { color: var(--dsw-alias-label-secondary); }

/* 问题：一条竖线标明严重程度，正文靠缩进分层 */
.dsh-im-findings { margin-top: 16px; }
.dsh-im-finding { padding: 11px 0 11px 13px; border-top: 1px solid var(--dsw-alias-border-l1); border-left: 2px solid var(--dsw-alias-state-warn-primary); }
.dsh-im-finding-info { border-left-color: var(--dsw-alias-border-l2); }
.dsh-im-findinghead { display: flex; align-items: baseline; gap: 9px; }
.dsh-im-findingname { font-size: 12.5px; font-weight: 600; letter-spacing: 0.005em; }
.dsh-im-count { margin-left: auto; font-family: ui-monospace, SFMono-Regular, Menlo, monospace; font-size: 10.5px; color: var(--dsw-alias-label-tertiary); }
.dsh-im-findingdesc { margin: 4px 0 0; max-width: 96ch; font-size: 11.5px; line-height: 1.55; color: var(--dsw-alias-label-tertiary); }
.dsh-im-locations { margin: 7px 0 0; padding: 0; list-style: none; display: flex; flex-direction: column; gap: 2px; }
.dsh-im-location { display: flex; align-items: baseline; gap: 10px; min-width: 0; }
.dsh-im-file { flex: none; font-family: ui-monospace, SFMono-Regular, Menlo, monospace; font-size: 10px; letter-spacing: 0.01em; color: var(--dsw-alias-label-secondary); white-space: nowrap; }
.dsh-im-snippet { font-size: 10.5px; color: var(--dsw-alias-label-tertiary); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

/* 分类：方正小按钮，选中的反白 */
.dsh-im-chips { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 13px; }
.dsh-im-chip { height: 25px; padding: 0 10px; border: 1px solid var(--dsw-alias-border-l2); border-radius: 0; background: transparent; color: var(--dsw-alias-label-secondary); font-family: inherit; font-size: 11px; letter-spacing: 0.02em; cursor: pointer; transition: color 0.15s ease, border-color 0.15s ease, background 0.15s ease; }
.dsh-im-chip:hover { border-color: var(--dsw-alias-label-secondary); color: var(--dsw-alias-label-primary); }
.dsh-im-chip-on, .dsh-im-chip-on:hover { background: var(--dsw-alias-label-primary); border-color: var(--dsw-alias-label-primary); color: var(--dsw-alias-bg-base); }

/* 命令卡：细边框的方格，悬停整块提亮 */
.dsh-im-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(186px, 1fr)); gap: 8px; margin-top: 13px; }
.dsh-im-cmd { position: relative; display: flex; flex-direction: column; gap: 5px; min-width: 0; padding: 10px 11px 11px; border: 1px solid var(--dsw-alias-border-l1); background: transparent; cursor: pointer; transition: border-color 0.15s ease, background 0.15s ease; }
.dsh-im-cmd:hover { border-color: var(--dsw-alias-label-secondary); background: var(--dsw-alias-interactive-bg-hover); }
.dsh-im-cmd::before { content: '+'; position: absolute; left: 5px; bottom: 1px; font-family: ui-monospace, SFMono-Regular, Menlo, monospace; font-size: 10px; line-height: 1; color: var(--dsw-alias-border-l2); pointer-events: none; transition: color 0.15s ease; }
.dsh-im-cmd:hover::before { color: var(--dsw-alias-brand-primary); }
.dsh-im-cmd::after { content: ''; position: absolute; left: -1px; right: -1px; bottom: -1px; height: 2px; background: var(--dsw-alias-brand-primary); transform: scaleX(0); transform-origin: left center; transition: transform 0.18s ease; }
.dsh-im-cmd:hover::after { transform: scaleX(1); }
.dsh-im-cmd-on { border-color: var(--dsw-alias-state-success-primary); }
.dsh-im-cmdtop { display: flex; align-items: baseline; gap: 6px; }
.dsh-im-cmdname { font-family: ui-monospace, SFMono-Regular, Menlo, monospace; font-size: 12px; font-weight: 500; letter-spacing: -0.01em; color: var(--dsw-alias-label-primary); white-space: nowrap; }
.dsh-im-cmdhint { font-family: ui-monospace, SFMono-Regular, Menlo, monospace; font-size: 10px; color: var(--dsw-alias-label-tertiary); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.dsh-im-cmdopen { align-self: center; margin-left: auto; display: flex; flex: none; align-items: center; justify-content: center; width: 16px; height: 16px; border: none; background: transparent; color: var(--dsw-alias-label-tertiary); cursor: pointer; opacity: 0.45; transition: opacity 0.15s ease, color 0.15s ease; }
.dsh-im-cmd:hover .dsh-im-cmdopen { opacity: 1; }
.dsh-im-cmdopen:hover { color: var(--dsw-alias-label-primary); }
.dsh-im-cmddesc { margin: 0; font-size: 11px; line-height: 1.5; color: var(--dsw-alias-label-tertiary); display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
.dsh-im-copied { position: absolute; top: 8px; right: 8px; font-family: ui-monospace, SFMono-Regular, Menlo, monospace; font-size: 10px; letter-spacing: 0.1em; color: var(--dsw-alias-state-success-primary); }

.dsh-im-link { border: none; border-bottom: 1px solid var(--dsw-alias-border-l2); background: transparent; color: var(--dsw-alias-label-secondary); font-family: inherit; font-size: 10.5px; letter-spacing: 0.04em; padding: 0 0 1px; white-space: nowrap; cursor: pointer; }
.dsh-im-link:hover { color: var(--dsw-alias-label-primary); border-bottom-color: var(--dsw-alias-label-primary); }

/* 规则目录：每行一条横线，像索引 */
.dsh-im-rules { display: grid; grid-template-columns: repeat(auto-fill, minmax(360px, 1fr)); column-gap: 26px; margin: 13px 0 0; padding: 0; list-style: none; }
.dsh-im-rule { display: flex; gap: 8px; align-items: flex-start; min-width: 0; padding: 7px 8px 7px 0; border-top: 1px solid var(--dsw-alias-border-l1); }
.dsh-im-rule:hover { background: var(--dsw-alias-interactive-bg-hover); }
.dsh-im-rulebody { min-width: 0; display: flex; flex-direction: column; gap: 3px; }
.dsh-im-ruletop { display: flex; align-items: baseline; gap: 11px; min-width: 0; }
.dsh-im-ruleid { flex: none; font-family: ui-monospace, SFMono-Regular, Menlo, monospace; font-size: 10px; letter-spacing: 0.02em; color: var(--dsw-alias-label-tertiary); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.dsh-im-rulecat { flex: none; margin-left: auto; font-size: 9px; letter-spacing: 0.08em; color: var(--dsw-alias-label-tertiary); border: 1px solid var(--dsw-alias-border-l1); padding: 0 4px; }
.dsh-im-rulecat-slop { border-color: color-mix(in srgb, var(--dsw-alias-brand-primary) 42%, transparent); color: var(--dsw-alias-brand-primary); }
.dsh-im-rulename { flex: none; font-size: 12px; font-weight: 600; letter-spacing: 0.005em; }
.dsh-im-ruledesc { margin: 0; font-size: 11px; line-height: 1.5; color: var(--dsw-alias-label-tertiary); display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
.dsh-im-dot { flex: none; width: 4px; height: 4px; margin-top: 6px; background: var(--dsw-alias-state-warn-primary); }
.dsh-im-dot-info { background: var(--dsw-alias-label-tertiary); }
.dsh-im-dot-error { background: var(--dsw-alias-state-error-primary); }

.dsh-im-foot { flex: none; display: flex; align-items: center; justify-content: space-between; gap: 16px; padding: 7px 28px 8px; border-top: 1px solid var(--dsw-alias-border-l1); }
.dsh-im-footmark { position: relative; padding-left: 13px; font-family: ui-monospace, SFMono-Regular, Menlo, monospace; font-size: 9px; letter-spacing: 0.22em; text-transform: uppercase; color: var(--dsw-alias-label-tertiary); }
.dsh-im-footmark::before { content: ''; position: absolute; left: 0; top: 50%; width: 7px; height: 2px; background: var(--dsw-alias-brand-primary); transform: translateY(-50%); }
.dsh-im-footinfo { font-family: ui-monospace, SFMono-Regular, Menlo, monospace; font-size: 9px; letter-spacing: 0.1em; text-transform: uppercase; color: var(--dsw-alias-label-tertiary); }

.dsh-im-body::-webkit-scrollbar { width: 8px; }
.dsh-im-body::-webkit-scrollbar-thumb { background: var(--dsw-alias-border-l2); border: 2px solid transparent; background-clip: content-box; }
.dsh-im-body::-webkit-scrollbar-track { background: transparent; }

@media (max-width: 760px) {
  .dsh-im-hero { padding: 18px 18px 14px; }
  .dsh-im-title { font-size: 21px; }
  .dsh-im-body { padding: 0 18px 32px; }
  .dsh-im-grid { grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); }
}
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
    exports.__parts = { StudioIcon, StudioPanel, ScanSection, CommandsSection, RulesSection, memory, setLang, STYLE }
    return module.exports
  },
})
