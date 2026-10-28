# TrustGo Design Tokens：基础视觉变量

本文件解释 TrustGo 视觉变量（Tokens）的语义与用途。**色值的事实源是代码** [`src/app/globals.css`](../../src/app/globals.css) 的 `@theme`；本文表格中的色值便于设计与评审查阅，与代码不一致时以代码为准并修正本文。Figma 中须建立同名 Local Variables / Styles。

**风格基线**：对齐 Airbnb 的克制、照片优先、留白分组风格；保留 TrustGo 的晴空蓝 `#25A5E3` 与暖阳橘 `#FF7F50` 作为品牌锚点。

> [!IMPORTANT]
> 组件与页面禁止直接书写十六进制色值（如 `bg-[#25A5E3]`）、任意圆角（如 `rounded-[20px]`）、任意阴影（如 `shadow-[0_8px_16px_...]`）和任意 z-index（如 `z-[120]`）。所有视觉值必须来自本文件定义的 Token。

## 1. 色彩系统（Color Tokens）

颜色按语义命名，不按色值命名。页面整体遵循 **中性色约 90% / 品牌蓝 ≤ 8% / 暖阳橘 ≤ 2%** 的比例：品牌色只用于"可操作"和"被选中"，不作为装饰铺满页面（逐元素的用色预算见 [Design Guidelines §3](design-guidelines.md)）。中性色为无色相灰阶，不带蓝灰倾向，避免整页发灰。

### 1.1 品牌色（Brand）

| Token | 色值 | 用途 | 禁用场景 |
| --- | --- | --- | --- |
| `Color/Brand/Primary` | `#25A5E3` | Logo、品牌插画、选中描边、Focus Ring、进度条、图标强调、大面积品牌色块 | 承载白色正文或按钮文字（白字对比度仅约 2.8:1，不满足 WCAG AA） |
| `Color/Brand/Primary-Strong` | `#0A6EBD` | 主按钮（CTA）填充、白底与 `Primary-Light` 底上的文字链接与选中态文字（白字 5.3:1，浅蓝底 4.7:1） | 大面积背景、导航高亮、标题、图标染色 |
| `Color/Brand/Primary-Strong-Hover` | `#085CA0` | 主按钮 Hover / Pressed | — |
| `Color/Brand/Primary-Light` | `#E8F4FC` | 选中卡片底色、信息提示底色 | 正文背景大面积铺色 |

> [!NOTE]
> `#25A5E3` 仍是唯一的品牌主色，不得替换。`Primary-Strong` 是同色系的派生深色（色相由 200° 微移至 206° 并提高饱和度），既满足白字 4.5:1 的可读性要求，又避免单纯压暗带来的发灰"石油蓝"观感。

### 1.2 情感辅助色（Accent）

| Token | 色值 | 用途 |
| --- | --- | --- |
| `Color/Accent/Default` | `#FF7F50` | 评分星星、促销角标图形、品牌插画点缀 |
| `Color/Accent/Strong` | `#B84014` | 浅橘底上的文字（促销标签文字、"Limited Offer"） |
| `Color/Accent/Light` | `#FFF0EB` | 促销标签底色 |

> [!WARNING]
> 暖阳橘是**情感色**，不是警告色。旧规范中的 `Color/Accent/Warning-*` 已更名为 `Color/Accent/*`，代码变量名为 `warm`。错误、警告、成功等系统反馈必须使用 §1.4 的反馈色，不得用橘色表达错误。

### 1.3 中性色（Neutrals）

