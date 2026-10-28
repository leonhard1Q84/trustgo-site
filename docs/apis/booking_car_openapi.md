# Booking.com Demand API Car rentals subset
# Booking.com Demand API 租车业务子集

**Version:** 3.1
**版本:** 3.1

Subset of Booking.com Demand API for car rental endpoints
Booking.com Demand API 租车端点子集

## Servers
## 服务器

- **https://demandapi.booking.com/3.1**: Production environment
  - 生产环境
- **https://demandapi-sandbox.booking.com/3.1**: Sandbox environment
  - 沙箱环境

## General Information
## 基本信息

### Authentication
### 认证

All API requests require the following authentication header:
所有 API 请求都需要以下认证标头：

- **X-Affiliate-Id**: Include your Affiliate identifier number in this header.
  - **X-Affiliate-Id**: 在此标头中包含您的联盟标识符编号。
  - Type: integer
    - 类型: 整数
  - Required: true
    - 必填: 是

Some endpoints may also support or require Bearer Authentication.
某些端点可能也支持或需要 Bearer 认证。

---

## Paths
## 路径

### /cars/search

#### POST

**Summary:** Search car rentals
**摘要:** 搜索租车

Use this endpoint to retrieve the available car rentals matching the search criteria.
使用此端点检索符合搜索条件的可用租车。

**Request Body**
**请求体**

