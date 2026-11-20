# dsh-impeccable

Design review desk for DeepSeek Harness. Brings [impeccable](https://github.com/pbakaus/impeccable)'s design vocabulary into the sidebar: 24 commands, 62 deterministic detectors, and a one-click scan of the interface in front of you.

An eye icon appears in the sidebar; clicking it opens the **Impeccable Studio** panel with three sections.

- **Scan** — point it at a project path or a URL and it runs all 62 deterministic rules (no model, no API key), then groups the findings by rule and lists where they are.
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

Every command and every rule carries a Chinese name and description, so the panel reads as one language instead of half English. Chinese is the default when the app language is Chinese; wherever a translation is missing the panel falls back to the English original instead of showing an empty line, and the rule search matches both languages at once.

## Visual language

The panel is set like a magazine page, not a settings form, and it is typeset tight: 12.5px body text, 26px display line, 8px between command cards. The rule catalogue opens by default and runs in two columns, name first, id and category trailing. A serif display line opens it, under a bracketed eyebrow label; sections are numbered and separated by hairlines instead of boxed cards; totals are set in large tabular figures; the primary button and the selected category chip invert to the foreground colour the way a print plate does; and a single small brand square marks each section number so the page carries one accent, not six. Beyond the type: a brand-colour hairline across the masthead, a faint IMPECCABLE wordmark set into it, oversized serif section numbers, a two-pixel rule over each scan figure, a hairline cross in the corner of every command card that turns brand-coloured on hover, and a colophon rule at the foot carrying the versions. Everything is built from `--dsw-alias-*` tokens, so it holds up in both light and dark themes.

## Three steps, no vocabulary

The panel is written for someone who has never opened a design tool. There is nothing to type and no command to remember:

1. **Pick a page.** The plugin lists the HTML files you edited recently on this machine — click one. Only if nothing turns up do you paste a path or URL.
2. **Press one button.** "Check this page" runs all 62 rules against it.
3. **Read what is wrong.** Findings are grouped by problem, in plain Chinese ("文字对比度不足"), with the file and line, and every group carries a **Have AI fix it** button that opens a session preloaded with the file, the problem and the skill path.

The 24 commands and the 62-rule catalog are still there, but folded away under *More tools* and *What it checks* — a beginner never has to scroll past them, and the command cards lead with a Chinese action ("挑毛病") with the real command name as a footnote.

## Checked against its own rules

This panel is scanned by the same 62 rules it exposes. The first pass found 66 problems in it: it opened with a tracked uppercase kicker above the heading (banned outright), its scanning bar was an infinite horizontal marquee (banned), and 62 runs of text sat under the 11px legibility floor. The kicker is gone, the bar breathes in place instead of sliding, and every functional label is at least 12px. The current build scans clean — `detect /tmp/im-preview.html` returns nothing, in both themes.

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

- `lib/index.js` — host side. Registers two routes under `/impeccable/api/*` (`catalog`, `detect`), resolves the skill and the engine, runs the CLI and returns JSON. Each detection runs with a 180s timeout (10min while the engine is still downloading), a 64MB buffer and at most 600 findings returned.
- `lib/client.js` — browser side. Registers `sidebar.panellist` (order 15) and `main` (`key: impeccable`).
- `skill/` — the bundled skill: `SKILL.md`, 24 command rows, 47 reference docs, the launcher and its data files.
- `lib/zh.js` — Chinese names and descriptions for the 24 commands, 6 categories and all 62 rules, applied on the host side when building the catalog.
- `locale/` — title and description shown in the plugin list.
- All styling uses `--dsw-alias-*` theme tokens, so light and dark follow the app.

`impeccable detect` exits with code 2 when there are findings while still printing the full JSON report; the host side reads it from `error.stdout` and treats it as a result, not a failure.

---

## 中文

把 [impeccable](https://github.com/pbakaus/impeccable) 的设计审校能力搬进 DeepSeek Harness 左侧面板。

左侧栏多一个眼睛图标，点开是「Impeccable 审校台」：

- **扫描** — 填项目路径或网址，跑 62 条确定性规则（不用模型、不用 API key），按规则分组列出问题位置
- **命令** — 24 条命令（critique / audit / polish / typeset / live …），点一下复制提示词，点卡片右上角箭头直接开新对话；提示词会带上技能文档路径，agent 先读 `SKILL.md` 的 Setup 再执行
- **规则目录** — 62 条规则可搜索，看 id、分类、说明

**全中文**：24 条命令和 62 条规则的名称、说明都有中文，界面语言是中文时默认显示中文，缺译处回落到英文原文，规则搜索中英双匹配。

面板按刊物扉页来排，字排得紧：正文 12.5px、标题 26px、命令卡之间 8px；规则目录默认展开、排成两栏，名称在前，id 和分类跟在后面；先一行方括号小标，再一个衬线标题；区块用编号和一条细线分开，而不是把每块装进卡片；总数用大号等宽数字；主按钮和选中的分类是反白块，像印刷里的专色；每个区块编号前只有一个品牌色小方块做点睛。扉页顶上一条品牌色细线，右侧压着一个很淡的 IMPECCABLE 字样；区块编号是放大号的衬线数字；扫描统计每格顶上一条两像素色条；命令卡左下角有个定位十字，悬停变品牌色；底部一条版权线，写着版本号。样式全部取自 `--dsw-alias-*` 主题变量，明暗主题都成立。

**不用手动装技能**：技能（4.10.0，24 命令 / 62 规则 / 47 篇参考文档）已经打包在插件的 `skill/` 目录里，装插件即用。

唯一后到的是检测引擎（约 21 MB 的原生二进制）：插件加载时会在后台用自带的启动器下载一次，通常你点扫描之前就已经好了；如果没好，那次扫描会边下边跑，多等一分钟。查找顺序是 `IMPECCABLE_BIN` → `~/.impeccable/bin` 下最高版本 → 包内启动器。

之前自己跑过 `npx impeccable install --providers=dsh --scope=global` 的话，`~/.dsh/skills/impeccable` 优先于包内副本，自己升级的版本不会被旧版盖住。

```bash
dsh plugin add dsh-impeccable-studio     # 安装
dsh plugin remove dsh-impeccable-studio  # 卸载
```

装完重启 DeepSeek Harness 生效。插件本身不走网络，只有引擎下载需要联网。
