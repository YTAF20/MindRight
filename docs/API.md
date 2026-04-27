# 📚 MindRight API Documentation

Complete REST API reference for MindRight backend services.

---

## Base URL

```
Development:  http://localhost:8080
Production:   https://api.mindright.app
```

## Authentication

All endpoints (except `/auth/register` and `/auth/login`) require a JWT token in the `Authorization` header:

```
Authorization: Bearer <access_token>
```

## Response Format

All responses are JSON:

```json
{
  "data": { /* response body */ },
  "meta": {
    "timestamp": "2024-04-27T10:30:00Z",
    "status": 200
  }
}
```

Error responses:

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Validation failed",
    "details": [
      {
        "field": "email",
        "message": "Invalid email format"
      }
    ]
  }
}
```

---

## Authentication Endpoints

### Register User

```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePassword123!",
  "firstName": "John",
  "lastName": "Doe"
}
```

**Response (201 Created):**
```json
{
  "data": {
    "userId": "550e8400-e29b-41d4-a716-446655440000",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "accessToken": "eyJhbGciOiJIUzI1NiIs...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIs...",
    "expiresIn": 900
  }
}
```

**Errors:**
- `400 Bad Request` - Validation failed (invalid email, weak password)
- `409 Conflict` - Email already registered

---

### Login

```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePassword123!"
}
```

**Response (200 OK):**
```json
{
  "data": {
    "userId": "550e8400-e29b-41d4-a716-446655440000",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "accessToken": "eyJhbGciOiJIUzI1NiIs...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIs...",
    "expiresIn": 900
  }
}
```

**Errors:**
- `401 Unauthorized` - Invalid email or password
- `404 Not Found` - User not found

---

### Refresh Token

```http
POST /api/auth/refresh
Content-Type: application/json