| Token | 色值 | 用途 | 对比度（白底） |
| --- | --- | --- | --- |
| `Color/Text/Primary` | `#222222` | 标题、正文强调、价格、图标默认色、导航高亮、选中 Chip | ≈ 15.9:1 |
| `Color/Text/Secondary` | `#5E5E5E` | 正文、说明文字 | ≈ 6.5:1 |
| `Color/Text/Tertiary` | `#6A6A6A` | 辅助说明、元信息（日期、车型代码、"or similar"） | ≈ 5.4:1（Subtle 底 ≈ 5.1:1） |
| `Color/Text/Disabled` | `#8A8A8A` | Placeholder、禁用文字、装饰性图标 | ≈ 3.5:1，不得承载需要阅读的信息 |
| `Color/Text/OnPrimary` | `#FFFFFF` | `Primary-Strong` / 深色遮罩上的文字 | — |
| `Color/Background/Base` | `#FFFFFF` | 页面主背景、卡片背景 | — |
| `Color/Background/Subtle` | `#F7F7F7` | 区块分割背景、车辆白底图容器、骨架屏 | — |
| `Color/Background/Muted` | `#EBEBEB` | 分段控件底槽、按下态背景 | — |
| `Color/Border/Divider` | `#E6E6E6` | 分割线、卡片描边 | — |
| `Color/Border/Default` | `#D1D1D1` | 次要按钮、筛选 Chip、可选卡片默认描边 | — |
| `Color/Border/Input` | `#8A8A8A` | 输入框、Checkbox、Radio 描边（需 ≥ 3:1 以识别控件边界） | ≈ 3.5:1 |
| `Color/Overlay/Scrim` | `rgba(34, 34, 34, 0.48)` | 弹层遮罩 | — |

### 1.4 反馈色（Feedback）

| 语义 | 文字 / 图标 | 背景 | 用途 |
| --- | --- | --- | --- |
| Success | `#13795B` | `#E8F6F0` | 免费取消、不限里程、已确认、支付成功 |
| Warning | `#A15C00` | `#FFF6E5` | 证件要求提醒、即将过期的报价、需补充信息 |
| Error | `#C2362F` | `#FDECEC` | 表单错误、支付失败、取消失败 |
| Info | `#085CA0` | `#E8F4FC` | 中性提示、政策说明 |

反馈色只用于状态表达，不得作为装饰色，也不得在组件中直接使用 Tailwind 调色板（如 `emerald-600`、`amber-50`、`blue-50`）替代。

## 2. 排版（Typography Tokens）

### 2.1 字体栈

字体按页面 `lang` 切换，不得让繁体中文、日文、韩文回退到简体字形。

| `lang` | 字体栈 |
| --- | --- |
| `en` / `es` | `Poppins, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif` |
| `zh-Hant` | `Poppins, "PingFang TC", "Noto Sans TC", "Microsoft JhengHei", sans-serif` |
| `ja` | `Poppins, "Hiragino Sans", "Noto Sans JP", "Yu Gothic", sans-serif` |
| `ko` | `Poppins, "Apple SD Gothic Neo", "Noto Sans KR", "Malgun Gothic", sans-serif` |

- Poppins 只加载 400 / 500 / 600 / 700 四个字重，通过 `@fontsource/poppins` 提供本地字体文件并由 `next/font/local` 自托管，使用 `display: swap`；构建不依赖 Google Fonts 网络下载。
- 价格、时间、确认号使用 `font-variant-numeric: tabular-nums`，保证数字对齐。

### 2.2 字号阶梯

Airbnb 风格的层级依靠**字号与字重**，不依靠颜色、全大写或装饰条。

| Token | Desktop ≥ 1024 | Mobile < 768 | 字重 | 行高 | 用途 |
| --- | --- | --- | --- | --- | --- |
| `Type/Display` | 48px | 32px | 700 | 1.15 | 首页 Hero 主旨句（每页最多 1 处） |
| `Type/H1` | 32px | 26px | 600 | 1.25 | 页面标题 |
| `Type/H2` | 24px | 22px | 600 | 1.3 | 模块标题（Section） |
| `Type/H3` | 20px | 18px | 600 | 1.4 | 区块标题、详情页子模块标题 |
| `Type/Title` | 16px | 16px | 600 | 1.4 | 卡片标题（车辆名、门店名） |
| `Type/Body-Large` | 16px | 16px | 400 | 1.5 | 主要阅读文本、表单输入值 |
| `Type/Body` | 14px | 14px | 400 | 1.5 | 默认正文、列表信息 |
| `Type/Caption` | 12px | 12px | 400 / 500 | 1.4 | 元信息、角标、法律小字 |
| `Type/Price` | 22px | 20px | 600 | 1.2 | 列表与汇总中的总价 |
| `Type/Price-Hero` | 28px | 24px | 700 | 1.2 | 结算页 / 订单页的最终总价 |

**硬性规则**：

