# 🧠 MindRight — Digital Wellness Platform

A full-stack mental wellness web application with a companion Chrome extension for website blocking and screen time management. Built as part of **CMPE 133 — Software Engineering II** at **San José State University**.

## 🎯 Overview

MindRight helps users take control of their digital habits by combining a **Spring Boot web dashboard** with a **Chrome extension** that blocks distracting websites. Users can set goals, track screen time, and manage blocked sites — all from a single platform.

## ✨ Features

### Web Application
- **User Authentication** — Secure registration and login system
- **Dashboard** — Personalized overview of goals, screen time, and blocked apps
- **Goal Setting** — Create and track personal wellness goals
- **Screen Time Tracking** — Monitor daily usage patterns
- **Blocked Site Management** — Add/remove websites to block list via the dashboard

### Chrome Extension
- **Website Blocker** — Blocks distracting sites using Chrome's Declarative Net Request API
- **Popup Interface** — Quick access to manage blocked sites from the toolbar
- **Sync with Backend** — Blocked sites sync between the extension and web app
- **Manifest V3** — Built on the latest Chrome extension standard

## 🏗️ Architecture

```
MindRight/
├── src/main/java/com/mindright/
│   ├── config/                    # Spring Security & app config
│   ├── controller/
│   │   ├── HomeController.java    # Landing page routes
│   │   ├── DashboardController.java
│   │   ├── UserController.java    # Auth endpoints
│   │   ├── GoalController.java    # Wellness goals CRUD
│   │   ├── ScreenTimeController.java
│   │   └── BlockedAppController.java
│   ├── model/
│   │   ├── User.java              # User entity with roles
│   │   ├── Goal.java              # Wellness goals
│   │   ├── ScreenTimeLog.java     # Usage tracking
│   │   ├── BlockedApp.java        # Blocked websites
│   │   └── Role.java              # User roles
│   ├── repository/                # JPA repositories
│   └── service/                   # Business logic layer
├── manifest.json                  # Chrome Extension (Manifest V3)
├── background.js                  # Extension service worker
├── popup.html / popup.js          # Extension popup UI
├── rules.json                     # Declarative net request rules
└── pom.xml                        # Maven dependencies
```

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Backend** | Java 21, Spring Boot 3.3, Spring Data JPA, Spring Security |
| **Database** | MySQL / H2 (configurable) |
| **Frontend** | Thymeleaf templates, HTML/CSS, JavaScript |
| **Extension** | Chrome Manifest V3, Declarative Net Request API |
| **Build** | Maven |

## �� Getting Started

### Prerequisites
- Java 21+
- Maven 3.8+
- MySQL (or use embedded H2)
- Google Chrome (for the extension)

### Run the Web Application
```bash
git clone https://github.com/YTAF20/MindRight.git
cd MindRight
mvn spring-boot:run
```
Visit `http://localhost:8080`

### Load the Chrome Extension
1. Open Chrome → `chrome://extensions/`
2. Enable **Developer Mode**
3. Click **"Load unpacked"**
4. Select the MindRight project root folder
5. The MindRight icon appears in your toolbar

## 👥 Team

Built by SJSU Software Engineering students for CMPE 133:

- **Aman Imran** — [aman.imran@sjsu.edu](mailto:aman.imran@sjsu.edu) | [Portfolio](https://aman-portfolio-green.vercel.app/)
- Team collaborators

## 📄 License

This project is open source and available for educational purposes.
