# 手绘纸皮肤 · 设计说明

面板的观感全部来自 `lib/client.js` 底部那段 `STYLE` 字符串，没有外部样式表、没有网络字体、没有改 DOM。这里记下取值和做法，方便以后改。

## 两套纸

| 变量 | 浅色（暖白纸） | 深色（牛皮纸） |
| --- | --- | --- |
| `--im-bg` | `#fbf6ea` | `#1d1811` |
| `--im-surface` | `#fdfaf2` | `#2e2519` |
| `--im-surface-2`（侧栏） | `#f6ecd9` | `#17130e` |
| `--im-text` | `#2e2823` | `#f6eee0` |
| `--im-text-2` | `#574c3f` | `#e2d5bd` |
| `--im-text-3` | `#6f5f49` | `#bfae92` |
| `--im-border` / `--im-border-strong` | `#e2d3b6` / `#c6b18e` | `#54452f` / `#8a7050` |
| `--im-ink-line`（卡片描边） | `#3d332a` | `#c3ae8a` |
| `--im-accent`（朱红） | `#b23c25` | `#fb9070` |
| `--im-marker`（马克笔黄） | `#ffe08a` | `#5b4a1c` |
| 便签四色 `--im-tint-1..4` | `#fdf3cf` `#fbe6da` `#e9f0f6` `#eaf2e0` | `#3d3618` `#40261f` `#1f2c3a` `#26331f` |
| 硬阴影 | `3px 3px 0 rgba(74,52,30,.13)` | `3px 3px 0 rgba(0,0,0,.5)` |

正文对比度都过 WCAG AA：浅色 `--im-text-2` 5.8:1、`--im-accent` 5.6:1；深色 `--im-accent` 在便签底上 5.2:1，`警告` 胶囊 7.1:1。深色主按钮单独压成饱和朱红 `#ef6a4a` + 深褐字，避免和文字用的浅朱红抢亮度。

## 三档字

- `--im-hand`：HanziPen SC（翩翩体）→ Hannotate SC → Xingkai SC → Kaiti SC → cursive。标题、导航、按钮、分节号、命令动作名。
- `--im-text-face`：Hannotate SC（手札体）→ HanziPen SC → Kaiti SC → 系统 sans。正文和说明。
- `--im-num`：Bradley Hand → Chalkboard SE。数字、编号、耗时。
- `--im-mono` 留给文件路径和行号，保证能读。

macOS 上只装了翩翩体（Hannotate / Kaiti 会回落到 Songti），所以 `document.fonts.check` 不可信，得量字宽判断；没装手写体的机器自动退回系统字，小字仍然清楚。字体不打包（Apple 授权不允许），也不要引网络字体。

## 装饰语法

- **纸纹**：`feTurbulence` 噪点 data URI（浅色 opacity .05 / 深色 .13）+ 两道 radial 纸面明暗。
- **线**：卡片描边 1.5–1.8px 墨线 + 不规则圆角（如 `13px 5px 15px 6px / 7px 16px 5px 13px`）+ 实心硬阴影；分隔线一律 dashed；`:focus-visible` 是 2px 朱红虚线。
- **笔**：h1 下方 48×8 的朱红波浪线（SVG data URI，`background-repeat: repeat-x`）；分节号外面一圈手绘椭圆（`border-radius: 50% 46% 52% 48% / 52% 48% 54% 46%`，rotate -6deg）；标题右上角一颗手绘小星。
- **贴**：最近改过的页面是贴纸墙 —— 交替 ±0.3 度微旋转、顶部一条和纸胶带、hover 抬起回正；命令卡也交替微旋，分类色用 13×3px 短笔画代替色块。
- **记**：四格数字是米黄 / 淡粉 / 淡蓝 / 淡绿便签，各配一条朱红短横线；问题卡是暖色便签，深色下换深底。
- **涂**：进度条是虚线底纹 + 半透明朱红呼吸；骨架屏用纸色微光，不是灰色条。

## 图标

`docs/design/icon.svg`（512×512）是母版：纸面圆角方块（rect 10..502，r=92）+ 手绘放大镜（镜片 r=112，双线镜圈，40px 圆头镜柄）+ 镜片里一笔朱砂勾 + 几点墨渍。

重新导出 `icon.png` 的步骤（需要 Playwright 和 Pillow）：

1. 把 `icon.svg` 放进一个 1024×1024 的空白页，浏览器按 1024 渲染截屏；
2. 用 Pillow 把截图 LANCZOS 缩到 512，再按 rect(10..502, r=92) 做 4 倍超采样的圆角遮罩 `putalpha`，四角透明；
3. 覆盖仓库根的 `icon.png`。宿主和插件市场都读这张图。
4. 把 `lib/client.js` 里 `ICON_URL` 的 `?v=` 加一。宿主的 icon 路由带 ETag 且 `cache-control: no-cache`，浏览器会回源校验；版本串是给已经缓存了旧图的会话留的一道保险。

## 自查

这套皮肤会被 impeccable 自己的规则扫到两三条：`cream-palette`（暖纸底）、`repeating-stripes-gradient`（胶带与进度虚线）、深色下的 `cramped-padding`（满幅面板）。都是有意为之；对比度、字号、全大写、跑马灯这些应为空。改配色后建议把面板导成静态 HTML 再用 `impeccable detect` 复扫一遍。
