# Trip.com Overseas Car Rental Integration Document
# Trip.com 海外租车对接文档

**Version:** 1.2.1
**版本:** 1.2.1

## Servers
**服务器**

- **https://apiproxy.ctrip.com/apiproxy/soa2/34517/json/**: Production environment server
  生产环境服务器
- **https://apiproxy-uat.ctripqa.com/apiproxy/soa2/34517/json/**: Test environment server
  测试环境服务器

## General Information
**基本信息**

### Version Notes
**版本说明**


| Version | Illustrate | Location | Modified Date |
| :----- | :---- | :---- | :----: |
| 1.0.1 | The functions available within this version of OpenAPI are:1. API and document overall introduction; 2. Search or obtain static information like locations, rules, vehicles and rates; 3. Search for availability of vehicles for a booking request; 4. Create a quote or a booking and search for booking status.<br>此版本 OpenAPI 可用功能包括：1. API 和文档总体介绍；2. 搜索或获取静态信息，如位置、规则、车辆和费率；3. 搜索预订请求的车辆可用性；4. 创建报价或预订并搜索预订状态。|  all  | 2024-03-18 |
| 1.1.1 | Function expansion:OpenAPI can support the business scenario of car delivery and deposit free products.Car delivery basic concept:Guest do not need to arrive store to pick up the car, the store can provide car delivery service to guests location.'Deposit free' business concept: Through the relevant credit system of Trip.com, customers do not need to pay for deposit when pick up. Trip.com will guarantee the reservation, and the deductions can also be achieved through the interface.<br>功能扩展：OpenAPI 可支持送车上门和免押金产品的业务场景。<br>送车上门基本概念：客人无需到达门店取车，门店可提供送车至客人指定地点的服务。<br>“免押金”业务概念：通过 Trip.com 的相关信用体系，客户取车时无需支付押金。Trip.com 将担保预订，扣款也可通过接口实现。|  LocationDetailsSearch,vehAvailRate,vehRateRule,vehRes  | 2025-07-14 |
| 1.2.1 |  Major updates in this version: 1. Add OpenAPI SDK to help suppliers accelerate development; 2. Added sandbox testing phase between supplier internal testing and Trip.com intervention for smoother testing; 3. Added sandbox tool introduction and Supplier Sandbox Integration Process Demo for better developer experience. 4. Modified circleId data type from string to integer for better performance and consistency.<br>此版本主要更新：1. 增加 OpenAPI SDK 以帮助供应商加速开发；2. 在供应商内部测试和 Trip.com 介入之间增加了沙箱测试阶段，以便更顺畅地测试；3. 增加了沙箱工具介绍和供应商沙箱集成流程演示，以提供更好的开发者体验。4. 将 circleId 数据类型从字符串修改为整数，以获得更好的性能和一致性。 |  all  | 2025-11-5 |


### Cooperation Method
**合作方式**

If you have an interest in matching with Trip.com Overseas Car Rental Team, please contact our business team via email: hwzcbd@trip.com.
如果您有兴趣与 Trip.com 海外租车团队合作，请通过电子邮件联系我们的商务团队：hwzcbd@trip.com。

### Integration Process
**集成流程**



