# TrustGo 项目开发规则

本文件适用于项目根目录及全部子目录。需求、代码、配置、文档与测试均须遵守以下规则。

## 品牌定位

TrustGo 是 IX RENTAL 的姊妹品牌，共享 FleetEdge（FE）商户端系统和 OTA 渠道能力，品牌定位独立：

- **Slogan**：Go Easy. Go Happy. — 轻松出发，快乐同行
- **Brand Personality**：Warm / Friendly / Easygoing / Trustworthy
- **官网卖点**：Easy Booking（简单清晰的预订体验）、Travel with Confidence（清楚了解租车规则和保障）、Freedom to Explore（按自己的节奏探索目的地）

与 IX RENTAL 的差异仅在品牌人格与视觉调性；技术栈、架构、FE 对接和 OTA 集成能力完全一致。

- 上述品牌关系仅供内部理解与实现参考。所有用户可见页面、导航、文案、SEO 元数据及结构化数据均不得出现 IX RENTAL 名称、姊妹品牌关系或共享平台的关联描述，对外独立呈现 TrustGo。

## 技术栈

- Next.js 16 App Router：服务端渲染 / 静态生成、多语言路由、Route Handlers、SEO metadata、robots 与 sitemap。
- React 19 + TypeScript 5.8：租车预订、用户账号、订单管理等业务页面与交互组件。
- Tailwind CSS 4 + shadcn/ui：响应式样式、设计 token 与通用交互组件；Motion、Lucide React 分别用于必要动效和图标。
- 通过 OpenAPI 对接 FleetEdge（FE）商户端系统；FE 管理租车基础信息与预订核心业务，并服务官网及 Trip.com、Booking.com、Carmore 等 OTA 渠道。官网负责 TOC 客户体验和官网渠道适配，不复制 FE 核心规则。
- npm 为包管理与脚本入口；需要浏览器端验收与回归测试时，遵循 Human-in-the-loop，由 Agent 提供明确的验证页面、操作步骤和预期结果，交由人点击确认，不由 Agent 自行运行 Playwright。
- 业务数据必须通过 Next.js Route Handler 或独立后端 API 的 adapter 访问，浏览器不得直连数据库。

## UI 与设计系统

- 视觉风格对齐 Airbnb 的克制、照片优先、留白分组。事实源按变化频率分层，只把稳定的内容写进文档：

  | 层 | 事实源 | 文档职责 |
  | --- | --- | --- |
  | Token（色彩、字号、间距、圆角、阴影） | 代码：[`src/app/globals.css`](src/app/globals.css) `@theme` | Design Tokens 解释语义与用途；色值冲突时以代码为准 |
  | 原则与硬约束 | [Design Guidelines](docs/guides/design-guidelines.md) | 设计原则、用色预算、导航规则、弹层选择、评审清单 |
  | 组件 | 代码：`src/shared/ui/` 与各模块 `ui/` | Component Library 只写"何时使用、不可改变的行为与信息层级" |
  | 页面 | [Page Patterns](docs/guides/page-patterns.md) | 只写每页目标、业务规则与状态；**不写列数、像素等布局数值** |
  | 页面布局 | 代码本身 | 不进文档；在变更说明中写清改了什么、为什么 |

- 是否需要先改规范，只看一条：**改动会影响其他页面、组件或 token 吗？** 会，则同步修改对应规范；不会（单页布局、排布、形态调整），直接改代码。

  | 规范 | 内容 |
  | --- | --- |
  | [Design Tokens](docs/guides/design-tokens.md) | 色彩、排版、间距、圆角、阴影、层级、动效、尺寸的语义与用途，以及 Tailwind 变量映射 |
  | [Design Guidelines](docs/guides/design-guidelines.md) | 设计原则、用色预算、导航与面包屑、摄影、文案、交互与动效、弹层选择、信息降维、页面状态、评审清单 |
  | [Component Library](docs/guides/component-library.md) | 组件的使用场景、信息层级与不可改变的 PC / H5 行为 |
  | [Layout & Grid](docs/guides/layout-grid.md) | 断点、容器、吸顶 / 吸底、安全区域、触控与溢出 |
  | [Page Patterns](docs/guides/page-patterns.md) | 每页的目标、业务规则与状态 |

