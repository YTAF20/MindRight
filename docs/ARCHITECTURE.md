# 🏗️ MindRight Architecture

A comprehensive guide to the MindRight system design, technology stack, and how components interact.

---

## System Overview

```
┌─────────────────────────────────────────────────────────────┐
│                        MindRight                             │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐       │
│  │  Web App     │  │  Chrome      │  │  iOS/Android │       │
│  │  (React)     │  │  Extension   │  │  (Native)    │       │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘       │
│         │                 │                 │                │
│         └─────────────────┼─────────────────┘                │
│                           │ REST + WebSocket                │
│         ┌─────────────────▼─────────────────┐               │
│         │   Spring Boot Backend (Java)      │               │
│         │   - REST API                      │               │
│         │   - WebSocket (real-time)         │               │
│         │   - Auth & Security               │               │
│         │   - Business Logic                │               │
│         └─────────────────┬─────────────────┘               │
│                           │                                  │
│         ┌─────────────────┼─────────────────┐               │
│         │                 │                 │                │
│    ┌────▼────┐       ┌───▼────┐      ┌───▼────┐            │
│    │PostgreSQL│       │ Redis  │      │ File   │            │
│    │ Database │       │ Cache  │      │ Storage│            │
│    └──────────┘       └────────┘      └────────┘            │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

---

## Technology Stack

### Backend
- **Framework:** Spring Boot 3.3
- **Language:** Java 21
- **Build:** Maven
- **Database:** PostgreSQL 16
- **Cache:** Redis 7
- **Security:** Spring Security + JWT
- **Auth:** OAuth2 / JWT tokens
- **API:** REST (OpenAPI/Swagger)
- **Real-time:** WebSocket
- **ORM:** Spring Data JPA (Hibernate)
- **Validation:** Jakarta Bean Validation
- **Testing:** JUnit 5, Mockito
- **Code Quality:** SpotLess, SonarQube

### Web Dashboard
- **Framework:** React 18
- **Language:** TypeScript (strict mode)
- **Build:** Vite
- **Styling:** TailwindCSS
- **HTTP Client:** Axios
- **State Management:** Redux Toolkit / Zustand
- **Testing:** Vitest, React Testing Library
- **Linting:** ESLint, Prettier
- **Type Checking:** TypeScript strict

### Chrome Extension
- **Manifest:** Version 3
- **APIs:** 
  - Declarative Net Request (blocking)
  - Storage API (local rules)
  - WebSocket (real-time sync)
- **UI:** HTML + CSS
- **Scripting:** JavaScript (ES2020+)
- **Code Quality:** ESLint

### iOS App
- **Language:** Swift 5.9+
- **UI Framework:** SwiftUI
- **Minimum:** iOS 14
- **Architecture:** MVVM
- **Networking:** URLSession, Combine
- **Local Data:** Core Data / SwiftData
- **Testing:** XCTest
- **Distribution:** App Store

### Android App
- **Language:** Kotlin
- **UI Framework:** Jetpack Compose
- **Min SDK:** 26 (Android 8.0)
- **Target SDK:** 34+ (latest)
- **Architecture:** MVVM + MVI
- **Networking:** Retrofit, OkHttp
- **Local Data:** Room database
- **Background:** WorkManager
- **Testing:** JUnit, MockK
- **Distribution:** Google Play Store

### Infrastructure
- **Containerization:** Docker + Docker Compose
- **CI/CD:** GitHub Actions
- **Deployment Targets:**
  - Backend: Railway, Heroku, AWS EC2, DigitalOcean, Azure
  - Frontend: Vercel, Netlify, AWS S3 + CloudFront
  - Extension: Chrome Web Store
  - iOS: App Store
  - Android: Play Store

---

## Data Model

### Core Entities

#### User
```
User {
  id: UUID
  email: String (unique)
  passwordHash: String (bcrypt)
  firstName: String
  lastName: String
  profilePicture: URL
  createdAt: Timestamp
  updatedAt: Timestamp
  roles: Role[] (USER, ADMIN)
}
```

#### Goal
```
Goal {
  id: UUID
  userId: UUID (foreign key)
  title: String
  description: String
  category: String (health, productivity, wellness)
  targetValue: Double
  currentValue: Double
  unit: String (hours, minutes, miles, etc)
  frequency: String (daily, weekly, monthly)
  startDate: Date
  endDate: Date (optional)
  isActive: Boolean
  createdAt: Timestamp
  updatedAt: Timestamp
}
```

#### ScreenTimeLog
```
ScreenTimeLog {
  id: UUID
  userId: UUID (foreign key)
  date: Date
  totalMinutes: Long
  appBreakdown: Map<String, Long> (app -> minutes)
  createdAt: Timestamp
}
```

#### BlockedApp
```
BlockedApp {
  id: UUID
  userId: UUID (foreign key)
  appName: String
  domain: String (for web)
  isActive: Boolean
  createdAt: Timestamp
}
```

---

## API Endpoints

### Authentication
```
POST   /api/auth/register           Register new user
POST   /api/auth/login              Login user
POST   /api/auth/refresh            Refresh JWT token
POST   /api/auth/logout             Logout user
GET    /api/auth/verify             Verify token validity
```

### User Management
```
GET    /api/user/profile            Get current user
PUT    /api/user/profile            Update user
GET    /api/user/settings           Get user settings
PUT    /api/user/settings           Update user settings
DELETE /api/user/account            Delete account
```

### Goals
```
GET    /api/goals                   List user's goals
POST   /api/goals                   Create goal
GET    /api/goals/{id}              Get goal details
PUT    /api/goals/{id}              Update goal
DELETE /api/goals/{id}              Delete goal
GET    /api/goals/{id}/progress     Get goal progress
POST   /api/goals/{id}/progress     Log goal progress
```

### Screen Time
```
GET    /api/screen-time/today       Today's screen time
GET    /api/screen-time/week        Weekly stats
GET    /api/screen-time/month       Monthly stats
POST   /api/screen-time/log         Log screen time
GET    /api/screen-time/apps        App breakdown
```

### Blocked Apps
```
GET    /api/blocked-apps            List blocked apps
POST   /api/blocked-apps            Create blocked app
DELETE /api/blocked-apps/{id}       Remove blocked app
GET    /api/blocked-apps/sync       Sync rules (for extension)
```

---

## Authentication Flow

```
┌─────────────┐                    ┌─────────────┐
│   Client    │                    │  Backend    │
└──────┬──────┘                    └──────┬──────┘
       │                                  │
       │ 1. POST /auth/register           │
       ├─────────────────────────────────>│
       │ { email, password }              │
       │                                  │
       │ 2. Validate & hash password      │
       │                                  │
       │ 3. 201 Created                   │
       │ { userId, token, refreshToken }  │
       │<─────────────────────────────────┤
       │                                  │
       │ 4. Store token in localStorage   │
       │ 5. Use token in Authorization    │
       │    header for all requests       │
       │                                  │
       │ 6. GET /api/user/profile         │
       │ Authorization: Bearer <token>    │
       ├─────────────────────────────────>│
       │                                  │
       │ 7. Verify token with JWT secret  │
       │ 8. Return user data              │
       │<─────────────────────────────────┤
