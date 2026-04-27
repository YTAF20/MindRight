# 🔒 Security Policy for MindRight

## Security Overview

MindRight is built with security as a first-class concern. This document outlines our security practices, policies, and how to report vulnerabilities.

---

## Reporting Security Vulnerabilities

### Do NOT Create Public Issues

If you discover a security vulnerability, **please do not create a public GitHub issue**. Instead:

1. **Email:** security@mindright.app (private channel)
2. **Subject:** `[SECURITY] Vulnerability Report`
3. **Include:**
   - Type of vulnerability
   - Location in code
   - Steps to reproduce
   - Potential impact
   - Your suggested fix (if any)

### Response Timeline

- **Acknowledgment:** Within 24 hours
- **Initial assessment:** Within 3 days
- **Fix release:** Within 14 days (critical), 30 days (high), 90 days (medium/low)
- **Public disclosure:** After patch is released

### Responsible Disclosure

We appreciate responsible security researchers who:
- Give us time to fix issues before public disclosure
- Don't exploit vulnerabilities beyond what's necessary to demonstrate
- Don't access user data or disrupt service
- Follow coordinated disclosure practices

Thank you for helping keep MindRight secure! 🙏

---

## Security Architecture

### Authentication

#### Password Security
- **Algorithm:** bcrypt with cost factor 10
- **Minimum:** 8 characters, mixed case, numbers, symbols recommended
- **Storage:** Never stored in plaintext; only bcrypt hash stored
- **Transmission:** Always over HTTPS/TLS 1.3+

#### JWT Tokens
- **Algorithm:** HS256 (HMAC SHA-256)
- **Secret:** 256-bit random key, rotated quarterly
- **Access Token TTL:** 15 minutes
- **Refresh Token TTL:** 7 days
- **Claims:** `sub` (user ID), `email`, `roles`, `iat`, `exp`

#### Token Revocation
- **Implementation:** Redis blacklist
- **On Logout:** Token added to blacklist with TTL = remaining expiry
- **Check:** Before each authenticated request

#### Multi-Factor Authentication (Future)
- **Phase 3:** TOTP (Google Authenticator)
- **Phase 4:** WebAuthn (biometric/FIDO2)

---

### Authorization

#### Role-Based Access Control (RBAC)

```
Roles:
├── USER (default)
│   ├── View own profile
│   ├── Create/edit own goals
│   ├── View own screen time
│   └── Manage own blocked apps
│
└── ADMIN
    ├── All USER permissions
    ├── View any user's data (for support)
    ├── Disable user accounts
    ├── View audit logs
    └── Modify global settings
```

#### Authorization Checks
- **Method:** Spring Security @PreAuthorize annotations
- **Every endpoint** checks user authorization
- **Cross-user access:** Denied with 403 Forbidden
- **Example:**
  ```java
  @PreAuthorize("@authService.isUserOwner(#userId)")
  @GetMapping("/users/{userId}/goals")
  public ResponseEntity<?> getUserGoals(@PathVariable String userId) { ... }
  ```

---

### Data Protection

#### In Transit
- **Protocol:** HTTPS/TLS 1.3+ (minimum)
- **Certificate:** Let's Encrypt (auto-renewal)
- **HSTS:** Enabled (1 year, includeSubdomains)
- **CORS:** Strict origin whitelist
- **CSP:** Content Security Policy headers

#### At Rest
- **Database Encryption:** PostgreSQL TDE (Transparent Data Encryption)
- **Passwords:** bcrypt-hashed never stored plaintext
- **Sensitive Data:** Encrypted fields (PII, payment info)
- **Backups:** Encrypted with AES-256
- **Logs:** Sensitive data redacted (no passwords, tokens, emails in debug logs)

#### Data Retention
- **User Data:** Kept while account active
- **Deleted Accounts:** Purged within 30 days
- **Logs:** Retained for 90 days, then deleted
- **Backups:** Kept for 30 days, then deleted

---

### Input Validation & Sanitization

#### Server-Side Validation
```java
@Entity
public class User {
  @Email(message = "Invalid email format")
  @Column(unique = true, nullable = false)
  private String email;
  
  @Size(min = 8, max = 128)
  @Pattern(regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).+$")
  private String password;
  
  @Size(min = 1, max = 50)
  private String firstName;
}
```

#### SQL Injection Prevention
- **Parameterized Queries:** All JPA/Hibernate queries use parameters
- **No String Concatenation:** Never build SQL strings
- **ORM Layer:** All database access through Spring Data JPA

#### XSS Prevention
- **Input Encoding:** Output properly encoded
- **CSP Headers:** Restrict script sources
- **Frontend:** React automatically escapes JSX
- **No Dangerous APIs:** No innerHTML, eval(), dangerouslySetInnerHTML