- 品牌色 `#25A5E3`（晴空蓝）和辅助色 `#FF7F50`（暖阳橘）是核心视觉锚点，不得替换；承载白色文字的按钮与链接使用其派生色 `Primary-Strong`，规则见 Design Tokens §1。页面以中性色为主，品牌蓝只用于主操作、文字链接、选中描边和 Focus，用色预算见 Design Guidelines §3。
- 通用按钮、表单、弹层、菜单、Tabs 等基础交互组件基于项目内 shadcn/ui 原语（Radix）和 Tailwind CSS 4 构建，放在 `src/shared/ui/`，直接消费 Design Tokens，禁止重复造轮子或混用多套视觉体系。`src/components/` 为遗留目录，不得新增文件，修改时就近迁移到所属模块 `ui/` 或 `src/shared/ui/`。
- 所有用户流程必须同时兼容 PC 与 H5 mobile，默认采用移动优先的响应式实现，遵循 [Layout & Grid](docs/guides/layout-grid.md) 定义的三级断点（Desktop ≥ 1024px / Tablet 768–1023px / Mobile < 768px）和栅格规则；共享同一业务语义和状态规则，不得只完成桌面布局后再简单缩放，也不得在两个端复制并形成分叉的业务逻辑。
- UI 代码硬约束（评审时逐项检查，完整清单见 Design Guidelines §11）：

  | 约束 | 要求 |
  | --- | --- |
  | Token | 禁止任意值：`bg-[#…]`、`rounded-[…]`、`shadow-[…]`、`z-[…]`、`text-[10px]` / `text-[11px]` |
  | 卡片 | 内容卡片 `rounded-card`（12px）、默认无阴影、不嵌套卡片 |
  | 排版 | 最小字号 12px，字重 ≤ 700，不用全大写小标签 |
  | 弹层 | 统一使用 `src/shared/ui/` 中基于 Radix 的 Dialog / Sheet / Popover，禁止各模块手写 `fixed inset-0` 弹层；PC / H5 形态按 Design Guidelines §7 选择，C 端默认不使用右侧抽屉 |
  | H5 主操作 | 费率详情、下单、结算、订单详情的主操作在 H5 吸底栏中始终可见，并适配安全区域与软键盘 |
  | 导航 | 搜索结果进入费率详情：PC / Tablet 以新标签页打开，H5 在当前页打开（`target="_blank"` + `rel="noopener"`，并为读屏提供"在新标签页打开"提示）；费率详情之后的预订链路（驾驶人信息、支付）在当前标签页内流转；面包屑只用于 ≥ 3 级的内容页（门店详情、帮助文章），一级导航页与预订链路不使用面包屑或"返回首页"链接 |
  | 用色 | 导航高亮、选中 Chip、图标、标题、装饰标签不使用品牌蓝；禁止渐变色块 Banner 与装饰性小标签胶囊（eyebrow） |

- PRD / SPEC 不得设置脱离业务场景的独立"PC 与 H5 mobile"章节；布局、导航、表单、弹层、列表 / 卡片、长文本、软键盘、安全区域、触控目标、横向溢出和加载 / 错误状态必须写入每个具体页面或交互需求。确有端能力差异时，在对应页面需求和验收标准中说明原因与替代路径。

## 交付验证

- 本地预览统一使用 `npm run preview`（后台）或 `npm run dev`（前台）；入口会检查并复用同目录的健康服务，禁止绕过入口另起裸 `next dev`。状态、重启和停止分别使用 `npm run preview:status`、`npm run preview:restart`、`npm run preview:stop`。后台服务须用停止命令关闭，其他终端的 Ctrl+C 不会停止它。
- 开发缓存为 `.next-dev/`，生产构建为 `.next/`，不得混用或在服务运行时删除缓存。仅有明确组件清单 / chunk / 缓存异常时，使用 `npm run preview:restart -- --clean-cache` 先停止已验证的本项目开发服务再备份开发缓存；不终止无法验证归属的端口进程。日志保存在 `.local-preview/server-4000.log`，HTTP 检查成功不代表页面交互已验收。
- 交付前至少运行 `npm run build`；涉及文案或 i18n 的变更同时运行 `npm run check:i18n`。
- 受影响页面的 PC 与 H5 / MWEB、多语言及关键租车链路验收，必须整理验证点（页面 URL、视口、操作步骤、预期结果）交由人点击确认，记录未确认项，不得将其报告为已验收。
- 涉及 SEO 的变更还须检查 Next.js 最终构建产物，而不能只检查 React 开发态。