| 规则 | 说明 |
| --- | --- |
| 最小字号 12px | 禁止 10px / 11px；H5 上的正文不得小于 14px |
| 字重上限 700 | 禁止 `font-extrabold`（800）与 `font-black`（900） |
| 不用全大写标签 | 禁止 `uppercase tracking-wider` 式小标签；改用 `Type/Caption` 500 + 首字母大写（Sentence case）。CJK 语言本身无大小写 |
| CJK 行高 | `zh-Hant` / `ja` / `ko` 正文行高取 1.6，标题取 1.35 |
| 段落行宽 | 长文本最大 72ch（约 640px） |

### 2.3 排版工具类

`globals.css` 的 `@theme inline` 将字号阶梯映射为语义工具类；字重单独使用 `font-semibold`（标题）或默认 400（正文）。Tablet 沿用移动端字号，Desktop 在 `lg:` 切换。

| 语义 | 工具类 |
| --- | --- |
| H1 | `text-h1 lg:text-h1-desktop font-semibold` |
| H2 | `text-h2 lg:text-h2-desktop font-semibold` |
| H3 | `text-h3 lg:text-h3-desktop font-semibold` |
| 卡片标题 | `text-title font-semibold` |
| 大号正文／输入值 | `text-body-large` |
| 正文 | `text-body` |
| 元信息／法律小字 | `text-caption` |

语义类同时提供对应行高。`--type-leading-*` 由页面语言控制：中日韩标题与卡片标题使用 1.35、正文使用 1.6，其他语言使用 §2.2 表格值；避免用 `leading-relaxed` 等通用类覆盖。字体栈仍继承 §2.1，不在模块中另设字体。长答案使用 `max-w-reading`（`--container-reading`），默认页面容器使用 `max-w-default`（`--container-default`），全局 Header 使用 `max-w-header`（`--container-header`）为品牌、主导航与用户工具提供独立空间，尺寸与 Layout & Grid 保持一致。

## 3. 间距（Spacing Tokens）

4px 基础单位，常用 8px 增量。

| Token | 值 | Tailwind | 典型用途 |
| --- | --- | --- | --- |
| `Space/2xs` | 4px | `1` | 图标与紧邻文字 |
| `Space/xs` | 8px | `2` | 行内元素、Chip 之间 |
| `Space/sm` | 12px | `3` | 卡片内信息行之间 |
| `Space/md` | 16px | `4` | 卡片内边距（H5）、表单字段之间 |
| `Space/lg` | 24px | `6` | 卡片内边距（PC）、栅格 Gutter |
| `Space/xl` | 32px | `8` | 相关区块之间 |
| `Space/2xl` | 48px | `12` | H5 模块（Section）之间 |
| `Space/3xl` | 64px | `16` | PC 模块之间 |
| `Space/4xl` | 96px | `24` | 首页 PC 大区块之间 |

## 4. 圆角（Radius Tokens）

整个系统只允许以下 5 级圆角。旧规范中卡片 16px、代码中 20px / 24px 的内容卡片圆角**偏圆**，显得"玩具感"，与 Trustworthy 的人格不符，统一收敛为 12px。

| Token | 值 | Tailwind 工具类 | 适用 |
| --- | --- | --- | --- |
| `Radius/xs` | 4px | `rounded-tag` | Checkbox、进度条、图片内小角标 |
| `Radius/sm` | 8px | `rounded-control` | 按钮、输入框、Tag、缩略图、Toast |
| `Radius/md` | 12px | `rounded-card` | 车辆卡片、门店卡片、内容卡片、图片、Popover / 下拉菜单、吸顶价格卡 |
| `Radius/lg` | 16px | `rounded-sheet` | 居中 Modal、Bottom Sheet 顶部两角、Hero 内嵌大图 |
| `Radius/full` | 9999px | `rounded-full` | 搜索药丸、筛选 Chip、头像、圆形图标按钮、状态徽章 |

> [!NOTE]
> 使用语义类名而不是覆盖 Tailwind 默认的 `rounded-sm / md / lg / xl`，可以避免与 Tailwind 默认值及 shadcn/ui 原语内置类名混淆。新引入的 shadcn/ui 组件须将其中的 `rounded-*` 替换为上述语义类名。

**规则**：

1. **嵌套圆角递减**：内层圆角 = 外层圆角 − 内边距，且不得大于外层。例如 12px 卡片内的图片若贴边，只保留顶部两角 12px；若有 16px 内边距，内部元素使用 `Radius/xs` 或 0。
2. **不嵌套卡片**：卡片内不再放"带底色 + 描边 + 圆角"的子卡片，改用分割线或留白分组（Airbnb 式分组）。
3. **全屏 Sheet 无圆角**：H5 全屏弹层四角为 0；非全屏 Bottom Sheet 仅顶部两角 `Radius/lg`。
4. 禁止 20px、24px、32px 等未定义圆角。

