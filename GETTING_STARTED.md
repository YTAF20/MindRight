# 🚀 Getting Started with MindRight

## 60-Second Quick Start

```bash
# 1. Clone
git clone https://github.com/YTAF20/MindRight.git
cd MindRight

# 2. Run
chmod +x scripts/setup.sh
./scripts/setup.sh

# 3. Open browser
# Web Dashboard:  http://localhost:5173
# Backend API:    http://localhost:8080
```

Done! Everything is running. ✨

---

## What Just Happened?

The setup script:
1. ✅ Started PostgreSQL in Docker
2. ✅ Started Redis in Docker
3. ✅ Built and started the Spring Boot backend
4. ✅ Built and started the React web dashboard
5. ✅ Printed service URLs and next steps

---

## Before You Start

Make sure you have:
- ✅ Docker Desktop installed ([Download](https://www.docker.com/products/docker-desktop))
- ✅ Java 21+ installed ([Download](https://www.oracle.com/java/technologies/downloads/))
- ✅ Node.js 18+ installed ([Download](https://nodejs.org/))
- ✅ Git installed

---

## Access Your App

### Web Dashboard
**URL:** `http://localhost:5173`

1. Click "Register"
2. Create account with email and password
3. Login
4. Start tracking wellness goals!

### Backend API
**URL:** `http://localhost:8080`

REST API endpoints:
- `POST /api/auth/register` — Create account
- `POST /api/auth/login` — Login
- `GET /api/user/profile` — Get user info
- `POST /api/goals` — Create wellness goal
- `GET /api/goals` — List goals

### Chrome Extension

1. Open `chrome://extensions/`
2. Enable "Developer Mode" (top right)
3. Click "Load unpacked"
4. Select the `apps/extension` folder
5. Extension appears in toolbar
6. Click icon to manage blocked websites

---

## Individual Services

### Just Backend API?
```bash
cd apps/backend
./mvnw spring-boot:run
# Runs on http://localhost:8080
```

### Just Web Dashboard?
```bash
cd apps/web
npm install
npm run dev
# Runs on http://localhost:5173
```

### Just Database & Cache?
```bash
docker-compose up -d
# PostgreSQL: localhost:5432
# Redis: localhost:6379
```

---

## Stop Everything

```bash
./scripts/stop.sh
```

Or manually:
```bash
# Stop all services
docker-compose down

# Kill backend/web processes
killall java node
```

---

## Common Issues

### "Port 8080 in use"
```bash
lsof -i :8080          # Find process
kill -9 <PID>          # Kill it
./scripts/setup.sh     # Try again
```

### "Docker not running"
- Open Docker Desktop
- Wait for it to start
- Try setup again

### "npm modules error"
```bash
cd apps/web
rm -rf node_modules package-lock.json
npm install
npm run dev
```

---

## View Logs

```bash
# Backend logs
tail -f logs/backend.log

# Web dashboard logs
tail -f logs/web.log

# Docker logs
docker-compose logs -f
```

---

## Next Steps

1. **Register and explore** the web dashboard
2. **Load the Chrome extension** from the toolbar
3. **Create wellness goals** to track
4. **Try the API** with curl or Postman
5. **Read** [README.md](./README.md) for full documentation
6. **Deploy to production** using [DEPLOYMENT.md](./DEPLOYMENT.md)

---

## Project Structure

```
MindRight/
├── apps/backend/       # Spring Boot REST API
├── apps/web/           # React dashboard
├── apps/extension/     # Chrome extension
├── apps/ios/           # iOS app (coming soon)
├── apps/android/       # Android app (coming soon)
├── scripts/            # Automation scripts
├── docker-compose.yml  # Local dev environment
└── README.md          # Full documentation
```

---

## Service URLs Reference

| Service | URL | Username | Password |
|---------|-----|----------|----------|
| Web App | `http://localhost:5173` | — | — |
| Backend | `http://localhost:8080` | — | — |
| Database | `localhost:5432` | mindright | mindright_local_dev |
| Cache | `localhost:6379` | — | — |

---

## What's Next?

- **Local Development:** Follow this guide
- **Deployment:** See [DEPLOYMENT.md](./DEPLOYMENT.md)
- **API Docs:** See [docs/API.md](./docs/API.md)
- **Contributing:** See [CONTRIBUTING.md](./CONTRIBUTING.md)

---

## Questions?

1. Check [README.md](./README.md) for full docs
2. Check [DEPLOYMENT.md](./DEPLOYMENT.md) for production setup
3. Open GitHub issue with error logs
4. Join our community (coming soon)

---

**Happy coding! 🚀 You're now running MindRight locally.**