{
  "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
}
```

**Response (200 OK):**
```json
{
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIs...",
    "expiresIn": 900
  }
}
```

**Errors:**
- `401 Unauthorized` - Invalid or expired refresh token

---

### Logout

```http
POST /api/auth/logout
Authorization: Bearer <access_token>
```

**Response (204 No Content)**

---

### Verify Token

```http
GET /api/auth/verify
Authorization: Bearer <access_token>
```

**Response (200 OK):**
```json
{
  "data": {
    "valid": true,
    "userId": "550e8400-e29b-41d4-a716-446655440000",
    "email": "user@example.com",
    "expiresAt": "2024-04-27T10:45:00Z"
  }
}
```

**Errors:**
- `401 Unauthorized` - Invalid or expired token

---

## User Management Endpoints

### Get Current User

```http
GET /api/user/profile
Authorization: Bearer <access_token>
```

**Response (200 OK):**
```json
{
  "data": {
    "userId": "550e8400-e29b-41d4-a716-446655440000",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "profilePicture": "https://cdn.example.com/profile/550e8400.jpg",
    "createdAt": "2024-01-15T09:00:00Z",
    "updatedAt": "2024-04-27T10:30:00Z"
  }
}
```

---

### Update User Profile

```http
PUT /api/user/profile
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "firstName": "John",
  "lastName": "Smith",
  "profilePicture": "base64_image_data"
}
```

**Response (200 OK):**
```json
{
  "data": {
    "userId": "550e8400-e29b-41d4-a716-446655440000",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Smith",
    "profilePicture": "https://cdn.example.com/profile/550e8400.jpg",
    "updatedAt": "2024-04-27T10:35:00Z"
  }
}
```

---

### Get User Settings

```http
GET /api/user/settings
Authorization: Bearer <access_token>
```

**Response (200 OK):**
```json
{
  "data": {
    "userId": "550e8400-e29b-41d4-a716-446655440000",
    "notifications": {
      "email": true,
      "push": true,
      "sms": false
    },
    "privacy": {
      "profilePublic": false,
      "shareAnalytics": true
    },
    "theme": "dark",
    "timezone": "America/New_York"
  }
}
```

---

### Update User Settings

```http
PUT /api/user/settings
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "notifications": {
    "email": false,
    "push": true,
    "sms": false
  },
  "theme": "light",
  "timezone": "Europe/London"
}
```

**Response (200 OK):**
```json
{
  "data": {
    "userId": "550e8400-e29b-41d4-a716-446655440000",
    "notifications": {
      "email": false,
      "push": true,
      "sms": false
    },
    "privacy": {
      "profilePublic": false,
      "shareAnalytics": true
    },
    "theme": "light",
    "timezone": "Europe/London",
    "updatedAt": "2024-04-27T10:40:00Z"
  }
}
```

---

### Delete Account

```http
DELETE /api/user/account
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "password": "SecurePassword123!"
}
```

**Response (204 No Content)**

**Errors:**
- `401 Unauthorized` - Invalid password
- `422 Unprocessable Entity` - Password confirmation required

---

## Goals Endpoints

### List Goals

```http
GET /api/goals?status=active&limit=50&offset=0
Authorization: Bearer <access_token>
```

**Query Parameters:**
- `status` (optional): `active`, `completed`, `archived`
- `category` (optional): `health`, `productivity`, `wellness`
- `limit` (optional): Default 50, max 500
- `offset` (optional): Pagination offset

**Response (200 OK):**
```json
{
  "data": {
    "goals": [
      {
        "goalId": "660e8400-e29b-41d4-a716-446655440001",
        "userId": "550e8400-e29b-41d4-a716-446655440000",
        "title": "Reduce screen time",
        "description": "Limit daily screen time to 2 hours",
        "category": "health",
        "targetValue": 120,
        "currentValue": 95,
        "unit": "minutes",
        "frequency": "daily",
        "status": "active",
        "startDate": "2024-04-01",
        "endDate": "2024-06-30",
        "createdAt": "2024-04-01T08:00:00Z",
        "updatedAt": "2024-04-27T10:30:00Z"
      }
    ],
    "pagination": {
      "total": 5,
      "limit": 50,
      "offset": 0
    }
  }
}
```

---

### Create Goal

```http
POST /api/goals
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "title": "Reduce screen time",
  "description": "Limit daily screen time to 2 hours",
  "category": "health",
  "targetValue": 120,
  "unit": "minutes",
  "frequency": "daily",
  "startDate": "2024-04-01",
  "endDate": "2024-06-30"
}
```

**Response (201 Created):**
```json
{
  "data": {
    "goalId": "660e8400-e29b-41d4-a716-446655440001",
    "userId": "550e8400-e29b-41d4-a716-446655440000",
    "title": "Reduce screen time",
    "description": "Limit daily screen time to 2 hours",
    "category": "health",
    "targetValue": 120,
    "currentValue": 0,
    "unit": "minutes",
    "frequency": "daily",
    "status": "active",
    "startDate": "2024-04-01",
    "endDate": "2024-06-30",
    "createdAt": "2024-04-27T10:30:00Z",
    "updatedAt": "2024-04-27T10:30:00Z"
  }
}
```

**Errors:**
- `400 Bad Request` - Invalid goal data (missing required fields, invalid dates)
- `422 Unprocessable Entity` - Business rule violation (end date before start)

---

### Get Goal Details

```http
GET /api/goals/{goalId}
Authorization: Bearer <access_token>
```

**Response (200 OK):**
```json
{
  "data": {
    "goalId": "660e8400-e29b-41d4-a716-446655440001",
    "userId": "550e8400-e29b-41d4-a716-446655440000",
    "title": "Reduce screen time",
    "description": "Limit daily screen time to 2 hours",
    "category": "health",
    "targetValue": 120,
    "currentValue": 95,
    "unit": "minutes",
    "frequency": "daily",
    "status": "active",
    "startDate": "2024-04-01",
    "endDate": "2024-06-30",
    "progress": 79,
    "createdAt": "2024-04-01T08:00:00Z",
    "updatedAt": "2024-04-27T10:30:00Z"
  }
}
```

**Errors:**
- `404 Not Found` - Goal not found
- `403 Forbidden` - Goal belongs to another user

---

### Update Goal

```http
PUT /api/goals/{goalId}
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "title": "Reduce screen time to 90 min",
  "targetValue": 90,
  "endDate": "2024-07-31"
}
```

**Response (200 OK):**
```json
{
  "data": {
    "goalId": "660e8400-e29b-41d4-a716-446655440001",
    "title": "Reduce screen time to 90 min",
    "targetValue": 90,
    "currentValue": 95,
    "endDate": "2024-07-31",
    "updatedAt": "2024-04-27T10:45:00Z"
  }
}
```

---

### Delete Goal

```http
DELETE /api/goals/{goalId}
Authorization: Bearer <access_token>
```

**Response (204 No Content)**

---

### Get Goal Progress

```http
GET /api/goals/{goalId}/progress?range=week
Authorization: Bearer <access_token>
```

**Query Parameters:**
- `range` (optional): `day`, `week`, `month`, `all` (default: `month`)
- `startDate` (optional): ISO format
- `endDate` (optional): ISO format

**Response (200 OK):**
```json
{
  "data": {
    "goalId": "660e8400-e29b-41d4-a716-446655440001",
    "title": "Reduce screen time",
    "progress": [
      {
        "date": "2024-04-21",
        "value": 100,
        "percentage": 83
      },
      {
        "date": "2024-04-22",
        "value": 110,
        "percentage": 92
      },
      {
        "date": "2024-04-23",
        "value": 95,
        "percentage": 79
      },
      {
        "date": "2024-04-24",
        "value": 120,
        "percentage": 100
      }
    ],
    "average": 106,
    "trend": "up"
  }
}
```

---

### Log Goal Progress

```http
POST /api/goals/{goalId}/progress
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "value": 95,
  "date": "2024-04-27"
}
```

**Response (201 Created):**
```json
{
  "data": {
    "progressId": "770e8400-e29b-41d4-a716-446655440002",
    "goalId": "660e8400-e29b-41d4-a716-446655440001",
    "value": 95,
    "percentage": 79,
    "date": "2024-04-27",
    "createdAt": "2024-04-27T10:50:00Z"
  }
}
```

---

## Screen Time Endpoints

### Get Today's Screen Time

```http
GET /api/screen-time/today
Authorization: Bearer <access_token>
```

**Response (200 OK):**
```json
{
  "data": {
    "date": "2024-04-27",
    "totalMinutes": 180,
    "appBreakdown": [
      {
        "appName": "Chrome",
        "minutes": 90,
        "percentage": 50
      },
      {
        "appName": "Discord",
        "minutes": 60,
        "percentage": 33
      },
      {
        "appName": "VS Code",
        "minutes": 30,
        "percentage": 17
      }
    ]
  }
}
```

---

### Get Weekly Screen Time

```http
GET /api/screen-time/week?startDate=2024-04-21
Authorization: Bearer <access_token>
```

**Query Parameters:**
- `startDate` (optional): ISO format (default: 7 days ago)

**Response (200 OK):**
```json
{
  "data": {
    "period": "2024-04-21 to 2024-04-27",
    "dailyStats": [
      {
        "date": "2024-04-21",
        "minutes": 150,
        "trend": "down"
      },
      {
        "date": "2024-04-22",
        "minutes": 180,
        "trend": "up"
      },
      {
        "date": "2024-04-23",
        "minutes": 160,
        "trend": "down"
      },
      {
        "date": "2024-04-24",
        "minutes": 200,
        "trend": "up"
      },
      {
        "date": "2024-04-25",
        "minutes": 170,
        "trend": "down"
      },
      {
        "date": "2024-04-26",
        "minutes": 190,
        "trend": "up"
      },
      {
        "date": "2024-04-27",
        "minutes": 180,
        "trend": "down"
      }
    ],
    "average": 176,
    "totalMinutes": 1230
  }
}
```

---

### Get Monthly Screen Time

```http
GET /api/screen-time/month?month=2024-04
Authorization: Bearer <access_token>
```

**Response (200 OK):**
```json
{
  "data": {
    "month": "April 2024",
    "totalMinutes": 5400,
    "averagePerDay": 180,
    "mostActiveDay": "2024-04-27",
    "leastActiveDay": "2024-04-10",
    "topApps": [
      {
        "appName": "Chrome",
        "minutes": 2700,
        "percentage": 50
      },
      {
        "appName": "Discord",
        "minutes": 1620,
        "percentage": 30
      },
      {
        "appName": "VS Code",
        "minutes": 1080,
        "percentage": 20
      }
    ]
  }
}
```

---

## Blocked Apps Endpoints

### List Blocked Apps

```http
GET /api/blocked-apps?active=true&limit=50
Authorization: Bearer <access_token>
```

**Query Parameters:**
- `active` (optional): Filter by active status
- `limit` (optional): Default 50, max 500
- `offset` (optional): Pagination offset

**Response (200 OK):**
```json
{
  "data": {
    "blockedApps": [
      {
        "blockedAppId": "880e8400-e29b-41d4-a716-446655440003",
        "userId": "550e8400-e29b-41d4-a716-446655440000",
        "appName": "Twitter",
        "domain": "twitter.com",
        "isActive": true,
        "createdAt": "2024-04-20T08:00:00Z",
        "updatedAt": "2024-04-27T10:30:00Z"
      },
      {
        "blockedAppId": "880e8400-e29b-41d4-a716-446655440004",
        "userId": "550e8400-e29b-41d4-a716-446655440000",
        "appName": "Reddit",
        "domain": "reddit.com",
        "isActive": true,
        "createdAt": "2024-04-22T09:00:00Z",
        "updatedAt": "2024-04-27T10:30:00Z"
      }
    ],
    "pagination": {
      "total": 2,
      "limit": 50,
      "offset": 0
    }
  }
}
```

---

### Create Blocked App

```http
POST /api/blocked-apps
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "appName": "Twitter",
  "domain": "twitter.com"
}
```

**Response (201 Created):**
```json
{
  "data": {
    "blockedAppId": "880e8400-e29b-41d4-a716-446655440003",
    "userId": "550e8400-e29b-41d4-a716-446655440000",
    "appName": "Twitter",
    "domain": "twitter.com",
    "isActive": true,
    "createdAt": "2024-04-27T10:55:00Z",
    "updatedAt": "2024-04-27T10:55:00Z"
  }
}
```

**Errors:**
- `400 Bad Request` - Invalid domain
- `409 Conflict` - App already blocked

---

### Delete Blocked App

```http
DELETE /api/blocked-apps/{blockedAppId}
Authorization: Bearer <access_token>
```

**Response (204 No Content)**

---

### Sync Blocked Apps Rules

```http
GET /api/blocked-apps/sync
Authorization: Bearer <access_token>
```

Used by Chrome extension to get current blocking rules.

**Response (200 OK):**
```json
{
  "data": {
    "rules": [
      {
        "id": 1,
        "priority": 1,
        "action": {
          "type": "block"
        },
        "condition": {
          "urlFilter": "|https?://twitter.com|"
        }
      },
      {
        "id": 2,
        "priority": 1,
        "action": {
          "type": "block"
        },
        "condition": {
          "urlFilter": "|https?://reddit.com|"
        }
      }
    ]
  }
}
```

---

## Error Codes Reference

| Code | HTTP Status | Description |
|------|-------------|-------------|
| `VALIDATION_ERROR` | 400 | Request validation failed |
| `UNAUTHORIZED` | 401 | Missing or invalid authentication |
| `FORBIDDEN` | 403 | Insufficient permissions |
| `NOT_FOUND` | 404 | Resource not found |
| `CONFLICT` | 409 | Resource already exists |
| `RATE_LIMITED` | 429 | Too many requests |
| `INTERNAL_ERROR` | 500 | Internal server error |

---

## Rate Limiting

- **Limit:** 100 requests per minute per user
- **Headers:**
  - `X-RateLimit-Limit`: 100
  - `X-RateLimit-Remaining`: Remaining requests
  - `X-RateLimit-Reset`: Unix timestamp when limit resets

When rate limited, server returns `429 Too Many Requests` with:

```json
{
  "error": {
    "code": "RATE_LIMITED",
    "message": "Rate limit exceeded",
    "retryAfter": 60
  }
}
```

---

## Example: Complete User Flow

```bash
# 1. Register
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "SecurePassword123!",
    "firstName": "John",
    "lastName": "Doe"
  }'

