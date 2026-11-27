// dsh-impeccable · 浏览器半边
//
//   - 左侧栏加一个「十六校审台」图标，点击进主区域的审校面板
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
    // 图标带一个版本串：路由允许缓存，换图后靠它让旧缓存失效
    const ICON_URL = '/impeccable/icon.png?v=2'
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
        title: '十六校审台',
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
        title: 'Shiliu Review Desk',
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
        src: ICON_URL,
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
                h('img', { src: ICON_URL, alt: '', loading: 'lazy' })),
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
  /* 手绘纸皮肤 · 浅色：暖白纸 + 炭笔 + 朱砂 + 马克笔黄
     字体分三档：hand 标题/动作名、text 正文、num 数字编号，各自有系统字体兜底。 */
  --im-bg: #fbf6ea;
  --im-surface: #fdfaf2;
  --im-surface-2: #f6ecd9;
  --im-surface-3: #efe2c9;
  --im-text: #2e2823;
  --im-text-2: #574c3f;
  --im-text-3: #6f5f49;
  --im-border: #e2d3b6;
  --im-border-strong: #c6b18e;
  --im-ink-line: #3d332a;
  --im-accent: #b23c25;
  --im-accent-soft: #f7e3d8;
  --im-accent-contrast: #fff8ef;
  --im-hover: #f6ecd9;
  --im-ok: #2f6b46;
  --im-warn: #a8541c;
  --im-err: #a52a20;
  --im-marker: #ffe08a;
  --im-marker-soft: rgba(255, 217, 102, 0.45);
  --im-invert-bg: #ffe08a;
  --im-invert-text: #2e2823;
  --im-shadow: 3px 3px 0 rgba(74, 52, 30, 0.13);
  --im-shadow-soft: 2px 2px 0 rgba(74, 52, 30, 0.10);
  --im-shadow-strong: 4px 5px 0 rgba(74, 52, 30, 0.16);
  --im-tint-1: #fdf3cf;
  --im-tint-2: #fbe6da;
  --im-tint-3: #e9f0f6;
  --im-tint-4: #eaf2e0;
  --im-tape: rgba(233, 200, 126, 0.62);
  --im-tape-line: rgba(150, 118, 64, 0.42);
  --im-paper-glow: #fffdf6;
  --im-paper-edge: #f6ecd6;
  --im-noise: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/><feColorMatrix type='saturate' values='0'/></filter><rect width='160' height='160' filter='url(%23n)' opacity='0.05'/></svg>");
  --im-mono: ui-monospace, SFMono-Regular, "SF Mono", Menlo, monospace;
  --im-hand: "HanziPen SC", "Hannotate SC", "Xingkai SC", "Kaiti SC", "STKaiti", "KaiTi", cursive;
  --im-text-face: "Hannotate SC", "HanziPen SC", "Kaiti SC", "STKaiti", "KaiTi", -apple-system, "PingFang SC", sans-serif;
  --im-num: "Bradley Hand", "Chalkboard SE", "Segoe Print", "HanziPen SC", cursive;
  --im-serif: "Songti SC", "Noto Serif SC", Georgia, serif;
  --im-cat-build: #3f5b8a;
  --im-cat-evaluate: #2f6f63;
  --im-cat-refine: #a8541c;
  --im-cat-enhance: #a8445c;
  --im-cat-fix: #5a6270;
  --im-cat-iterate: #6f6757;
  position: relative;
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 0;
  container-type: inline-size;
  background-color: var(--im-bg);
  background-image:
    var(--im-noise),
    radial-gradient(120% 90% at 8% 0%, var(--im-paper-glow) 0%, rgba(255, 253, 246, 0) 55%),
    radial-gradient(100% 80% at 100% 100%, var(--im-paper-edge) 0%, rgba(246, 236, 214, 0) 60%);
  color: var(--im-text);
  font-family: var(--im-text-face);
  font-size: 13.5px;
  line-height: 1.6;
  -webkit-font-smoothing: antialiased;
  font-variant-numeric: tabular-nums;
  color-scheme: light;
}
/* 深色：牛皮纸 / 黑板上的粉笔与朱砂 */
.dsh-im-root[data-im-theme="dark"] {
  --im-bg: #1d1811;
  --im-surface: #2e2519;
  --im-surface-2: #17130e;
  --im-surface-3: #3a2f1e;
  --im-text: #f6eee0;
  --im-text-2: #e2d5bd;
  --im-text-3: #bfae92;
  --im-border: #54452f;
  --im-border-strong: #8a7050;
  --im-ink-line: #c3ae8a;
  --im-accent: #fb9070;
  --im-accent-soft: #3a221a;
  --im-accent-contrast: #241209;
  --im-hover: #382d1e;
  --im-ok: #86d3a5;
  --im-warn: #f5bc75;
  --im-err: #ff9d8d;
  --im-marker: #5b4a1c;
  --im-marker-soft: rgba(180, 146, 52, 0.4);
  --im-invert-bg: #e8c97a;
  --im-invert-text: #241c13;
  --im-shadow: 3px 3px 0 rgba(0, 0, 0, 0.5);
  --im-shadow-soft: 2px 2px 0 rgba(0, 0, 0, 0.42);
  --im-shadow-strong: 4px 5px 0 rgba(0, 0, 0, 0.58);
  --im-tint-1: #3d3618;
  --im-tint-2: #40261f;
  --im-tint-3: #1f2c3a;
  --im-tint-4: #26331f;
  --im-tape: rgba(186, 152, 82, 0.34);
  --im-tape-line: rgba(226, 196, 136, 0.34);
  --im-paper-glow: #3b2f1d;
  --im-paper-edge: #100c08;
  --im-noise: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/><feColorMatrix type='saturate' values='0'/></filter><rect width='160' height='160' filter='url(%23n)' opacity='0.13'/></svg>");
  --im-cat-build: #a99bda;
  --im-cat-evaluate: #86c3b2;
  --im-cat-refine: #e8b06a;
  --im-cat-enhance: #e896a7;
  --im-cat-fix: #a6b0bd;
  --im-cat-iterate: #c2b69c;
  color-scheme: dark;
}
}