## 租车业务领域术语

以下术语从 FE 系统和 OTA 渠道 API（Trip.com / Booking.com / Carmore GOTAR）抽象而来，在代码、文案和文档中必须统一使用，不得混用或机械直译。

### 预订主流程

| 阶段 | 英文术语 | 中文 | 说明 |
| --- | --- | --- | --- |
| 车辆搜索 | Vehicle Availability Search | 车辆可用性搜索 | 按取还地点、日期时间、驾驶人年龄和国籍搜索可租车辆；对应 FE `vehAvailRate`、Booking `/cars/search`、Carmore `GET /vehicles` |
| 费率详情 | Rate Rules / Rate Details | 费率规则 / 费率详情 | 选定车辆后获取完整价格明细、取消政策、押金规则和附加费用；对应 FE `vehRateRule`、Booking `/cars/details`、Carmore `GET /vehicles/{id}` |
| 驾驶人信息 | Driver Details / Driver Information | 驾驶人信息填写 | 录入主驾驶人姓名、联系方式、国籍/驾照签发国、航班号，并选择附加设备；数据暂存并用于组装预订请求 |
| 创建预订 | Reserve / Create Reservation | 预订 / 创建预订 | 提交驾驶人信息、航班信息与车辆选项创建预订；对应 FE `vehRes`、Carmore `POST /orders` |
| 预订状态查询 | Reservation Status Query | 预订状态查询 / 查单 | 查询现有预订的最新状态，支持注册用户个人订单列表查询与访客单单验证；对应 FE `vehResStatusSearch`、Carmore `GET /orders/{id}` |
| 取消预订 | Cancel Reservation | 取消预订 | 取消预订并计算取消费用和退款金额；对应 FE `vehCancel`、Carmore `DELETE /orders/{id}` |

> [!NOTE]
> 业务规则：当前版本**不支持在线修改预订**。若客户需要调整取还车时间、地点或车型，须在允许期限内取消原预订后重新发起预订。

### 核心业务实体

| 英文术语 | 中文 | 说明 |
| --- | --- | --- |
| Location / Depot | 门店 / 取还车点 | 取车或还车的物理网点；含营业时间、地址、联系方式和服务类型（机场内 / 市区 / 穿梭巴士等） |
| Vehicle / Car | 车辆 | 具体可租的车辆实例，含车型名称（`vehMakeModel`）、ACRISS/SIPP 代码、座位数、行李容量、燃油类型和变速箱类型 |
| Vehicle Category | 车型组 / 车辆类别 | 按车身形态分组：Car、SUV、Van、Convertible、Pickup、Motorhome 等 |
| Supplier / Vendor | 供应商 / 履约合作伙伴 | FleetEdge（FE）商户端中与 TrustGo 合作、实际提供履约车辆的车行合作伙伴；对外统一以 TrustGo 品牌背书与服务标准呈现 |
| Driver | 驾驶人 | 主驾驶人，含年龄、国籍、姓名、联系方式 |
| Confirmation Code | 预订确认号 | 预订创建成功后返回的唯一标识；与主驾驶人姓氏（Last Name / Surname）共同作为访客查单凭证 |

### 价格与政策

| 英文术语 | 中文 | 说明 |
| --- | --- | --- |
| Rate / Rental Rate | 费率 / 租金 | 租车的基础费率，按天或按租期计算 |
| Total Charge | 总费用 | 含基础租金、税费和附加费用的估算总价 |
| Extra Charges | 附加费用 | 年龄附加费（Young/Senior Driver Fee）、单程费（One-way Fee）、设备费等 |
| Cancellation Policy | 取消政策 | 按截止时间分段计算的取消罚金规则；含免费取消期限（Free Cancellation Deadline）和罚金金额 / 百分比 |
| Deposit | 押金 | 取车时冻结的预授权金额 |
| Deposit-Free | 免押金 | 通过 OTA 信用体系担保，取车时免预授权 |
| Insurance Package | 保险套餐 | 保障等级：Basic（基本）/ Inclusive（全包）/ Zero Excess（零免赔额） |
| Damage Excess / Theft Excess | 碰撞 / 盗窃免赔额 | 发生损坏或盗窃时客户需承担的最高金额 |
| Fuel Policy | 燃油政策 | 满油取还（Like for Like）、免费油箱（Free Tank）、预付燃油（Pre-Purchase）等 |
| Mileage Policy | 里程政策 | 不限里程（Unlimited）或限定里程（Limited，含超程费） |
| Payment Timing | 支付时机 | 立即支付（Pay Now）、部分预付（Part Pay）、到店支付（Pay at Counter） |

