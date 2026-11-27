# 0.6.0 更新（维护市场条目用）

插件市场仓库是 [awesome-dsh-plugin/awesome-dsh-plugin](https://github.com/awesome-dsh-plugin/awesome-dsh-plugin)，条目在 `data/plugins/jsnancy__dsh-impeccable.yml`。这个条目**已经存在**（category `ui`，旧描述只讲 62 条规则和面板），0.6.0 只改描述、补一个显式 `icon`，不用新增条目。

- PR：[awesome-dsh-plugin#19226](https://github.com/awesome-dsh-plugin/awesome-dsh-plugin/pull/19226)
- 可直接应用的补丁：[`awesome-dsh-plugin.patch`](./awesome-dsh-plugin.patch)
- 条目全文备份：[`jsnancy__dsh-impeccable.yml`](./jsnancy__dsh-impeccable.yml)

## 改了什么

1. 描述开头补上手绘纸界面：浅色暖白纸配朱红墨，深色牛皮纸配粉笔线；其余功能表述（62 条确定性规则、问题分组、24 条命令、双语、三档主题、引擎后台下载）保持不变。
2. 新增 `icon` 字段，指向仓库根的 `icon.png`（手绘放大镜，0.6.0 重画）。
3. 截图不写进市场仓库：市场会读仓库自己的 `screenshots.json`，本次已把 `docs/shots/panel-light.png` 与 `panel-dark.png` 换成新版。

## 提交顺序

先发 npm（`dsh-impeccable-studio@0.6.0`），再更新条目，最后提 PR —— 市场校验会探测仓库的 `package.json`、`dsh.bundle` 与 npm 版本，版本对不上会多一轮来回。

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
