# Carmore GOTAR API
# Carmore GOTAR API（中文）

**Version:** 1.0.0  
**版本:** 1.0.0

Specification based on Carmore official GOTAR API 1.0.0. It covers vehicle search, vehicle details, order creation and management, affiliate information, and car model data. Authentication uses JWT Bearer and supports both synchronous and asynchronous booking. This document is suitable for importing into tools such as Apifox; some fields are simplified, so refer to the official documentation for production integration.  
基于 Carmore 官方 GOTAR API 1.0.0 文档整理，覆盖车辆查询、车辆详情、订单创建与管理、合作伙伴信息以及车型信息等接口。认证采用 JWT Bearer，并支持同步与异步预订。本文档适合导入 Apifox 等工具；部分字段已简化，生产集成请以官方文档为准。

## Servers
## 服务器

- **https://api.carmore.kr**: Production environment（生产环境）

## General Information
## 基本信息

### Integration Process
### 集成流程

The overall integration process for GOTAR API:
GOTAR API 的整体集成流程：

![GOTAR API Flow](./images/gotar-booking-flow.svg)

### Authentication
### 认证

Most endpoints require JWT Bearer authentication.  
大部分接口需要 JWT Bearer 认证。

Use the `Authorization` header with the following format:  
使用如下格式的 `Authorization` 头：

`Authorization: Bearer <access_token>`

Token reissuance endpoints (`/reissuance`, `/reissuance/refresh`) do not require this header.
令牌重签发接口（`/reissuance`, `/reissuance/refresh`）不需要该头。

---

## API Request & Response Examples
## API 请求和响应示例

This section provides a quick reference guide to help developers understand the API structure and typical integration workflows.
本节提供快速参考指南，帮助开发者理解 API 结构和典型集成工作流程。

### API Classification by Function
### 按功能分类的 API

#### 1. Authentication APIs (认证 API)
Used to obtain and refresh access tokens for API authentication.
用于获取和刷新 API 认证所需的访问令牌。