```

### Token Lifecycle
```
- Access Token: JWT, 15 minutes
- Refresh Token: JWT, 7 days
- On expiry: POST /auth/refresh → new access token
- On logout: Token invalidated server-side (Redis blacklist)
```

---

## Data Flow: Blocking a Website

```
User Interface (Web)
    │
    └─> Add "facebook.com" to blocked apps
        │
        └─> POST /api/blocked-apps
            { domain: "facebook.com" }
            │
            ├─> Save to PostgreSQL
            ├─> Cache in Redis
            │
            └─> Notify Chrome Extension (WebSocket)
                │
                ├─> Extension receives update
                ├─> Generate Declarative Net Request rules
                ├─> Update rules in browser
                │
                └─> When user visits facebook.com
                    ├─> DNR API blocks request
                    ├─> Redirect to blocker page
                    └─> Log to backend (optional)
```

---

## Data Synchronization

### Real-time Sync (WebSocket)
```
Client connects:
1. WebSocket connection to /ws/sync
2. Send: { userId, sessionId }
3. Receive: delta updates

When admin updates blocked apps:
1. Backend publishes update to Redis pub/sub
2. All connected clients receive notification
3. Clients refetch blocked apps list
4. Extension updates DNR rules
```

### Offline Sync (Mobile)
```
Mobile App (iOS/Android):
1. All data cached in local database (SQLite/Realm)
2. Periodic sync (every 5 mins or on app open)
3. Send: local changes + last sync timestamp
4. Receive: server changes since last sync
5. Merge with conflict resolution (server wins)
```

---

## Security Architecture

### Authentication
- **Method:** JWT (JSON Web Tokens)
- **Algorithm:** HS256
- **Secret:** Environment variable, rotated monthly
- **Claims:** `sub` (userId), `email`, `roles`, `iat`, `exp`

### Authorization
- **Method:** Role-Based Access Control (RBAC)
- **Roles:** USER, ADMIN
- **Endpoints:** Protected with @PreAuthorize annotations

### Data Protection
- **At Rest:** PostgreSQL encryption (TDE)
- **In Transit:** HTTPS/TLS 1.3+
- **Passwords:** bcrypt (cost factor: 10)

### API Security
- **CORS:** Whitelist origins (frontend, extension)
- **CSRF:** Token validation for state-changing requests
- **Rate Limiting:** 100 requests/minute per IP
- **Input Validation:** Jakarta Bean Validation
- **SQL Injection:** Prepared statements (JPA)
- **XSS Prevention:** Content Security Policy headers

### Extension Security
- **Manifest V3:** No eval(), inline scripts
- **Content Security Policy:** Strict CSP headers
- **Cross-Origin Requests:** CORS with backend

---

## Deployment Architecture

### Development (Local)
```
Docker Compose:
├── PostgreSQL (port 5432)
├── Redis (port 6379)
├── Spring Boot Backend (port 8080)
├── React Dev Server (port 5173)
└── Chrome Extension (localhost)
```

### Production (Backend)

#### Option 1: Railway
```
Railway Project:
├── PostgreSQL (managed)
├── Redis (managed)
├── Spring Boot Backend
│   ├── Environment variables
│   ├── Auto-scaling
│   └── Health checks
└── GitHub integration (auto-deploy)
```

#### Option 2: AWS EC2 + RDS
```
AWS:
├── EC2 instance (t3.medium)
├── RDS PostgreSQL (multi-AZ)
├── ElastiCache Redis
├── ALB (load balancer)
├── Auto-scaling group
└── CloudWatch monitoring
```

### Production (Frontend)

#### Vercel
```
Vercel:
├── React build
├── Global CDN
├── Automatic deploys from GitHub
├── Serverless functions (optional)
├── Analytics & monitoring
└── Preview URLs for PRs
```

---

## Caching Strategy

### Redis Cache Layers
```
1. User data (5 min TTL)
   key: user:{userId}
   value: user object

