# 车行加盟：FleetEdge 系统介绍与合作入口

## 内容与入口

参考项目：`/Users/admin/Documents/ChatGPT/IX OFFICIAL SITE`，包括 `FranchisePage.tsx`、`FranchiseFAQ.tsx`、`Partners.tsx` 与 `app/api/franchise-applications/route.ts`。

| 内容 | TrustGo 落地 |
| --- | --- |
| FleetEdge 系统介绍 | 首屏以渠道 → FleetEdge → 门店营运的能力示意为核心；介绍车队、预订、合同、人员、渠道与会员管理 |
| 合作支持 | 渠道接入、TrustGo 品牌合作、系统培训与营运支援 |
| 平台合作伙伴 | 使用现有 10 个本地 logo 与平台官网链接；中性色稳定列表，不依赖 Hover 获取内容 |
| 加盟路径 | 介绍车行 → 洽谈方案 → 系统配置与培训 → 准备上线；不承诺固定时效与收益 |
| 合作申请 | 首屏直达页内表单，收集联系人、公司、邮箱与选填说明；提交同意与隐私链接独立可操作 |
| 既有商户 | 首屏、表单旁与 Footer 提供已确认的 FleetEdge 商户入口 |
| 咨询与疑问 | 4 条常见问题，保留邮件、WhatsApp、微信与门店入口 |

保留 TrustGo 的 Design Tokens、中性色、留白与响应式规则。未沿用原页的渐变装饰、实时状态、未经核实的利用率／收益数字或固定响应时效。

## 表单服务配置

沿用 IX 的服务端转发模式，未从其他项目复制任何密钥。浏览器只 POST 本站 `/api/franchise-applications`；传输测试全部使用替身，不发送实际咨询。

| 服务端变量 | 作用 |
| --- | --- |
| `PARTNERSHIP_API_URL` | 合作咨询接收服务的 HTTPS 地址；未配置时返回 503，页面保留输入并指向直接联系渠道 |
| `PARTNERSHIP_API_TOKEN` | 可选的服务端 Bearer token，不进入浏览器 |
| `PARTNERSHIP_PRODUCTION_READY=true` | 仅在接收方的数据用途、授权、访问权限、留存／删除、跨境要求、共享限流、幂等和审计确认后启用生产投递；默认关闭 |

接收协议：JSON `contactName`、`company`、`email`、`help`、`consent`、`lang`，加 `source: trustgo` 和 `submittedAt`；`Idempotency-Key` 传至接收方。只有 HTTP 成功且响应 JSON 含 `accepted: true` 才确认受理。使用其他响应结构时，应在 `src/integrations/partnership/submit-enquiry.ts` 适配真实协议。

本站不保存申请正文、不记录个人信息或密钥；仅保留有时限的摘要与受理状态用于进程内去重，并提供本地限流。生产多实例的持久幂等、共享滥用防护、访问审计与申请生命周期由接收服务承担，可信反向代理须覆盖来源 IP 头。未验证上述条件时不能仅设置生产开关上线。

## 人工验证（均待确认）

页面：`http://localhost:4000/{en,zh,ja,es,ko}/franchise`。桌面 1440 × 900，Tablet 768 × 1024，H5 / MWEB 375 × 812（补查 320px 宽度）。

| 验证点 | 操作 | 预期结果 | 状态 |
| --- | --- | --- | --- |
| 首屏与响应式 | 在各视口打开页面 | 主题为系统与合作；主操作直接可见；示意、logo 与长文案无页面横向溢出 | 待人工确认 |
| 申请入口 | 点击首屏“申请加盟合作” | 到达页内表单，标题不被 Header 遮挡 | 待人工确认 |
| 商户入口 | 点击首屏、表单旁与 Footer 的商户登录 | 进入既有 `merchant.ixrentacar.com/vue/homePage`；首屏和表单旁保留原页面 | 待人工确认 |
| 系统内容 | 使用“了解 FleetEdge 系统”，展开全部 FAQ | 能读到系统、渠道、支持与接入规则；触屏不依赖 Hover | 待人工确认 |
| 品牌平台 | 逐一点击 10 个平台 logo | 对应官网在新标签页打开；logo 可辨识，读屏含新标签页提示 | 待人工确认 |
| 必填校验 | 空表单提交；填错邮箱；不勾选同意 | 字段旁错误提示，焦点到第一个问题字段，无网络提交 | 待人工确认 |
| 失败恢复 | 当前未配置接收服务时，用测试资料提交 | 显示线下联系提示；保留输入；无成功提示，可重试及直接联系 | 待人工确认 |
| 提交中与成功 | 仅在已配置的测试接收服务上提交非个人测试资料 | 提交期间禁用字段与按钮，阻止重复请求；明确受理后清空并显示成功 | 待人工确认，依赖测试接收服务 |
| 隐私与输入 | 点击隐私链接，返回表单；H5 聚焦输入和备注 | 政策在当前语言路由，点击链接不改变同意；软键盘不遮挡字段，可自然滚动 | 待人工确认 |
| 键盘与无障碍 | Tab / Shift+Tab / Enter 操作入口、表单、FAQ | 焦点可见；Label、错误关联与反馈可读，FAQ 可原生键盘展开 | 待人工确认 |
| 五语言 | 切换全部支持语言重复以上步骤 | 正文、SEO、表单与反馈对应语言，无翻译 key 裸露或关键内容截断 | 待人工确认 |
| 租车链路回归 | 各端从主导航搜索车辆，打开费率详情，再进入驾驶人信息 | 搜索、费率详情与后续预订导航规则正常 | 待人工确认 |

## 自动验证

- `npm run check:i18n`：五语言 key 对齐。
- `npx tsc --noEmit`：通过。
- 修改的 TS / TSX 与 i18n 脚本定向 ESLint：通过。仓库 ESLint 对 `.cjs` 存在既有 `react-hooks` 插件作用域错误，新增回归脚本已通过 Node 语法检查并实际执行。
- `node scripts/test-partnership.cjs`：7 组接口回归通过，覆盖输入、来源、超长与错误请求、同意、限流、并发幂等、接收失败、配置缺失、生产保护与重试；无外部投递。
- `npm run build`：通过，新增接口为动态服务端路由，加盟页五语言静态生成；构建保留其他模块的既有 lint 警告，本次新增与修改的 TS / TSX 定向检查无警告。
- 最终五语言 HTML：唯一 title / H1、含 FleetEdge 的 description、canonical、五语言与 x-default hreflang、index / follow 均正确；系统正文、表单、4 条 FAQ、10 个 logo、3 处商户入口与锚点存在，无未解析文案 key 或原车辆 Hero。
- 最终 sitemap 包含五语言加盟地址；隐私页产物、租车与门店路由及本地 logo 资源存在。
- `npm run preview` 复用健康服务，未启动第二个服务；`http://localhost:4000/zh/franchise` 返回 HTTP 200，确认输出新版系统介绍与表单。日志：`.local-preview/server-4000.log`。

HTTP 与源码检查不替代浏览器验收；未由 Agent 运行 Playwright。
