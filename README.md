# dsh-impeccable

Design review desk for DeepSeek Harness. Brings [impeccable](https://github.com/pbakaus/impeccable)'s design vocabulary into the sidebar: 24 commands, 62 deterministic detectors, and a one-click scan of the interface in front of you.

An eye icon appears in the sidebar; clicking it opens the **Impeccable Studio** panel with three sections.

- **Scan** — point it at a project path or a URL and it runs all 62 deterministic rules (no model, no API key, no network), then groups the findings by rule and lists where they are.
- **Commands** — the 24 commands (`critique`, `audit`, `polish`, `typeset`, `live`, …). Clicking a card copies its prompt; the arrow in the corner starts a new conversation with that prompt instead.
- **Rules** — the 62 rules, searchable, with id, category and description. Collapsed by default.

## Requirements

Both live on your machine already, or the panel tells you what is missing:

| What | Where |
| --- | --- |
| Skill | `~/.dsh/skills/impeccable/` (`npx impeccable install --providers=dsh --scope=global`) |
| Engine | `~/.impeccable/bin/<version>/impeccable` (downloaded by the skill on first use) |

On startup the panel reads `/impeccable/api/catalog`, which reports the skill version, the engine version and the rule count. The engine is looked up in this order: `IMPECCABLE_BIN`, the highest version under `~/.impeccable/bin`, then the launcher bundled with the skill.

The plugin never reaches the network by itself — it only calls the local engine.

## Install

```bash
dsh plugin add dsh-impeccable
```

From a checkout, `dsh plugin add ./plugins/dsh-impeccable` (or **Install local plugin** in the plugin panel) works too. Restart DeepSeek Harness afterwards: the host reads the bundle list at startup.

## Uninstall

```bash
dsh plugin remove dsh-impeccable
```

## How it works

- `lib/index.js` — host side. Registers two routes under `/impeccable/api/*` (`catalog`, `detect`), finds the engine, runs the CLI and returns JSON. Each detection runs with a 180s timeout, a 64MB buffer and at most 600 findings returned.
- `lib/client.js` — browser side. Registers `sidebar.panellist` (order 15) and `main` (`key: impeccable`).
- `locale/` — title and description shown in the plugin list.
- All styling uses `--dsw-alias-*` theme tokens, so light and dark follow the app.

`impeccable detect` exits with code 2 when there are findings while still printing the full JSON report; the host side reads it from `error.stdout` and treats it as a result, not a failure.

---

## 中文

把 [impeccable](https://github.com/pbakaus/impeccable) 的设计审校能力搬进 DeepSeek Harness 左侧面板。

左侧栏多一个眼睛图标，点开是「Impeccable 审校台」：

- **扫描** — 填项目路径或网址，跑 62 条确定性规则（不用模型、不用 API key），按规则分组列出问题位置
- **命令** — 24 条命令（critique / audit / polish / typeset / live …），点一下复制提示词，点卡片右上角箭头直接开新对话
- **规则目录** — 62 条规则可搜索，看 id、分类、说明

需要本机有 impeccable 技能与引擎：技能在 `~/.dsh/skills/impeccable/`（`npx impeccable install --providers=dsh --scope=global`），引擎在 `~/.impeccable/bin/<version>/impeccable`，缺哪样面板会直接提示。

```bash
dsh plugin add dsh-impeccable     # 安装
dsh plugin remove dsh-impeccable  # 卸载
```

装完重启 DeepSeek Harness 生效。终端里跑 `npx impeccable ...` 需要代理的话，先 `export HTTPS_PROXY=http://127.0.0.1:7890`；插件本身不走网络，只调本地引擎。
