# 注册与登录业务逻辑审查

日期：2026-10-27。对照项目：`/Users/admin/Documents/ChatGPT/IX OFFICIAL SITE`。

本文保留修复前的审查证据；后续实现与验证状态见[修复记录](customer-account-repair-2026-10-27.md)。

本次只审查业务逻辑，未修改 UI、业务代码、接口或 IX 项目。下文的 P1 表示账户安全或生产能力阻断问题，P2 表示应修复的流程或状态问题。

## 结论

模块划分和账户模型与 IX 基本一致，主动注册、密码登录、首次设置密码、忘记密码、会话和结算建账的职责划分成立。但当前实现不能判定为逻辑校验通过，也不能直接作为生产账户能力上线。

TrustGo 的统一认证入口存在注册状态入口和请求号降级问题，预订链路没有接入结算建账。账户存储、邮件、鉴权返回、验证码和退出处理还继承了 IX 的缺陷；不能把“与 IX 相同”作为正确性依据。

## 与 IX 一致且合理的规则

| 场景 | 当前规则 | 校验结果 |
| --- | --- | --- |
| 主动注册 | 新邮箱设置密码、记录法律版本，成功后创建会话；不强制前置邮箱验证码 | 接口调用通过；符合 IX 的业务决策 |
| 已有邮箱再次注册 | 不覆盖原密码；已有密码引导登录，无密码引导邮箱验证 | 接口调用通过 |
| 密码登录 | 服务端校验密码，正确后生成随机会话；Cookie 使用 HttpOnly、SameSite=Lax，生产启用 Secure | 核心校验成立 |
| 结算建账账户 | 初始密码状态为 not_set；建账本身不建立登录会话 | 接口调用通过；建账与登录应保持独立 |
| 设置密码 | 邮箱验证码成功后设置密码、标记邮箱验证完成并建立会话 | 正向逻辑成立；异常顺序见 R07 |
| 营销同意 | 默认关闭，不随注册自动开启 | 与 IX 一致 |
| 订单归属 | 当前租车适配层按服务端账户 / 访客授权判断，不因邮箱相同就批量赋予订单访问权 | 边界合理；不能把建账成功等同于历史订单自动关联 |

参考：IX 的 `specs/customer-account/customer-account-registration-and-guest-booking-linking-spec.md`、`src/modules/customer-account/`、`app/api/account/`、`src/server/customerAccount*.ts` 和结算调用点。该 SPEC 部分段落对建账触发时点存在差异；IX 当前代码在支付启动路径中异步调用建账。本次不把某个未经确认的精确支付时点认定为 TrustGo 的既定需求，R06 只认定其尚未接入。

## 发现的问题

### R01 · P1：可预测的注册请求号可以被用来获取账户会话

