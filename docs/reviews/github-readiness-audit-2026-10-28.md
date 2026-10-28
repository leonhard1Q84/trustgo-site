# GitHub 首次推送前代码审查

> 本文保留修复前的审查证据。后续修复与验证结果见 [修复记录](github-readiness-fixes-2026-10-28.md)。本地模拟能力由用户确认暂时接受。

审查日期：2026-10-28。范围：当前工作区源码、依赖与锁文件、构建与静态产物、业务回归、Git 待提交文件。此次仅新增本审查记录，未修改业务代码、依赖或 Git 历史，未创建远端仓库或推送。

## 结论

当前不能给出“没有硬伤”的结论。存在一项会阻断全新环境构建的问题、一项导致仓库 lint 入口失效的问题，以及三项明确的用户体验或多语言缺陷。建议修复后再作为可复现构建的正式基线推送；如仅保存当前原型，可推送到私有仓库并保留这些已知问题。

账户、预订、支付、退款和通知仍有明确的本地验证边界。代码入库不代表具备生产运营条件。

## 已确认代码问题

| 编号 | 优先级 | 问题及实际影响 | 代码位置 | 验证证据与修复方向 |
| --- | --- | --- | --- | --- |
| F1 | P1 | 地图依赖未声明。新环境按锁文件安装，无法完成类型检查和构建；本机残留包掩盖了问题。 | `src/modules/locations/ui/StoreLocatorMap.tsx:4`；`package.json`；`package-lock.json` | 源码导入 `leaflet` 及其 CSS，但两个清单均没有该包。`npm ls --depth=0` 将 `leaflet@1.9.4`、`@types/leaflet@1.9.22` 标为 extraneous。在临时副本中隔离这些未声明包后，TypeScript 返回 `TS2307: Cannot find module 'leaflet' or its corresponding type declarations.`。应显式添加运行依赖与类型依赖、更新锁文件，并在仅按锁文件安装的环境验证构建。 |
| F2 | P2 | `npm run lint` 退出码为 2，仓库级检查无法执行。生产构建中的 lint 通过不能代替此入口。 | `eslint.config.mjs:8` | 全局规则对象应用到 `.cjs`，但 Next 预设注册 React 插件的文件范围不含 `.cjs`。单独运行 `eslint scripts/test-rental-business.cjs` 也报找不到 `react-hooks` 插件。应给规则配置明确的文件范围或为脚本单独配置；同时忽略 `.next-dev/**` 和 `.local-preview/**` 等生成目录。 |
| F3 | P2 | 切换语言丢失搜索和预订上下文。驾驶人页会因缺失费率 ID 跳回搜索，搜索结果页也会丢失地点与日期。 | `src/shared/ui/site-header.tsx:36`；`src/app/[lang]/book/driver/page.tsx:27` | PC 与移动菜单都使用 `getLocalizedPath()`，它只替换 `usePathname()` 的语言段，不带查询参数。例如 `/en/book/driver?rateDetailsId=…&insurance=…` 变为 `/ja/book/driver`，随后因没有 `rateDetailsId` 重定向。应保留允许的业务参数并转换内部恢复路径的语言；涉及未提交驾驶人资料时明确保留或离开确认行为。代码路径已确认，浏览器点击待人工验收。 |
| F4 | P2 | 非英语静态页面的初始 HTML 错标为英语，影响首屏读屏语言与服务端语言声明。 | `src/app/layout.tsx:32`；`src/i18n/LanguageContext.tsx:76` | 构建后扫描 `.next/server/app/**/*.html`：五种语言各 20 个页面都输出 `lang="en"`，其中 80 个非英语页面不匹配；例如 `/zh/help` 应为 `zh-Hant`。根布局依赖请求头，而静态生成时没有中间件语言头，客户端 effect 之后才更正。应让服务端文档语言直接取自语言路由，并再次检查最终构建产物。 |
| F5 | P2 | 支付页允许修改“凭证联系邮箱”，但修改值不会提交或保存，产生无效表单承诺。 | `src/modules/checkout/ui/StripeCardForm.tsx:65`、`:121`、`:165`；`src/app/[lang]/checkout/[reservationId]/CheckoutCashierView.tsx:52` | 邮箱仅存于组件 state；提交只调用 `onPay(card)`，付款请求仅发送幂等键与本地付款场景。修改邮箱后订单仍保留原驾驶人邮箱。应明确沿用已有联系邮箱的展示行为，或通过服务端渠道接口落实独立凭证邮箱的校验、保存和投递；不能让可编辑字段静默失效。数据流已确认，浏览器点击待人工验收。 |

