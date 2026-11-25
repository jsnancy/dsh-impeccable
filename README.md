# dsh-impeccable

Design review desk for DeepSeek Harness. Brings [impeccable](https://github.com/pbakaus/impeccable)'s design vocabulary into the sidebar: 24 commands, 62 deterministic detectors, and a one-click scan of the interface in front of you.

The **设计校审台** mark appears in the sidebar; clicking it opens the review desk with four numbered sections.

- **Pick a page** — the field sits at the top: filter the HTML files you edited recently, or paste a path or URL. Click a card to select it; the arrow on the card checks that page directly.
- **Result** — findings grouped by problem, in plain language, with file and line; locations in the same file share one line (up to three line numbers), and a **Have AI fix it** link opens a session with the file, the problem and the skill path. The section scrolls itself into view when a check finishes.
- **Commands** — the 24 commands (`critique`, `audit`, `polish`, `typeset`, `live`, …). Clicking a card copies its prompt; the arrow in the corner starts a new conversation with that prompt instead. The prompt points the agent at the skill docs so it can read `SKILL.md` and `reference/<command>.md` before acting.
- **Rules** — the 62 rules, searchable, with id, category and description. Collapsed by default.

## Nothing to install by hand

The skill ships inside this package (`skill/`, version 4.10.0 — 24 commands, 62 rules, 47 reference docs). Installing the plugin is enough.

The only thing that arrives later is the detection engine, a ~21 MB native binary:

| What | Where | When |
| --- | --- | --- |
| Skill | `skill/` in this package | shipped with the plugin |
| Engine | `~/.impeccable/bin/<version>/impeccable` | downloaded in the background on first load |

On load the host side starts the bundled launcher (`skill/scripts/impeccable`) once in the background, so the binary is usually there before you click Scan. If a scan happens first, that scan downloads it and may take a minute. The engine is looked up in this order: `IMPECCABLE_BIN`, the highest version under `~/.impeccable/bin`, then the bundled launcher.

If you already ran `npx impeccable install --providers=dsh --scope=global` before, `~/.dsh/skills/impeccable` takes precedence over the bundled copy — so an upgrade you installed yourself is never shadowed by an older one.

The plugin itself never calls the network. Only the engine download does, and only once.

## Bilingual by default

Every command and every rule carries a Chinese name and description, so the panel reads as one language instead of half English. Chinese is the default when the app language is Chinese, but the rail footer carries a **中 / EN** switch that overrides the app language and remembers the choice; wherever a translation is missing the panel falls back to the English original instead of showing an empty line, and the rule search matches both languages at once.

## Visual language

The panel is set like a printed sheet, not a settings form: numbered sections over hairlines, one accent colour, tabular figures for the counts, and hairline cards that put the page name over its directory and age. The rail is a narrow column holding the mark, three anchors and the display controls at its foot; below 900px it folds into a top bar and the content goes single column at 560px. The palette is local to the panel (`--im-*`): a paper-white scheme and an ink-dark one. **Auto** follows the DSH theme attribute, **Light** and **Dark** pin it; the choice survives reloads. Reading text stays at 12px or larger (the small mono labels are 11px), and the only motion is a skeleton shimmer and a progress bar that breathes in place.

## Three steps, no vocabulary

The panel is written for someone who has never opened a design tool. There is nothing to type and no command to remember:

1. **Pick a page.** The field at the top lists the HTML files you edited recently on this machine; type to filter, click a card, or press the arrow on it to check it right away. Only if nothing turns up do you paste a path or URL.
2. **Press one button.** "Check page" runs all 62 rules against it and the result section appears below.
3. **Read what is wrong.** Findings are grouped by problem, in plain Chinese ("文字对比度不足"), with the file and line, and every group carries a **Have AI fix it** button that opens a session preloaded with the file, the problem and the skill path.

The 24 commands and the 62-rule catalog are still there, but folded away under *More tools* and *What it checks* — a beginner never has to scroll past them, and the command cards lead with a Chinese action ("挑毛病") with the real command name as a footnote.

## Checked against its own rules

This panel is scanned by the same 62 rules it exposes. The first pass found 66 problems in it: it opened with a tracked uppercase kicker above the heading (banned outright), its scanning bar was an infinite horizontal marquee (banned), and 62 runs of text sat under the 11px legibility floor. The kicker and the side stripes are gone, the bar breathes in place instead of sliding, and reading text is 12px or larger. A flat render of the main screen now returns no findings; the only notes left in a full snapshot are the preview frame's own padding and one rule description quoting the buzzwords it warns about.

## Install

```bash
dsh plugin add dsh-impeccable-studio
```

From a checkout, `dsh plugin add ./plugins/dsh-impeccable` (or **Install local plugin** in the plugin panel) works too. Restart DeepSeek Harness afterwards: the host reads the bundle list at startup.

## Uninstall

```bash
dsh plugin remove dsh-impeccable-studio
```

## How it works

- `lib/index.js` — host side. Registers three routes under `/impeccable/api/*` (`targets`, `catalog`, `detect`), resolves the skill and the engine, runs the CLI and returns JSON. Each detection runs with a 180s timeout (10min while the engine is still downloading), a 64MB buffer and at most 600 findings returned.
- `lib/client.js` — browser side. Registers `sidebar.panellist` (order 15) and `main` (`key: impeccable`).
- `skill/` — the bundled skill: `SKILL.md`, 24 command rows, 47 reference docs, the launcher and its data files.
- `lib/zh.js` — Chinese names and descriptions for the 24 commands, 6 categories and all 62 rules, applied on the host side when building the catalog.
- `locale/` — title and description shown in the plugin list.
- The panel carries its own `--im-*` palette for light and dark; **Auto** reads the host theme attribute, **Light** / **Dark** override it.

`impeccable detect` exits with code 2 when there are findings while still printing the full JSON report; the host side reads it from `error.stdout` and treats it as a result, not a failure.

---

## 中文

把 [impeccable](https://github.com/pbakaus/impeccable) 的设计审校能力搬进 DeepSeek Harness 左侧面板。

左侧栏多一个放大镜图标，点开是「设计校审台」，四个编号区块：

- **选页面** — 输入框在最上面：筛选最近改过的 HTML，或粘贴路径 / 网址。点卡片选中，点卡片右上角箭头直接检查
- **看结果** — 问题按类型分组，写清文件和行号，每组最多列三处，带「让 AI 帮我改」按钮；检查完成后这一块会自动滚进视野
- **命令** — 24 条命令（critique / audit / polish / typeset / live …），点一下复制提示词，点卡片右上角箭头直接开新对话；提示词会带上技能文档路径，agent 先读 `SKILL.md` 的 Setup 再执行
- **规则目录** — 62 条规则可搜索，看 id、分类、说明

**中英双语**：左栏底部有「中 / EN」开关，可以覆盖应用语言并记住选择；24 条命令和 62 条规则的名称、说明都有中文，缺译处回落到英文原文，规则搜索中英双匹配。

**明暗两套**：左栏底部「自动 / 浅色 / 深色」三档。自动跟随 DSH 当前主题，浅色和深色把面板锁成纸白或墨黑；两套配色都写在面板自己的 `--im-*` 变量里，与宿主主题解耦，刷新后保留选择。

面板按印刷品来排：区块用编号和细线分开，命令卡用细边框而不是厚卡片，数字用等宽表格数字；左栏是一列窄导航，900px 以下折成顶栏，560px 以下单列。功能标签不小于 12px，动效只保留骨架微光和一条 3px 进度条。

**不用手动装技能**：技能（4.10.0，24 命令 / 62 规则 / 47 篇参考文档）已经打包在插件的 `skill/` 目录里，装插件即用。

唯一后到的是检测引擎（约 21 MB 的原生二进制）：插件加载时会在后台用自带的启动器下载一次，通常你点扫描之前就已经好了；如果没好，那次扫描会边下边跑，多等一分钟。查找顺序是 `IMPECCABLE_BIN` → `~/.impeccable/bin` 下最高版本 → 包内启动器。

之前自己跑过 `npx impeccable install --providers=dsh --scope=global` 的话，`~/.dsh/skills/impeccable` 优先于包内副本，自己升级的版本不会被旧版盖住。

```bash
dsh plugin add dsh-impeccable-studio     # 安装
dsh plugin remove dsh-impeccable-studio  # 卸载
```

装完重启 DeepSeek Harness 生效。插件本身不走网络，只有引擎下载需要联网。