![avatar](https://file.tripcdn.com/files/6/carrental/0HM4z12000pkhz4h94806.png)

The above outlines the overall integration process. If you need to integrate the deposit-free and car delivery functions, please read
以上概述了整体集成流程。如果您需要集成免押金和送车上门功能，请阅读

- [Function Introduction of Deposit-Free&Car Delivery](https://file.tripcdn.com/files/6/carrental/0HM5o12000qd4gmy5A38D.pdf)
- [免押金和送车上门功能介绍](https://file.tripcdn.com/files/6/carrental/0HM5o12000qd4gmy5A38D.pdf)

### Download SDK
**下载 SDK**

Trip.com provides OpenAPI SDK to help partners quickly integrate with our car rental system. If your language version is missing, you can email CarVendorConnectTech@trip.com. 
Trip.com 提供 OpenAPI SDK 以帮助合作伙伴快速集成我们的租车系统。如果缺少您的语言版本，您可以发送电子邮件至 CarVendorConnectTech@trip.com。

 SDK Feature Items:
 SDK 功能项：

 - Data Model
 - 数据模型

     1.Predefined data models and enum classes
     1. 预定义的数据模型和枚举类

   2.Validation of required fields in data models
   2. 数据模型中必填字段的验证

- Authentication
- 认证

  1.Signature generation tools
  1. 签名生成工具

- Exception Handling
- 异常处理

    1.Missing field prompts
    1. 缺少字段提示

     2.Error code standardization
     2. 错误代码标准化

**Download Resources:**
**下载资源：**
- [Trip.com OpenAPI SDK v1.0.2 (Java)](https://file.tripcdn.com/files/8/carrental/car-osd-openapi-sdk-1.0.2.zip)

- [Trip.com OpenAPI SDK v1.0.2 (NodeJS)](https://file.tripcdn.com/files/8/carrental/osd-openapi-sdk-nodejs-1.0.2.zip )

### Sandbox Tools
**沙箱工具**

Supplier Sandbox Integration Process:
供应商沙箱集成流程：

The sandbox environment allows suppliers to test integration before connecting to production systems.
沙箱环境允许供应商在连接生产系统之前测试集成。

**Download Resources:**
**下载资源：**
- [Supplier Sandbox Integration Process Demo ](https://docs.c-ctrip.com/files/6/carrental/0HM0d12000q0n5lzy5BCE.pdf)
- [供应商沙箱集成流程演示](https://docs.c-ctrip.com/files/6/carrental/0HM0d12000q0n5lzy5BCE.pdf)


### API Authentication
**API 认证**


All API requests require authorization authentication. The account password is provided by Trip.com to the vendor for accessing the system. The password is encrypted using SHA256 and placed in the request body. It is recommended that vendors verify timestamps and block requests older than half an hour.
所有 API 请求都需要授权认证。账号密码由 Trip.com 提供给供应商用于访问系统。密码使用 SHA256 加密并放置在请求体中。建议供应商验证时间戳并阻止超过半小时的请求。

1. Field description:
1. 字段描述：

| Field Name | Type | Sample | Description |
| :----- | :---- | :---- | :----: |
| username | String | “*&%avis#” | Agreed by both parties (supplier can customize)<br>双方约定（供应商可自定义） |
| password | String | “bcf05946e3f92dcae81” | Agreed by both parties (supplier can customize)<br>双方约定（供应商可自定义） |
| timestamp | Long | “1716867831874” | Beijing time timestamp(UTC+8)<br>北京时间时间戳(UTC+8) |
| sign | String | “e8dcc92c7ab63f5838ec5044364d24295e10d7fedc944a1397c9a50b1c5bbe9e” | Account name:password concatenated by colon and be encrypted by Sha 256<br>账号名:密码 用冒号拼接后进行 SHA256 加密 |

2. Sign generation：
2. 签名生成：

```java
import com.google.common.hash.Hashing;

public class SHA256Example {
    public static void main(String[] args) {
        long timestamp = System.currentTimeMillis();//1716867831874
        String input = \"*&%avis#:bcf05946e3f92dcae81\"+timestamp;;
        String hexHash = Hashing.sha256().hashBytes(input.getBytes()).toString();
        System.out.println(\"SHA256 hash of \\\"\" + input + \"\\\": \" + hexHash);//e8dcc92c7ab63f5838ec5044364d24295e10d7fedc944a1397c9a50b1c5bbe9e
    }
}
```

3. Sign's Validation Location:
3. 签名验证位置：

 Validation fields (including at least sign) need to be placed in the request body. 
 验证字段（至少包含 sign）需要放置在请求体中。

4. Sample:
4. 示例：

```java
POS pos = new POS();
    pos.setTimestamp(timestamp);
    pos.setSign(\"xxx\");
```

### AES256 Encrypt/Decrypt
**AES256 加密/解密**

All APIs that require AES256 encryption should be encrypted and decrypted as follows.
所有需要 AES256 加密的 API 都应按如下方式进行加密和解密。

1. User name: 
1. 用户名：
Partners and Trip.com need to get an user name for authentication verification when they call both sides’ APIs. The user name used for the Trip.com to call partner’s APIs can be set by the partner on Trip.com’s open platform, or obtained by consulting the Trip.com account manager.
合作伙伴和 Trip.com 需要获取用户名以在调用双方 API 时进行身份验证。Trip.com 调用合作伙伴 API 所使用的用户名可以由合作伙伴在 Trip.com 开放平台上设置，或咨询 Trip.com 客户经理获取。

2. Generate key and iv: The user name should be encrypted via MD5 to generate a secret key with a length of 32. Use the last 16 bits of the key as iv, and use the AES/CBC/PKCS5Padding algorithm at the same time.
2. 生成 key 和 iv：用户名应通过 MD5 加密生成长度为 32 的密钥。使用密钥的后 16 位作为 iv，同时使用 AES/CBC/PKCS5Padding 算法。

3. Sensitive fields encrypted by AES256: Use the key and iv above to encrypt sensitive fields via AES256, generating corresponding byte array, and then use base64 to encrypt the byte array.
3. AES256 加密敏感字段：使用上述 key 和 iv 通过 AES256 加密敏感字段，生成相应的字节数组，然后使用 base64 加密字节数组。

4. Sensitive fields decrypted by AES256: Partners can use base64 to decrypt cipher text first, then decrypt via the generated key and iv above.
4. AES256 解密敏感字段：合作伙伴可以先使用 base64 解密密文，然后通过上述生成的 key 和 iv 进行解密。


Encrypt Pseudocode (for reference only)
加密伪代码（仅供参考）
```java
// The user name for authentication between partner and the Trip.com
String authUser = \"*&%avis#:bcf05946e3f92dcae81\";
// Encrypt the user name by MD5 (32-bit lowercase)
String key = Md5Helper.getMd5Value(authUser.getBytes(Charset.forName(\"UTF-8\")));
// Use the last 16 bits of the key as iv
String iv = key.substring(key.length() - 16);
// Take the phone number as an example. Note: the phone number is the data without masking.
String mobile = \"13800000000\";
// aes encryption (Use base64 to convert byte arry into string)
String result = AesFactory.getInstance().encrypt(mobile, key, iv);
```

Decrypt Pseudocode (for reference only)
解密伪代码（仅供参考）
```java
// The user name for authentication between partner and the Trip.com
String authUser = \"*&%avis#:bcf05946e3f92dcae81\";
// Encrypt the user name by MD5 (32-bit lowercase)
String key = Md5Helper.getMd5Value(authUser.getBytes(Charset.forName(\"UTF-8\")));
// Use the last 16 bits of the key as iv
String iv = key.substring(key.length() - 16);
// The cipher text encrypted by aes
String security = \"U2FsdGVkX1/RBz/8otFRYe5NJTJXZ0wj767R6GO5tts=\";
//aes decryption (use base64 to convert cipher text into byte array)
String result = AesFactory.getInstance().decrypt(security, key, iv);
```

### API Overall Introduction
**API 总体介绍**



![avatar](https://ak-d.tripcdn.com/images/1iz3k12000dr1c2vz535F.png)


### Data Interaction
**数据交互**

Use HTTP standard POST protocol, Content Type is application/json; charset=utf-8, one url for each API. 
使用 HTTP 标准 POST 协议，Content Type 为 application/json; charset=utf-8，每个 API 一个 URL。

API Time Requirements:
API 时间要求：

1. Core APIs: 99 lines within 1s;
1. 核心 API：99% 请求在 1 秒内；

2. Batch APIs: 95 lines within 5s;
2. 批量 API：95% 请求在 5 秒内；

API Exception Requirements:
API 异常要求：

1. When Trip.com requests the vendor's API with exception or timeout, Trip.com will make 3 consecutive requests, and the vendor should return the same result in the same batch of requests. E.g. The first time Trip.com sends a booking request to the vendor with the OrderID xxx. The vendor returns a 'Timeout' for this request. Trip.com will send the booking request with the same orderID and order details again. Please consider these two requests as booking retries, not two different booking requests, in case the vendor from creating multiple different orders internally.
1. 当 Trip.com 请求供应商 API 出现异常或超时时，Trip.com 会连续发起 3 次请求，供应商应在同一批请求中返回相同的结果。例如，第一次 Trip.com 向供应商发送带有 OrderID xxx 的预订请求。供应商返回“超时”。Trip.com 将再次发送带有相同 orderID 和订单详情的预订请求。请将这两个请求视为预订重试，而不是两个不同的预订请求，以防供应商内部创建多个不同的订单。

2. When the vendor requesting Trip.com API does not receive a response from Trip.com due to network timeout or other reasons, the vendor should retry requesting Trip.com API with the same message.
2. 当供应商请求 Trip.com API 因网络超时或其他原因未收到 Trip.com 响应时，供应商应使用相同的报文重试请求 Trip.com API。

### API provided by Overseas Vendors
**由海外供应商提供的 API**

Suppliers need to provide API for Trip.com to call according to the interface definition. All interface response times must be controlled within 2 seconds to ensure efficient business processes and optimal user experience.
供应商需要根据接口定义提供 API 供 Trip.com 调用。所有接口响应时间必须控制在 2 秒以内，以确保高效的业务流程和最佳的用户体验。

### API provided by Trip.com
**由 Trip.com 提供的 API**

Trip.com needs to provide an interface for the supplier to call according to the interface definition
Trip.com 需要根据接口定义提供接口供供应商调用

### Enumeration Description
**枚举描述**


| CODE LIST NAME| CODE VALUE| CODE NAME |
| :----- | :---- | :---- |
|Rule Type<br>规则类型 | RUL |  |
|  | 1 | Cancel<br>取消 |
|  | 2 | Prepay<br>预付 |
|  | 3 | Deposit<br>押金 |
|  | 4 | Guarantee<br>担保 |
|Vehicle Category<br>车辆类别 | VEC | |
|  | 1 | Car/ sedan<br>轿车 |
|  | 2 | Van<br>面包车 |
|  | 3 | SUV<br>SUV |
|  | 4 | Convertible<br>敞篷车 |
|  | 5 | Truck<br>卡车 |
|  | 6 | Motorcycle<br>摩托车 |
|  | 7 | Limo<br>豪华轿车 |
|  | 8 | Station wagon<br>旅行车 |
|  | 9 | Pickup<br>皮卡 |
|  | 10 | Motorhome<br>房车 |
|  | 11 | All-Terrain<br>全地形车 |
|  | 12 | Recreational<br>休闲车 |
|  | 13 | Sport<br>跑车 |
|  | 14 | Special<br>特种车 |
|  | 15 | Extended cab pickup<br>加长驾驶室皮卡 |
|  | 16 | Regular cab pickup<br>普通驾驶室皮卡 |
|  | 17 | Special offer<br>特惠车 |
|  | 18 | Coupe<br>轿跑 |
|  | 19 | Monospace<br>单厢车 |
|  | 20 | 2 wheel vehicle<br>两轮车 |
|  | 21 | Roadster<br>双座敞篷车 |
|  | 22 | Crossover<br>跨界车 |
|  | 23 | Commercial van/truck<br>商用面包车/卡车 |
|  | 24 | Other<br>其他 |
|  | 25 | Coach<br>大巴 |
| Currency Type<br>货币类型 | CUR |  |
|  | CNY | Chinese Yuan<br>人民币 |
|  | AED | United Arab Emirates Dirham<br>阿联酋迪拉姆 |
|  | AZN | Azerbaijani Manat<br>阿塞拜疆马纳特 |
|  | AUD | Australian Dollar<br>澳元 |
|  | BHD | Bahraini Dinar<br>巴林第纳尔 |
|  | BRL | Brazilian Real<br>巴西雷亚尔 |
|  | BYN | Belarusian Ruble<br>白俄罗斯卢布 |
|  | CAD | Canadian Dollar<br>加元 |
|  | CHF | Swiss Franc<br>瑞士法郎 |
|  | CLP | Chilean Peso<br>智利比索 |
|  | COP | Colombian Peso<br>哥伦比亚比索 |
|  | DKK | Danish Krone<br>丹麦克朗 |
|  | EUR | Euro<br>欧元 |
|  | GBP | British Pound<br>英镑 |
|  | HKD | Hong Kong Dollar<br>港币 |
|  | IDR | Indonesian Rupiah<br>印尼卢比 |
|  | ILS | Israeli New Shekel<br>以色列新谢克尔 |
|  | INR | Indian Rupee<br>印度卢比 |
|  | JOD | Jordanian Dinar<br>约旦第纳尔 |
|  | JPY | Japanese Yen<br>日元 |
|  | KRW | Korean Won<br>韩元 |
|  | KWD | Kuwaiti Dinar<br>科威特第纳尔 |
|  | KZT | Kazakhstani Tenge<br>哈萨克斯坦坚戈 |
|  | LAK | Lao Kip<br>老挝基普 |
|  | MNT | Mongolian Tugrik<br>蒙古图格里克 |
|  | MOP | Macau Pataca<br>澳门元 |
|  | MXN | Mexican Peso<br>墨西哥比索 |
|  | MYR | Malaysian Ringgit<br>马来西亚林吉特 |
|  | NZD | New Zealand Dollar<br>新西兰元 |
|  | OMR | Omani Rial<br>阿曼里亚尔 |
|  | PHP | Philippine Peso<br>菲律宾比索 |
|  | PKR | Pakistani Rupee<br>巴基斯坦卢比 |
|  | PLN | Polish Zloty<br>波兰兹罗提 |
|  | QAR | Qatari Riyal<br>卡塔尔里亚尔 |
|  | RUB | Russian Ruble<br>俄罗斯卢布 |
|  | SAR | Saudi Riyal<br>沙特里亚尔 |
|  | SEK | Swedish Krona<br>瑞典克朗 |
|  | SGD | Singapore Dollar<br>新加坡元 |
|  | THB | Thai Baht<br>泰铢 |
|  | TRY | Turkish Lira<br>土耳其里拉 |
|  | TWD | New Taiwan Dollar<br>新台币 |
|  | USD | United States Dollar<br>美元 |
|  | VND | Vietnamese Dong<br>越南盾 |
|  | ZAR | South African Rand<br>南非兰特 |
| Vehicle Location Information Type<br>车辆位置信息类型 | VLI |  |
|  | 1 | General information<br>通用信息 |
|  | 2 | Hours of operation<br>营业时间 |
|  | 3 | After hours return<br>非工作时间还车 |
|  | 4 | Driving directions<br>驾驶路线 |
|  | 5 | Commissions<br>佣金 |
|  | 6 | Express<br>加急 |
|  | 7 | Other<br>其他 |
|  | 8 | Gas<br>燃油 |
|  | 9 | Delivery<br>送车 |
|  | 10 | Collection<br>取车 |
| Error Warning Type<br>错误警告类型 | EWT |  |
|  | 1 | Unknown<br>未知 |
|  | 2 | No implementation<br>未实现 |
|  | 3 | Biz rule<br>业务规则 |
|  | 4 | Authentication<br>认证 |
|  | 5 | Authentication timeout<br>认证超时 |
|  | 6 | Authorization<br>授权 |
|  | 7 | Protocol violation<br>协议违规 |
|  | 8 | Transaction model<br>交易模型 |
|  | 9 | Authentical model<br>认证模型 |
|  | 10 | Required field missing<br>缺少必填字段 |
|  | 11 | Advisory<br>咨询 |
|  | 12 | Processing exception<br>处理异常 |
|  | 13 | Application error<br>应用错误 |

## API Request & Response Examples
**API 请求和响应示例**

This section provides complete request and response examples for key APIs to help developers quickly understand and integrate.
本节提供关键 API 的完整请求和响应示例，帮助开发者快速理解和集成。

### API Classification by Function
**按功能分类的 API**

#### 1. Basic Data Query APIs (基础数据查询 API)
Used to retrieve static information about locations and vehicles before searching for availability.
用于在搜索可用性之前检索有关地点和车辆的静态信息。

- [locationDetailsSearch](#locationdetailssearch---location-details-search) - Query location details including address, operation hours, and service areas
  查询门店详情，包括地址、营业时间和服务范围
- [vehicleSearch](#vehiclesearch---vehicle-information-search) - Query vehicle information including vehicle types, specifications, and features
  查询车辆信息，包括车型、规格和特性

#### 2. Search & Quote APIs (搜索和报价 API)
Core APIs for searching available vehicles and retrieving rate details.
搜索可用车辆和检索费率详情的核心 API。

- [vehAvailRate](#vehavailrate---vehicle-availability-search) - Search for available vehicles and rates at specific locations and dates
  搜索特定地点和日期的可用车辆和价格
- [vehRateRule](#vehraterule---get-rate-rules-and-details) - Get detailed rate rules including cancellation policies, payment terms, and restrictions
  获取详细的费率规则，包括取消政策、付款条款和限制

#### 3. Booking Management APIs (预订管理 API)
APIs for creating, querying, modifying, and canceling reservations.
用于创建、查询、修改和取消预订的 API。

- [vehRes](#vehres---create-reservation) - Create a new vehicle reservation
  创建新的车辆预订
- [vehResStatusSearch](#vehresstatussearch---query-reservation-status) - Query the current status of an existing reservation
  查询现有预订的当前状态
- [vehModify](#vehmodify---modify-reservation) - Modify reservation details (contact info, deposit status)
  修改预订详情（联系信息、押金状态）
- [vehCancel](#vehcancel---cancel-reservation) - Cancel an existing reservation and calculate cancellation fees
  取消现有预订并计算取消费用

#### 4. Deposit-Free Scenario APIs (免押金场景 API)
Special APIs for deposit-free business scenarios with bidirectional notifications.
免押金业务场景的特殊 API，支持双向通知。

- [notifDeposit](#notifdeposit---deposit-notification) - Trip.com notifies vendor about deposit authorization/deduction status changes
  Trip.com 通知供应商押金授权/扣款状态变更
- [depositNotif](#depositnotif---vendor-deposit-deduction-request) - Vendor pushes deduction/refund requests to Trip.com for review
  供应商向 Trip.com 推送扣款/退款请求以供审核

### Typical Business Flow
**典型业务流程**

```
1. Data Preparation (数据准备)
   └─> locationDetailsSearch + vehicleSearch

2. Search & Quote (搜索和报价)
   └─> vehAvailRate → vehRateRule

3. Create Booking (创建预订)
   └─> vehRes

4. Manage Booking (管理预订)
   ├─> vehResStatusSearch (Query status / 查询状态)
   ├─> vehModify (Modify details / 修改详情)
   └─> vehCancel (Cancel booking / 取消预订)

5. Deposit-Free Flow (Optional / 免押金流程-可选)
   ├─> notifDeposit (Trip.com → Vendor)
   └─> depositNotif (Vendor → Trip.com)
```

---

### vehAvailRate - Vehicle Availability Search
**vehAvailRate - 车辆可用性搜索**

**Endpoint:** `https://apiproxy.ctrip.com/apiproxy/soa2/34517/json/api/vehAvailRate`

**Request Example:**
**请求示例：**

```json
{
  "currency": "USD",
  "maxResponses": 50,
  "pos": {
    "echoToken": "a6364ea6-0e88-4038-ea4c-7a7330a62e10",
    "sign": "xxxxxx",
    "language": "EN",
    "timestamp": 1738819200000,
    "version": "1.0.1"
  },
  "vehAvailRQCore": {
    "rateQualifier": {
      "contractCode": "1",
      "promotionCode": "2",
      "rateCategory": "3",
      "rateQualifier": "4",
      "corpDiscountNmbr": "5"
    },
    "status": "Available",
    "vehRentalCore": {
      "pickUpDateTime": "2024-04-05T10:00:00",
      "returnDateTime": "2024-04-25T10:00:00",
      "pickUpLocation": {
        "locationCode": "LAXT01",
        "codeContext": "IATA"
      },
      "returnLocation": {
        "locationCode": "SFOC28",
        "codeContext": "IATA"
      },
      "offLocServices": [
        {
          "type": "VehDelivery",
          "circleId": 123
        },
        {
          "type": "VehCollection",
          "circleId": 123
        }
      ]
    },
    "vendorPref": {
      "code": "ZI"
    }
  },
  "vehAvailRQInfo": {
    "customer": {
      "driverAge": 18,
      "citizenCountryCode": "UK"
    }
  }
}
```

**Response Example:**
**响应示例：**

```json
{
  "success": true,
  "errors": null,
  "vehAvailRSCore": {
    "vehVendorAvails": [
      {
        "vendor": {
          "code": "ZI",
          "companyName": "Avis"
        },
        "vehAvails": [
          {
            "vehAvailCore": {
              "vehicle": {
                "vehMakeModel": {
                  "name": "Toyota Camry or similar",
                  "code": "ICAR"
                },
                "vehType": {
                  "vehicleCategory": 1,
                  "doorCount": 4
                },
                "passengerQuantity": 5,
                "baggageQuantity": 3,
                "fuelType": "Petrol",
                "driveType": "Automatic",
                "airConditionInd": true
              },
              "rentalRate": {
                "vehicleCharges": {
                  "vehicleCharge": {
                    "amount": 450.00,
                    "currencyCode": "USD",
                    "taxInclusive": false,
                    "description": "Base rental rate for 20 days"
                  }
                },
                "rateDistance": {
                  "unlimited": true,
                  "distUnitName": "Mile"
                }
              },
              "totalCharge": {
                "rateTotalAmount": 450.00,
                "estimatedTotalAmount": 520.00,
                "currencyCode": "USD"
              },
              "reference": {
                "type": "RateID",
                "id": "RATE-LAX-SF-20240405-001"
              }
            }
          }
        ]
      }
    ]
  }
}
```

---

### vehRateRule - Get Rate Rules and Details
**vehRateRule - 获取费率规则和详情**

**Endpoint:** `https://apiproxy.ctrip.com/apiproxy/soa2/34517/json/api/vehRateRule`

**Request Example:**
**请求示例：**

```json
{
  "currency": "USD",
  "pos": {
    "echoToken": "a6364ea6-0e88-4038-ea4c-7a7330a62e10",
    "sign": "xxxxxx",
    "language": "EN",
    "timestamp": 1738819200000,
    "version": "1.0.1"
  },
  "rentalInfo": {
    "customer": {
      "driverAge": 18,
      "citizenCountryCode": "UK"
    },
    "rateQualifier": {
      "contractCode": "1",
      "promotionCode": "2",
      "rateCategory": "3",
      "rateQualifier": "4",
      "corpDiscountNmbr": "5"
    },
    "vehPref": {
      "code": "IFAR"
    },
    "vehRentalCore": {
      "pickUpDateTime": "2024-04-05T10:00:00",
      "returnDateTime": "2024-04-25T10:00:00",
      "pickUpLocation": {
        "locationCode": "LAXT01",
        "codeContext": "IATA"
      },
      "returnLocation": {
        "locationCode": "SFOC28",
        "codeContext": "IATA"
      },
      "offLocServices": [
        {
          "type": "VehDelivery",
          "circleId": 123
        },
        {
          "type": "VehCollection",
          "circleId": 123
        }
      ]
    },
    "vendorPref": {
      "code": "ZI"
    }
  }
}
```

**Response Example:**
**响应示例：**

```json
{
  "success": true,
  "errors": null,
  "vehRateRuleRSCore": {
    "vehicle": {
      "vehMakeModel": {
        "name": "Ford Fusion or similar",
        "code": "IFAR"
      }
    },
    "rateRules": [
      {
        "ruleType": "Cancel",
        "description": "Cancellation Policy",
        "cancelPenalties": [
          {
            "deadline": "2024-04-03T10:00:00",
            "penaltyAmount": {
              "amount": 0.00,
              "currencyCode": "USD"
            },
            "penaltyDescription": "Free cancellation if cancelled before 48 hours of pickup"
          },
          {
            "deadline": "2024-04-04T10:00:00",
            "penaltyAmount": {
              "amount": 112.50,
              "currencyCode": "USD"
            },
            "penaltyPercentage": 25.0,
            "penaltyDescription": "25% charge if cancelled 24-48 hours before pickup"
          }
        ]
      },
      {
        "ruleType": "Deposit",
        "description": "Deposit Policy",
        "depositRules": {
          "depositAmount": {
            "amount": 500.00,
            "currencyCode": "USD"
          },
          "depositType": "Authorization",
          "depositFreeAvailable": true
        }
      }
    ]
  }
}
```

---

### vehRes - Create Reservation
**vehRes - 创建预订**

**Endpoint:** `https://apiproxy.ctrip.com/apiproxy/soa2/34517/json/api/vehRes`

**Request Example:**
**请求示例：**

```json
{
  "pos": {
    "echoToken": "a6364ea6-0e88-4038-ea4c-7a7330a62e10",
    "sign": "xxxxxx",
    "language": "EN",
    "timestamp": 1738819200000,
    "version": "1.1"
  },
  "vehResRQCore": {
    "customer": {
      "driverAge": 18,
      "citizenCountryCode": "UK",
      "email": {
        "emailAddress": "xxxx@trip.com"
      },
      "givenName": "trip",
      "surname": "dev",
      "mobile": {
        "areaCityCode": "86",
        "phoneNumber": "18812345678"
      }
    },
    "estimatedTotalAmount": {
      "amount": 100,
      "currency": "USD"
    },
    "estimatedCustomerAmount": {
      "amount": 100,
      "currency": "USD"
    },
    "depositFree": {
      "supportDepositFree": true,
      "depositAmount": {
        "amount": 100,
        "currency": "USD"
      }
    },
    "rateQualifier": {
      "contractCode": "1",
      "promotionCode": "2",
      "rateCategory": "3",
      "rateQualifier": "4",
      "corpDiscountNmbr": "5"
    },
    "vehRentalCore": {
      "pickUpDateTime": "2024-04-05T10:00:00",
      "returnDateTime": "2024-04-25T10:00:00",
      "pickUpLocation": {
        "locationCode": "LAXT01",
        "codeContext": "IATA"
      },
      "returnLocation": {
        "locationCode": "SFOC28",
        "codeContext": "IATA"
      },
      "offLocServices": [
        {
          "addressLine": "廊曼國際機場 （DMK）",
          "circleId": "666",
          "contacts": [
            {
              "contactNumber": "",
              "contactType": "1"
            }
          ],
          "position": {
            "latitude": "13.91326",
            "longitude": "100.604199"
          },
          "type": "VehDelivery"
        },
        {
          "addressLine": "廊曼國際機場 （DMK）",
          "circleId": "666",
          "contacts": [
            {
              "contactNumber": "",
              "contactType": "1"
            }
          ],
          "position": {
            "latitude": "13.91326",
            "longitude": "100.604199"
          },
          "type": "VehCollection"
        }
      ]
    },
    "vendorPref": {
      "code": "ZI"
    },
    "vehPref": {
      "code": "ICAR"
    },
    "specialEquipPrefs": [
      {
        "equipType": "7",
        "quantity": 1
      }
    ]
  },
  "vehResRQInfo": {
    "arrivalDetail": {
      "transportationCode": "14",
      "number": "4293",
      "operatingCompany": {
        "code": "FR",
        "codeContext": "xxx"
      }
    },
    "reference": {
      "id": "8EGUKD04SW29853-6303"
    },
    "tripOrderId": "111321321311"
  }
}
```

**Response Example:**
**响应示例：**

```json
{
  "success": true,
  "errors": null,
  "vehResRSCore": {
    "vehReservation": {
      "vehSegmentCore": {
        "confirmationCode": "AVIS-LAX-20240405-001",
        "status": "Confirmed",
        "vehicle": {
          "vehMakeModel": {
            "name": "Toyota Camry or similar",
            "code": "ICAR"
          },
          "vehType": {
            "vehicleCategory": 1,
            "doorCount": 4
          },
          "passengerQuantity": 5,
          "baggageQuantity": 3
        },
        "rentalRate": {
          "vehicleCharges": {
            "vehicleCharge": {
              "amount": 100.00,
              "currencyCode": "USD"
            }
          }
        },
        "totalCharge": {
          "rateTotalAmount": 100.00,
          "estimatedTotalAmount": 100.00,
          "currencyCode": "USD"
        },
        "vehRentalCore": {
          "pickUpDateTime": "2024-04-05T10:00:00",
          "returnDateTime": "2024-04-25T10:00:00",
          "pickUpLocation": {
            "locationCode": "LAXT01"
          },
          "returnLocation": {
            "locationCode": "SFOC28"
          }
        }
      },
      "customer": {
        "givenName": "trip",
        "surname": "dev",
        "email": {
          "emailAddress": "xxxx@trip.com"
        },
        "mobile": {
          "areaCityCode": "86",
          "phoneNumber": "18812345678"
        }
      }
    },
    "tripOrderId": "111321321311"
  }
}
```

---

### vehCancel - Cancel Reservation
**vehCancel - 取消预订**

**Endpoint:** `https://apiproxy.ctrip.com/apiproxy/soa2/34517/json/api/vehCancel`

**Request Example:**
**请求示例：**

```json
{
  "pos": {
    "echoToken": "a6364ea6-0e88-4038-ea4c-7a7330a62e10",
    "sign": "xxxxxx",
    "language": "EN",
    "timestamp": 1738819200000,
    "version": "1.0.1"
  },
  "vehCancelRQCore": {
    "tripOrderId": "21312312",
    "uniqueID": {
      "id": "ct12121212",
      "type": "1"
    }
  }
}
```

**Response Example:**
**响应示例：**

```json
{
  "success": true,
  "errors": null,
  "vehCancelRSCore": {
    "tripOrderId": "21312312",
    "uniqueID": {
      "id": "ct12121212",
      "type": "1"
    },
    "cancelStatus": "Cancelled",
    "cancellationNumber": "CANCEL-20240205-001",
    "cancelPenalties": {
      "cancelPenalty": [
        {
          "penaltyAmount": {
            "amount": 50.00,
            "currencyCode": "USD"
          },
          "penaltyDescription": "Cancellation within 24 hours - 1 day rental charge"
        }
      ]
    },
    "refundAmount": {
      "amount": 400.00,
      "currencyCode": "USD"
    }
  }
}
```

---

### vehResStatusSearch - Query Reservation Status
**vehResStatusSearch - 查询预订状态**

**Endpoint:** `https://apiproxy.ctrip.com/apiproxy/soa2/34517/json/api/vehResStatusSearch`

**Request Example:**
**请求示例：**

```json
{
  "pos": {
    "echoToken": "a6364ea6-0e88-4038-ea4c-7a7330a62e10",
    "sign": "xxxxxx",
    "language": "EN",
    "timestamp": 1738819200000,
    "version": "1.0.1"
  },
  "vehRetResRQCore": {
    "tripOrderId": "21312312",
    "uniqueID": {
      "id": "ct12121212",
      "type": "1"
    }
  }
}
```

**Response Example:**
**响应示例：**

```json
{
  "success": true,
  "errors": null,
  "vehRetResRSCore": {
    "vehReservation": {
      "vehSegmentCore": {
        "confirmationCode": "ct12121212",
        "status": "Confirmed",
        "vehicle": {
          "vehMakeModel": {
            "name": "Toyota Camry or similar",
            "code": "ICAR"
          },
          "vehType": {
            "vehicleCategory": 1,
            "doorCount": 4
          },
          "passengerQuantity": 5,
          "baggageQuantity": 3
        },
        "rentalRate": {
          "vehicleCharges": {
            "vehicleCharge": {
              "amount": 100.00,
              "currencyCode": "USD"
            }
          }
        },
        "totalCharge": {
          "rateTotalAmount": 100.00,
          "estimatedTotalAmount": 100.00,
          "currencyCode": "USD"
        },
        "vehRentalCore": {
          "pickUpDateTime": "2024-04-05T10:00:00",
          "returnDateTime": "2024-04-25T10:00:00",
          "pickUpLocation": {
            "locationCode": "LAXT01",
            "locationName": "Los Angeles Airport Terminal 1"
          },
          "returnLocation": {
            "locationCode": "SFOC28",
            "locationName": "San Francisco Airport"
          }
        }
      },
      "customer": {
        "givenName": "trip",
        "surname": "dev",
        "email": {
          "emailAddress": "xxxx@trip.com"
        },
        "mobile": {
          "areaCityCode": "86",
          "phoneNumber": "18812345678"
        }
      }
    },
    "tripOrderId": "21312312",
    "reservationStatus": "Active"
  }
}
```

---

### vehModify - Modify Reservation
**vehModify - 修改预订**

**Endpoint:** `https://apiproxy.ctrip.com/apiproxy/soa2/34517/json/api/vehModify`

**Request Example:**
**请求示例：**

```json
{
  "pos": {
    "echoToken": "a6364ea6-0e88-4038-ea4c-7a7330a62e10",
    "sign": "xxxxxx",
    "language": "EN",
    "timestamp": 1738819200000,
    "version": "1.0.1"
  },
  "vehModifyRQCore": {
    "tripOrderId": "string",
    "confirmationCode": "string",
    "vendorPref": {
      "code": "ZI"
    }
  },
  "vehModifyRQInfo": {
    "customer": {
      "flightNumber": "",
      "contact": {
        "contactType": "1",
        "contactNumber": "string"
      }
    },
    "depositFree": {
      "depositAmount": {
        "amount": 100,
        "currency": "USD"
      },
      "supportDepositFree": true
    }
  }
}
```

**Response Example:**
**响应示例：**

```json
{
  "success": true,
  "errors": null,
  "vehModifyRSCore": {
    "tripOrderId": "string",
    "confirmationCode": "string",
    "modificationStatus": "Success",
    "modificationNumber": "MOD-20240205-001",
    "updatedFields": [
      {
        "fieldName": "contactNumber",
        "oldValue": "+1-310-555-0100",
        "newValue": "string"
      },
      {
        "fieldName": "depositFreeStatus",
        "oldValue": "false",
        "newValue": "true"
      }
    ]
  }
}
```

---

### notifDeposit - Deposit Notification
**notifDeposit - 押金通知**

**Endpoint:** `https://apiproxy.ctrip.com/apiproxy/soa2/34517/json/api/notifDeposit`

**Request Example:**
**请求示例：**

```json
{
  "pos": {
    "echoToken": "string",
    "language": "string",
    "sign": "8278d9fh21c7e90560fc42c42de0bc46",
    "timestamp": 1635492869606,
    "version": "1.1.1"
  },
  "vehNotifyRQCore": {
    "amount": {
      "amount": 0,
      "currency": "string"
    },
    "confirmationCode": "string",
    "description": "string",
    "status": "string",
    "tripDeductionId": "string",
    "tripOrderId": "string",
    "type": "string",
    "vendorDeductionId": "string"
  }
}
```

**Response Example:**
**响应示例：**

```json
{
  "success": true,
  "errors": null,
  "notificationStatus": "Received",
  "tripDeductionId": "string",
  "processedTime": "2024-02-05T10:30:00"
}
```

---

### depositNotif - Vendor Deposit Deduction Request
**depositNotif - 供应商押金扣款请求**

**Endpoint:** `https://apiproxy.ctrip.com/apiproxy/soa2/34517/json/api/appid/depositNotif`

**Request Example:**
**请求示例：**

```json
{
  "confirmationCode": "string",
  "deductionType": 0,
  "description": "string",
  "fileUrl": [
    "string"
  ],
  "pos": {
    "echoToken": "string",
    "language": "string",
    "sign": "8278d9fh21c7e90560fc42c42de0bc46",
    "timestamp": 1635492869606,
    "version": "1.1.1"
  },
  "price": {
    "amount": 0,
    "currency": "string"
  },
  "tripDeductionId": "string",
  "tripOrderId": "string",
  "type": "string",
  "username": "string",
  "vendorDeductionId": "string"
}
```

**Response Example:**
**响应示例：**

```json
{
  "success": true,
  "errors": null,
  "tripDeductionId": "string",
  "vendorDeductionId": "string",
  "status": "Pending",
  "message": "Deduction request received and under review",
  "reviewTime": "2024-02-05T10:30:00"
}
```

---

### locationDetailsSearch - Location Details Search
**locationDetailsSearch - 门店详情搜索**

**Endpoint:** `https://apiproxy.ctrip.com/apiproxy/soa2/34517/json/api/locationDetailsSearch`

**Request Example:**
**请求示例：**

```json
{
  "pageNum": 0,
  "pageSize": 0,
  "pos": {
    "echoToken": "string",
    "language": "string",
    "sign": "8278d9fh21c7e90560fc42c42de0bc46",
    "timestamp": 1635492869606,
    "version": "1.1.1"
  },
  "vendor": {
    "code": "string",
    "companyName": "string"
  }
}
```

**Response Example:**
**响应示例：**

```json
{
  "success": true,
  "errors": null,
  "locations": [
    {
      "locationCode": "LAX01",
      "locationName": "Los Angeles Airport",
      "address": {
        "streetNmbr": "1 World Way",
        "cityName": "Los Angeles",
        "stateProv": "CA",
        "postalCode": "90045",
        "countryName": "USA"
      },
      "telephone": "+1-310-555-0100",
      "operationSchedules": [
        {
          "start": "08:00",
          "end": "22:00",
          "dayOfWeek": "Monday"
        }
      ]
    }
  ]
}
```

---

### vehicleSearch - Vehicle Information Search
**vehicleSearch - 车辆信息搜索**

**Endpoint:** `https://apiproxy.ctrip.com/apiproxy/soa2/34517/json/api/vehicleSearch`

**Request Example:**
**请求示例：**

```json
{
  "locationCode": "string",
  "pageNum": 0,
  "pageSize": 0,
  "pos": {
    "echoToken": "string",
    "language": "string",
    "sign": "8278d9fh21c7e90560fc42c42de0bc46",
    "timestamp": 1635492869606,
    "version": "1.1.1"
  },
  "vendor": {
    "code": "string",
    "companyName": "string"
  }
}
```

**Response Example:**
**响应示例：**

```json
{
  "success": true,
  "errors": null,
  "vehicles": [
    {
      "vehMakeModel": {
        "name": "Toyota Camry or similar",
        "code": "ICAR"
      },
      "vehType": {
        "vehicleCategory": 1,
        "doorCount": 4
      },
      "vehClass": {
        "size": 4
      },
      "passengerQuantity": 5,
      "baggageQuantity": 3,
      "fuelType": "Petrol",
      "driveType": "Automatic",
      "airConditionInd": true,
      "transmissionType": "Automatic",
      "pictureURL": "https://example.com/images/camry.jpg"
    },
    {
      "vehMakeModel": {
        "name": "Ford Fusion or similar",
        "code": "IFAR"
      },
      "vehType": {
        "vehicleCategory": 1,
        "doorCount": 4
      },
      "vehClass": {
        "size": 4
      },
      "passengerQuantity": 5,
      "baggageQuantity": 3,
      "fuelType": "Petrol",
      "driveType": "Automatic",
      "airConditionInd": true,
      "transmissionType": "Automatic",
      "pictureURL": "https://example.com/images/fusion.jpg"
    }
  ]
}
```

---

## Paths

### /api/appid/depositNotif

#### POST

**Summary:** depositNotif

Only used for deposit-free business scenario. For deposit-free reservations, this interface is mandatory. You can push the deduction/refund request via this interface. After receiving this request, our customer service team will review it based on the deduction amount and the deduction certificate you provided.
仅用于免押金业务场景。对于免押金预订，此接口是强制性的。您可以通过此接口推送扣款/退款请求。收到此请求后，我们的客户服务团队将根据扣款金额和您提供的扣款凭证进行审核。

**Request Body**
**请求体**

- **Content-Type:** application/json
- Schema: [com.ctrip.car.openapiservice.vo.request.osd.DepositNotifRequestType](#com.ctrip.car.openapiservice.vo.request.osd.depositnotifrequesttype)

**Responses**
**响应**

- **200**: Request Success
  请求成功
  - */*: [com.ctrip.car.openapiservice.vo.request.osd.DepositNotifResponseType](#com.ctrip.car.openapiservice.vo.request.osd.depositnotifresponsetype)

---

### /api/locationDetailsSearch

#### POST

**Summary:** locationDetailsSearch

Request details about locations from the vendor, including address, operation schedules, special equipments and etc.   [25.07.15 update] Implement function of transmitting the service circle information for car delivery business scenario, including contact information and geospatial information. 
请求供应商的门店详细信息，包括地址、营业时间、特殊设备等。[25.07.15 更新] 实现传输送车上门业务场景的服务范围信息，包括联系信息和地理空间信息。

**Request Body**
**请求体**

- **Content-Type:** application/json
- Schema: [com.ctrip.car.openapiservice.vo.request.osd.CollectLocationDetailRQ](#com.ctrip.car.openapiservice.vo.request.osd.collectlocationdetailrq)

**Responses**
**响应**

- **200**: Request Success
  请求成功
  - */*: [com.ctrip.car.openapiservice.vo.response.osd.CollectLocationDetailRS](#com.ctrip.car.openapiservice.vo.response.osd.collectlocationdetailrs)

---

### /api/notifDeposit

#### POST

**Summary:** notifDeposit

Only used for deposit-free business scenario. For deposit-free reservations, this interface is mandatory. The status of the reservation deposit&deduction audition will be transmitted via this interface.
仅用于免押金业务场景。对于免押金预订，此接口是强制性的。预订押金和扣款审核的状态将通过此接口传输。

**Request Body**
**请求体**

- **Content-Type:** application/json
- Schema: [com.ctrip.car.openapiservice.vo.request.osd.VendorDepositNotifyRequest](#com.ctrip.car.openapiservice.vo.request.osd.vendordepositnotifyrequest)

**Responses**
**响应**

- **200**: Request Success
  请求成功
  - */*: [com.ctrip.car.openapiservice.vo.request.osd.VendorDepositNotifyResponse](#com.ctrip.car.openapiservice.vo.request.osd.vendordepositnotifyresponse)

---

### /api/vehAvailRate

#### POST

**Summary:** vehAvailRate

Request car availability from a specific Location at a specific Date/Time. The user puts a Location, Date and Time into vehAvailRQCore, and vehAvailRSCore tells them all the available vehicles.  [25.07.15 update] Implement function of transmitting deposit free rates details and car delivery service fee details.
请求特定地点和特定日期/时间的车辆可用性。用户将地点、日期和时间放入 vehAvailRQCore，vehAvailRSCore 会告知所有可用车辆。[25.07.15 更新] 实现传输免押金费率详情和送车上门服务费详情的功能。

**Request Body**
**请求体**

- **Content-Type:** application/json
- Schema: [com.ctrip.car.openapiservice.vo.request.osd.VehAvailRateRQ](#com.ctrip.car.openapiservice.vo.request.osd.vehavailraterq)

**Responses**
**响应**

- **200**: Request Success
  请求成功
  - */*: [com.ctrip.car.openapiservice.vo.response.osd.VehAvailRateRS](#com.ctrip.car.openapiservice.vo.response.osd.vehavailraters)

---

### /api/vehCancel

#### POST

**Summary:** vehCancel

If the customer initiates an order cancellation, we will send you a request via cancelReservation to cancel the order. You need to return the cancellation result to us, and if any fees are attracted due to the cancellation, you also need to inform us in this interface.
如果客户发起订单取消，我们将通过 cancelReservation 向您发送取消订单的请求。您需要向我们返回取消结果，如果因取消而产生任何费用，您也需要在此接口中通知我们。

**Request Body**
**请求体**

- **Content-Type:** application/json
- Schema: [com.ctrip.car.openapiservice.vo.request.osd.VehCancelRQ](#com.ctrip.car.openapiservice.vo.request.osd.vehcancelrq)

**Responses**
**响应**

- **200**: Request Success
  请求成功
  - */*: [com.ctrip.car.openapiservice.vo.response.osd.VehCancelRS](#com.ctrip.car.openapiservice.vo.response.osd.vehcancelrs)

---

### /api/vehModify

#### POST

**Summary:** vehModify

Only used for the business scenarios of car delivery and deposit-free products now. Implement function of modifying some information like deposit status and guest contact information for car delivery. Other essential order information like pick&return datetime is not supported for modification. 
目前仅用于送车上门和免押金产品的业务场景。实现修改送车上门的押金状态和客人联系信息等功能。不支持修改取还车时间等其他核心订单信息。

**Request Body**
**请求体**

- **Content-Type:** application/json
- Schema: [com.ctrip.car.openapiservice.vo.request.osd.VehModifyRQ](#com.ctrip.car.openapiservice.vo.request.osd.vehmodifyrq)

**Responses**
**响应**

- **200**: Request Success
  请求成功
  - */*: [com.ctrip.car.openapiservice.vo.request.osd.VehModifyRS](#com.ctrip.car.openapiservice.vo.request.osd.vehmodifyrs)


---

### /api/vehRateRule

#### POST

**Summary:** vehRateRule

Request additional details regarding a previously quoted rate or a reservation that is already confirmed.  [25.07.15 update] Implement function of transmitting deposit free rates details and car delivery service fee details.
请求关于先前报价费率或已确认预订的更多详情。[25.07.15 更新] 实现传输免押金费率详情和送车上门服务费详情的功能。

**Request Body**
**请求体**

- **Content-Type:** application/json
- Schema: [com.ctrip.car.openapiservice.vo.request.osd.VehRateRuleRQ](#com.ctrip.car.openapiservice.vo.request.osd.vehraterulerq)

**Responses**
**响应**

- **200**: Request Success
  请求成功
  - */*: [com.ctrip.car.openapiservice.vo.response.osd.VehRateRuleRS](#com.ctrip.car.openapiservice.vo.response.osd.vehraterulers)

---

### /api/vehRes

#### POST

**Summary:** vehRes

After the customer selects a rental vehicle option from a vehAvailRate response, they can reserve the selected vehicle option. Vehicles are booked using vehRes.  [25.07.15 update] Implement function of transmitting deposit-free products rates details and car delivery guest locations&contact information details.
客户从 vehAvailRate 响应中选择租赁车辆选项后，可以预订所选车辆选项。车辆使用 vehRes 进行预订。[25.07.15 更新] 实现传输免押金产品费率详情和送车上门客人位置及联系信息详情的功能。

**Request Body**
**请求体**

- **Content-Type:** application/json
- Schema: [com.ctrip.car.openapiservice.vo.request.osd.VehResRQ](#com.ctrip.car.openapiservice.vo.request.osd.vehresrq)

**Responses**
**响应**

- **200**: Request Success
  请求成功
  - */*: [com.ctrip.car.openapiservice.vo.response.osd.VehResRS](#com.ctrip.car.openapiservice.vo.response.osd.vehresrs)

---

### /api/vehResStatusSearch

#### POST

**Summary:** vehResStatusSearch

The vehResStatusSearch could be used by Trip.com to actively query the booking status of vendors.
Trip.com 可以使用 vehResStatusSearch 主动查询供应商的预订状态。

**Request Body**
**请求体**

- **Content-Type:** application/json
- Schema: [com.ctrip.car.openapiservice.vo.request.osd.VehRetResRQ](#com.ctrip.car.openapiservice.vo.request.osd.vehretresrq)

**Responses**
**响应**

- **200**: Request Success
  请求成功
  - */*: [com.ctrip.car.openapiservice.vo.response.osd.VehRetResRS](#com.ctrip.car.openapiservice.vo.response.osd.vehretresrs)

---

### /api/vehicleSearch

#### POST

**Summary:** vehicleSearch

Request information on vehicles at a specific location,  including representative vehicle, vehicle class, vehicle type, energy type and etc.
请求特定地点的车辆信息，包括代表性车辆、车辆等级、车辆类型、能源类型等。

**Request Body**
**请求体**

- **Content-Type:** application/json
- Schema: [com.ctrip.car.openapiservice.vo.request.osd.CollectVehicleRQ](#com.ctrip.car.openapiservice.vo.request.osd.collectvehiclerq)

**Responses**
**响应**

- **200**: Request Success
  请求成功
  - */*: [com.ctrip.car.openapiservice.vo.response.osd.CollectVehicleRS](#com.ctrip.car.openapiservice.vo.response.osd.collectvehiclers)

---

## Schemas
**模式**

### <a id='addionalamountperunit'></a>addionalAmountPerUnit

Amount of unit charge per distance unit after free distance is exceeded.
超过免费距离后的每单位距离收费金额。

| Property | Type | Description |
| --- | --- | --- |
| amount | number | amount<br>金额 |
| currency | string | currency of the amount, e.g. USD, please refer to CurrencyType enum for the complete list of currencies supported by Trip<br>金额的货币，例如美元，请参考 CurrencyType 枚举以获取 Trip 支持的完整货币列表 |

### <a id='addionalamountupperlimit'></a>addionalAmountUpperLimit

The upper limit fees for additional distance charges after free mileage is exceeded.
超过免费里程后的额外距离收费上限。

| Property | Type | Description |
| --- | --- | --- |
| amount | number | amount<br>金额 |
| currency | string | currency of the amount, e.g. USD, please refer to CurrencyType enum for the complete list of currencies supported by Trip<br>金额的货币，例如美元，请参考 CurrencyType 枚举以获取 Trip 支持的完整货币列表 |

### <a id='amount'></a>amount

The total amount of the tax.
税费总额。

| Property | Type | Description |
| --- | --- | --- |
| amount | number | amount<br>金额 |
| currency | string | currency of the amount, e.g. USD, please refer to CurrencyType enum for the complete list of currencies supported by Trip<br>金额的货币，例如美元，请参考 CurrencyType 枚举以获取 Trip 支持的完整货币列表 |

### <a id='cancelpenalty'></a>cancelPenalty

Details of cancellation penalty.
取消违约金详情。

| Property | Type | Description |
| --- | --- | --- |
| amount | number | amount<br>金额 |
| currency | string | currency of the amount, e.g. USD, please refer to CurrencyType enum for the complete list of currencies supported by Trip<br>金额的货币，例如美元，请参考 CurrencyType 枚举以获取 Trip 支持的完整货币列表 |

### <a id='charge'></a>charge

Charge for a particular cost.
特定成本的费用。

| Property | Type | Description |
| --- | --- | --- |
| amount | BigDecimal | amount<br>金额 |
| currency | string | currency of the amount, e.g. USD, please refer to CurrencyType enum for the complete list of currencies supported by Trip<br>金额的货币，例如美元，请参考 CurrencyType 枚举以获取 Trip 支持的完整货币列表 |

### <a id='chargeequip'></a>chargeEquip

Charge for the specific equipment.
特定设备的费用。

| Property | Type | Description |
| --- | --- | --- |
| amount | number | amount<br>金额 |
| currency | string | currency of the amount, e.g. USD, please refer to CurrencyType enum for the complete list of currencies supported by Trip<br>金额的货币，例如美元，请参考 CurrencyType 枚举以获取 Trip 支持的完整货币列表 |

### <a id='com.ctrip.car.openapiservice.dto.vehrate'></a>com.ctrip.car.openapiservice.dto.VehRate

Information on the rates associated with this vehicle.
与该车辆相关的费率信息。

| Property | Type | Description |
| --- | --- | --- |
| dateTimeSpan | [com.ctrip.car.openapiservice.dto.search.DateTimeSpan](#com.ctrip.car.openapiservice.dto.search.datetimespan) |  |
| id | string | A unique identifier for the rate.<br>费率的唯一标识符。 |
| payMode | integer | Payment mode of each rate.1-Pay on Arrival; 2-Prepay; 3-Prepay Partially<br>每种费率的支付模式。1-到店支付；2-预付；3-部分预付 |
| rateQualifier | [com.ctrip.car.openapiservice.dto.search.RateQualifier](#com.ctrip.car.openapiservice.dto.search.ratequalifier) |  |
| rateScope | [com.ctrip.car.openapiservice.dto.search.Scope](#com.ctrip.car.openapiservice.dto.search.scope) |  |

### <a id='com.ctrip.car.openapiservice.dto.booking.arrivaldetail'></a>com.ctrip.car.openapiservice.dto.booking.ArrivalDetail

Details of the arrival transportation, if applicable, the ArrivalDetail complex defines the information that describes an arriving mode of transportation which is associated with the rental of a vehicle. This is typically used to identify how the customer will be arriving at the vehicle rental facility.
到达交通详情（如果适用），ArrivalDetail 复合体定义了描述与车辆租赁相关的到达交通方式的信息。这通常用于识别客户将如何到达租车设施。

| Property | Type | Description |
| --- | --- | --- |
| number | string | Often used in conjunction with TransportationCode to provide greater detail regarding the customer's arrival (e.g., an airline flight number).<br>通常与 TransportationCode 结合使用，以提供有关客户到达的更多详细信息（例如，航班号）。 |
| operatingCompany | [com.ctrip.car.openapiservice.dto.booking.OperatingCompany](#com.ctrip.car.openapiservice.dto.booking.operatingcompany) |  |
| transportationCode | string | Refer to OpenTravel Code List Transportation Code (TRP).<br>参考 OpenTravel 代码列表运输代码 (TRP)。 |

### <a id='com.ctrip.car.openapiservice.dto.booking.confid'></a>com.ctrip.car.openapiservice.dto.booking.ConfID

The type of ConID can be the Order ID or a confirmation number. The order ID is used to obtain the ID for the order after the order is successfully created by the vendor. The confirmation number is used to obtain whether the order is confirmed successfully after the order is created. Sometimes the order ID and confirmation number could be the same.
ConfID 的类型可以是订单 ID 或确认号。订单 ID 用于在供应商成功创建订单后获取订单的 ID。确认号用于在订单创建后获取订单是否成功确认。有时订单 ID 和确认号可能是相同的。

| Property | Type | Description |
| --- | --- | --- |
| id | string | A unique identifying value assigned by the creating system. The ID attribute may be used to reference a primary-key value within a database or in a particular implementation.<br>由创建系统分配的唯一标识值。ID 属性可用于引用数据库中的主键值或特定实现中的值。 |
| type | string | 1- Order ID  2 - Confirmation code<br>1- 订单 ID  2 - 确认码 |

### <a id='com.ctrip.car.openapiservice.dto.booking.contact'></a>com.ctrip.car.openapiservice.dto.booking.Contact

contact
联系方式

| Property | Type | Description |
| --- | --- | --- |
| contactNumber | string | Contact Number<br>联系电话 |
| contactType | string | 0-LocalMobile；1-WeChat；2-Line；3-kakaoTalk；4-WhatsApp；5-QQ |

### <a id='com.ctrip.car.openapiservice.dto.booking.customer'></a>com.ctrip.car.openapiservice.dto.booking.Customer

customer info
客户信息

| Property | Type | Description |
| --- | --- | --- |
| citizenCountryCode | string | Name of the (self-professed) country that is claimed for citizenship，A 2 character country code as defined in ISO3166.<br>声称拥有公民身份的国家名称，ISO3166 中定义的 2 字符国家代码。 |
| driverAge | integer | driver age<br>驾驶员年龄 |
| email | [com.ctrip.car.openapiservice.dto.booking.Email](#com.ctrip.car.openapiservice.dto.booking.email) |  |
| givenName | string | Given name, first name or names.<br>名字。 |
| mobile | [com.ctrip.car.openapiservice.dto.booking.Telephone](#com.ctrip.car.openapiservice.dto.booking.telephone) |  |
| surname | string | Family name, last name.<br>姓氏。 |

### <a id='com.ctrip.car.openapiservice.dto.booking.email'></a>com.ctrip.car.openapiservice.dto.booking.Email

email
电子邮箱

| Property | Type | Description |
| --- | --- | --- |
| emailAddress | string |  |

### <a id='com.ctrip.car.openapiservice.dto.booking.offlocservice'></a>com.ctrip.car.openapiservice.dto.booking.OffLocService

Service circle information & guest location information for the special service 
特殊服务的服务范围信息和客人位置信息

| Property | Type | Description |
| --- | --- | --- |
| addressLine | string | Guest address for car delivery service<br>送车上门服务的客人地址 |
| circleId | integer | Service circle id<br>服务范围 ID |
| contacts | Array of [com.ctrip.car.openapiservice.dto.booking.Contact](#com.ctrip.car.openapiservice.dto.booking.contact) | Guest contact information<br>客人联系信息 |
| position | [com.ctrip.car.openapiservice.dto.search.Position](#com.ctrip.car.openapiservice.dto.search.position) |  |
| type | string | 'VehDelivery' --  car delivery to guest for pick up 'VehCollection' -- car delivery to guest for return<br>'VehDelivery' -- 送车上门供客人取车 'VehCollection' -- 上门收车供客人还车 |

### <a id='com.ctrip.car.openapiservice.dto.booking.operatingcompany'></a>com.ctrip.car.openapiservice.dto.booking.OperatingCompany

Identifies a company by name.
通过名称标识公司。

| Property | Type | Description |
| --- | --- | --- |
| code | string | Identify a company by the company code.<br>通过公司代码标识公司。 |
| codeContext | string | Identify the context of the identifying code, such as DUNS, IATA or internal code, etc.<br>标识识别代码的上下文，如 DUNS、IATA 或内部代码等。 |

### <a id='com.ctrip.car.openapiservice.dto.booking.reference'></a>com.ctrip.car.openapiservice.dto.booking.Reference

Information by which this availability quote can be later cross-referenced
稍后可用于交叉引用此可用性报价的信息

| Property | Type | Description |
| --- | --- | --- |
| id | string | A unique identifying value assigned by the creating system. The ID attribute may be used to reference a primary-key value within a database or in a particular implementation.<br>由创建系统分配的唯一标识值。ID 属性可用于引用数据库中的主键值或特定实现中的值。 |

### <a id='com.ctrip.car.openapiservice.dto.booking.specialequippref'></a>com.ctrip.car.openapiservice.dto.booking.SpecialEquipPref

Indicates the preferences for one or more specific items of additional equipment, such as ski racks, child seats, etc.
指示对一项或多项特定附加设备的偏好，例如滑雪架、儿童座椅等。

| Property | Type | Description |
| --- | --- | --- |
| equipType | string | Identify the specific type of special equipment. Refer to OpenTravel Code List Equipment Type (EQP).<br>标识特殊设备的具体类型。参考 OpenTravel 代码列表设备类型 (EQP)。 |
| quantity | integer | quantity<br>数量 |

### <a id='com.ctrip.car.openapiservice.dto.booking.telephone'></a>com.ctrip.car.openapiservice.dto.booking.Telephone

telephone
电话

| Property | Type | Description |
| --- | --- | --- |
| areaCityCode | string | Code assigned for telephones in a specific region, city, or area.<br>为特定区域、城市或地区的电话分配的代码。 |
| phoneNumber | string | Telephone number assigned to a single location.<br>分配给单个位置的电话号码。 |

### <a id='com.ctrip.car.openapiservice.dto.booking.uniqueid'></a>com.ctrip.car.openapiservice.dto.booking.UniqueID

1- Order ID 
2 - Confirmation number
1- 订单 ID
2 - 确认号

The type of ConID can be the Order ID or a confirmation number. The order ID is used to obtain the ID for the order after the order is successfully created by the vendor. The confirmation number is used to obtain whether the order is confirmed successfully after the order is created. Sometimes the order ID and confirmation number could be the same.
ConfID 的类型可以是订单 ID 或确认号。订单 ID 用于在供应商成功创建订单后获取订单的 ID。确认号用于在订单创建后获取订单是否成功确认。有时订单 ID 和确认号可能是相同的。

| Property | Type | Description |
| --- | --- | --- |
| id | string | A unique identifying value assigned by the creating system. The ID attribute may be used to reference a primary-key value within a database or in a particular implementation.<br>由创建系统分配的唯一标识值。ID 属性可用于引用数据库中的主键值或特定实现中的值。 |
| type | string | 1- Order ID  2 - Confirmation code<br>1- 订单 ID  2 - 确认码 |

### <a id='com.ctrip.car.openapiservice.dto.booking.vehcancelrqcore'></a>com.ctrip.car.openapiservice.dto.booking.VehCancelRQCore

Identifies the common, or core, information associated with the request for retrieval of a rental vehicle reservation.
标识与检索租赁车辆预订请求相关的常见或核心信息。

| Property | Type | Description |
| --- | --- | --- |
| tripOrderId | string | The orderId assigned by Trip.com.<br>Trip.com 分配的订单 ID。 |
| uniqueID | [com.ctrip.car.openapiservice.dto.booking.UniqueID](#com.ctrip.car.openapiservice.dto.booking.uniqueid) |  |

### <a id='com.ctrip.car.openapiservice.dto.booking.vehcancelrscore'></a>com.ctrip.car.openapiservice.dto.booking.VehCancelRSCore

Identify the common, or core information associated with the request for the cancellation of a rental vehicle reservation.
标识与取消租赁车辆预订请求相关的常见或核心信息。

| Property | Type | Description |
| --- | --- | --- |
| cancelPenalty | [cancelPenalty](#cancelpenalty) |  |
| uniqueID | [com.ctrip.car.openapiservice.dto.booking.UniqueID](#com.ctrip.car.openapiservice.dto.booking.uniqueid) |  |

### <a id='com.ctrip.car.openapiservice.dto.booking.vehrentalcore'></a>com.ctrip.car.openapiservice.dto.booking.VehRentalCore

Contain rental dates, times, and locations.
包含租赁日期、时间和地点。

| Property | Type | Description |
| --- | --- | --- |
| offLocServices | Array of [com.ctrip.car.openapiservice.dto.booking.OffLocService](#com.ctrip.car.openapiservice.dto.booking.offlocservice) | Service circle information & guest location information for the special service<br>特殊服务的服务范围信息和客人位置信息 |
| pickUpDateTime | string | pickUpDateTime yyyy-MM-ddTHH:mm. E.g. 2024-02-05T12:00<br>取车时间 yyyy-MM-ddTHH:mm。例如 2024-02-05T12:00 |
| pickUpLocation | [com.ctrip.car.openapiservice.dto.list.PickUpLocation](#com.ctrip.car.openapiservice.dto.list.pickuplocation) |  |
| returnDateTime | string | returnDateTime yyyy-MM-ddTHH:mm. E.g. 2024-02-07T12:00<br>还车时间 yyyy-MM-ddTHH:mm。例如 2024-02-07T12:00 |
| returnLocation | [com.ctrip.car.openapiservice.dto.list.ReturnLocation](#com.ctrip.car.openapiservice.dto.list.returnlocation) |  |

### <a id='com.ctrip.car.openapiservice.dto.booking.vehresrqcore'></a>com.ctrip.car.openapiservice.dto.booking.VehResRQCore

Identifies the common, or core, information associated with the request for the reservation of a rental vehicle.
标识与租赁车辆预订请求相关的常见或核心信息。

| Property | Type | Description |
| --- | --- | --- |
| customer | [com.ctrip.car.openapiservice.dto.booking.Customer](#com.ctrip.car.openapiservice.dto.booking.customer) |  |
| depositFree | [com.ctrip.car.openapiservice.dto.list.DepositFree](#com.ctrip.car.openapiservice.dto.list.depositfree) |  |
| estimatedTotalAmount | [estimatedTotalAmount](#estimatedtotalamount) |  |
| estimatedCustomerAmount | [estimatedCustomerAmount](#estimatedcustomeramount) |  |
| rateQualifier | [com.ctrip.car.openapiservice.dto.list.RateQualifier](#com.ctrip.car.openapiservice.dto.list.ratequalifier) |  |
| specialEquipPrefs | Array of [com.ctrip.car.openapiservice.dto.booking.SpecialEquipPref](#com.ctrip.car.openapiservice.dto.booking.specialequippref) | Indicates the preferences for one or more specific items of additional equipment, such as ski racks, child seats, etc.<br>指示对一项或多项特定附加设备的偏好，例如滑雪架、儿童座椅等。 |
| vehPref | [com.ctrip.car.openapiservice.dto.list.VehPref](#com.ctrip.car.openapiservice.dto.list.vehpref) |  |
| vehRentalCore | [com.ctrip.car.openapiservice.dto.booking.VehRentalCore](#com.ctrip.car.openapiservice.dto.booking.vehrentalcore) |  |
| vendorPref | [com.ctrip.car.openapiservice.dto.list.Vendor](#com.ctrip.car.openapiservice.dto.list.vendor) |  |

### <a id='com.ctrip.car.openapiservice.dto.booking.vehresrqinfo'></a>com.ctrip.car.openapiservice.dto.booking.VehResRQInfo

Identifies the supplemental information associated with the request for the reservation of a rental vehicle.
标识与租赁车辆预订请求相关的补充信息。

| Property | Type | Description |
| --- | --- | --- |
| arrivalDetail | [com.ctrip.car.openapiservice.dto.booking.ArrivalDetail](#com.ctrip.car.openapiservice.dto.booking.arrivaldetail) |  |
| reference | [com.ctrip.car.openapiservice.dto.booking.Reference](#com.ctrip.car.openapiservice.dto.booking.reference) |  |
| tripOrderId | string | The orderId assigned by Trip.com.<br>Trip.com 分配的订单 ID。 |

### <a id='com.ctrip.car.openapiservice.dto.booking.vehresrscore'></a>com.ctrip.car.openapiservice.dto.booking.VehResRSCore

Identifies the common, or core, information associated with the response providing information on the reservation of a rental vehicle. 
标识与提供租赁车辆预订信息的响应相关的常见或核心信息。

| Property | Type | Description |
| --- | --- | --- |
| vehReservation | [com.ctrip.car.openapiservice.dto.booking.VehReservation](#com.ctrip.car.openapiservice.dto.booking.vehreservation) |  |

### <a id='com.ctrip.car.openapiservice.dto.booking.vehresstatusnotifrqcore'></a>com.ctrip.car.openapiservice.dto.booking.VehResStatusNotifRQCore

Reservation Status
预订状态

| Property | Type | Description |
| --- | --- | --- |
| vehReservation | [com.ctrip.car.openapiservice.dto.booking.VehReservation](#com.ctrip.car.openapiservice.dto.booking.vehreservation) |  |

### <a id='com.ctrip.car.openapiservice.dto.booking.vehreservation'></a>com.ctrip.car.openapiservice.dto.booking.VehReservation

veh Reservation result
车辆预订结果

| Property | Type | Description |
| --- | --- | --- |
| reservationStatus | string | Refers to booking status. Accepted: The order has been created but not yet confirmed. Confirmed: The order has been confirmed. Cancelled: The order has been cancelled. CheckIn: The customer has picked up the car. CheckOut: The customer has returned the car. NoShow: The customer has not shown up after the pick-up time, and the vendor confirms with the user that he or she will not pick up the car.  The statuses of "Accepted", "Confirmed" and "Cancelled" are a must for partners to return to Trip.com, and Trip.com prefer to obtain it through vehRes and vehResStatusSearch. "CheckIn", "CheckOut" and "Noshow" are not the statuses that partners must transmit, but if the partner has the ability to transmit these statuses, Trip.com prefers to obtain it through vehResStatusNotif.<br>指预订状态。Accepted：订单已创建但尚未确认。Confirmed：订单已确认。Cancelled：订单已取消。CheckIn：客户已取车。CheckOut：客户已还车。NoShow：客户在取车时间后未出现，且供应商与用户确认其不会取车。合作伙伴必须向 Trip.com 返回“Accepted”、“Confirmed”和“Cancelled”状态，Trip.com 倾向于通过 vehRes 和 vehResStatusSearch 获取这些状态。“CheckIn”、“CheckOut”和“Noshow”不是合作伙伴必须传输的状态，但如果合作伙伴有能力传输这些状态，Trip.com 倾向于通过 vehResStatusNotif 获取。 |
| vehSegmentCore | [com.ctrip.car.openapiservice.dto.booking.VehSegmentCore](#com.ctrip.car.openapiservice.dto.booking.vehsegmentcore) |  |


### <a id='com.ctrip.car.openapiservice.dto.booking.vehretresrqcore'></a>com.ctrip.car.openapiservice.dto.booking.VehRetResRQCore

Identify the common, or core information associated with the request for retrieval of a rental vehicle reservation.
标识与检索租赁车辆预订请求相关的常见或核心信息。

| Property | Type | Description |
| --- | --- | --- |
| tripOrderId | string | The orderId assigned by Trip.com.<br>Trip.com 分配的订单 ID。 |
| uniqueID | [com.ctrip.car.openapiservice.dto.booking.UniqueID](#com.ctrip.car.openapiservice.dto.booking.uniqueid) |  |

### <a id='com.ctrip.car.openapiservice.dto.booking.vehretresrscore'></a>com.ctrip.car.openapiservice.dto.booking.VehRetResRSCore

Identifies the common, or core, information associated with the response providing information on the reservation of a rental vehicle.
标识与提供租赁车辆预订信息的响应相关的常见或核心信息。

| Property | Type | Description |
| --- | --- | --- |
| vehReservation | [com.ctrip.car.openapiservice.dto.booking.VehReservation](#com.ctrip.car.openapiservice.dto.booking.vehreservation) |  |

### <a id='com.ctrip.car.openapiservice.dto.booking.vehsegmentcore'></a>com.ctrip.car.openapiservice.dto.booking.VehSegmentCore

Common, or core, information associated with a reservation period and a reserved vehicle.
标识与预订期间和预订车辆相关的常见或核心信息。

| Property | Type | Description |
| --- | --- | --- |
| confIDs | Array of [com.ctrip.car.openapiservice.dto.booking.ConfID](#com.ctrip.car.openapiservice.dto.booking.confid) | 1- Order ID  2 - Confirmation number  The type of ConID can be the Order ID or a confirmation number. The order ID is used to obtain the ID for the order after the order is successfully created by the vendor. The confirmation number is used to obtain whether the order is confirmed successfully after the order is created. Sometimes the order ID and confirmation number could be the same.<br>1- 订单 ID  2 - 确认号  ConfID 的类型可以是订单 ID 或确认号。订单 ID 用于在供应商成功创建订单后获取订单的 ID。确认号用于在订单创建后获取订单是否成功确认。有时订单 ID 和确认号可能是相同的。 |
| vehRentalCore | [com.ctrip.car.openapiservice.dto.booking.VehRentalCore](#com.ctrip.car.openapiservice.dto.booking.vehrentalcore) |  |
| vehicle | [com.ctrip.car.openapiservice.dto.list.Vehicle](#com.ctrip.car.openapiservice.dto.list.vehicle) |  |
| vendor | [com.ctrip.car.openapiservice.dto.list.Vendor](#com.ctrip.car.openapiservice.dto.list.vendor) |  |

### <a id='com.ctrip.car.openapiservice.dto.detail.customer'></a>com.ctrip.car.openapiservice.dto.detail.Customer

Customer infomation.
客户信息。

| Property | Type | Description |
| --- | --- | --- |
| citizenCountryCode | string | Name of the (self-professed) country that is claimed for citizenship，A 2 character country code as defined in ISO3166.<br>声称拥有公民身份的国家名称，ISO3166 中定义的 2 字符国家代码。 |
| driverAge | integer | Driver's age<br>驾驶员年龄 |

### <a id='com.ctrip.car.openapiservice.dto.detail.equipcharge'></a>com.ctrip.car.openapiservice.dto.detail.EquipCharge

Charge
费用

| Property | Type | Description |
| --- | --- | --- |
| chargeEquip | [chargeEquip](#chargeequip) |  |
| includedInEstTotalInd | boolean | When true, indicates the item's charges are included in the estimated total amount (in TotalCharge) and when false, the item is not included in the estimated total amount.<br>如果为 true，表示该项目的费用包含在预估总金额中（在 TotalCharge 中）；如果为 false，则该项目不包含在预估总金额中。 |
| taxAmount | [com.ctrip.car.openapiservice.dto.list.TaxAmount](#com.ctrip.car.openapiservice.dto.list.taxamount) |  |
| taxInclusive | boolean | If true, the tax is included in the amount.<br>如果为 true，则金额中包含税费。 |

### <a id='com.ctrip.car.openapiservice.dto.detail.pricedcoverage'></a>com.ctrip.car.openapiservice.dto.detail.PricedCoverage

Coverage information
保险信息

| Property | Type | Description |
| --- | --- | --- |
| charge | [charge](#charge) |  |
| coverageAmount | [coverageAmount](#coverageamount) |  |
| coverageType | string | Identify the type of coverage, for example, collision damage waiver. Refer to OpenTravel Code List Vehicle Coverage Type (VCT).<br>标识保险类型，例如碰撞损害豁免。参考 OpenTravel 代码列表车辆保险类型 (VCT)。 |
| deductibleAmount | [deductibleAmount](#deductibleamount) |  |
| includedInEstTotalInd | boolean | When true, indicates the item's charges are included in the estimated total amount (in TotalCharge) and when false, the item is not included in the estimated total amount.<br>如果为 true，表示该项目的费用包含在预估总金额中（在 TotalCharge 中）；如果为 false，则该项目不包含在预估总金额中。 |
| taxAmount | [com.ctrip.car.openapiservice.dto.list.TaxAmount](#com.ctrip.car.openapiservice.dto.list.taxamount) |  |
| taxInclusive | boolean | If true, the tax is included in the amount.<br>如果为 true，则金额中包含税费。 |

### <a id='com.ctrip.car.openapiservice.dto.detail.pricedequip'></a>com.ctrip.car.openapiservice.dto.detail.PricedEquip

specific items of additional equipment, such as ski racks, child seats, etc.
具体的附加设备项目，如滑雪架、儿童座椅等。

| Property | Type | Description |
| --- | --- | --- |
| charge | [com.ctrip.car.openapiservice.dto.detail.EquipCharge](#com.ctrip.car.openapiservice.dto.detail.equipcharge) |  |
| equipType | string | Identify the specific type of special equipment. Refer to OpenTravel Code List Equipment Type (EQP).<br>标识特殊设备的具体类型。参考 OpenTravel 代码列表设备类型 (EQP)。 |
| quantity | integer | Amount of additional equipment that can be purchased<br>可购买的附加设备数量 |

### <a id='com.ctrip.car.openapiservice.dto.detail.reference'></a>com.ctrip.car.openapiservice.dto.detail.Reference

Information by which this availability quote can be later cross-referenced
稍后可用于交叉引用此可用性报价的信息

| Property | Type | Description |
| --- | --- | --- |
| id | string | A unique identifying value assigned by the creating system. The ID attribute may be used to reference a primary-key value within a database or in a particular implementation.<br>由创建系统分配的唯一标识值。ID 属性可用于引用数据库中的主键值或特定实现中的值。 |

### <a id='com.ctrip.car.openapiservice.dto.detail.rentalinfo'></a>com.ctrip.car.openapiservice.dto.detail.RentalInfo

Contains information for a vehicle rental.
包含车辆租赁信息。

| Property | Type | Description |
| --- | --- | --- |
| customer | [com.ctrip.car.openapiservice.dto.detail.Customer](#com.ctrip.car.openapiservice.dto.detail.customer) |  |
| rateQualifier | [com.ctrip.car.openapiservice.dto.list.RateQualifier](#com.ctrip.car.openapiservice.dto.list.ratequalifier) |  |
| vehPref | [com.ctrip.car.openapiservice.dto.list.VehPref](#com.ctrip.car.openapiservice.dto.list.vehpref) |  |
| vehRentalCore | [com.ctrip.car.openapiservice.dto.list.VehRentalCoreRQ](#com.ctrip.car.openapiservice.dto.list.vehrentalcorerq) |  |
| vendorPref | [com.ctrip.car.openapiservice.dto.list.Vendor](#com.ctrip.car.openapiservice.dto.list.vendor) |  |

### <a id='com.ctrip.car.openapiservice.dto.detail.rentalrate'></a>com.ctrip.car.openapiservice.dto.detail.RentalRate

Information on the rates associated with this vehicle. Rate information can include the distance and the base rental cost, along with information on the various factors that may influence this rate. This element may repeat to allow different distances to be made available for different charges. For example, $20.00 with 100 miles per day or $30.00 for unlimited mileage.
与该车辆相关的费率信息。费率信息可以包括距离和基本租赁费用，以及可能影响该费率的各种因素的信息。此元素可能会重复，以允许针对不同费用提供不同的距离。例如，每天 100 英里 20.00 美元或无限里程 30.00 美元。

| Property | Type | Description |
| --- | --- | --- |
| confirmHours | integer | Hours of instant vendor confirmation (unit：hour).<br>供应商即时确认的小时数（单位：小时）。 |
| depositFree | [com.ctrip.car.openapiservice.dto.list.DepositFree](#com.ctrip.car.openapiservice.dto.list.depositfree) |  |
| energyRule | integer | Energy rules offered by the vendor, 1-full to full; 2-same to same<br>供应商提供的燃油规则，1-满取满还；2-同取同还 |
| instantConfirm | boolean | If true, the current rate can be confirmed immediately.<br>如果为 true，当前费率可以立即确认。 |
| pricedCoverages | Array of [com.ctrip.car.openapiservice.dto.detail.PricedCoverage](#com.ctrip.car.openapiservice.dto.detail.pricedcoverage) | Coverage information<br>保险信息 |
| pricedEquips | Array of [com.ctrip.car.openapiservice.dto.detail.PricedEquip](#com.ctrip.car.openapiservice.dto.detail.pricedequip) | A collection of special equipment that is part of this quote, along with the charges associated with this equipment. <br>此报价中包含的特殊设备集合，以及与此设备相关的费用。 |
| rateDistance | [com.ctrip.car.openapiservice.dto.list.RateDistance](#com.ctrip.car.openapiservice.dto.list.ratedistance) |  |
| ratePrice | [com.ctrip.car.openapiservice.dto.list.RatePrice](#com.ctrip.car.openapiservice.dto.list.rateprice) |  |
| rateQualifier | [com.ctrip.car.openapiservice.dto.list.RateQualifier](#com.ctrip.car.openapiservice.dto.list.ratequalifier) |  |
| reference | [com.ctrip.car.openapiservice.dto.detail.Reference](#com.ctrip.car.openapiservice.dto.detail.reference) |  |
| vehicleCharges | Array of [com.ctrip.car.openapiservice.dto.list.VehicleCharge](#com.ctrip.car.openapiservice.dto.list.vehiclecharge) | Information on the charges associated with this vehicle. Such charges may include the base rental amount, additional mileage amounts, fuel costs, etc.<br>与该车辆相关的费用信息。此类费用可能包括基本租赁金额、额外里程金额、燃油成本等。 |


### <a id='com.ctrip.car.openapiservice.dto.list.customer'></a>com.ctrip.car.openapiservice.dto.list.Customer

Customer information
客户信息

| Property | Type | Description |
| --- | --- | --- |
| citizenCountryCode | string | Name of the (self-professed) country that is claimed for citizenship，A 2 character country code as defined in ISO3166.<br>声称拥有公民身份的国家名称，ISO3166 中定义的 2 字符国家代码。 |
| driverAge | integer | Driver's age<br>驾驶员年龄 |

### <a id='com.ctrip.car.openapiservice.dto.list.depositfree'></a>com.ctrip.car.openapiservice.dto.list.DepositFree

Information on deposit-fee status and amount
免押金状态及金额信息

'Deposit free' business concept: The 'Deposit free' program enables qualified customers to bypass traditional security deposits through Trip.com's credit authorization system. The platform guarantees reservation liabilities while supporting automated payment settlements via API integration.If you need to integrate the deposit-free function, please connect to interfaces such as notifDeposit.
“免押金”业务概念：“免押金”计划使符合条件的客户能够通过 Trip.com 的信用授权系统绕过传统的保证金。该平台在支持通过 API 集成自动支付结算的同时，为预订责任提供担保。如果您需要集成免押金功能，请连接 notifDeposit 等接口。

| Property | Type | Description |
| --- | --- | --- |
| depositAmount | [com.ctrip.car.openapiservice.dto.list.PriceDTO](#com.ctrip.car.openapiservice.dto.list.pricedto) |  |
| supportDepositFree | boolean | Indicates whether the product can support deposit-free service<br>指示产品是否支持免押金服务 |

### <a id='com.ctrip.car.openapiservice.dto.list.offlocservicerq'></a>com.ctrip.car.openapiservice.dto.list.OffLocServiceRQ

Service circle information for the special service (car delivery service).
特殊服务（送车上门服务）的服务范围信息。

The system shall enforce single service zone inclusion per request when circles' geographical boundaries are non-overlapping
Car delivery service eligibility is restricted to fully prepaid rate plans only; availability must not be exposed in alternative pricing rateplan
当服务范围的地理边界不重叠时，系统应强制每个请求仅包含一个服务区域。
送车上门服务资格仅限于全额预付费率计划；可用性不得在替代定价费率计划中公开。

| Property | Type | Description |
| --- | --- | --- |
| circleId | integer | Service circle id<br>服务范围 ID |
| type | string | 'VehDelivery' --  car delivery to guest for pick up 'VehCollection' -- car delivery to guest for return<br>'VehDelivery' -- 送车上门供客人取车 'VehCollection' -- 上门收车供客人还车 |

### <a id='com.ctrip.car.openapiservice.dto.list.offlocservicers'></a>com.ctrip.car.openapiservice.dto.list.OffLocServiceRS

Service circle price information for the special service.
特殊服务的服务范围价格信息。

| Property | Type | Description |
| --- | --- | --- |
| charge | [com.ctrip.car.openapiservice.dto.list.PriceDTO](#com.ctrip.car.openapiservice.dto.list.pricedto) |  |
| circleId | integer | Service circle id<br>服务范围 ID |
| type | string | 'VehDelivery' --  car delivery to guest for pick up 'VehCollection' -- car delivery to guest for return<br>'VehDelivery' -- 送车上门供客人取车 'VehCollection' -- 上门收车供客人还车 |

### <a id='com.ctrip.car.openapiservice.dto.list.pickuplocation'></a>com.ctrip.car.openapiservice.dto.list.PickUpLocation

A code to identify the pick up location, along with an optional code context.
用于标识取车地点的代码，以及可选的代码上下文。

| Property | Type | Description |
| --- | --- | --- |
| codeContext | string | Identify the context of the identifying code (e.g., IATA, ARC, or internal code).<br>标识识别代码的上下文（例如，IATA、ARC 或内部代码）。 |
| locationCode | string | A code used to identify a location.<br>用于标识位置的代码。 |

### <a id='com.ctrip.car.openapiservice.dto.list.pricedto'></a>com.ctrip.car.openapiservice.dto.list.PriceDTO

Deposit free amount
免押金金额

| Property | Type | Description |
| --- | --- | --- |
| amount | number | amount<br>金额 |
| currency | string | currency of the amount, e.g. USD, please refer to CurrencyType enum for the complete list of currencies supported by Trip<br>金额的货币，例如美元，请参考 CurrencyType 枚举以获取 Trip 支持的完整货币列表 |

### <a id='com.ctrip.car.openapiservice.dto.list.pricedcoverage'></a>com.ctrip.car.openapiservice.dto.list.PricedCoverage

Coverage information
保险信息

| Property | Type | Description |
| --- | --- | --- |
| coverageType | string | Identify the type of coverage, for example, collision damage waiver. Refer to OpenTravel Code List Vehicle Coverage Type (VCT).<br>标识保险类型，例如碰撞损害豁免。参考 OpenTravel 代码列表车辆保险类型 (VCT)。 |
| deductibleAmount | [deductibleAmount](#deductibleamount) |  |

### <a id='com.ctrip.car.openapiservice.dto.list.ratedistance'></a>com.ctrip.car.openapiservice.dto.list.RateDistance

Information on the distance that a reserved vehicle may be driven as part of the standard rental charge. Such distance may be unlimited, or a quantity of miles or kilometers for a certain period of time. This may be repeated for situations such as an 8 day rental that has 500 miles per week and 100 miles per additional day.
作为标准租赁费用的一部分，预订车辆可以行驶的距离信息。该距离可以是无限的，也可以是特定时间段内的英里数或公里数。对于例如每周 500 英里、每增加一天 100 英里的 8 天租赁等情况，此信息可能会重复。

| Property | Type | Description |
| --- | --- | --- |
| addionalAmountPerUnit | [addionalAmountPerUnit](#addionalamountperunit) |  |
| addionalAmountUpperLimit | [addionalAmountUpperLimit](#addionalamountupperlimit) |  |
| distUnitName | string | Provides the unit in which distance is measured, when applied to the rental of a vehicle (i.e., miles or kilometers).<br>提供测量距离的单位，当应用于车辆租赁时（即英里或公里）。 |
| freeMileType | string | The form in which the vendor offers free distance: "per_rental" - total limit of free distance "per_day" - daily limit of free distance<br>供应商提供免费距离的形式："per_rental" - 免费距离总限额 "per_day" - 每日免费距离限额 |
| maxFreeDistance | integer | Maximum free distance provided by the vendor.<br>供应商提供的最大免费距离。 |
| unlimited | boolean | If true, there is no distance restriction. If false, "maxFreeDistance", "freeMileType", "distUnitName", "addionalAmountPerUnit" are required, "addionalAmountUpperLimit" is optional.<br>如果为 true，则没有距离限制。如果为 false，"maxFreeDistance"、"freeMileType"、"distUnitName"、"addionalAmountPerUnit" 是必需的，"addionalAmountUpperLimit" 是可选的。 |

### <a id='com.ctrip.car.openapiservice.dto.list.rateprice'></a>com.ctrip.car.openapiservice.dto.list.RatePrice

Information on rates provided by the vendor.
供应商提供的费率信息。

| Property | Type | Description |
| --- | --- | --- |
| estimatedTotalAmount | [estimatedTotalAmount](#estimatedtotalamount) |  |
| payMode | integer | Information on the modes of the offer provided by the vendor, 1-Pay on Arrival; 2-Prepay; 3-Prepay Partially<br>供应商提供的报价模式信息，1-到店支付；2-预付；3-部分预付 |
| ratePayOnArrivedAmount | [ratePayOnArrivedAmount](#ratepayonarrivedamount) |  |
| ratePrepaidAmount | [ratePrepaidAmount](#rateprepaidamount) |  |


### <a id='com.ctrip.car.openapiservice.dto.list.ratequalifier'></a>com.ctrip.car.openapiservice.dto.list.RateQualifier

Rate qualifiers and promotions.
费率资格和促销。

| Property | Type | Description |
| --- | --- | --- |
| contractCode | string | Indicate the contract code between partners.<br>指示合作伙伴之间的合同代码。 |
| corpDiscountNmbr | string | This is the vendor specific code used to identify a special rate associated with a specific organization.<br>这是供应商特定的代码，用于标识与特定组织相关的特殊费率。 |
| promotionCode | string | Promotion code is the identifier used by the host to link directly with a specific named advertising campaign. By including the required code, the client is able to gain access to special offers which may have been created for a specifically targeted group via a CRM system or for a wider advertising campaign using Television or press adverts.<br>促销代码是主机用于直接链接到特定命名广告活动的标识符。通过包含所需的代码，客户可以获得通过 CRM 系统为特定目标受众创建的或用于电视或新闻广告等更广泛广告活动的优惠。 |
| rateCategory | string | The RateCategory attribute defines a set of valid values for the category of a rate. Typically rates are offered as either Leisure rates or Business (Corporate) rates, with a business rate usually including additional costs such as the cost of insurance, etc. This set of values defines the rate categories. Refer to OpenTravel Code List Rate Category (RTC).<br>RateCategory 属性定义了一组有效的费率类别值。通常费率分为休闲费率或商务（公司）费率，商务费率通常包括额外的费用，如保险费等。这组值定义了费率类别。参考 OpenTravel 代码列表费率类别 (RTC)。 |
| rateQualifier | string | This is the vendor specific code for rate codes (e.g. WES, 2A, DLY00).<br>这是费率代码的供应商特定代码（例如 WES、2A、DLY00）。 |

### <a id='com.ctrip.car.openapiservice.dto.list.reference'></a>com.ctrip.car.openapiservice.dto.list.Reference

Information by which this availability quote can be later cross-referenced
稍后可用于交叉引用此可用性报价的信息

| Property | Type | Description |
| --- | --- | --- |
| id | string | A unique identifying value assigned by the creating system. The ID attribute may be used to reference a primary-key value within a database or in a particular implementation.<br>由创建系统分配的唯一标识值。ID 属性可用于引用数据库中的主键值或特定实现中的值。 |

### <a id='com.ctrip.car.openapiservice.dto.list.rentalrate'></a>com.ctrip.car.openapiservice.dto.list.RentalRate

Information on the rates associated with this vehicle. Rate information can include the distance and the base rental cost, along with information on the various factors that may influence this rate. This element may repeat to allow different distances to be made available for different charges. For example, $20.00 with 100 miles per day or $30.00 for unlimited mileage.
与该车辆相关的费率信息。费率信息可以包括距离和基本租赁费用，以及可能影响该费率的各种因素的信息。此元素可能会重复，以允许针对不同费用提供不同的距离。例如，每天 100 英里 20.00 美元或无限里程 30.00 美元。

| Property | Type | Description |
| --- | --- | --- |
| confirmHours | integer | Hours of instant vendor confirmation (unit：hour).<br>供应商即时确认的小时数（单位：小时）。 |
| depositFree | [com.ctrip.car.openapiservice.dto.list.DepositFree](#com.ctrip.car.openapiservice.dto.list.depositfree) |  |
| energyRule | integer | Energy rules offered by the vendor, 1-full to full; 2-same to same<br>供应商提供的燃油规则，1-满取满还；2-同取同还 |
| instantConfirm | boolean | If true, the current rate can be confirmed immediately.<br>如果为 true，当前费率可以立即确认。 |
| pricedCoverages | Array of [com.ctrip.car.openapiservice.dto.list.PricedCoverage](#com.ctrip.car.openapiservice.dto.list.pricedcoverage) | Coverage information<br>保险信息 |
| rateDistance | [com.ctrip.car.openapiservice.dto.list.RateDistance](#com.ctrip.car.openapiservice.dto.list.ratedistance) |  |
| ratePrice | [com.ctrip.car.openapiservice.dto.list.RatePrice](#com.ctrip.car.openapiservice.dto.list.rateprice) |  |
| rateQualifier | [com.ctrip.car.openapiservice.dto.list.RateQualifier](#com.ctrip.car.openapiservice.dto.list.ratequalifier) |  |
| reference | [com.ctrip.car.openapiservice.dto.list.Reference](#com.ctrip.car.openapiservice.dto.list.reference) |  |
| vehicleCharges | Array of [com.ctrip.car.openapiservice.dto.list.VehicleCharge](#com.ctrip.car.openapiservice.dto.list.vehiclecharge) | Information on the charges associated with this vehicle. Such charges may include the base rental amount, additional mileage amounts, fuel costs, etc.<br>与该车辆相关的费用信息。此类费用可能包括基本租赁金额、额外里程金额、燃油成本等。 |

### <a id='com.ctrip.car.openapiservice.dto.list.returnlocation'></a>com.ctrip.car.openapiservice.dto.list.ReturnLocation

A code to identify the return location, along with an optional code context.
用于标识还车地点的代码，以及可选的代码上下文。

| Property | Type | Description |
| --- | --- | --- |
| codeContext | string | Identify the context of the identifying code (e.g., IATA, ARC, or internal code).<br>标识识别代码的上下文（例如，IATA、ARC 或内部代码）。 |
| locationCode | string | A code used to identify a location.<br>用于标识位置的代码。 |

### <a id='com.ctrip.car.openapiservice.dto.list.taxamount'></a>com.ctrip.car.openapiservice.dto.list.TaxAmount

Detailed information on one specific tax associated with a specific charge
与特定费用相关的特定税费的详细信息

| Property | Type | Description |
| --- | --- | --- |
| amount | [amount](#amount) |  |
| taxCode | string | A code for the tax that is agreed upon between trading partners.<br>贸易伙伴之间约定的税费代码。 |

### <a id='com.ctrip.car.openapiservice.dto.list.vehavailcore'></a>com.ctrip.car.openapiservice.dto.list.VehAvailCore

A collection of vehicles along with their availability and associated rate information.
车辆集合及其可用性和相关费率信息。

| Property | Type | Description |
| --- | --- | --- |
| rentalRates | Array of [com.ctrip.car.openapiservice.dto.list.RentalRate](#com.ctrip.car.openapiservice.dto.list.rentalrate) | Information on the rates associated with this vehicle. Rate information can include the distance and the base rental cost, along with information on the various factors that may influence this rate. This element may repeat to allow different distances to be made available for different charges. For example, $20.00 with 100 miles per day or $30.00 for unlimited mileage.This describes time, mileage and other charges.<br>与该车辆相关的费率信息。费率信息可以包括距离和基本租赁费用，以及可能影响该费率的各种因素的信息。此元素可能会重复，以允许针对不同费用提供不同的距离。例如，每天 100 英里 20.00 美元或无限里程 30.00 美元。这描述了时间、里程和其他费用。 |
| vehicle | [com.ctrip.car.openapiservice.dto.list.Vehicle](#com.ctrip.car.openapiservice.dto.list.vehicle) |  |

### <a id='com.ctrip.car.openapiservice.dto.list.vehavailrqcore'></a>com.ctrip.car.openapiservice.dto.list.VehAvailRQCore

Core availability request information.
核心可用性请求信息。

| Property | Type | Description |
| --- | --- | --- |
| rateQualifier | [com.ctrip.car.openapiservice.dto.list.RateQualifier](#com.ctrip.car.openapiservice.dto.list.ratequalifier) |  |
| status | string | The status of the vehicle availability and/or rates are being requested for, e.g. available and waitlist.<br>请求的车辆可用性和/或费率的状态，例如可用和候补。 |
| vehPrefs | Array of [com.ctrip.car.openapiservice.dto.list.VehPref](#com.ctrip.car.openapiservice.dto.list.vehpref) | Vehicle preferences.<br>车辆偏好。 |
| vehRentalCore | [com.ctrip.car.openapiservice.dto.list.VehRentalCoreRQ](#com.ctrip.car.openapiservice.dto.list.vehrentalcorerq) |  |
| vendorPref | [com.ctrip.car.openapiservice.dto.list.Vendor](#com.ctrip.car.openapiservice.dto.list.vendor) |  |

### <a id='com.ctrip.car.openapiservice.dto.list.vehavailrqinfo'></a>com.ctrip.car.openapiservice.dto.list.VehAvailRQInfo

Supplemental information that may be included in a request for vehicle availability and rates.
可能包含在车辆可用性和费率请求中的补充信息。

| Property | Type | Description |
| --- | --- | --- |
| customer | [com.ctrip.car.openapiservice.dto.list.Customer](#com.ctrip.car.openapiservice.dto.list.customer) |  |

### <a id='com.ctrip.car.openapiservice.dto.list.vehavailrscore'></a>com.ctrip.car.openapiservice.dto.list.VehAvailRSCore

Identifies the common, or core, information associated with the response providing information on the availability of rental vehicles.The VehicleAvailRSType complex type identifies the data that is considered common when describing the availability and rates of rental vehicles.
标识与提供租赁车辆可用性信息的响应相关的常见或核心信息。VehicleAvailRSType 复杂类型标识了在描述租赁车辆的可用性和费率时被视为通用的数据。

| Property | Type | Description |
| --- | --- | --- |
| vehRentalCore | [com.ctrip.car.openapiservice.dto.list.VehRentalCoreRS](#com.ctrip.car.openapiservice.dto.list.vehrentalcorers) |  |
| vehVendorAvails | Array of [com.ctrip.car.openapiservice.dto.list.VehVendorAvail](#com.ctrip.car.openapiservice.dto.list.vehvendoravail) | A collection of vendors for which vehicle availability is available.<br>提供车辆可用性的供应商集合。 |

### <a id='com.ctrip.car.openapiservice.dto.list.vehmakemodel'></a>com.ctrip.car.openapiservice.dto.list.VehMakeModel

The make and model of the vehicle (e.g., Ford Focus).
车辆的品牌和型号（例如，福特福克斯）。

| Property | Type | Description |
| --- | --- | --- |
| name | string | Provides the code identifying the item.<br>提供标识项目的代码。 |

### <a id='com.ctrip.car.openapiservice.dto.list.vehpref'></a>com.ctrip.car.openapiservice.dto.list.VehPref

A preference for one specific vehicle type.
对一种特定车辆类型的偏好。

| Property | Type | Description |
| --- | --- | --- |
| code | string | A code to identify the vehicle.<br>用于标识车辆的代码。 |

### <a id='com.ctrip.car.openapiservice.dto.list.vehrentalcorerq'></a>com.ctrip.car.openapiservice.dto.list.VehRentalCoreRQ

Contain rental dates, times, and locations.
包含租赁日期、时间和地点。

| Property | Type | Description |
| --- | --- | --- |
| offLocServices | Array of [com.ctrip.car.openapiservice.dto.list.OffLocServiceRQ](#com.ctrip.car.openapiservice.dto.list.offlocservicerq) | Service circle information for the special service (car delivery service). The system shall enforce single service zone inclusion per request when circles' geographical boundaries are non-overlapping Car delivery service eligibility is restricted to fully prepaid rate plans only; availability must not be exposed in alternative pricing rateplan<br>特殊服务（送车上门服务）的服务范围信息。当服务范围的地理边界不重叠时，系统应强制每个请求仅包含一个服务区域。送车上门服务资格仅限于全额预付费率计划；可用性不得在替代定价费率计划中公开。 |
| pickUpDateTime | string | pickUpDateTime yyyy-MM-ddTHH:mm. E.g. 2024-02-05T12:00<br>取车时间 yyyy-MM-ddTHH:mm。例如 2024-02-05T12:00 |
| pickUpLocation | [com.ctrip.car.openapiservice.dto.list.PickUpLocation](#com.ctrip.car.openapiservice.dto.list.pickuplocation) |  |
| returnDateTime | string | returnDateTime yyyy-MM-ddTHH:mm. E.g. 2024-02-07T12:00<br>还车时间 yyyy-MM-ddTHH:mm。例如 2024-02-07T12:00 |
| returnLocation | [com.ctrip.car.openapiservice.dto.list.ReturnLocation](#com.ctrip.car.openapiservice.dto.list.returnlocation) |  |

### <a id='com.ctrip.car.openapiservice.dto.list.vehrentalcorers'></a>com.ctrip.car.openapiservice.dto.list.VehRentalCoreRS

Contain rental dates, times, and locations.
包含租赁日期、时间和地点。

| Property | Type | Description |
| --- | --- | --- |
| offLocServices | Array of [com.ctrip.car.openapiservice.dto.list.OffLocServiceRS](#com.ctrip.car.openapiservice.dto.list.offlocservicers) | Service circle price information for the special service.<br>特殊服务的服务范围价格信息。 |
| pickUpDateTime | string | pickUpDateTime yyyy-MM-ddTHH:mm. E.g. 2024-02-05T12:00<br>取车时间 yyyy-MM-ddTHH:mm。例如 2024-02-05T12:00 |
| pickUpLocation | [com.ctrip.car.openapiservice.dto.list.PickUpLocation](#com.ctrip.car.openapiservice.dto.list.pickuplocation) |  |
| returnDateTime | string | returnDateTime yyyy-MM-ddTHH:mm. E.g. 2024-02-07T12:00<br>还车时间 yyyy-MM-ddTHH:mm。例如 2024-02-07T12:00 |
| returnLocation | [com.ctrip.car.openapiservice.dto.list.ReturnLocation](#com.ctrip.car.openapiservice.dto.list.returnlocation) |  |

### <a id='com.ctrip.car.openapiservice.dto.list.vehvendoravail'></a>com.ctrip.car.openapiservice.dto.list.VehVendorAvail

A collection of vendors for which vehicle availability is available.
提供车辆可用性的供应商集合。

| Property | Type | Description |
| --- | --- | --- |
| vehAvailCores | Array of [com.ctrip.car.openapiservice.dto.list.VehAvailCore](#com.ctrip.car.openapiservice.dto.list.vehavailcore) | A collection of vehicles along with their availability and associated rate information.<br>车辆集合及其可用性和相关费率信息。 |
| vendor | [com.ctrip.car.openapiservice.dto.list.Vendor](#com.ctrip.car.openapiservice.dto.list.vendor) |  |

### <a id='com.ctrip.car.openapiservice.dto.list.vehicle'></a>com.ctrip.car.openapiservice.dto.list.Vehicle

The VehicleType complex type identifie sthe data that fully describes a vehicle
VehicleType 复杂类型标识了完整描述车辆的数据。

| Property | Type | Description |
| --- | --- | --- |
| code | string | Any code used to specify an item, for example, type of vehicle etc.<br>用于指定项目的任何代码，例如车辆类型等。 |
| vehMakeModels | Array of [com.ctrip.car.openapiservice.dto.list.VehMakeModel](#com.ctrip.car.openapiservice.dto.list.vehmakemodel) | The make and model of the vehicle (e.g. Ford Focus). The Code attribute may be used for the SIPP code.<br>车辆的品牌和型号（例如福特福克斯）。Code 属性可用于 SIPP 代码。 |

### <a id='com.ctrip.car.openapiservice.dto.list.vehiclecharge'></a>com.ctrip.car.openapiservice.dto.list.VehicleCharge

Information on the charges associated with this vehicle. Such charges may include the base rental amount, additional mileage amounts, fuel costs, etc.
与该车辆相关的费用信息。此类费用可能包括基本租赁金额、额外里程金额、燃油成本等。

| Property | Type | Description |
| --- | --- | --- |
| purpose | integer | Refer to OpenTravel Code List Vehicle Charge Purpose Type (VCP).<br>参考 OpenTravel 代码列表车辆费用用途类型 (VCP)。 |
| code | string | A vendor's internal identifier for the charge item.<br>供应商的费用项目内部标识符。 |
| charge | [charge](#charge) |  |
| title | string | The name of the charge.<br>费用名称。 |
| desc | string | A detailed description of the charge.<br>费用的详细描述。 |
| language | string | The language of title and desc. The default value will be (EN).<br>标题和描述的语言。默认值为 (EN)。 |
| payMode | integer | Indicates the payment method of the charge. 1-Pay on Arrival, 2-Prepay<br>指示费用的支付方式。1-到店支付，2-预付 |
| quantity | integer | The number of units of this charge.<br>此费用的单位数量。 |
| includedInRate | boolean | An indication if this amount is included in the base vehicle rate, or is an additonal cost.<br>指示此金额是否包含在基本车辆费率中，或者是否为额外费用。 |
| netAmount | BigDecimal | The net amount for the charge excluding taxes.<br>不含税的费用净额。 |
| vatPercent | BigDecimal | Indicates the tax percentage applied on the charge.<br>指示适用于费用的税率百分比。 |
| taxAmount | [com.ctrip.car.openapiservice.dto.list.TaxAmount](#com.ctrip.car.openapiservice.dto.list.taxamount) |  |
| taxInclusive | boolean | Indicates if the gorss amount includes tax.<br>指示总金额是否包含税费。 |
| selected | boolean | Indicates whether or not this charge item is currently selected.<br>指示当前是否选择了此费用项目。 |

### <a id='com.ctrip.car.openapiservice.dto.list.vendor'></a>com.ctrip.car.openapiservice.dto.list.Vendor

Vendor preferences
供应商偏好

| Property | Type | Description |
| --- | --- | --- |
| code | string | Identify a company by the company code.<br>通过公司代码标识公司。 |
| name | string | Used to provide the company common name.<br>用于提供公司通用名称。 |


### <a id='com.ctrip.car.openapiservice.dto.search.additionalpickuprule'></a>com.ctrip.car.openapiservice.dto.search.AdditionalPickupRule

Additional pickup requirements.
额外的取车要求。

| Property | Type | Description |
| --- | --- | --- |
| driverLicenseNote | string | Indicate additional requirements for driver's license and translations provided by the branch (avoid conflicts with driver's license translation options).<br>指示驾驶执照的额外要求和分部提供的翻译（避免与驾驶执照翻译选项冲突）。 |
| idDescription | string | Indicate additional requirements for ID documents (such as passports) and translations provided by the branch (avoid conflicts with driver's license translation options).<br>指示身份证件（如护照）的额外要求和分部提供的翻译（避免与驾驶执照翻译选项冲突）。 |
| otherPickupMaterial | string | Other document requirements.<br>其他文件要求。 |
| ticketRequiredInd | boolean | If true, flight/train tickets are required at pick-up.<br>如果为 true，则取车时需要机票/火车票。 |

### <a id='com.ctrip.car.openapiservice.dto.search.address'></a>com.ctrip.car.openapiservice.dto.search.Address

Information about an address that identifies a location for a specific purposes.
标识特定用途位置的地址信息。

| Property | Type | Description |
| --- | --- | --- |
| cityName | string |  |
| countryCode | string | ISO 3166 code for a country.<br>国家的 ISO 3166 代码。 |
| countryName | string |  |
| position | [com.ctrip.car.openapiservice.dto.search.Position](#com.ctrip.car.openapiservice.dto.search.position) |  |
| postalCode | string |  |
| stateProvCode | string | The standard code or abbreviation for the state, province, or region.<br>州、省或地区的标准代码或缩写。 |
| stateProvName | string | State or Province name<br>州或省名称 |
| streetNmbr | [com.ctrip.car.openapiservice.dto.search.StreetNmbr](#com.ctrip.car.openapiservice.dto.search.streetnmbr) |  |

### <a id='com.ctrip.car.openapiservice.dto.search.advancebookingrule'></a>com.ctrip.car.openapiservice.dto.search.AdvanceBookingRule

Indicates whether or not advance booking is required for this rate and if so, what the advance booking requirements are.
指示此费率是否需要提前预订，如果需要，提前预订的要求是什么。

| Property | Type | Description |
| --- | --- | --- |
| maxAdvancedBookingTime | [com.ctrip.car.openapiservice.dto.search.AdvancedBookingTime](#com.ctrip.car.openapiservice.dto.search.advancedbookingtime) |  |
| minAdvancedBookingTime | [com.ctrip.car.openapiservice.dto.search.AdvancedBookingTime](#com.ctrip.car.openapiservice.dto.search.advancedbookingtime) |  |
| requiredInd | boolean | If true, advanced booking is required.<br>如果为 true，则需要提前预订。 |

### <a id='com.ctrip.car.openapiservice.dto.search.advancedbookingtime'></a>com.ctrip.car.openapiservice.dto.search.AdvancedBookingTime

Maximum time cars can be booked in advance
可以提前预订车辆的最长时间

| Property | Type | Description |
| --- | --- | --- |
| period | integer | Advance booking period<br>提前预订期 |
| type | string | Unit type of advance booking period.<br>提前预订期的单位类型。 |

### <a id='com.ctrip.car.openapiservice.dto.search.agerule'></a>com.ctrip.car.openapiservice.dto.search.AgeRule

Information associated with the age requirements of renting a vehicle.
与租赁车辆年龄要求相关的信息。

| Property | Type | Description |
| --- | --- | --- |
| ageSurCharge | Array of [com.ctrip.car.openapiservice.dto.search.AgeSurcharge](#com.ctrip.car.openapiservice.dto.search.agesurcharge) | Specific charge information for young drivers and elderly drivers.<br>针对年轻驾驶员和老年驾驶员的具体费用信息。 |
| maximumAge | integer | Identify the maximum age of a person allowed to rent a vehicle from this rental facility.<br>标识允许从此租赁设施租赁车辆的人员的最大年龄。 |
| minimumAge | integer | Identify the minimum age of a person allowed to rent a vehicle from this rental facility.<br>标识允许从此租赁设施租赁车辆的人员的最小年龄。 |

### <a id='com.ctrip.car.openapiservice.dto.search.agesurcharge'></a>com.ctrip.car.openapiservice.dto.search.AgeSurcharge

Specific charge information for young drivers and elderly drivers.
针对年轻驾驶员和老年驾驶员的具体费用信息。

| Property | Type | Description |
| --- | --- | --- |
| ageChargeType | string | Charge by each of orders or by day<br>按每笔订单或按天收费 |
| ageLimit | integer | For young drivers, ageLimit means that over the age of xx there will no longer be a youth driving charge; For elderly drivers, ageLimit means that the Senior Driving Fee will only start to be charged over the age of xx.<br>对于年轻驾驶员，ageLimit 意味着超过 xx 岁将不再收取年轻驾驶员费用；对于老年驾驶员，ageLimit 意味着超过 xx 岁才开始收取老年驾驶员费用。 |
| chargeAmount | [com.ctrip.car.openapiservice.dto.search.PriceDTO](#com.ctrip.car.openapiservice.dto.search.pricedto) |  |
| driverAgeType | string | Type of driver, distinguishing here only between young and old drivers.<br>驾驶员类型，此处仅区分年轻驾驶员和老年驾驶员。 |
| maximumCharge | [com.ctrip.car.openapiservice.dto.search.PriceDTO](#com.ctrip.car.openapiservice.dto.search.pricedto) |  |
| requiredCharge | boolean | If true,this driver group need to be charged. If true, "ageLimit", "ageChargeType", "chargeAmount", "taxInclusive" are required; "maximumCharge" is optional.<br>如果为 true，则需要对此驾驶员组收费。如果为 true，"ageLimit"、"ageChargeType"、"chargeAmount"、"taxInclusive" 是必需的；"maximumCharge" 是可选的。 |
| taxInclusive | boolean | If true, this amount is tax inclusive.<br>如果为 true，则此金额包含税费。 |

### <a id='com.ctrip.car.openapiservice.dto.search.cancelpolicydetail'></a>com.ctrip.car.openapiservice.dto.search.CancelPolicyDetail

Regarding the penalty charging rules for canceling orders. You could give a rule list according to different time periods before picking up the car. For example, free cancellation 48 hours before picking up the car. 10% of the rental fee will be charged for 24-48 hours before picking up the car, with a upper limit charge of $200.
关于取消订单的罚款规则。您可以根据取车前的不同时间段给出规则列表。例如，取车前 48 小时免费取消。取车前 24-48 小时将收取租赁费用的 10%，上限为 200 美元。

| Property | Type | Description |
| --- | --- | --- |
| advanceHoursMax | integer | The maximum hour of a certain period of time before the pickup. For example, if you want to define a cancellation penalty rule 24-48 hours before the pickup, you should enter '48' here.<br>取车前特定时间段的最大小时数。例如，如果您想定义取车前 24-48 小时的取消罚款规则，您应该在此处输入“48”。 |
| advanceHoursMin | integer | The minimum hour of a certain period of time before the pickup. For example, if you want to define a cancellation penalty rule 24-48 hours before the pickup, you should enter '24' here.<br>取车前特定时间段的最小小时数。例如，如果您想定义取车前 24-48 小时的取消罚款规则，您应该在此处输入“24”。 |
| amountUpperLimit | [com.ctrip.car.openapiservice.dto.search.PriceDTO](#com.ctrip.car.openapiservice.dto.search.pricedto) |  |
| chargeMode | integer | Define mode of penalty charge. 1-fixed amount 2-fixed percentage of the total rental amount 3-First day amount as penalty 4-Total rental amount as penalty 5-fixed percentage of the prepaid amount 6-Fixed rental days's rental amount.If '1' is selected, 'fixAmount' is required. If '2/5' is selected, 'percentage' is required. If '6' is selected, 'day' is required.<br>定义罚款模式。1-固定金额 2-总租赁金额的固定百分比 3-第一天金额作为罚款 4-总租赁金额作为罚款 5-预付金额的固定百分比 6-固定租赁天数的租金。如果选择“1”，则需要“fixAmount”。如果选择“2/5”，则需要“percentage”。如果选择“6”，则需要“day”。 |
| day | integer | certain day's amount as penalty<br>特定几天的金额作为罚款 |
| fixedAmount | [com.ctrip.car.openapiservice.dto.search.PriceDTO](#com.ctrip.car.openapiservice.dto.search.pricedto) |  |
| percentage | string | A certain percentage of amount as penalty<br>金额的特定百分比作为罚款 |

### <a id='com.ctrip.car.openapiservice.dto.search.cancelrule'></a>com.ctrip.car.openapiservice.dto.search.CancelRule

Information regarding the cancellation rule.
关于取消规则的信息。

| Property | Type | Description |
| --- | --- | --- |
| cancelRuleDetailList | Array of [com.ctrip.car.openapiservice.dto.search.CancelPolicyDetail](#com.ctrip.car.openapiservice.dto.search.cancelpolicydetail) | Regarding the penalty charging rules for canceling orders. You could give a rule list according to different time periods before picking up the car. For example, free cancellation 48 hours before picking up the car. 10% of the rental fee will be charged for 24-48 hours before picking up the car, with a upper limit charge of $200.<br>关于取消订单的罚款收费规则。您可以根据取车前的不同时间段给出规则列表。例如，取车前 48 小时免费取消。取车前 24-48 小时将收取租赁费用的 10%，上限收费 200 美元。 |
| freeCancelHours | integer | Indicate how many hours before the car is picked up that the order can be canceled for free. If it is 0, it means that it can be canceled for free anytime before the car is picked up.<br>指示在取车前多少小时可以免费取消订单。如果是 0，则表示在取车前任何时间都可以免费取消。 |

### <a id='com.ctrip.car.openapiservice.dto.search.circlerangepoidto'></a>com.ctrip.car.openapiservice.dto.search.CircleRangePoiDto

Geospatial polygon coordinates defining service boundaries (minimum 3 vertices required, ordered sequentially)
For car delivery service, this field is mandatory. Please ensure that there are no overlapping ranges in different circles.
定义服务边界的地理空间多边形坐标（至少需要 3 个顶点，按顺序排列）
对于送车上门服务，此字段是必需的。请确保不同范围内没有重叠区域。

| Property | Type | Description |
| --- | --- | --- |
| latitude | number | latitude (Google system, WGS-84)<br>纬度（Google 系统，WGS-84） |
| longitude | number | longitude (Google system, WGS-84)<br>经度（Google 系统，WGS-84） |

### <a id='com.ctrip.car.openapiservice.dto.search.coverage'></a>com.ctrip.car.openapiservice.dto.search.Coverage

This element is used to identify one specific coverage, insuranc or waiver, and to identify any fees that may be associated with it.
此元素用于标识一种特定的保险、险种或豁免，并标识可能与之相关的任何费用。

| Property | Type | Description |
| --- | --- | --- |
| description | string | General information about this specific coverage, insurance or fees.<br>关于此特定保险、险种或费用的一般信息。 |
| type | integer | Used to describe the specific coverage type or waiver type. Refer to OpenTravel Code List Vehicle Coverage Type (VCT).<br>用于描述特定的保险类型或豁免类型。参考 OpenTravel 代码列表车辆保险类型 (VCT)。 |

### <a id='com.ctrip.car.openapiservice.dto.search.crossrule'></a>com.ctrip.car.openapiservice.dto.search.CrossRule

Rules of cross-border restrictions.
跨境限制规则。

| Property | Type | Description |
| --- | --- | --- |
| countryCodes | Array of string | Cross-border destinations of countries are required to provide when the crossBorderType is "Country".<br>当 crossBorderType 为“Country”时，需要提供跨境目的地国家。 |
| crossBorderType | string | Restrictions type on vehicle cross-border rules. If "Country" is selected, "CountryCodes" is required.<br>车辆跨境规则的限制类型。如果选择“Country”，则“CountryCodes”是必需的。 |
| crossRule | integer | Cross border rules. 1-Allow cross-border 2-Conditional cross-border<br>跨境规则。1-允许跨境 2-有条件跨境 |
| description | string | Cross border rule description.<br>跨境规则描述。 |

### <a id='com.ctrip.car.openapiservice.dto.search.datetimespan'></a>com.ctrip.car.openapiservice.dto.search.DateTimeSpan

Validity period of the rate.
费率的有效期。

| Property | Type | Description |
| --- | --- | --- |
| duration | string | The duration datatype represents a combination of year, month, day and time values representing a single duration of time, encoded as a single string.<br>持续时间数据类型表示年、月、日和时间值的组合，表示单个持续时间，编码为单个字符串。 |
| end | string | The ending value of the time span.<br>时间跨度的结束值。 |
| start | string | The starting value of the time span.<br>时间跨度的起始值。 |

### <a id='com.ctrip.car.openapiservice.dto.search.depositrule'></a>com.ctrip.car.openapiservice.dto.search.DepositRule

Information pertaining to the the deposit.
关于押金的信息。

| Property | Type | Description |
| --- | --- | --- |
| depositMode | string | The deposit mode<br>押金模式 |
| depositRequiredInd | boolean | If true, a deposit is required as a guarantee.If true, "depositMode", "depositType", "minDepositAmount", "minRefundDay", "maxRefundDay" are required, "maxDepositAmount" is optional.<br>如果为 true，则需要押金作为担保。如果为 true，"depositMode"、"depositType"、"minDepositAmount"、"minRefundDay"、"maxRefundDay" 是必需的，"maxDepositAmount" 是可选的。 |
| depositType | string |  |
| maxDepositAmount | [com.ctrip.car.openapiservice.dto.search.PriceDTO](#com.ctrip.car.openapiservice.dto.search.pricedto) |  |
| maxRefundDay | integer | The latest day the deposit is returned after the user returns the vehicle.<br>用户还车后退还押金的最晚天数。 |
| minDepositAmount | [com.ctrip.car.openapiservice.dto.search.PriceDTO](#com.ctrip.car.openapiservice.dto.search.pricedto) |  |
| minRefundDay | integer | The earliest day the deposit is returned after the user returns the vehicle.<br>用户还车后退还押金的最早天数。 |

### <a id='com.ctrip.car.openapiservice.dto.search.drivinglicensedocument'></a>com.ctrip.car.openapiservice.dto.search.DrivingLicenseDocument

Information on the specific driver's license document that was used to pick up the car, which may be one or multiple.
关于用于取车的特定驾驶执照文件的信息，该文件可以是一个或多个。

| Property | Type | Description |
| --- | --- | --- |
| description | string | For the description of the driver's license document, this field is required if "Other" is selected for the licenseType.<br>对于驾驶执照文件的描述，如果 licenseType 选择“Other”，则此字段是必需的。 |
| licenceType | string | Type of driver's license document.<br>驾驶执照文件的类型。 |
| sortNum | integer | The priority of each license document in the group. For example, if the 'CDL' is more important for you to pick up a car at counter than 'HKDL', you could assign '1' for 'CDL' and assign '2' for 'HKDL'. If the license documents don't have explicit priority, the sort numbers can all be '1'.<br>组中每个许可文件的优先级。例如，如果对于您在柜台取车而言，'CDL' 比 'HKDL' 更重要，您可以为 'CDL' 分配 '1'，即为 'HKDL' 分配 '2'。如果许可文件没有明确的优先级，则排序编号都可以为 '1'。 |


### <a id='com.ctrip.car.openapiservice.dto.search.drivinglicensegroup'></a>com.ctrip.car.openapiservice.dto.search.DrivingLicenseGroup

The groups of driver's license documents used to pick up the car, which may be one or multiple.A driver's license document group may contain one or more driver's license documents.The documents that could be used to pick up the car. The document may be a single document or multiple documents group.
用于取车的驾驶执照文件组，可以是一个或多个。一个驾驶执照文件组可能包含一个或多个驾驶执照文件。用于取车的文件可以是单个文件或多个文件组。

| Property | Type | Description |
| --- | --- | --- |
| documents | Array of [com.ctrip.car.openapiservice.dto.search.DrivingLicenseDocument](#com.ctrip.car.openapiservice.dto.search.drivinglicensedocument) | Information on the specific driver's license document that was used to pick up the car, which may be one or multiple.<br>关于用于取车的特定驾驶执照文件的信息，该文件可以是一个或多个。 |
| groupSortNum | integer | The priority of one group in multiple groups. For example, if the group combination of 'CDL'+'HKDL' is more important for you to pick up a car at counter than group combination of 'MCDL'+'TWDL', you could assign '1' for 'CDL'+'HKDL' and assign '2' for 'MCDL'+'TWDL'. If the license document groups don't have explicit priority, the sort numbers can all be '1'.<br>多个组中一个组的优先级。例如，如果 'CDL'+'HKDL' 组合比起 'MCDL'+'TWDL' 组合对您在柜台取车更重要，您可以为 'CDL'+'HKDL' 分配 '1'，并为 'MCDL'+'TWDL' 分配 '2'。如果许可文件组没有明确的优先级，则排序编号都可以为 '1'。 |

### <a id='com.ctrip.car.openapiservice.dto.search.errorwarningattributegroup'></a>com.ctrip.car.openapiservice.dto.search.ErrorWarningAttributeGroup

Indicate that an error occurred in the processing of the incoming request message. An error is defined as a malformed JSON message that could not be processed.A collection of errors that occurred during the processing of a message.
指示在处理传入请求消息时发生错误。错误定义为无法处理的格式错误的 JSON 消息。处理消息期间发生的错误集合。

| Property | Type | Description |
| --- | --- | --- |
| code | string | If present, this refers to a table of coded values exchanged between applications to identify errors or warnings. Refer to OpenTravel Code List Error Codes (ERR).<br>如果存在，则是指在应用程序之间交换的代码值表，用于标识错误或警告。参考 OpenTravel 代码列表错误代码 (ERR)。 |
| shortText | string |  |
| type | string | The element MUST contain the Type attribute that uses a recommended set of values to indicate the warning type. The validating XSD can expect to accept values that it has NOT been explicitly coded for and process them by using Type ="Unknown". Refer to Code List Error Warning Type (EWT).<br>该元素必须包含 Type 属性，该属性使用一组推荐值来指示警告类型。验证 XSD 可以期望接受未显式编码的值，并通过使用 Type ="Unknown" 来处理它们。参考代码列表错误警告类型 (EWT)。 |

### <a id='com.ctrip.car.openapiservice.dto.search.geodestination'></a>com.ctrip.car.openapiservice.dto.search.GeoDestination

Customer's car rental destination.
客户的租车目的地。

| Property | Type | Description |
| --- | --- | --- |
| code | string | Code. e.g countryCode<br>代码。例如国家代码 |
| type | integer | Geographic type, continent=10000，country=1，province/state=2, city=3<br>地理类型，洲=10000，国家=1，省/州=2，城市=3 |

### <a id='com.ctrip.car.openapiservice.dto.search.geoorigin'></a>com.ctrip.car.openapiservice.dto.search.GeoOrigin

Information on the origin country of the customer.
关于客户原籍国的信息。

| Property | Type | Description |
| --- | --- | --- |
| code | string | Code. e.g countryCode<br>代码。例如国家代码 |
| type | integer | Geographic type, continent=10000，country=1，province/state=2, city=3<br>地理类型，洲=10000，国家=1，省/州=2，城市=3 |

### <a id='com.ctrip.car.openapiservice.dto.search.liabilities'></a>com.ctrip.car.openapiservice.dto.search.Liabilities

The Vehicle Location Liabilities Type is used to define information on the financial liabilities assumed by the renter when renting from this facility, along with optional coverage to reduce the financial liabilities.
车辆位置责任类型用于定义承租人在从该设施租赁时承担的财务责任信息，以及用于减少财务责任的可选保险。

| Property | Type | Description |
| --- | --- | --- |
| coverages | Array of [com.ctrip.car.openapiservice.dto.search.Coverage](#com.ctrip.car.openapiservice.dto.search.coverage) | A collection of coverage, insurance and waiver liability descriptions.<br>保险、险种和豁免责任描述的集合。 |

### <a id='com.ctrip.car.openapiservice.dto.search.licenserule'></a>com.ctrip.car.openapiservice.dto.search.LicenseRule

Information associated with the license requirements.
与驾照要求相关的信息。

| Property | Type | Description |
| --- | --- | --- |
| destination | [com.ctrip.car.openapiservice.dto.search.GeoDestination](#com.ctrip.car.openapiservice.dto.search.geodestination) |  |
| drivingLicenseGroups | Array of [com.ctrip.car.openapiservice.dto.search.DrivingLicenseGroup](#com.ctrip.car.openapiservice.dto.search.drivinglicensegroup) | The groups of driver's license documents used to pick up the car, which may be one or multiple.A driver's license document group may contain one or more driver's license documents.The documents that could be used to pick up the car. The document may be a single document or multiple documents group.<br>用于取车的驾驶执照文件组，可以是一个或多个。一个驾驶执照文件组可能包含一个或多个驾驶执照文件。用于取车的文件可以是单个文件或多个文件组。 |
| minDrivingExperience | integer | Minimum Driving Experience Requirements<br>最低驾驶经验要求 |
| origin | [com.ctrip.car.openapiservice.dto.search.GeoOrigin](#com.ctrip.car.openapiservice.dto.search.geoorigin) |  |
| requiredDrivingExperience | boolean | If true, "minDrivingExperience", "unitDrivingExperience" are required.<br>如果为 true，"minDrivingExperience"、"unitDrivingExperience" 是必需的。 |
| unitDrivingExperience | string | Units of time for driving experience.<br>驾驶经验的时间单位。 |

### <a id='com.ctrip.car.openapiservice.dto.search.listitem'></a>com.ctrip.car.openapiservice.dto.search.ListItem

Formatted text content and an associated item or sequence number
格式化文本内容和相关的项目或序列号

| Property | Type | Description |
| --- | --- | --- |
| content | string | content<br>内容 |
| listItem | integer | The item or sequence number.<br>项目或序列号。 |

### <a id='com.ctrip.car.openapiservice.dto.search.locationpoi'></a>com.ctrip.car.openapiservice.dto.search.LocationPoi

Code and optional string to describe a location point.
代码和用于描述位置点的可选字符串。

| Property | Type | Description |
| --- | --- | --- |
| code | string | A code used to identify a location.<br>用于标识位置的代码。 |
| codeContext | string | Used to define which list the location code comes from (e.g. IATA, OAG, internal company code).<br>用于定义位置代码来自哪个列表（例如 IATA、OAG、内部公司代码）。 |

### <a id='com.ctrip.car.openapiservice.dto.search.normalbusinesshoursdto'></a>com.ctrip.car.openapiservice.dto.search.NormalBusinessHoursDto

Normal business hours for service circle
服务范围的一般营业时间

| Property | Type | Description |
| --- | --- | --- |
| businessHoursPeriods | string | "1,2,3,4,5,6,7" = Monday-Sunday 1-Mon；2-Tue；3-Wed； 4-Thur；5-Fri；6-Sat；7-Sun<br>"1,2,3,4,5,6,7" = 周一至周日 1-周一；2-周二；3-周三； 4-周四；5-周五；6-周六；7-周日 |
| endDate | string | Effective end date for normal business time period YYYY-MM-DD<br>一般营业时间段的有效结束日期 YYYY-MM-DD |
| periodTime | Array of [com.ctrip.car.openapiservice.dto.search.PeriodTimeDto](#com.ctrip.car.openapiservice.dto.search.periodtimedto) | Time window definitions for daily business hours<br>每日营业时间的时间窗口定义 |
| startDate | string | Effective start date for normal business time period YYYY-MM-DD<br>一般营业时间段的有效开始日期 YYYY-MM-DD |

### <a id='com.ctrip.car.openapiservice.dto.search.operationschedule'></a>com.ctrip.car.openapiservice.dto.search.OperationSchedule

The OperationSchedule class defines the dates and hours of operation.Details of an operating schedule (e.g. a golf tee time may be more expensive during peak hours v. off peak hours).
OperationSchedule 类定义了运营日期和时间。运营时间表的详细信息（例如，高尔夫开球时间在高峰时段可能比非高峰时段更贵）。

| Property | Type | Description |
| --- | --- | --- |
| operationTimes | Array of [com.ctrip.car.openapiservice.dto.search.OperationTime](#com.ctrip.car.openapiservice.dto.search.operationtime) | A collection of OperationTimes.<br>营业时间的集合。 |
| workTimeType | string | Description of the operation period type<br>运营期间类型的描述 |

### <a id='com.ctrip.car.openapiservice.dto.search.operationtime'></a>com.ctrip.car.openapiservice.dto.search.OperationTime

Provides operating times of a facility.
提供设施的运营时间。

| Property | Type | Description |
| --- | --- | --- |
| dayOfWeeks | Array of string | e.g.'Sun','Mon','Tue','Weds','Thur','Fri','Sat'<br>例如'Sun','Mon','Tue','Weds','Thur','Fri','Sat' |
| duration | string | The duration datatype represents a combination of year, month, day and time values representing a single duration of time, encoded as a single string.<br>持续时间数据类型表示年、月、日和时间值的组合，表示单个持续时间，编码为单个字符串。 |
| end | string | The ending value of the time span.<br>时间跨度的结束值。 |
| start | string | The starting value of the time span.<br>时间跨度的起始值。 |
| text | string | Textual information for this period of operation.<br>此时段运营的文本信息。 |


### <a id='com.ctrip.car.openapiservice.dto.search.pos'></a>com.ctrip.car.openapiservice.dto.search.POS

Base request information for all requests.
所有请求的基础请求信息。

| Property | Type | Description |
| --- | --- | --- |
| echoToken | string | Request unique identifier<br>请求唯一标识符 |
| language | string | Language of content<br>内容语言 |
| sign | string | For the signature rule, please see "API Authentication"<br>有关签名规则，请参阅“API 认证” |
| timestamp | integer | Timestamp：Java: System.currentTimeMillis()<br>时间戳：Java: System.currentTimeMillis() |
| version | string | The OpenTravel message version indicated by a decimal value.<br>用十进制值表示的 OpenTravel 消息版本。 |

### <a id='com.ctrip.car.openapiservice.dto.search.paragraph'></a>com.ctrip.car.openapiservice.dto.search.Paragraph

An indication of a new paragraph for a sub-section of a formatted text message.
指示格式化文本消息子节的新段落。

| Property | Type | Description |
| --- | --- | --- |
| listItem | [com.ctrip.car.openapiservice.dto.search.ListItem](#com.ctrip.car.openapiservice.dto.search.listitem) |  |

### <a id='com.ctrip.car.openapiservice.dto.search.payonarrivalrule'></a>com.ctrip.car.openapiservice.dto.search.PayOnArrivalRule

Information about pay-on-arrival payment method.
关于到店支付方式的信息。

| Property | Type | Description |
| --- | --- | --- |
| description | string | Description or instruction of pay-on-arrival payment method.<br>到店支付方式的描述或说明。 |
| payMethod | string | Pay-on-arrival payment method.If "CreditCard" is selected, "supportCardCodeList". "requiredEmbossedCard ", "requiredTwoCreditCards ", "requiredChipCard ", "supportUnionPayDualCard" are required; "description" is optional.If "Cash" is selected, <description> is required.If "CreditCardAndCash" is selected, "supportCardCodeList". "requiredEmbossedCard", "requiredTwoCreditCards", "requiredChipCard" , "supportUnionPayDualCard", "description" are required ("description" is mainly for cash payment method).<br>到店支付方式。如果选择“CreditCard”，则需要“supportCardCodeList”、“requiredEmbossedCard”、“requiredTwoCreditCards”、“requiredChipCard”、“supportUnionPayDualCard”；“description”是可选的。如果选择“Cash”，则需要 <description>。如果选择“CreditCardAndCash”，则需要“supportCardCodeList”、“requiredEmbossedCard”、“requiredTwoCreditCards”、“requiredChipCard”、“supportUnionPayDualCard”、“description”（“description”主要用于现金支付方式）。 |
| requiredChipCard | boolean | If true, chip card is required.<br>如果为 true，则需要芯片卡。 |
| requiredEmbossedCard | boolean | If true, embossed card is required.<br>如果为 true，则需要凸字卡。 |
| requiredTwoCreditCards | boolean | If true, two credit cards are required.<br>如果为 true，则需要两张信用卡。 |
| supportCardCodeList | Array of string | Available credit card type.<br>可用的信用卡类型。 |
| supportUnionPayDualCard | boolean | If true, China Union Pay Duel-Logo Card is available.<br>如果为 true，则可以使用中国银联双标卡。 |

### <a id='com.ctrip.car.openapiservice.dto.search.periodtimedto'></a>com.ctrip.car.openapiservice.dto.search.PeriodTimeDto

Time window definitions for special time hours
特殊时间段的时间窗口定义

| Property | Type | Description |
| --- | --- | --- |
| businessHoursEndTime | string |  |
| businessHoursStartTime | string |  |

### <a id='com.ctrip.car.openapiservice.dto.search.pickupreturnrule'></a>com.ctrip.car.openapiservice.dto.search.PickupReturnRule

Pickup and return requirements for a specific rate.
特定费率的取还车要求。

| Property | Type | Description |
| --- | --- | --- |
| description | string | Pickup and return requirements description.<br>取还车要求描述。 |
| type | string | Restrictions type on pick-up and drop-off times.<br>取还车时间的限制类型。 |

### <a id='com.ctrip.car.openapiservice.dto.search.position'></a>com.ctrip.car.openapiservice.dto.search.Position

Latitude and longitude of the location
位置的经纬度

| Property | Type | Description |
| --- | --- | --- |
| latitude | string | The measure of the angular distance on a meridian north or south of the equator.<br>赤道以北或以南子午线上的角距离度量。 |
| longitude | string | The measure of the angular distance on a meridian east or west of the prime meridian.<br>本初子午线以东或以西子午线上的角距离度量。 |

### <a id='com.ctrip.car.openapiservice.dto.search.pricedto'></a>com.ctrip.car.openapiservice.dto.search.PriceDTO

Maximum deposit amount
最大押金额度

| Property | Type | Description |
| --- | --- | --- |
| amount | number | Amount<br>金额 |
| currency | string | Currency of the amount, e.g.USD<br>金额的货币，例如 USD |

### <a id='com.ctrip.car.openapiservice.dto.search.ratequalifier'></a>com.ctrip.car.openapiservice.dto.search.RateQualifier

Rate qualifiers and promotions.
费率资格和促销。

| Property | Type | Description |
| --- | --- | --- |
| contractCode | string | Indicate the contract code between partners.<br>指示合作伙伴之间的合同代码。 |
| corpDiscountNmbr | string | This is the vendor specific code used to identify a special rate associated with a specific organization.<br>这是供应商特定的代码，用于标识与特定组织关联的特殊费率。 |
| promotionCode | string | Promotion code is the identifier used by the host to link directly with a specific named advertising campaign. By including the required code, the client is able to gain access to special offers which may have been created for a specifically targeted group via a CRM system or for a wider advertising campaign using Television or press adverts.<br>促销代码是主机用于直接链接到特定命名广告活动的标识符。通过包含所需的代码，客户能够获得特别优惠，这些优惠可能是通过 CRM 系统为特定目标群体创建的，或者是用于电视或报刊广告的更广泛的广告活动。 |
| rateCategory | string | The RateCategory attribute defines a set of valid values for the category of a rate. Typically rates are offered as either Leisure rates or Business (Corporate) rates, with a business rate usually including additional costs such as the cost of insurance, etc. This set of values defines the rate categories. Refer to OpenTravel Code List Rate Category (RTC).<br>RateCategory 属性定义了一组费率类别的有效值。通常费率分为休闲费率或商务（公司）费率，商务费率通常包括额外的费用，例如保险费用等。这组值定义了费率类别。参考 OpenTravel 代码列表费率类别 (RTC)。 |
| rateQualifier | string | This is the vendor specific code for rate codes (e.g. WES, 2A, DLY00).<br>这是费率代码的供应商特定代码（例如 WES, 2A, DLY00）。 |

### <a id='com.ctrip.car.openapiservice.dto.search.rule'></a>com.ctrip.car.openapiservice.dto.search.Rule

Rule detail information.
规则详细信息。

| Property | Type | Description |
| --- | --- | --- |
| additionalPickupRule | [com.ctrip.car.openapiservice.dto.search.AdditionalPickupRule](#com.ctrip.car.openapiservice.dto.search.additionalpickuprule) |  |
| advanceBookingRule | [com.ctrip.car.openapiservice.dto.search.AdvanceBookingRule](#com.ctrip.car.openapiservice.dto.search.advancebookingrule) |  |
| ageRule | [com.ctrip.car.openapiservice.dto.search.AgeRule](#com.ctrip.car.openapiservice.dto.search.agerule) |  |
| cancelRule | [com.ctrip.car.openapiservice.dto.search.CancelRule](#com.ctrip.car.openapiservice.dto.search.cancelrule) |  |
| crossBorderRule | [com.ctrip.car.openapiservice.dto.search.CrossRule](#com.ctrip.car.openapiservice.dto.search.crossrule) |  |
| depositRule | [com.ctrip.car.openapiservice.dto.search.DepositRule](#com.ctrip.car.openapiservice.dto.search.depositrule) |  |
| id | string | An identifier for the rule.<br>规则的标识符。 |
| liabilities | [com.ctrip.car.openapiservice.dto.search.Liabilities](#com.ctrip.car.openapiservice.dto.search.liabilities) |  |
| licenseRule | [com.ctrip.car.openapiservice.dto.search.LicenseRule](#com.ctrip.car.openapiservice.dto.search.licenserule) |  |
| payOnArrivalRule | [com.ctrip.car.openapiservice.dto.search.PayOnArrivalRule](#com.ctrip.car.openapiservice.dto.search.payonarrivalrule) |  |
| pickupReturnRules | Array of [com.ctrip.car.openapiservice.dto.search.PickupReturnRule](#com.ctrip.car.openapiservice.dto.search.pickupreturnrule) | Pickup and return requirements.<br>取还车要求。 |
| ruleScope | [com.ctrip.car.openapiservice.dto.search.Scope](#com.ctrip.car.openapiservice.dto.search.scope) |  |
| type | string | The rule biz type.<br>规则业务类型。 |

### <a id='com.ctrip.car.openapiservice.dto.search.scope'></a>com.ctrip.car.openapiservice.dto.search.Scope

Indicate the scope to which the rules or rates apply.
指示规则或费率适用的范围。

| Property | Type | Description |
| --- | --- | --- |
| countryCodes | Array of string | The list of ISO 3166 country code.<br>ISO 3166 国家代码列表。 |
| locationDetails | Array of [com.ctrip.car.openapiservice.dto.search.LocationPoi](#com.ctrip.car.openapiservice.dto.search.locationpoi) | The container for location detail information.<br>位置详细信息的容器。 |
| vehicleCodes | Array of string | Provide the code identifying the vehicle.<br>提供标识车辆的代码。 |

### <a id='com.ctrip.car.openapiservice.dto.search.specialbusinesshoursdto'></a>com.ctrip.car.openapiservice.dto.search.SpecialBusinessHoursDto

Special operating schedules (holidays/special events)
特殊运营时间表（假期/特殊事件）

| Property | Type | Description |
| --- | --- | --- |
| endDate | string | Special period end date<br>特殊时段结束日期 |
| periodTime | Array of [com.ctrip.car.openapiservice.dto.search.PeriodTimeDto](#com.ctrip.car.openapiservice.dto.search.periodtimedto) | Time window definitions for special time hours<br>特殊时间段的时间窗口定义 |
| startDate | string | Special  period start date<br>特殊时段开始日期 |

### <a id='com.ctrip.car.openapiservice.dto.search.specialequipment'></a>com.ctrip.car.openapiservice.dto.search.SpecialEquipment

Information on one specific piece of special equipment.
关于一件特定特殊设备的信息。

| Property | Type | Description |
| --- | --- | --- |
| equipDesc | string | The description of this piece of special equipment.<br>此件特殊设备的描述。 |
| type | integer | Identify the specific type of special equipment that is being described. Refer to OpenTravel Code List Equipment Type (EQP).<br>标识所描述的特殊设备的具体类型。参考 OpenTravel 代码列表设备类型 (EQP)。 |

### <a id='com.ctrip.car.openapiservice.dto.search.storeservicecircle'></a>com.ctrip.car.openapiservice.dto.search.StoreServiceCircle

Store service circle configuration, including delivery service name, distance limit, business hours, fees, and other settings.
门店服务范围配置，包括送车服务名称、距离限制、营业时间、费用和其他设置。

| Property | Type | Description |
| --- | --- | --- |
| advancePeriod | number | Advanced booking period for service booking (unit：hour)<br>服务预订的提前预订期（单位：小时） |
| advancePeriodUnit | integer | Unit for advance booking Period 0 - minute ; 1 - hour<br>提前预订期的单位 0 - 分钟 ; 1 - 小时 |
| chargeFee | number | Fee charged for this service.<br>此服务收取的费用。 |
| circleRangePoiList | Array of [com.ctrip.car.openapiservice.dto.search.CircleRangePoiDto](#com.ctrip.car.openapiservice.dto.search.circlerangepoidto) | Geospatial polygon coordinates defining service boundaries (minimum 3 vertices required, ordered sequentially) For car delivery service, this field is mandatory. Please ensure that there are no overlapping ranges in different circles.<br>定义服务边界的地理空间多边形坐标（至少需要 3 个顶点，按顺序排列）对于送车上门服务，此字段是必需的。请确保不同范围内没有重叠区域。 |
| monetaryUnit | string | Currency unit for the fee.<br>费用的货币单位。 |
| normalBusinessHoursDtoList | Array of [com.ctrip.car.openapiservice.dto.search.NormalBusinessHoursDto](#com.ctrip.car.openapiservice.dto.search.normalbusinesshoursdto) | Normal business hours for service circle<br>服务范围的一般营业时间 |
| specialBusinessHoursDtoList | Array of [com.ctrip.car.openapiservice.dto.search.SpecialBusinessHoursDto](#com.ctrip.car.openapiservice.dto.search.specialbusinesshoursdto) | Special operating schedules (holidays/special events)<br>特殊运营时间表（假期/特殊事件） |
| suspendBusinessHoursList | Array of [com.ctrip.car.openapiservice.dto.search.SuspendBusinessHoursDto](#com.ctrip.car.openapiservice.dto.search.suspendbusinesshoursdto) | Non-business time period for service circle<br>服务范围的非营业时间段 |
| vendorServiceCircleCode | string | Vendor-specific code for this service circle.<br>此服务范围的供应商特定代码。 |

### <a id='com.ctrip.car.openapiservice.dto.search.storeservicecirclecontactinfo'></a>com.ctrip.car.openapiservice.dto.search.StoreServiceCircleContactInfo

Store service circle contact information, such as contact type and content.
门店服务范围联系信息，如联系方式类型和内容。

| Property | Type | Description |
| --- | --- | --- |
| contactContent | string | Contact information of corresponding type<br>相应类型的联系信息 |
| contactType | integer | Enumeration of contact channel types: 1-WeChat, 2-LINE, 3-KakaoTalk, 4-WhatsApp, 5-QQ<br>联系渠道类型枚举：1-WeChat, 2-LINE, 3-KakaoTalk, 4-WhatsApp, 5-QQ |

### <a id='com.ctrip.car.openapiservice.dto.search.streetnmbr'></a>com.ctrip.car.openapiservice.dto.search.StreetNmbr

May contain the street number and optionally the street name.
可能包含街道号码和可选的街道名称。

| Property | Type | Description |
| --- | --- | --- |
| ruralRouteNmbr | string | May contain the street number and optionally the street name.<br>可能包含街道号码和可选的街道名称。 |
| streetDirection | string | Street direction of an address (e.g., N, E, S, NW, SW).<br>地址的街道方向（例如 N, E, S, NW, SW）。 |
| streetNmbrSuffix | string | Usually a letter right after the street number (A in 66-A, B in 123-B etc).<br>通常是紧随街道号码后的字母（例如 66-A 中的 A，123-B 中的 B 等）。 |

### <a id='com.ctrip.car.openapiservice.dto.search.suspendbusinesshoursdto'></a>com.ctrip.car.openapiservice.dto.search.SuspendBusinessHoursDto

Non-business time period for service circle
服务范围的非营业时间段

| Property | Type | Description |
| --- | --- | --- |
| endDate | string | Non-business time period end date<br>非营业时段结束日期 |
| periodTime | Array of [com.ctrip.car.openapiservice.dto.search.PeriodTimeDto](#com.ctrip.car.openapiservice.dto.search.periodtimedto) | Time window definitions for non-business time hours<br>非营业时间的时间窗口定义 |
| startDate | string | Non-business time period start date<br>非营业时段开始日期 |

### <a id='com.ctrip.car.openapiservice.dto.search.telephone'></a>com.ctrip.car.openapiservice.dto.search.Telephone

Information about the telephone numbers for this location, requiring a landline or cell phone number for contacting the location.
关于此地点电话号码的信息，需要用于联系该地点的座机或手机号码。

| Property | Type | Description |
| --- | --- | --- |
| areaCityCode | string | Code assigned for telephones in a specific region, city, or area.<br>为特定地区、城市或区域的电话分配的代码。 |
| phoneNumber | string | Telephone number assigned to a single location.<br>分配给单个地点的电话号码。 |

### <a id='com.ctrip.car.openapiservice.dto.search.vehclass'></a>com.ctrip.car.openapiservice.dto.search.VehClass

The class of vehicle, for example, intermediate, compact.
车辆等级，例如中型车、紧凑型车。

| Property | Type | Description |
| --- | --- | --- |
| size | integer | The Size attribute identifies the size of a vehicle. Refer to OpenTravel Code List Size (SIZ)<br>Size 属性标识车辆的大小。参考 OpenTravel 代码列表大小 (SIZ) |


### <a id='com.ctrip.car.openapiservice.dto.search.vehlocdetail'></a>com.ctrip.car.openapiservice.dto.search.VehLocDetail

Vehicle Location Detail response will allow car rental providers to return information about the location requested to assist the customer. This information includes address, phone number, informational messages, parking and counter location, services, and operating schedule of the location requested.
车辆位置详细信息响应将允许汽车租赁提供商返回有关请求位置的信息以协助客户。此信息包括地址、电话号码、信息性消息、停车场和柜台位置、服务以及所请求位置的运营时间表。

| Property | Type | Description |
| --- | --- | --- |
| address | [com.ctrip.car.openapiservice.dto.search.Address](#com.ctrip.car.openapiservice.dto.search.address) |  |
| arrivalWay | integer | If atAirport=true, then this field is required.Please provide the arrival instructions for the airport store, including: "1.Within walking distance ","2.Free Shuttle Service","3.Meet and Greet ","4.AirTrain/LRT ","5.Shuttle Service ","6.Free Air Train ","7.Call for collection on arrival",Please provide the number of arrival instructions.<br>如果 atAirport=true，则此字段是必需的。请提供机场门店的到达说明，包括：“1.步行距离内”，“2.免费班车服务”，“3.接机服务”，“4.机场快线/轻轨”，“5.班车服务”，“6.免费机场快线”，“7.到达时致电接车”，请提供到达说明的编号。 |
| atAirport | boolean | The AtAirport attribute identifies if the associated rental location serves an airport.<br>AtAirport 属性标识关联的租赁位置是否服务于机场。 |
| circleContactInfo | [com.ctrip.car.openapiservice.dto.search.StoreServiceCircleContactInfo](#com.ctrip.car.openapiservice.dto.search.storeservicecirclecontactinfo) |  |
| code | string | Code used to identify the car rental location.<br>用于标识汽车租赁位置的代码。 |
| codeContext | string | Used to define which list the location code comes from (e.g. IATA, OAG, internal company code).<br>用于定义位置代码来自哪个列表（例如 IATA、OAG、内部公司代码）。 |
| counterLocation | string | Descriptive information about where the rental counter is located. Defines the information needed to describe the location of the associated item at a rental facility. Example of the items that may make use of this type include Rental Counter, Vehicle Parking Locations, etc.<br>关于租赁柜台位置的描述性信息。定义描述租赁设施中相关项目位置所需的信息。可能使用此类型的项目示例包括租赁柜台、车辆停放位置等。 |
| extendedLocationCode | string | Used for extended OAG code in conjunction with the OAG code which is sent in Code.<br>用于扩展 OAG 代码，与在 Code 中发送的 OAG 代码结合使用。 |
| name | string | Name used to refer to the car rental location.<br>用于指代汽车租赁位置的名称。 |
| needFlightNo | boolean | Whether a flight number is required<br>是否需要航班号 |
| operationSchedules | Array of [com.ctrip.car.openapiservice.dto.search.OperationSchedule](#com.ctrip.car.openapiservice.dto.search.operationschedule) | A collection of operation time.<br>运营时间的集合。 |
| specialEquipments | Array of [com.ctrip.car.openapiservice.dto.search.SpecialEquipment](#com.ctrip.car.openapiservice.dto.search.specialequipment) | A collection of descriptions about the special pieces of equipment that can be included in a rental from this facility.<br>关于可包含在该设施租赁中的特殊设备的描述集合。 |
| storeServiceCircles | Array of [com.ctrip.car.openapiservice.dto.search.StoreServiceCircle](#com.ctrip.car.openapiservice.dto.search.storeservicecircle) | Defines geographical service areas for vehicle delivery operations, including operational parameters and geofencing coordinates Car delivery service definition: Guest do not need to arrive store to pick up the car, the store can provide car delivery service to guests location.<br>定义车辆交付操作的地理服务区域，包括操作参数和地理围栏坐标。送车上门服务定义：客人无需到达门店取车，门店可提供送车上门服务至客人位置。 |
| telephones | Array of [com.ctrip.car.openapiservice.dto.search.Telephone](#com.ctrip.car.openapiservice.dto.search.telephone) | Information about the telephone numbers for this location.<br>关于此位置电话号码的信息。 |
| terminalInfo | string | If terminalType=3, then this field is required. The custom field only allows the input of letters, numbers, and punctuation characters, such as T1, T2.<br>如果 terminalType=3，则此字段是必需的。自定义字段仅允许输入字母、数字和标点符号，例如 T1、T2。 |
| terminalType | integer | If atAirport=true, then this field is required. Please provide the terminal information for the airport store: If your store is located in the arrival hall, please select "1";If your store is located within the terminal, please select "2";Alternatively, you can choose to fill in a custom field, please select "3".<br>如果 atAirport=true，则此字段是必需的。请提供机场门店的航站楼信息：如果您的门店位于到达大厅，请选择“1”；如果您的门店位于航站楼内，请选择“2”；或者，您可以选择填写自定义字段，请选择“3”。 |
| vehRentLocInfos | Array of [com.ctrip.car.openapiservice.dto.search.VehRentLocInfo](#com.ctrip.car.openapiservice.dto.search.vehrentlocinfo) | Descriptive information allowing the vendor to present informational messages about the rental location. These may include after-hour return of vehicle messages, messages providing directions to the location, or other similar messages.<br>允许供应商提供有关租赁位置的信息性消息的描述性信息。这些可能包括非工作时间还车消息、提供位置路线的消息或其他类似消息。 |

### <a id='com.ctrip.car.openapiservice.dto.search.vehmakemodel'></a>com.ctrip.car.openapiservice.dto.search.VehMakeModel

The make and model of the vehicle (e.g., Ford Focus).
车辆的品牌和型号（例如，Ford Focus）。

| Property | Type | Description |
| --- | --- | --- |
| name | string | The name of model of the vehicle.<br>车辆型号的名称。 |

### <a id='com.ctrip.car.openapiservice.dto.search.vehrentlocinfo'></a>com.ctrip.car.openapiservice.dto.search.VehRentLocInfo

Descriptive information of one specific aspect of the rental location.Provides formatted textual information relating to the vehicle rental location.
租赁位置特定方面的描述性信息。提供与车辆租赁位置相关的格式化文本信息。

| Property | Type | Description |
| --- | --- | --- |
| subSection | [com.ctrip.car.openapiservice.dto.search.Paragraph](#com.ctrip.car.openapiservice.dto.search.paragraph) |  |
| title | string | This attribute may be used to provide a title for the formatted free text, for example, Driving Directions. Each of the sub sections that are defined to be a part of the formatted text would provide detailed information about the subject identified by the title.<br>此属性可用于为格式化的自由文本提供标题，例如“行车路线”。定义为格式化文本一部分的每个小节都将提供有关标题所标识主题的详细信息。 |
| type | integer | Identifies the type of Vehicle Location information that is provided. Refer to OpenTravel Code List Vehicle Location Information Type (VLI).<br>标识所提供的车辆位置信息的类型。参考 OpenTravel 代码列表车辆位置信息类型 (VLI)。 |

### <a id='com.ctrip.car.openapiservice.dto.search.vehtype'></a>com.ctrip.car.openapiservice.dto.search.VehType

The type of vehicle, for example, truck, car.
车辆类型，例如卡车、汽车。

| Property | Type | Description |
| --- | --- | --- |
| doorCount | integer | The number of doors on a vehicle. This may be an exact number or a range, i.e. 2-4.<br>车辆的车门数量。这可能是一个确切的数字或一个范围，例如 2-4。 |
| vehicleCategory | string | The VehicleCategory attribute provides the catgeory of a vehicle. Refer to OpenTravel Code List Vehicle Category (VEC).<br>VehicleCategory 属性提供车辆的类别。参考 OpenTravel 代码列表车辆类别 (VEC)。 |

### <a id='com.ctrip.car.openapiservice.dto.search.vehicle'></a>com.ctrip.car.openapiservice.dto.search.Vehicle

Information on one specific vehicle along with detailed information. The VehicleType complex type identifies the data that fully describes a vehicle. This includes the core information along with supplemental information such as make and model, and a link to a picture.
关于一辆特定车辆的信息以及详细信息。VehicleType 复杂类型标识完全描述车辆的数据。这包括核心信息以及补充信息，例如品牌和型号，以及图片链接。

| Property | Type | Description |
| --- | --- | --- |
| airConditionInd | boolean |  |
| baggageQuantity | integer | Number of bags/suitcases that can be accommodated by this vehicle.<br>此车辆可容纳的行李/手提箱数量。 |
| code | string | Any code used to specify an item, for example, type of vehicle etc.<br>用于指定项目的任何代码，例如车辆类型等。 |
| codeContext | string | Identifies the source authority for the code.<br>标识代码的来源机构。 |
| description | string | A description of the vehicle<br>车辆描述 |
| driveType | string | 4WD/ADW/Unspecified<br>四轮驱动/全轮驱动/未指定 |
| energyType | string | The kind of energy(fuel) the vehicle uses.<br>车辆使用的能源（燃料）种类。 |
| modelYear | number | The model year of the vehicle.<br>车辆的车型年份。 |
| passengerQuantity | integer | Number of passengers that can be accommodated by this vehicle. This may be an exact number or may be a range, i.e., 4-5, 5-6.<br>此车辆可容纳的乘客数量。这可能是一个确切的数字或一个范围，例如 4-5, 5-6。 |
| pictureURL | string | URL that identifies the location of a picture to describe this vehicle.<br>标识描述此车辆的图片位置的 URL。 |
| transmissionType | string | TransmissionType must be equal to “Automatic” or “Manual”<br>TransmissionType 必须等于“Automatic”或“Manual” |
| vehClass | [com.ctrip.car.openapiservice.dto.search.VehClass](#com.ctrip.car.openapiservice.dto.search.vehclass) |  |
| vehMakeModels | Array of [com.ctrip.car.openapiservice.dto.search.VehMakeModel](#com.ctrip.car.openapiservice.dto.search.vehmakemodel) | The make and model of the vehicle (e.g., Ford Focus). The Code attribute may be used for the SIPP code.<br>车辆的品牌和型号（例如，Ford Focus）。Code 属性可用于 SIPP 代码。 |
| vehType | [com.ctrip.car.openapiservice.dto.search.VehType](#com.ctrip.car.openapiservice.dto.search.vehtype) |  |
| vendorCarType | string | An internal car type assigned by the vendor. This is not the SIPP code<br>供应商分配的内部车型。这不是 SIPP 代码 |

### <a id='com.ctrip.car.openapiservice.dto.search.vendor'></a>com.ctrip.car.openapiservice.dto.search.Vendor

Vendor preferences
供应商偏好

| Property | Type | Description |
| --- | --- | --- |
| code | string | Identify a company by the company code.<br>通过公司代码标识一家公司。 |
| companyName | string | Provide the company common name.<br>提供公司通用名称。 |


### <a id='com.ctrip.car.openapiservice.vo.request.osd.baseresponse'></a>com.ctrip.car.openapiservice.vo.request.osd.BaseResponse

BaseResponse
基本响应

| Property | Type | Description |
| --- | --- | --- |
| code | string | status code 200 success !=200 error<br>状态码 200 成功 !=200 错误 |
| message | string | Description<br>说明 |

### <a id='com.ctrip.car.openapiservice.vo.request.osd.collectlocationdetailrq'></a>com.ctrip.car.openapiservice.vo.request.osd.CollectLocationDetailRQ

同步门店请求体

| Property | Type | Description |
| --- | --- | --- |
| pageNum | integer | Paging parameter - pagination, set from 0.<br>分页参数 - 分页，从 0 开始设置。 |
| pageSize | integer | Paging parameter - size, a batch of 100 is recommended.<br>分页参数 - 大小，建议批量 100。 |
| pos | [com.ctrip.car.openapiservice.dto.search.POS](#com.ctrip.car.openapiservice.dto.search.pos) |  |
| vendor | [com.ctrip.car.openapiservice.dto.search.Vendor](#com.ctrip.car.openapiservice.dto.search.vendor) |  |

### <a id='com.ctrip.car.openapiservice.vo.request.osd.collectrulerq'></a>com.ctrip.car.openapiservice.vo.request.osd.CollectRuleRQ

同步Rule请求体

| Property | Type | Description |
| --- | --- | --- |
| pageNum | integer | Paging parameter - pagination, set from 0.<br>分页参数 - 分页，从 0 开始设置。 |
| pageSize | integer | Paging parameter - size, a batch of 100 is recommended.<br>分页参数 - 大小，建议批量 100。 |
| pos | [com.ctrip.car.openapiservice.dto.search.POS](#com.ctrip.car.openapiservice.dto.search.pos) |  |
| type | string | The rule biz type.<br>规则业务类型。 |
| vendor | [com.ctrip.car.openapiservice.dto.search.Vendor](#com.ctrip.car.openapiservice.dto.search.vendor) |  |

### <a id='com.ctrip.car.openapiservice.vo.request.osd.collectvehraterq'></a>com.ctrip.car.openapiservice.vo.request.osd.CollectVehRateRQ

同步Rate请求体

| Property | Type | Description |
| --- | --- | --- |
| pageNum | integer | Paging parameter - pagination, set from 0.<br>分页参数 - 分页，从 0 开始设置。 |
| pageSize | integer | Paging parameter - size, a batch of 100 is recommended.<br>分页参数 - 大小，建议批量 100。 |
| pos | [com.ctrip.car.openapiservice.dto.search.POS](#com.ctrip.car.openapiservice.dto.search.pos) |  |
| vendor | [com.ctrip.car.openapiservice.dto.search.Vendor](#com.ctrip.car.openapiservice.dto.search.vendor) |  |

### <a id='com.ctrip.car.openapiservice.vo.request.osd.collectvehiclerq'></a>com.ctrip.car.openapiservice.vo.request.osd.CollectVehicleRQ

同步车型请求体

| Property | Type | Description |
| --- | --- | --- |
| locationCode | string | Used for extended OAG code in conjunction with the OAG code which is sent in Code.<br>用于扩展 OAG 代码，与在 Code 中发送的 OAG 代码结合使用。 |
| pageNum | integer | Paging parameter - pagination, set from 0.<br>分页参数 - 分页，从 0 开始设置。 |
| pageSize | integer | Paging parameter - size, a batch of 100 is recommended.<br>分页参数 - 大小，建议批量 100。 |
| pos | [com.ctrip.car.openapiservice.dto.search.POS](#com.ctrip.car.openapiservice.dto.search.pos) |  |
| vendor | [com.ctrip.car.openapiservice.dto.search.Vendor](#com.ctrip.car.openapiservice.dto.search.vendor) |  |

### <a id='com.ctrip.car.openapiservice.vo.request.osd.depositnotifrequesttype'></a>com.ctrip.car.openapiservice.vo.request.osd.DepositNotifRequestType

DepositNotifRequestType
押金通知请求类型

| Property | Type | Description |
| --- | --- | --- |
| confirmationCode | string | Vendor's confirmation Code<br>供应商确认代码 |
| deductionType | integer | 1 Vehicle damage 2 traffic fines 3 other<br>1 车辆损坏 2 交通罚款 3 其他 |
| description | string | Deduction reason  (mandatory in deduction process)<br>扣款原因（扣款流程中必填） |
| fileUrl | Array of string | Deduction certificate  (mandatory in deduction process) File type is only supported for jpg, jpeg and png<br>扣款凭证（扣款流程中必填）文件类型仅支持 jpg、jpeg 和 png |
| pos | [com.ctrip.car.openapiservice.dto.search.POS](#com.ctrip.car.openapiservice.dto.search.pos) |  |
| price | [com.ctrip.car.openapiservice.dto.search.PriceDTO](#com.ctrip.car.openapiservice.dto.search.pricedto) |  |
| tripDeductionId | string | The Deduction Id from Trip.com (mandatory in refund process)<br>Trip.com 的扣款 ID（退款流程中必填） |
| tripOrderId | string | The reservation id of Trip.com<br>Trip.com 的预订 ID |
| type | string | ''REFUND''  -- request a refund to the customer ''DEDUCTION''  -- request deduction process for the guest.<br>''REFUND'' -- 请求给客户退款 ''DEDUCTION'' -- 请求对客人进行扣款流程。 |
| username | string | username provided by Trip.com<br>Trip.com 提供的用户名 |
| vendorDeductionId | string | The Deduction Id from vendor<br>供应商的扣款 ID |

### <a id='com.ctrip.car.openapiservice.vo.request.osd.depositnotifresponsetype'></a>com.ctrip.car.openapiservice.vo.request.osd.DepositNotifResponseType

DepositNotifResponseType
押金通知响应类型

| Property | Type | Description |
| --- | --- | --- |
| BaseResponse | [com.ctrip.car.openapiservice.vo.request.osd.BaseResponse](#com.ctrip.car.openapiservice.vo.request.osd.baseresponse) |  |

### <a id='com.ctrip.car.openapiservice.vo.request.osd.vehavailraterq'></a>com.ctrip.car.openapiservice.vo.request.osd.VehAvailRateRQ

Vehicle Availability and Rate Request
车辆可用性和费率请求

| Property | Type | Description |
| --- | --- | --- |
| currency | string | The currency code in which the reservation will be ticketed in ISO 4217-3 encoding, please refer to CurrencyType enum for the complete list of currencies supported by Trip.<br>预订将使用的货币代码，采用 ISO 4217-3 编码，请参阅 CurrencyType 枚举以获取 Trip 支持的货币的完整列表。 |
| maxResponses | integer | A positive integer value that indicates the maximum number of responses desired in the return.<br>一个正整数值，指示返回中期望的最大响应数。 |
| pos | [com.ctrip.car.openapiservice.dto.search.POS](#com.ctrip.car.openapiservice.dto.search.pos) |  |
| vehAvailRQCore | [com.ctrip.car.openapiservice.dto.list.VehAvailRQCore](#com.ctrip.car.openapiservice.dto.list.vehavailrqcore) |  |
| vehAvailRQInfo | [com.ctrip.car.openapiservice.dto.list.VehAvailRQInfo](#com.ctrip.car.openapiservice.dto.list.vehavailrqinfo) |  |

### <a id='com.ctrip.car.openapiservice.vo.request.osd.vehcancelrq'></a>com.ctrip.car.openapiservice.vo.request.osd.VehCancelRQ

Vehicle Cancel Reservation Request
车辆取消预订请求

| Property | Type | Description |
| --- | --- | --- |
| pos | [com.ctrip.car.openapiservice.dto.search.POS](#com.ctrip.car.openapiservice.dto.search.pos) |  |
| vehCancelRQCore | [com.ctrip.car.openapiservice.dto.booking.VehCancelRQCore](#com.ctrip.car.openapiservice.dto.booking.vehcancelrqcore) |  |


### <a id='com.ctrip.car.openapiservice.vo.request.osd.vehlocdetailsnotifrq'></a>com.ctrip.car.openapiservice.vo.request.osd.VehLocDetailsNotifRQ

供应商门店推送实体

| Property | Type | Description |
| --- | --- | --- |
| locationDetails | Array of [com.ctrip.car.openapiservice.dto.search.VehLocDetail](#com.ctrip.car.openapiservice.dto.search.vehlocdetail) | A container for location detail information.<br>位置详细信息的容器。 |
| pos | [com.ctrip.car.openapiservice.dto.search.POS](#com.ctrip.car.openapiservice.dto.search.pos) |  |
| quantity | integer | The count of items being sent in this message.<br>此消息中发送的项目数量。 |

### <a id='com.ctrip.car.openapiservice.vo.request.osd.vehmodifyrq'></a>com.ctrip.car.openapiservice.vo.request.osd.VehModifyRQ

| Property | Type | Description |
| --- | --- | --- |
| pos | [com.ctrip.car.openapiservice.dto.search.POS](#com.ctrip.car.openapiservice.dto.search.pos) |  |
| vehModifyRQCore | [com.ctrip.car.openapiservice.vo.request.osd.VehModifyRQCore](#com.ctrip.car.openapiservice.vo.request.osd.vehmodifyrqcore) |  |
| vehModifyRQInfo | [com.ctrip.car.openapiservice.vo.request.osd.VehModifyRQInfo](#com.ctrip.car.openapiservice.vo.request.osd.vehmodifyrqinfo) |  |

### <a id='com.ctrip.car.openapiservice.vo.request.osd.vehmodifyrqcore'></a>com.ctrip.car.openapiservice.vo.request.osd.VehModifyRQCore

Basic information of reservation
预订基本信息

| Property | Type | Description |
| --- | --- | --- |
| confirmationCode | string | reservation confirmationCode<br>预订确认代码 |
| tripOrderId | string | trip Order Id<br>Trip 订单 ID |
| vendorPref | [com.ctrip.car.openapiservice.dto.list.Vendor](#com.ctrip.car.openapiservice.dto.list.vendor) |  |

### <a id='com.ctrip.car.openapiservice.vo.request.osd.vehmodifyrqinfo'></a>com.ctrip.car.openapiservice.vo.request.osd.VehModifyRQInfo

Reservation modification information (deposit status / guest contact information for car delivery)
预订修改信息（押金状态/送车上门的客人联系信息）

| Property | Type | Description |
| --- | --- | --- |
| customer | [com.ctrip.car.openapiservice.vo.request.osd.VehModifyRQInfo$UserInfo](#com.ctrip.car.openapiservice.vo.request.osd.vehmodifyrqinfo$userinfo) |  |
| depositFree | [com.ctrip.car.openapiservice.vo.request.osd.VehModifyRQInfo$DepositFree](#com.ctrip.car.openapiservice.vo.request.osd.vehmodifyrqinfo$depositfree) |  |

### <a id='com.ctrip.car.openapiservice.vo.request.osd.vehmodifyrqinfo$contact'></a>com.ctrip.car.openapiservice.vo.request.osd.VehModifyRQInfo$Contact

Guest contact information
客人联系信息

| Property | Type | Description |
| --- | --- | --- |
| contactNumber | string | Contact Number<br>联系电话 |
| contactType | string | 0-LocalMobile；1-WeChat；2-Line；3-kakaoTalk；4-WhatsApp；5-QQ<br>0-本地手机；1-WeChat；2-Line；3-kakaoTalk；4-WhatsApp；5-QQ |

### <a id='com.ctrip.car.openapiservice.vo.request.osd.vehmodifyrqinfo$depositfree'></a>com.ctrip.car.openapiservice.vo.request.osd.VehModifyRQInfo$DepositFree

Information on deposit fee status and amount.
关于押金费用状态和金额的信息。

| Property | Type | Description |
| --- | --- | --- |
| depositAmount | [com.ctrip.car.openapiservice.dto.list.PriceDTO](#com.ctrip.car.openapiservice.dto.list.pricedto) |  |
| supportDepositFree | boolean | The reservation deposit-free status<br>预订免押金状态 |

### <a id='com.ctrip.car.openapiservice.vo.request.osd.vehmodifyrqinfo$userinfo'></a>com.ctrip.car.openapiservice.vo.request.osd.VehModifyRQInfo$UserInfo

Guest contact information for car delivery
送车上门的客人联系信息

| Property | Type | Description |
| --- | --- | --- |
| contact | [com.ctrip.car.openapiservice.vo.request.osd.VehModifyRQInfo$Contact](#com.ctrip.car.openapiservice.vo.request.osd.vehmodifyrqinfo$contact) |  |
| flightNumber | string | flight Number information<br>航班号信息 |

### <a id='com.ctrip.car.openapiservice.vo.request.osd.vehmodifyrs'></a>com.ctrip.car.openapiservice.vo.request.osd.VehModifyRS

| Property | Type | Description |
| --- | --- | --- |
| errors | Array of [com.ctrip.car.openapiservice.dto.search.ErrorWarningAttributeGroup](#com.ctrip.car.openapiservice.dto.search.errorwarningattributegroup) | Indicate that an error occurred in the processing of the incoming request message. An error is defined as a malformed JSON message that could not be processed.A collection of errors that occurred during the processing of a message.<br>指示在处理传入请求消息时发生错误。错误定义为无法处理的格式错误的 JSON 消息。在处理消息期间发生的错误集合。 |
| success | boolean |  |

### <a id='com.ctrip.car.openapiservice.vo.request.osd.vehratenotifrq'></a>com.ctrip.car.openapiservice.vo.request.osd.VehRateNotifRQ

供应商rate信息推送

| Property | Type | Description |
| --- | --- | --- |
| pos | [com.ctrip.car.openapiservice.dto.search.POS](#com.ctrip.car.openapiservice.dto.search.pos) |  |
| quantity | integer | The count of items being sent in this message.<br>此消息中发送的项目数量。 |
| rateQualifierOnlyInd | boolean | When true, only the rate qualifiers are being sent.<br>如果为 true，则仅发送费率资格。 |
| rates | Array of [com.ctrip.car.openapiservice.dto.VehRate](#com.ctrip.car.openapiservice.dto.vehrate) | Provides either a rate qualifier or all information for a specific car rental rate.<br>提供费率资格或特定汽车租赁费率的所有信息。 |

### <a id='com.ctrip.car.openapiservice.vo.request.osd.vehraterulenotifrq'></a>com.ctrip.car.openapiservice.vo.request.osd.VehRateRuleNotifRQ

供应商rule信息推送

| Property | Type | Description |
| --- | --- | --- |
| pos | [com.ctrip.car.openapiservice.dto.search.POS](#com.ctrip.car.openapiservice.dto.search.pos) |  |
| quantity | integer | The count of items being sent in this message.<br>此消息中发送的项目数量。 |
| rules | Array of [com.ctrip.car.openapiservice.dto.search.Rule](#com.ctrip.car.openapiservice.dto.search.rule) | A collection of rules.<br>规则的集合。 |

### <a id='com.ctrip.car.openapiservice.vo.request.osd.vehraterulerq'></a>com.ctrip.car.openapiservice.vo.request.osd.VehRateRuleRQ

Vehicle Rate Rule Request
车辆费率规则请求

| Property | Type | Description |
| --- | --- | --- |
| currency | string | The currency code in which the reservation will be ticketed in ISO 4217-3 encoding, please refer to CurrencyType enum for the complete list of currencies supported by Trip.<br>预订将使用的货币代码，采用 ISO 4217-3 编码，请参阅 CurrencyType 枚举以获取 Trip 支持的货币的完整列表。 |
| pos | [com.ctrip.car.openapiservice.dto.search.POS](#com.ctrip.car.openapiservice.dto.search.pos) |  |
| reference | [com.ctrip.car.openapiservice.dto.detail.Reference](#com.ctrip.car.openapiservice.dto.detail.reference) |  |
| rentalInfo | [com.ctrip.car.openapiservice.dto.detail.RentalInfo](#com.ctrip.car.openapiservice.dto.detail.rentalinfo) |  |

### <a id='com.ctrip.car.openapiservice.vo.request.osd.vehresrq'></a>com.ctrip.car.openapiservice.vo.request.osd.VehResRQ

Vehicle Reservation Request
车辆预订请求

| Property | Type | Description |
| --- | --- | --- |
| pos | [com.ctrip.car.openapiservice.dto.search.POS](#com.ctrip.car.openapiservice.dto.search.pos) |  |
| vehResRQCore | [com.ctrip.car.openapiservice.dto.booking.VehResRQCore](#com.ctrip.car.openapiservice.dto.booking.vehresrqcore) |  |
| vehResRQInfo | [com.ctrip.car.openapiservice.dto.booking.VehResRQInfo](#com.ctrip.car.openapiservice.dto.booking.vehresrqinfo) |  |

### <a id='com.ctrip.car.openapiservice.vo.request.osd.vehresstatusnotifrq'></a>com.ctrip.car.openapiservice.vo.request.osd.VehResStatusNotifRQ

Identifies the common, or core, information associated with the request providing information on the reservation of a rental vehicle.
标识与提供租赁车辆预订信息的请求相关的通用或核心信息。

| Property | Type | Description |
| --- | --- | --- |
| pos | [com.ctrip.car.openapiservice.dto.search.POS](#com.ctrip.car.openapiservice.dto.search.pos) |  |
| vehResStatusNotifRQCore | [com.ctrip.car.openapiservice.dto.booking.VehResStatusNotifRQCore](#com.ctrip.car.openapiservice.dto.booking.vehresstatusnotifrqcore) |  |

### <a id='com.ctrip.car.openapiservice.vo.request.osd.vehretresrq'></a>com.ctrip.car.openapiservice.vo.request.osd.VehRetResRQ

Vehicle Retrieve Reservation Request
车辆检索预订请求

| Property | Type | Description |
| --- | --- | --- |
| pos | [com.ctrip.car.openapiservice.dto.search.POS](#com.ctrip.car.openapiservice.dto.search.pos) |  |
| vehRetResRQCore | [com.ctrip.car.openapiservice.dto.booking.VehRetResRQCore](#com.ctrip.car.openapiservice.dto.booking.vehretresrqcore) |  |

### <a id='com.ctrip.car.openapiservice.vo.request.osd.vehiclenotifrq'></a>com.ctrip.car.openapiservice.vo.request.osd.VehicleNotifRQ

供应商车型推送实体

| Property | Type | Description |
| --- | --- | --- |
| locationCode | string | The car rental location code.<br>汽车租赁位置代码。 |
| pos | [com.ctrip.car.openapiservice.dto.search.POS](#com.ctrip.car.openapiservice.dto.search.pos) |  |
| quantity | integer | The count of items being sent in this message.<br>此消息中发送的项目数量。 |
| vehicles | Array of [com.ctrip.car.openapiservice.dto.search.Vehicle](#com.ctrip.car.openapiservice.dto.search.vehicle) | A container for vehicle information.<br>车辆信息的容器。 |

### <a id='com.ctrip.car.openapiservice.vo.request.osd.vendordepositnotifyrequest'></a>com.ctrip.car.openapiservice.vo.request.osd.VendorDepositNotifyRequest

VendorDepositNotifyRequest
供应商押金通知请求

| Property | Type | Description |
| --- | --- | --- |
| pos | [com.ctrip.car.openapiservice.dto.search.POS](#com.ctrip.car.openapiservice.dto.search.pos) |  |
| vehNotifyRQCore | [com.ctrip.car.openapiservice.vo.request.osd.VendorDepositNotifyRequest$VendorDepositNotifyRQCore](#com.ctrip.car.openapiservice.vo.request.osd.vendordepositnotifyrequest$vendordepositnotifyrqcore) |  |

### <a id='com.ctrip.car.openapiservice.vo.request.osd.vendordepositnotifyrequest$vendordepositnotifyrqcore'></a>com.ctrip.car.openapiservice.vo.request.osd.VendorDepositNotifyRequest$VendorDepositNotifyRQCore

The reservation id of Trip.com
Trip.com 的预订 ID

| Property | Type | Description |
| --- | --- | --- |
| amount | [com.ctrip.car.openapiservice.dto.search.PriceDTO](#com.ctrip.car.openapiservice.dto.search.pricedto) |  |
| confirmationCode | string | Vendor's confirmation Code<br>供应商确认代码 |
| description | string | deduction rejected reason<br>扣款拒绝原因 |
| status | string | The result of the customer service review: ''SUCCESS'' 、''FAIL''. Case sample: ''SUCCESS''  + type = DEDUCTION: deduction request approved;  ''SUCCESS'' + type = RELSEASE: deposit credit unfrozen； ''FAIL'' + type = DEDUCTION: deduction request rejected<br>客户服务审核结果：''SUCCESS'' 、''FAIL''。案例样本：''SUCCESS'' + type = DEDUCTION：扣款请求已批准； ''SUCCESS'' + type = RELSEASE：押金信用解冻； ''FAIL'' + type = DEDUCTION：扣款请求被拒绝 |
| tripDeductionId | string | The Deduction Id from Trip.com<br>Trip.com 的扣款 ID |
| tripOrderId | string | The reservation id of Trip.com<br>Trip.com 的预订 ID |
| type | string | ''DEDUCTION''  -- request deduction process for the guest. ''RELSEASE'' -- deposit credit release<br>''DEDUCTION'' -- 请求对客人进行扣款流程。 ''RELSEASE'' -- 押金信用释放 |
| vendorDeductionId | string | The Deduction Id from vendor<br>供应商的扣款 ID |

### <a id='com.ctrip.car.openapiservice.vo.request.osd.vendordepositnotifyresponse'></a>com.ctrip.car.openapiservice.vo.request.osd.VendorDepositNotifyResponse

VendorDepositNotifyResponse
供应商押金通知响应

| Property | Type | Description |
| --- | --- | --- |
| success | boolean | Processing status<br>处理状态 |
| vehNotifyRSCore | [com.ctrip.car.openapiservice.vo.request.osd.VendorDepositNotifyResponse$VendorDepositNotifyRSCore](#com.ctrip.car.openapiservice.vo.request.osd.vendordepositnotifyresponse$vendordepositnotifyrscore) |  |

### <a id='com.ctrip.car.openapiservice.vo.request.osd.vendordepositnotifyresponse$confid'></a>com.ctrip.car.openapiservice.vo.request.osd.VendorDepositNotifyResponse$ConfID

1- Order ID 2 - Confirmation number
1- 订单 ID 2 - 确认号

| Property | Type | Description |
| --- | --- | --- |
| id | string | A unique identifying value assigned by the creating system. The ID attribute may be used to reference a primary-key value within a database or in a particular implementation.<br>由创建系统分配的唯一标识值。ID 属性可用于引用数据库中的主键值或特定实现中的值。 |
| type | string | 1- Order ID 2 - Confirmation code<br>1- 订单 ID 2 - 确认代码 |

### <a id='com.ctrip.car.openapiservice.vo.request.osd.vendordepositnotifyresponse$vehreservation'></a>com.ctrip.car.openapiservice.vo.request.osd.VendorDepositNotifyResponse$VehReservation

Reservation information
预订信息

| Property | Type | Description |
| --- | --- | --- |
| status | string | Reservation status<br>预订状态 |
| vehSegmentCore | [com.ctrip.car.openapiservice.vo.request.osd.VendorDepositNotifyResponse$VehSegmentCore](#com.ctrip.car.openapiservice.vo.request.osd.vendordepositnotifyresponse$vehsegmentcore) |  |

### <a id='com.ctrip.car.openapiservice.vo.request.osd.vendordepositnotifyresponse$vehsegmentcore'></a>com.ctrip.car.openapiservice.vo.request.osd.VendorDepositNotifyResponse$VehSegmentCore

Reservation information
预订信息

| Property | Type | Description |
| --- | --- | --- |
| confIDs | Array of [com.ctrip.car.openapiservice.vo.request.osd.VendorDepositNotifyResponse$ConfID](#com.ctrip.car.openapiservice.vo.request.osd.vendordepositnotifyresponse$confid) | 1- Order ID 2 - Confirmation number<br>1- 订单 ID 2 - 确认号 |

### <a id='com.ctrip.car.openapiservice.vo.request.osd.vendordepositnotifyresponse$vendordepositnotifyrscore'></a>com.ctrip.car.openapiservice.vo.request.osd.VendorDepositNotifyResponse$VendorDepositNotifyRSCore

Reservation information
预订信息

| Property | Type | Description |
| --- | --- | --- |
| vehReservation | [com.ctrip.car.openapiservice.vo.request.osd.VendorDepositNotifyResponse$VehReservation](#com.ctrip.car.openapiservice.vo.request.osd.vendordepositnotifyresponse$vehreservation) |  |

### <a id='com.ctrip.car.openapiservice.vo.response.osd.collectlocationdetailrs'></a>com.ctrip.car.openapiservice.vo.response.osd.CollectLocationDetailRS

| Property | Type | Description |
| --- | --- | --- |
| errors | Array of [com.ctrip.car.openapiservice.dto.search.ErrorWarningAttributeGroup](#com.ctrip.car.openapiservice.dto.search.errorwarningattributegroup) | Indicate that an error occurred in the processing of the incoming request message. An error is defined as a malformed JSON message that could not be processed.A collection of errors that occurred during the processing of a message.<br>指示在处理传入请求消息时发生错误。错误定义为无法处理的格式错误的 JSON 消息。在处理消息期间发生的错误集合。 |
| locationDetails | Array of [com.ctrip.car.openapiservice.dto.search.VehLocDetail](#com.ctrip.car.openapiservice.dto.search.vehlocdetail) | A container for location detail information.<br>位置详细信息的容器。 |
| quantity | integer | The total number of locations of the integration.<br>集成的地点总数。 |
| success | boolean |  |

### <a id='com.ctrip.car.openapiservice.vo.response.osd.collectraters'></a>com.ctrip.car.openapiservice.vo.response.osd.CollectRateRS

rate
费率

| Property | Type | Description |
| --- | --- | --- |
| errors | Array of [com.ctrip.car.openapiservice.dto.search.ErrorWarningAttributeGroup](#com.ctrip.car.openapiservice.dto.search.errorwarningattributegroup) | Indicate that an error occurred in the processing of the incoming request message. An error is defined as a malformed JSON message that could not be processed.A collection of errors that occurred during the processing of a message.<br>指示在处理传入请求消息时发生错误。错误定义为无法处理的格式错误的 JSON 消息。在处理消息期间发生的错误集合。 |
| quantity | integer | The total number of rates in this message.<br>此消息中的费率总数。 |
| rates | Array of [com.ctrip.car.openapiservice.dto.VehRate](#com.ctrip.car.openapiservice.dto.vehrate) | Information on the rates associated with this vehicle.<br>关于与此车辆关联的费率的信息。 |
| success | boolean |  |

### <a id='com.ctrip.car.openapiservice.vo.response.osd.collectrulers'></a>com.ctrip.car.openapiservice.vo.response.osd.CollectRuleRS

rule同步响应体

| Property | Type | Description |
| --- | --- | --- |
| errors | Array of [com.ctrip.car.openapiservice.dto.search.ErrorWarningAttributeGroup](#com.ctrip.car.openapiservice.dto.search.errorwarningattributegroup) | Indicate that an error occurred in the processing of the incoming request message. An error is defined as a malformed JSON message that could not be processed.A collection of errors that occurred during the processing of a message.<br>指示在处理传入请求消息时发生错误。错误定义为无法处理的格式错误的 JSON 消息。在处理消息期间发生的错误集合。 |
| quantity | integer | The total number of rules in this message.<br>此消息中的规则总数。 |
| rules | Array of [com.ctrip.car.openapiservice.dto.search.Rule](#com.ctrip.car.openapiservice.dto.search.rule) | Rule information.<br>规则信息。 |
| success | boolean |  |

### <a id='com.ctrip.car.openapiservice.vo.response.osd.collectvehiclers'></a>com.ctrip.car.openapiservice.vo.response.osd.CollectVehicleRS

同步车型响应体

| Property | Type | Description |
| --- | --- | --- |
| errors | Array of [com.ctrip.car.openapiservice.dto.search.ErrorWarningAttributeGroup](#com.ctrip.car.openapiservice.dto.search.errorwarningattributegroup) | Indicate that an error occurred in the processing of the incoming request message. An error is defined as a malformed JSON message that could not be processed.A collection of errors that occurred during the processing of a message.<br>指示在处理传入请求消息时发生错误。错误定义为无法处理的格式错误的 JSON 消息。在处理消息期间发生的错误集合。 |
| quantity | integer | The total number of vehicles in this message.<br>此消息中的车辆总数。 |
| success | boolean |  |
| vehicles | Array of [com.ctrip.car.openapiservice.dto.search.Vehicle](#com.ctrip.car.openapiservice.dto.search.vehicle) | Information on the vehicles that are offered for rental at this facility.The Vehicle Location Vehicles Type is used to define information on the vehicles that are offered for rental at this facility.<br>关于在此设施提供租赁的车辆的信息。车辆位置车辆类型用于定义在此设施提供租赁的车辆的信息。 |

### <a id='com.ctrip.car.openapiservice.vo.response.osd.vehavailraters'></a>com.ctrip.car.openapiservice.vo.response.osd.VehAvailRateRS

Vehicle Availability and Rate Response
车辆可用性和费率响应

| Property | Type | Description |
| --- | --- | --- |
| errors | Array of [com.ctrip.car.openapiservice.dto.search.ErrorWarningAttributeGroup](#com.ctrip.car.openapiservice.dto.search.errorwarningattributegroup) | Indicate that an error occurred in the processing of the incoming request message. An error is defined as a malformed JSON message that could not be processed.A collection of errors that occurred during the processing of a message.<br>指示在处理传入请求消息时发生错误。错误定义为无法处理的格式错误的 JSON 消息。在处理消息期间发生的错误集合。 |
| success | boolean |  |
| vehAvailRSCore | [com.ctrip.car.openapiservice.dto.list.VehAvailRSCore](#com.ctrip.car.openapiservice.dto.list.vehavailrscore) |  |

### <a id='com.ctrip.car.openapiservice.vo.response.osd.vehcancelrs'></a>com.ctrip.car.openapiservice.vo.response.osd.VehCancelRS

Vehicle Cancel Reservation Response
车辆取消预订响应

| Property | Type | Description |
| --- | --- | --- |
| errors | Array of [com.ctrip.car.openapiservice.dto.search.ErrorWarningAttributeGroup](#com.ctrip.car.openapiservice.dto.search.errorwarningattributegroup) | Indicate that an error occurred in the processing of the incoming request message. An error is defined as a malformed JSON message that could not be processed.A collection of errors that occurred during the processing of a message.<br>指示在处理传入请求消息时发生错误。错误定义为无法处理的格式错误的 JSON 消息。在处理消息期间发生的错误集合。 |
| success | boolean |  |
| vehCancelRSCore | [com.ctrip.car.openapiservice.dto.booking.VehCancelRSCore](#com.ctrip.car.openapiservice.dto.booking.vehcancelrscore) |  |

### <a id='com.ctrip.car.openapiservice.vo.response.osd.vehlocdetailsnotifrs'></a>com.ctrip.car.openapiservice.vo.response.osd.VehLocDetailsNotifRS

rate推送响应体

| Property | Type | Description |
| --- | --- | --- |
| errors | Array of [com.ctrip.car.openapiservice.dto.search.ErrorWarningAttributeGroup](#com.ctrip.car.openapiservice.dto.search.errorwarningattributegroup) | Indicate that an error occurred in the processing of the incoming request message. An error is defined as a malformed JSON message that could not be processed.A collection of errors that occurred during the processing of a message.<br>指示在处理传入请求消息时发生错误。错误定义为无法处理的格式错误的 JSON 消息。在处理消息期间发生的错误集合。 |
| success | boolean |  |

### <a id='com.ctrip.car.openapiservice.vo.response.osd.vehratenotifrs'></a>com.ctrip.car.openapiservice.vo.response.osd.VehRateNotifRS

rate推送响应体

| Property | Type | Description |
| --- | --- | --- |
| errors | Array of [com.ctrip.car.openapiservice.dto.search.ErrorWarningAttributeGroup](#com.ctrip.car.openapiservice.dto.search.errorwarningattributegroup) | Indicate that an error occurred in the processing of the incoming request message. An error is defined as a malformed JSON message that could not be processed.A collection of errors that occurred during the processing of a message.<br>指示在处理传入请求消息时发生错误。错误定义为无法处理的格式错误的 JSON 消息。在处理消息期间发生的错误集合。 |
| success | boolean |  |

### <a id='com.ctrip.car.openapiservice.vo.response.osd.vehraterulenotifrs'></a>com.ctrip.car.openapiservice.vo.response.osd.VehRateRuleNotifRS

rule推送响应体

| Property | Type | Description |
| --- | --- | --- |
| errors | Array of [com.ctrip.car.openapiservice.dto.search.ErrorWarningAttributeGroup](#com.ctrip.car.openapiservice.dto.search.errorwarningattributegroup) | Indicate that an error occurred in the processing of the incoming request message. An error is defined as a malformed JSON message that could not be processed.A collection of errors that occurred during the processing of a message.<br>指示在处理传入请求消息时发生错误。错误定义为无法处理的格式错误的 JSON 消息。在处理消息期间发生的错误集合。 |
| success | boolean |  |

### <a id='com.ctrip.car.openapiservice.vo.response.osd.vehraterulers'></a>com.ctrip.car.openapiservice.vo.response.osd.VehRateRuleRS

Vehicle Rate Rule Response
车辆费率规则响应

| Property | Type | Description |
| --- | --- | --- |
| errors | Array of [com.ctrip.car.openapiservice.dto.search.ErrorWarningAttributeGroup](#com.ctrip.car.openapiservice.dto.search.errorwarningattributegroup) | Indicate that an error occurred in the processing of the incoming request message. An error is defined as a malformed JSON message that could not be processed.A collection of errors that occurred during the processing of a message.<br>指示在处理传入请求消息时发生错误。错误定义为无法处理的格式错误的 JSON 消息。在处理消息期间发生的错误集合。 |
| rentalRate | [com.ctrip.car.openapiservice.dto.detail.RentalRate](#com.ctrip.car.openapiservice.dto.detail.rentalrate) |  |
| success | boolean |  |
| vehRentalCore | [com.ctrip.car.openapiservice.dto.list.VehRentalCoreRS](#com.ctrip.car.openapiservice.dto.list.vehrentalcorers) |  |
| vehicle | [com.ctrip.car.openapiservice.dto.list.Vehicle](#com.ctrip.car.openapiservice.dto.list.vehicle) |  |

### <a id='com.ctrip.car.openapiservice.vo.response.osd.vehresrs'></a>com.ctrip.car.openapiservice.vo.response.osd.VehResRS

Vehicle Reservation Response
车辆预订响应

| Property | Type | Description |
| --- | --- | --- |
| errors | Array of [com.ctrip.car.openapiservice.dto.search.ErrorWarningAttributeGroup](#com.ctrip.car.openapiservice.dto.search.errorwarningattributegroup) | Indicate that an error occurred in the processing of the incoming request message. An error is defined as a malformed JSON message that could not be processed.A collection of errors that occurred during the processing of a message.<br>指示在处理传入请求消息时发生错误。错误定义为无法处理的格式错误的 JSON 消息。在处理消息期间发生的错误集合。 |
| success | boolean |  |
| vehResRSCore | [com.ctrip.car.openapiservice.dto.booking.VehResRSCore](#com.ctrip.car.openapiservice.dto.booking.vehresrscore) |  |

### <a id='com.ctrip.car.openapiservice.vo.response.osd.vehresstatusnotifrs'></a>com.ctrip.car.openapiservice.vo.response.osd.VehResStatusNotifRS

result
结果

| Property | Type | Description |
| --- | --- | --- |
| errors | Array of [com.ctrip.car.openapiservice.dto.search.ErrorWarningAttributeGroup](#com.ctrip.car.openapiservice.dto.search.errorwarningattributegroup) | Indicate that an error occurred in the processing of the incoming request message. An error is defined as a malformed JSON message that could not be processed.A collection of errors that occurred during the processing of a message.<br>指示在处理传入请求消息时发生错误。错误定义为无法处理的格式错误的 JSON 消息。在处理消息期间发生的错误集合。 |
| success | boolean |  |

### <a id='com.ctrip.car.openapiservice.vo.response.osd.vehretresrs'></a>com.ctrip.car.openapiservice.vo.response.osd.VehRetResRS

Vehicle Retrieve Reservation Response
查询车辆预订响应

| Property | Type | Description |
| --- | --- | --- |
| errors | Array of [com.ctrip.car.openapiservice.dto.search.ErrorWarningAttributeGroup](#com.ctrip.car.openapiservice.dto.search.errorwarningattributegroup) | Indicate that an error occurred in the processing of the incoming request message. An error is defined as a malformed JSON message that could not be processed.A collection of errors that occurred during the processing of a message.<br>指示在处理传入请求消息时发生错误。错误定义为无法处理的格式错误的 JSON 消息。在处理消息期间发生的错误集合。 |
| success | boolean |  |
| vehRetResRSCore | [com.ctrip.car.openapiservice.dto.booking.VehRetResRSCore](#com.ctrip.car.openapiservice.dto.booking.vehretresrscore) |  |

### <a id='com.ctrip.car.openapiservice.vo.response.osd.vehiclenotifrs'></a>com.ctrip.car.openapiservice.vo.response.osd.VehicleNotifRS

Vehicle推送响应体

| Property | Type | Description |
| --- | --- | --- |
| errors | Array of [com.ctrip.car.openapiservice.dto.search.ErrorWarningAttributeGroup](#com.ctrip.car.openapiservice.dto.search.errorwarningattributegroup) | Indicate that an error occurred in the processing of the incoming request message. An error is defined as a malformed JSON message that could not be processed.A collection of errors that occurred during the processing of a message.<br>指示在处理传入请求消息时发生错误。错误定义为无法处理的格式错误的 JSON 消息。在处理消息期间发生的错误集合。 |
| success | boolean |  |

### <a id='commissionamount'></a>commissionAmount

Amount of commission in <feeAmount>.
<feeAmount> 中的佣金金额。

| Property | Type | Description |
| --- | --- | --- |
| amount | number | amount<br>金额 |
| currency | string | currency of the amount, e.g. USD, please refer to CurrencyType enum for the complete list of currencies supported by Trip<br>金额的货币，例如 USD，请参阅 CurrencyType 枚举以获取 Trip 支持的货币的完整列表 |

### <a id='coverageamount'></a>coverageAmount

The coverage amount.
保险金额。

| Property | Type | Description |
| --- | --- | --- |
| amount | number | amount<br>金额 |
| currency | string | currency of the amount, e.g. USD, please refer to CurrencyType enum for the complete list of currencies supported by Trip<br>金额的货币，例如 USD，请参阅 CurrencyType 枚举以获取 Trip 支持的货币的完整列表 |

### <a id='deductibleamount'></a>deductibleAmount

The deductible amount.
免赔额。

| Property | Type | Description |
| --- | --- | --- |
| amount | number | amount<br>金额 |
| currency | string | currency of the amount, e.g. USD, please refer to CurrencyType enum for the complete list of currencies supported by Trip<br>金额的货币，例如 USD，请参阅 CurrencyType 枚举以获取 Trip 支持的货币的完整列表 |

### <a id='estimatedcustomeramount'></a>estimatedCustomerAmount

Total reservation rate price.
总预订费率价格。

| Property | Type | Description |
| --- | --- | --- |
| amount | number | amount<br>金额 |
| currency | string | currency of the amount, e.g. USD, please refer to CurrencyType enum for the complete list of currencies supported by Trip<br>金额的货币，例如 USD，请参阅 CurrencyType 枚举以获取 Trip 支持的货币的完整列表 |

### <a id='estimatedtotalamount'></a>estimatedTotalAmount

Total rental charges including any additional mandatory charges (Amount must include taxes).
This total encompasses both prepaid amounts and pay-on-arrival charges.
总租赁费用，包括任何额外的强制性费用（金额必须包含税费）。
此总计包括预付金额和到店支付费用。

| Property | Type | Description |
| --- | --- | --- |
| amount | number | amount<br>金额 |
| currency | string | currency of the amount, e.g. USD, please refer to CurrencyType enum for the complete list of currencies supported by Trip<br>金额的货币，例如 USD，请参阅 CurrencyType 枚举以获取 Trip 支持的货币的完整列表 |

### <a id='feeamount'></a>feeAmount

Amount must include taxes
金额必须包含税费

| Property | Type | Description |
| --- | --- | --- |
| amount | number | amount<br>金额 |
| currency | string | currency of the amount, e.g. USD, please refer to CurrencyType enum for the complete list of currencies supported by Trip<br>金额的货币，例如 USD，请参阅 CurrencyType 枚举以获取 Trip 支持的货币的完整列表 |

### <a id='ratecalcommissionamount'></a>rateCalCommissionAmount

Amount that can be used to calculate commission in <feeAmount>.
可用于计算 <feeAmount> 中佣金的金额。

| Property | Type | Description |
| --- | --- | --- |
| amount | number | amount<br>金额 |
| currency | string | currency of the amount, e.g. USD, please refer to CurrencyType enum for the complete list of currencies supported by Trip<br>金额的货币，例如 USD，请参阅 CurrencyType 枚举以获取 Trip 支持的货币的完整列表 |

### <a id='ratepayonarrivedamount'></a>ratePayOnArrivedAmount

Amount paid in store from rental charges (Amount must include taxes)
租赁费用中到店支付的金额（金额必须包含税费）

| Property | Type | Description |
| --- | --- | --- |
| commissionAmount | [commissionAmount](#commissionamount) |  |
| feeAmount | [feeAmount](#feeamount) |  |
| rateCalCommissionAmount | [rateCalCommissionAmount](#ratecalcommissionamount) |  |
| taxAmount | [taxAmount](#taxamount) |  |

### <a id='rateprepaidamount'></a>ratePrepaidAmount

Amount paid in advance from rental charges (Amount must include taxes)
租赁费用中预付的金额（金额必须包含税费）

| Property | Type | Description |
| --- | --- | --- |
| commissionAmount | [commissionAmount](#commissionamount) |  |
| feeAmount | [feeAmount](#feeamount) |  |
| rateCalCommissionAmount | [rateCalCommissionAmount](#ratecalcommissionamount) |  |
| taxAmount | [taxAmount](#taxamount) |  |

### <a id='taxamount'></a>taxAmount

Tax amount in <feeAmount>.
<feeAmount> 中的税额。

| Property | Type | Description |
| --- | --- | --- |
| amount | number | amount<br>金额 |
| currency | string | currency of the amount, e.g. USD, please refer to CurrencyType enum for the complete list of currencies supported by Trip<br>金额的货币，例如 USD，请参阅 CurrencyType 枚举以获取 Trip 支持的货币的完整列表 |


