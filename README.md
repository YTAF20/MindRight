# 🧠 MindRight — Production-Ready Digital Wellness Platform# 🧠 MindRight — Digital Wellness Platform



A **complete, local-first, production-grade** full-stack application for digital wellness. Clone from GitHub, run one command, and everything works locally.A full-stack mental wellness web application with a companion Chrome extension for website blocking and screen time management. Built as part of **CMPE 133 — Software Engineering II** at **San José State University**.



> **Philosophy:** Everything works out-of-the-box. No environment variable hunting. No broken installs. Just code.## 🎯 Overview



---MindRight helps users take control of their digital habits by combining a **Spring Boot web dashboard** with a **Chrome extension** that blocks distracting websites. Users can set goals, track screen time, and manage blocked sites — all from a single platform.



## 🚀 Quick Start (60 Seconds)## ✨ Features



### Prerequisites### Web Application

- **Docker Desktop** ([Download](https://www.docker.com/products/docker-desktop))- **User Authentication** — Secure registration and login system

- **Java 21+** ([Download](https://www.oracle.com/java/technologies/downloads/))- **Dashboard** — Personalized overview of goals, screen time, and blocked apps

- **Node.js 18+** ([Download](https://nodejs.org/))- **Goal Setting** — Create and track personal wellness goals

- **Git**- **Screen Time Tracking** — Monitor daily usage patterns

- **Blocked Site Management** — Add/remove websites to block list via the dashboard

### 1. Clone

```bash### Chrome Extension

git clone https://github.com/YTAF20/MindRight.git- **Website Blocker** — Blocks distracting sites using Chrome's Declarative Net Request API

cd MindRight- **Popup Interface** — Quick access to manage blocked sites from the toolbar

```- **Sync with Backend** — Blocked sites sync between the extension and web app

- **Manifest V3** — Built on the latest Chrome extension standard

### 2. Run Setup

```bash## 🏗️ Architecture

chmod +x scripts/setup.sh

./scripts/setup.sh```

```MindRight/

├── src/main/java/com/mindright/

### 3. Open Your Browser│   ├── config/                    # Spring Security & app config

```│   ├── controller/

Web Dashboard:    http://localhost:5173│   │   ├── HomeController.java    # Landing page routes

Backend API:      http://localhost:8080│   │   ├── DashboardController.java

```│   │   ├── UserController.java    # Auth endpoints

│   │   ├── GoalController.java    # Wellness goals CRUD

**That's it.** Everything is running. ✨│   │   ├── ScreenTimeController.java

│   │   └── BlockedAppController.java

---│   ├── model/

│   │   ├── User.java              # User entity with roles

## 📦 What's Included│   │   ├── Goal.java              # Wellness goals

│   │   ├── ScreenTimeLog.java     # Usage tracking

### ✅ Backend API│   │   ├── BlockedApp.java        # Blocked websites

- **Tech:** Spring Boot 3.3, Java 21, Spring Security, JPA/Hibernate│   │   └── Role.java              # User roles

- **Database:** PostgreSQL (containerized)│   ├── repository/                # JPA repositories

- **Cache:** Redis (containerized)│   └── service/                   # Business logic layer

- **Location:** `apps/backend/`├── manifest.json                  # Chrome Extension (Manifest V3)

- **Status:** Production-ready REST API├── background.js                  # Extension service worker

├── popup.html / popup.js          # Extension popup UI

### ✅ Web Dashboard├── rules.json                     # Declarative net request rules

- **Tech:** React 18, TypeScript, TailwindCSS, Vite└── pom.xml                        # Maven dependencies

- **Features:** Dashboard, goal tracking, screen time analytics, blocked apps management```

- **Location:** `apps/web/`

- **Status:** Fully functional## 🛠️ Tech Stack



### ✅ Chrome Extension| Layer | Technology |

- **Tech:** Manifest V3, Declarative Net Request API|-------|-----------|

- **Features:** Website blocking, real-time sync, popup interface| **Backend** | Java 21, Spring Boot 3.3, Spring Data JPA, Spring Security |

- **Location:** `apps/extension/`| **Database** | MySQL / H2 (configurable) |

- **Status:** Production-ready| **Frontend** | Thymeleaf templates, HTML/CSS, JavaScript |

| **Extension** | Chrome Manifest V3, Declarative Net Request API |

### ✅ iOS App| **Build** | Maven |

- **Tech:** Swift, SwiftUI, URLSession

- **Features:** Native experience, local sync, widgets, notifications## �� Getting Started

- **Location:** `apps/ios/`

- **Status:** Ready for App Store### Prerequisites

- Java 21+

### ✅ Android App- Maven 3.8+

- **Tech:** Kotlin, Jetpack Compose, Retrofit, Room- MySQL (or use embedded H2)

- **Features:** Material Design 3, local sync, widgets, notifications- Google Chrome (for the extension)

- **Location:** `apps/android/`

- **Status:** Ready for Play Store### Run the Web Application

```bash

---git clone https://github.com/YTAF20/MindRight.git

cd MindRight

## 📂 Project Structuremvn spring-boot:run

```

```Visit `http://localhost:8080`

MindRight/

├── apps/### Load the Chrome Extension

│   ├── backend/               # Spring Boot REST API1. Open Chrome → `chrome://extensions/`

│   │   ├── src/2. Enable **Developer Mode**

│   │   ├── pom.xml           # Maven configuration3. Click **"Load unpacked"**

│   │   └── mvnw              # Maven wrapper4. Select the MindRight project root folder

│   ├── web/                   # React dashboard5. The MindRight icon appears in your toolbar

│   │   ├── src/

│   │   ├── package.json## 👥 Team

│   │   └── vite.config.ts

│   ├── extension/             # Chrome extensionBuilt by SJSU Software Engineering students for CMPE 133:

│   │   ├── manifest.json

│   │   ├── popup.html- **Aman Imran** — [aman.imran@sjsu.edu](mailto:aman.imran@sjsu.edu) | [Portfolio](https://aman-portfolio-green.vercel.app/)

│   │   ├── popup.js- Team collaborators

│   │   ├── background.js

│   │   └── rules.json## 📄 License

│   ├── ios/                   # Swift/SwiftUI app

│   │   └── MindRight.xcodeprojThis project is open source and available for educational purposes.

│   └── android/               # Kotlin/Compose app
│       └── MindRight/
├── infrastructure/
│   ├── docker/                # Docker configs
│   └── ci-cd/                 # GitHub Actions workflows
├── scripts/
│   ├── setup.sh              # One-command setup
│   ├── stop.sh               # Shutdown services
│   └── logs/                 # Service logs
├── docker-compose.yml         # PostgreSQL + Redis
└── README.md                 # This file
```

---

## 🔧 Development

### Start Everything
```bash
./scripts/setup.sh
```

### Start Individual Services

**Backend Only:**
```bash
cd apps/backend
./mvnw spring-boot:run
```

**Web Dashboard Only:**
```bash
cd apps/web
npm install
npm run dev
```

**Chrome Extension:**
1. Open `chrome://extensions/`
2. Enable Developer Mode
3. Click "Load unpacked"
4. Select `apps/extension/`

**iOS App:**
```bash
cd apps/ios
open MindRight.xcodeproj
# Build & run in Xcode
```

**Android App:**
```bash
cd apps/android
# Open in Android Studio and run
```

### View Logs
```bash
# Backend
tail -f logs/backend.log

# Web
tail -f logs/web.log

# Docker
docker-compose logs -f
```

### Stop All Services
```bash
./scripts/stop.sh
```

---

## 🌐 Service URLs

| Service | URL | Purpose |
|---------|-----|---------|
| Web Dashboard | `http://localhost:5173` | Main UI |
| Backend API | `http://localhost:8080` | REST API |
| PostgreSQL | `localhost:5432` | Database |
| Redis | `localhost:6379` | Cache |

---

## 🔐 Default Credentials (Development Only)

**Database:**
- Username: `mindright`
- Password: `mindright_local_dev`
- Database: `mindright`

> ⚠️ Change these immediately for production!

---

## 📚 API Documentation

### Authentication

```bash
# Register
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"user@example.com","password":"password123"}'

# Login
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"user@example.com","password":"password123"}'
```

### Wellness Goals

```bash
# Get all goals
curl -H "Authorization: Bearer TOKEN" \
  http://localhost:8080/api/goals

# Create goal
curl -X POST http://localhost:8080/api/goals \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"title":"Reduce Screen Time","description":"Limit to 4 hours/day"}'
```

### Screen Time Tracking

```bash
# Log screen time
curl -X POST http://localhost:8080/api/screen-time \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"duration":120,"category":"social-media"}'

# Get screen time stats
curl -H "Authorization: Bearer TOKEN" \
  http://localhost:8080/api/screen-time/stats
```

### Blocked Apps

```bash
# Get blocked apps
curl -H "Authorization: Bearer TOKEN" \
  http://localhost:8080/api/blocked-apps

# Add blocked app
curl -X POST http://localhost:8080/api/blocked-apps \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"url":"facebook.com","reason":"Distraction"}'
```

See `docs/API.md` for complete API reference.

---

## 🚀 Deploying to Production

### Backend Deployment

Supports: Heroku, Railway, AWS, Azure, DigitalOcean

**Example: Railway**
```bash
# Install Railway CLI
brew install railway

# Login
railway login

# Deploy
railway link
railway up
```

**Environment Variables:**
```env
DB_URL=postgresql://user:pass@host:5432/mindright
DB_USER=mindright
DB_PASSWORD=secure-password
JWT_SECRET=your-jwt-secret-key
REDIS_URL=redis://host:6379
```

### Web Dashboard Deployment

**Vercel (Recommended):**
```bash
cd apps/web
npm run build
# Connect to Vercel via CLI or GitHub
```

**Netlify:**
```bash
# Deploy directly from GitHub
# Build: npm run build
# Publish: dist/
```

### Mobile Apps

**iOS:** Follow Apple App Store submission guidelines
**Android:** Follow Google Play Store submission guidelines

See `DEPLOYMENT.md` for detailed platform-specific instructions.

---

## 🧪 Testing

### Backend Tests
```bash
cd apps/backend
./mvnw test
```

### Web Tests
```bash
cd apps/web
npm run test
npm run type-check
```

### E2E Tests
```bash
cd apps/web
npm run test:e2e
```

---

## 🔒 Security

### ✅ Implemented
- JWT authentication
- Spring Security
- HTTPS/TLS ready
- CORS configuration
- SQL injection prevention (JPA)
- XSS protection
- Password hashing (bcrypt)
- Rate limiting

### 📋 Production Checklist
- [ ] Change database password
- [ ] Update JWT secret
- [ ] Enable HTTPS certificates
- [ ] Configure production database
- [ ] Set up Redis authentication
- [ ] Enable request logging
- [ ] Set up monitoring/alerts
- [ ] Run `npm audit` and `./mvnw dependency:check`
- [ ] Enable database backups
- [ ] Configure firewall rules

---

## 🐛 Troubleshooting

### "Port 8080 already in use"
```bash
# Find process using port 8080
lsof -i :8080

# Kill process (macOS/Linux)
kill -9 <PID>
```

### "Docker containers won't start"
```bash
# Check Docker daemon
docker ps

# Restart Docker Desktop and try again
docker-compose down -v
docker-compose up -d
```

### "PostgreSQL connection failed"
```bash
# Check PostgreSQL container
docker-compose ps

# View logs
docker-compose logs postgres

# Restart services
docker-compose restart
```

### "React dev server not starting"
```bash
cd apps/web
rm -rf node_modules package-lock.json
npm install
npm run dev
```

### "Chrome extension not loading"
1. Ensure you're on Chrome/Chromium
2. Go to `chrome://extensions/`
3. Enable "Developer Mode"
4. Click "Load unpacked" and select `apps/extension/`
5. Check console for errors

---

## 📖 Documentation

- **[SETUP.md](./docs/SETUP.md)** — Detailed setup for each platform
- **[DEPLOYMENT.md](./docs/DEPLOYMENT.md)** — Production deployment guide
- **[API.md](./docs/API.md)** — Complete REST API documentation
- **[ARCHITECTURE.md](./docs/ARCHITECTURE.md)** — Technical architecture
- **[CONTRIBUTING.md](./CONTRIBUTING.md)** — How to contribute
- **[SECURITY.md](./docs/SECURITY.md)** — Security best practices

---

## 🤝 Contributing

We welcome contributions! Please:
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

See [CONTRIBUTING.md](./CONTRIBUTING.md) for details.

---

## 📄 License

Open source for educational purposes. See LICENSE file for details.

---

## 💬 Support

- 📖 Check documentation first
- 🔍 Search existing GitHub issues
- 🐛 Open a GitHub issue with error logs
- 💬 Join our community Discord (coming soon)

---

## 🎓 Built By

Originally built as a CMPE 133 (Software Engineering II) project at San José State University.

**Project Contributors:**
- Aman Imran — [Portfolio](https://aman-portfolio-green.vercel.app/)
- And amazing SJSU students 🎓

---

## 🎉 Ready to Go!

```bash
# Clone the repo
git clone https://github.com/YTAF20/MindRight.git

# Enter directory
cd MindRight

# Run everything
./scripts/setup.sh

# Open your browser
# Web: http://localhost:5173
# API: http://localhost:8080
```

**Happy coding! 🚀 You're now running a production-grade, full-stack digital wellness platform locally.**