## 5. 阴影与层级（Elevation）

Airbnb 风格的核心是**静态内容不浮起**：内容卡片默认不带阴影，阴影只留给真正浮在页面之上的元素。阴影色统一基于 `#222222`。

| Token | 值 | 用途 |
| --- | --- | --- |
| `Elevation/0` | `none` | 内容卡片、列表项、表单（默认） |
| `Elevation/1` | `0 1px 2px rgba(34,34,34,.08), 0 4px 12px rgba(34,34,34,.06)` | 搜索栏、PC 吸顶价格卡、滚动后的 Header、H5 吸底操作栏（向上投影） |
| `Elevation/2` | `0 8px 28px rgba(34,34,34,.16)` | Popover、下拉菜单、Modal、Bottom Sheet、Toast |

- 卡片 Hover 不叠加"阴影加深 + 边框变色 + 位移"多重效果，规则见 [Design Guidelines](design-guidelines.md) §6。
- 吸底操作栏使用向上的阴影：`0 -1px 0 #E6E6E6, 0 -4px 12px rgba(34,34,34,.06)`。

### 5.1 Z 轴层级（Z-index）

| Token | 值 | 元素 |
| --- | --- | --- |
| `Z/Base` | 0 | 普通内容 |
| `Z/Sticky` | 20 | 筛选栏、吸顶价格卡、H5 吸底操作栏 |
| `Z/Header` | 40 | 全局 Header |
| `Z/Popover` | 50 | Popover、下拉菜单、Tooltip |
| `Z/Overlay` | 100 | Modal、Sheet 及其遮罩 |
| `Z/Toast` | 200 | Toast、全局通知 |

多个弹层叠加（如 Modal 内打开图片预览）由 Radix Portal 的挂载顺序决定层叠，不再递增魔法数字。

## 6. 动效（Motion Tokens）

| Token | 值 | 用途 |
| --- | --- | --- |
| `Motion/Duration/Fast` | 150ms | Hover、按下、Chip 选中、退出动画 |
| `Motion/Duration/Base` | 200ms | Popover、下拉、Accordion 展开 |
| `Motion/Duration/Slow` | 300ms | Modal、Bottom Sheet、全屏 Sheet 进入 |
| `Motion/Easing/Enter` | `cubic-bezier(0.16, 1, 0.3, 1)` | 元素进入（Ease-Out） |
| `Motion/Easing/Exit` | `cubic-bezier(0.4, 0, 1, 1)` | 元素退出（Ease-In，时长取 Fast） |
| `Motion/Easing/Standard` | `cubic-bezier(0.2, 0, 0, 1)` | 位置与尺寸变化 |

在 `prefers-reduced-motion: reduce` 下，位移与缩放动画改为 ≤ 100ms 的透明度过渡。

## 7. 尺寸（Size Tokens）

| Token | 值 | 用途 |
| --- | --- | --- |
| `Size/Touch-Min` | 44px | 所有可点击元素的最小命中区域（含 PC） |
| `Size/Control-sm` | 36px | PC 紧凑控件（筛选 Chip、排序下拉） |
| `Size/Control-md` | 48px | 默认按钮、默认输入框 |
| `Size/Control-lg` | 56px | 带浮动标签的输入框、搜索栏字段 |
| `Size/Icon-sm` | 16px | 行内图标 |
| `Size/Icon-md` | 20px | 按钮与列表图标 |
| `Size/Icon-lg` | 24px | 保障声明、空状态之外的强调图标 |
| `Size/Header-Desktop` | 72px | PC Header 高度 |
| `Size/Header-Mobile` | 56px | H5 Header 高度 |
| `Size/BottomBar` | 72px + `env(safe-area-inset-bottom)` | H5 吸底操作栏 |

## 8. 实现映射（Tailwind CSS 4 + shadcn/ui）