- **Content-Type:** application/json
- **Schema:** [SearchRequest](#searchrequest)

**Request Example:**
**请求示例:**

```json
{
  "booker": {
    "country": "nl"
  },
  "currency": "EUR",
  "driver": {
    "age": 36
  },
  "route": {
    "dropoff": {
      "datetime": "2025-11-12T10:00:00",
      "location": {
        "city": -2140479
      }
    },
    "pickup": {
      "datetime": "2025-11-01T10:00:00",
      "location": {
        "city": -2140479
      }
    }
  },
  "filters": {
    "depot_location_type": "car_rental_centre",
    "number_of_seats": 7,
    "air_conditioning": true
  }
}
```

**Responses**
**响应**

- **200**: Successful response.
  - **200**: 成功响应。
  - **Content-Type:** application/json
  - **Schema:** [SearchResponse](#searchresponse)

**Response Example:**
**响应示例:**

```json
{
  "request_id": "01h00fr9y7qkbxtc6kyv97j49z",
  "data": [
    {
      "car": 122655,
      "policies": {
        "cancellation": {
          "type": "free_cancellation",
          "details": {
            "context": "before_pickup",
            "duration": "P7D"
          }
        },
        "damage_excess": 3000,
        "deposit": 1500,
        "insurance_package": "basic",
        "fuel": "return_same",
        "mileage": {
          "distance": 200,
          "distance_unit": "kilometers",
          "fee": 12.54,
          "type": "limited"
        },
        "payment": {
          "timing": "pay_now"
        },
        "theft_excess": 3000
      },
      "price": {
        "total": 121.90,
        "currency": "EUR",
        "extra_charges": [
          {
            "charge": "age_fee",
            "total_amount": 21.9
          },
          {
            "charge": "one_way_fee",
            "total_amount": 50
          }
        ]
      },
      "route": {
        "dropoff": {
          "depot": 112314
        },
        "pickup": {
          "depot": 112314
        }
      },
      "supplier": 7455,
      "url": {
        "app": "booking://page",
        "web": "https://example.com"
      }
    }
  ],
  "metadata": {
    "next_page": "eyJhbGciOiJIUzI1NiJ9.eyJwIjp7Im1heGltdW1fcmVzdWx0cyI6MTAsIm9mZnNldCI6MTB9LCJhdWQiOiJDQVJTX1NVUFBMSUVSUyIsImV4cCI6MTY4MzY0NzMwNX0.y7NmH48mm7lImd2WxsHdotj6n-dVQAzJCGCnIJCKy3A",
    "total_results": 122
  },
  "search_token": "eyJhbGciOiJIUzI1NiJ9.eyJwIjp7ImJvb2tlciI6eyJjb3VudHJ5IjoidXMifX0sImF1ZCI6Ii9ob3RlbHMvc2VhcmNoIiwiZXhwIjoxNzUwMDAwMDAwfQ.XYZ123AbcDefGHIjklMNOpqrsTUVwxYZ456789"
}
```

---

### /cars/depots

#### POST

**Summary:** Depots
**摘要:** 门店

Use this endpoint to retrieve the list of all available car rental depots.
使用此端点检索所有可用租车门店的列表。

**Request Body**
**请求体**

- **Content-Type:** application/json
- **Schema:** [DepotsRequest](#depotsrequest)

**Request Example:**
**请求示例:**

```json
{
  "last_modified": "2025-11-01T11:05:00+00:00",
  "maximum_results": 100,
  "languages": [
    "en-gb",
    "nl"
  ]
}
```

**Responses**
**响应**

- **200**: Successful response.
  - **200**: 成功响应。
  - **Content-Type:** application/json
  - **Schema:** [DepotsResponse](#depotsresponse)

**Response Example:**
**响应示例:**

```json
{
  "request_id": "01fr9ez700exycb98w90w5r9sh",
  "data": [
    {
      "id": 5944,
      "contact": {
        "email": "depot@test.booking.com",
        "telephone": "+31882847620"
      },
      "city": -1471393,
      "drop_off": {
        "instructions": {
          "en-gb": "The procedure for returning the vehicle will be explained to you at the rental counter.",
          "de": "De procedure voor het inleveren van de auto zal worden toegelicht aan de balie."
        },
        "working_hours": {
          "monday": [
            { "closing_time": "21:00:00", "opening_time": "07:00:00" }
          ],
          "tuesday": [
            { "closing_time": "12:00:00", "opening_time": "07:00:00" },
            { "closing_time": "21:00:00", "opening_time": "14:00:00" }
          ],
          "wednesday": [
            { "closing_time": "21:00:00", "opening_time": "07:00:00" }
          ],
          "thursday": [
            { "closing_time": "21:00:00", "opening_time": "07:00:00" }
          ],
          "friday": [
            { "closing_time": "21:00:00", "opening_time": "07:00:00" }
          ],
          "saturday": [
            { "closing_time": "21:00:00", "opening_time": "07:00:00" }
          ],
          "sunday": [
            { "closing_time": "21:00:00", "opening_time": "07:00:00" }
          ]
        }
      },
      "location": {
        "address": "5 Aankomstpassage",
        "airport": "AMS",
        "city": -2140479,
        "coordinates": {
          "latitude": 52.309456,
          "longitude": 4.762266
        },
        "country": "nl",
        "depot_location_type": "airport_hotel",
        "name": {
          "en-gb": "Amsterdam Airport Schiphol - Terminal 3",
          "de": "Amsterdam Luchthaven Schiphol - Terminal 3"
        },
        "post_code": "1118 AX"
      },
      "pick_up": {
        "instructions": {
          "en-gb": "-",
          "de": "-"
        },
        "working_hours": {
          "monday": [
            { "closing_time": "21:00:00", "opening_time": "07:00:00" }
          ],
          "tuesday": [
            { "closing_time": "12:00:00", "opening_time": "07:00:00" },
            { "closing_time": "21:00:00", "opening_time": "14:00:00" }
          ],
          "wednesday": [
            { "closing_time": "21:00:00", "opening_time": "07:00:00" }
          ],
          "thursday": [
            { "closing_time": "21:00:00", "opening_time": "07:00:00" }
          ],
          "friday": [
            { "closing_time": "21:00:00", "opening_time": "07:00:00" }
          ],
          "saturday": [
            { "closing_time": "21:00:00", "opening_time": "07:00:00" }
          ],
          "sunday": [
            { "closing_time": "21:00:00", "opening_time": "07:00:00" }
          ]
        }
      },
      "services": [
        "shuttle"
      ],
      "supplier": 47
    }
  ],
  "metadata": {
    "next_page": null
  }
}
```

---

### /cars/depots/reviews/scores

#### POST

**Summary:** Depot scores
**摘要:** 门店评分

Use this endpoint to return the score breakdown for the specified depots together with the overall number of reviews and score.
使用此端点返回指定门店的评分明细，以及总评论数和评分。

**Request Body**
**请求体**

- **Content-Type:** application/json
- **Schema:** [DepotScoresRequest](#depotscoresrequest)

**Request Example:**
**请求示例:**

```json
{
  "maximum_results": 10
}
```

**Responses**
**响应**

- **200**: Successful response.
  - **200**: 成功响应。
  - **Content-Type:** application/json
  - **Schema:** [DepotScoresResponse](#depotscoresresponse)

**Response Example:**
**响应示例:**

```json
{
  "request_id": "01fr9ez700exycb98w90w5r9sh",
  "data": [
    {
      "id": 5944,
      "breakdown": {
        "cleanliness": {
          "score": 8.7
        },
        "condition": {
          "score": 8.7
        },
        "drop_off_speed": {
          "score": 8.7
        },
        "friendliness": {
          "score": null
        },
        "likeliness_rent_again": {
          "score": 8.7
        },
        "location": {
          "score": 8.7
        },
        "pick_up_speed": {
          "score": 8.7
        },
        "value_for_money": {
          "score": 8.7
        }
      },
      "number_of_reviews": 105,
      "score": 9.1
    }
  ],
  "metadata": {
    "next_page": null
  }
}
```

---

### /cars/details

#### POST

**Summary:** Car details
**摘要:** 车辆详情

Use this endpoint to fetch car details like bag capacity, number of doors, brand and model, etc.
使用此端点获取车辆详情，如行李容量、车门数量、品牌和型号等。

**Request Body**
**请求体**

- **Content-Type:** application/json
- **Schema:** [CarDetailsRequest](#cardetailsrequest)

**Request Example:**
**请求示例:**

```json
{
  "last_modified": "2025-12-01T11:05:00+00:00",
  "maximum_results": 100
}
```

**Responses**
**响应**

- **200**: Successful response.
  - **200**: 成功响应。
  - **Content-Type:** application/json
  - **Schema:** [CarDetailsResponse](#cardetailsresponse)

**Response Example:**
**响应示例:**

```json
{
  "request_id": "01fr9ez700exycb98w90w5r9sh",
  "data": [
    {
      "id": 37715,
      "capacity": {
        "bags": {
          "large": 1,
          "small": 1
        },
        "doors": "4/2",
        "seats": "4+2"
      },
      "features": [
        "air_conditioning",
        "all_wheel_drive"
      ],
      "make": "hyundai",
      "model": "elantra",
      "specification": {
        "code": "ECAR",
        "description": "economy",
        "fuel": "petrol",
        "transmission": "automatic"
      },
      "supplier": 423
    }
  ],
  "metadata": {
    "next_page": null
  }
}
```

---

### /cars/suppliers

#### POST

**Summary:** Suppliers
**摘要:** 供应商

Use this endpoint to fetch a list of car rental suppliers.
使用此端点获取租车供应商列表。

**Request Body**
**请求体**

- **Content-Type:** application/json
- **Schema:** [SuppliersRequest](#suppliersrequest)

**Request Example:**
**请求示例:**

```json
{
  "suppliers": [
    62
  ]
}
```

**Responses**
**响应**

- **200**: Successful response.
  - **200**: 成功响应。
  - **Content-Type:** application/json
  - **Schema:** [SuppliersResponse](#suppliersresponse)

**Response Example:**
**响应示例:**

```json
{
  "request_id": "01fr9ez700exycb98w90w5r9sh",
  "data": [
    {
      "id": 62,
      "name": "Budget",
      "logo": "https://example.com/path_to_the_logo.jpeg"
    }
  ],
  "metadata": {
    "next_page": null,
    "total_results": 1
  }
}
```

---

### /cars/constants

#### POST

**Summary:** Car constants
**摘要:** 车辆常量

This endpoint returns a list of relevant car constants names in the specified languages.
此端点返回指定语言的相关车辆常量名称列表。

**Request Body**
**请求体**

- **Content-Type:** application/json
- **Schema:** [ConstantsRequest](#constantsrequest)

**Request Example:**
**请求示例:**

```json
{
  "languages": [
    "de",
    "en-gb"
  ]
}
```

**Responses**
**响应**

- **200**: Successful response.
  - **200**: 成功响应。
  - **Content-Type:** application/json
  - **Schema:** [ConstantsResponse](#constantsresponse)

**Response Example:**
**响应示例:**

```json
{
  "request_id": "01jpvx9va93ghgwxq7zypagvdr",
  "data": {
    "depot_services": [
      {
        "id": "meet_greet",
        "name": {
          "de": "Meet & Greet",
          "en-gb": "Meet & Greet"
        }
      },
      {
        "id": "shuttle",
        "name": {
          "de": "Shuttlebus",
          "en-gb": "Shuttle Bus"
        }
      }
    ],
    "fuel_policies": [
      {
        "id": "free_tank",
        "name": {
          "de": "Kostenlose Tankfüllung",
          "en-gb": "Free Tank"
        }
      },
      {
        "id": "prepay_no_refunds",
        "name": {
          "de": "Vorab-Einkauf",
          "en-gb": "Pre-Purchase"
        }
      },
      {
        "id": "prepay_part_refunds",
        "name": {
          "de": "Vorab-Einkauf (Teilerstattung)",
          "en-gb": "Pre-purchase (partial refund)"
        }
      },
      {
        "id": "prepay_refunds",
        "name": {
          "de": "Vorab-Einkauf",
          "en-gb": "Pre-Purchase"
        }
      },
      {
        "id": "return_same",
        "name": {
          "de": "Gleiche Tankfüllung",
          "en-gb": "Like for like"
        }
      }
    ],
    "fuel_types": [
      {
        "id": "electric",
        "name": {
          "de": "Rein elektrisch",
          "en-gb": "Fully electric"
        }
      },
      {
        "id": "hybrid",
        "name": {
          "de": "Hybrid",
          "en-gb": "Hybrid"
        }
      },
      {
        "id": "petrol",
        "name": {
          "de": "Benzin",
          "en-gb": "Petrol"
        }
      },
      {
        "id": "plug_in_hybrid",
        "name": {
          "de": "Plug-in-Hybrid",
          "en-gb": "Plug-in hybrid"
        }
      }
    ],
    "general": [
      {
        "id": "air_conditioning",
        "name": {
          "de": "Flughafen (im Terminal)",
          "en-gb": "Airport (in terminal)"
        }
      },
      {
        "id": "airport",
        "name": {
          "de": "Klimaanlage",
          "en-gb": "Air Conditioning"
        }
      },
      {
        "id": "free_cancellation",
        "name": {
          "de": "Kostenlose Stornierung",
          "en-gb": "Free cancellation"
        }
      },
      {
        "id": "kilometers",
        "name": {
          "de": "km",
          "en-gb": "km"
        }
      },
      {
        "id": "limited",
        "name": {
          "de": "Begrenzt",
          "en-gb": "Limited"
        }
      },
      {
        "id": "miles",
        "name": {
          "de": "Meilen",
          "en-gb": "miles"
        }
      },
      {
        "id": "n_large_bags",
        "name": {
          "de": "N große Koffer",
          "en-gb": "N Large bags"
        }
      },
      {
        "id": "n_small_bags",
        "name": {
          "de": "N kleine Koffer",
          "en-gb": "N Small bags"
        }
      }
    ],
    "payment_timings": [
      {
        "id": "part_pay",
        "name": {
          "de": "Teils jetzt zahlen, teils später",
          "en-gb": "Pay part now, part later"
        }
      },
      {
        "id": "pay_now",
        "name": {
          "de": "Jetzt zahlbar",
          "en-gb": "Pay now"
        }
      }
    ],
    "transmission": [
      {
        "id": "automatic",
        "name": {
          "de": "Automatik",
          "en-gb": "Automatic"
        }
      },
      {
        "id": "manual",
        "name": {
          "de": "Schaltgetriebe",
          "en-gb": "Manual"
        }
      }
    ]
  }
}
```

---

## Schemas
## 模式

### <a id="searchrequest"></a>SearchRequest

**Description:** Search car rentals request body
**描述:** 搜索租车请求体

| Name | Type | Description |
| :--- | :--- | :--- |
| **booker** | object | Defines the booker context. <br> **Required** <br> 定义预订人上下文。<br>**必填** |
| booker.country | string | The booker country for showing the best price. pattern: `^[a-z]{2}$` <br> 用于显示最佳价格的预订人国家代码。模式: `^[a-z]{2}$` |
| **currency** | string | A three-letter code that uniquely identifies a monetary currency. pattern: `^[A-Z]{3}$`. See [ISO 4217](https://www.iso.org/iso-4217-currency-codes.html). <br> **Required** <br> 唯一标识货币的三字母代码。模式: `^[A-Z]{3}$` <br>**必填** |
| **driver** | object | Defines the driver context. <br> **Required** <br> 定义驾驶员上下文。<br>**必填** |
| driver.age | integer | Driver age. Min: 18, Max: 99. <br> 驾驶员年龄。最小: 18, 最大: 99。 |
| **filters** | object | Defines the filtering criteria for refining the request results. <br> 定义用于筛选请求结果的过滤条件。 |
| filters.air_conditioning | boolean | Filters the results to include car rentals with or without air conditioning. <br> 筛选包含或不包含空调的租车结果。 |
| filters.car_categories | array | Filters the result based on the selected car category.<br>Items:<br>- `carrier`: Vans/minivans for larger groups/luggage.<br>- `estate`: Station wagons offering extra luggage space.<br>- `large`: Large vehicles offering ample space.<br>- `medium`: Mid-sized vehicles.<br>- `premium`: High-end/luxury vehicles.<br>- `small`: Compact cars for city driving.<br>- `suvs`: Sport Utility Vehicles.<br><br>根据选定的车辆类别筛选结果。项目: `carrier` (载客车), `estate` (旅行车), `large` (大型车), `medium` (中型车), `premium` (豪华车), `small` (小型车), `suvs` (SUV) |
| filters.depot_location_type | array | Indicates the specific type of location.<br>Items:<br>- `in_terminal`: Inside airport terminal.<br>- `car_rental_centre`: Dedicated centre near airport.<br>- `outside_terminal`: Outside terminal area.<br>- `airport_hotel`: At/inside airport hotel.<br>- `shuttle_bus`: Requires shuttle transfer.<br>- `meet_greet`: Agent meets traveller.<br>- `trainstation`: Near train station.<br>- `downtown`: Central city area.<br><br>指示特定的位置类型。项目: `in_terminal` (航站楼内), `car_rental_centre` (租车中心), `outside_terminal` (航站楼外), `airport_hotel` (机场酒店), `shuttle_bus` (班车), `meet_greet` (举牌接机), `trainstation` (火车站), `downtown` (市区) |
| filters.mileage_type | string | Filters the results based on the mileage type. Enum: `limited`, `unlimited` <br> 根据里程类型筛选结果。枚举: `limited` (有限), `unlimited` (无限) |
| filters.number_of_seats | integer | Filters the results based on the number of seats in the vehicle. <br> 根据车座数量筛选结果。 |
| filters.supplier_ids | array | Filters the results based on the supplier ID. <br> 根据供应商 ID 筛选结果。 |
| filters.transmission_type | string | Filters the results based on the transmission type. Enum: `automatic`, `manual` <br> 根据变速箱类型筛选结果。枚举: `automatic` (自动), `manual` (手动) |
| **maximum_results** | integer | The maximum number of results to return per page. Default: 100. Min: 10, Max: 500. <br> 每页返回的最大结果数。默认: 100。最小: 10, 最大: 500。|
| **language** | string | Effects on the selected language of the target website after redirection. pattern: `^[a-z]{2}(-[a-z]{2})?$` <br> 重定向后目标网站的选定语言。模式: `^[a-z]{2}(-[a-z]{2})?$` |
| **page** | string | Pagination token used to retrieve the next page of results. <br> 用于检索下一页结果的分页令牌。 |
| **payment** | object | Payment-related input filters. <br> 支付相关的输入过滤器。 |
| payment.timings | array | Filters the results based on the payment timing options. Items: `pay_now`, `part_pay`, `pay_local` <br> 根据支付时间选项筛选结果。项目: `pay_now` (立即支付), `part_pay` (部分支付), `pay_local` (到店支付) |
| **route** | object | Defines the route context. <br> **Required** <br> 定义路线上下文。<br>**必填** |
| route.dropoff | object | Drop off location and time. <br> **Required** <br> 还车地点和时间。<br>**必填** |
| route.dropoff.datetime | string | Drop off datetime. pattern: `^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$` <br> **Required** <br> 还车日期时间。模式: `^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$` <br>**必填** |
| route.dropoff.location | object | Drop off location. OneOf: <br>- **Airport**: IATA code (pattern: `^[A-Z]{3}$`). <br>- **Coordinates**: Lat/Long. <br>- **City**: City ID.<br> **Required** <br> 还车地点。(OneOf: 机场, 坐标, 城市) <br>**必填** |
| route.pickup | object | Pick up location and time. <br> **Required** <br> 取车地点和时间。<br>**必填** |
| route.pickup.datetime | string | Pick up datetime. pattern: `^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$` <br> **Required** <br> 取车日期时间。模式: `^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$` <br>**必填** |
| route.pickup.location | object | Pick up location. OneOf: <br>- **Airport**: IATA code (pattern: `^[A-Z]{3}$`). <br>- **Coordinates**: Lat/Long. <br>- **City**: City ID.<br> **Required** <br> 取车地点。(OneOf: 机场, 坐标, 城市) <br>**必填** |
| **sort** | object | The sorting parameters for the response. <br> 响应的排序参数。 |
| sort.by | string | The way to sort your results. Enum: `distance`, `price`, `review_score` <br> 排序方式。枚举: `distance` (距离), `price` (价格), `review_score` (评分) |
| sort.direction | string | The direction you wish for your sort.by parameter to be sorted in. Enum: `ascending`, `descending` <br> 排序方向。枚举: `ascending` (升序), `descending` (降序) |

### <a id="searchresponse"></a>SearchResponse

**Description:** Search car rentals response
**描述:** 搜索租车响应

| Name | Type | Description |
| :--- | :--- | :--- |
| **request_id** | string | Uniquely identifies the request. <br> 唯一标识请求。 |
| **data** | array | Detailed information about car rental product. <br> 租车产品的详细信息。 |
| data.car | integer | Related car id <br> 相关车辆 ID |
| data.deal | object | Specifies the deal tagging for the product. <br> 指定产品的交易标签。 |
| data.policies | object | The policies that apply to this product. <br> 适用于此产品的政策。 |
| data.policies.cancellation | object | The cancellation policy. <br> 取消政策。 |
| data.policies.damage_excess | number | The maximum amount charged for damages. <br> 损坏收取的最大金额。 |
| data.policies.deposit | number | The security deposit amount. <br> 押金金额。 |
| data.policies.insurance_package | string | The supplier insurance package. Enum: `basic`, `inclusive`, `zero_excess` <br> 供应商保险套餐。枚举: `basic` (基本), `inclusive` (全包), `zero_excess` (零免赔额) |
| data.policies.fuel | string | The fuel policy. Enum: `return_same`, `free_tank`, `prepay_no_refunds`, etc. <br> 燃油政策。枚举: `return_same` (同油取还), `free_tank` (免费油箱), `prepay_no_refunds` (预付不退款) 等。 |
| data.policies.mileage | object | The mileage policy. <br> 里程政策。 |
| data.price | object | Price information. <br> 价格信息。 |
| data.route | object | Route information (dropoff/pickup depots). <br> 路线信息 (还车/取车门店)。 |
| data.supplier | integer | Related supplier id. <br> 相关供应商 ID。 |
| data.url | object | URLs for deep linking. <br> 深度链接 URL。 |
| **metadata** | object | Metadata about the request. <br> 关于请求的元数据。 |
| **search_token** | string | Token for deep linking. <br> 深度链接的令牌。 |

### <a id="depotsrequest"></a>DepotsRequest

**Description:** Depots request body
**描述:** 门店请求体

| Name | Type | Description |
| :--- | :--- | :--- |
| **last_modified** | string | The last modified date-time (ISO 8601). Only returns depots newer than this timestamp. <br> 最后修改日期时间 (ISO 8601)。仅返回在此时间戳之后更新的门店。 |
| **maximum_results** | integer | The maximum number of results to return. Default: 100. Min: 10, Max: 100. <br> 每页返回的最大结果数。默认: 100。最小: 10, 最大: 100。 |
| **languages** | array | List of language codes (e.g., `en-gb`, `nl`). <br> 语言代码列表 (例如 `en-gb`, `nl`)。 |
| **page** | string | Pagination token used to retrieve the next page of results. <br> 用于检索下一页结果的分页令牌。 |

### <a id="depotsresponse"></a>DepotsResponse

**Description:** Depots response
**描述:** 门店响应

| Name | Type | Description |
| :--- | :--- | :--- |
| **request_id** | string | Uniquely identifies the request. <br> 唯一标识请求。 |
| **data** | array | All static information related to car rental depot. <br> 与租车门店相关的所有静态信息。 |
| data.id | integer | Unique depot's ID. <br> 门店唯一 ID。 |
| data.contact | object | Contact information (email, telephone). <br> 联系信息 (邮件, 电话)。 |
| data.city | integer | A signed integer number that uniquely identifies a city. <br> 唯一标识城市的有符号整数。 |
| data.drop_off | object | Contains rented car drop off information. <br> 包含还车信息。 |
| data.drop_off.instructions | object | Drop off instructions (TranslatedString). Pattern: `^[a-z]{2}(-[a-z]{2})$`. <br> 还车说明 (多语言)。模式: `^[a-z]{2}(-[a-z]{2})$`。 |
| data.drop_off.working_hours | object | Depot's working hours. Keys: `monday`, `tuesday`, etc. <br> 门店工作时间。键: `monday` (周一) 等。 |
| data.location | object | Depot location information. <br> 门店位置信息。 |
| data.location.address | string | Depot address. <br> 门店地址。 |
| data.location.airport | string | Airport IATA code (if applicable). <br> 机场 IATA 代码 (如果适用)。 |
| data.location.depot_location_type | string | Type of location. Enum: `in_terminal`, `car_rental_centre`, `outside_terminal`, `airport_hotel`, `shuttle_bus`, `meet_greet`, `trainstation`, `downtown`. <br> 位置类型。 |
| data.location.coordinates | object | Lat/Long coordinates. <br> 经纬度坐标。 |
| data.location.country | string | ISO 3166-1 alpha-2 country code. <br> 国家代码。 |
| data.pick_up | object | Contains rented car pick up information. <br> 包含取车信息。 (Structure same as drop_off) |
| data.services | array | List of services provided. Enum: `shuttle`, `meet_greet`, `unknown` <br> 提供的服务。 |
| data.supplier | integer | Related supplier id <br> 相关供应商 ID |
| data.ratings | object | Number of reviews and average score for the depot. <br> 门店的评论数和平均评分。 |
| **metadata** | object | Metadata about the request. <br> 关于请求的元数据。 |

### <a id="depotscoresrequest"></a>DepotScoresRequest

**Description:** Depot scores request body
**描述:** 门店评分请求体

| Name | Type | Description |
| :--- | :--- | :--- |
| **maximum_results** | integer | The maximum number of results to return. Default: 100. Min: 10, Max: 100. <br> 每页返回的最大结果数。默认: 100。最小: 10, 最大: 100。 |
| **page** | string | Pagination token used to retrieve the next page of results. <br> 用于检索下一页结果的分页令牌。 |

### <a id="depotscoresresponse"></a>DepotScoresResponse

**Description:** Depot scores response
**描述:** 门店评分响应

| Name | Type | Description |
| :--- | :--- | :--- |
| **request_id** | string | Uniquely identifies the request. <br> 唯一标识请求。 |
| **data** | array | Detailed information about car rental depot scores. <br> 租车门店评分的详细信息。 |
| data.id | integer | Unique depot's ID. <br> 门店唯一 ID。 |
| data.breakdown | object | Review scores breakdown for each criteria (cleanliness, condition, etc). <br> 每个标准 (清洁度, 状况等) 的评分明细。 |
| data.number_of_reviews | integer | Number of validated reviews for this depot. <br> 该门店的验证评论数。 |
| data.score | number | A decimal number indicating the current review score (1..10). <br> 指示当前评分的十进制数 (1..10)。 |
| **metadata** | object | Metadata about the request. <br> 关于请求的元数据。 |

### <a id="cardetailsrequest"></a>CarDetailsRequest

**Description:** Car details request body
**描述:** 车辆详情请求体

| Name | Type | Description |
| :--- | :--- | :--- |
| **last_modified** | string | The last modified date-time. Only returns details modified after this timestamp. <br> 最后修改日期时间。仅返回在此时间戳之后修改的详情。 |
| **maximum_results** | integer | The maximum number of results to return. Default: 100. <br> 每页返回的最大结果数。默认: 100。 |
| **page** | string | Pagination token. <br> 分页令牌。 |

### <a id="cardetailsresponse"></a>CarDetailsResponse

**Description:** Car details response
**描述:** 车辆详情响应

| Name | Type | Description |
| :--- | :--- | :--- |
| **request_id** | string | Uniquely identifies the request. <br> 唯一标识请求。 |
| **data** | array | All static information related to cars. <br> 与车辆相关的所有静态信息。 |
| data.id | integer | Unique car's ID. <br> 车辆唯一 ID。 |
| data.capacity | object | Car's capacity (bags, doors, seats). <br> 车辆容量 (行李, 车门, 座位)。 |
| data.features | array | List of possible car's features (e.g., `air_conditioning`, `all_wheel_drive`). <br> 可能的车辆特性列表。 |
| data.image | string | Car's image URL. <br> 车辆图片 URL。 |
| data.make | string | Car's maker/brand. <br> 车辆制造商/品牌。 |
| data.model | string | Car's model. <br> 车辆型号。 |
| data.specification | object | Car's specification. <br> 车辆规格。 |
| data.specification.code | string | Car's code in [ACRISS Standard](https://www.acriss.org/car-codes/expanded-matrix/). <br> ACRISS 标准代码。 |
| data.specification.description | string | Car Description Based on [ACRISS Category and Type](https://www.acriss.org/car-codes/expanded-matrix/). <br> 基于 ACRISS 的描述。 |
| data.specification.fuel | string | Car's fuel type. Enum: `electric`, `petrol`, `plug_in_hybrid`, `multi_fuel`, `diesel`, `hybrid`, `lpg`, `hydrogen`, `ethanol`, `unspecified` <br> 燃油类型。 |
| data.specification.transmission | string | Car's transmission. Enum: `automatic`, `manual` <br> 变速箱。 |
| data.supplier | integer | Related supplier id. <br> 相关供应商 ID。 |
| **metadata** | object | Metadata about the request. <br> 关于请求的元数据。 |

### <a id="suppliersrequest"></a>SuppliersRequest

**Description:** Suppliers request body
**描述:** 供应商请求体

| Name | Type | Description |
| :--- | :--- | :--- |
| **maximum_results** | integer | The maximum number of results to return. Default: 100. <br> 每页返回的最大结果数。默认: 100。 |
| **page** | string | Pagination token. <br> 分页令牌。 |
| **suppliers** | array | Defines the suppliers that should be returned. List of supplier IDs. <br> 定义应返回的供应商。供应商 ID 列表。 |

### <a id="suppliersresponse"></a>SuppliersResponse

**Description:** Suppliers response
**描述:** 供应商响应

| Name | Type | Description |
| :--- | :--- | :--- |
| **request_id** | string | Uniquely identifies the request. <br> 唯一标识请求。 |
| **data** | array | All static information related to vehicle suppliers. <br> 与车辆供应商相关的所有静态信息。 |
| data.id | integer | Uniquely identifies a vehicle supplier. <br> 唯一标识车辆供应商。 |
| data.logo | string | Supplier logo image URL. <br> 供应商徽标图片 URL。 |
| data.name | string | Brand name of the vehicle supplier. <br> 车辆供应商的品牌名称。 |
| **metadata** | object | Metadata about the request (total_results, next_page). <br> 关于请求的元数据 (总结果数, 下一页)。 |

### <a id="constantsrequest"></a>ConstantsRequest

**Description:** Constants request body
**描述:** 常量请求体

| Name | Type | Description |
| :--- | :--- | :--- |
| **constants** | array | List of car rental constant types to filter by. Enum: `depot_services`, `fuel_policies`, `fuel_types`, `general`, `payment_timings`, `transmission` <br> 用于筛选的租车常量类型列表。枚举: `depot_services`, `fuel_policies`, `fuel_types`, `general`, `payment_timings`, `transmission` |
| **languages** | array | List of language codes. Default: `en-gb` <br> 语言代码列表。默认: `en-gb` |

### <a id="constantsresponse"></a>ConstantsResponse

**Description:** Constants response
**描述:** 常量响应

| Name | Type | Description |
| :--- | :--- | :--- |
| **request_id** | string | Uniquely identifies the request. <br> 唯一标识请求。 |
| **data** | object | Constants data output. <br> 常量数据输出。 |
| data.depot_services | object | Id and translated names for depot services. <br> 门店服务的 ID 和翻译名称。 |
| data.fuel_policies | object | Id and translated names for fuel policies. <br> 燃油政策的 ID 和翻译名称。 |
| data.fuel_types | object | Id and translated names for fuel types. <br> 燃油类型的 ID 和翻译名称。 |
| data.general | object | Id and translated names for general constants. <br> 通用常量的 ID 和翻译名称。 |
| data.payment_timings | object | Id and translated names for payment timings. <br> 支付时间的 ID 和翻译名称。 |
| data.transmission | object | Id and translated names for transmission types. <br> 变速箱类型的 ID 和翻译名称。 |