#### CSRF Prevention
- **Token Validation:** SameSite=Strict cookies
- **POST/PUT/DELETE:** CSRF token required
- **State-Changing GET:** Not allowed

---

### API Security

#### Rate Limiting
```
Per User:
├── Authentication: 5 requests/minute
├── Standard endpoints: 100 requests/minute
├── Search: 30 requests/minute
└── Upload: 10 requests/minute

Per IP (unauthenticated):
├── Registration: 5 requests/hour
├── Login: 10 requests/hour
└── Password reset: 3 requests/hour
```

#### Request Size Limits
- **JSON Body:** Max 10 MB
- **File Upload:** Max 100 MB
- **URL:** Max 2 KB

#### Response Security
```
Headers:
├── X-Content-Type-Options: nosniff
├── X-Frame-Options: DENY
├── X-XSS-Protection: 1; mode=block
├── Strict-Transport-Security: max-age=31536000; includeSubDomains
├── Content-Security-Policy: strict policy
└── Referrer-Policy: strict-origin-when-cross-origin
```

---

### Backend Security

#### Spring Security Configuration
```java
@Configuration
@EnableWebSecurity
public class SecurityConfig {
  
  @Bean
  public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
    http
      .cors(cors -> cors.configurationSource(corsConfigurationSource()))
      .csrf(csrf -> csrf.csrfTokenRepository(CookieCsrfTokenRepository.withHttpOnlyFalse()))
      .authorizeHttpRequests(auth -> auth
        .requestMatchers("/api/auth/**").permitAll()
        .requestMatchers("/api/docs/**").permitAll()
        .anyRequest().authenticated()
      )
      .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
      .exceptionHandling(handler -> handler
        .authenticationEntryPoint((req, res, ex) -> res.sendError(401))
        .accessDeniedHandler((req, res, ex) -> res.sendError(403))
      );
    
    return http.build();
  }
  
  @Bean
  public PasswordEncoder passwordEncoder() {
    return new BCryptPasswordEncoder(10);
  }
}
```

#### Dependency Security
- **Maven Plugins:**
  - OWASP Dependency-Check
  - Snyk security scanner
  - GitHub Dependabot
- **Update Schedule:** Weekly
- **Critical Fixes:** Immediate
- **Testing:** All updates tested before merge

#### Code Security
- **Static Analysis:** SonarQube (weekly)
- **Vulnerability Scanning:** Snyk (continuous)
- **Code Review:** At least 1 maintainer approval
- **Secrets Scanning:** GitGuardian (prevent leaked credentials)

---

### Frontend Security

#### Dependencies
```json
{
  "dependencies": {
    "react": "latest",
    "typescript": "strict",
    "axios": "latest"
  },
  "devDependencies": {
    "eslint": "with security rules",
    "snyk": "for vulnerability scanning"
  }
}
```

#### Environment Secrets
- **API Key:** Never in code; use environment variables
- **Tokens:** Stored in httpOnly cookies (not localStorage)
- **CSP:** Strict policy prevents inline scripts

#### Build Security
- **Minification:** Reduces code size & obfuscates
- **Tree Shaking:** Removes unused code
- **No Source Maps:** In production builds

---

### Chrome Extension Security

#### Manifest V3 Compliance
```json
{
  "manifest_version": 3,
  "content_security_policy": {
    "extension_pages": "script-src 'self'; object-src 'self'"
  },
  "permissions": [
    "declarativeNetRequest",
    "storage",
    "webRequest",
    "tabs"
  ],
  "host_permissions": []
}
```

#### No Dangerous APIs
- ❌ No `eval()`
- ❌ No `Function()`
- ❌ No inline scripts
- ✅ Only external scripts with nonce

#### Data Storage
- **Local Rules:** `chrome.storage.local` (encrypted by browser)
- **Sync Rules:** `chrome.storage.sync` (encrypted by Google)
- **Never:** Store passwords, tokens in extension

---

### Mobile Security (iOS & Android)

#### iOS Security
```swift
// Keychain for sensitive data
class KeychainManager {
  static func save(_ value: String, forKey key: String) {
    let query: [String: Any] = [
      kSecClass as String: kSecClassGenericPassword,
      kSecAttrAccount as String: key,
      kSecValueData as String: value.data(using: .utf8)!
    ]
    SecItemAdd(query as CFDictionary, nil)
  }
}

// HTTPS only
let config = URLSessionConfiguration.default
config.waitsForConnectivity = true
config.tlsMinimumSupportedProtocolVersion = .TLSv13
```