Token 在 `src/app/globals.css` 中通过 `@theme` 声明并生成语义化工具类（本节不再复制完整 `@theme` 代码，避免文档与代码漂移）。核心变量**直接沿用 shadcn/ui 的语义命名**（`primary`、`border`、`input`、`ring`、`muted` 等），使后续引入的 shadcn/ui 原语开箱即消费 TrustGo Token；shadcn/ui 未覆盖的品牌与反馈语义作为扩展变量补充。

### 8.1 变量对照

| Design Token | CSS 变量 | 工具类示例 |
| --- | --- | --- |
| `Color/Background/Base` | `--color-background` | `bg-background` |
| `Color/Text/Primary` | `--color-foreground` | `text-foreground` |
| `Color/Text/Secondary` | `--color-foreground-secondary` | `text-foreground-secondary` |
| `Color/Text/Tertiary` | `--color-muted-foreground` | `text-muted-foreground` |
| `Color/Text/Disabled` | `--color-foreground-disabled` | `text-foreground-disabled` |
| `Color/Background/Subtle` | `--color-muted` | `bg-muted` |
| `Color/Background/Muted` | `--color-accent` | `hover:bg-accent`（shadcn/ui 语义：悬停 / 按下底色） |
| `Color/Brand/Primary-Strong` | `--color-primary` | `bg-primary text-primary-foreground` |
| `Color/Brand/Primary-Strong-Hover` | `--color-primary-hover` | `hover:bg-primary-hover` |
| `Color/Brand/Primary` | `--color-brand` / `--color-ring` | `text-brand`、`border-brand`、`ring-ring` |
| `Color/Brand/Primary-Light` | `--color-brand-light` | `bg-brand-light` |
| `Color/Accent/*` | `--color-warm` / `--color-warm-strong` / `--color-warm-light` | `text-warm-strong bg-warm-light` |
| `Color/Border/Divider` | `--color-border` | `border-border` |
| `Color/Border/Default` | `--color-border-strong` | `border-border-strong` |
| `Color/Border/Input` | `--color-input` | `border-input` |
| Feedback / Error | `--color-destructive` / `--color-destructive-light` | `text-destructive` |
| Feedback / Success、Warning | `--color-success*` / `--color-warning*` | `text-success bg-success-light` |

> [!WARNING]
> shadcn/ui 中的 `accent` 表示"悬停底色"，不是品牌辅助色。暖阳橘统一使用 `warm` 系列变量，避免语义冲突。

### 8.2 `@theme` 声明

见 [`src/app/globals.css`](../../src/app/globals.css)。新增或修改 token 时先改代码，再同步 §1–§7 的语义表。

使用示例：主按钮 `bg-primary text-primary-foreground hover:bg-primary-hover rounded-control`；内容卡片 `border border-border rounded-card`；浮层 `shadow-overlay rounded-sheet`。

### 8.3 从旧写法迁移

| 旧写法 | 新写法 |
| --- | --- |
| `rounded-[20px]` / `rounded-[24px]` / `rounded-2xl`（内容卡片） | `rounded-card`（12px） |
| `rounded-xl` / `rounded-[12px]` / `rounded-lg`（按钮、输入框） | `rounded-control`（8px） |
| `rounded-[6px]` / `rounded-[10px]` / `rounded-[14px]` / `rounded-md` | 就近归入 `rounded-control` 或 `rounded-card` |
| `bg-[#25A5E3] text-white`（按钮） | `bg-primary text-primary-foreground hover:bg-primary-hover` |
| `text-[#25A5E3]`（链接文字） | `text-primary` |
| `text-[#2C3338]` / `text-[#5C6B75]` / `text-[#8492A0]` | `text-foreground` / `text-foreground-secondary` / `text-muted-foreground` |
| `shadow-trust-low` / `shadow-sm`（静态卡片） | 删除阴影，保留 `border border-border` 或无边框 |
| `shadow-trust-md` / `shadow-trust-high` / `shadow-2xl`（浮层） | `shadow-overlay` |
| `text-[10px]` / `text-[11px]` | `text-xs`（12px） |
| `font-black` / `font-extrabold` | `font-semibold` 或 `font-bold` |
| `uppercase tracking-wider` 小标签 | `text-xs font-medium text-muted-foreground` |
| `text-emerald-600` / `bg-amber-50` / `bg-blue-50` 等 | `text-success` / `bg-warning-light` / `bg-brand-light` 等 |
| `z-[110]` / `z-[120]` / `z-[130]` | 使用 Radix Portal，配合 §5.1 层级 |
