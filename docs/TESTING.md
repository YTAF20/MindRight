# 🧪 Testing Guide for MindRight

Comprehensive testing practices and guidelines for all components.

---

## Testing Pyramid

```
        ┌─────────────────────┐
        │   E2E Tests         │  5-10%
        │   (Playwright)      │
        ├─────────────────────┤
        │   Integration       │  20-30%
        │   (REST Assured)    │
        ├─────────────────────┤
        │   Unit Tests        │  60-70%
        │ (JUnit, Vitest)     │
        └─────────────────────┘
```

---

## Backend Testing (Spring Boot + JUnit 5)

### Unit Tests

#### Test Structure
```java
@DisplayName("UserService Unit Tests")
class UserServiceTest {
  
  @Mock
  private UserRepository userRepository;
  
  @Mock
  private PasswordEncoder passwordEncoder;
  
  @InjectMocks
  private UserService userService;
  
  @BeforeEach
  void setUp() {
    MockitoAnnotations.openMocks(this);
  }
  
  @Test
  @DisplayName("Should create user successfully")
  void createUserSuccess() {
    // Arrange
    UserRequest request = new UserRequest("john@example.com", "password");
    User expected = new User(UUID.randomUUID(), "john@example.com", "hashed");
    
    when(userRepository.save(any(User.class))).thenReturn(expected);
    when(passwordEncoder.encode("password")).thenReturn("hashed");
    
    // Act
    User result = userService.createUser(request);
    
    // Assert
    assertThat(result).isNotNull();
    assertThat(result.getEmail()).isEqualTo("john@example.com");
    verify(userRepository, times(1)).save(any(User.class));
  }
  
  @Test
  @DisplayName("Should throw exception for duplicate email")
  void createUserDuplicateEmail() {
    // Arrange
    UserRequest request = new UserRequest("john@example.com", "password");
    
    when(userRepository.save(any(User.class)))
      .thenThrow(new DataIntegrityViolationException("Duplicate key"));
    
    // Act & Assert
    assertThatThrownBy(() -> userService.createUser(request))
      .isInstanceOf(DuplicateEmailException.class);
  }
}
```

#### Best Practices
- **Given-When-Then:** Arrange-Act-Assert pattern
- **One assertion per test:** Keep tests focused
- **Mock external dependencies:** Only test your code
- **Descriptive names:** Use `@DisplayName`
- **Parameterized tests:** Test multiple scenarios
  ```java
  @ParameterizedTest
  @ValueSource(strings = {"john", "john@", "john@.com"})
  void testInvalidEmails(String email) {
    assertThatThrownBy(() -> userService.validateEmail(email))
      .isInstanceOf(InvalidEmailException.class);
  }
  ```

#### Running Unit Tests
```bash
# All tests
./mvnw test

# Specific test class
./mvnw test -Dtest=UserServiceTest

# Specific test method
./mvnw test -Dtest=UserServiceTest#createUserSuccess

# With coverage
./mvnw clean test jacoco:report
# View: target/site/jacoco/index.html
```

### Integration Tests

#### Test Structure
```java
@SpringBootTest
@Testcontainers
@DisplayName("User API Integration Tests")
class UserControllerIT {
  
  @Container
  static PostgreSQLContainer<?> postgres = new PostgreSQLContainer<>(DockerImageName.parse("postgres:16"));
  
  @Autowired
  private TestRestTemplate restTemplate;
  
  @Autowired
  private UserRepository userRepository;
  
  @Test
  @DisplayName("Should register user and return token")
  void testUserRegistration() {
    // Arrange
    UserRegisterRequest request = new UserRegisterRequest(
      "newuser@example.com",
      "SecurePassword123!",
      "John",
      "Doe"
    );
    
    // Act
    ResponseEntity<AuthResponse> response = restTemplate.postForEntity(
      "/api/auth/register",
      request,
      AuthResponse.class
    );
    
    // Assert
    assertThat(response.getStatusCode()).isEqualTo(HttpStatus.CREATED);
    assertThat(response.getBody().getAccessToken()).isNotBlank();
    
    Optional<User> savedUser = userRepository.findByEmail("newuser@example.com");
    assertThat(savedUser).isPresent();
    assertThat(savedUser.get().getFirstName()).isEqualTo("John");
  }
  
  @Test
  @DisplayName("Should return 409 for duplicate email")
  void testDuplicateEmailRegistration() {
    // Arrange
    User existingUser = new User();
    existingUser.setEmail("existing@example.com");
    existingUser.setPasswordHash("hash");
    userRepository.save(existingUser);
    
    UserRegisterRequest request = new UserRegisterRequest(
      "existing@example.com",
      "password",
      "John",
      "Doe"
    );
    
    // Act
    ResponseEntity<ErrorResponse> response = restTemplate.postForEntity(
      "/api/auth/register",
      request,
      ErrorResponse.class
    );
    
    // Assert
    assertThat(response.getStatusCode()).isEqualTo(HttpStatus.CONFLICT);
    assertThat(response.getBody().getError()).contains("already registered");
  }
}
```

