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
        title: '设计校审台',
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
        step1: '选一个要看的页面',
        step2: '检查',
        step3: '结果',
        scanNow: '开始检查',
        scanningShort: '检查中…',
        nonePicked: '还没选文件，在上面点一个就行。',
        loading: '正在找你最近改过的网页…',
        noTargets: '没找到现成的网页文件。手动填一个路径或网址也可以。',
        showManual: '手动填路径或网址',
        hideManual: '收起',
        targetPlaceholder: '粘贴一个网址，或填文件的完整路径',
        selectedLabel: '当前选中',
        found: '发现 {n} 处问题',
        clean: '没发现问题',
        cleanBody: '这个页面的文字、间距、配色都过了 62 条检查。换一个页面继续，或者去下面的「更多工具」看看还能做什么。',
        where: '{file} 第 {line} 行',
        whereNoLine: '{file}',
        fixIt: '让 AI 帮我改',
        fixPrompt: '用 impeccable 技能修一下 {file}：{name}。{desc}\n\n技能文档在 {dir}/SKILL.md，先读它（含 Setup），再动手。',
        targetsHint: '这些是你电脑里最近改过的网页',
        toolsTitle: '更多工具',
        toolsHint: '{n} 个动作，小白可以先不看',
        rulesTitle: '检查项清单',
        rulesHint2: '{n} 条，看看它到底在查什么',
        lede: '不用记命令，不用填路径。选一个页面，点一下，就知道哪里让人看不清、哪里排版乱。',
        kicker: '设计审校台',
        statRules: '条规则',
        statCommands: '条命令',
        statCats: '个分类',
        statEngine: '引擎',
        railGroup: '审校',
        navCheck: '审校台',
        navCommands: '命令',
        navRules: '检查项',

      },
      en: {
        title: 'Design Review Desk',
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
        step1: 'Pick a page',
        step2: 'Check it',
        step3: 'Results',
        scanNow: 'Check this page',
        scanningShort: 'Checking…',
        nonePicked: 'Nothing picked yet — click one above.',
        loading: 'Looking for pages you worked on recently…',
        noTargets: 'No HTML files around. Type a path or URL instead.',
        showManual: 'Type a path or URL',
        hideManual: 'Hide',
        targetPlaceholder: 'Paste a URL, or the full path to a file',
        selectedLabel: 'Selected',
        found: '{n} problems found',
        clean: 'Nothing found',
        cleanBody: 'This page passed all 62 checks. Try another one, or look further down at More tools.',
        where: '{file}, line {line}',
        whereNoLine: '{file}',
        fixIt: 'Have AI fix it',
        fixPrompt: 'Fix this with the impeccable skill: {file} — {name}. {desc}\n\nThe skill lives at {dir}/SKILL.md; read it first (including Setup), then act.',
        targetsHint: 'Pages you edited recently on this machine',
        toolsTitle: 'More tools',
        toolsHint: '{n} actions — beginners can skip this',
        rulesTitle: 'What it checks',
        rulesHint2: '{n} rules, if you want to know the details',
        lede: 'No commands to memorize, no paths to type. Pick a page, press one button, and see what is hard to read or badly spaced.',
        kicker: 'Design review desk',
        statRules: 'rules',
        statCommands: 'commands',
        statCats: 'categories',
        statEngine: 'engine',
        railGroup: 'Review',
        navCheck: 'Desk',
        navCommands: 'Commands',
        navRules: 'Rules',

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
    function commandAction(lang, name) {
      if (lang === 'zh' && typeof COMMAND_ACTION[name] === 'string') return COMMAND_ACTION[name]
      return name
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

    // 三步流程：选一个页面 → 按一下检查 → 看结果并让 AI 去改。
    // 小白不需要知道「项目路径」「规则」「引擎」这些词，这些只在页脚和折叠区出现。
    function CheckSection(props) {
      const lang = useLang()
      const [target, setTarget] = React.useState(loadTarget)
      const [targets, setTargets] = React.useState(Array.isArray(props.initialTargets) ? props.initialTargets : null)
      const [manual, setManual] = React.useState(false)
      const [scan, setScan] = React.useState(memory.scan)
      const [busy, setBusy] = React.useState(false)

      React.useEffect(() => {
        let alive = true
        fetch(`${API}/targets`)
          .then((response) => response.json())
          .then((data) => {
            if (alive && data && Array.isArray(data.targets)) setTargets(data.targets)
          })
          .catch(() => {
            if (alive) setTargets([])
          })
        return () => {
          alive = false
        }
      }, [])

      function update(next) {
        memory.scan = next
        setScan(next)
      }

      function pick(value) {
        memory.target = value
        setTarget(value)
        try {
          localStorage.setItem(STORAGE_TARGET, value)
        } catch {
          // 存不下就算了
        }
      }

      function onChange(event) {
        pick(event.target.value)
      }

      async function submit() {
        const value = target.trim()
        if (value === '' || busy) return
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
          if (typeof props.onScanned === 'function') props.onScanned()
        } catch (error) {
          update({ status: 'error', error: String((error && error.message) || error) })
        } finally {
          setBusy(false)
        }
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

      // 第 1 步：能点的页面
      const picks = Array.isArray(targets) ? targets : []
      const targetCards = picks.length === 0
        ? h('p', { className: 'dsh-im-hint' }, targets === null ? tr(lang, 'loading') : tr(lang, 'noTargets'))
        : h('div', { className: 'dsh-im-targets' }, picks.map((item) => h('button', {
          type: 'button',
          key: item.path,
          className: `dsh-im-target${target === item.path ? ' dsh-im-target-on' : ''}`,
          onClick: () => pick(item.path),
        },
        h('span', { className: 'dsh-im-targetname' }, item.name),
        h('span', { className: 'dsh-im-targetpath' }, item.label))))

      const step1 = h('section', { className: 'dsh-im-sec' },
        h('div', { className: 'dsh-im-sechead' },
          h('span', { className: 'dsh-im-num' }, '01'),
          h('h2', { className: 'dsh-im-sectitle' }, tr(lang, 'step1')),
          h('button', {
            type: 'button',
            className: 'dsh-im-link',
            onClick: () => setManual((value) => !value),
          }, manual ? tr(lang, 'hideManual') : tr(lang, 'showManual'))),
        h('div', { className: 'dsh-im-pad' }, targetCards),
        manual
          ? h('div', { className: 'dsh-im-search dsh-im-search-sm' },
            h('input', {
              className: 'dsh-im-input',
              value: target,
              placeholder: tr(lang, 'targetPlaceholder'),
              spellCheck: false,
              onChange,
            }))
          : null)

      // 第 2 步：一个按钮
      const step2 = h('section', { className: 'dsh-im-sec' },
        h('div', { className: 'dsh-im-sechead' },
          h('span', { className: 'dsh-im-num' }, '02'),
          h('h2', { className: 'dsh-im-sectitle' }, tr(lang, 'step2'))),
        h('div', { className: 'dsh-im-run' },
          h('button', {
            type: 'button',
            className: 'dsh-im-btn dsh-im-btn-lg',
            disabled: busy || target.trim() === '',
            onClick: submit,
          }, busy ? tr(lang, 'scanning') : tr(lang, 'scanNow')),
          h('span', { className: 'dsh-im-selected' }, target === '' ? tr(lang, 'nonePicked') : shortPath(target))),
        busy ? h('div', { className: 'dsh-im-bar dsh-im-pad' }) : null,
        scan.status === 'error' ? h('p', { className: 'dsh-im-error dsh-im-pad' }, scan.error) : null)

      // 第 3 步：结果
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
          return h('article', {
            className: `dsh-im-finding dsh-im-finding-${group.severity === 'advisory' ? 'info' : 'warn'}`,
            key: group.key,
          },
          h('div', { className: 'dsh-im-findinghead' },
            h('h3', { className: 'dsh-im-findingname' }, name),
            h('span', { className: 'dsh-im-count' }, `×${group.count}`)),
          h('p', { className: 'dsh-im-findingdesc' }, desc),
          first
            ? h('p', { className: 'dsh-im-where' },
              first.line > 0
                ? tr(lang, 'where', { file: shortPath(first.file), line: first.line })
                : tr(lang, 'whereNoLine', { file: shortPath(first.file) }))
            : null,
          h('button', {
            type: 'button',
            className: 'dsh-im-fix',
            onClick: () => openSession(tr(lang, 'fixPrompt', {
              file: first ? first.file : target,
              name,
              desc,
              dir: props.skillDir || 'impeccable',
            })),
          }, tr(lang, 'fixIt')))
        }))
        : null

      const step3 = done
        ? h('section', { className: 'dsh-im-sec' },
          h('div', { className: 'dsh-im-sechead' },
            h('span', { className: 'dsh-im-num' }, '03'),
            h('h2', { className: 'dsh-im-sectitle' }, tr(lang, 'step3')),
            h('span', { className: 'dsh-im-sechint' }, total === 0 ? tr(lang, 'clean') : tr(lang, 'found', { n: total }))),
          total === 0
            ? h('p', { className: 'dsh-im-ok dsh-im-pad' }, tr(lang, 'cleanBody'))
            : h('div', { className: 'dsh-im-pad' }, metrics, findingList))
        : null

      return h(React.Fragment, null, step1, step2, step3)
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
          h('span', { className: 'dsh-im-num' }, '04'),
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
          shown.map((command, index) => h('div', {
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
          h('span', { className: 'dsh-im-cmdart', 'data-cat': command.category },
            h('span', { className: 'dsh-im-cmdartnum' }, String(index + 1).padStart(2, '0')),
            h('button', {
              type: 'button',
              className: 'dsh-im-cmdopen',
              title: tr(lang, 'openSession'),
              'aria-label': tr(lang, 'openSession'),
              onClick: (event) => {
                event.stopPropagation()
                onSession(command)
              },
            }, h('svg', { width: 15, height: 15, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round' },
              h('path', { d: 'M7 17L17 7M9 7h8v8' })))),
          h('div', { className: 'dsh-im-cmdtop' },
            h('span', { className: 'dsh-im-cmdaction' }, commandAction(lang, command.name)),
            h('code', { className: 'dsh-im-cmdname' }, command.name)),
          h('p', { className: 'dsh-im-cmddesc' }, commandDesc(lang, command)),
          copied === command.name ? h('span', { className: 'dsh-im-copied' }, tr(lang, 'copied')) : null)))) : null)
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
          h('span', { className: 'dsh-im-num' }, '05'),
          h('h2', { className: 'dsh-im-sectitle' }, tr(lang, 'rulesTitle')),
          h('span', { className: 'dsh-im-sechint' }, tr(lang, 'rulesHint2', { n: rules.length })),
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
        const keys = ['check', 'commands', 'rules']
        function onScroll() {
          let current = 'check'
          const base = el.getBoundingClientRect().top
          for (const key of keys) {
            const node = el.querySelector(`#dsh-im-sec-${key}`)
            if (!node || typeof node.getBoundingClientRect !== 'function') continue
            const top = node.getBoundingClientRect().top - base + el.scrollTop
            if (top - 120 <= el.scrollTop) current = key
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
        const node = el.querySelector(`#dsh-im-sec-${key}`)
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

      return h('div', { className: 'dsh-im-root' },
        h('style', null, STYLE),
        h('div', { className: 'dsh-im-shell' },
          h('aside', { className: 'dsh-im-rail' },
            h('div', { className: 'dsh-im-brand' },
              h('span', { className: 'dsh-im-brandmark' },
                h('img', { src: '/impeccable/icon.png', alt: '', loading: 'lazy' })),
              h('div', { className: 'dsh-im-brandtext' },
                h('div', { className: 'dsh-im-brandname' }, tr(lang, 'title')),
                h('div', { className: 'dsh-im-brandpkg' }, 'dsh-impeccable-studio'))),
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
            h('div', { className: 'dsh-im-railfoot' },
              h('b', null, `IMPECCABLE ${data && data.skill.version ? data.skill.version : '—'}`),
              h('div', null, `${tr(lang, 'statEngine')} · ${engineLabel}`),
              h('div', null, `${ruleCount === null ? '—' : ruleCount} ${tr(lang, 'statRules')} · ${commandCount === null ? '—' : commandCount} ${tr(lang, 'statCommands')}`))),
          h('div', { className: 'dsh-im-main', ref: scrollRef },
            h('div', { className: 'dsh-im-inner' },
              h('header', { className: 'dsh-im-hero' },
                h('div', { className: 'dsh-im-kicker' },
                  h('span', { className: 'dsh-im-kickerb' }, 'IMPECCABLE'),
                  h('span', { className: 'dsh-im-kickersep' }, '·'),
                  h('span', null, tr(lang, 'kicker'))),
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
              enginePending ? h('p', { className: 'dsh-im-hint dsh-im-pad' }, tr(lang, 'enginePending')) : null,
              engineMissing ? h('p', { className: 'dsh-im-error dsh-im-pad' }, tr(lang, 'engineMissing')) : null,
              skillMissing ? h('p', { className: 'dsh-im-error dsh-im-pad' }, tr(lang, 'skillMissing')) : null,
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
    // 样式：只用 --dsw-* 主题 token，明暗自动跟随
    // ---------------------------------------------------------------------

    const STYLE = `
.dsh-im-root { position: relative; display: flex; flex-direction: column; height: 100%; min-height: 0; container-type: inline-size; background: var(--dsw-alias-bg-base); color: var(--dsw-alias-label-primary); font-family: -apple-system, BlinkMacSystemFont, "Helvetica Neue", "PingFang SC", "Noto Sans SC", sans-serif; font-size: 13px; line-height: 1.5; -webkit-font-smoothing: antialiased; font-variant-numeric: tabular-nums; }

/* 骨架：左栏导航 + 右栏内容 */
.dsh-im-shell { display: flex; height: 100%; min-height: 0; }
.dsh-im-rail { flex: none; display: flex; flex-direction: column; gap: 2px; width: 208px; padding: 18px 12px 14px; border-right: 1px solid var(--dsw-alias-border-l1); overflow-y: auto; overflow-x: hidden; }
.dsh-im-brand { display: flex; align-items: center; gap: 10px; padding: 0 8px 16px; }
.dsh-im-brandmark { position: relative; flex: none; width: 32px; height: 32px; border-radius: 8px; overflow: hidden; background: var(--dsw-alias-bg-layer-2); }
.dsh-im-brandmark img { display: block; width: 100%; height: 100%; object-fit: cover; }
.dsh-im-icon { display: block; border-radius: 5px; object-fit: cover; }
.dsh-im-brandtext { min-width: 0; }
.dsh-im-brandname { font-size: 13px; font-weight: 600; letter-spacing: -0.01em; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.dsh-im-brandpkg { margin-top: 1px; font-family: ui-monospace, SFMono-Regular, Menlo, monospace; font-size: 9.5px; letter-spacing: 0.04em; color: var(--dsw-alias-label-tertiary); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.dsh-im-railgroup { margin-top: 12px; padding: 0 8px 6px; font-family: ui-monospace, SFMono-Regular, Menlo, monospace; font-size: 9.5px; letter-spacing: 0.14em; text-transform: uppercase; color: var(--dsw-alias-label-tertiary); }
.dsh-im-nav { position: relative; display: flex; align-items: center; gap: 9px; width: 100%; height: 32px; padding: 0 8px; border: 0; background: transparent; color: var(--dsw-alias-label-secondary); font: inherit; font-size: 13px; text-align: left; white-space: nowrap; cursor: pointer; transition: background 0.18s ease, color 0.18s ease; }
.dsh-im-nav::before { content: ''; position: absolute; left: 0; top: 6px; bottom: 6px; width: 2px; background: transparent; transition: background 0.18s ease; }
.dsh-im-nav:hover { background: var(--dsw-alias-interactive-bg-hover); color: var(--dsw-alias-label-primary); }
.dsh-im-nav-on, .dsh-im-nav-on:hover { background: var(--dsw-alias-label-primary); color: var(--dsw-alias-bg-base); }
.dsh-im-nav-on::before { background: var(--dsw-alias-brand-primary); }
.dsh-im-nav svg { flex: none; width: 14px; height: 14px; stroke: currentColor; fill: none; stroke-width: 1.7; stroke-linecap: round; stroke-linejoin: round; }
.dsh-im-navcount { margin-left: auto; font-family: ui-monospace, SFMono-Regular, Menlo, monospace; font-size: 10px; opacity: 0.65; }
.dsh-im-railfoot { margin-top: auto; padding: 14px 8px 0; border-top: 1px solid var(--dsw-alias-border-l1); font-family: ui-monospace, SFMono-Regular, Menlo, monospace; font-size: 9.5px; line-height: 1.9; letter-spacing: 0.03em; color: var(--dsw-alias-label-tertiary); overflow-wrap: anywhere; }
.dsh-im-railfoot b { display: block; font-weight: 400; color: var(--dsw-alias-label-secondary); }
.dsh-im-main { flex: 1; min-width: 0; overflow-y: auto; }
.dsh-im-inner { max-width: 1080px; margin: 0 auto; padding: 0 32px 44px; }

/* 头部：方括号标签 + 衬线大字标题，像一本刊物的扉页 */
.dsh-im-hero { position: relative; padding: 22px 0 18px; border-bottom: 1px solid var(--dsw-alias-border-l1); }
.dsh-im-hero::before { content: ''; position: absolute; left: 0; top: 0; right: 0; height: 2px; background: linear-gradient(90deg, var(--dsw-alias-brand-primary) 0 84px, var(--dsw-alias-border-l1) 84px); }
.dsh-im-kicker { display: flex; align-items: center; gap: 8px; font-family: ui-monospace, SFMono-Regular, Menlo, monospace; font-size: 11px; letter-spacing: 0.16em; text-transform: uppercase; color: var(--dsw-alias-label-secondary); }
.dsh-im-kickerb { color: var(--dsw-alias-brand-primary); letter-spacing: 0.18em; }
.dsh-im-kickersep { color: var(--dsw-alias-border-l3); }
.dsh-im-title { margin: 11px 0 0; font-family: -apple-system, BlinkMacSystemFont, "Helvetica Neue", "PingFang SC", "Noto Sans SC", sans-serif; font-size: 31px; font-weight: 600; line-height: 1.08; letter-spacing: -0.015em; }
.dsh-im-lede { margin: 10px 0 0; max-width: 56ch; font-size: 13px; line-height: 1.6; color: var(--dsw-alias-label-secondary); }
.dsh-im-stats { display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 9px; margin-top: 20px; }
.dsh-im-stat { position: relative; padding: 12px 14px 11px; border: 1px solid var(--dsw-alias-border-l1); background: var(--dsw-alias-bg-layer-1); overflow: hidden; }
.dsh-im-stat::before { content: ''; position: absolute; left: 0; top: 0; bottom: 0; width: 2px; background: var(--dsw-alias-brand-primary); opacity: 0.65; }
.dsh-im-statv { font-family: ui-monospace, SFMono-Regular, Menlo, monospace; font-size: 27px; font-weight: 400; line-height: 1; letter-spacing: -0.03em; }
.dsh-im-statv-sm { font-family: -apple-system, BlinkMacSystemFont, "Helvetica Neue", "PingFang SC", sans-serif; font-size: 15px; letter-spacing: 0; line-height: 1.5; word-break: break-all; }
.dsh-im-statl { margin-top: 7px; font-size: 12px; letter-spacing: 0.03em; color: var(--dsw-alias-label-secondary); }



/* 区块：编号 + 标题 + 右侧说明，下压一条细线 */
.dsh-im-sec { padding-top: 18px; }
.dsh-im-sechead { display: flex; align-items: baseline; gap: 11px; padding-bottom: 9px; border-bottom: 1px solid var(--dsw-alias-border-l1); }
.dsh-im-num { flex: none; font-family: "Songti SC", "Noto Serif SC", Georgia, serif; font-size: 19px; font-weight: 500; line-height: 1; letter-spacing: 0.01em; color: var(--dsw-alias-brand-primary); }
.dsh-im-sectitle { margin: 0; font-size: 14px; font-weight: 600; letter-spacing: 0.02em; white-space: nowrap; }
.dsh-im-sechint { margin-left: 2px; font-size: 12px; color: var(--dsw-alias-label-secondary); }

/* 输入行：直角，聚焦时整条线变亮 */
.dsh-im-search { display: flex; margin-top: 14px; }
.dsh-im-search-sm { margin-top: 11px; }
.dsh-im-input { flex: 1; min-width: 0; height: 32px; padding: 0 10px; border: 1px solid var(--dsw-alias-border-l2); border-right: none; border-radius: 0; background: transparent; color: var(--dsw-alias-label-primary); font-family: inherit; font-size: 12px; outline: none; transition: border-color 0.15s ease; }
.dsh-im-input:focus { border-color: var(--dsw-alias-label-secondary); }
.dsh-im-input::placeholder { color: var(--dsw-alias-label-secondary); }
.dsh-im-input-sm { height: 28px; }
.dsh-im-btn { height: 32px; padding: 0 16px; border: 1px solid var(--dsw-alias-label-primary); border-radius: 0; background: var(--dsw-alias-label-primary); color: var(--dsw-alias-bg-base); font-family: inherit; font-size: 11.5px; font-weight: 500; letter-spacing: 0.06em; white-space: nowrap; cursor: pointer; transition: opacity 0.15s ease; }
.dsh-im-btn:hover:not(:disabled) { opacity: 0.82; }
.dsh-im-btn:disabled { border-color: var(--dsw-alias-border-l2); background: transparent; color: var(--dsw-alias-label-tertiary); cursor: default; }

.dsh-im-pad { margin: 11px 0 0; }
.dsh-im-hint { margin: 0; font-size: 12px; line-height: 1.6; color: var(--dsw-alias-label-secondary); }
.dsh-im-error { margin: 0; font-size: 12px; color: var(--dsw-alias-state-error-primary); word-break: break-word; }
.dsh-im-ok { margin: 0; font-size: 12.5px; letter-spacing: 0.02em; color: var(--dsw-alias-state-success-primary); }
/* 第 1 步：候选页面卡片 */
.dsh-im-targets { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 8px; margin-top: 13px; }
.dsh-im-target { position: relative; display: flex; flex-direction: column; gap: 4px; min-width: 0; padding: 11px 34px 11px 13px; border: 1px solid var(--dsw-alias-border-l1); background: var(--dsw-alias-bg-layer-1); color: var(--dsw-alias-label-primary); text-align: left; cursor: pointer; transition: border-color 0.15s ease, background 0.15s ease; }
.dsh-im-target:hover { border-color: var(--dsw-alias-border-l3); background: var(--dsw-alias-bg-layer-2); }
.dsh-im-target-on { border-color: var(--dsw-alias-brand-primary); background: var(--dsw-alias-bg-layer-2); }
.dsh-im-target::after { content: '↗'; position: absolute; top: 9px; right: 12px; font-size: 13px; line-height: 1; color: var(--dsw-alias-label-tertiary); }
.dsh-im-target:hover::after, .dsh-im-target-on::after { color: var(--dsw-alias-brand-primary); }
.dsh-im-targetname { font-size: 13px; font-weight: 600; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.dsh-im-targetpath { font-family: ui-monospace, SFMono-Regular, Menlo, monospace; font-size: 12px; color: var(--dsw-alias-label-secondary); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }

/* 第 2 步：一个大按钮 */
.dsh-im-run { display: flex; flex-wrap: wrap; align-items: center; gap: 14px; margin-top: 13px; }
.dsh-im-btn-lg { padding: 10px 26px; font-size: 13px; letter-spacing: 0.04em; }
.dsh-im-selected { font-family: ui-monospace, SFMono-Regular, Menlo, monospace; font-size: 12px; color: var(--dsw-alias-label-secondary); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; min-width: 0; }

/* 第 3 步：结果 */
.dsh-im-ok { margin: 13px 0 0; padding: 18px 16px; border: 1px solid var(--dsw-alias-border-l1); border-left: 2px solid var(--dsw-alias-state-success-primary); font-size: 13px; line-height: 1.7; color: var(--dsw-alias-label-secondary); }
.dsh-im-ok::before { content: '✓'; margin-right: 10px; color: var(--dsw-alias-state-success-primary); font-weight: 700; }
.dsh-im-where { margin: 6px 0 0; font-family: ui-monospace, SFMono-Regular, Menlo, monospace; font-size: 12px; color: var(--dsw-alias-label-secondary); }
.dsh-im-fix { margin-top: 9px; padding: 6px 14px; border: 1px solid var(--dsw-alias-border-l2); background: transparent; color: var(--dsw-alias-label-primary); font-size: 12px; cursor: pointer; transition: border-color 0.15s ease, background 0.15s ease; }
.dsh-im-fix:hover { border-color: var(--dsw-alias-brand-primary); color: var(--dsw-alias-brand-primary); }

/* 命令卡：中文动作名在前 */
.dsh-im-cmdaction { font-size: 13px; font-weight: 600; letter-spacing: 0.01em; }
.dsh-im-cmdname { font-family: ui-monospace, SFMono-Regular, Menlo, monospace; font-size: 12px; letter-spacing: 0.02em; color: var(--dsw-alias-label-tertiary); }

.dsh-im-bar { display: block; position: relative; height: 2px; overflow: hidden; background: var(--dsw-alias-border-l1); }
.dsh-im-bar::after { content: ''; position: absolute; inset: 0; background: var(--dsw-alias-brand-primary); animation: dsh-im-breathe 1.6s ease-in-out infinite; }
@keyframes dsh-im-breathe { 0%, 100% { opacity: 0.3; } 50% { opacity: 1; } }

/* 统计块：大字数字 + 小字标签，块之间只用竖线 */
.dsh-im-metrics { display: flex; flex-wrap: wrap; margin-top: 16px; border: 1px solid var(--dsw-alias-border-l1); }
.dsh-im-metric { position: relative; flex: 1 1 0; min-width: 88px; padding: 10px 13px 9px; border-left: 1px solid var(--dsw-alias-border-l1); }
.dsh-im-metric::before { content: ''; position: absolute; left: 0; top: 0; right: 0; height: 2px; background: var(--dsw-alias-border-l2); }
.dsh-im-metric:first-child { border-left: none; }
.dsh-im-metricv { font-family: ui-monospace, SFMono-Regular, Menlo, monospace; font-size: 26px; font-weight: 400; line-height: 1; letter-spacing: -0.03em; }
.dsh-im-metricu { margin-left: 4px; font-size: 12px; letter-spacing: 0; color: var(--dsw-alias-label-secondary); }
.dsh-im-metricl { margin-top: 5px; font-size: 12px; letter-spacing: 0.04em; color: var(--dsw-alias-label-secondary); }
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
.dsh-im-findingname { font-size: 13.5px; font-weight: 600; letter-spacing: 0.005em; }
.dsh-im-count { margin-left: auto; font-family: ui-monospace, SFMono-Regular, Menlo, monospace; font-size: 12px; color: var(--dsw-alias-label-secondary); }
.dsh-im-findingdesc { margin: 4px 0 0; max-width: 96ch; font-size: 12.5px; line-height: 1.5; color: var(--dsw-alias-label-secondary); }
.dsh-im-locations { margin: 7px 0 0; padding: 0; list-style: none; display: flex; flex-direction: column; gap: 2px; }
.dsh-im-location { display: flex; align-items: baseline; gap: 10px; min-width: 0; }
.dsh-im-file { flex: none; font-family: ui-monospace, SFMono-Regular, Menlo, monospace; font-size: 12px; letter-spacing: 0.01em; color: var(--dsw-alias-label-secondary); white-space: nowrap; }
.dsh-im-snippet { font-size: 12px; color: var(--dsw-alias-label-secondary); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

/* 分类：方正小按钮，选中的反白 */
.dsh-im-chips { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 13px; }
.dsh-im-chip { height: 25px; padding: 0 10px; border: 1px solid var(--dsw-alias-border-l2); border-radius: 0; background: transparent; color: var(--dsw-alias-label-secondary); font-family: inherit; font-size: 12px; letter-spacing: 0.02em; cursor: pointer; transition: color 0.15s ease, border-color 0.15s ease, background 0.15s ease; }
.dsh-im-chip:hover { border-color: var(--dsw-alias-label-secondary); color: var(--dsw-alias-label-primary); }
.dsh-im-chip-on, .dsh-im-chip-on:hover { background: var(--dsw-alias-label-primary); border-color: var(--dsw-alias-label-primary); color: var(--dsw-alias-bg-base); }

/* 命令卡：细边框的方格，悬停整块提亮 */
.dsh-im-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(238px, 1fr)); gap: 8px; margin-top: 12px; }
.dsh-im-cmd { position: relative; display: flex; flex-direction: column; gap: 4px; min-width: 0; min-height: 88px; padding: 10px 74px 10px 12px; border: 1px solid var(--dsw-alias-border-l1); background: transparent; cursor: pointer; overflow: hidden; transition: border-color 0.15s ease, background 0.15s ease; }
.dsh-im-cmd:hover { border-color: var(--dsw-alias-label-secondary); background: var(--dsw-alias-interactive-bg-hover); }
.dsh-im-cmdart { position: absolute; top: 0; right: 0; bottom: 0; box-sizing: border-box; width: 62px; display: flex; flex-direction: column; justify-content: space-between; align-items: flex-end; padding: 8px 9px; background: var(--dsw-alias-brand-primary); color: #0b0b0b; overflow: hidden; }
.dsh-im-cmdart::before { content: ''; position: absolute; inset: 0; background-image: repeating-linear-gradient(135deg, rgba(255, 255, 255, 0.16) 0 1px, transparent 1px 7px); pointer-events: none; }
.dsh-im-cmdart[data-cat="Evaluate"] { background: var(--dsw-alias-state-success-primary); }
.dsh-im-cmdart[data-cat="Refine"] { background: var(--dsw-alias-state-warn-primary); }
.dsh-im-cmdart[data-cat="Enhance"] { background: var(--dsw-alias-state-error-primary); }
.dsh-im-cmdart[data-cat="Fix"] { background: var(--dsw-alias-label-secondary); }
.dsh-im-cmdart[data-cat="Iterate"] { background: var(--dsw-alias-label-tertiary); }
.dsh-im-cmdartnum { position: relative; font-family: ui-monospace, SFMono-Regular, Menlo, monospace; font-size: 11px; letter-spacing: 0.1em; opacity: 0.8; }
.dsh-im-cmd::before { content: '+'; position: absolute; left: 5px; bottom: 1px; font-family: ui-monospace, SFMono-Regular, Menlo, monospace; font-size: 10px; line-height: 1; color: var(--dsw-alias-border-l2); pointer-events: none; transition: color 0.15s ease; }
.dsh-im-cmd:hover::before { color: var(--dsw-alias-brand-primary); }
.dsh-im-cmd::after { content: ''; position: absolute; left: -1px; right: -1px; bottom: -1px; height: 2px; background: var(--dsw-alias-brand-primary); transform: scaleX(0); transform-origin: left center; transition: transform 0.18s ease; }
.dsh-im-cmd:hover::after { transform: scaleX(1); }
.dsh-im-cmd-on { border-color: var(--dsw-alias-state-success-primary); }
.dsh-im-cmdtop { display: flex; align-items: baseline; gap: 6px; }
.dsh-im-cmdname { font-family: ui-monospace, SFMono-Regular, Menlo, monospace; font-size: 12px; font-weight: 500; letter-spacing: -0.01em; color: var(--dsw-alias-label-primary); white-space: nowrap; }
.dsh-im-cmdhint { font-family: ui-monospace, SFMono-Regular, Menlo, monospace; font-size: 12px; color: var(--dsw-alias-label-secondary); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.dsh-im-cmdopen { position: relative; align-self: flex-end; display: flex; flex: none; align-items: center; justify-content: center; width: 18px; height: 18px; border: none; background: transparent; color: inherit; cursor: pointer; opacity: 0.9; transition: opacity 0.15s ease, transform 0.15s ease; }
.dsh-im-cmd:hover .dsh-im-cmdopen { opacity: 1; transform: translate(1px, -1px); }
.dsh-im-cmdopen svg { flex: none; display: block; width: 15px; height: 15px; }
.dsh-im-cmddesc { margin: 0; font-size: 12px; line-height: 1.5; color: var(--dsw-alias-label-secondary); display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
.dsh-im-copied { position: absolute; top: 8px; right: 8px; font-family: ui-monospace, SFMono-Regular, Menlo, monospace; font-size: 10px; letter-spacing: 0.1em; color: var(--dsw-alias-state-success-primary); }

.dsh-im-link { margin-left: auto; border: none; border-bottom: 1px solid var(--dsw-alias-border-l2); background: transparent; color: var(--dsw-alias-label-secondary); font-family: inherit; font-size: 12px; letter-spacing: 0.04em; padding: 0 0 1px; white-space: nowrap; cursor: pointer; }
.dsh-im-link:hover { color: var(--dsw-alias-label-primary); border-bottom-color: var(--dsw-alias-label-primary); }

/* 规则目录：每行一条横线，像索引 */
.dsh-im-rules { display: grid; grid-template-columns: repeat(auto-fill, minmax(360px, 1fr)); column-gap: 26px; margin: 13px 0 0; padding: 0; list-style: none; }
.dsh-im-rule { display: flex; gap: 8px; align-items: flex-start; min-width: 0; padding: 6px 8px 6px 0; border-top: 1px solid var(--dsw-alias-border-l1); }
.dsh-im-rule:hover { background: var(--dsw-alias-interactive-bg-hover); }
.dsh-im-rulebody { min-width: 0; display: flex; flex-direction: column; gap: 3px; }
.dsh-im-ruletop { display: flex; align-items: baseline; gap: 11px; min-width: 0; }
.dsh-im-ruleid { flex: none; font-family: ui-monospace, SFMono-Regular, Menlo, monospace; font-size: 12px; letter-spacing: 0.01em; color: var(--dsw-alias-label-secondary); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.dsh-im-rulecat { flex: none; margin-left: auto; font-size: 12px; letter-spacing: 0.02em; color: var(--dsw-alias-label-secondary); }
.dsh-im-rulecat-slop { color: var(--dsw-alias-brand-primary); }
.dsh-im-rulename { flex: none; font-size: 12.5px; font-weight: 600; letter-spacing: 0.005em; }
.dsh-im-ruledesc { margin: 0; font-size: 12px; line-height: 1.5; color: var(--dsw-alias-label-secondary); display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
.dsh-im-dot { flex: none; width: 4px; height: 4px; margin-top: 6px; background: var(--dsw-alias-state-warn-primary); }
.dsh-im-dot-info { background: var(--dsw-alias-label-tertiary); }
.dsh-im-dot-error { background: var(--dsw-alias-state-error-primary); }


.dsh-im-body::-webkit-scrollbar { width: 8px; }
.dsh-im-body::-webkit-scrollbar-thumb { background: var(--dsw-alias-border-l2); border: 2px solid transparent; background-clip: content-box; }
.dsh-im-body::-webkit-scrollbar-track { background: transparent; }

@container (max-width: 900px) {
  .dsh-im-shell { display: block; height: auto; }
  .dsh-im-rail { flex-direction: row; align-items: center; gap: 4px; width: auto; padding: 8px 12px; border-right: 0; border-bottom: 1px solid var(--dsw-alias-border-l1); overflow-x: auto; }
  .dsh-im-brand { padding: 0 10px 0 0; }
  .dsh-im-brandpkg, .dsh-im-railgroup, .dsh-im-railfoot, .dsh-im-navcount { display: none; }
  .dsh-im-nav { width: auto; padding: 0 10px; }
  .dsh-im-main { overflow: visible; }
  .dsh-im-inner { padding: 0 18px 32px; }
  .dsh-im-hero { padding: 18px 0 14px; }
  .dsh-im-title { font-size: 24px; }
  .dsh-im-grid { grid-template-columns: repeat(auto-fill, minmax(170px, 1fr)); }
  .dsh-im-cmd { min-height: 96px; padding-right: 66px; }
  .dsh-im-cmdart { width: 54px; }
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
    exports.__parts = { StudioIcon, StudioPanel, CheckSection, CommandsSection, RulesSection, memory, setLang, STYLE }
    return module.exports
  },
})