- 来源：TrustGo 新增的降级请求号，叠加 IX 已有的注册重放逻辑。
- 位置：[AuthUnifiedCard.tsx](../../src/modules/customer-account/ui/AuthUnifiedCard.tsx#L179)、[customerAccountStore.ts](../../src/server/customerAccountStore.ts#L248)、[registrations/route.ts](../../src/app/api/account/registrations/route.ts#L95)。
- 当 `crypto.randomUUID` 不可用时，请求号退化为 `acct_req_` 加邮箱长度。已通过该路径建账后，只要知道邮箱，就能推算原请求号。
- 服务端只检查重放请求的邮箱是否相同，不验证提交密码是否与原账户一致，随后仍签发新会话。已在隔离进程复现：原密码 A 注册，再使用相同邮箱和请求号、不同密码 B，仍返回成功和登录 Cookie，而 B 实际不是账户密码。
- 修正原则：幂等标识不能充当登录凭证。重放时的会话签发必须有独立、可信的认证或原始请求绑定；请求号应不可预测，也应按同一动作稳定复用。当前前端每次提交都生成新号，还会导致响应丢失后的重试变成“邮箱已存在”。

### R02 · P1：未登录调用建账接口可获取已有账户资料

- 来源：IX 继承问题。
- 位置：[checkout-creation/route.ts](../../src/app/api/account/checkout-creation/route.ts#L55)、[customerAccountStore.ts](../../src/server/customerAccountStore.ts#L108)、[sign-in/route.ts](../../src/app/api/account/sign-in/route.ts#L40)。
- `/api/account/checkout-creation` 不要求登录或可信预订凭据，接受浏览器提交的任意邮箱；复用已有账户后，将 `toPublicProfile` 整体返回，其中包含 `profile`。已用合成账户复现：未提供 Cookie 或密码，仍返回账户姓名和测试电话资料。
- 密码登录接口在 `PASSWORD_NOT_SET` 分支也会在未完成身份验证时返回整个账户资料。
- 修正原则：建账结果只返回业务必需的最小结果；账户资料必须在完成鉴权后读取。结算邮箱与同意记录应从可信预订上下文取得，不能仅信任浏览器提交值。

### R03 · P1：账户与会话只保存在进程内存中

- 来源：IX 继承问题。
- 位置：[customerAccountStore.ts](../../src/server/customerAccountStore.ts#L35)。
- 账户、密码散列、会话、验证码、限流和幂等记录都是 Map，没有持久化 adapter；开发环境的 globalThis 仅帮助热更新保留数据，不能解决重启和多实例问题。
- 重启后账户丢失，多实例之间也可能出现“刚注册却查不到账户”或会话无效。生产路径没有像租车本地适配层那样拒绝未配置真实服务的请求。
- 修正原则：通过可信账户服务和共享持久化存储实现唯一性、事务、会话、幂等与限流；未配置时不能向客户承诺真实注册成功。

### R04 · P1：验证码和账户通知没有实际邮件投递

- 来源：IX 继承问题。
- 位置：[customerAccountNotifications.ts](../../src/server/customerAccountNotifications.ts#L55)、[sign-in/challenges/route.ts](../../src/app/api/account/sign-in/challenges/route.ts#L49)。
- 通知函数仅保存脱敏事件元数据，状态固定为 `awaiting_external_provider`；没有 provider、投递 worker，也没有保留可供后续安全投递的收件地址和验证码载荷。接口却返回“已发送”。
- 开发环境通过 `dev_code` 可以完成流程；生产不返回该值，因此首次设置密码和找回密码无法闭环。主动注册通知同样不会实际发送。
- 修正原则：接入真实邮件服务及可重试的安全投递机制，并让接口状态反映真实的投递受理结果。

### R05 · P2：独立注册页进入了缺少邮箱的注册状态

- 来源：TrustGo 新增偏差。
- 位置：[RegisterClientView.tsx](../../src/modules/customer-account/ui/RegisterClientView.tsx#L15)、[AuthUnifiedCard.tsx](../../src/modules/customer-account/ui/AuthUnifiedCard.tsx#L53)。
- `/[lang]/account/register` 直接传入 `initialView="register"`，没有传入邮箱。组件邮箱初始为空，注册状态只展示邮箱摘要与密码输入，提交逻辑也没有补做邮箱校验，最终以空邮箱请求服务端并得到 `INVALID_EMAIL`。
- 用户只能退回邮箱步骤后再手动切回注册；IX 原注册表单会收集并校验邮箱。
- 修正原则：进入注册状态必须已有有效邮箱；直接访问注册 URL 也必须能完成同一业务流程。可修正状态初始化与流转，保持现有视觉设计。

### R06 · P2：结算建账只有接口和组件，没有接入实际预订流程

- 来源：TrustGo 相对 IX 的能力缺口。
- 位置：[DriverBookingView.tsx](../../src/app/[lang]/book/driver/DriverBookingView.tsx#L81)、[CheckoutCashierView.tsx](../../src/app/[lang]/checkout/[reservationId]/CheckoutCashierView.tsx#L45)、[customerAccountService.ts](../../src/modules/customer-account/application/customerAccountService.ts#L145)。
- 全仓调用检索未发现预订页面调用 `createCheckoutAccount`，也没有传递 `create_account_requested`、法律版本与建账幂等键。现有 `AccountCreationCheckoutSection` 未接入。
- IX 的驾驶人流程会保存建账选择，`CheckoutPage.tsx:1279` 在支付路径中异步调用账户服务。TrustGo 的访客完成预订和支付后不会通过该流程创建账户。
- 修正原则：若沿用 IX 的结算建账能力，须从预订上下文传递已确认的建账选择与同意版本，按明确业务触发点处理，失败不阻断支付。不能因为已有接口就宣称流程已完成；本次不新增 UI 或默认替客户同意。

### R07 · P2：密码校验失败会提前消耗正确验证码

- 来源：IX 继承问题。
- 位置：[sign-in/verify/route.ts](../../src/app/api/account/sign-in/verify/route.ts#L33)、[customerAccountStore.ts](../../src/server/customerAccountStore.ts#L400)。
- 接口先验证并删除验证码，再检查新密码及确认密码。已复现：正确验证码加无效新密码返回 `INVALID_PASSWORD`；修正密码后用原验证码重试返回 `NOT_FOUND`。
- 修正原则：先校验请求与密码，再在可信服务端原子完成验证码消费和密码更新。验证码用途还应由端点强制限定，不能依赖调用方可选的 `purpose` 参数；首次设密也应检查账户仍为 not_set。

### R08 · P2：退出失败被前端当作退出成功

- 来源：IX 继承问题。
- 位置：[AuthContext.tsx](../../src/modules/customer-account/application/AuthContext.tsx#L83)、[customerAccountService.ts](../../src/modules/customer-account/application/customerAccountService.ts#L129)。
- Service 在网络失败或服务端失败时返回 `success: false`，Context 不检查结果，仍清空用户。账户页随后导航回首页，服务端会话与 Cookie 可能仍有效，刷新后重新呈现登录状态。
- 修正原则：确认服务端撤销成功后再报告退出成功；失败应保留可重试状态。TrustGo 已额外清理租车访问 Cookie，这一点正确，但不能弥补前端忽略失败。

### R09 · P2：账户认证缺少完整的限流与滥用防护

- 来源：IX 继承问题。
- 位置：[sign-in/route.ts](../../src/app/api/account/sign-in/route.ts#L9)、[registrations/route.ts](../../src/app/api/account/registrations/route.ts#L15)、[customerAccountStore.ts](../../src/server/customerAccountStore.ts#L339)。
- 密码登录和注册没有接入服务端限流；租车 API 的 `checkRentalRequest` 不覆盖账户接口。
- 验证码有 60 秒重发间隔、10 分钟期限、单次挑战最多 5 次尝试，但账户查找将邮箱整体转小写，挑战限流键却保留邮箱本地部分大小写。已复现：同一账户将 `review@…` 改为 `Review@…`，可以立即再申请验证码，并创建独立挑战。验证码生成使用 `Math.random()`。
- 修正原则：账户查找、验证码绑定和限流使用一致的身份键；增加账户 / 来源维度的共享限流，使用密码学安全随机源。账户写接口还缺少明确的请求来源 / CSRF 校验，需要一并定义保护边界。

### R10 · P2：找回密码不会撤销旧登录会话

- 来源：IX 继承问题。
- 位置：[customerAccountStore.ts](../../src/server/customerAccountStore.ts#L304)、[sign-in/verify/route.ts](../../src/app/api/account/sign-in/verify/route.ts#L99)。
- 更新密码仅修改散列，随后建立新会话；没有销毁原会话或使用凭证版本使其失效。已验证更新密码后，旧会话仍可通过 `getSession`，最长持续至原 30 天期限。
- 修正原则：至少在密码找回成功后撤销旧会话并签发新会话，避免被盗会话继续访问。账户内正常修改密码是否保留当前设备，需要明确规则。

### R11 · P2：会话过期后，页面未及时清除原账户资料

- 来源：IX 继承问题。
- 位置：[AuthContext.tsx](../../src/modules/customer-account/application/AuthContext.tsx#L34)、[AccountProfilePage.tsx](../../src/modules/customer-account/ui/AccountProfilePage.tsx#L141)、[customerAccountService.ts](../../src/modules/customer-account/application/customerAccountService.ts#L213)。
- Context 主要在挂载或显式调用时刷新会话。账户资料接口返回 401 时，Service 返回 `AUTHENTICATED_REQUIRED`，页面直接 return，没有清空 Context、旅客和联系人状态或要求重新登录。
- 服务端仍会拒绝后续越权请求，但停留页面可能继续展示过期会话先前加载的个人资料，与 IX 的“会话过期清除资料”规则不符。
- 修正原则：统一处理账户接口 401，清除账户及相关敏感状态；页面恢复焦点等合适时机重新确认会话。

## 本次验证与限制

| 验证 | 结果 |
| --- | --- |
| 两项目账户模块、接口、存储与结算调用点静态对照 | 完成；来源已逐项注明 |
| 实际 Route Handler / Store 的隔离进程调用 | 完成；只用合成邮箱和资料，不访问网络，不写真实账户 |
| 正向接口断言 | 注册自动登录、已有邮箱不覆盖密码、错误密码拒绝、结算建账不自动登录均通过 |
| 缺陷复现断言 | R01、R02、R07、R09 的大小写绕过、R10 的旧会话保留均复现 |
| `npm run build` | 通过；有既存 ESLint 警告 |
| PC / H5、五语言浏览器交互 | 未执行，待人工确认；未使用 Playwright |
| 真实邮件、持久化账户服务、真实 FE / 支付联调 | 未验收，当前账户代码没有实现前两项 |

## 待人工确认的业务流程

以下页面均使用当前本地预览地址，语言替换为 `en`、`zh`、`ja`、`es`、`ko`；视口覆盖桌面 1440×900 和手机 390×844。全部标记为未确认，不能视为已通过。

| 页面 URL / 入口 | 操作步骤 | 应满足的业务结果 |
| --- | --- | --- |
| `/{lang}/account/register` | 直接访问，填写邮箱、密码、确认密码并提交；取消同意后再次提交 | 无需绕回登录才能填写邮箱；同意后才建账；成功建立会话 |
| `/{lang}/account/sign-in`、导航认证弹窗 | 使用已有密码账户登录；错误密码重试；关闭后重新打开 | 密码正确才登录；关闭和重开不恢复不应保留的密码与验证码 |
| 同上 | 使用结算建账且未设密码账户完成邮箱验证和首次设密 | 验证邮箱后才设置密码并登录；不能用任意密码直接取得会话 |
| 同上 | 忘记密码、重发验证码、提交错误码 / 过期码、修正不合规密码 | 错误可恢复；重发使旧码失效；正确验证码不因密码格式错误提前消耗 |
| `/{lang}/book/driver` → `/{lang}/checkout/{reservationId}` | 访客分别保留 / 取消建账选择并支付；注入建账失败 | 按实际同意执行；取消不建账；账户失败不阻断订单或支付 |
| `/{lang}/account`、导航退出 | 会话失效后继续操作；模拟退出网络失败；退出成功后刷新和后退 | 过期清除资料；失败不报告退出成功；成功后服务端会话撤销 |

