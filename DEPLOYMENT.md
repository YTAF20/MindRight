# 🚀 MindRight Deployment Guide

This guide covers deploying MindRight to production across all platforms.

---

## Backend Deployment

### Option 1: Railway (Recommended for Beginners)

Railway is the easiest deployment option. One-click setup with PostgreSQL, Redis, and automatic deployments.

1. **Sign up** at [railway.app](https://railway.app)

2. **Install Railway CLI:**
   ```bash
   brew install railway
   ```

3. **Login:**
   ```bash
   railway login
   ```

4. **Deploy from the project root:**
   ```bash
   cd ~/MindRight
   railway link
   railway up
   ```

5. **Set environment variables:**
   ```bash
   railway variables set DB_URL=postgresql://...
   railway variables set JWT_SECRET=your-secret-key
   ```

### Option 2: Heroku

**Prerequisites:**
- Heroku CLI installed
- Heroku account

**Deploy:**
```bash
# Login
heroku login

# Create app
heroku create mindright-app

# Add PostgreSQL
heroku addons:create heroku-postgresql:hobby-dev

# Add Redis
heroku addons:create heroku-redis:premium-0

# Set environment variables
heroku config:set JWT_SECRET=your-secret-key
heroku config:set SPRING_PROFILES_ACTIVE=production

# Deploy backend
cd apps/backend
git push heroku production/complete-stack-local-first:main

# View logs
heroku logs --tail
```

### Option 3: AWS (EC2 + RDS + ElastiCache)

**Prerequisites:**
- AWS account
- AWS CLI configured

**Steps:**
1. Launch EC2 instance (Ubuntu 22.04, t3.medium or larger)
2. Install Java 21, Docker, Maven
3. Create RDS PostgreSQL instance
4. Create ElastiCache Redis cluster
5. Clone the repository
6. Configure `application.properties` with RDS/ElastiCache endpoints
7. Build and run: `./mvnw package && java -jar target/mindright-0.0.1-SNAPSHOT.jar`
8. (Optional) Set up Docker image and push to ECR for auto-scaling

**Environment variables:**
```bash
export SPRING_DATASOURCE_URL=jdbc:postgresql://rds-endpoint:5432/mindright
export SPRING_DATASOURCE_USERNAME=mindright
export SPRING_DATASOURCE_PASSWORD=secure-password
export SPRING_REDIS_HOST=elasticache-endpoint
export JWT_SECRET=your-secret-key
```

### Option 4: DigitalOcean (Droplet + Managed Databases)

**Prerequisites:**
- DigitalOcean account
- doctl CLI installed

**Steps:**
1. Create Droplet (Ubuntu 22.04, 2GB RAM)
2. Create managed PostgreSQL and Redis from control panel
3. SSH into droplet
4. Install Java 21: `sudo apt update && sudo apt install openjdk-21-jdk`
5. Clone repository: `git clone https://github.com/YTAF20/MindRight.git`
6. Configure database credentials
7. Build and run backend

---

## Web Dashboard Deployment

### Option 1: Vercel (Recommended)

1. **Push code to GitHub**

2. **Sign up** at [vercel.com](https://vercel.com)

3. **Import project:**
   - Click "New Project"
   - Select your GitHub repository
   - Root directory: `apps/web`
   - Build command: `npm run build`
   - Output directory: `dist`

4. **Set environment variables:**
   ```
   VITE_API_URL=https://your-backend-domain.com
   ```

5. **Deploy:** Vercel auto-deploys on push to main

### Option 2: Netlify

1. **Sign up** at [netlify.com](https://netlify.com)

2. **Connect GitHub repo**

3. **Configure build settings:**
   - Base directory: `apps/web`
   - Build command: `npm run build`
   - Publish directory: `dist`

4. **Set environment variables:**
   ```
   VITE_API_URL=https://your-backend-domain.com
   ```

5. **Deploy:** Auto-deploys on push

### Option 3: Self-Hosted (VPS/Server)

```bash
cd apps/web

# Build production bundle
npm run build

# Copy to web server
scp -r dist/ user@your-server:/var/www/mindright/

# Configure nginx
# See nginx.conf.example for configuration
```

---

## Chrome Extension Deployment

### Publish to Chrome Web Store

1. **Create developer account** at [chromewebstore.google.com](https://chromewebstore.google.com/)

2. **Prepare extension package:**
   ```bash
   cd apps/extension
   zip -r mindright-extension.zip . -x "node_modules/*" ".git/*"
   ```

3. **Upload to Chrome Web Store:**
   - Go to Developer Dashboard
   - Click "New Item"
   - Upload ZIP file
   - Fill in description, screenshots, etc.
   - Submit for review (24-72 hours)

4. **Update extension:**
   - Increment version in `manifest.json`
   - Rebuild ZIP
   - Upload updated version

---

## iOS App Deployment

### Publish to Apple App Store

1. **Enroll in Apple Developer Program** ($99/year)

2. **Set up certificates & provisioning profiles:**
   - Open Xcode
   - Preferences → Accounts → Add Apple ID
   - Download certificates

3. **Configure app in App Store Connect:**
   - Create new app
   - Fill in app details
   - Set up TestFlight
   - Configure pricing

4. **Build for release:**
   ```bash
   cd apps/ios
   # In Xcode: Product → Archive
   # Organizer → Distribute App
   # Select "App Store Connect"
   ```

5. **Submit for review:**
   - Complete app review information
   - Add release notes
   - Submit for review (Apple reviews in 24-48 hours)

---

## Android App Deployment

### Publish to Google Play Store

1. **Enroll in Google Play Developer Program** ($25 one-time)

2. **Create signing key:**
   ```bash
   keytool -genkey -v -keystore mindright-release.keystore \
     -alias mindright \
     -keyalg RSA -keysize 2048 -validity 10000
   ```

3. **Configure in Android Studio:**
   - Build → Generate Signed Bundle/APK
   - Select Release build type
   - Enter keystore details

4. **Create app on Google Play Console:**
   - New app
   - Fill in store listing
   - Add screenshots, description

5. **Upload release bundle:**
   - Create release
   - Upload AAB (Android App Bundle)
   - Fill in release notes

6. **Rollout:**
   - Start with 10% of users
   - Monitor for crashes
   - Increase to 25%, 50%, 100%

---

## Production Configuration

### Backend `application-production.properties`

```properties
# Database (use environment variables)
spring.datasource.url=${DB_URL}
spring.datasource.username=${DB_USER}
spring.datasource.password=${DB_PASSWORD}

# Redis
spring.redis.host=${REDIS_HOST}
spring.redis.port=${REDIS_PORT}
spring.redis.password=${REDIS_PASSWORD}

# JPA/Hibernate
spring.jpa.hibernate.ddl-auto=validate
spring.jpa.show-sql=false

# Security
spring.security.jwt.secret=${JWT_SECRET}
spring.security.jwt.expiration=86400000

# Logging
logging.level.root=INFO
logging.level.com.mindright=INFO

# CORS
mindright.cors.allowed-origins=${CORS_ALLOWED_ORIGINS}
```

### Environment Variables

```bash
# Database
export DB_URL="postgresql://user:pass@host:5432/mindright"
export DB_USER="mindright"
export DB_PASSWORD="secure-password"

# Redis
export REDIS_HOST="redis-host"
export REDIS_PORT="6379"
export REDIS_PASSWORD="redis-password"

# Security
export JWT_SECRET="random-secret-key-min-32-chars"

# CORS
export CORS_ALLOWED_ORIGINS="https://yourdomain.com,https://www.yourdomain.com"

# Active profile
export SPRING_PROFILES_ACTIVE="production"
```

---

## Monitoring & Logs

### Backend Monitoring

**Recommended tools:**
- Sentry (error tracking)
- Datadog (monitoring)
- New Relic (APM)

**Configure in production:**
```properties
# application-production.properties
spring.devtools.restart.enabled=false
spring.jpa.show-sql=false
```

### Application Logs

**Log to file:**
```bash
# Start with logging
./mvnw spring-boot:run > logs/production.log 2>&1 &
```

**Log rotation (Linux/macOS):**
```bash
# Install logrotate
sudo apt install logrotate

# Configure in /etc/logrotate.d/mindright
```

---

## SSL/HTTPS Certificates

### Using Let's Encrypt (Free)

```bash
# Install certbot
sudo apt install certbot

# Generate certificate
sudo certbot certonly --standalone -d your-domain.com

# Update application.properties
server.ssl.key-store=/etc/letsencrypt/live/your-domain.com/keystore.jks
server.ssl.key-store-password=${SSL_KEYSTORE_PASSWORD}
```

---

## Database Backups

### PostgreSQL Backup

```bash
# Manual backup
pg_dump -U mindright mindright > backup-$(date +%Y%m%d).sql

# Restore
psql -U mindright mindright < backup-20240101.sql

# Automated daily backups (cron)
# 0 2 * * * pg_dump -U mindright mindright > /backups/mindright-$(date +\%Y\%m\%d).sql
```

---

## Scaling for Production

### Horizontal Scaling (Multiple Servers)

1. **Load Balancer** (nginx, HAProxy, AWS ELB)
2. **Multiple Backend Instances**
3. **Shared Database** (RDS, Managed PostgreSQL)
4. **Shared Redis** (ElastiCache, Managed Redis)

### Performance Optimization

- Enable Redis caching
- Use connection pooling (HikariCP)
- Add CDN for static assets
- Enable gzip compression
- Use async processing for heavy tasks

---

## Troubleshooting Deployment

### Backend not starting
```bash
# Check logs
docker logs mindright-backend

# Verify database connection
psql -h host -U mindright -d mindright -c "SELECT 1;"

# Check environment variables
env | grep -i mindright
```

### High memory usage
```bash
# Increase JVM heap
export JAVA_OPTS="-Xms512m -Xmx2048m"
```

### Database connection timeout
```bash
# Increase connection pool size
spring.datasource.hikari.maximum-pool-size=20
```

---

## Support

For deployment issues:
1. Check logs first
2. Verify all environment variables are set
3. Ensure database is reachable
4. Check firewall rules
5. Open GitHub issue with error logs

Happy deploying! 🚀
