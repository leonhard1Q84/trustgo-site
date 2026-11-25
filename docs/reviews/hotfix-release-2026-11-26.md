# Hotfix 发布验证记录

日期：2026-11-26（Asia/Shanghai）。

本次发布包含工作区的搜索筛选与车型卡片、驾驶人和联系人回填、费率政策展示、加盟页、五语言文案及配套设计规范更新。按用户授权直接同步 GitHub `origin/main` 与 Codeup `codeup/main`；两个远端默认分支均为 `main`。Codeup 同时补齐原先落后的 `459e4c2` 和 `fcd3a07` 两条演示环境修复。

部署目标为既有 Vercel `trustgo` 项目，生产分支为 GitHub `main`，访问域名为 <https://trustgo-rental.vercel.app>。沿用已有演示环境配置；本记录不代表正式接单能力验收。

## 已完成的自动检查

| 检查 | 结果 |
| --- | --- |
| `npm run build` | 通过；仍存在非阻断 lint 警告 |
| `npm run check:i18n` | 通过；EN / ZH / JA / ES / KO 共 1715 个 key 对齐 |
| `npm run check:build` | 通过；每种语言 68 个 HTML 页面，130 个重定向保留语言 |
| `npm run test:rental-business` | 54 项通过 |
| `npm run test:customer-account` | 33 项通过 |
| `npm run test:site-navigation` | 7 项通过 |
| `node scripts/test-franchise-i18n.cjs` | 五语言页面与表单检查通过；表单使用替代传输，未发送外部消息 |
| 加盟页最终构建 HTML | 五语言 title、description、canonical、hreflang、单一 H1 与独立品牌展示检查通过 |
| `git diff --check` 与改动代码文件行数 | 通过；改动代码文件均少于 2000 行 |

## 人工点击验收

以下全部为**待人工确认**。自动检查与部署 HTTP 响应不能代替浏览器交互验收；未运行 Playwright。

每项覆盖 PC 1440×900、Tablet 820×1180、H5 / MWEB 390×844，以及 `en / zh / ja / es / ko` 五种语言。语言路径中的 `zh` 分别替换为其他语言代码。

| 页面 URL / 入口 | 操作步骤 | 预期结果 | 状态 |
| --- | --- | --- | --- |
| <https://trustgo-rental.vercel.app/zh/rent> | 选择未来有效的取还车时间并搜索；选择车型组、快捷筛选及更多筛选，切换排序并清除筛选 | 筛选结果、数量、门店报价与排序一致；清除后恢复对应结果；无结果时可恢复搜索 | 待人工确认 |
| 同上，搜索结果中的车辆费率入口 | PC / Tablet 与 H5 分别选择车辆；核对费率政策、保障与价格 | PC / Tablet 在新标签页打开并提供读屏提示；H5 在当前页打开；费率信息与所选报价一致 | 待人工确认 |
| 费率详情 → `/{lang}/book/driver?rateDetailsId=…` | 以访客身份进入，填写驾驶人、联系方式与附加设备，检查创建账户选项，再继续结算 | 必填校验准确；驾驶人信息与金额正确传入；预订链路在当前标签页流转；H5 主操作始终可见 | 待人工确认 |
| <https://trustgo-rental.vercel.app/zh/account> → 搜索 → 费率详情 → 驾驶人信息 | 登录具有个人资料、常用驾驶人和联系人的演示账户；分别选择回填项，切换为手动填写并修改 | 显示当前账户可用资料，选中资料正确回填，支持手动编辑；未登录时不显示账户资料 | 待人工确认 |
| 驾驶人信息 → 结算 → 订单详情 | 使用演示资料完成预订和演示支付，核对订单，再取消预订 | 行程、驾驶人、费用与订单状态一致；取消政策与退款展示正确；不产生真实付款 | 待人工确认 |
| <https://trustgo-rental.vercel.app/zh/franchise> | 查看首屏、FleetEdge 展示和合作能力；展开 FAQ、打开并关闭合作表单，切换语言 | 内容、图示与表单在各视口可读可操作；无横向溢出、遮挡或未翻译 key；未提交前不发送合作申请 | 待人工确认 |

人工完成后在对应行记录实际视口、语言及结果；未执行项继续保持待确认。
