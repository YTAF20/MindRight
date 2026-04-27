# 🤝 Contributing to MindRight

Thank you for wanting to contribute to MindRight! This guide will help you get started and ensure your contribution follows our standards.

---

## Code of Conduct

- Be respectful and inclusive
- Welcome all skill levels
- No harassment or discrimination
- Report issues privately to maintainers

---

## Getting Started

### 1. Fork & Clone

```bash
# Fork on GitHub, then:
git clone https://github.com/YOUR_USERNAME/MindRight.git
cd MindRight
git remote add upstream https://github.com/YTAF20/MindRight.git
```

### 2. Create a Branch

```bash
# Always branch from main
git checkout -b feature/your-feature-name
# or
git checkout -b fix/your-bug-fix
```

### 3. Set Up Local Environment

```bash
# One-command setup
./scripts/setup.sh

# Or setup individual services
# Backend:
cd apps/backend && ./mvnw spring-boot:run

# Web:
cd apps/web && npm install && npm run dev

# DB + Cache:
docker-compose up -d
```

---

## Development Workflow

### Backend (Spring Boot)

```bash
cd apps/backend

# Build
./mvnw clean package

# Run tests
./mvnw test

# Run with hot reload
./mvnw spring-boot:run

# Check formatting
./mvnw spotless:check

# Apply formatting
./mvnw spotless:apply
```

**Code Standards:**
- Follow Google Java Style Guide
- Spotless auto-formats on commit (run `mvn spotless:apply`)
- Write unit tests for all features (JUnit 5)
- Minimum 80% code coverage

### Web Dashboard (React)

```bash
cd apps/web

# Install dependencies
npm install

# Development server (with hot reload)
npm run dev

# Build for production
npm run build

# Type check
npm run typecheck

# Lint
npm run lint

# Format
npm run format

# Tests
npm test

# E2E tests
npm run test:e2e
```

**Code Standards:**
- TypeScript strict mode
- ESLint + Prettier enforced
- React best practices (hooks, functional components)
- Write tests for components (Vitest + React Testing Library)
- Minimum 80% coverage

### Chrome Extension

```bash
cd apps/extension

# Build (if using Vite/TypeScript)
npm run build

# Watch mode
npm run dev

# Test in Chrome
1. chrome://extensions/
2. Enable "Developer Mode"
3. "Load unpacked" → select apps/extension folder
```

**Code Standards:**
- Manifest V3 compliant
- No inline scripts (Content Security Policy)
- Declarative Net Request API for blocking
- Clean popup UI (follow design system)

### iOS App (Swift)

```bash
cd apps/ios

# Build
xcodebuild -scheme MindRight build

# Run tests
xcodebuild -scheme MindRight test

# Code formatting
swift format -i -r . --configuration .swift-format
```

**Code Standards:**
- Swift style guide
- MVVM architecture
- SwiftUI for UI
- Local-first data sync with backend
- Minimum iOS 14 support

### Android App (Kotlin)

```bash
cd apps/android

# Build
./gradlew build

# Run tests
./gradlew test

# Check formatting
./gradlew ktlint

# Apply formatting
./gradlew ktlintFormat
```

**Code Standards:**
- Kotlin style guide
- MVVM architecture
- Jetpack Compose for UI
- Local-first data sync with backend
- Minimum SDK 26 (Android 8.0)

---

## Making a Pull Request

### 1. Before You Push

```bash
# Make sure code is formatted
npm run format          # Frontend
./mvnw spotless:apply  # Backend

# Run tests
npm test               # Frontend
./mvnw test           # Backend

# Type check
npm run typecheck     # Frontend (if TypeScript)
```

### 2. Create PR

```bash
# Push your branch
git push origin feature/your-feature-name

# Create PR on GitHub
# Use template (if available)
# Title: "feat: add feature name" or "fix: fix bug description"
# Description: What, Why, How
```

### 3. PR Guidelines

**Title Format:**
- `feat:` — New feature
- `fix:` — Bug fix
- `docs:` — Documentation
- `test:` — Tests
- `refactor:` — Code refactor
- `perf:` — Performance improvement
- `chore:` — Maintenance

**Example:**
```
feat: add goal progress visualization in dashboard

- Add line chart showing goal progress over time
- Display weekly/monthly aggregate stats
- Add export to PDF button
- Update goal model with progress tracking

Fixes #123
Closes #456
```

### 4. Keep PR Updated

```bash
# If main moved ahead:
git fetch upstream
git rebase upstream/main
git push --force-with-lease
```

---

## Code Review Process

1. **Automated Checks:**
   - GitHub Actions (tests, linting, build)
   - Code coverage reports
   - Security scanning

2. **Human Review:**
   - At least 1 maintainer approval required
   - Look for:
     - Code quality & standards
     - Test coverage
     - Documentation
     - Security issues

3. **Merge & Deploy:**
   - Squash & merge to main
   - GitHub Actions deploy to staging
   - Manual test in staging
   - Merge to release branch (auto-deploy production)

---

## Testing Requirements

### Backend

```bash
cd apps/backend

# All tests
./mvnw test

# Specific test class
./mvnw test -Dtest=UserControllerTest

# With coverage
./mvnw clean test jacoco:report
# View: target/site/jacoco/index.html

# Integration tests
./mvnw test -Dgroups=integration
```

### Frontend

```bash
cd apps/web

# All tests
npm test

# Watch mode
npm test -- --watch

# Coverage
npm test -- --coverage

# E2E tests
npm run test:e2e
```