### 取还车与服务

| 英文术语 | 中文 | 说明 |
| --- | --- | --- |
| Pick-up | 取车 | 在约定门店和时间提取车辆 |
| Drop-off / Return | 还车 | 在约定门店和时间归还车辆 |
| One-way Rental | 单程租赁 | 取车和还车在不同门店 |
| Vehicle Delivery | 送车上门 | 门店送车至客户指定地点 |
| Vehicle Collection | 上门取车 | 门店到客户指定地点取回车辆 |
| Special Equipment | 附加设备 | 儿童座椅、GPS、雪链等可选设备 |
| After-hours Return | 非工作时间还车 | 在门店非营业时间的还车流程 |
| No-show | 未取车 | 客户未在约定时间取车 |
| Online Check-in | 在线身份核验 | 订后取车前的证件预审 |

## 架构与模块化

- 必须采用模块化设计。按页面路由、业务能力和职责组织代码，保持页面、组件、领域类型、数据、服务适配、i18n 与工具层边界清晰；跨模块复用通过稳定的公共接口完成，禁止把新功能持续堆入巨型组件、全局上下文或万能工具文件。
- 编码时，Mock 仅限内部数据实现；禁止在任何用户可见界面中出现 `Mock` 或其他模拟数据标识，界面必须使用真实业务语义。
- 单个手写代码文件必须严格少于 2000 个物理行。新增或修改时如发现文件达到或超过 2000 行，必须先按业务职责拆分并完成架构优化后再交付；禁止用压缩排版、合并语句等方式规避行数限制。
- 涉及规划时，只讨论优先级和实现复杂度，不进行分阶段拆解和任务排期。
- 进行需求描述时，遵循"文不如表，表不如图"：能用表格清晰表达的不用大段文字，能用图清晰表达的不用表格；绘图必须使用语法严格且可解析的 Mermaid。
- 编写或修改 `specs/` 下任何文件时，必须先读取并优先参考 [`docs/template/TrustGo-PRD-SPEC需求文档模板.md`](docs/template/TrustGo-PRD-SPEC需求文档模板.md)；可按具体业务增补或裁剪，但不得省略适用的文档信息、业务场景、规则校验、验收标准、依赖与变更记录。
- 编写 `specs/` 下的需求文档时，不得将当前仓库的代码缺陷、技术债或实现偏差写入"问题背景"或"变更记录"；"变更记录"仅记录真实的业务决策或方案更新。
- 产品需求优先写清业务目标、用户场景、明确规则和验收结果；删除重复说明、无关架构推演和没有业务依据的极端分支。直接采用已明确的业务决策，不把不确定性扩写成多套备选方案。
- 官网是面向 TOC 客户的渠道前端；FE 是商户端业务系统，通过 OpenAPI 对接官网及其他 OTA。基础信息和预订核心逻辑属于 FE。官网可按渠道提供品牌化展示和客户交互，不能在需求中将渠道体验描述成官网自建的 FE 后台或平行预订系统。
- 区分开发与运营配置：已有系统可完成的商品、价格和状态设置写为配置工作，不新增开发需求。明确列出确实需要接口或官网调整的部分。

## OTA 渠道集成

FE 通过 OpenAPI 对接多个 OTA 渠道，官网是其中一个渠道。各渠道 API 的业务流程一致，术语和接口形态有差异，由 `src/integrations/fleetedge/` 统一适配。

### 各渠道 API 对照

