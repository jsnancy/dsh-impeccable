// dsh-impeccable · 浏览器半边
//
//   - 左侧栏加一个「设计校审台」图标，点击进主区域的审校面板
//   - 面板顶部：输入框置顶，选一个页面或填一个路径 / 网址，一按就查
//   - 面板中间：24 条命令，点一下复制提示词，点右上角箭头直接开新对话
//   - 面板下半：62 条规则目录，可搜索
//   - 左栏底部：中英文切换、自动 / 浅色 / 深色主题切换，都记在 localStorage
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
    const STORAGE_LANG = 'dsh-impeccable:lang'
    const STORAGE_THEME = 'dsh-impeccable:theme'

    function readStore(key) {
      try {
        return window.localStorage.getItem(key)
      } catch {
        return null
      }
    }

    function writeStore(key, value) {
      try {
        window.localStorage.setItem(key, value)
      } catch {
        // 存不下就算了
      }
    }

    // ---------------------------------------------------------------------
    // 文案
    // ---------------------------------------------------------------------

    const TEXT = {
      zh: {
        title: '设计校审台',
        lede: '不用记命令，不用背规则。选一个页面，按一下，就知道哪里让人看不清、哪里排版乱。',
        statRules: '条规则',
        statCommands: '条命令',
        statCats: '个分类',
        statEngine: '引擎',
        railGroup: '审校',
        navCheck: '审校台',
        navCommands: '命令',
        navRules: '检查项',
        prefsGroup: '显示',
        langLabel: '语言',
        themeLabel: '主题',
        themeAuto: '自动',
        themeLight: '浅色',
        themeDark: '深色',
        enginePending: '引擎首次运行要下载约 21 MB，正在后台进行；下载完成后即可检查。',
        engineMissing: '找不到 impeccable 引擎：重装插件，或用 IMPECCABLE_BIN 指向已有二进制。',
        skillMissing: '插件自带的技能文件缺失，重装插件即可恢复。',
        step1: '选一个要看的页面',
        step2: '检查结果',
        pagesCount: '{n} 个页面',
        refresh: '刷新',
        refreshBusy: '刷新中…',
        loading: '正在找你最近改过的网页…',
        noTargets: '没找到现成的网页文件。在上面的输入框填一个路径或网址也可以。',
        searchTargets: '筛选页面…',
        recentPages: '最近改过的网页',
        noMatch: '没有匹配的页面，换个词试试。',
        runThis: '检查这个页面',
        pickHint: '点下面的页面直接检查，也可以粘贴网址或完整路径。',
        targetPlaceholder: '粘贴网址，或填文件的完整路径',
        checkAction: '开始检查',
        checking: '检查中…',
        resultIdleTitle: '还没有检查结果',
        resultIdleBody: '选一个页面，或在上面的输入框里填路径 / 网址，点「开始检查」。',
        resultRunning: '正在检查 {target}…',
        found: '发现 {n} 处问题',
        cleanTitle: '没有发现问题',
        cleanBody: '这个页面的文字、间距、配色都过了 62 条检查。换一个页面继续。',
        recheck: '再检查一次',
        resultFailed: '检查失败',
        retry: '重试',
        metricFindings: '处问题',
        metricSpeed: '耗时',
        warning: '警告',
        advisory: '提示',
        linesAt: '第 {lines} 行',
        moreFiles: '还有 {n} 个文件',
        fixIt: '让 AI 帮我改',
        fixPrompt: '用 impeccable 技能修一下 {file}：{name}。{desc}\n\n技能文档在 {dir}/SKILL.md，先读它（含 Setup），再动手。',
        toolsTitle: '更多工具',
        toolsHint: '{n} 个动作，小白可以先不看',
        showAll: '展开 {n} 条',
        showLess: '收起',
        all: '全部',
        copied: '已复制',
        openSession: '开新对话',
        prompt: (name, hint, dir) =>
          `用 impeccable 的 ${name} 命令${hint ? `（${hint}）` : ''}，目标是我当前在做的界面。技能文档在 ${dir}/SKILL.md，先读它（含 Setup：读项目和设计上下文），再按 ${dir}/reference/${name}.md 执行。`,
        rulesTitle: '检查项清单',
        rulesHint2: '{n} 条，看看它到底在查什么',
        rulesSearch: '搜索规则、分类或说明…',
        catQuality: '质量',
        catSlop: '套路',
        justNow: '刚刚',
      },
      en: {
        title: 'Design Review Desk',
        lede: 'No commands to memorize, no rules to learn. Pick a page, press one button, and see what is hard to read or badly spaced.',
        statRules: 'rules',
        statCommands: 'commands',
        statCats: 'categories',
        statEngine: 'engine',
        railGroup: 'Review',
        navCheck: 'Desk',
        navCommands: 'Commands',
        navRules: 'Rules',
        prefsGroup: 'Display',
        langLabel: 'Language',
        themeLabel: 'Theme',
        themeAuto: 'Auto',
        themeLight: 'Light',
        themeDark: 'Dark',
        enginePending: 'First run downloads the engine (about 21 MB) in the background; checking works once it lands.',
        engineMissing: 'No impeccable engine found. Reinstall the plugin, or point IMPECCABLE_BIN at one.',
        skillMissing: 'The bundled skill files are missing. Reinstalling the plugin restores them.',
        step1: 'Pick a page',
        step2: 'Result',
        pagesCount: '{n} pages',
        refresh: 'Refresh',
        refreshBusy: 'Refreshing…',
        loading: 'Looking for pages you worked on recently…',
        noTargets: 'No HTML files around. Type a path or URL in the field above instead.',
        searchTargets: 'Filter pages…',
        recentPages: 'Pages edited recently',
        noMatch: 'No page matches that word.',
        runThis: 'Check this page',
        pickHint: 'Click a page below to check it, or paste a URL or full path.',
        targetPlaceholder: 'Paste a URL, or the full path to a file',
        checkAction: 'Check page',
        checking: 'Checking…',
        resultIdleTitle: 'No results yet',
        resultIdleBody: 'Pick a page, or paste a path or URL above, then press Check.',
        resultRunning: 'Checking {target}…',
        found: '{n} problems found',
        cleanTitle: 'Nothing found',
        cleanBody: 'This page passed all 62 checks. Try another one.',
        recheck: 'Check again',
        resultFailed: 'Check failed',
        retry: 'Retry',
        metricFindings: 'findings',
        metricSpeed: 'took',
        warning: 'warning',
        advisory: 'advisory',
        linesAt: 'line {lines}',
        moreFiles: '{n} more files',
        fixIt: 'Have AI fix it',
        fixPrompt: 'Fix this with the impeccable skill: {file} — {name}. {desc}\n\nThe skill lives at {dir}/SKILL.md; read it first (including Setup), then act.',
        toolsTitle: 'More tools',
        toolsHint: '{n} actions — beginners can skip this',
        showAll: 'Show {n}',
        showLess: 'Show less',
        all: 'All',
        copied: 'Copied',
        openSession: 'New session',
        prompt: (name, hint, dir) =>
          `Run the impeccable ${name} command${hint ? ` (${hint})` : ''} on the interface I am working on. The skill docs live in ${dir}: read ${dir}/SKILL.md first (its Setup section covers project and design context), then ${dir}/reference/${name}.md.`,
        rulesTitle: 'What it checks',
        rulesHint2: '{n} rules, if you want to know the details',
        rulesSearch: 'Search rules, categories or descriptions…',
        catQuality: 'quality',
        catSlop: 'slop',
        justNow: 'just now',
      },
    }

    const LANG_STORED = readStore(STORAGE_LANG)
    let LANG = LANG_STORED === 'en' ? 'en' : 'zh'
    let LANG_MANUAL = LANG_STORED === 'en' || LANG_STORED === 'zh'
    const langListeners = new Set()

    function setLang(next, manual) {
      const value = next === 'en' ? 'en' : 'zh'
      if (manual === true) {
        LANG_MANUAL = true
        writeStore(STORAGE_LANG, value)
      }
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

    // ---------------------------------------------------------------------
    // 主题：自动跟随 DSH，也可以自己锁成浅色 / 深色
    // ---------------------------------------------------------------------

    function readTheme() {
      const stored = readStore(STORAGE_THEME)
      return stored === 'light' || stored === 'dark' ? stored : 'auto'
    }

    function readHostDark() {
      try {
        if (document.body && document.body.hasAttribute('data-ds-dark-theme')) return true
        const root = document.documentElement
        if (root && root.getAttribute('data-ds-theme-source') === 'dark') return true
      } catch {
        // 读不到就当浅色
      }
      return false
    }

    function useTheme() {
      const [mode, setMode] = React.useState(readTheme)
      const [hostDark, setHostDark] = React.useState(readHostDark)

      React.useEffect(() => {
        let observer = null
        try {
          observer = new MutationObserver(() => setHostDark(readHostDark()))
          if (document.body) {
            observer.observe(document.body, { attributes: true, attributeFilter: ['data-ds-dark-theme'] })
          }
          if (document.documentElement) {
            observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-ds-theme-source'] })
          }
        } catch {
          observer = null
        }
        return () => {
          if (observer !== null) observer.disconnect()
        }
      }, [])

      const effective = mode === 'auto' ? (hostDark ? 'dark' : 'light') : mode
      const choose = React.useCallback((next) => {
        const value = next === 'light' || next === 'dark' ? next : 'auto'
        writeStore(STORAGE_THEME, value)
        setMode(value)
      }, [])

      return [mode, effective, choose]
    }

    // 切走面板再回来时保留输入和上一次检查结果
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

    function targetDir(item) {
      if (item && typeof item.dirLabel === 'string' && item.dirLabel !== '') return item.dirLabel
      const label = String((item && item.label) || '')
      const name = String((item && item.name) || '')
      const dir = name !== '' && label.endsWith(`/${name}`) ? label.slice(0, -(name.length + 1)) : label
      return dir === '' ? '~' : `~/${dir}`
    }

    function relTime(lang, stamp) {
      const value = Number(stamp)
      if (!Number.isFinite(value) || value <= 0) return ''
      const diff = Date.now() - value
      if (diff < 60000) return tr(lang, 'justNow')
      const locale = lang === 'zh' ? 'zh-Hans' : 'en'
      try {
        const format = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' })
        if (diff < 3600000) return format.format(-Math.round(diff / 60000), 'minute')
        if (diff < 86400000) return format.format(-Math.round(diff / 3600000), 'hour')
        if (diff < 2592000000) return format.format(-Math.round(diff / 86400000), 'day')
        return new Date(value).toLocaleDateString(lang === 'zh' ? 'zh-CN' : 'en-US', { month: 'short', day: 'numeric' })
      } catch {
        return new Date(value).toLocaleDateString()
      }
    }

    function clockTime(lang, stamp) {
      const value = Number(stamp)
      if (!Number.isFinite(value) || value <= 0) return ''
      try {
        return new Date(value).toLocaleTimeString(lang === 'zh' ? 'zh-CN' : 'en-US', {
          hour: '2-digit',
          minute: '2-digit',
        })
      } catch {
        return ''
      }
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
    function commandAction(lang, name) {
      const table = lang === 'zh' ? COMMAND_ACTION : COMMAND_ACTION_EN
      return typeof table[name] === 'string' ? table[name] : name
    }

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
      return h('img', {
        className: 'dsh-im-icon',
        src: '/impeccable/icon.png',
        alt: '',
        width: size,
        height: size,
        loading: 'lazy',
      })
    }

    function ArrowIcon() {
      return h('svg', {
        width: 13,
        height: 13,
        viewBox: '0 0 24 24',
        fill: 'none',
        stroke: 'currentColor',
        strokeWidth: 2,
        strokeLinecap: 'round',
        strokeLinejoin: 'round',
        'aria-hidden': 'true',
      }, h('path', { d: 'M7 17 17 7M9 7h8v8' }))
    }

    function SearchIcon() {
      return h('svg', {
        width: 16,
        height: 16,
        viewBox: '0 0 24 24',
        fill: 'none',
        stroke: 'currentColor',
        strokeWidth: 1.8,
        strokeLinecap: 'round',
        'aria-hidden': 'true',
      }, h('circle', { cx: 11, cy: 11, r: 7 }), h('path', { d: 'M20 20l-4-4' }))
    }

    function SunIcon() {
      return h('svg', {
        viewBox: '0 0 24 24',
        width: 14,
        height: 14,
        fill: 'none',
        stroke: 'currentColor',
        strokeWidth: 1.8,
        strokeLinecap: 'round',
        'aria-hidden': 'true',
      },
      h('circle', { cx: 12, cy: 12, r: 4 }),
      h('path', { d: 'M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M19.1 4.9l-1.4 1.4M6.3 17.7l-1.4 1.4' }))
    }

    function MoonIcon() {
      return h('svg', {
        viewBox: '0 0 24 24',
        width: 14,
        height: 14,
        fill: 'none',
        stroke: 'currentColor',
        strokeWidth: 1.8,
        strokeLinecap: 'round',
        strokeLinejoin: 'round',
        'aria-hidden': 'true',
      }, h('path', { d: 'M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z' }))
    }

    function AutoIcon() {
      return h('svg', {
        viewBox: '0 0 24 24',
        width: 14,
        height: 14,
        fill: 'none',
        stroke: 'currentColor',
        strokeWidth: 1.8,
        'aria-hidden': 'true',
      },
      h('circle', { cx: 12, cy: 12, r: 8 }),
      h('path', { d: 'M12 4a8 8 0 0 1 0 16Z', fill: 'currentColor', stroke: 'none' }))
    }

    function EmptyMark() {
      return h('svg', {
        viewBox: '0 0 24 24',
        width: 18,
        height: 18,
        fill: 'none',
        stroke: 'currentColor',
        strokeWidth: 1.7,
        strokeLinecap: 'round',
        'aria-hidden': 'true',
      }, h('circle', { cx: 11, cy: 11, r: 7 }), h('path', { d: 'M20 20l-4-4M7.5 11h7' }))
    }

    // ---------------------------------------------------------------------
    // 分段控件
    // ---------------------------------------------------------------------

    function SegGroup(props) {
      return h('div', {
        className: 'dsh-im-seg',
        role: 'group',
        'aria-label': props.label,
      }, props.children)
    }

    function SegButton(props) {
      return h('button', {
        type: 'button',
        className: props.active ? 'dsh-im-segbtn dsh-im-segbtn-on' : 'dsh-im-segbtn',
        title: props.title,
        'aria-label': props.title,
        'aria-pressed': props.active === true,
        onClick: props.onClick,
      }, props.children)
    }

    // ---------------------------------------------------------------------
    // 面板
    // ---------------------------------------------------------------------

    function Dot(props) {
      return h('span', { className: `dsh-im-dot dsh-im-dot-${props.tone || 'warn'}`, 'aria-hidden': 'true' })
    }

    // 中文动作名：小白看得懂他在干什么，英文命令名只当脚注
    const COMMAND_ACTION = {
      craft: '做点新东西',
      shape: '先规划再动手',
      init: '写产品说明',
      document: '补设计文档',
      extract: '整理成组件',
      critique: '挑毛病',
      audit: '全面检查',
      polish: '收尾打磨',
      bolder: '再大胆些',
      quieter: '收敛一些',
      distill: '去繁就简',
      harden: '加固边界情况',
      onboard: '做新手引导',
      animate: '加点动效',
      colorize: '加点颜色',
      typeset: '调字体字号',
      layout: '调间距对齐',
      delight: '加点趣味',
      overdrive: '突破常规',
      clarify: '把话说清楚',
      adapt: '适配手机屏',
      optimize: '调性能',
      live: '边看边改',
      generate: '一次出几个方案',
    }

    const COMMAND_ACTION_EN = {
      craft: 'Build something new',
      shape: 'Plan before building',
      init: 'Write the product brief',
      document: 'Document the design',
      extract: 'Pull out components',
      critique: 'Find what is weak',
      audit: 'Run a full audit',
      polish: 'Final polish',
      bolder: 'Turn up the volume',
      quieter: 'Calm it down',
      distill: 'Cut to essentials',
      harden: 'Handle edge cases',
      onboard: 'Design onboarding',
      animate: 'Add motion',
      colorize: 'Add color',
      typeset: 'Tune the type',
      layout: 'Fix spacing and alignment',
      delight: 'Add a moment of joy',
      overdrive: 'Break the pattern',
      clarify: 'Make it legible',
      adapt: 'Adapt to mobile',
      optimize: 'Tune performance',
      live: 'Iterate live',
      generate: 'Generate options',
    }

    // 两步：选一个页面（输入框永远在最上面）→ 看结果并让 AI 去改。
    function CheckSection(props) {
      const lang = useLang()
      const [target, setTarget] = React.useState(loadTarget)
      const [targets, setTargets] = React.useState(Array.isArray(props.initialTargets) ? props.initialTargets : null)
      const [loadingTargets, setLoadingTargets] = React.useState(false)
      const [query, setQuery] = React.useState('')
      const [scan, setScan] = React.useState(memory.scan)
      const [busy, setBusy] = React.useState(false)
      const resultRef = React.useRef(null)
      const firstRender = React.useRef(true)

      const loadTargets = React.useCallback(() => {
        setLoadingTargets(true)
        fetch(`${API}/targets`)
          .then((response) => response.json())
          .then((data) => {
            setTargets(data && Array.isArray(data.targets) ? data.targets : [])
          })
          .catch(() => setTargets([]))
          .finally(() => setLoadingTargets(false))
      }, [])

      React.useEffect(() => {
        loadTargets()
      }, [loadTargets])

      function update(next) {
        memory.scan = next
        setScan(next)
      }

      function pick(value) {
        memory.target = value
        setTarget(value)
        writeStore(STORAGE_TARGET, value)
      }

      function onChange(event) {
        pick(event.target.value)
      }

      async function run(override) {
        const value = String(override === undefined ? target : override).trim()
        if (value === '' || busy) return
        pick(value)
        setBusy(true)
        update({ status: 'running', target: value })
        try {
          const response = await fetch(`${API}/detect`, {
            method: 'POST',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify({ target: value }),
          })
          const body = await response.json()
          if (!response.ok || body.ok !== true) throw new Error(body.error || `HTTP ${response.status}`)
          update({ status: 'done', data: body, target: value, at: Date.now() })
          if (typeof props.onScanned === 'function') props.onScanned()
        } catch (error) {
          update({ status: 'error', error: String((error && error.message) || error), target: value, at: Date.now() })
        } finally {
          setBusy(false)
        }
      }

      React.useEffect(() => {
        if (firstRender.current) {
          firstRender.current = false
          return
        }
        const node = resultRef.current
        if (!node || typeof node.scrollIntoView !== 'function') return
        if (scan.status !== 'done' && scan.status !== 'error') return
        node.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }, [scan.status, scan.at])

      function onSubmit(event) {
        event.preventDefault()
        run()
      }

      const ruleMap = React.useMemo(() => {
        const map = new Map()
        const list = Array.isArray(props.rules) ? props.rules : []
        for (const rule of list) map.set(rule.id, rule)
        return map
      }, [props.rules])

      const done = scan.status === 'done'
      const total = done ? scan.data.summary.total : 0
      const groups = done ? groupFindings(scan.data.findings, ruleMap) : []

      const picks = Array.isArray(targets) ? targets : []
      const needle = query.trim().toLowerCase()
      const shown = needle === ''
        ? picks
        : picks.filter((item) => `${item.name} ${targetDir(item)}`.toLowerCase().includes(needle))

      // 第 1 步：输入框置顶，下面是可以直接点的页面
      const listbar = picks.length > 6
        ? h('div', { className: 'dsh-im-listbar' },
          h('span', { className: 'dsh-im-listhint' }, `${tr(lang, 'recentPages')} · ${picks.length}`),
          h('input', {
            className: 'dsh-im-filter',
            value: query,
            placeholder: tr(lang, 'searchTargets'),
            spellCheck: false,
            onChange: (event) => setQuery(event.target.value),
            'aria-label': tr(lang, 'searchTargets'),
          }))
        : h('div', { className: 'dsh-im-listbar' },
          h('span', { className: 'dsh-im-listhint' }, tr(lang, 'recentPages')))

      let targetBody
      if (targets === null) {
        targetBody = h('div', { className: 'dsh-im-skeleton' },
          [0, 1, 2, 3].map((index) => h('div', { className: 'dsh-im-sk', key: index })))
      } else if (picks.length === 0) {
        targetBody = h('p', { className: 'dsh-im-hint dsh-im-pad' }, tr(lang, 'noTargets'))
      } else if (shown.length === 0) {
        targetBody = h('p', { className: 'dsh-im-hint dsh-im-pad' }, tr(lang, 'noMatch'))
      } else {
        targetBody = h('div', { className: 'dsh-im-targets' }, shown.map((item) => {
          const active = target === item.path
          const card = h('div', {
            className: active ? 'dsh-im-target dsh-im-target-on' : 'dsh-im-target',
            key: item.path,
          },
          h('button', {
            type: 'button',
            className: 'dsh-im-targetmain',
            onClick: () => pick(item.path),
            onDoubleClick: () => run(item.path),
          },
          h('span', { className: 'dsh-im-targetname' }, item.name),
          h('span', { className: 'dsh-im-targetsub' },
            h('span', { className: 'dsh-im-targetdir', title: item.path }, targetDir(item)),
            h('span', { className: 'dsh-im-targettime' }, relTime(lang, item.mtime)))),
          h('button', {
            type: 'button',
            className: 'dsh-im-targetgo',
            title: tr(lang, 'runThis'),
            'aria-label': tr(lang, 'runThis'),
            onClick: (event) => {
              event.stopPropagation()
              run(item.path)
            },
          }, h(ArrowIcon)))
          return card
        }))
      }

      const step1 = h('section', { className: 'dsh-im-sec', id: 'dsh-im-sec-pick' },
        h('div', { className: 'dsh-im-sechead' },
          h('span', { className: 'dsh-im-num' }, '01'),
          h('h2', { className: 'dsh-im-sectitle' }, tr(lang, 'step1')),
          h('span', { className: 'dsh-im-sechint' }, picks.length > 0 ? tr(lang, 'pagesCount', { n: picks.length }) : ''),
          h('button', {
            type: 'button',
            className: 'dsh-im-link',
            onClick: loadTargets,
            disabled: loadingTargets,
          }, loadingTargets ? tr(lang, 'refreshBusy') : tr(lang, 'refresh'))),
        h('form', { className: 'dsh-im-picker', onSubmit },
          h('span', { className: 'dsh-im-pickericon' }, h(SearchIcon)),
          h('input', {
            className: 'dsh-im-pickerinput',
            value: target,
            placeholder: tr(lang, 'targetPlaceholder'),
            spellCheck: false,
            onChange,
            'aria-label': tr(lang, 'targetPlaceholder'),
          }),
          h('button', {
            type: 'submit',
            className: 'dsh-im-btn',
            disabled: busy || target.trim() === '',
          }, busy ? tr(lang, 'checking') : tr(lang, 'checkAction'))),
        h('p', { className: 'dsh-im-pickerhint' }, tr(lang, 'pickHint')),
        listbar,
        targetBody)

      // 第 2 步：结果
      const resultMeta = done
        ? h('div', { className: 'dsh-im-resultmeta' },
          h('span', { className: 'dsh-im-resultfile' }, shortPath(scan.target || target)),
          scan.at ? h('span', { className: 'dsh-im-tag' }, relTime(lang, scan.at)) : null,
          scan.at ? h('span', { className: 'dsh-im-tag' }, clockTime(lang, scan.at)) : null,
          h('span', { className: 'dsh-im-tag' }, `${scan.data.ms} ms`))
        : null

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
          const first = Array.isArray(group.items) && group.items.length > 0 ? group.items[0] : null
          // 同一处问题常常在一个文件里出现好几行：按文件合并，行号排成一行。
          const byFile = []
          for (const item of group.items) {
            const file = item.file || ''
            const seen = byFile.find((entry) => entry.file === file)
            if (seen) seen.lines.push(item.line)
            else byFile.push({ file, lines: [item.line] })
          }
          const shownFiles = byFile.slice(0, 2)
          return h('article', {
            className: group.severity === 'advisory' ? 'dsh-im-finding dsh-im-finding-info' : 'dsh-im-finding',
            key: group.key,
          },
          h('div', { className: 'dsh-im-findinghead' },
            h('span', { className: group.severity === 'advisory' ? 'dsh-im-fdot dsh-im-fdot-info' : 'dsh-im-fdot', 'aria-hidden': 'true' }),
            h('span', { className: 'dsh-im-findingname' }, name),
            h('span', {
              className: group.severity === 'advisory' ? 'dsh-im-sev dsh-im-sev-info' : 'dsh-im-sev dsh-im-sev-warn',
            }, tr(lang, group.severity === 'advisory' ? 'advisory' : 'warning')),
            h('span', { className: 'dsh-im-count' }, `×${group.count}`)),
          h('p', { className: 'dsh-im-findingdesc' }, desc),
          h('ul', { className: 'dsh-im-locs' }, shownFiles.map((entry, index) => {
            const lines = entry.lines.filter((line) => line > 0).slice(0, 3)
            const hidden = entry.lines.filter((line) => line > 0).length - lines.length
            const text = lines.join(lang === 'zh' ? '、' : ', ') + (hidden > 0 ? '…' : '')
            return h('li', { className: 'dsh-im-loc', key: `${entry.file}:${index}` },
              h('span', { className: 'dsh-im-locfile', title: entry.file }, shortPath(entry.file)),
              lines.length > 0 ? h('span', { className: 'dsh-im-locline' }, tr(lang, 'linesAt', { lines: text })) : null)
          })),
          byFile.length > shownFiles.length
            ? h('p', { className: 'dsh-im-more' }, tr(lang, 'moreFiles', { n: byFile.length - shownFiles.length }))
            : null,
          h('button', {
            type: 'button',
            className: 'dsh-im-fix',
            onClick: () => openSession(tr(lang, 'fixPrompt', {
              file: first ? first.file : (scan.target || target),
              name,
              desc,
              dir: props.skillDir || 'impeccable',
            })),
          }, tr(lang, 'fixIt'), h(ArrowIcon)))
        }))
        : null

      let resultBody
      if (scan.status === 'running') {
        resultBody = h('div', { className: 'dsh-im-running', role: 'status' },
          h('div', { className: 'dsh-im-bar' }),
          h('p', null, tr(lang, 'resultRunning', { target: shortPath(scan.target || target) })))
      } else if (scan.status === 'error') {
        resultBody = h('div', { className: 'dsh-im-alert' },
          h('div', { className: 'dsh-im-alerttitle' }, tr(lang, 'resultFailed')),
          h('p', { className: 'dsh-im-alertbody' }, scan.error),
          h('button', { type: 'button', className: 'dsh-im-fix', onClick: () => run() }, tr(lang, 'retry')))
      } else if (done && total === 0) {
        resultBody = h('div', { className: 'dsh-im-clean' },
          h('div', { className: 'dsh-im-cleantitle' }, tr(lang, 'cleanTitle')),
          h('p', { className: 'dsh-im-emptybody' }, tr(lang, 'cleanBody')))
      } else if (done) {
        resultBody = h(React.Fragment, null, resultMeta, metrics, findingList)
      } else {
        resultBody = h('div', { className: 'dsh-im-empty' },
          h('span', { className: 'dsh-im-emptyicon' }, h(EmptyMark)),
          h('div', null,
            h('div', { className: 'dsh-im-emptytitle' }, tr(lang, 'resultIdleTitle')),
            h('p', { className: 'dsh-im-emptybody' }, tr(lang, 'resultIdleBody'))))
      }

      const step2 = h('section', { className: 'dsh-im-sec', id: 'dsh-im-sec-result', ref: resultRef },
        h('div', { className: 'dsh-im-sechead' },
          h('span', { className: 'dsh-im-num' }, '02'),
          h('h2', { className: 'dsh-im-sectitle' }, tr(lang, 'step2')),
          h('span', { className: 'dsh-im-sechint' },
            done ? (total === 0 ? tr(lang, 'cleanTitle') : tr(lang, 'found', { n: total })) : ''),
          done
            ? h('button', { type: 'button', className: 'dsh-im-link', onClick: () => run() }, tr(lang, 'recheck'))
            : null),
        resultBody)

      return h(React.Fragment, null, step1, step2)
    }

    function CommandsSection(props) {
      const lang = useLang()
      const [category, setCategory] = React.useState(null)
      const [copied, setCopied] = React.useState(null)
      const [open, setOpen] = React.useState(props.initialOpen === true)

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
          h('span', { className: 'dsh-im-num' }, '03'),
          h('h2', { className: 'dsh-im-sectitle' }, tr(lang, 'toolsTitle')),
          h('span', { className: 'dsh-im-sechint' }, tr(lang, 'toolsHint', { n: commands.length })),
          h('button', {
            type: 'button',
            className: 'dsh-im-link',
            onClick: () => setOpen((value) => !value),
          }, open ? tr(lang, 'showLess') : tr(lang, 'showAll', { n: commands.length }))),
        open ? h(React.Fragment, null,
          h('div', { className: 'dsh-im-chips' },
            h('button', {
              type: 'button',
              className: category === null ? 'dsh-im-chip dsh-im-chip-on' : 'dsh-im-chip',
              onClick: () => setCategory(null),
            }, tr(lang, 'all')),
            categories.map((item) => h('button', {
              type: 'button',
              key: item.key,
              className: category === item.key ? 'dsh-im-chip dsh-im-chip-on' : 'dsh-im-chip',
              onClick: () => setCategory(item.key),
            }, item.label))),
          h('div', { className: 'dsh-im-grid' },
            shown.map((command) => h('div', {
              className: copied === command.name ? 'dsh-im-cmd dsh-im-cmd-on' : 'dsh-im-cmd',
              key: command.name,
              'data-cat': command.category,
            },
            h('button', {
              type: 'button',
              className: 'dsh-im-cmdmain',
              title: copied === command.name ? tr(lang, 'copied') : commandDesc(lang, command),
              onClick: () => onCopy(command),
            },
            h('span', { className: 'dsh-im-cmdtop' },
              h('span', { className: 'dsh-im-catdot', 'aria-hidden': 'true' }),
              h('span', { className: 'dsh-im-cmdaction' }, commandAction(lang, command.name)),
              h('code', { className: 'dsh-im-cmdname' }, command.name)),
            h('span', { className: 'dsh-im-cmddesc' }, commandDesc(lang, command)),
            copied === command.name ? h('span', { className: 'dsh-im-copied' }, tr(lang, 'copied')) : null),
            h('button', {
              type: 'button',
              className: 'dsh-im-cmdopen',
              title: tr(lang, 'openSession'),
              'aria-label': tr(lang, 'openSession'),
              onClick: () => onSession(command),
            }, h(ArrowIcon)))))) : null)
    }

    function RulesSection(props) {
      const lang = useLang()
      const [open, setOpen] = React.useState(props.initialOpen === true)
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
          h('span', { className: 'dsh-im-num' }, '04'),
          h('h2', { className: 'dsh-im-sectitle' }, tr(lang, 'rulesTitle')),
          h('span', { className: 'dsh-im-sechint' }, tr(lang, 'rulesHint2', { n: rules.length })),
          h('button', {
            type: 'button',
            className: 'dsh-im-link',
            onClick: () => setOpen((value) => !value),
          }, open ? tr(lang, 'showLess') : tr(lang, 'showAll', { n: rules.length }))),
        open ? h(React.Fragment, null,
          h('div', { className: 'dsh-im-search' },
            h('input', {
              className: 'dsh-im-input',
              value: query,
              placeholder: tr(lang, 'rulesSearch'),
              spellCheck: false,
              onChange: (event) => setQuery(event.target.value),
            })),
          h('ul', { className: 'dsh-im-rules' }, ruleItems)) : null)
    }

    function StudioPanel() {
      const lang = useLang()
      const [themeMode, themeEffective, setThemeMode] = useTheme()
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

      const ruleCount = data && data.rules.length > 0 ? data.rules.length : null
      const commandCount = data && data.commands.length > 0 ? data.commands.length : null
      const categoryCount = data && data.commands.length > 0
        ? new Set(data.commands.map((command) => command.category)).size
        : null
      const engineLabel = data && data.engine.found
        ? data.engine.version
        : (data && data.engine.pending ? '…' : '—')

      const scrollRef = React.useRef(null)
      const [activeNav, setActiveNav] = React.useState('check')

      React.useEffect(() => {
        const el = scrollRef.current
        if (!el || typeof el.addEventListener !== 'function') return undefined
        const keys = ['pick', 'result', 'commands', 'rules']
        function onScroll() {
          let current = 'check'
          const base = el.getBoundingClientRect().top
          for (const key of keys) {
            const node = el.querySelector(`#dsh-im-sec-${key}`)
            if (!node || typeof node.getBoundingClientRect !== 'function') continue
            const top = node.getBoundingClientRect().top - base + el.scrollTop
            if (top - 140 <= el.scrollTop) current = key === 'pick' || key === 'result' ? 'check' : key
          }
          setActiveNav(current)
        }
        el.addEventListener('scroll', onScroll, { passive: true })
        onScroll()
        return () => el.removeEventListener('scroll', onScroll)
      }, [catalog.status])

      function gotoSection(key) {
        setActiveNav(key)
        const el = scrollRef.current
        if (!el) return
        const anchor = key === 'check' ? 'pick' : key
        const node = el.querySelector(`#dsh-im-sec-${anchor}`)
        if (!node) return
        const top = node.getBoundingClientRect().top - el.getBoundingClientRect().top + el.scrollTop - 14
        const next = Math.max(0, Math.round(top))
        if (typeof el.scrollTo === 'function') el.scrollTo({ top: next, behavior: 'smooth' })
        else el.scrollTop = next
      }

      function navButton(key, icon, label, extra) {
        return h('button', {
          type: 'button',
          className: activeNav === key ? 'dsh-im-nav dsh-im-nav-on' : 'dsh-im-nav',
          onClick: () => gotoSection(key),
        }, icon, label, extra || null)
      }

      const themeOptions = [
        { key: 'auto', label: tr(lang, 'themeAuto'), icon: h(AutoIcon) },
        { key: 'light', label: tr(lang, 'themeLight'), icon: h(SunIcon) },
        { key: 'dark', label: tr(lang, 'themeDark'), icon: h(MoonIcon) },
      ]

      return h('div', { className: 'dsh-im-root', 'data-im-theme': themeEffective },
        h('style', null, STYLE),
        h('div', { className: 'dsh-im-shell' },
          h('aside', { className: 'dsh-im-rail' },
            h('div', { className: 'dsh-im-brand' },
              h('span', { className: 'dsh-im-brandmark' },
                h('img', { src: '/impeccable/icon.png', alt: '', loading: 'lazy' })),
              h('div', { className: 'dsh-im-brandtext' },
                h('div', { className: 'dsh-im-brandname' }, tr(lang, 'title')))),
            h('div', { className: 'dsh-im-railgroup' }, tr(lang, 'railGroup')),
            navButton('check',
              h('svg', { width: 14, height: 14, viewBox: '0 0 24 24' },
                h('circle', { cx: 11, cy: 11, r: 7 }),
                h('path', { d: 'M20 20l-4-4' })),
              tr(lang, 'navCheck')),
            navButton('commands',
              h('svg', { width: 14, height: 14, viewBox: '0 0 24 24' },
                h('path', { d: 'M4 7l6 5-6 5' }),
                h('path', { d: 'M13 17h7' })),
              tr(lang, 'navCommands'),
              h('span', { className: 'dsh-im-navcount' }, commandCount === null ? '—' : commandCount)),
            navButton('rules',
              h('svg', { width: 14, height: 14, viewBox: '0 0 24 24' },
                h('path', { d: 'M4 6h16M4 12h16M4 18h10' })),
              tr(lang, 'navRules'),
              h('span', { className: 'dsh-im-navcount' }, ruleCount === null ? '—' : ruleCount)),
            h('div', { className: 'dsh-im-prefs' },
              h('div', { className: 'dsh-im-railgroup' }, tr(lang, 'prefsGroup')),
              h(SegGroup, { label: tr(lang, 'langLabel') },
                h(SegButton, {
                  active: lang === 'zh',
                  title: '中文',
                  onClick: () => setLang('zh', true),
                }, '中'),
                h(SegButton, {
                  active: lang === 'en',
                  title: 'English',
                  onClick: () => setLang('en', true),
                }, 'EN')),
              h(SegGroup, { label: tr(lang, 'themeLabel') },
                themeOptions.map((option) => h(SegButton, {
                  key: option.key,
                  active: themeMode === option.key,
                  title: option.label,
                  onClick: () => setThemeMode(option.key),
                }, option.icon)))),
            h('div', { className: 'dsh-im-railfoot' },
              h('b', null, `IMPECCABLE ${data && data.skill.version ? data.skill.version : '—'}`),
              h('div', null, `${tr(lang, 'statEngine')} · ${engineLabel}`),
              h('div', null, `${ruleCount === null ? '—' : ruleCount} ${tr(lang, 'statRules')} · ${commandCount === null ? '—' : commandCount} ${tr(lang, 'statCommands')}`))),
          h('div', { className: 'dsh-im-main', ref: scrollRef },
            h('div', { className: 'dsh-im-inner' },
              h('header', { className: 'dsh-im-hero' },
                h('h1', { className: 'dsh-im-title' }, tr(lang, 'title')),
                h('p', { className: 'dsh-im-lede' }, tr(lang, 'lede')),
                h('div', { className: 'dsh-im-stats' },
                  h('div', { className: 'dsh-im-stat' },
                    h('div', { className: 'dsh-im-statv' }, ruleCount === null ? '—' : ruleCount),
                    h('div', { className: 'dsh-im-statl' }, tr(lang, 'statRules'))),
                  h('div', { className: 'dsh-im-stat' },
                    h('div', { className: 'dsh-im-statv' }, commandCount === null ? '—' : commandCount),
                    h('div', { className: 'dsh-im-statl' }, tr(lang, 'statCommands'))),
                  h('div', { className: 'dsh-im-stat' },
                    h('div', { className: 'dsh-im-statv' }, categoryCount === null ? '—' : categoryCount),
                    h('div', { className: 'dsh-im-statl' }, tr(lang, 'statCats'))),
                  h('div', { className: 'dsh-im-stat' },
                    h('div', { className: 'dsh-im-statv dsh-im-statv-sm' }, engineLabel),
                    h('div', { className: 'dsh-im-statl' }, tr(lang, 'statEngine'))))),
              catalog.status === 'loading' ? h('p', { className: 'dsh-im-hint dsh-im-pad' }, '…') : null,
              catalog.status === 'error' ? h('p', { className: 'dsh-im-error dsh-im-pad' }, catalog.error) : null,
              enginePending ? h('div', { className: 'dsh-im-banner dsh-im-banner-info' }, tr(lang, 'enginePending')) : null,
              engineMissing ? h('div', { className: 'dsh-im-banner dsh-im-banner-error' }, tr(lang, 'engineMissing')) : null,
              skillMissing ? h('div', { className: 'dsh-im-banner dsh-im-banner-error' }, tr(lang, 'skillMissing')) : null,
              h('div', { id: 'dsh-im-sec-check' },
                data ? h(CheckSection, { onScanned: reloadCatalog, rules: data.rules, skillDir: data.skill.dir }) : null),
              h('div', { id: 'dsh-im-sec-commands' },
                data && data.commands.length > 0
                  ? h(CommandsSection, { commands: data.commands, skillDir: data.skill.dir })
                  : null),
              h('div', { id: 'dsh-im-sec-rules' },
                data && data.rules.length > 0 ? h(RulesSection, { rules: data.rules }) : null)))))
    }

    // ---------------------------------------------------------------------
    // 样式：自带的 --im-* 调色板，浅色 / 深色各一套；跟随 DSH 时读 body 的主题属性
    // ---------------------------------------------------------------------

    const STYLE = `
.dsh-im-root {
  --im-bg: #ffffff;
  --im-surface: #ffffff;
  --im-surface-2: #faf9fd;
  --im-surface-3: #f2effa;
  --im-text: #17131f;
  --im-text-2: #554e63;
  --im-text-3: #6f6880;
  --im-border: #eae6f2;
  --im-border-strong: #d7d1e5;
  --im-accent: #6d28d9;
  --im-accent-soft: #f3eefe;
  --im-accent-contrast: #ffffff;
  --im-hover: #f7f4fc;
  --im-ok: #0f7a54;
  --im-warn: #b45309;
  --im-err: #c02626;
  --im-invert-bg: #17131f;
  --im-invert-text: #ffffff;
  --im-shadow: 0 14px 32px rgba(24, 16, 40, 0.10);
  --im-mono: ui-monospace, SFMono-Regular, "SF Mono", Menlo, monospace;
  --im-serif: "Songti SC", "Noto Serif SC", Georgia, serif;
  --im-cat-build: #6d28d9;
  --im-cat-evaluate: #0f766e;
  --im-cat-refine: #b45309;
  --im-cat-enhance: #be185d;
  --im-cat-fix: #475569;
  --im-cat-iterate: #6b7280;
  position: relative;
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 0;
  container-type: inline-size;
  background: var(--im-bg);
  color: var(--im-text);
  font-family: -apple-system, BlinkMacSystemFont, "Helvetica Neue", "PingFang SC", "Noto Sans SC", sans-serif;
  font-size: 13px;
  line-height: 1.5;
  -webkit-font-smoothing: antialiased;
  font-variant-numeric: tabular-nums;
  color-scheme: light;
}
.dsh-im-root[data-im-theme="dark"] {
  --im-bg: #0e0d12;
  --im-surface: #15131b;
  --im-surface-2: #1b1824;
  --im-surface-3: #241f30;
  --im-text: #f3f0f9;
  --im-text-2: #b3adc2;
  --im-text-3: #8f89a0;
  --im-border: rgba(255, 255, 255, 0.10);
  --im-border-strong: rgba(255, 255, 255, 0.20);
  --im-accent: #b39dfb;
  --im-accent-soft: #221a38;
  --im-accent-contrast: #16101f;
  --im-hover: rgba(255, 255, 255, 0.05);
  --im-ok: #4ade80;
  --im-warn: #fbbf24;
  --im-err: #f87171;
  --im-invert-bg: #f3f0f9;
  --im-invert-text: #131018;
  --im-shadow: 0 18px 40px rgba(0, 0, 0, 0.55);
  color-scheme: dark;
}

/* 骨架：左栏导航 + 右栏内容 */
.dsh-im-root, .dsh-im-root *, .dsh-im-root *::before, .dsh-im-root *::after { box-sizing: border-box; }
.dsh-im-shell { display: flex; height: 100%; min-height: 0; }
.dsh-im-rail { flex: none; display: flex; flex-direction: column; gap: 2px; width: 212px; padding: 18px 12px 14px; border-right: 1px solid var(--im-border); background: var(--im-surface-2); overflow-y: auto; overflow-x: hidden; }
.dsh-im-brand { display: flex; align-items: center; gap: 10px; padding: 0 8px 16px; }
.dsh-im-brandmark { position: relative; flex: none; width: 34px; height: 34px; border-radius: 9px; overflow: hidden; background: var(--im-surface); box-shadow: inset 0 0 0 1px var(--im-border); }
.dsh-im-brandmark img { display: block; width: 100%; height: 100%; object-fit: cover; }
.dsh-im-icon { display: block; border-radius: 5px; object-fit: cover; }
.dsh-im-brandtext { min-width: 0; }
.dsh-im-brandname { font-size: 13px; font-weight: 600; letter-spacing: -0.01em; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

.dsh-im-railgroup { margin-top: 10px; padding: 0 8px 5px; font-family: var(--im-mono); font-size: 11px; letter-spacing: 0.1em; text-transform: uppercase; color: var(--im-text-3); }
.dsh-im-nav { position: relative; display: flex; align-items: center; gap: 9px; width: 100%; height: 33px; padding: 0 8px; border: 0; border-radius: 7px; background: transparent; color: var(--im-text-2); font: inherit; font-size: 13px; text-align: left; white-space: nowrap; cursor: pointer; transition: background 0.16s ease, color 0.16s ease; }
.dsh-im-nav:hover { background: var(--im-hover); color: var(--im-text); }
.dsh-im-nav-on, .dsh-im-nav-on:hover { background: var(--im-invert-bg); color: var(--im-invert-text); }
.dsh-im-root[data-im-theme="dark"] .dsh-im-nav-on,
.dsh-im-root[data-im-theme="dark"] .dsh-im-nav-on:hover { background: var(--im-surface-3); color: var(--im-text); box-shadow: inset 0 0 0 1px var(--im-border-strong); }
.dsh-im-nav svg { flex: none; width: 14px; height: 14px; stroke: currentColor; fill: none; stroke-width: 1.7; stroke-linecap: round; stroke-linejoin: round; }
.dsh-im-navcount { margin-left: auto; font-family: var(--im-mono); font-size: 11px; opacity: 0.65; }
.dsh-im-prefs { margin-top: 18px; padding-top: 14px; border-top: 1px dashed var(--im-border); }
.dsh-im-prefs .dsh-im-railgroup { margin-top: 0; }
.dsh-im-seg { display: flex; gap: 2px; padding: 2px; margin: 0 8px 6px; border: 1px solid var(--im-border); border-radius: 8px; background: var(--im-bg); }
.dsh-im-segbtn { flex: 1; display: flex; align-items: center; justify-content: center; height: 26px; padding: 0 4px; border: 0; border-radius: 6px; background: transparent; color: var(--im-text-2); font: inherit; font-size: 11px; font-weight: 500; letter-spacing: 0.02em; cursor: pointer; transition: background 0.15s ease, color 0.15s ease; }
.dsh-im-segbtn:hover { background: var(--im-hover); color: var(--im-text); }
.dsh-im-segbtn-on, .dsh-im-segbtn-on:hover { background: var(--im-surface-3); color: var(--im-text); box-shadow: inset 0 0 0 1px var(--im-border-strong); }
.dsh-im-segbtn svg { display: block; stroke: currentColor; fill: none; }
.dsh-im-railfoot { margin-top: auto; padding: 14px 8px 0; border-top: 1px solid var(--im-border); font-family: var(--im-mono); font-size: 11px; line-height: 1.7; letter-spacing: 0.03em; color: var(--im-text-3); overflow-wrap: anywhere; }
.dsh-im-railfoot b { display: block; font-weight: 400; color: var(--im-text-2); }
.dsh-im-main { flex: 1; min-width: 0; overflow-y: auto; overscroll-behavior: contain; scrollbar-width: thin; scrollbar-color: var(--im-border-strong) transparent; }
.dsh-im-main::-webkit-scrollbar { width: 10px; }
.dsh-im-main::-webkit-scrollbar-thumb { background: var(--im-border-strong); border: 3px solid transparent; border-radius: 999px; background-clip: content-box; }
.dsh-im-main::-webkit-scrollbar-track { background: transparent; }
.dsh-im-inner { max-width: 1080px; margin: 0 auto; padding: 0 32px 48px; }

/* 头部：方括号标签 + 大标题 */
.dsh-im-hero { position: relative; padding: 28px 0 20px; border-bottom: 1px solid var(--im-border); }
.dsh-im-hero::before { content: ''; position: absolute; left: 0; top: 0; right: 0; height: 2px; background: linear-gradient(90deg, var(--im-accent) 0 96px, var(--im-border) 96px); }
.dsh-im-hero::after { content: ''; position: absolute; right: -32px; top: -28px; width: 320px; height: 180px; pointer-events: none; background: radial-gradient(closest-side, color-mix(in srgb, var(--im-accent) 12%, transparent), transparent 100%); }
.dsh-im-title { margin: 0; font-size: 30px; font-weight: 600; line-height: 1.1; letter-spacing: -0.02em; }
.dsh-im-lede { margin: 10px 0 0; max-width: 58ch; font-size: 13px; line-height: 1.65; color: var(--im-text-2); }
.dsh-im-stats { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 9px; margin-top: 22px; }
.dsh-im-stat { position: relative; padding: 13px 14px 12px; border: 1px solid var(--im-border); border-radius: 10px; background: var(--im-surface); overflow: hidden; box-shadow: 0 1px 2px rgba(20, 12, 36, 0.03); }
.dsh-im-statv { font-family: var(--im-mono); font-size: 24px; font-weight: 400; line-height: 1; letter-spacing: -0.03em; }
.dsh-im-statv-sm { font-family: inherit; font-size: 14px; letter-spacing: 0; line-height: 1.5; word-break: break-all; }
.dsh-im-statl { display: flex; align-items: center; gap: 6px; margin-top: 7px; font-size: 12px; letter-spacing: 0.02em; color: var(--im-text-2); }
.dsh-im-statl::before { content: ''; flex: none; width: 5px; height: 5px; border-radius: 1px; background: var(--im-accent); opacity: 0.75; }

/* 区块 */
.dsh-im-sec { padding-top: 26px; scroll-margin-top: 12px; }
.dsh-im-sechead { display: flex; align-items: center; gap: 10px; padding-bottom: 10px; border-bottom: 1px solid var(--im-border); }
.dsh-im-num { flex: none; font-family: var(--im-serif); font-size: 18px; font-weight: 500; line-height: 1; letter-spacing: 0.01em; color: var(--im-text-2); }
.dsh-im-sectitle { margin: 0; font-size: 14.5px; font-weight: 600; letter-spacing: 0.01em; white-space: nowrap; }
.dsh-im-sechint { font-size: 12px; color: var(--im-text-2); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.dsh-im-link { margin-left: auto; padding: 2px 0; border: 0; border-bottom: 1px solid transparent; background: transparent; color: var(--im-accent); font: inherit; font-size: 12px; letter-spacing: 0.02em; white-space: nowrap; cursor: pointer; }
.dsh-im-link:hover:not(:disabled) { border-bottom-color: var(--im-accent); }
.dsh-im-link:disabled { color: var(--im-text-3); cursor: default; }

/* 输入框：永远在区块最上面 */
.dsh-im-picker { display: flex; align-items: center; gap: 10px; height: 48px; margin-top: 15px; padding: 0 7px 0 14px; border: 1px solid var(--im-border-strong); border-radius: 12px; background: var(--im-surface); transition: border-color 0.16s ease, box-shadow 0.16s ease; }
.dsh-im-picker:focus-within { border-color: var(--im-accent); box-shadow: 0 0 0 3px color-mix(in srgb, var(--im-accent) 16%, transparent); }
.dsh-im-pickericon { display: flex; flex: none; color: var(--im-text-3); }
.dsh-im-pickericon svg { display: block; }
.dsh-im-pickerinput { flex: 1; min-width: 0; height: 100%; padding: 0; border: 0; background: transparent; color: var(--im-text); font: inherit; font-size: 13.5px; outline: none; }
.dsh-im-pickerinput::placeholder { color: var(--im-text-3); }
.dsh-im-btn { flex: none; height: 34px; padding: 0 16px; border: 1px solid var(--im-accent); border-radius: 8px; background: var(--im-accent); color: var(--im-accent-contrast); font: inherit; font-size: 12.5px; font-weight: 600; letter-spacing: 0.01em; white-space: nowrap; cursor: pointer; transition: filter 0.15s ease, transform 0.1s ease; }
.dsh-im-btn:hover:not(:disabled) { filter: brightness(1.08); }
.dsh-im-btn:active:not(:disabled) { transform: translateY(1px); }
.dsh-im-btn:disabled { border-color: var(--im-border); background: var(--im-surface-3); color: var(--im-text-3); cursor: default; }
.dsh-im-pickerhint { margin: 8px 2px 0; font-size: 12px; line-height: 1.5; color: var(--im-text-3); }

/* 页面列表 */
.dsh-im-listbar { display: flex; align-items: center; gap: 10px; margin-top: 20px; }
.dsh-im-listhint { font-size: 12px; letter-spacing: 0.02em; color: var(--im-text-2); }
.dsh-im-filter { margin-left: auto; width: 190px; height: 28px; padding: 0 10px; border: 1px solid var(--im-border); border-radius: 7px; background: var(--im-bg); color: var(--im-text); font: inherit; font-size: 12px; outline: none; transition: border-color 0.15s ease; }
.dsh-im-filter::placeholder { color: var(--im-text-3); }
.dsh-im-filter:focus { border-color: var(--im-accent); }
.dsh-im-pad { margin: 12px 0 0; }
.dsh-im-hint { margin: 0; font-size: 12px; line-height: 1.6; color: var(--im-text-2); }
.dsh-im-error { margin: 0; font-size: 12px; color: var(--im-err); word-break: break-word; }
.dsh-im-targets { display: grid; grid-template-columns: repeat(auto-fill, minmax(270px, 1fr)); gap: 9px; margin-top: 10px; }
.dsh-im-target { position: relative; display: flex; min-width: 0; border: 1px solid var(--im-border); border-radius: 10px; background: var(--im-surface); overflow: hidden; transition: border-color 0.15s ease, background 0.15s ease, box-shadow 0.15s ease; }
.dsh-im-target:hover { border-color: var(--im-border-strong); background: var(--im-hover); }
.dsh-im-target-on { border-color: var(--im-accent); background: var(--im-accent-soft); }
.dsh-im-targetmain { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 5px; padding: 12px 38px 12px 14px; border: 0; background: transparent; color: inherit; font: inherit; text-align: left; cursor: pointer; }
.dsh-im-targetname { font-size: 13px; font-weight: 600; letter-spacing: 0.005em; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.dsh-im-targetsub { display: flex; align-items: center; gap: 7px; min-width: 0; font-size: 12px; color: var(--im-text-2); }
.dsh-im-targetdir { min-width: 0; font-family: var(--im-mono); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.dsh-im-targettime { flex: none; color: var(--im-text-3); }
.dsh-im-targettime::before { content: '·'; margin-right: 7px; color: var(--im-border-strong); }
.dsh-im-targetgo { position: absolute; top: 9px; right: 9px; display: flex; align-items: center; justify-content: center; width: 24px; height: 24px; padding: 0; border: 0; border-radius: 6px; background: transparent; color: var(--im-text-3); cursor: pointer; opacity: 0.5; transition: opacity 0.15s ease, color 0.15s ease, background 0.15s ease, transform 0.15s ease; }
.dsh-im-target:hover .dsh-im-targetgo, .dsh-im-target-on .dsh-im-targetgo { opacity: 1; }
.dsh-im-targetgo:hover { background: var(--im-surface-3); color: var(--im-accent); transform: translate(1px, -1px); }
.dsh-im-targetgo svg { display: block; }
.dsh-im-skeleton { display: grid; grid-template-columns: repeat(auto-fill, minmax(270px, 1fr)); gap: 9px; margin-top: 10px; }
.dsh-im-sk { height: 62px; border-radius: 10px; background: linear-gradient(90deg, var(--im-surface-2) 0%, var(--im-surface-3) 50%, var(--im-surface-2) 100%); background-size: 200% 100%; animation: dsh-im-shimmer 1.4s linear infinite; }
@keyframes dsh-im-shimmer { 0% { background-position: 140% 0; } 100% { background-position: -40% 0; } }

/* 结果 */
.dsh-im-empty { display: flex; align-items: center; gap: 14px; margin-top: 14px; padding: 18px; border: 1px dashed var(--im-border-strong); border-radius: 12px; background: var(--im-surface-2); }
.dsh-im-emptyicon { flex: none; display: flex; align-items: center; justify-content: center; width: 38px; height: 38px; border: 1px solid var(--im-border); border-radius: 50%; background: var(--im-surface); color: var(--im-accent); }
.dsh-im-emptyicon svg { display: block; }
.dsh-im-emptytitle { font-size: 13px; font-weight: 600; }
.dsh-im-emptybody { margin: 3px 0 0; font-size: 12px; line-height: 1.6; color: var(--im-text-2); }
.dsh-im-running { margin-top: 14px; padding: 16px; border: 1px solid var(--im-border); border-radius: 10px; background: var(--im-surface); }
.dsh-im-running p { margin: 11px 0 0; font-size: 12.5px; color: var(--im-text-2); }
.dsh-im-bar { position: relative; height: 3px; border-radius: 3px; background: var(--im-surface-3); overflow: hidden; }
.dsh-im-bar::after { content: ''; position: absolute; inset: 0; border-radius: 3px; background: var(--im-accent); animation: dsh-im-breathe 1.2s ease-in-out infinite; }
@keyframes dsh-im-breathe { 0%, 100% { opacity: 0.32; } 50% { opacity: 1; } }
.dsh-im-resultmeta { display: flex; flex-wrap: wrap; align-items: center; gap: 7px; margin-top: 14px; font-size: 12px; color: var(--im-text-2); }
.dsh-im-resultfile { font-family: var(--im-mono); font-size: 12px; color: var(--im-text); }
.dsh-im-tag { padding: 2px 8px; border-radius: 999px; background: var(--im-surface-3); font-size: 11px; color: var(--im-text-2); }
.dsh-im-metrics { display: grid; grid-template-columns: repeat(auto-fit, minmax(120px, 1fr)); gap: 8px; margin-top: 12px; }
.dsh-im-metric { position: relative; padding: 11px 13px 10px; border: 1px solid var(--im-border); border-radius: 10px; background: var(--im-surface); overflow: hidden; }
.dsh-im-metricv { font-family: var(--im-mono); font-size: 24px; font-weight: 400; line-height: 1; letter-spacing: -0.03em; }
.dsh-im-metricu { margin-left: 3px; font-size: 11px; letter-spacing: 0; color: var(--im-text-2); }
.dsh-im-metricl { display: flex; align-items: center; gap: 6px; margin-top: 6px; font-size: 12px; letter-spacing: 0.02em; color: var(--im-text-2); }
.dsh-im-metricl::before { content: ''; flex: none; width: 5px; height: 5px; border-radius: 1px; background: var(--im-text-3); }
.dsh-im-metric-brand .dsh-im-metricl::before { background: var(--im-accent); }
.dsh-im-metric-warn .dsh-im-metricl::before { background: var(--im-warn); }
.dsh-im-metric-brand .dsh-im-metricv { color: var(--im-text); }
.dsh-im-metric-warn .dsh-im-metricv { color: var(--im-warn); }
.dsh-im-metric-mute .dsh-im-metricv { color: var(--im-text-2); }
.dsh-im-findings { display: flex; flex-direction: column; gap: 8px; margin-top: 12px; }
.dsh-im-finding { padding: 12px 14px 13px; border: 1px solid color-mix(in srgb, var(--im-warn) 30%, var(--im-border)); border-radius: 10px; background: color-mix(in srgb, var(--im-warn) 6%, var(--im-surface)); }
.dsh-im-finding-info { border-color: var(--im-border); background: var(--im-surface); }
.dsh-im-findinghead { display: flex; align-items: center; gap: 9px; }
.dsh-im-fdot { flex: none; width: 6px; height: 6px; border-radius: 50%; background: var(--im-warn); }
.dsh-im-fdot-info { background: var(--im-text-3); }
.dsh-im-findingname { margin: 0; font-size: 13.5px; font-weight: 600; letter-spacing: 0.005em; }
.dsh-im-sev { flex: none; padding: 1px 7px; border-radius: 999px; font-size: 11px; letter-spacing: 0.02em; }
.dsh-im-sev-warn { background: color-mix(in srgb, var(--im-warn) 14%, transparent); color: color-mix(in srgb, var(--im-warn) 60%, var(--im-text)); }
.dsh-im-sev-info { background: var(--im-surface-3); color: var(--im-text-2); }
.dsh-im-count { margin-left: auto; font-family: var(--im-mono); font-size: 12px; color: var(--im-text-2); }
.dsh-im-findingdesc { margin: 5px 0 0; max-width: 94ch; font-size: 12.5px; line-height: 1.55; color: var(--im-text-2); }
.dsh-im-locs { display: flex; flex-direction: column; gap: 3px; margin: 9px 0 0; padding: 0; list-style: none; }
.dsh-im-loc { display: flex; align-items: baseline; gap: 10px; min-width: 0; font-family: var(--im-mono); font-size: 12px; color: var(--im-text-2); }
.dsh-im-locfile { min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.dsh-im-locline { flex: none; color: var(--im-text-3); }
.dsh-im-more { margin: 6px 0 0; font-size: 12px; color: var(--im-text-3); }
.dsh-im-fix { display: inline-flex; align-items: center; gap: 5px; margin-top: 10px; padding: 0; border: 0; background: transparent; color: var(--im-accent); font: inherit; font-size: 12px; font-weight: 500; cursor: pointer; }
.dsh-im-fix:hover { text-decoration: underline; text-underline-offset: 3px; }
.dsh-im-fix svg { width: 12px; height: 12px; }
.dsh-im-clean { margin-top: 14px; padding: 18px; border: 1px solid color-mix(in srgb, var(--im-ok) 34%, var(--im-border)); border-radius: 10px; background: color-mix(in srgb, var(--im-ok) 6%, var(--im-surface)); }
.dsh-im-cleantitle { font-size: 13px; font-weight: 600; color: var(--im-ok); }
.dsh-im-cleantitle::before { content: '✓'; margin-right: 8px; }
.dsh-im-alert { margin-top: 14px; padding: 14px 15px; border: 1px solid color-mix(in srgb, var(--im-err) 34%, transparent); border-radius: 10px; background: color-mix(in srgb, var(--im-err) 7%, transparent); }
.dsh-im-alerttitle { font-size: 13px; font-weight: 600; color: var(--im-err); }
.dsh-im-alertbody { margin: 5px 0 0; font-size: 12px; line-height: 1.55; color: var(--im-err); word-break: break-word; }

/* 提示条 */
.dsh-im-banner { margin-top: 14px; padding: 12px 14px; border: 1px solid var(--im-border); border-radius: 10px; font-size: 12.5px; line-height: 1.6; }
.dsh-im-banner-info { border-color: color-mix(in srgb, var(--im-accent) 30%, transparent); background: var(--im-accent-soft); color: var(--im-text-2); }
.dsh-im-banner-error { border-color: color-mix(in srgb, var(--im-err) 30%, transparent); background: color-mix(in srgb, var(--im-err) 7%, transparent); color: var(--im-err); }

/* 命令 */
.dsh-im-chips { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 14px; }
.dsh-im-chip { height: 28px; padding: 0 11px; border: 1px solid var(--im-border); border-radius: 999px; background: var(--im-surface); color: var(--im-text-2); font: inherit; font-size: 12px; letter-spacing: 0.01em; cursor: pointer; transition: border-color 0.15s ease, color 0.15s ease, background 0.15s ease; }
.dsh-im-chip:hover { border-color: var(--im-border-strong); color: var(--im-text); }
.dsh-im-chip-on, .dsh-im-chip-on:hover { border-color: var(--im-invert-bg); background: var(--im-invert-bg); color: var(--im-invert-text); }
.dsh-im-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 9px; margin-top: 12px; }
.dsh-im-cmd { position: relative; min-width: 0; border: 1px solid var(--im-border); border-radius: 10px; background: var(--im-surface); overflow: hidden; transition: border-color 0.15s ease, background 0.15s ease, transform 0.15s ease, box-shadow 0.15s ease; }
.dsh-im-cmdmain { display: flex; flex-direction: column; gap: 6px; width: 100%; min-height: 76px; padding: 12px 14px; border: 0; background: transparent; color: inherit; font: inherit; text-align: left; cursor: pointer; }
.dsh-im-cmd:hover { border-color: var(--im-border-strong); background: var(--im-hover); transform: translateY(-1px); box-shadow: var(--im-shadow); }
.dsh-im-cmd-on { border-color: var(--im-ok); }
.dsh-im-cmdtop { display: flex; align-items: center; gap: 8px; min-width: 0; padding-right: 26px; }
.dsh-im-catdot { flex: none; width: 5px; height: 5px; border-radius: 1px; background: var(--im-cat-build); }
.dsh-im-cmd[data-cat="Evaluate"] .dsh-im-catdot { background: var(--im-cat-evaluate); }
.dsh-im-cmd[data-cat="Refine"] .dsh-im-catdot { background: var(--im-cat-refine); }
.dsh-im-cmd[data-cat="Enhance"] .dsh-im-catdot { background: var(--im-cat-enhance); }
.dsh-im-cmd[data-cat="Fix"] .dsh-im-catdot { background: var(--im-cat-fix); }
.dsh-im-cmd[data-cat="Iterate"] .dsh-im-catdot { background: var(--im-cat-iterate); }
.dsh-im-cmdaction { min-width: 0; font-size: 13px; font-weight: 600; letter-spacing: 0.005em; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.dsh-im-cmdname { flex: none; font-family: var(--im-mono); font-size: 11px; letter-spacing: -0.01em; color: var(--im-text-3); }
.dsh-im-cmdopen { position: absolute; top: 9px; right: 9px; display: flex; align-items: center; justify-content: center; width: 22px; height: 22px; padding: 0; border: 0; border-radius: 6px; background: transparent; color: var(--im-text-3); cursor: pointer; opacity: 0.55; transition: opacity 0.15s ease, transform 0.15s ease, color 0.15s ease; }
.dsh-im-cmdopen:hover { color: var(--im-accent); background: var(--im-surface-3); }
.dsh-im-cmd:hover .dsh-im-cmdopen { opacity: 1; transform: translate(1px, -1px); }
.dsh-im-cmdopen svg { display: block; }
.dsh-im-cmddesc { margin: 0; font-size: 12px; line-height: 1.5; color: var(--im-text-2); display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
.dsh-im-copied { position: absolute; right: 12px; bottom: 9px; font-family: var(--im-mono); font-size: 11px; letter-spacing: 0.06em; color: var(--im-ok); }

/* 规则 */
.dsh-im-search { display: flex; margin-top: 13px; }
.dsh-im-input { flex: 1; min-width: 0; height: 34px; padding: 0 11px; border: 1px solid var(--im-border); border-radius: 8px; background: var(--im-bg); color: var(--im-text); font: inherit; font-size: 12.5px; outline: none; transition: border-color 0.15s ease, box-shadow 0.15s ease; }
.dsh-im-input::placeholder { color: var(--im-text-3); }
.dsh-im-input:focus { border-color: var(--im-accent); box-shadow: 0 0 0 3px color-mix(in srgb, var(--im-accent) 14%, transparent); }
.dsh-im-rules { display: grid; grid-template-columns: repeat(auto-fill, minmax(340px, 1fr)); column-gap: 26px; margin: 12px 0 0; padding: 0; list-style: none; }
.dsh-im-rule { display: flex; gap: 9px; align-items: flex-start; min-width: 0; padding: 8px 8px 8px 0; border-top: 1px solid var(--im-border); }
.dsh-im-rule:hover { background: var(--im-hover); }
.dsh-im-rulebody { min-width: 0; display: flex; flex-direction: column; gap: 3px; }
.dsh-im-ruletop { display: flex; align-items: baseline; gap: 10px; min-width: 0; }
.dsh-im-rulename { flex: none; font-size: 12.5px; font-weight: 600; letter-spacing: 0.005em; }
.dsh-im-ruleid { flex: none; font-family: var(--im-mono); font-size: 12px; color: var(--im-text-3); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.dsh-im-rulecat { flex: none; margin-left: auto; font-size: 12px; color: var(--im-text-2); }
.dsh-im-rulecat-slop { color: var(--im-accent); }
.dsh-im-ruledesc { margin: 0; font-size: 12px; line-height: 1.5; color: var(--im-text-2); display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
.dsh-im-dot { flex: none; width: 4px; height: 4px; margin-top: 6px; border-radius: 50%; background: var(--im-warn); }
.dsh-im-dot-info { background: var(--im-text-3); }
.dsh-im-dot-error { background: var(--im-err); }

/* 键盘可达 */
.dsh-im-root :focus-visible { outline: 2px solid var(--im-accent); outline-offset: 2px; }
.dsh-im-root button:focus:not(:focus-visible) { outline: none; }

@container (max-width: 900px) {
  .dsh-im-shell { flex-direction: column; }
  .dsh-im-rail { flex-direction: row; flex-wrap: wrap; align-items: center; gap: 4px; width: auto; padding: 8px 12px; border-right: 0; border-bottom: 1px solid var(--im-border); overflow-x: auto; overflow-y: hidden; }
  .dsh-im-brand { padding: 0 8px 0 0; }
  .dsh-im-brandpkg, .dsh-im-railgroup, .dsh-im-railfoot, .dsh-im-navcount { display: none; }
  .dsh-im-nav { width: auto; padding: 0 10px; }
  .dsh-im-nav::before { display: none; }
  .dsh-im-prefs { display: flex; align-items: center; gap: 6px; margin: 0 0 0 auto; padding: 0; border: 0; }
  .dsh-im-prefs .dsh-im-seg { margin: 0; }
  .dsh-im-prefs .dsh-im-seg:first-of-type { display: none; }
  .dsh-im-main { overflow-y: auto; }
  .dsh-im-inner { padding: 0 18px 40px; }
  .dsh-im-hero { padding: 20px 0 16px; }
  .dsh-im-hero::after { display: none; }
  .dsh-im-title { font-size: 23px; }
  .dsh-im-stats { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .dsh-im-grid { grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); }
  .dsh-im-rules { grid-template-columns: 1fr; }
}

@container (max-width: 560px) {
  .dsh-im-inner { padding: 0 14px 32px; }
  .dsh-im-targets, .dsh-im-skeleton { grid-template-columns: 1fr; }
  .dsh-im-filter { width: 130px; }
  .dsh-im-picker { height: auto; flex-wrap: wrap; padding: 10px 10px 10px 12px; }
  .dsh-im-pickerinput { flex-basis: 160px; height: 30px; }
  .dsh-im-pickericon { display: none; }
  .dsh-im-btn { margin-left: auto; }
  .dsh-im-listbar { flex-wrap: wrap; }
  .dsh-im-stats { gap: 7px; }
  .dsh-im-stat { padding: 11px 12px 10px; }
  .dsh-im-statv { font-size: 21px; }
  .dsh-im-sechint { display: none; }
}

@media (prefers-reduced-motion: reduce) {
  .dsh-im-root *, .dsh-im-root *::before, .dsh-im-root *::after { animation-duration: 0.001ms !important; animation-iteration-count: 1 !important; transition-duration: 0.001ms !important; }
}
`

    function apply(ctx) {
      ctx.inject(['locale'], (injected) => {
        const push = (snapshot) => {
          if (LANG_MANUAL) return
          const active = snapshot && typeof snapshot.active === 'string' ? snapshot.active : ''
          setLang(/^en\b/i.test(active) ? 'en' : 'zh')
        }
        try {
          push(injected.locale.getSnapshot())
        } catch {
          if (!LANG_MANUAL) setLang(/^en\b/i.test(navigator.language) ? 'en' : 'zh')
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
    exports.__parts = { StudioIcon, StudioPanel, CheckSection, CommandsSection, RulesSection, memory, setLang, STYLE }
    return module.exports
  },
})