2. Goals (5 min TTL)
   key: goals:{userId}
   value: array of goals

3. Blocked apps (1 min TTL)
   key: blocked:{userId}
   value: blocked apps list

4. Session tokens (JWT exp time)
   key: session:{sessionId}
   value: token metadata

5. Rate limit counters (60 sec)
   key: ratelimit:{clientIp}:{endpoint}
   value: request count
```

### Invalidation Strategy
```
When user updates blocked apps:
1. DELETE key: blocked:{userId}
2. Publish to channel: updates:{userId}
3. Extension subscribes and refetches
4. Mobile app polls (next sync)
```

---

## Error Handling

### Standard Error Response
```json
{
  "timestamp": "2024-04-27T10:30:00Z",
  "status": 400,
  "error": "BAD_REQUEST",
  "message": "Validation failed",
  "errors": [
    {
      "field": "email",
      "message": "Invalid email format"
    }
  ],
  "path": "/api/goals"
}
```

### Error Codes
```
200 OK              Successful request
201 Created         Resource created
204 No Content      Successful (no body)
400 Bad Request     Validation error
401 Unauthorized    Invalid/missing token
403 Forbidden       Insufficient permissions
404 Not Found       Resource not found
409 Conflict        Resource already exists
429 Too Many        Rate limit exceeded
500 Server Error    Internal error
502 Bad Gateway     Backend unavailable
503 Service Unavailable  Maintenance/overloaded
```

---

## Performance Optimization

### Backend
- **Database Indexing:** User ID, email, goal ID
- **Query Optimization:** N+1 query prevention
- **Caching:** Redis for frequently accessed data
- **Pagination:** 50 items default, max 500
- **Compression:** Gzip for responses > 1KB

### Frontend
- **Code Splitting:** Lazy load pages/components
- **Tree Shaking:** Remove unused code
- **Image Optimization:** WebP, lazy loading
- **Bundle Analysis:** Webpack Bundle Analyzer
- **Performance Monitoring:** Web Vitals tracking

### Mobile
- **Offline First:** Local caching before sync
- **Pagination:** Load data on demand
- **Image Caching:** HTTP cache headers
- **Background Sync:** WorkManager/Background Task API
- **Memory Management:** Dispose streams/listeners

---

## Monitoring & Logging

### Metrics Collected
```
Backend:
- Request latency (p50, p95, p99)
- Error rates (4xx, 5xx)
- Database query time
- Cache hit/miss ratio
- Active connections