### Minimum Requirements

- ✅ All tests pass locally
- ✅ New code has 80%+ coverage
- ✅ No console errors/warnings
- ✅ No eslint violations
- ✅ TypeScript strict mode passes

---

## Documentation

### Code Comments

```java
/**
 * Calculates daily screen time for a user.
 *
 * @param userId the user ID
 * @param date the date to calculate for
 * @return screen time in minutes
 * @throws UserNotFoundException if user not found
 */
public long calculateDailyScreenTime(String userId, LocalDate date) {
    // implementation
}
```

### Commit Messages

```
feat: add goal progress visualization

This adds a line chart to the goal detail view showing progress
over the selected time period (weekly/monthly). Users can now
export their progress as PDF.

Includes:
- ProgressChart React component
- API endpoint for aggregated stats
- Export to PDF functionality

Tests cover all three new components.
Performance impact: negligible.

Fixes #123
Closes #456
```

### PR Description

```markdown
## Description
What does this PR do?

## Why?
Why is this change needed?

## How?
How was it implemented?

## Testing
How can reviewers test this?

## Checklist
- [ ] Tests added
- [ ] Documentation updated
- [ ] Formatted code (npm/mvn spotless)
- [ ] No console errors
- [ ] Screenshots (if UI change)

Fixes #123
```

---

## File Structure Guidelines

### Backend

```
apps/backend/
├── src/main/java/com/mindright/
│   ├── controller/      # REST endpoints
│   ├── service/         # Business logic
│   ├── repository/      # Data access (JPA)
│   ├── model/           # Entity classes
│   ├── config/          # Configuration
│   ├── exception/       # Custom exceptions
│   └── security/        # Auth/Security
└── src/test/java/...    # Mirror structure
```

### Frontend

```
apps/web/
├── src/
│   ├── components/      # Reusable components
│   ├── pages/          # Page components
│   ├── hooks/          # Custom React hooks
│   ├── services/       # API & business logic
│   ├── types/          # TypeScript types
│   ├── styles/         # TailwindCSS classes
│   ├── utils/          # Utilities
│   └── App.tsx         # Root component
└── tests/              # Mirror structure
```

### Chrome Extension

```
apps/extension/
├── manifest.json       # V3 manifest
├── background.js       # Service worker
├── popup.html          # UI
├── popup.js            # Popup logic
├── rules.json          # DNR rules
└── icons/              # Extension icons
```

---

## Commit Guidelines

### Small Changes
```bash
git add .
git commit -m "fix: correct typo in error message"
git push
```

### Feature Work
```bash
git add src/
git commit -m "feat: add goal progress tracking

- Add ProgressLog model
- Add ProgressService with daily aggregation
- Add /api/goals/{id}/progress endpoint

Tests included for all new methods."

git push
```

### Multi-File Refactor
```bash
# Separate logical changes
git add src/main/java/security/
git commit -m "refactor: improve JWT token validation

- Extract token parsing to separate method
- Add unit tests for validation logic
- Reduce cyclomatic complexity of validateToken()"

git add src/test/java/security/
git commit -m "test: add JWT validation test suite"

git push
```

---

## Common Issues & Solutions

### Issue: Tests failing locally but passing on CI

**Solution:**
```bash
# Clear cache & reinstall
rm -rf ~/.m2/repository  # Maven
rm -rf node_modules     # NPM
npm install
./mvnw clean test
```

### Issue: Port 8080 already in use

**Solution:**
```bash
lsof -i :8080
kill -9 <PID>
./scripts/setup.sh
```

### Issue: TypeScript errors after merge

**Solution:**
```bash
cd apps/web
npm install
npm run typecheck
```

### Issue: Docker container won't start

**Solution:**
```bash
# Stop all and clean
docker-compose down -v
# Remove images
docker system prune -f
# Start fresh
docker-compose up -d
```

---

## Getting Help

1. **Check existing issues:** https://github.com/YTAF20/MindRight/issues
2. **Search discussions:** https://github.com/YTAF20/MindRight/discussions
3. **Ask in PR comments:** Maintainers check PRs frequently
4. **Email maintainers:** [contact info]

---

## Recognition

We recognize all contributors in:
- `CONTRIBUTORS.md` file
- GitHub releases notes
- Project README

---

## What We're Looking For

### High Priority
- 🔴 Security fixes
- 🟠 Critical bug fixes
- 🟡 Performance improvements
- 🟡 Mobile app improvements (iOS/Android)

### Always Welcome
- 🟢 Documentation improvements
- 🟢 New features (with issue discussion first)
- 🟢 Test coverage
- 🟢 Refactoring
- 🟢 UI/UX improvements

---

## Development Roadmap

### Phase 2 (Next)
- ✅ Complete React web dashboard
- ✅ iOS app MVP
- ✅ Android app MVP
- ✅ GitHub Actions CI/CD

### Phase 3
- 📱 Mobile push notifications
- 📱 Offline-first sync
- 🔐 Advanced security features
- 📊 Analytics dashboard

### Phase 4
- 🤖 AI-powered wellness recommendations
- 👥 Social features (sharing, challenges)
- 🌐 Multi-language support
- 📈 Advanced reporting

Interested in any of these? Open an issue to discuss!

---

## License

By contributing, you agree that your contributions will be licensed under the project's license (see LICENSE file).

---

**Thanks for contributing! Let's build MindRight together! 🚀**
