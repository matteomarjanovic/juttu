# Juttu Tests

This directory contains automated tests for the Juttu application.

## Running Tests

```bash
# Run all tests once
npm test

# Run tests in watch mode (re-run on file changes)
npm run test:watch

# Run tests with UI
npm run test:ui
```

## Test Coverage

### Authentication Tests (`src/lib/auth.test.ts`)

The auth tests focus on the iframe-friendly login flow logic:

#### 1. **Iframe Detection Logic**

- Tests the logic that determines if code is running in an iframe
- Validates `window.self !== window.top` detection
- Important for triggering the correct login flow

#### 2. **Login Popup Configuration**

- Tests URL construction for the login popup
- Validates handle parameter handling
- Ensures correct routing to `/login` page

#### 3. **postMessage Security**

- Tests origin validation for cross-window messages
- Validates message type checking
- Ensures only trusted messages are processed
- Critical for security in iframe communication

#### 4. **Popup Window Management**

- Tests popup state detection (closed/open)
- Validates cleanup when popup is closed
- Handles user cancellation scenarios

#### 5. **Session Data Structure**

- Tests session DID extraction
- Validates session data format
- Ensures correct data passed between contexts

#### 6. **Error Handling**

- Tests empty/invalid handle rejection
- Tests popup blocking detection
- Validates error messages

## Test Philosophy

These tests focus on **logic and security validation** rather than full integration tests because:

1. **OAuth Client Complexity**: The `@atproto/oauth-client-browser` library is complex to mock
2. **Svelte 5 Runes**: The `$state` runes require a Svelte runtime context
3. **Browser APIs**: Full postMessage/window.open testing requires browser environment

The tests validate:

- ✅ Critical security logic (origin validation)
- ✅ URL construction and routing
- ✅ Error handling paths
- ✅ Data structure validation
- ✅ Popup management logic

## Future Test Additions

To add more comprehensive testing, consider:

1. **E2E Tests with Playwright**
   - Full OAuth flow in real browser
   - Iframe embedding scenarios
   - Cross-origin postMessage validation

2. **Component Tests**
   - Test `/login` page UI
   - Test auth modal components
   - Test login button interactions

3. **Integration Tests**
   - Mock OAuth client responses
   - Test session restoration
   - Test agent creation

## Writing New Tests

When adding new authentication features:

1. Add unit tests for new validation logic
2. Add security tests for any postMessage usage
3. Test error paths and edge cases
4. Document what the test validates

Example:

```typescript
describe('Auth - new feature', () => {
	it('should validate new security check', () => {
		// Test logic here
		expect(securityCheck()).toBe(true);
	});
});
```
