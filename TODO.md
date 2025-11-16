# Condo Web - TODO List

## Package Updates & Configuration Migrations

### ESLint Migration
- [ ] Migrate to flat config (eslint.config.js)
- [ ] Update from deprecated eslint-config-airbnb to modern alternatives
- [ ] Consider @typescript-eslint/eslint-plugin with recommended configs
- [ ] Remove dependency on eslint-plugin-react-hooks if not using hooks extensively

### Jest Configuration
- [ ] Review and update Jest configuration for latest best practices
- [ ] Ensure proper TypeScript integration with ts-jest
- [ ] Update test coverage thresholds if needed

### Major Package Updates
- [ ] Verify all packages are on latest major versions
- [ ] Check for breaking changes in React ecosystem updates
- [ ] Update any display/UI framework packages (check for breaking changes)
- [ ] Test visual regression after updates

## Testing Strategy

### Increase Test Coverage
- [ ] Add component tests for all React components
- [ ] Add integration tests for key user flows
- [ ] Add tests for API integration points
- [ ] Add tests for authentication flows (including new passkey support)
- [ ] Add visual regression tests (consider adding Storybook + Chromatic)
- [ ] Target: 80%+ code coverage

### Test Organization
- [ ] Ensure all components have corresponding .test files
- [ ] Add test utilities and helpers for common patterns
- [ ] Mock API responses consistently
- [ ] Add E2E tests for critical paths (consider Playwright or Cypress)

## Passkey Integration (Frontend)

### User Interface
- [ ] Add passkey registration flow UI
  - [ ] Registration button/prompt for first-time setup
  - [ ] Success/error feedback
  - [ ] Fallback to email/magic link
- [ ] Add passkey authentication flow UI
  - [ ] Detect if user has passkeys registered
  - [ ] Prompt to use passkey instead of magic link
  - [ ] Fallback to email if passkey fails
- [ ] Add passkey management interface
  - [ ] List registered passkeys
  - [ ] Add new passkey
  - [ ] Remove passkey
  - [ ] Rename passkey (friendly names)
  - [ ] View last used date

### Integration with condo-brain
- [ ] Connect to PasskeyManager methods
- [ ] Handle WebAuthn browser API calls
- [ ] Add error handling for unsupported browsers
- [ ] Add loading states during passkey operations
- [ ] Test cross-browser compatibility (Chrome, Firefox, Safari, Edge)

### UX Considerations
- [ ] Add educational content about passkeys
- [ ] Show passkey availability status to users
- [ ] Provide clear fallback options
- [ ] Handle platform authenticator vs roaming authenticator
- [ ] Mobile-friendly passkey flows

## Display Framework Verification
- [ ] Audit all UI components after package updates
- [ ] Test responsive layouts
- [ ] Verify no visual regressions
- [ ] Check accessibility compliance
- [ ] Test dark mode (if applicable)

## Documentation
- [ ] Update README with new setup instructions
- [ ] Document passkey feature for users
- [ ] Add developer documentation for passkey flows
- [ ] Update environment variable documentation

## CI/CD
- [ ] Ensure all tests pass in CI
- [ ] Add visual regression testing to CI pipeline
- [ ] Verify build process works with updated packages
- [ ] Test deployment process

## Nice to Have
- [ ] Add Storybook for component development
- [ ] Add bundle size monitoring
- [ ] Performance testing and optimization
- [ ] Add TypeScript strict mode
- [ ] Accessibility audit and improvements