#### TestContainers
```java
// Database container starts automatically before tests
@Container
static PostgreSQLContainer<?> postgres = new PostgreSQLContainer<>("postgres:16")
  .withDatabaseName("testdb")
  .withUsername("testuser")
  .withPassword("testpass");

// Redis container (for caching tests)
@Container
static GenericContainer<?> redis = new GenericContainer<>("redis:7")
  .withExposedPorts(6379);
```

#### Running Integration Tests
```bash
# All tests including integration
./mvnw verify

# Only integration tests
./mvnw test -Dgroups=integration
```

### Mocking & Stubbing

#### Mockito
```java
// Mock objects
@Mock
private UserRepository userRepository;

// Stub behavior
when(userRepository.findById("123"))
  .thenReturn(Optional.of(user));

// Verify calls
verify(userRepository, times(1)).save(any(User.class));
verify(userRepository, never()).delete(any());
```

#### MockMvc (for Controllers)
```java
@WebMvcTest(UserController.class)
class UserControllerTest {
  
  @Autowired
  private MockMvc mockMvc;
  
  @MockBean
  private UserService userService;
  
  @Test
  void testGetUserProfile() throws Exception {
    User mockUser = new User("john@example.com", "John", "Doe");
    when(userService.getCurrentUser()).thenReturn(mockUser);
    
    mockMvc.perform(get("/api/user/profile")
        .header("Authorization", "Bearer token"))
      .andExpect(status().isOk())
      .andExpect(jsonPath("$.email").value("john@example.com"))
      .andExpect(jsonPath("$.firstName").value("John"));
  }
}
```

---

## Frontend Testing (React + Vitest)

### Unit Tests

#### Component Tests
```typescript
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { GoalForm } from './GoalForm';

describe('GoalForm', () => {
  it('should render form with all fields', () => {
    render(<GoalForm onSubmit={vi.fn()} />);
    
    expect(screen.getByLabelText(/goal title/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/target value/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /submit/i })).toBeInTheDocument();
  });
  
  it('should validate email field', async () => {
    const user = userEvent.setup();
    render(<GoalForm onSubmit={vi.fn()} />);
    
    await user.type(screen.getByLabelText(/goal title/i), '');
    await user.click(screen.getByRole('button', { name: /submit/i }));
    
    expect(screen.getByText(/title is required/i)).toBeInTheDocument();
  });
  
  it('should call onSubmit with form data', async () => {
    const user = userEvent.setup();
    const mockSubmit = vi.fn();
    
    render(<GoalForm onSubmit={mockSubmit} />);
    
    await user.type(screen.getByLabelText(/goal title/i), 'Reduce screen time');
    await user.type(screen.getByLabelText(/target value/i), '120');
    await user.click(screen.getByRole('button', { name: /submit/i }));
    
    await waitFor(() => {
      expect(mockSubmit).toHaveBeenCalledWith({
        title: 'Reduce screen time',
        targetValue: 120
      });
    });
  });
});
```

#### Hook Tests
```typescript
import { renderHook, act } from '@testing-library/react';
import { useGoals } from './useGoals';

describe('useGoals', () => {
  it('should fetch goals on mount', async () => {
    const { result } = renderHook(() => useGoals());
    
    expect(result.current.loading).toBe(true);
    
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
      expect(result.current.goals).toHaveLength(3);
    });
  });
  
  it('should add goal to list', async () => {
    const { result } = renderHook(() => useGoals());
    
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
    
    act(() => {
      result.current.addGoal({ title: 'New goal' });
    });
    
    await waitFor(() => {
      expect(result.current.goals).toHaveLength(4);
      expect(result.current.goals[3].title).toBe('New goal');
    });
  });
});
```