#### Android Security
```kotlin
// Encrypted SharedPreferences
val encryptedSharedPreferences = EncryptedSharedPreferences.create(
  context,
  "secret_shared_prefs",
  MasterKey.Builder(context).setKeyScheme(MasterKey.KeyScheme.AES256_GCM).build(),
  EncryptedSharedPreferences.PrefKeyEncryptionScheme.AES256_SIV,
  EncryptedSharedPreferences.PrefValueEncryptionScheme.AES256_GCM
)

// Network security configuration
<!-- res/xml/network_security_config.xml -->
<domain-config cleartextTrafficPermitted="false">
  <domain includeSubdomains="true">api.mindright.app</domain>
</domain-config>
```

---

## Security Checklist

### Pre-Deployment
- [ ] All tests pass (unit, integration, E2E)
- [ ] No security warnings from static analysis
- [ ] No high/critical vulnerabilities in dependencies
- [ ] Security code review completed
- [ ] OWASP Top 10 checked
- [ ] Performance testing (no DoS vulnerabilities)
- [ ] Penetration testing (quarterly)

### Ongoing
- [ ] Dependency updates applied weekly
- [ ] Security patches applied immediately
- [ ] Audit logs reviewed daily
- [ ] Error monitoring checked (Sentry/DataDog)
- [ ] Uptime monitoring active (99.9% SLA)

### Annual
- [ ] Full security audit
- [ ] Penetration testing
- [ ] Disaster recovery drill
- [ ] Policy review and updates

---

## Compliance & Standards

### Standards We Follow
- **OWASP Top 10:** All mitigations in place
- **NIST Cybersecurity Framework:** Core practices implemented
- **CWE Top 25:** Most critical issues addressed
- **ISO 27001:** Roadmap for certification

### Privacy & Data Protection
- **GDPR:** Full compliance
  - Data access requests: 30 days
  - Deletion requests: 30 days
  - Privacy policy: Updated annually
- **CCPA:** Full compliance (California users)
- **Data Processing Agreement:** Available upon request

### Certifications (Future)
- [ ] ISO 27001 (2024)
- [ ] SOC 2 Type II (2024)
- [ ] HIPAA (2025)

---

## Security Incident Response

### Response Plan
```
1. Detection (automated alerts)
   ↓
2. Containment (disable affected service)
   ↓
3. Investigation (root cause analysis)
   ↓
4. Notification (affected users within 24h)
   ↓
5. Remediation (fix and deploy)
   ↓
6. Verification (confirm fix works)
   ↓
7. Post-Incident (review & improve)
```

### Incident Communications
- **Team:** Slack #security channel
- **Users:** Email + in-app notification
- **Public:** Blog post after resolution

### Escalation Path
```
Security Team Lead → CTO → CEO → Legal → PR
```

---

## Security Best Practices for Contributors

### Code Review Checklist
- [ ] No hardcoded secrets/passwords
- [ ] Input validation on all endpoints
- [ ] Output encoding for HTML/JavaScript
- [ ] HTTPS used for all external requests
- [ ] Proper error handling (no stack traces exposed)
- [ ] Logging doesn't include sensitive data
- [ ] Dependencies updated and scanned

### Development Environment
```bash
# Before committing, run security checks:
npm run security:audit          # Frontend
./mvnw org.owasp:dependency-check:check  # Backend
snyk test                       # All
```

### Secrets Management
```bash
# NEVER commit secrets!
# Use .env files (in .gitignore)
# Use environment variables in CI/CD
# Use AWS Secrets Manager (production)
```

---

## Bug Bounty Program (Coming Soon)

We're planning a bug bounty program! Details coming in Q3 2024.

- **Scope:** All components (backend, web, extension, iOS, Android)
- **Rewards:** $50-$5,000 based on severity
- **Process:** HackerOne or similar platform

---

## Resources & References

### Security Documentation
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Spring Security Docs](https://spring.io/projects/spring-security)
- [React Security](https://react.dev/learn/security)
- [iOS Security](https://developer.apple.com/security/)
- [Android Security](https://developer.android.com/privacy-and-security)

### Tools We Use
- **SonarQube:** Code quality & security
- **Snyk:** Dependency scanning
- **OWASP ZAP:** Web app scanning
- **Burp Suite:** Penetration testing
- **GitGuardian:** Secret detection

### Learning Resources
- [Secure Coding Guidelines](https://cwe.mitre.org/)
- [SANS Top 25](https://sans.org/top25-software-errors/)
- [PortSwigger Web Security Academy](https://portswigger.net/web-security)

---

## Questions?

- **Security concerns:** security@mindright.app
- **General questions:** GitHub Discussions
- **Emergency:** Contact CTO directly

---

**Last Updated:** 2024-04-27  
**Status:** ✅ Active & Maintained  
**Next Review:** 2024-07-27