P1 表示影响核心交付、应优先处理；P2 表示确定需要修复，但不必因此重写整体架构。

## 已知生产边界

| 能力 | 当前实现与证据 | 对交付的含义 |
| --- | --- | --- |
| FE 预订与订单 | `src/integrations/fleetedge/local-rental-adapter.ts` 使用进程内 Map；默认 production 抛出 503。显式 `TRUSTGO_RENTAL_MODE=local` 仍只是内存实现。 | 没有真实 FE 搜索、预订和取消闭环；重启或多实例不能维持共享业务状态。不得通过启用 local 模式宣称完成生产接入。 |
| 账户与邮件 | `src/server/account-route.ts:6` 在 production 禁用本地账户；本地通知不等于邮件投递。 | 注册、登录、验证码与个人中心还需要生产账户服务、共享持久化和真实投递。 |
| 支付与退款 | `local-payment.ts` 按本地场景更新状态；`local-rental-adapter.ts` 按经过时间模拟付款确认、退款完成。 | 尚无真实支付 provider、Webhook 与真实退款对账，不能收取真实款项。 |
| 合作咨询 | `submit-enquiry.ts` 要求 HTTPS 接收服务及生产就绪配置。 | 未配置时拒绝提交，没有把未投递线索报告为成功；接收端仍需联调。 |
| 在线身份核验 | `OnlineCheckinBanner.tsx` 没有文件输入与上传处理，提交按钮禁用。 | 当前是入口展示，尚不具备证件预审能力。 |

以上多为已有保护和尚未完成的集成，不将它们误报为已经发生的生产安全事故。

## 自动检查结果

| 检查 | 结果 | 范围或限制 |
| --- | --- | --- |
| `npm run build` | 通过 | 当前本机环境；不能覆盖 F1 的干净安装失败。运行版本 Next.js 15.5.28。 |
| `npm run check:i18n` | 通过 | 1649 个 key，EN / ZH / JA / ES / KO 对齐；不覆盖 HTML `lang`、语言切换和组件内所有硬编码内容。 |
| `npm run lint` | 失败 | 配置错误，退出码 2，见 F2。 |
| `eslint src --format json` | 通过，有告警 | 323 个源码文件，0 error、69 warning；仍需清理 hooks、依赖数组、未使用变量等告警。 |
| 隔离未声明地图依赖的 TypeScript 检查 | 失败，符合 F1 | 临时副本保留其他现有依赖，移除 `leaflet`、`@types/leaflet`、`@types/geojson` 的可见性；不是完整的 `npm ci` 重装验收。 |
| `test-rental-business.cjs` | 53 项通过 | 状态、价格校验、权限、访客授权、账户隔离、取消与付款。 |
| `test-booking-recovery.cjs` | 25 项通过 | 请求竞态、错误恢复、展示金额和订单状态。 |
| `test-local-scenarios.cjs` | 20 项通过 | 本地异常、故障开关、库存及付款输入。 |
| `test-customer-account.cjs` | 31 项通过 | 注册、认证、验证码、会话、建账与生产阻断。 |
| `test-driver-checkout.cjs` | 6 项通过 | 驾照地区、费率失效和驾驶人到结算行为。 |
| `test-partnership.cjs` | 7 项通过 | 线索验证、幂等、转发、失败和生产配置保护；不访问外部网络。 |
| `test-location-filters.cjs` | 6 项通过 | 门店筛选和多语言检索。 |
| 手写代码文件长度 | 未发现达到 2000 行 | 扫描 `src/`、`scripts/` 中 333 个代码文件，最大 1899 行。 |
| 常见凭证格式扫描 | 未发现匹配 | 检查 364 个文本文件中的私钥、GitHub / 支付 / AWS key 与常见凭证赋值格式；不等于覆盖所有凭证类型或证明二进制图片不含个人资料。 |