| 业务能力 | FE / Trip.com | Booking.com | Carmore GOTAR |
| --- | --- | --- | --- |
| 门店信息 | `locationDetailsSearch` | `POST /cars/depots` | `GET /affiliates` |
| 车辆信息 | `vehicleSearch` | `POST /cars/details` | `GET /cars` |
| 车辆搜索 | `vehAvailRate` | `POST /cars/search` | `GET /vehicles` |
| 费率规则 | `vehRateRule` | 含在 search 响应 | `GET /vehicles/{id}` |
| 创建预订 | `vehRes` | — | `POST /orders` |
| 查询预订 | `vehResStatusSearch` | — | `GET /orders/{id}` |
| 修改预订 | `vehModify`（官网暂不开放） | — | — |
| 取消预订 | `vehCancel` | — | `DELETE /orders/{id}` |
| 押金通知 | `notifDeposit` / `depositNotif` | — | — |
| 供应商 | 含在 search 响应 | `POST /cars/suppliers` | 含在 search 响应 |
| 认证方式 | SHA256 签名 | Affiliate ID Header | JWT Bearer |

官网不直接调用 OTA API，所有外部协议通过 `src/integrations/` 隔离，业务模块只依赖 FE 适配层的领域接口。

## i18n 与租车 / OTA 语言规范

- 所有面向用户的页面、路由、SEO 元数据、结构化数据、表单、校验、错误、空状态、通知与无障碍文案都必须考虑 i18n，禁止在组件中散落不可翻译的硬编码文案。语言与路由以 `src/i18n/locales.ts` 为准，翻译通过现有 i18n 入口统一管理；新增或变更文案时必须同步检查全部支持语言及回退行为。
- 语言必须符合 car rental（租车）与 OTA 业务标准，统一使用本文件"租车业务领域术语"章节定义的术语。预订确认号、取车 / 还车、门店、车型组、车辆、驾驶人、附加服务、保险 / 保障、押金、支付、取消、退款、No-show 和订单状态等概念不得混用或机械直译；日期、时间、时区、币种、金额、税费、距离和燃油 / 电量单位必须按 locale 与实际业务数据正确本地化。
- UX 文案遵循 TrustGo 品牌语气：标题清楚直接、说明文字极简、避免冷冰冰的系统词汇。用 "Oops! Please select a pick-up date first." 替代 "Error: Validation Failed."，用 "Travel with Confidence" 替代 "Mandatory Insurance Policies"。

## Google SEO

- 页面、路由与内容设计必须同步考虑 Google SEO，不得把 SEO 留到上线前补做。公开内容应优先输出可抓取的服务端 / 静态 HTML，并遵循 Google Search Essentials；不得依赖仅在客户端交互后才出现的关键索引内容，也不得使用隐藏文本、关键词堆砌等违规手段。
- 每个可索引页面必须检查唯一且准确的 `title`、meta description、canonical、`hreflang`、语义化标题层级、可理解的链接文本与图片替代文本；按页面性质维护 robots 策略、XML sitemap 和适用的结构化数据，并确保多语言页面互相正确声明。
- 必须兼顾 Core Web Vitals 与可访问性：控制 JavaScript、字体、图片和第三方资源成本，避免布局偏移，优化 LCP / INP / CLS，并保证页面状态与真实业务状态一致。构建后应检查生成页面、索引边界、失效链接和结构化数据，不得用营销文案虚构门店、车型、价格、评分或可用库存。

## 隐私与安全

- 个人数据遵循最小必要原则。姓名、联系方式、证件、支付信息、精确地址、定位、自由文本和搜索原文不得进入 URL、前端持久化、分析平台或非必要日志；服务端日志必须脱敏并限制访问。
- 敏感数据必须通过加密连接传输并在可信服务端按明确用途处理；完整卡号、CVC、secret、完整支付 token 和第三方密钥不得由浏览器保存或暴露。定位权限只能由用户主动触发并说明用途。
- 涉及个人数据的能力必须明确采集目的、授权、访问权限、留存期限、删除机制和跨境要求，并落实输入校验、限流、滥用防护、幂等和操作审计；未满足时不得作为生产能力上线。
- PRD / SPEC 默认继承本节，不重复抄写通用隐私与安全条款；只有业务需要新增或偏离本节的数据范围、用途、权限或合规要求时，才在需求文档中写专项规则。
