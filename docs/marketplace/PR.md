# 0.7.0 更新（维护市场条目用）

插件改名为 **十六校审台**（英文界面：**Shiliu Review Desk**）。侧栏图标提示、面板标题、插件列表的 `locale` 文案和插件市场的条目描述都换了新名；包名 `dsh-impeccable-studio` 与插件 id 不变，装过的用户升级即可。

插件市场仓库是 [awesome-dsh-plugin/awesome-dsh-plugin](https://github.com/awesome-dsh-plugin/awesome-dsh-plugin)，条目在 `data/plugins/jsnancy__dsh-impeccable.yml`。这个条目**已经存在**（category `ui`），本次只改描述的称呼，不用新增条目。

- PR：[awesome-dsh-plugin#19226](https://github.com/awesome-dsh-plugin/awesome-dsh-plugin/pull/19226)（沿用 0.6.0 起的那条 PR，直接更新）
- 条目全文备份：[`jsnancy__dsh-impeccable.yml`](./jsnancy__dsh-impeccable.yml)

## 改了什么

1. `package.json` 版本 0.7.0，npm 包已发布；description 改为 “Shiliu design review desk (十六校审台)”。
2. `locale/zh.json` 的 `meta.title` 改为「十六校审台」；`locale/en.json` 改为 “Shiliu Review Desk”。
3. `lib/client.js` 的侧栏注册 `label` 与面板标题同步换名。
4. README 中英文两处标题与市场条目 `description.zh` / `description.en` 开头换成新名。
5. 市场条目其余功能表述（62 条规则、问题分组、24 条命令、双语、三档主题、引擎后台下载）保持不变。

## 提交顺序

先发 npm（`dsh-impeccable-studio@0.7.0`），再更新条目，最后推 PR —— 市场校验会探测仓库的 `package.json`、`dsh.bundle` 与 npm 版本，版本对不上会多一轮来回。

## 复现（下次更新条目）

```bash
git clone https://github.com/awesome-dsh-plugin/awesome-dsh-plugin /tmp/awesome-dsh-plugin
cd /tmp/awesome-dsh-plugin
git checkout -b <branch>
# 改 data/plugins/jsnancy__dsh-impeccable.yml
node -e "import('./scripts/lib/entries.mjs').then(m=>console.log(m.validateEntries(m.readEntries()).length))"
git commit -am "Update jsnancy/dsh-impeccable: ..."
git push https://github.com/jsnancy/awesome-dsh-plugin.git HEAD:<branch>
# 用 GitHub API 或以 fork PR 的形式提交
```