Frontend:
- Page load time
- Time to interactive (TTI)
- Layout shift (CLS)
- Largest contentful paint (LCP)
- First input delay (FID)
```

### Log Levels
```
DEBUG   - Detailed trace info (development only)
INFO    - General application events
WARN    - Warning conditions (may impact service)
ERROR   - Error events (service degradation)
FATAL   - Fatal events (service unavailable)
```

### Log Aggregation
```
ELK Stack (optional):
├── Elasticsearch (indexing)
├── Logstash (processing)
└── Kibana (visualization)

Or: Datadog, New Relic, CloudWatch
```

---

## Scalability

### Horizontal Scaling
```
Load Balancer (HAProxy/AWS ALB)
    │
    ├── Spring Boot Backend #1
    ├── Spring Boot Backend #2
    ├── Spring Boot Backend #3
    └── Spring Boot Backend #N
    
All backends share:
├── PostgreSQL (master-replica)
├── Redis Cluster
└── Shared file storage (S3)
```

### Database Scaling
```
PostgreSQL:
├── Write: Master
├── Read: Replicas (x3+)
└── Failover: Automatic (via Patroni)

Redis:
├── Cluster mode: Horizontal sharding
├── Sentinel: High availability
└── Replication: Master-slave
```

---

## Testing Strategy

### Unit Tests
```
Backend:
- Service layer: Business logic
- Controller layer: Input validation
- Repository: Query tests
- Utility: Helper functions
- Coverage: 80%+ per module

Frontend:
- Components: React Testing Library
- Hooks: Vitest
- Utils: Pure functions
- Coverage: 80%+ per module
```

### Integration Tests
```
Backend:
- API endpoints (REST Assured)
- Database operations (TestContainers)
- Authentication flows
- Error scenarios

Frontend:
- API integration (mock backends)
- Navigation flows
- User interactions
```

### E2E Tests
```
- Full user workflows (Playwright/Cypress)
- Cross-browser testing (Chrome, Firefox, Safari)
- Mobile testing (iOS, Android)
- Performance testing (Lighthouse)
```

---

## Development Workflow

### Feature Development
```
1. Create feature branch from main
2. Set up local environment (docker-compose up)
3. Develop with hot reload (backend, frontend)
4. Write tests (unit + integration)
5. Run local tests (all pass)
6. Commit with conventional messages
7. Push to GitHub
8. Create PR with description
9. GitHub Actions runs automated tests
10. Code review by maintainers
11. Merge to main (auto-deploy to staging)
12. Manual test in staging
13. Merge to release (auto-deploy to production)
```

### Release Process
```
1. Bump version (semantic versioning)
2. Update CHANGELOG
3. Tag release on GitHub
4. GitHub Actions builds & pushes images
5. Deploy to production
6. Monitor error rates & metrics
7. Rollback if needed (re-tag previous version)
```

---

## Disaster Recovery

### Backup Strategy
```
PostgreSQL:
- Daily full backups (AWS RDS)
- WAL archiving (continuous)
- Point-in-time recovery (30 days)

Redis:
- RDB snapshots (hourly)
- AOF persistence (real-time)
- Cross-region replication
```

### Failover & Recovery
```
Database Failover:
1. Health check detects master down
2. Automatic promotion of replica
3. Application reconnects (retry logic)
4. ~30 seconds RTO, ~0 RPO

Application Failover:
1. Load balancer removes failed instance
2. Traffic redirected to healthy instances
3. New instance auto-scales up
4. ~10 seconds RTO
```

---

## Future Architecture Considerations

### Phase 3+
- 📱 **Offline-First Architecture:** Sync Engine improvements
- 🤖 **ML Pipeline:** Recommendation engine (separate service)
- 📊 **Analytics Service:** BigQuery/ClickHouse
- 🔔 **Real-time Notifications:** Firebase Cloud Messaging
- 🌐 **API Gateway:** Kong/Nginx for rate limiting, auth
- 🗂️ **Microservices:** If needed (user, goals, analytics services)

---

## Glossary

- **JWT:** JSON Web Token for stateless authentication
- **RBAC:** Role-Based Access Control
- **RTO:** Recovery Time Objective
- **RPO:** Recovery Point Objective
- **CDN:** Content Delivery Network
- **P99:** 99th percentile latency
- **DNR:** Declarative Net Request API (Chrome)
- **MVVM:** Model-View-ViewModel architecture
- **CRUD:** Create, Read, Update, Delete operations

---

## References

- [Spring Boot Docs](https://spring.io/projects/spring-boot)
- [React Docs](https://react.dev)
- [PostgreSQL Docs](https://www.postgresql.org/docs/)
- [Chrome Extension Docs](https://developer.chrome.com/docs/extensions/)
- [iOS App Dev](https://developer.apple.com/ios)
- [Android App Dev](https://developer.android.com/)

---

**This architecture evolves with the project. Feedback welcome!**