/* 骨架：左栏导航 + 右栏内容 */
.dsh-im-root, .dsh-im-root *, .dsh-im-root *::before, .dsh-im-root *::after { box-sizing: border-box; }
.dsh-im-shell { display: flex; height: 100%; min-height: 0; }
.dsh-im-rail {
  flex: none;
  display: flex;
  flex-direction: column;
  gap: 3px;
  width: 212px;
  padding: 18px 12px 14px;
  border-right: 1.6px dashed var(--im-border-strong);
  background-color: var(--im-surface-2);
  background-image: linear-gradient(180deg, rgba(255, 253, 246, 0.45), rgba(246, 236, 217, 0) 60%);
  overflow-y: auto;
  overflow-x: hidden;
}
.dsh-im-root[data-im-theme="dark"] .dsh-im-rail { background-image: linear-gradient(180deg, rgba(255, 244, 224, 0.045), rgba(34, 28, 22, 0) 60%); }
.dsh-im-brand { display: flex; align-items: center; gap: 10px; padding: 0 6px 16px; }
.dsh-im-brandmark {
  position: relative;
  flex: none;
  width: 38px;
  height: 38px;
  border-radius: 9px 5px 10px 4px / 5px 10px 4px 9px;
  overflow: hidden;
  transform: rotate(-2.2deg);
}
.dsh-im-brandmark img { display: block; width: 100%; height: 100%; object-fit: cover; }
.dsh-im-icon { display: block; border-radius: 5px; object-fit: cover; }
.dsh-im-brandtext { min-width: 0; }
.dsh-im-brandname { font-family: var(--im-hand); font-size: 15px; font-weight: 400; letter-spacing: 0.03em; line-height: 1.3; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

.dsh-im-railgroup {
  display: flex;
  align-items: center;
  gap: 7px;
  margin-top: 10px;
  padding: 0 8px 5px;
  font-family: var(--im-text-face);
  font-size: 12px;
  letter-spacing: 0.04em;
  color: var(--im-text-3);
}
.dsh-im-railgroup::before { content: ''; flex: none; width: 12px; height: 2px; border-radius: 2px; background: var(--im-accent); opacity: 0.8; transform: rotate(-4deg); }
.dsh-im-nav {
  position: relative;
  display: flex;
  align-items: center;
  gap: 9px;
  width: 100%;
  height: 34px;
  padding: 0 9px;
  border: 1.4px solid transparent;
  border-radius: 11px 5px 12px 6px / 6px 12px 5px 11px;
  background: transparent;
  color: var(--im-text-2);
  font: inherit;
  font-family: var(--im-hand);
  font-size: 14px;
  letter-spacing: 0.02em;
  text-align: left;
  white-space: nowrap;
  cursor: pointer;
  transition: background 0.16s ease, color 0.16s ease, transform 0.16s ease;
}
.dsh-im-nav:hover { background: var(--im-hover); color: var(--im-text); transform: rotate(-0.35deg); }
.dsh-im-nav-on, .dsh-im-nav-on:hover {
  background: var(--im-marker);
  border-color: var(--im-ink-line);
  color: var(--im-text);
  box-shadow: var(--im-shadow-soft);
  transform: rotate(-0.6deg);
}
.dsh-im-root[data-im-theme="dark"] .dsh-im-nav-on,
.dsh-im-root[data-im-theme="dark"] .dsh-im-nav-on:hover { background: var(--im-marker); color: var(--im-text); border-color: var(--im-border-strong); }
.dsh-im-nav svg { flex: none; width: 14px; height: 14px; stroke: currentColor; fill: none; stroke-width: 1.7; stroke-linecap: round; stroke-linejoin: round; }
.dsh-im-navcount { margin-left: auto; font-family: var(--im-num); font-size: 12px; color: var(--im-text-3); }
.dsh-im-nav-on .dsh-im-navcount { color: var(--im-text); opacity: 0.75; }
.dsh-im-prefs { margin-top: 18px; padding-top: 14px; border-top: 1.5px dashed var(--im-border-strong); }
.dsh-im-prefs .dsh-im-railgroup { margin-top: 0; }
.dsh-im-seg {
  display: flex;
  gap: 3px;
  padding: 3px;
  margin: 0 8px 7px;
  border: 1.5px solid var(--im-ink-line);
  border-radius: 9px 4px 10px 5px / 5px 10px 4px 9px;
  background: var(--im-surface);
  box-shadow: var(--im-shadow-soft);
}
.dsh-im-segbtn {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 26px;
  padding: 0 4px;
  border: 1.3px solid transparent;
  border-radius: 7px 3px 8px 4px / 4px 8px 3px 7px;
  background: transparent;
  color: var(--im-text-2);
  font: inherit;
  font-family: var(--im-hand);
  font-size: 12.5px;
  letter-spacing: 0.02em;
  cursor: pointer;
  transition: background 0.15s ease, color 0.15s ease;
}
.dsh-im-segbtn:hover { background: var(--im-hover); color: var(--im-text); }
.dsh-im-segbtn-on, .dsh-im-segbtn-on:hover {
  background: var(--im-marker);
  border-color: var(--im-ink-line);
  color: var(--im-text);
  box-shadow: 1px 1px 0 var(--im-shadow-soft);
}
.dsh-im-root[data-im-theme="dark"] .dsh-im-segbtn-on,
.dsh-im-root[data-im-theme="dark"] .dsh-im-segbtn-on:hover { border-color: var(--im-border-strong); }
.dsh-im-segbtn svg { display: block; stroke: currentColor; fill: none; }
.dsh-im-railfoot {
  margin-top: auto;
  padding: 14px 8px 0;
  border-top: 1.5px dashed var(--im-border-strong);
  font-family: var(--im-num);
  font-size: 12px;
  line-height: 1.75;
  letter-spacing: 0.02em;
  color: var(--im-text-3);
  overflow-wrap: anywhere;
}
.dsh-im-railfoot b { display: block; font-weight: 400; color: var(--im-text-2); }
.dsh-im-main { flex: 1; min-width: 0; overflow-y: auto; overscroll-behavior: contain; scrollbar-width: thin; scrollbar-color: var(--im-border-strong) transparent; }
.dsh-im-main::-webkit-scrollbar { width: 10px; }
.dsh-im-main::-webkit-scrollbar-thumb { background: var(--im-border-strong); border: 3px solid transparent; border-radius: 999px; background-clip: content-box; }
.dsh-im-main::-webkit-scrollbar-track { background: transparent; }
.dsh-im-inner { max-width: 1080px; margin: 0 auto; padding: 0 32px 48px; }

/* 头部：手写大标题 + 波浪下划线 + 便签四格 */
.dsh-im-hero { position: relative; padding: 30px 0 18px; border-bottom: 1.8px dashed var(--im-border-strong); }
.dsh-im-hero::before {
  content: '';
  position: absolute;
  right: 2px;
  top: 20px;
  width: 26px;
  height: 26px;
  pointer-events: none;
  background: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'><path d='M12 2.6 13.9 9.3 20.6 11.2 13.9 13.1 12 19.8 10.1 13.1 3.4 11.2 10.1 9.3 Z' fill='none' stroke='%23cf4a32' stroke-width='1.7' stroke-linejoin='round'/></svg>") no-repeat center / contain;
  transform: rotate(9deg);
  opacity: 0.85;
}
.dsh-im-title { position: relative; display: inline-block; margin: 0; padding-bottom: 11px; font-family: var(--im-hand); font-size: 34px; font-weight: 400; line-height: 1.15; letter-spacing: 0.02em; color: var(--im-text); }
.dsh-im-title::after {
  content: '';
  position: absolute;
  left: 2px;
  bottom: 0;
  width: 100%;
  height: 8px;
  background: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='48' height='8' viewBox='0 0 48 8'><path d='M1 5 Q7 1.4 13 5 T25 5 T37 5 T47 4.4' fill='none' stroke='%23cf4a32' stroke-width='2.2' stroke-linecap='round'/></svg>") repeat-x left center / 48px 8px;
  opacity: 0.9;
}
.dsh-im-lede { margin: 12px 0 0; max-width: 60ch; font-family: var(--im-text-face); font-size: 13.5px; line-height: 1.75; color: var(--im-text-2); }
.dsh-im-stats { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 14px; margin-top: 24px; }
.dsh-im-stat {
  position: relative;
  padding: 15px 15px 13px;
  border: 1.6px solid var(--im-ink-line);
  border-radius: 14px 5px 16px 7px / 7px 16px 5px 14px;
  background: var(--im-surface);
  overflow: hidden;
  box-shadow: var(--im-shadow);
  transform: rotate(-0.4deg);
}
.dsh-im-stat:nth-child(1) { background: var(--im-tint-1); }
.dsh-im-stat:nth-child(2) { background: var(--im-tint-2); transform: rotate(0.5deg); }
.dsh-im-stat:nth-child(3) { background: var(--im-tint-3); transform: rotate(-0.3deg); }
.dsh-im-stat:nth-child(4) { background: var(--im-tint-4); transform: rotate(0.4deg); }
.dsh-im-root[data-im-theme="dark"] .dsh-im-stat { border-color: var(--im-border-strong); }
.dsh-im-stat::before { content: ''; position: absolute; left: 15px; top: 10px; width: 28px; height: 2.5px; border-radius: 2px; background: var(--im-accent); opacity: 0.85; }
.dsh-im-statv { font-family: var(--im-num); font-size: 27px; font-weight: 400; line-height: 1; letter-spacing: 0.01em; color: var(--im-text); }
.dsh-im-statv-sm { font-family: var(--im-num); font-size: 15px; letter-spacing: 0.01em; line-height: 1.6; word-break: break-all; }
.dsh-im-statl { display: block; margin-top: 8px; font-family: var(--im-text-face); font-size: 12.5px; letter-spacing: 0.02em; color: var(--im-text-2); }
.dsh-im-statl::before { display: none; }

/* 区块：手绘圈编号 + 手写标题 */
.dsh-im-sec { padding-top: 28px; scroll-margin-top: 12px; }
.dsh-im-sechead { display: flex; align-items: center; gap: 11px; padding-bottom: 11px; border-bottom: 1.6px dashed var(--im-border-strong); }
.dsh-im-num {
  position: relative;
  flex: none;
  display: inline-block;
  padding: 0 6px;
  font-family: var(--im-num);
  font-size: 15px;
  font-weight: 400;
  line-height: 1.2;
  letter-spacing: 0.04em;
  color: var(--im-accent);
}
.dsh-im-num::before {
  content: '';
  position: absolute;
  inset: -4px -4px -3px -4px;
  border: 1.7px solid var(--im-accent);
  border-radius: 50% 46% 52% 48% / 52% 48% 54% 46%;
  transform: rotate(-6deg);
  opacity: 0.7;
}
.dsh-im-root[data-im-theme="dark"] .dsh-im-num::before { border-color: var(--im-accent); opacity: 0.6; }
.dsh-im-sectitle { margin: 0; font-family: var(--im-hand); font-size: 17px; font-weight: 400; letter-spacing: 0.03em; white-space: nowrap; color: var(--im-text); }
.dsh-im-sechint { font-family: var(--im-text-face); font-size: 12.5px; color: var(--im-text-2); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.dsh-im-link {
  margin-left: auto;
  padding: 2px 0;
  border: 0;
  background: transparent;
  color: var(--im-accent);
  font: inherit;
  font-family: var(--im-text-face);
  font-size: 12.5px;
  letter-spacing: 0.02em;
  white-space: nowrap;
  cursor: pointer;
  text-underline-offset: 4px;
}
.dsh-im-link:hover:not(:disabled) { text-decoration: underline; text-decoration-style: wavy; text-decoration-thickness: 1.4px; }
.dsh-im-link:disabled { color: var(--im-text-3); cursor: default; }

/* 输入框：手绘边框 + 硬阴影，聚焦时朱红描边 */
.dsh-im-picker {
  display: flex;
  align-items: center;
  gap: 10px;
  height: 52px;
  margin-top: 16px;
  padding: 0 7px 0 14px;
  border: 1.6px solid var(--im-ink-line);
  border-radius: 13px 6px 14px 7px / 8px 15px 6px 13px;
  background: var(--im-surface);
  box-shadow: var(--im-shadow);
  transition: border-color 0.16s ease, box-shadow 0.16s ease;
}
.dsh-im-root[data-im-theme="dark"] .dsh-im-picker { border-color: var(--im-border-strong); }
.dsh-im-picker:focus-within { border-color: var(--im-accent); box-shadow: 3px 3px 0 var(--im-accent-soft); }
.dsh-im-pickericon { display: flex; flex: none; color: var(--im-text-3); }
.dsh-im-pickericon svg { display: block; }
.dsh-im-pickerinput { flex: 1; min-width: 0; height: 100%; padding: 0; border: 0; background: transparent; color: var(--im-text); font: inherit; font-family: var(--im-text-face); font-size: 14px; outline: none; }
.dsh-im-pickerinput::placeholder { color: var(--im-text-3); }
.dsh-im-btn {
  flex: none;
  height: 37px;
  padding: 0 17px;
  border: 1.6px solid var(--im-accent);
  border-radius: 10px 4px 11px 5px / 5px 11px 4px 10px;
  background: var(--im-accent);
  color: var(--im-accent-contrast);
  font: inherit;
  font-family: var(--im-hand);
  font-size: 14px;
  letter-spacing: 0.04em;
  white-space: nowrap;
  cursor: pointer;
  box-shadow: 2px 2px 0 rgba(74, 52, 30, 0.22);
  transition: transform 0.12s ease, box-shadow 0.12s ease, background 0.12s ease;
}
.dsh-im-btn:hover:not(:disabled) { background: var(--im-err); transform: translate(-1px, -1px); box-shadow: 3px 4px 0 rgba(74, 52, 30, 0.22); }
.dsh-im-btn:active:not(:disabled) { transform: translate(1px, 1px); box-shadow: 1px 1px 0 rgba(74, 52, 30, 0.2); }
.dsh-im-btn:disabled { border-color: var(--im-border-strong); background: var(--im-surface-3); color: var(--im-text-3); box-shadow: none; cursor: default; }
.dsh-im-root[data-im-theme="dark"] .dsh-im-btn { border-color: #ef6a4a; background: #ef6a4a; color: #2a1409; }
.dsh-im-root[data-im-theme="dark"] .dsh-im-btn:hover:not(:disabled) { background: #ff9d8d; border-color: #ff9d8d; }
.dsh-im-pickerhint { margin: 9px 2px 0; font-family: var(--im-text-face); font-size: 12.5px; line-height: 1.6; color: var(--im-text-3); }

/* 页面列表：贴在墙上的索引卡 */
.dsh-im-listbar { display: flex; align-items: center; gap: 10px; margin-top: 20px; }
.dsh-im-listhint { font-family: var(--im-text-face); font-size: 12.5px; letter-spacing: 0.02em; color: var(--im-text-2); }
.dsh-im-filter {
  margin-left: auto;
  width: 190px;
  height: 30px;
  padding: 0 11px;
  border: 1.4px solid var(--im-border-strong);
  border-radius: 9px 4px 10px 5px / 5px 10px 4px 9px;
  background: var(--im-surface);
  color: var(--im-text);
  font: inherit;
  font-family: var(--im-text-face);
  font-size: 12.5px;
  outline: none;
  transition: border-color 0.15s ease;
}
.dsh-im-filter::placeholder { color: var(--im-text-3); }
.dsh-im-filter:focus { border-color: var(--im-accent); }
.dsh-im-pad { margin: 12px 0 0; }
.dsh-im-hint { margin: 0; font-family: var(--im-text-face); font-size: 12.5px; line-height: 1.65; color: var(--im-text-2); }
.dsh-im-error { margin: 0; font-family: var(--im-text-face); font-size: 12.5px; color: var(--im-err); word-break: break-word; }
.dsh-im-targets { display: grid; grid-template-columns: repeat(auto-fill, minmax(270px, 1fr)); gap: 13px; margin-top: 12px; padding-top: 4px; }
.dsh-im-target {
  position: relative;
  display: flex;
  min-width: 0;
  border: 1.6px solid var(--im-ink-line);
  border-radius: 12px 5px 14px 6px / 6px 14px 5px 12px;
  background: var(--im-surface);
  box-shadow: var(--im-shadow);
  transform: rotate(-0.35deg);
  transition: border-color 0.15s ease, background 0.15s ease, box-shadow 0.15s ease, transform 0.15s ease;
}
.dsh-im-root[data-im-theme="dark"] .dsh-im-target { border-color: var(--im-border-strong); }
.dsh-im-target:nth-child(2n) { transform: rotate(0.4deg); }
.dsh-im-target::before {
  content: '';
  position: absolute;
  top: -8px;
  left: 50%;
  width: 56px;
  height: 15px;
  margin-left: -28px;
  background: var(--im-tape);
  border-left: 1px dashed var(--im-tape-line);
  border-right: 1px dashed var(--im-tape-line);
  transform: rotate(-2.6deg);
  z-index: 3;
  pointer-events: none;
}
.dsh-im-target:nth-child(2n)::before { transform: rotate(2.2deg); }
.dsh-im-target:hover { border-color: var(--im-accent); background: var(--im-surface); box-shadow: var(--im-shadow-strong); transform: translateY(-3px) rotate(0deg); z-index: 2; }
.dsh-im-target-on, .dsh-im-target-on:hover { border-color: var(--im-ink-line); background: var(--im-tint-1); box-shadow: var(--im-shadow-strong); transform: translateY(-3px) rotate(-0.2deg); }
.dsh-im-targetmain { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 6px; padding: 14px 40px 13px 15px; border: 0; background: transparent; color: inherit; font: inherit; text-align: left; cursor: pointer; }
.dsh-im-targetname { font-family: var(--im-hand); font-size: 14.5px; font-weight: 400; letter-spacing: 0.02em; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.dsh-im-targetsub { display: flex; align-items: center; gap: 7px; min-width: 0; font-family: var(--im-mono); font-size: 12px; color: var(--im-text-2); }
.dsh-im-targetdir { min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.dsh-im-targettime { flex: none; font-family: var(--im-text-face); color: var(--im-text-3); }
.dsh-im-targettime::before { content: '·'; margin-right: 7px; color: var(--im-border-strong); }
.dsh-im-targetgo { position: absolute; top: 10px; right: 10px; display: flex; align-items: center; justify-content: center; width: 24px; height: 24px; padding: 0; border: 1.2px solid transparent; border-radius: 7px 3px 8px 4px / 4px 8px 3px 7px; background: transparent; color: var(--im-text-3); cursor: pointer; opacity: 0.55; transition: opacity 0.15s ease, color 0.15s ease, background 0.15s ease, transform 0.15s ease; }
.dsh-im-target:hover .dsh-im-targetgo, .dsh-im-target-on .dsh-im-targetgo { opacity: 1; }
.dsh-im-targetgo:hover { background: var(--im-marker); border-color: var(--im-ink-line); color: var(--im-text); transform: rotate(-4deg); }
.dsh-im-targetgo svg { display: block; }
.dsh-im-skeleton { display: grid; grid-template-columns: repeat(auto-fill, minmax(270px, 1fr)); gap: 13px; margin-top: 12px; }
.dsh-im-sk { height: 64px; border: 1.5px dashed var(--im-border-strong); border-radius: 12px 5px 14px 6px / 6px 14px 5px 12px; background: linear-gradient(90deg, var(--im-surface-2) 0%, var(--im-surface-3) 50%, var(--im-surface-2) 100%); background-size: 200% 100%; animation: dsh-im-shimmer 1.6s linear infinite; }
@keyframes dsh-im-shimmer { 0% { background-position: 140% 0; } 100% { background-position: -40% 0; } }

/* 结果：空白便条 → 铅笔进度 → 问题便签 */
.dsh-im-empty { display: flex; align-items: center; gap: 14px; margin-top: 16px; padding: 20px; border: 1.7px dashed var(--im-border-strong); border-radius: 13px 5px 15px 6px / 7px 15px 5px 13px; background: var(--im-surface-2); }
.dsh-im-emptyicon { flex: none; display: flex; align-items: center; justify-content: center; width: 42px; height: 42px; border: 1.7px solid var(--im-accent); border-radius: 50% 47% 52% 48% / 51% 49% 53% 47%; background: var(--im-surface); color: var(--im-accent); transform: rotate(-4deg); }
.dsh-im-emptyicon svg { display: block; }
.dsh-im-emptytitle { font-family: var(--im-hand); font-size: 14.5px; font-weight: 400; letter-spacing: 0.02em; }
.dsh-im-emptybody { margin: 4px 0 0; font-family: var(--im-text-face); font-size: 12.5px; line-height: 1.65; color: var(--im-text-2); }
.dsh-im-running { margin-top: 16px; padding: 17px 18px; border: 1.6px solid var(--im-ink-line); border-radius: 12px 5px 13px 6px / 6px 13px 5px 12px; background: var(--im-surface); box-shadow: var(--im-shadow); }
.dsh-im-root[data-im-theme="dark"] .dsh-im-running { border-color: var(--im-border-strong); }
.dsh-im-running p { margin: 12px 0 0; font-family: var(--im-text-face); font-size: 13px; color: var(--im-text-2); }
.dsh-im-bar { position: relative; height: 7px; border-radius: 4px; background-image: repeating-linear-gradient(90deg, var(--im-border-strong) 0 7px, transparent 7px 12px); }
.dsh-im-bar::after { content: ''; position: absolute; inset: 0; border-radius: 4px; background: var(--im-accent); opacity: 0.55; animation: dsh-im-breathe 1.3s ease-in-out infinite; }
@keyframes dsh-im-breathe { 0%, 100% { opacity: 0.25; } 50% { opacity: 0.85; } }
.dsh-im-resultmeta { display: flex; flex-wrap: wrap; align-items: center; gap: 8px; margin-top: 16px; font-family: var(--im-text-face); font-size: 12.5px; color: var(--im-text-2); }
.dsh-im-resultfile { font-family: var(--im-mono); font-size: 12.5px; color: var(--im-text); }
.dsh-im-tag { padding: 2px 9px; border: 1.2px dashed var(--im-border-strong); border-radius: 7px 3px 8px 4px / 4px 8px 3px 7px; background: var(--im-surface); font-family: var(--im-text-face); font-size: 12px; color: var(--im-text-2); }
.dsh-im-metrics { display: grid; grid-template-columns: repeat(auto-fit, minmax(122px, 1fr)); gap: 12px; margin-top: 14px; }
.dsh-im-metric { position: relative; padding: 14px 14px 12px; border: 1.6px solid var(--im-ink-line); border-radius: 13px 5px 15px 6px / 7px 15px 5px 13px; background: var(--im-surface); overflow: hidden; box-shadow: var(--im-shadow-soft); transform: rotate(-0.25deg); }
.dsh-im-root[data-im-theme="dark"] .dsh-im-metric { border-color: var(--im-border-strong); }
.dsh-im-metric::before { content: ''; position: absolute; left: 14px; top: 9px; width: 24px; height: 2.5px; border-radius: 2px; background: var(--im-text-3); opacity: 0.8; }
.dsh-im-metric-brand::before { background: var(--im-accent); }
.dsh-im-metric-warn::before { background: var(--im-warn); }
.dsh-im-metricv { font-family: var(--im-num); font-size: 26px; font-weight: 400; line-height: 1; letter-spacing: 0.01em; }
.dsh-im-metricu { margin-left: 3px; font-family: var(--im-num); font-size: 12.5px; letter-spacing: 0.02em; color: var(--im-text-2); }
.dsh-im-metricl { display: block; margin-top: 7px; font-family: var(--im-text-face); font-size: 12.5px; letter-spacing: 0.02em; color: var(--im-text-2); }
.dsh-im-metricl::before { display: none; }
.dsh-im-metric-brand .dsh-im-metricv { color: var(--im-text); }
.dsh-im-metric-warn .dsh-im-metricv { color: var(--im-warn); }
.dsh-im-metric-mute .dsh-im-metricv { color: var(--im-text-2); }
.dsh-im-findings { display: flex; flex-direction: column; gap: 11px; margin-top: 14px; }
.dsh-im-finding {
  padding: 14px 16px 15px;
  border: 1.6px solid var(--im-ink-line);
  border-radius: 13px 5px 15px 6px / 7px 16px 5px 13px;
  background: color-mix(in srgb, var(--im-warn) 7%, var(--im-surface));
  box-shadow: var(--im-shadow-soft);
  transform: rotate(-0.15deg);
}
.dsh-im-root[data-im-theme="dark"] .dsh-im-finding { border-color: var(--im-border-strong); background: color-mix(in srgb, var(--im-warn) 11%, var(--im-surface)); }
.dsh-im-finding-info { background: var(--im-surface); }
.dsh-im-finding:nth-child(2n) { transform: rotate(0.12deg); }
.dsh-im-findinghead { display: flex; align-items: center; gap: 9px; }
.dsh-im-fdot { flex: none; width: 8px; height: 8px; border-radius: 50% 45% 52% 48%; background: var(--im-warn); box-shadow: 0 0 0 1.5px color-mix(in srgb, var(--im-warn) 34%, transparent); }
.dsh-im-fdot-info { background: var(--im-text-3); box-shadow: none; }
.dsh-im-findingname { margin: 0; font-family: var(--im-hand); font-size: 15px; font-weight: 400; letter-spacing: 0.02em; }
.dsh-im-sev { flex: none; padding: 1px 8px; border: 1.2px solid var(--im-border-strong); border-radius: 7px 3px 8px 4px / 4px 8px 3px 7px; font-family: var(--im-text-face); font-size: 12px; letter-spacing: 0.02em; }
.dsh-im-sev-warn { background: var(--im-marker-soft); color: color-mix(in srgb, var(--im-warn) 65%, var(--im-text)); }
.dsh-im-sev-info { background: var(--im-surface-3); color: var(--im-text-2); }
.dsh-im-root[data-im-theme="dark"] .dsh-im-sev-warn { background: rgba(150, 120, 40, 0.32); color: #ffe9c2; }
.dsh-im-count { margin-left: auto; font-family: var(--im-num); font-size: 13px; color: var(--im-text-2); }
.dsh-im-findingdesc { margin: 6px 0 0; max-width: 94ch; font-family: var(--im-text-face); font-size: 12.5px; line-height: 1.65; color: var(--im-text-2); }
.dsh-im-locs { display: flex; flex-direction: column; gap: 4px; margin: 10px 0 0; padding: 0; list-style: none; }
.dsh-im-loc { display: flex; align-items: baseline; gap: 10px; min-width: 0; font-family: var(--im-mono); font-size: 12px; color: var(--im-text-2); }
.dsh-im-locfile { min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.dsh-im-locline { flex: none; font-family: var(--im-text-face); color: var(--im-text-3); }
.dsh-im-more { margin: 7px 0 0; font-family: var(--im-text-face); font-size: 12.5px; color: var(--im-text-3); }
.dsh-im-fix { display: inline-flex; align-items: center; gap: 6px; margin-top: 11px; padding: 0; border: 0; background: transparent; color: var(--im-accent); font: inherit; font-family: var(--im-text-face); font-size: 12.5px; font-weight: 600; cursor: pointer; text-underline-offset: 4px; }
.dsh-im-fix:hover { text-decoration: underline; text-decoration-style: wavy; text-decoration-thickness: 1.4px; }
.dsh-im-fix svg { width: 12px; height: 12px; }
.dsh-im-clean { margin-top: 16px; padding: 20px; border: 1.6px solid var(--im-ink-line); border-radius: 13px 5px 15px 6px / 7px 16px 5px 13px; background: var(--im-tint-4); box-shadow: var(--im-shadow-soft); }
.dsh-im-root[data-im-theme="dark"] .dsh-im-clean { border-color: var(--im-border-strong); }
.dsh-im-cleantitle { font-family: var(--im-hand); font-size: 16px; font-weight: 400; letter-spacing: 0.02em; color: var(--im-ok); }
.dsh-im-cleantitle::before { content: '✓'; margin-right: 8px; }
.dsh-im-alert { margin-top: 16px; padding: 16px 17px; border: 1.6px solid var(--im-ink-line); border-radius: 13px 5px 15px 6px / 7px 16px 5px 13px; background: var(--im-tint-2); box-shadow: var(--im-shadow-soft); }
.dsh-im-root[data-im-theme="dark"] .dsh-im-alert { border-color: var(--im-border-strong); }
.dsh-im-alerttitle { font-family: var(--im-hand); font-size: 15px; font-weight: 400; letter-spacing: 0.02em; color: var(--im-err); }
.dsh-im-alertbody { margin: 6px 0 0; font-family: var(--im-text-face); font-size: 12.5px; line-height: 1.65; color: var(--im-err); word-break: break-word; }

/* 提示条：纸条 */
.dsh-im-banner { margin-top: 16px; padding: 13px 15px; border: 1.5px solid var(--im-border-strong); border-radius: 11px 5px 12px 6px / 6px 12px 5px 11px; font-family: var(--im-text-face); font-size: 12.5px; line-height: 1.65; background: var(--im-surface-2); }
.dsh-im-banner-info { border-color: color-mix(in srgb, var(--im-accent) 45%, var(--im-border-strong)); background: var(--im-accent-soft); color: var(--im-text-2); }
.dsh-im-banner-error { border-color: color-mix(in srgb, var(--im-err) 45%, var(--im-border-strong)); background: var(--im-tint-2); color: var(--im-err); }

/* 命令：一墙贴纸 */
.dsh-im-chips { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 15px; }
.dsh-im-chip {
  height: 30px;
  padding: 0 13px;
  border: 1.4px solid var(--im-border-strong);
  border-radius: 9px 4px 10px 5px / 5px 10px 4px 9px;
  background: var(--im-surface);
  color: var(--im-text-2);
  font: inherit;
  font-family: var(--im-hand);
  font-size: 13px;
  letter-spacing: 0.03em;
  cursor: pointer;
  transition: border-color 0.15s ease, color 0.15s ease, background 0.15s ease, transform 0.15s ease;
}
.dsh-im-chip:hover { border-color: var(--im-accent); color: var(--im-text); transform: rotate(-0.8deg); }
.dsh-im-chip-on, .dsh-im-chip-on:hover { border-color: var(--im-ink-line); background: var(--im-marker); color: var(--im-text); box-shadow: var(--im-shadow-soft); transform: rotate(-1deg); }
.dsh-im-root[data-im-theme="dark"] .dsh-im-chip-on, .dsh-im-root[data-im-theme="dark"] .dsh-im-chip-on:hover { border-color: var(--im-border-strong); }
.dsh-im-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 11px; margin-top: 13px; }
.dsh-im-cmd {
  position: relative;
  min-width: 0;
  border: 1.5px solid var(--im-ink-line);
  border-radius: 11px 4px 12px 5px / 5px 12px 4px 11px;
  background: var(--im-surface);
  box-shadow: var(--im-shadow-soft);
  transform: rotate(-0.3deg);
  transition: border-color 0.15s ease, background 0.15s ease, transform 0.15s ease, box-shadow 0.15s ease;
}
.dsh-im-root[data-im-theme="dark"] .dsh-im-cmd { border-color: var(--im-border-strong); }
.dsh-im-cmd:nth-child(3n + 2) { transform: rotate(0.35deg); }
.dsh-im-cmd:nth-child(3n + 3) { transform: rotate(-0.15deg); }
.dsh-im-cmdmain { display: flex; flex-direction: column; gap: 7px; width: 100%; min-height: 80px; padding: 13px 15px; border: 0; background: transparent; color: inherit; font: inherit; text-align: left; cursor: pointer; }
.dsh-im-cmd:hover { border-color: var(--im-accent); background: var(--im-surface); transform: translateY(-3px) rotate(0deg); box-shadow: var(--im-shadow-strong); z-index: 2; }
.dsh-im-cmd-on { border-color: var(--im-ok); background: var(--im-tint-4); }
.dsh-im-cmdtop { display: flex; align-items: center; gap: 8px; min-width: 0; padding-right: 26px; }
.dsh-im-catdot { flex: none; width: 13px; height: 3px; border-radius: 2px; background: var(--im-cat-build); transform: rotate(-8deg); }
.dsh-im-cmd[data-cat="Evaluate"] .dsh-im-catdot { background: var(--im-cat-evaluate); }
.dsh-im-cmd[data-cat="Refine"] .dsh-im-catdot { background: var(--im-cat-refine); }
.dsh-im-cmd[data-cat="Enhance"] .dsh-im-catdot { background: var(--im-cat-enhance); }
.dsh-im-cmd[data-cat="Fix"] .dsh-im-catdot { background: var(--im-cat-fix); }
.dsh-im-cmd[data-cat="Iterate"] .dsh-im-catdot { background: var(--im-cat-iterate); }
.dsh-im-cmdaction { min-width: 0; font-family: var(--im-hand); font-size: 14.5px; font-weight: 400; letter-spacing: 0.02em; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.dsh-im-cmdname { flex: none; font-family: var(--im-num); font-size: 12px; letter-spacing: 0.01em; color: var(--im-text-3); }
.dsh-im-cmdopen { position: absolute; top: 10px; right: 10px; display: flex; align-items: center; justify-content: center; width: 23px; height: 23px; padding: 0; border: 1.2px solid transparent; border-radius: 7px 3px 8px 4px / 4px 8px 3px 7px; background: transparent; color: var(--im-text-3); cursor: pointer; opacity: 0.5; transition: opacity 0.15s ease, transform 0.15s ease, color 0.15s ease, background 0.15s ease; }
.dsh-im-cmdopen:hover { color: var(--im-text); background: var(--im-marker); border-color: var(--im-ink-line); }
.dsh-im-cmd:hover .dsh-im-cmdopen { opacity: 1; }
.dsh-im-cmdopen svg { display: block; }
.dsh-im-cmddesc { margin: 0; font-family: var(--im-text-face); font-size: 12.5px; line-height: 1.6; color: var(--im-text-2); display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
.dsh-im-copied { position: absolute; right: 13px; bottom: 10px; font-family: var(--im-num); font-size: 12px; letter-spacing: 0.04em; color: var(--im-ok); }

/* 规则：像一页检查清单 */
.dsh-im-search { display: flex; margin-top: 14px; }
.dsh-im-input {
  flex: 1;
  min-width: 0;
  height: 36px;
  padding: 0 12px;
  border: 1.4px solid var(--im-border-strong);
  border-radius: 10px 4px 11px 5px / 5px 11px 4px 10px;
  background: var(--im-surface);
  color: var(--im-text);
  font: inherit;
  font-family: var(--im-text-face);
  font-size: 13px;
  outline: none;
  transition: border-color 0.15s ease;
}
.dsh-im-input::placeholder { color: var(--im-text-3); }
.dsh-im-input:focus { border-color: var(--im-accent); }
.dsh-im-rules { display: grid; grid-template-columns: repeat(auto-fill, minmax(340px, 1fr)); column-gap: 30px; margin: 12px 0 0; padding: 0; list-style: none; }
.dsh-im-rule { display: flex; gap: 9px; align-items: flex-start; min-width: 0; padding: 9px 8px 9px 0; border-top: 1.4px dashed var(--im-border-strong); }
.dsh-im-rule:hover { background: var(--im-hover); }
.dsh-im-rulebody { min-width: 0; display: flex; flex-direction: column; gap: 4px; }
.dsh-im-ruletop { display: flex; align-items: baseline; gap: 10px; min-width: 0; }
.dsh-im-rulename { flex: none; font-family: var(--im-hand); font-size: 13.5px; font-weight: 400; letter-spacing: 0.02em; }
.dsh-im-ruleid { flex: none; font-family: var(--im-num); font-size: 12px; color: var(--im-text-3); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.dsh-im-rulecat { flex: none; margin-left: auto; font-family: var(--im-text-face); font-size: 12px; color: var(--im-text-2); }
.dsh-im-rulecat-slop { color: var(--im-accent); }
.dsh-im-ruledesc { margin: 0; font-family: var(--im-text-face); font-size: 12px; line-height: 1.6; color: var(--im-text-2); display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
.dsh-im-dot { flex: none; width: 6px; height: 6px; margin-top: 7px; border-radius: 50% 44% 53% 47%; background: var(--im-warn); transform: rotate(12deg); }
.dsh-im-dot-info { background: var(--im-text-3); }
.dsh-im-dot-error { background: var(--im-err); }

/* 键盘可达：虚线手绘焦点框 */
.dsh-im-root :focus-visible { outline: 2px dashed var(--im-accent); outline-offset: 3px; }
.dsh-im-root button:focus:not(:focus-visible) { outline: none; }

@container (max-width: 900px) {
  .dsh-im-shell { flex-direction: column; }
  .dsh-im-rail { flex-direction: row; flex-wrap: wrap; align-items: center; gap: 4px; width: auto; padding: 9px 12px; border-right: 0; border-bottom: 1.6px dashed var(--im-border-strong); overflow-x: auto; overflow-y: hidden; }
  .dsh-im-brand { padding: 0 8px 0 0; }
  .dsh-im-brandpkg, .dsh-im-railgroup, .dsh-im-railfoot, .dsh-im-navcount { display: none; }
  .dsh-im-nav { width: auto; padding: 0 11px; }
  .dsh-im-nav::before { display: none; }
  .dsh-im-prefs { display: flex; align-items: center; gap: 6px; margin: 0 0 0 auto; padding: 0; border: 0; }
  .dsh-im-prefs .dsh-im-seg { margin: 0; }
  .dsh-im-prefs .dsh-im-seg:first-of-type { display: none; }
  .dsh-im-main { overflow-y: auto; }
  .dsh-im-inner { padding: 0 18px 40px; }
  .dsh-im-hero { padding: 22px 0 16px; }
  .dsh-im-hero::before { display: none; }
  .dsh-im-title { font-size: 26px; }
  .dsh-im-stats { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .dsh-im-grid { grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); }
  .dsh-im-rules { grid-template-columns: 1fr; }
}

@container (max-width: 560px) {
  .dsh-im-inner { padding: 0 14px 32px; }
  .dsh-im-targets, .dsh-im-skeleton { grid-template-columns: 1fr; }
  .dsh-im-filter { width: 130px; }
  .dsh-im-picker { height: auto; flex-wrap: wrap; padding: 11px 10px 11px 13px; }
  .dsh-im-pickerinput { flex-basis: 160px; height: 30px; }
  .dsh-im-pickericon { display: none; }
  .dsh-im-btn { margin-left: auto; }
  .dsh-im-listbar { flex-wrap: wrap; }
  .dsh-im-stats { gap: 9px; }
  .dsh-im-stat { padding: 13px 13px 11px; }
  .dsh-im-statv { font-size: 23px; }
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