#### Running Tests
```bash
# All tests
npm test

# Watch mode (re-run on file changes)
npm test -- --watch

# Coverage report
npm test -- --coverage

# Specific file
npm test -- useGoals.test.ts
```

### Component Integration Tests

```typescript
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { GoalsDashboard } from './GoalsDashboard';

describe('GoalsDashboard', () => {
  it('should display goals and allow user interactions', async () => {
    const user = userEvent.setup();
    const queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false }
      }
    });
    
    render(
      <QueryClientProvider client={queryClient}>
        <GoalsDashboard />
      </QueryClientProvider>
    );
    
    // Wait for initial load
    await waitFor(() => {
      expect(screen.getByText(/your goals/i)).toBeInTheDocument();
    });
    
    // Click add goal button
    await user.click(screen.getByRole('button', { name: /add goal/i }));
    
    // Form should appear
    expect(screen.getByLabelText(/goal title/i)).toBeInTheDocument();
  });
});
```

### Mocking API Calls

```typescript
import { vi } from 'vitest';
import axios from 'axios';

vi.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('API Service', () => {
  it('should fetch goals successfully', async () => {
    mockedAxios.get.mockResolvedValue({
      data: {
        data: [
          { id: 1, title: 'Goal 1' },
          { id: 2, title: 'Goal 2' }
        ]
      }
    });
    
    const response = await goalService.getGoals();
    
    expect(response).toHaveLength(2);
    expect(mockedAxios.get).toHaveBeenCalledWith('/api/goals');
  });
});
```

---

## E2E Testing (Playwright)

### Test Setup

```typescript
import { test, expect } from '@playwright/test';

test.describe('User Goals Flow', () => {
  test('should create and complete a goal', async ({ page, browser }) => {
    // 1. Navigate to app
    await page.goto('http://localhost:5173');
    
    // 2. Register (or login if already registered)
    await page.click('text=Register');
    await page.fill('[name="email"]', 'test@example.com');
    await page.fill('[name="password"]', 'TestPassword123!');
    await page.fill('[name="firstName"]', 'Test');
    await page.fill('[name="lastName"]', 'User');
    await page.click('button:has-text("Register")');
    
    // 3. Wait for dashboard
    await page.waitForURL('http://localhost:5173/dashboard');
    
    // 4. Create goal
    await page.click('button:has-text("Add Goal")');
    await page.fill('[name="title"]', 'Reduce screen time');
    await page.fill('[name="targetValue"]', '120');
    await page.click('select[name="category"]');
    await page.selectOption('select[name="category"]', 'health');
    await page.click('button:has-text("Create Goal")');
    
    // 5. Verify goal appears
    await expect(page.locator('text=Reduce screen time')).toBeVisible();
    
    // 6. Log progress
    await page.click('button:has-text("Log Progress")');
    await page.fill('[name="value"]', '95');
    await page.click('button:has-text("Save")');
    
    // 7. Verify progress logged
    await expect(page.locator('text=95 minutes')).toBeVisible();
  });
});
```

### Running E2E Tests

```bash
# All tests
npm run test:e2e

# Watch mode
npm run test:e2e -- --watch

# Debug mode
npm run test:e2e -- --debug

# Generate report
npm run test:e2e -- --reporter=html
# View: playwright-report/index.html
```

---

## Chrome Extension Testing

### Unit Tests
```typescript
// rules.test.ts
import { generateDNRRules } from './rules';

describe('DNR Rules Generation', () => {
  it('should generate valid DNR rule for domain', () => {
    const rules = generateDNRRules(['twitter.com', 'facebook.com']);
    
    expect(rules).toHaveLength(2);
    expect(rules[0].action.type).toBe('block');
    expect(rules[0].condition.urlFilter).toContain('twitter.com');
  });
});
```

### Manual Testing
```bash
1. Open chrome://extensions/
2. Enable "Developer Mode"
3. Load unpacked: select apps/extension folder
4. Test blocking domains:
   - Open twitter.com → should be blocked
   - Open reddit.com → should load normally
5. Test popup UI:
   - Click extension icon → popup should appear
   - Add domain → should appear in list
   - Remove domain → should disappear
```

---

## Code Coverage

### Minimum Requirements
- **Backend:** 80% line coverage
- **Frontend:** 80% line coverage
- **Critical paths:** 100% coverage