七个业务脚本共 148 个具名检查通过。它们使用隔离进程、本地适配器或请求上下文替身，不代表浏览器、外部系统或真实支付验收。

## GitHub 入库状态与其他注意项

| 项目 | 现状 |
| --- | --- |
| Git 历史 | 当前 `main` 尚无提交，未配置 remote；审查开始时 454 个待入库文件。 |
| 已忽略产物 | `node_modules/`、`.next/`、`.next-dev/`、`.local-preview/` 已被 Git 忽略。 |
| 环境变量 | 当前忽略规则只有 `.env*.local`，不覆盖 `.env`、`.env.production`；本次待入库文件中没有这些文件。正式接入密钥前应补齐忽略规则并保留无真实凭证的示例配置。 |
| 公开仓库边界 | README、AGENTS.md 和内部审查材料含品牌关系、系统边界及接口资料。建议当前使用私有仓库；若选择公开，应先整理对外可披露内容。 |
| 框架基线 | 项目规则写 Next.js 16，清单实际为 Next.js 15，且 ESLint 配套为 16。版本基线存在偏差；应明确目标版本并统一配套，不能把此次构建通过写为“已符合 Next.js 16”。 |
| 站点域名 | `landing-seo.ts:13` 固定正式域名，其他 SEO 入口支持 `NEXT_PUBLIC_SITE_URL`。换域名部署时会出现 canonical / hreflang / sitemap 不一致，应统一配置来源。 |

## 人工验收清单：全部待确认

本次未运行 Playwright，也未代替人点击验收。所有操作至少覆盖 PC 1440×900、H5 390×844，并覆盖 en、zh、ja、es、ko。以下地址以已有本地预览 `http://localhost:4000` 为例；本次未启动或重启预览服务。

| 页面或入口 | 操作步骤 | 预期结果 |
| --- | --- | --- |
| `/{lang}/rent?pickup=Tokyo&pickupStoreCode=KLDJ01` | 修改日期，切换语言；再选择车辆与保障、设备 | 地点、日期及已确认的选择保持一致；当前 F3 待修复。 |
| `/{lang}/book/driver?rateDetailsId={有效费率ID}`（从费率页进入以携带完整参数） | 填写驾驶人，切换语言；返回、刷新及提交 | 不静默丢失搜索和费率；未提交资料按明确行为保留或提示。 |
| `/{lang}/checkout/{confirmationCode}` | 修改联系邮箱并完成本地付款；查看订单、刷新 | 邮箱信息按最终业务规则一致；当前 F5 待修复。使用测试资料。 |
| `/{lang}/locations` | 打开地图、筛选地点、点击标记和预订入口 | 地图正常加载，门店与预订入口一致，H5 无操作遮挡。 |
| `/{lang}/help`、`/{lang}/about` | 打开非英语页面并检查页面源代码、键盘和读屏 | 初始 HTML 文档语言与路由一致；当前 F4 待修复。 |
| 搜索 → 费率 → 驾驶人 → 付款 → 查单 → 取消 | 测试重复提交、弱网、刷新、多标签页和超时恢复 | 权限、订单、金额、付款及退款状态一致；H5 主操作可见。 |
| `/{lang}/account` 及认证入口 | 注册、登录、退出、常用旅客和联系方式操作 | 五语言错误与空状态正确，跨账户不泄露信息；生产集成另验。 |

建议首次正式推送的最低门槛是 F1、F2 修复后全新安装可构建、仓库 lint 可执行，并在仓库说明中保留原型与生产能力边界。F3–F5 应在对应用户流程交付前修复并完成上述人工确认。