# Response includes accessToken and refreshToken

# 2. Create goal
curl -X POST http://localhost:8080/api/goals \
  -H "Authorization: Bearer ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Reduce screen time",
    "category": "health",
    "targetValue": 120,
    "unit": "minutes",
    "frequency": "daily",
    "startDate": "2024-04-01",
    "endDate": "2024-06-30"
  }'

# Response includes goalId

# 3. Log progress
curl -X POST http://localhost:8080/api/goals/GOAL_ID/progress \
  -H "Authorization: Bearer ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "value": 95,
    "date": "2024-04-27"
  }'

# 4. Block an app
curl -X POST http://localhost:8080/api/blocked-apps \
  -H "Authorization: Bearer ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "appName": "Twitter",
    "domain": "twitter.com"
  }'

# 5. Get screen time stats
curl http://localhost:8080/api/screen-time/week \
  -H "Authorization: Bearer ACCESS_TOKEN"
```

---

## Webhooks (Coming Soon)

Future versions will support webhooks for:
- Goal completed
- Daily screen time limit exceeded
- Blocked app accessed
- Weekly progress report

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| v1.0 | 2024-04-27 | Initial API release |

---

**Last Updated:** 2024-04-27  
**API Version:** v1.0  
**Status:** ✅ Production Ready