### Coverage Tools

#### Backend (JaCoCo)
```bash
./mvnw clean test jacoco:report
# View: target/site/jacoco/index.html
```

#### Frontend (Vitest)
```bash
npm test -- --coverage
# View: coverage/index.html
```

### GitHub Actions Integration
```yaml
- name: Upload Coverage
  uses: codecov/codecov-action@v3
  with:
    files: ./target/site/jacoco/jacoco.xml,./coverage/coverage-final.json
    flags: unittests
    fail_ci_if_error: true
```

---

## Performance Testing

### Backend (JMeter)
```bash
# Create test plan
jmeter -t backend_load_test.jmx

# Run headless
jmeter -n -t backend_load_test.jmx -l results.jtl -j jmeter.log
```

### Frontend (Lighthouse)
```bash
npm install -g lighthouse

lighthouse http://localhost:5173 --output-path=lighthouse.html
```

---

## Test Data Management

### Database Fixtures
```java
@Sql(scripts = "/test-data.sql", executionPhase = BEFORE_TEST_METHOD)
@Sql(scripts = "/cleanup.sql", executionPhase = AFTER_TEST_METHOD)
void testWithData() { ... }
```

### Test Data Factory
```java
class UserTestFactory {
  public static User createTestUser() {
    return new User()
      .setEmail("test@example.com")
      .setFirstName("Test")
      .setLastName("User")
      .setPasswordHash("hash");
  }
}
```

---

## Continuous Integration

### GitHub Actions Workflow
```yaml
name: Tests

on: [push, pull_request]

jobs:
  backend-tests:
    runs-on: ubuntu-latest
    services:
      postgres:
        image: postgres:16
        env:
          POSTGRES_PASSWORD: password
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-java@v3
        with:
          java-version: '21'
      - run: cd apps/backend && ./mvnw test
      - uses: codecov/codecov-action@v3

  frontend-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: cd apps/web && npm install && npm test
      - uses: codecov/codecov-action@v3

  e2e-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm install -g playwright
      - run: npm run build
      - run: npm run test:e2e
```

---

## Testing Checklist

### Before Commit
- [ ] All unit tests pass
- [ ] Code coverage > 80%
- [ ] No console errors/warnings
- [ ] Linter passes
- [ ] Type checker passes (TypeScript)

### Before PR
- [ ] All integration tests pass
- [ ] E2E tests pass (sample flows)
- [ ] No regressions in existing tests
- [ ] Performance acceptable
- [ ] Security scanning passed

### Before Merge
- [ ] Code review approved
- [ ] CI/CD pipeline green
- [ ] Manual testing in staging (if UI change)
- [ ] Accessibility checks (if applicable)

---

## Debugging Tests

### Common Issues

#### Test Timeout
```java
@Test(timeout = 5000)  // 5 second timeout
void testTimeoutExample() { ... }

// Or for Playwright:
test.setTimeout(30000);  // 30 seconds
```

#### Flaky Tests
- **Use `waitFor`:** Don't assume immediate state changes
- **Mock external APIs:** Reduce randomness
- **Isolate tests:** No dependencies between tests
- **Seed random:** Use fixed seeds for reproducibility

#### Debugging in IDE
```
IntelliJ IDEA:
1. Right-click test method
2. Select "Debug 'testName'"
3. Set breakpoints
4. Step through code

VS Code + Jest:
1. Add launch config in .vscode/launch.json
2. Set breakpoints
3. F5 to debug
```

---

## Best Practices

### ✅ Do
- Write tests alongside code
- Test behavior, not implementation
- Use descriptive test names
- Keep tests fast (< 1s each)
- Mock external dependencies
- Test error scenarios

### ❌ Don't
- Test the framework (React, Spring)
- Have interdependent tests
- Use actual APIs in tests
- Skip tests before commit
- Ignore test failures
- Write tests after code (most of the time)

---

## Resources

- [Spring Boot Testing](https://spring.io/guides/gs/testing-web/)
- [React Testing Library](https://testing-library.com/react)
- [Vitest Docs](https://vitest.dev/)
- [Playwright Docs](https://playwright.dev/)
- [JUnit 5 Guide](https://junit.org/junit5/docs/current/user-guide/)

---

**Last Updated:** 2024-04-27  
**Status:** ✅ Complete