- [POST /reissuance](#reissuance) - Reissue access token when current token expires
  当前令牌过期时重新签发访问令牌
- [POST /reissuance/refresh](#reissuancerefresh) - Reissue refresh token when it expires
  刷新令牌过期时重新签发

#### 2. Basic Data Query APIs (基础数据查询 API)
Used to retrieve static information about affiliates and car models.
用于检索合作伙伴和车型的静态信息。

- [GET /affiliates](#affiliates) - List all registered affiliates with pagination
  分页获取所有已注册合作伙伴
- [GET /affiliates/{affiliateId}](#affiliatesaffiliateid) - Get detailed information about a specific affiliate
  获取特定合作伙伴的详细信息
- [GET /cars](#cars) - List car models with optional filters (brand, seats, etc.)
  列出车型，支持可选过滤（品牌、座位数等）
- [GET /cars/{carId}](#carscarid) - Get detailed specifications of a specific car model
  获取特定车型的详细规格

#### 3. Search & Quote APIs (搜索和报价 API)
Core APIs for searching available vehicles and retrieving detailed information.
搜索可用车辆和检索详细信息的核心 API。

- [GET /vehicles](#vehicles) - Search available vehicles based on location, dates, and driver info
  根据地点、日期和驾驶员信息搜索可用车辆
- [GET /vehicles/{vehicleId}](#vehiclesvehicleid) - Get detailed pricing, insurance, and policies for a specific vehicle
  获取特定车辆的详细价格、保险和政策

#### 4. Booking Management APIs (预订管理 API)
APIs for creating, querying, and canceling reservations.
用于创建、查询和取消预订的 API。

- [POST /orders](#orders) - Create a new booking synchronously (immediate confirmation)
  同步创建新预订（立即确认）
- [POST /orders/async](#ordersasync) - Create a new booking asynchronously (requires status check)
  异步创建新预订（需要状态检查）
- [GET /orders/{orderId}](#ordersorderid) - Query booking details and current status
  查询预订详情和当前状态
- [DELETE /orders/{orderId}](#ordersorderid-1) - Cancel an existing booking
  取消现有预订

### Typical Business Flow
### 典型业务流程

```
1. Authentication (认证)
   └─> POST /reissuance
       └─> Obtain access_token and refresh_token
           获取 access_token 和 refresh_token

2. Data Preparation (Optional - 数据准备-可选)
   ├─> GET /affiliates (Get affiliate/shop information / 获取合作伙伴/门店信息)
   └─> GET /cars (Get car model information / 获取车型信息)

3. Search Vehicles (搜索车辆)
   └─> GET /vehicles
       ├─> Input: pickup/return location, dates, driver age
       │   输入：取还车地点、日期、驾驶员年龄
       └─> Output: List of available vehicles with pricing
           输出：可用车辆列表及价格

4. Get Vehicle Details (获取车辆详情)
   └─> GET /vehicles/{vehicleId}
       ├─> Input: vehicleId from search results
       │   输入：搜索结果中的 vehicleId
       └─> Output: Detailed pricing, insurance, cancellation policy
           输出：详细价格、保险、取消政策

5. Create Booking (创建预订)
   ├─> POST /orders (Synchronous / 同步)
   │   └─> Immediate confirmation with orderId
   │       立即确认并返回 orderId
   │
   └─> POST /orders/async (Asynchronous / 异步)
       └─> Returns trackingId, requires status check
           返回 trackingId，需要检查状态

6. Manage Booking (管理预订)
   ├─> GET /orders/{orderId} (Query status / 查询状态)
   │   └─> Check booking status, get confirmation details
   │       检查预订状态，获取确认详情
   │
   └─> DELETE /orders/{orderId} (Cancel booking / 取消预订)
       └─> Cancel and calculate cancellation fees
           取消并计算取消费用

7. Token Refresh (令牌刷新)
   └─> POST /reissuance (When access_token expires / 当 access_token 过期时)
   └─> POST /reissuance/refresh (When refresh_token expires / 当 refresh_token 过期时)
```

### Quick Reference: Key API Examples
### 快速参考：关键 API 示例

#### Authentication Example (认证示例)
```bash
# Reissue Access Token
POST https://api.rentcar.com/v1/reissuance
Content-Type: application/json

{
  "access_token": "eyJhbGc...",
  "refresh_token": "eyJhbGc..."
}

# Response
{
  "code": "200",
  "accessToken": "eyJhbGc...",
  "refreshToken": "eyJhbGc..."
}
```

#### Search Vehicles Example (搜索车辆示例)
```bash
# Search Available Vehicles
GET https://api.rentcar.com/v1/vehicles?countryCode=US&returnCountryCode=US&currency=USD&age=25&pickupDateTime=2024-04-05T10:00:00&returnDateTime=2024-04-25T10:00:00&pickupLocationCode=LAX&returnLocationCode=LAX&pickupLatitude=33.9416&pickupLongitude=-118.4085&returnLatitude=33.9416&returnLongitude=-118.4085
Authorization: Bearer <access_token>

# Response includes:
# - cars: List of car models
# - vehicles: List of available vehicles with pricing
# - vendors: Rental companies
# - shops: Pickup/return locations
```

#### Create Booking Example (创建预订示例)
```bash
# Create Synchronous Booking
POST https://api.rentcar.com/v1/orders
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "_id": "BG1231312",
  "id": "BG_QA_12",
  "pickupShopId": "KL_12",
  "returnShopId": "KL_12",
  "currency": "USD",
  "pickupDateTime": "2024-04-05T10:00:00",
  "returnDateTime": "2024-04-25T10:00:00",
  "driverEmail": "customer@example.com",
  "driverFirstName": "John",
  "driverLastName": "Doe",
  "driverAge": 30
}

# Response
{
  "statusCode": 200,
  "ok": true,
  "result": {
    "orderId": "string",
    "status": "pending"
  }
}
```

### Error Handling
### 错误处理

All APIs follow a consistent error response format:
所有 API 遵循一致的错误响应格式：

```json
{
  "statusCode": 400,
  "timestamp": "2024-02-05T14:48:00.000Z",
  "path": "https://api.rentcar.com/v1/...",
  "trackingId": "UUID.v4",
  "ok": false,
  "error": {
    "code": "INVALID_REQUEST",
    "message": "Missing required parameter: pickupDateTime"
  }
}
```

Common HTTP Status Codes:
常见 HTTP 状态码：

- **200**: Success (成功)
- **400**: Bad Request - Invalid parameters (错误请求 - 参数无效)
- **401**: Unauthorized - Invalid or expired token (未授权 - 令牌无效或已过期)
- **404**: Not Found - Resource does not exist (未找到 - 资源不存在)
- **409**: Conflict - Resource not available or insufficient inventory (冲突 - 资源不可用或库存不足)

---

## Paths
## 路径

### /reissuance

#### POST

**Summary:** Reissue access token
**摘要:** 重新签发访问令牌

Use this endpoint to reissue a new access token when the current one expires.
当访问令牌过期时，使用该接口重签发新的访问令牌。

**Endpoint:** `https://api.rentcar.com/v1/reissuance`

**Request Body**
**请求体**

- **Content-Type:** application/json
- **Schema:** [AuthRequest](#authrequest)
- **Required:** true

**Request Example:**
**请求示例：**

```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c",
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.cThIIoDvwdueQB4NdjXBZJAXBL83wXcg_OfvYYje3TY"
}
```

**Responses**
**响应**

- **200**: Success
  - **200**: 成功
  - **Content-Type:** application/json
  - **Schema:** [AuthResponse](#authresponse)

**Response Example:**
**响应示例：**

```json
{
  "code": "200",
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.cThIIoDvwdueQB4NdjXBZJAXBL83wXcg_OfvYYje3TY"
}
```

**Error Responses:**
**错误响应：**

- **401**: Unauthorized - Invalid or expired tokens
  - **401**: 未授权 - 令牌无效或已过期
  - **Content-Type:** application/json
  - **Schema:** [AuthError](#autherror)

```json
{
  "code": "401",
  "errorMessage": "Invalid or expired refresh token"
}
```

---

### /reissuance/refresh

#### POST

**Summary:** Reissue refresh token  
**摘要:** 重新签发刷新令牌

Use this endpoint to reissue a refresh token when the current refresh token expires.
当刷新令牌过期时，使用该接口重签发新的刷新令牌。

**Endpoint:** `https://api.rentcar.com/v1/reissuance/refresh`

**Request Body**
**请求体**

- **Content-Type:** application/json
- **Schema:** [AuthRequestForReissuanceRefresh](#authrequestforreissuancerefresh)
- **Required:** true

**Request Example:**
**请求示例：**

```json
{
  "client_id": "string",
  "refresh_token": "string"
}
```

**Responses**
**响应**

- **200**: Success
  - **200**: 成功
  - **Content-Type:** application/json
  - **Schema:** [AuthResponse](#authresponse)

**Response Example:**
**响应示例：**

```json
{
  "code": "string",
  "accessToken": "string",
  "refreshToken": "string"
}
```

**Error Responses:**
**错误响应：**

- **401**: Unauthorized - Invalid or expired refresh token
  - **401**: 未授权 - 刷新令牌无效或已过期
  - **Content-Type:** application/json
  - **Schema:** [AuthError](#autherror)

```json
{
  "code": "401",
  "errorMessage": "Invalid or expired refresh token"
}
```

---

### /vehicles

#### GET

**Summary:** Search available vehicles  
**摘要:** 查询可预订车辆

Return a list of available vehicles based on rental country, return country, pickup/return time, and location.  
根据租车国家、还车国家、取还时间与地点返回可预订车辆列表。

**Security:** BearerAuth (JWT)  
**安全认证:** JWT Bearer

**Parameters**  
**参数**

| Name | In | Type | Required | Description |
| :--- | :--- | :--- | :--- | :--- |
| countryCode | query | string | Yes | Country code (ISO 3166-1 alpha-2). <br> 国家代码（ISO 3166-1 alpha-2）。 |
| returnCountryCode | query | string | Yes | Return country code (ISO 3166-1 alpha-2), used for one-way rentals. <br> 还车国家代码（ISO 3166-1 alpha-2），用于单程租车。 |
| currency | query | string | Yes | Currency code (ISO 4217). <br> 货币代码（ISO 4217）。 |
| age | query | integer | Yes | Driver age. <br> 驾驶员年龄。 |
| pickupDateTime | query | string (date-time) | Yes | Local pickup datetime. Format: `YYYY-MM-DDTHH:mm:ss`. <br> 本地取车时间，格式：`YYYY-MM-DDTHH:mm:ss`。 |
| returnDateTime | query | string (date-time) | Yes | Local return datetime. Format: `YYYY-MM-DDTHH:mm:ss`. <br> 本地还车时间，格式：`YYYY-MM-DDTHH:mm:ss`。 |
| pickupLocationCode | query | string | No | Pickup airport IATA code. Optional when searching by coordinates. <br> 取车机场 IATA 码，坐标检索时可省略。 |
| returnLocationCode | query | string | No | Return airport IATA code for one-way rentals. <br> 单程还车机场 IATA 码。 |
| pickupLatitude | query | number (float) | Yes | Pickup latitude. <br> 取车纬度。 |
| pickupLongitude | query | number (float) | Yes | Pickup longitude. <br> 取车经度。 |
| returnLatitude | query | number (float) | Yes | Return latitude. <br> 还车纬度。 |
| returnLongitude | query | number (float) | Yes | Return longitude. <br> 还车经度。 |
| searchRadius | query | number | No | Search radius in km. Default: 10. <br> 搜索半径（km），默认 10。 |

**Endpoint:** `https://api.rentcar.com/v1/vehicles`

**Responses**
**响应**

- **200**: Success
  - **200**: 成功
  - **Content-Type:** application/json
  - **Schema:** [VehicleListResponse](#vehiclelistresponse)

**Response Example:**
**响应示例：**

```json
{
  "statusCode": 200,
  "timestamp": "2022-10-05T14:48:00.000Z",
  "path": "https://..../....",
  "trackingId": "UUID.v4",
  "ok": true,
  "result": {
    "cars": [
      {
        "id": "BG_QA_12",
        "sippCode": "CBAD",
        "model": "K3",
        "brand": "KIA",
        "description": "The Kia K3 is a modern subcompact sedan",
        "images": {
          "primary": "",
          "images": [
            "https://example.com/car1.jpg",
            "https://example.com/car2.jpg"
          ]
        },
        "seats": 4,
        "doors": 4,
        "baggageQuantity": 2,
        "hasAirCondition": true,
        "transmissionType": "A/T",
        "isModelGuaranteed": true
      }
    ],
    "vehicles": [
      {
        "_id": "BG::BG_ASASBDSBASDBAS_BDSBASDBASB_SABADSBSB",
        "_carId": "BG_ASASBDSBASDBAS_BDSBASDBASB_SABADSBSB",
        "availableShopCombinations": [
          {
            "pickupShopId": "KL_12",
            "returnShopId": "KL_13"
          }
        ],
        "carGroupTypeId": -1,
        "fuelPolicy": "FULL_TO_FULL",
        "isReleasedInOneYear": true,
        "maxYear": "2020",
        "minYear": "2020",
        "requiredDrivingExperience": 1,
        "agePolicy": {
          "minAge": 21,
          "freeAge": 23,
          "maxAge": 80
        },
        "insurance": {
          "coverage": [
            {
              "title": "Additional third-party liability insurance",
              "code": "ALI",
              "subInsurances": [
                {
                  "title": "Additional third-party liability insurance",
                  "depositMin": {
                    "currency": "USD",
                    "amount": 166.85
                  },
                  "depositMax": {
                    "currency": "USD",
                    "amount": 166.85
                  },
                  "excessMin": {
                    "currency": "USD",
                    "amount": 166.85
                  },
                  "excessMax": {
                    "currency": "USD",
                    "amount": 166.85
                  },
                  "hasExcess": true,
                  "hasDeposit": true,
                  "coverageScope": "LIABILITY"
                }
              ]
            }
          ],
          "originCoveragePackage": "BASIC",
          "coveragePackage": "BASIC"
        },
        "isDistanceUnlimited": true,
        "distanceLimitType": "RENTAL",
        "distanceLimit": "150(Mile)",
        "reservation": {
          "isImmediateConfirmation": true,
          "confirmInHours": 24,
          "price": {
            "paymentMode": 1,
            "totalPrice": {
              "currency": "USD",
              "amount": 166.85
            },
            "payablePrice": {
              "currency": "USD",
              "amount": 166.85
            },
            "payOnArrivalPrice": {
              "currency": "USD",
              "amount": 166.85
            },
            "retailPrice": {
              "currency": "USD",
              "amount": 166.85
            }
          },
          "creditCard": [
            {
              "availableCardVendor": [
                "China UnionPay",
                "VISA",
                "MasterCard",
                "Diners",
                "AMEX"
              ],
              "rentalRate": 100,
              "depositMin": {
                "currency": "USD",
                "amount": 166.85
              },
              "depositMax": {
                "currency": "USD",
                "amount": 166.85
              },
              "depositRemark": "Additional information about the deposit",
              "thawDaysMin": 30,
              "thawDaysMax": 60,
              "isNeedPinCode": false,
              "isForUpscaleCar": true,
              "creditCardProperty": 2
            }
          ],
          "cancellationPolicy": {
            "freeCancellationHours": 0,
            "freeCancellationHoursAfterReservation": 0,
            "cancellationCharges": [
              {
                "beforeRentalWithinEnd": 0,
                "beforeRentalWithinStart": 48,
                "chargeMode": 2,
                "chargeFixedAmount": {
                  "currency": "USD",
                  "amount": 166.85
                },
                "chargePercentage": 0.5,
                "chargeDays": 1
              }
            ]
          },
          "hasDeposit": true,
          "oneWayRental": {
            "paymentOnDeparture": {
              "currency": "USD",
              "amount": 166.85
            },
            "paymentOnArrival": {
              "currency": "USD",
              "amount": 166.85
            }
          },
          "reservationDescriptions": [
            {
              "title": "Payment includes",
              "description": "Includes vehicle rental fee and basic insurance."
            }
          ]
        },
        "hasGPS": true,
        "freeExtraDriverInfo": {
          "isAvailableFreeExtraDriver": true,
          "quantity": 1
        },
        "isNeedPort": false,
        "isNeedFlightNo": false,
        "policies": {
          "title": "",
          "description": ""
        },
        "addOns": [
          {
            "id": "",
            "name": "infant car seat",
            "description": "This is a car seat for infants.",
            "stockCount": 99,
            "maxAvailableCountPerReservation": 3,
            "paymentMode": 1,
            "price": {
              "prepaidPrice": {
                "currency": "USD",
                "amount": 166.85
              },
              "payOnArrivalPrice": {
                "currency": "USD",
                "amount": 166.85
              }
            },
            "chargeType": "PER_DAY",
            "isRequired": false,
            "isNeedConfirm": false
          }
        ]
      }
    ],
    "vendors": [
      {
        "_id": "BG_001",
        "name": "Budget",
        "code": "BUG"
      }
    ],
    "shops": [
      {
        "_id": "BG_ABC_123",
        "_vendorId": "BG_001",
        "name": "Budget Hawthorne Ca",
        "contacts": [
          "310-970-1792"
        ],
        "operationTimes": [
          {
            "day": "MON",
            "open": "00:00",
            "close": "22:00",
            "closeNextDay": false
          }
        ],
        "seasonalOperationTimes": [
          {
            "day": "MON",
            "startDate": "2023-01-01",
            "endDate": "2023-01-31",
            "open": "00:00",
            "close": "22:00",
            "closeNextDay": false
          }
        ],
        "operationBreakTimes": [
          {
            "day": "MON",
            "start": "14:00",
            "end": "15:00"
          }
        ],
        "seasonalOperationBreakTimes": [
          {
            "day": "MON",
            "startDate": "2023-01-01",
            "endDate": "2023-01-31",
            "start": "14:00",
            "end": "15:00"
          }
        ],
        "licensePolicies": [
          {
            "foreigner": true,
            "requiredLicenses": [
              "International Driving Permit",
              "A physical driver's license from your place of residence"
            ],
            "description": "The International Driving Permit (IDP) is a translated version of your driver's license. Therefore, you must always bring your original driver's license."
          }
        ],
        "location": {
          "name": "LOS ANGELES INTL AIRPORT",
          "address": "",
          "streetAddress": "9000 AIRPORT BOULEVARD",
          "positionType": -1,
          "terminalCode": "T1",
          "wayOfArrival": "Use the free shuttle bus",
          "isAirportShop": false,
          "latitude": 127.001,
          "longitude": 1.234
        },
        "identificationPolicies": [
          {
            "foreigner": false,
            "requiredDocuments": [
              "valid identification card"
            ]
          }
        ],
        "shopGuide": "",
        "pickupGuide": [
          {
            "title": "pickup information",
            "content": "Exit baggage claim and follow the sign to 'Ground Transportation' and wait at the shuttle bus pickup area."
          }
        ],
        "returnGuide": [
          {
            "title": "return information",
            "content": "Return the vehicle to the designated parking area and drop off the keys at the counter."
          }
        ],
        "holidayNotice": "",
        "specialNotice": "",
        "chargedTimes": [
          {
            "day": "MON",
            "open": "12:00",
            "close": "14:00"
          }
        ],
        "chargedTimePrice": {
          "currency": "USD",
          "amount": 10
        },
        "cancellationPolicy": null,
        "returnShop": null
      }
    ]
  }
}
```

**Error Responses:**
**错误响应：**

- **400**: Bad request
  - **400**: 错误请求
  - **Content-Type:** application/json
  - **Schema:** [CommonResponse](#commonresponse)

---

### /vehicles/{vehicleId}

#### GET

**Summary:** Get vehicle details  
**摘要:** 获取车辆详情

Return detailed vehicle information by vehicle ID and query conditions (price, insurance, pickup/return shop pairing, etc.).  
根据车辆 ID 与查询条件获取车辆详细信息（含价格、保险、取还车门店组合等）。

**Security:** BearerAuth (JWT)  
**安全认证:** JWT Bearer

**Parameters**  
**参数**

| Name | In | Type | Required | Description |
| :--- | :--- | :--- | :--- | :--- |
| vehicleId | path | string | Yes | Vehicle unique identifier. <br> 车辆唯一标识。 |
| currency | query | string | Yes | Currency code (ISO 4217). <br> 货币代码（ISO 4217）。 |
| age | query | integer | Yes | Driver age. <br> 驾驶员年龄。 |
| pickupDateTime | query | string (date-time) | Yes | Local pickup datetime. Format: `YYYY-MM-DDTHH:mm:ss`. <br> 本地取车时间，格式：`YYYY-MM-DDTHH:mm:ss`。 |
| returnDateTime | query | string (date-time) | Yes | Local return datetime. Format: `YYYY-MM-DDTHH:mm:ss`. <br> 本地还车时间，格式：`YYYY-MM-DDTHH:mm:ss`。 |
| pickupShopId | query | string | Yes | Pickup shop ID. <br> 取车门店 ID。 |
| returnShopId | query | string | Yes | Return shop ID. <br> 还车门店 ID。 |

**Endpoint:** `https://api.rentcar.com/v1/vehicles/{vehicleId}`

**Responses**
**响应**

- **200**: Success
  - **200**: 成功
  - **Content-Type:** application/json
  - **Schema:** [VehicleDetailResponse](#vehicledetailresponse)

**Response Example:**
**响应示例：**

```json
{
  "statusCode": 200,
  "timestamp": "2022-10-05T14:48:00.000Z",
  "path": "https://..../....",
  "trackingId": "UUID.v4",
  "ok": true,
  "result": {
    "_id": "BG::BG_ASASBDSBASDBAS_BDSBASDBASB_SABADSBSB",
    "_carId": "BG_ASASBDSBASDBAS_BDSBASDBASB_SABADSBSB",
    "availableShopCombinations": [
      {
        "pickupShopId": "KL_12",
        "returnShopId": "KL_13"
      }
    ],
    "carGroupTypeId": -1,
    "fuelPolicy": "FULL_TO_FULL",
    "isReleasedInOneYear": true,
    "maxYear": "2020",
    "minYear": "2020",
    "requiredDrivingExperience": 1,
    "agePolicy": {
      "minAge": 21,
      "freeAge": 23,
      "maxAge": 80
    },
    "insurance": {
      "coverage": [
        {
          "title": "Additional third-party liability insurance",
          "code": "ALI",
          "subInsurances": [
            {
              "title": "Additional third-party liability insurance",
              "depositMin": {
                "currency": "USD",
                "amount": 166.85
              },
              "depositMax": {
                "currency": "USD",
                "amount": 166.85
              },
              "excessMin": {
                "currency": "USD",
                "amount": 166.85
              },
              "excessMax": {
                "currency": "USD",
                "amount": 166.85
              },
              "hasExcess": true,
              "hasDeposit": true,
              "coverageScope": "LIABILITY"
            }
          ]
        }
      ],
      "originCoveragePackage": "BASIC",
      "coveragePackage": "BASIC"
    },
    "isDistanceUnlimited": true,
    "distanceLimitType": "RENTAL",
    "distanceLimit": "150(Mile)",
    "reservation": {
      "isImmediateConfirmation": true,
      "confirmInHours": 24,
      "price": {
        "paymentMode": 1,
        "totalPrice": {
          "currency": "USD",
          "amount": 166.85
        },
        "payablePrice": {
          "currency": "USD",
          "amount": 166.85
        },
        "payOnArrivalPrice": {
          "currency": "USD",
          "amount": 166.85
        },
        "retailPrice": {
          "currency": "USD",
          "amount": 166.85
        }
      },
      "creditCard": [
        {
          "availableCardVendor": [
            "China UnionPay",
            "VISA",
            "MasterCard",
            "Diners",
            "AMEX"
          ],
          "rentalRate": 100,
          "depositMin": {
            "currency": "USD",
            "amount": 166.85
          },
          "depositMax": {
            "currency": "USD",
            "amount": 166.85
          },
          "depositRemark": "Additional information about the deposit",
          "thawDaysMin": 30,
          "thawDaysMax": 60,
          "isNeedPinCode": false,
          "isForUpscaleCar": true,
          "creditCardProperty": 2
        }
      ],
      "cancellationPolicy": {
        "freeCancellationHours": 0,
        "freeCancellationHoursAfterReservation": 0,
        "cancellationCharges": [
          {
            "beforeRentalWithinEnd": 0,
            "beforeRentalWithinStart": 48,
            "chargeMode": 2,
            "chargeFixedAmount": {
              "currency": "USD",
              "amount": 166.85
            },
            "chargePercentage": 0.5,
            "chargeDays": 1
          }
        ]
      },
      "hasDeposit": true,
      "oneWayRental": {
        "paymentOnDeparture": {
          "currency": "USD",
          "amount": 166.85
        },
        "paymentOnArrival": {
          "currency": "USD",
          "amount": 166.85
        }
      },
      "reservationDescriptions": [
        {
          "title": "Payment includes",
          "description": "Includes vehicle rental fee and basic insurance."
        }
      ]
    },
    "hasGPS": true,
    "freeExtraDriverInfo": {
      "isAvailableFreeExtraDriver": true,
      "quantity": 1
    },
    "isNeedPort": false,
    "isNeedFlightNo": false,
    "policies": {
      "title": "",
      "description": ""
    },
    "addOns": [
      {
        "id": "",
        "name": "infant car seat",
        "description": "This is a car seat for infants.",
        "stockCount": 99,
        "maxAvailableCountPerReservation": 3,
        "paymentMode": 1,
        "price": {
          "prepaidPrice": {
            "currency": "USD",
            "amount": 166.85
          },
          "payOnArrivalPrice": {
            "currency": "USD",
            "amount": 166.85
          }
        },
        "chargeType": "PER_DAY",
        "isRequired": false,
        "isNeedConfirm": false
      }
    ]
  }
}
```

**Error Responses:**
**错误响应：**

- **404**: Not found
  - **404**: 未找到
  - **Content-Type:** application/json
  - **Schema:** [CommonResponse](#commonresponse)

---

### /orders

#### POST

**Summary:** Create booking (sync)  
**摘要:** 创建预订（同步）

Create a booking synchronously and return the booking result immediately.  
以同步方式创建预订并立即返回结果。

**Security:** BearerAuth (JWT)  
**安全认证:** JWT Bearer

**Endpoint:** `https://api.rentcar.com/v1/orders`

**Request Body**
**请求体**

- **Content-Type:** application/json
- **Schema:** [OrderCreateRequestBody](#ordercreaterequestbody)
- **Required:** true

**Request Example:**
**请求示例：**

```json
{
  "_id": "BG1231312",
  "id": "BG_QA_12",
  "pickupShopId": "KL_12",
  "returnShopId": "KL_12",
  "currency": "USD",
  "carmoreOrderId": "BG1231312",
  "countryCode": "US",
  "returnCountryCode": "US",
  "pickupDateTime": "2022-11-22T05:31:45",
  "returnDateTime": "2022-11-24T05:31:45",
  "driverPhone": "+8201012345678",
  "driverEmail": "dev@teamo2.kr",
  "flightNo": "KE111",
  "driverFirstName": "오투",
  "driverLastName": "팀",
  "driverGender": "M",
  "driverAge": 30,
  "adult": 1,
  "child": 1,
  "infant": 1,
  "pickupLatitude": 127.001,
  "pickupLongitude": 1.234,
  "returnLatitude": 127.001,
  "returnLongitude": 127.001,
  "addOns": [
    {
      "id": "addon_123",
      "count": 1
    }
  ]
}
```

**Responses**
**响应**

- **200**: Success
  - **200**: 成功
  - **Content-Type:** application/json
  - **Schema:** [OrderCreateResponse](#ordercreateresponse)

**Response Example:**
**响应示例：**

```json
{
  "statusCode": 200,
  "timestamp": "2022-10-05T14:48:00.000Z",
  "path": "https://..../....",
  "trackingId": "UUID.v4",
  "ok": true,
  "result": {
    "orderId": "string",
    "status": "pending"
  }
}
```

**Error Responses:**
**错误响应：**

- **400**: Bad request
  - **400**: 错误请求
  - **Content-Type:** application/json
  - **Schema:** [CommonResponse](#commonresponse)
- **409**: Conflict (not available / insufficient inventory)
  - **409**: 冲突（不可用/库存不足）
  - **Content-Type:** application/json
  - **Schema:** [CommonResponse](#commonresponse)

---

### /orders/async

#### POST

**Summary:** Create booking (async)  
**摘要:** 创建预订（异步）

Create a booking asynchronously and return a tracking ID. Booking confirmation must be queried separately.  
以异步方式创建预订并返回受理标识，需通过查询接口获取最终确认结果。

**Security:** BearerAuth (JWT)  
**安全认证:** JWT Bearer

**Endpoint:** `https://api.rentcar.com/v1/orders/async`

**Request Body**
**请求体**

- **Content-Type:** application/json
- **Schema:** [OrderCreateRequestBody](#ordercreaterequestbody)
- **Required:** true

**Request Example:**
**请求示例：**

```json
{
  "_id": "BG1231312",
  "id": "BG_QA_12",
  "pickupShopId": "KL_12",
  "returnShopId": "KL_12",
  "currency": "USD",
  "carmoreOrderId": "BG1231312",
  "countryCode": "US",
  "returnCountryCode": "US",
  "pickupDateTime": "2022-11-22T05:31:45",
  "returnDateTime": "2022-11-24T05:31:45",
  "driverPhone": "+8201012345678",
  "driverEmail": "dev@teamo2.kr",
  "flightNo": "KE111",
  "driverFirstName": "오투",
  "driverLastName": "팀",
  "driverGender": "M",
  "driverAge": 30,
  "adult": 1,
  "child": 1,
  "infant": 1,
  "pickupLatitude": 127.001,
  "pickupLongitude": 1.234,
  "returnLatitude": 127.001,
  "returnLongitude": 127.001,
  "addOns": [
    {
      "id": "addon_123",
      "count": 1
    }
  ]
}
```

**Responses**
**响应**

- **202**: Accepted
  - **202**: 已接受
  - **Content-Type:** application/json
  - **Schema:** [AsyncOrderCreateResponse](#asyncordercreateresponse)

**Response Example:**
**响应示例：**

```json
{
  "statusCode": 200,
  "timestamp": "2022-10-05T14:48:00.000Z",
  "path": "https://..../....",
  "trackingId": "UUID.v4",
  "ok": true,
  "result": {
    "orderId": "string",
    "status": "pending"
  }
}
```

**Error Responses:**
**错误响应：**

- **400**: Bad request
  - **400**: 错误请求
  - **Content-Type:** application/json
  - **Schema:** [CommonResponse](#commonresponse)

---

### /orders/{orderId}

#### GET

**Summary:** Get booking details  
**摘要:** 获取预订详情

Retrieve booking details by order ID (status, vehicle info, pricing, etc.).  
根据订单号获取预订详情（状态、车辆信息、价格等）。

**Security:** BearerAuth (JWT)  
**安全认证:** JWT Bearer

**Parameters**  
**参数**

| Name | In | Type | Required | Description |
| :--- | :--- | :--- | :--- | :--- |
| orderId | path | string | Yes | Booking order ID. <br> 预订订单号。 |

**Endpoint:** `https://api.rentcar.com/v1/orders/{orderId}`

**Responses**
**响应**

- **200**: Success
  - **200**: 成功
  - **Content-Type:** application/json
  - **Schema:** [OrderDetailResponse](#orderdetailresponse)

**Response Example:**
**响应示例：**

```json
{
  "statusCode": 200,
  "timestamp": "2022-10-05T14:48:00.000Z",
  "path": "https://..../....",
  "trackingId": "UUID.v4",
  "ok": true,
  "result": {
    "car": {
      "_id": "BG_QA_12",
      "sippCode": "CBAD",
      "model": "K3",
      "brand": "KIA",
      "description": "The Kia K3 is a modern subcompact sedan",
      "images": {
        "primary": "",
        "images": [
          "https://example.com/car1.jpg",
          "https://example.com/car2.jpg"
        ]
      },
      "seats": 4,
      "doors": 4,
      "baggageQuantity": 2,
      "hasAirCondition": true,
      "transmissionType": "A/T",
      "isModelGuaranteed": true,
      "carGroupTypeId": -1,
      "fuelPolicy": "FULL_TO_FULL",
      "insurance": {
        "coverage": [
          {
            "title": "Additional third-party liability insurance",
            "code": "ALI",
            "subInsurances": [
              {
                "title": "Additional third-party liability insurance",
                "depositMin": {
                  "currency": "USD",
                  "amount": 166.85
                },
                "depositMax": {
                  "currency": "USD",
                  "amount": 166.85
                },
                "excessMin": {
                  "currency": "USD",
                  "amount": 166.85
                },
                "excessMax": {
                  "currency": "USD",
                  "amount": 166.85
                },
                "hasExcess": true,
                "hasDeposit": true,
                "coverageScope": "LIABILITY"
              }
            ]
          }
        ],
        "originCoveragePackage": "BASIC",
        "coveragePackage": "BASIC"
      },
      "minimumAge": 21,
      "freeAge": 23,
      "maxAge": 80,
      "requiredDrivingExperience": 0,
      "creditCard": [
        {
          "availableCardVendor": [
            "China UnionPay",
            "VISA",
            "MasterCard",
            "Diners",
            "AMEX"
          ],
          "rentalRate": 100,
          "depositMin": {
            "currency": "USD",
            "amount": 166.85
          },
          "depositMax": {
            "currency": "USD",
            "amount": 166.85
          },
          "depositRemark": "Additional information about the deposit",
          "thawDaysMin": 30,
          "thawDaysMax": 60,
          "isNeedPinCode": false,
          "isForUpscaleCar": true,
          "creditCardProperty": 2
        }
      ],
      "isDistanceUnlimited": true,
      "distanceLimitType": "RENTAL",
      "distanceLimit": "150(Mile)"
    },
    "shop": {
      "_id": "BG_ABC_123",
      "_vendorId": "BG_001",
      "name": "Budget Hawthorne Ca",
      "contacts": [
        "310-970-1792"
      ],
      "operationTimes": [
        {
          "day": "MON",
          "open": "00:00",
          "close": "22:00",
          "closeNextDay": false
        }
      ],
      "seasonalOperationTimes": [
        {
          "day": "MON",
          "startDate": "2023-01-01",
          "endDate": "2023-01-31",
          "open": "00:00",
          "close": "22:00",
          "closeNextDay": false
        }
      ],
      "operationBreakTimes": [
        {
          "day": "MON",
          "start": "14:00",
          "end": "15:00"
        }
      ],
      "seasonalOperationBreakTimes": [
        {
          "day": "MON",
          "startDate": "2023-01-01",
          "endDate": "2023-01-31",
          "start": "14:00",
          "end": "15:00"
        }
      ],
      "licensePolicies": [
        {
          "foreigner": true,
          "requiredLicenses": [
            "International Driving Permit",
            "A physical driver's license from your place of residence"
          ],
          "description": "The International Driving Permit (IDP) is a translated version of your driver's license. Therefore, you must always bring your original driver's license."
        }
      ],
      "location": {
        "name": "LOS ANGELES INTL AIRPORT",
        "address": "",
        "streetAddress": "9000 AIRPORT BOULEVARD",
        "positionType": -1,
        "terminalCode": "T1",
        "wayOfArrival": "Use the free shuttle bus",
        "isAirportShop": false,
        "latitude": 127.001,
        "longitude": 1.234
      },
      "identificationPolicies": [
        {
          "foreigner": false,
          "requiredDocuments": [
            "valid identification card"
          ]
        }
      ],
      "shopGuide": "",
      "pickupGuide": [
        {
          "title": "pickup information",
          "content": "Exit baggage claim and follow the sign to 'Ground Transportation' and wait at the shuttle bus pickup area."
        }
      ],
      "returnGuide": [
        {
          "title": "return information",
          "content": "Return the vehicle to the designated parking area and drop off the keys at the counter."
        }
      ],
      "cancellationPolicy": {
        "freeCancellationHours": 0,
        "freeCancellationHoursAfterReservation": 0,
        "cancellationCharges": [
          {
            "beforeRentalWithinEnd": 0,
            "beforeRentalWithinStart": 48,
            "chargeMode": 2,
            "chargeFixedAmount": {
              "currency": "USD",
              "amount": 166.85
            },
            "chargePercentage": 0.5,
            "chargeDays": 1
          }
        ]
      }
    },
    "status": "CANCELED",
    "orderDateTime": "2022-11-22T00:00:00",
    "pickUpDateTime": "2022-11-22T05:31:45",
    "returnDateTime": "2022-11-24T05:31:45",
    "countryCode": "US",
    "orderId": "BLA1111",
    "driver": [
      {
        "firstName": "오투",
        "lastName": "팀",
        "phone": "+8201012345678",
        "email": "dev@teamo2.kr",
        "gender": "M"
      }
    ],
    "adult": 1,
    "child": 1,
    "infant": 1,
    "confirmationNumber": "",
    "isConfirmed": true,
    "confirmInHours": 0,
    "price": {
      "totalPrice": {
        "currency": "USD",
        "amount": 166.85
      },
      "payablePrice": {
        "currency": "USD",
        "amount": 166.85
      },
      "payOnArrivalPrice": {
        "currency": "USD",
        "amount": 166.85
      }
    },
    "reservationDescriptions": [
      {
        "title": "Payment includes",
        "description": "Includes vehicle rental fee and basic insurance."
      }
    ],
    "policies": [
      {
        "title": "Rental Policy",
        "description": "A valid driver's license and credit card are required to rent a vehicle."
      }
    ],
    "addOns": [
      {
        "id": "GPS_001",
        "name": "GPS Navigation System",
        "description": "Portable GPS navigation device with latest maps",
        "chargeType": "PER_DAY",
        "price": {
          "prepaidPrice": {
            "currency": "USD",
            "amount": 15.99
          },
          "payOnArrivalPrice": {
            "currency": "USD",
            "amount": 0
          }
        },
        "paymentMode": 2,
        "isRequired": false,
        "isNeedConfirm": false,
        "stockCount": 10,
        "maxAvailableCountPerReservation": 1
      }
    ]
  }
}
```

**Error Responses:**
**错误响应：**

- **404**: Not found
  - **404**: 未找到
  - **Content-Type:** application/json
  - **Schema:** [CommonResponse](#commonresponse)

---

### /orders/{orderId}

#### DELETE

**Summary:** Cancel booking  
**摘要:** 取消预订

Cancel an existing booking. Cancellation fees may apply.  
取消已存在的预订，可能产生取消费用。

**Security:** BearerAuth (JWT)  
**安全认证:** JWT Bearer

**Parameters**  
**参数**

| Name | In | Type | Required | Description |
| :--- | :--- | :--- | :--- | :--- |
| orderId | path | string | Yes | Booking order ID. <br> 预订订单号。 |

**Endpoint:** `https://api.rentcar.com/v1/orders/{orderId}`

**Responses**
**响应**

- **200**: Success
  - **200**: 成功
  - **Content-Type:** application/json
  - **Schema:** [OrderCancelResponse](#ordercancelresponse)

**Response Example:**
**响应示例：**

```json
{
  "statusCode": 200,
  "timestamp": "2022-10-05T14:48:00.000Z",
  "path": "https://..../....",
  "trackingId": "UUID.v4",
  "ok": true,
  "result": {
    "orderId": "string",
    "status": "cancelled",
    "cancelledAt": "2019-08-24T14:15:22Z"
  }
}
```

**Error Responses:**
**错误响应：**

- **404**: Not found
  - **404**: 未找到
  - **Content-Type:** application/json
  - **Schema:** [CommonResponse](#commonresponse)
- **409**: Conflict (cannot cancel)
  - **409**: 冲突（无法取消）
  - **Content-Type:** application/json
  - **Schema:** [CommonResponse](#commonresponse)

---

### /affiliates

#### GET

**Summary:** List affiliates  
**摘要:** 获取合作伙伴列表

Return a paginated list of registered affiliates.  
分页获取已注册合作伙伴列表。

**Security:** BearerAuth (JWT)  
**安全认证:** JWT Bearer

**Parameters**  
**参数**

| Name | In | Type | Required | Description |
| :--- | :--- | :--- | :--- | :--- |
| page | query | integer | No | Page number (starts from 1). Default: 1. <br> 页码（从 1 开始），默认 1。 |
| limit | query | integer | No | Page size. Default: 20. Min: 1, Max: 100. <br> 每页数量，默认 20，最小 1，最大 100。 |

**Endpoint:** `https://api.rentcar.com/v1/affiliates`

**Responses**
**响应**

- **200**: Success
  - **200**: 成功
  - **Content-Type:** application/json
  - **Schema:** [GetAffiliatesResponse](#getaffiliatesresponse)

**Response Example:**
**响应示例：**

```json
{
  "statusCode": 200,
  "timestamp": "2022-10-05T14:48:00.000Z",
  "path": "https://..../....",
  "trackingId": "UUID.v4",
  "ok": true,
  "result": [
    {
      "id": "BG_ABC_123",
      "vendorId": "BG_001",
      "name": "Budget Hawthorne Ca",
      "contacts": [
        "310-970-1792"
      ],
      "operationTimes": [
        {
          "day": "MON",
          "open": "00:00",
          "close": "22:00",
          "closeNextDay": false
        }
      ],
      "seasonalOperationTimes": [
        {
          "day": "MON",
          "startDate": "2023-01-01",
          "endDate": "2023-01-31",
          "open": "00:00",
          "close": "22:00",
          "closeNextDay": false
        }
      ],
      "operationBreakTimes": [
        {
          "day": "MON",
          "start": "14:00",
          "end": "15:00"
        }
      ],
      "seasonalOperationBreakTimes": [
        {
          "day": "MON",
          "startDate": "2023-01-01",
          "endDate": "2023-01-31",
          "start": "14:00",
          "end": "15:00"
        }
      ],
      "licensePolicies": [
        {
          "foreigner": true,
          "requiredLicenses": [
            "International Driving Permit",
            "A physical driver's license from your place of residence"
          ],
          "description": "An International Driving Permit (IDP) is a translated version of your driver's license. Therefore, you must always bring your original driver's license."
        }
      ],
      "location": {
        "name": "LOS ANGELES INTL AIRPORT",
        "address": "",
        "streetAddress": "9000 AIRPORT BOULEVARD",
        "positionType": -1,
        "terminalCode": "T1",
        "wayOfArrival": "Use the free shuttle bus",
        "isAirportShop": false,
        "latitude": 127.001,
        "longitude": 1.234
      },
      "identificationPolicies": [
        {
          "foreigner": false,
          "requiredDocuments": [
            "valid identification card"
          ]
        }
      ],
      "shopGuide": "",
      "pickupGuide": [
        {
          "title": "pickup information",
          "content": "Exit baggage claim and follow the sign to 'Ground Transportation' and wait at the shuttle bus pickup area."
        }
      ],
      "returnGuide": [
        {
          "title": "return information",
          "content": "Return the vehicle to the designated parking area and drop off the keys at the counter."
        }
      ],
      "cancellationPolicy": {
        "freeCancellationHours": 0,
        "freeCancellationHoursAfterReservation": 0,
        "cancellationCharges": [
          {
            "beforeRentalWithinEnd": 0,
            "beforeRentalWithinStart": 48,
            "chargeMode": 2,
            "chargeFixedAmount": {
              "currency": "USD",
              "amount": 166.85
            },
            "chargePercentage": 0.5,
            "chargeDays": 1
          }
        ]
      }
    }
  ]
}
```

---

### /affiliates/{affiliateId}

#### GET

**Summary:** Get affiliate details  
**摘要:** 获取合作伙伴详情

Retrieve affiliate details by affiliate ID.  
根据合作伙伴 ID 获取详情。

**Security:** BearerAuth (JWT)  
**安全认证:** JWT Bearer

**Parameters**  
**参数**

| Name | In | Type | Required | Description |
| :--- | :--- | :--- | :--- | :--- |
| affiliateId | path | string | Yes | Affiliate ID. <br> 合作伙伴 ID。 |

**Endpoint:** `https://api.rentcar.com/v1/affiliates/{affiliateId}`

**Responses**
**响应**

- **200**: Success
  - **200**: 成功
  - **Content-Type:** application/json
  - **Schema:** [GetAffiliateResponse](#getaffiliateresponse)

**Response Example:**
**响应示例：**

```json
{
  "statusCode": 200,
  "timestamp": "2022-10-05T14:48:00.000Z",
  "path": "https://..../....",
  "trackingId": "UUID.v4",
  "ok": true,
  "result": {
    "id": "BG_ABC_123",
    "vendorId": "BG_001",
    "name": "Budget Hawthorne Ca",
    "contacts": [
      "310-970-1792"
    ],
    "operationTimes": [
      {
        "day": "MON",
        "open": "00:00",
        "close": "22:00",
        "closeNextDay": false
      }
    ],
    "seasonalOperationTimes": [
      {
        "day": "MON",
        "startDate": "2023-01-01",
        "endDate": "2023-01-31",
        "open": "00:00",
        "close": "22:00",
        "closeNextDay": false
      }
    ],
    "operationBreakTimes": [
      {
        "day": "MON",
        "start": "14:00",
        "end": "15:00"
      }
    ],
    "seasonalOperationBreakTimes": [
      {
        "day": "MON",
        "startDate": "2023-01-01",
        "endDate": "2023-01-31",
        "start": "14:00",
        "end": "15:00"
      }
    ],
    "licensePolicies": [
      {
        "foreigner": true,
        "requiredLicenses": [
          "International Driving Permit",
          "A physical driver's license from your place of residence"
        ],
        "description": "An International Driving Permit (IDP) is a translated version of your driver's license. Therefore, you must always bring your original driver's license."
      }
    ],
    "location": {
      "name": "LOS ANGELES INTL AIRPORT",
      "address": "",
      "streetAddress": "9000 AIRPORT BOULEVARD",
      "positionType": -1,
      "terminalCode": "T1",
      "wayOfArrival": "Use the free shuttle bus",
      "isAirportShop": false,
      "latitude": 127.001,
      "longitude": 1.234
    },
    "identificationPolicies": [
      {
        "foreigner": false,
        "requiredDocuments": [
          "valid identification card"
        ]
      }
    ],
    "shopGuide": "",
    "pickupGuide": [
      {
        "title": "pickup information",
        "content": "Exit baggage claim and follow the sign to 'Ground Transportation' and wait at the shuttle bus pickup area."
      }
    ],
    "returnGuide": [
      {
        "title": "return information",
        "content": "Return the vehicle to the designated parking area and drop off the keys at the counter."
      }
    ],
    "cancellationPolicy": {
      "freeCancellationHours": 0,
      "freeCancellationHoursAfterReservation": 0,
      "cancellationCharges": [
        {
          "beforeRentalWithinEnd": 0,
          "beforeRentalWithinStart": 48,
          "chargeMode": 2,
          "chargeFixedAmount": {
            "currency": "USD",
            "amount": 166.85
          },
          "chargePercentage": 0.5,
          "chargeDays": 1
        }
      ]
    }
  }
}
```

**Error Responses:**
**错误响应：**

- **404**: Not found
  - **404**: 未找到
  - **Content-Type:** application/json
  - **Schema:** [CommonResponse](#commonresponse)

---

### /cars

#### GET

**Summary:** List car models  
**摘要:** 获取车型列表

Filter and return registered car model data.  
过滤并返回已注册车型数据。

**Security:** BearerAuth (JWT)  
**安全认证:** JWT Bearer

**Parameters**  
**参数**

| Name | In | Type | Required | Description |
| :--- | :--- | :--- | :--- | :--- |
| brand | query | string | No | Filter by brand (e.g., KIA, HYUNDAI). <br> 按品牌过滤（如 KIA、HYUNDAI）。 |
| carGroupTypeId | query | integer | No | Filter by car group type. Refer to official docs for enum values. <br> 按车型分组过滤，枚举值请参考官方文档。 |
| seats | query | integer | No | Filter by seat count. <br> 按座位数过滤。 |

**Endpoint:** `https://api.rentcar.com/v1/cars`

**Responses**
**响应**

- **200**: Success
  - **200**: 成功
  - **Content-Type:** application/json
  - **Schema:** [GetCarsResponse](#getcarsresponse)

**Response Example:**
**响应示例：**

```json
{
  "statusCode": 200,
  "timestamp": "2022-10-05T14:48:00.000Z",
  "path": "https://..../....",
  "trackingId": "UUID.v4",
  "ok": true,
  "result": [
    {
      "id": "BG_QA_12",
      "sippCode": "CBAD",
      "model": "K3",
      "brand": "KIA",
      "description": "The Kia K3 is a modern subcompact sedan",
      "images": {
        "primary": "",
        "images": [
          "https://example.com/car1.jpg",
          "https://example.com/car2.jpg"
        ]
      },
      "seats": 4,
      "doors": 4,
      "baggageQuantity": 2,
      "hasAirCondition": true,
      "transmissionType": "A/T",
      "isModelGuaranteed": true
    }
  ]
}
```

---

### /cars/{carId}

#### GET

**Summary:** Get car model details  
**摘要:** 获取车型详情

Retrieve car model details by car ID.  
根据车型 ID 获取详情。

**Security:** BearerAuth (JWT)  
**安全认证:** JWT Bearer

**Parameters**  
**参数**

| Name | In | Type | Required | Description |
| :--- | :--- | :--- | :--- | :--- |
| carId | path | string | Yes | Car model ID. <br> 车型 ID。 |

**Endpoint:** `https://api.rentcar.com/v1/cars/{carId}`

**Responses**
**响应**

- **200**: Success
  - **200**: 成功
  - **Content-Type:** application/json
  - **Schema:** [GetCarResponse](#getcarresponse)

**Response Example:**
**响应示例：**

```json
{
  "statusCode": 200,
  "timestamp": "2022-10-05T14:48:00.000Z",
  "path": "https://..../....",
  "trackingId": "UUID.v4",
  "ok": true,
  "result": {
    "id": "BG_QA_12",
    "sippCode": "CBAD",
    "model": "K3",
    "brand": "KIA",
    "description": "The Kia K3 is a modern subcompact sedan",
    "images": {
      "primary": "",
      "images": [
        "https://example.com/car1.jpg",
        "https://example.com/car2.jpg"
      ]
    },
    "seats": 4,
    "doors": 4,
    "baggageQuantity": 2,
    "hasAirCondition": true,
    "transmissionType": "A/T",
    "isModelGuaranteed": true
  }
}
```

**Error Responses:**
**错误响应：**

- **404**: Not found
  - **404**: 未找到
  - **Content-Type:** application/json
  - **Schema:** [CommonResponse](#commonresponse)

---

## Schemas
## 模式

### <a id="authrequest"></a>AuthRequest

**Description:** Access token reissuance request body  
**描述:** 访问令牌重签发请求体

| Name | Type | Description |
| :--- | :--- | :--- |
| **access_token** | string | Existing access token. **Required** <br> 现有访问令牌。**必填** |
| **refresh_token** | string | Refresh token used for reissuance. **Required** <br> 用于重签发的刷新令牌。**必填** |

### <a id="authrequestforreissuancerefresh"></a>AuthRequestForReissuanceRefresh

**Description:** Refresh token reissuance request body  
**描述:** 刷新令牌重签发请求体

| Name | Type | Description |
| :--- | :--- | :--- |
| **client_id** | string | Client identifier. **Required** <br> 客户端标识。**必填** |
| **refresh_token** | string | Refresh token used for reissuance. **Required** <br> 用于重签发的刷新令牌。**必填** |

### <a id="authresponse"></a>AuthResponse

**Description:** Authentication response  
**描述:** 认证响应

| Name | Type | Description |
| :--- | :--- | :--- |
| **code** | string | Result code. **Required** <br> 结果码。**必填** |
| **accessToken** | string | New access token. **Required** <br> 新访问令牌。**必填** |
| **refreshToken** | string | New refresh token. **Required** <br> 新刷新令牌。**必填** |

### <a id="autherror"></a>AuthError

**Description:** Authentication error response  
**描述:** 认证错误响应

| Name | Type | Description |
| :--- | :--- | :--- |
| **code** | string | Error code. **Required** <br> 错误码。**必填** |
| **errorMessage** | string | Error message. **Required** <br> 错误信息。**必填** |

### <a id="vehiclelistresponse"></a>VehicleListResponse

**Description:** Vehicle list response  
**描述:** 车辆列表响应

| Name | Type | Description |
| :--- | :--- | :--- |
| **vehicles** | array | List of available vehicles. <br> 可预订车辆列表。 |
| vehicles.id | string | Vehicle ID. <br> 车辆 ID。 |
| vehicles.brand | string | Brand. <br> 品牌。 |
| vehicles.model | string | Model. <br> 车型。 |
| vehicles.price | number | Price. <br> 价格。 |
| vehicles.currency | string | Currency code. <br> 货币代码。 |

### <a id="vehicledetailresponse"></a>VehicleDetailResponse

**Description:** Vehicle detail response  
**描述:** 车辆详情响应

| Name | Type | Description |
| :--- | :--- | :--- |
| **id** | string | Vehicle ID. <br> 车辆 ID。 |
| **brand** | string | Brand. <br> 品牌。 |
| **model** | string | Model. <br> 车型。 |
| description | string | Vehicle description. <br> 车辆描述。 |
| price | number | Price. <br> 价格。 |
| currency | string | Currency code. <br> 货币代码。 |
| insurance | object | Insurance details (free-form). <br> 保险信息（自由结构）。 |
| conditions | object | Rental conditions (free-form). <br> 租赁条件（自由结构）。 |

### <a id="ordercreaterequestbody"></a>OrderCreateRequestBody

**Description:** Booking creation request body  
**描述:** 预订创建请求体

| Name | Type | Description |
| :--- | :--- | :--- |
| **vehicleId** | string | Vehicle identifier. **Required** <br> 车辆标识。**必填** |
| **pickupDateTime** | string (date-time) | Pickup datetime. **Required** <br> 取车时间。**必填** |
| **returnDateTime** | string (date-time) | Return datetime. **Required** <br> 还车时间。**必填** |
| **pickupShopId** | string | Pickup shop ID. **Required** <br> 取车门店 ID。**必填** |
| **returnShopId** | string | Return shop ID. **Required** <br> 还车门店 ID。**必填** |
| **driver** | object | Driver information. **Required** <br> 驾驶人信息。**必填** |
| driver.firstName | string | Driver first name. <br> 驾驶人名。 |
| driver.lastName | string | Driver last name. <br> 驾驶人姓。 |
| driver.phone | string | Driver phone number. <br> 驾驶人电话。 |
| driver.email | string | Driver email. <br> 驾驶人邮箱。 |
| payment | object | Payment information (example). <br> 支付信息（示例）。 |
| payment.cardToken | string | Card token. <br> 卡片令牌。 |

### <a id="ordercreateresponse"></a>OrderCreateResponse

**Description:** Booking creation response  
**描述:** 预订创建响应

| Name | Type | Description |
| :--- | :--- | :--- |
| **orderId** | string | Booking order ID. <br> 预订订单号。 |
| code | string | Result code. <br> 结果码。 |
| message | string | Result message. <br> 结果信息。 |

### <a id="asyncordercreateresponse"></a>AsyncOrderCreateResponse

**Description:** Async booking creation response  
**描述:** 异步预订创建响应

| Name | Type | Description |
| :--- | :--- | :--- |
| **trackingId** | string | Tracking ID for async processing. <br> 异步处理追踪 ID。 |
| message | string | Message. <br> 返回信息。 |

### <a id="orderdetailresponse"></a>OrderDetailResponse

**Description:** Booking detail response  
**描述:** 预订详情响应

| Name | Type | Description |
| :--- | :--- | :--- |
| **orderId** | string | Booking order ID. <br> 预订订单号。 |
| status | string | Booking status. <br> 预订状态。 |
| vehicle | object | Vehicle details (free-form). <br> 车辆详情（自由结构）。 |
| price | number | Price. <br> 价格。 |
| currency | string | Currency code. <br> 货币代码。 |
| driver | object | Driver info (free-form). <br> 驾驶人信息（自由结构）。 |

### <a id="ordercancelresponse"></a>OrderCancelResponse

**Description:** Booking cancellation response  
**描述:** 预订取消响应

| Name | Type | Description |
| :--- | :--- | :--- |
| success | boolean | Whether cancellation succeeded. <br> 是否取消成功。 |
| message | string | Message. <br> 返回信息。 |

### <a id="getaffiliatesresponse"></a>GetAffiliatesResponse

**Description:** Affiliates list response  
**描述:** 合作伙伴列表响应

| Name | Type | Description |
| :--- | :--- | :--- |
| **affiliates** | array | List of affiliates. <br> 合作伙伴列表。 |
| affiliates.id | string | Affiliate ID. <br> 合作伙伴 ID。 |
| affiliates.name | string | Affiliate name. <br> 合作伙伴名称。 |
| affiliates.vendorId | string | Vendor ID. <br> 供应商 ID。 |

### <a id="getaffiliateresponse"></a>GetAffiliateResponse

**Description:** Affiliate detail response  
**描述:** 合作伙伴详情响应

| Name | Type | Description |
| :--- | :--- | :--- |
| id | string | Affiliate ID. <br> 合作伙伴 ID。 |
| name | string | Affiliate name. <br> 合作伙伴名称。 |
| vendorId | string | Vendor ID. <br> 供应商 ID。 |
| contact | string | Contact information. <br> 联系方式。 |
| operationTimes | array | Operation times. <br> 营业时间。 |
| operationTimes.day | string | Day of week. <br> 星期。 |
| operationTimes.open | string | Opening time. <br> 开始时间。 |
| operationTimes.close | string | Closing time. <br> 结束时间。 |

### <a id="getcarsresponse"></a>GetCarsResponse

**Description:** Car models list response  
**描述:** 车型列表响应

| Name | Type | Description |
| :--- | :--- | :--- |
| **cars** | array | List of car models. <br> 车型列表。 |
| cars.id | string | Car model ID. <br> 车型 ID。 |
| cars.brand | string | Brand. <br> 品牌。 |
| cars.model | string | Model. <br> 车型。 |
| cars.seats | integer | Seats count. <br> 座位数。 |
| cars.carGroupTypeId | integer | Car group type ID. <br> 车型分组 ID。 |

### <a id="getcarresponse"></a>GetCarResponse

**Description:** Car model detail response  
**描述:** 车型详情响应

| Name | Type | Description |
| :--- | :--- | :--- |
| id | string | Car model ID. <br> 车型 ID。 |
| brand | string | Brand. <br> 品牌。 |
| model | string | Model. <br> 车型。 |
| seats | integer | Seats count. <br> 座位数。 |
| carGroupTypeId | integer | Car group type ID. <br> 车型分组 ID。 |

### <a id="commonresponse"></a>CommonResponse

**Description:** Common error response payload  
**描述:** 通用错误响应体

This schema is referenced by multiple endpoints but is not defined in the current YAML. Please refer to the official Carmore documentation for its exact structure.  
该模式在多个接口中被引用，但当前 YAML 未定义其结构，请以官方文档为准。
