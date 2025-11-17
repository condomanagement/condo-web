# Condo Web - TODO List

## Package Updates & Configuration Migrations

### ~~Condo Brain Package Migration~~ ✅ COMPLETED (Nov 16, 2024)
- [x] Migrate from git package to @condomanagement/condo-brain npm package
- [x] Update to version 0.2.0
- [x] Update all imports to use @condomanagement/condo-brain
- [x] Handle new PaginatedResponse API changes in admin components
- [x] Fix linting issues introduced by changes

### ~~ESLint Migration~~ ✅ COMPLETED (Nov 16, 2024)
- [x] Migrate to flat config (eslint.config.mjs)
- [x] Update to ESLint 9
- [x] Replace deprecated eslint-config-airbnb with direct plugin configs
- [x] Update @typescript-eslint to v8
- [x] Update to eslint-plugin-jest v29
- [x] Configure eslint-plugin-import-x for modern imports
- [x] Fix all lint errors and warnings (0 errors, 0 warnings!)
  - ✅ Fixed React hooks called conditionally
  - ✅ Added missing key props in iterations
  - ✅ Added missing display names for components
  - ✅ Fixed TypeScript `any` types (with eslint-disable where needed for MUI compatibility)
  - ✅ Added eslint-disable for intentional stable dependency arrays
- [x] Configure CI to fail on warnings (`npm run lint:ci`)
- [x] Update GitHub Actions workflow to use `lint:ci`

### ~~Jest Configuration & Testing~~ ✅ COMPLETED (Nov 17, 2024)
- [x] Update Jest to v30
- [x] Review and update Jest configuration for latest best practices
  - Added ts-jest configuration with proper TypeScript options
  - Improved coverage collection (exclude mocks, setupTests, etc.)
  - Added helpful test options (verbose, clearMocks, resetMocks, restoreMocks)
  - Set baseline coverage thresholds
- [x] Update @testing-library/jest-dom to v6
  - Fixed import path from `/extend-expect` to direct import
- [x] Ensure proper TypeScript integration with ts-jest
- [ ] Add more tests to increase coverage (currently ~1.5%)

### ~~Major Package Updates~~ ✅ COMPLETED (Nov 17, 2024)
- [x] Update to latest compatible major versions:
  - ✅ @types/jest: 29.x → 30.x
  - ✅ @types/node: 20.x → 24.x  
  - ✅ @testing-library/jest-dom: 5.x → 6.x
  - ✅ eslint-plugin-react-hooks: 5.x → 7.x (added new `set-state-in-effect` rule config)
  - ✅ babel-loader: 9.x → 10.x
  - ✅ express: 4.x → 5.x
  - ✅ express-rate-limit: 7.x → 8.x
  - ✅ webpack-dev-middleware: 6.x → 7.x
  - ✅ webpack-dev-server: 4.x → 5.x
  - ✅ @date-io packages: 2.x → 3.x
  - ✅ FontAwesome packages: 6.x/0.2.x → 7.x/3.x
  - ✅ React Router DOM: 6.30.2 → 7.9.6
- [x] Fixed React Router v7 breaking changes:
  - Updated navigate() calls to use block syntax for void return type
  - Removed deprecated `future` prop from BrowserRouter
  - Added `.mjs` extension support to webpack config
  - Added fullySpecified resolver for ESM modules
- [x] Fixed React Hooks v7 strictness issues:
  - Fixed state mutation in QuestionLi (now uses spread operator)
  - Configured `set-state-in-effect` as warning
  - Added eslint-disable for intentional setState in effect
- [x] Verified all updates don't break build or tests
- [x] **ALL PACKAGES NOW UP TO DATE!** 🎉

## Testing Strategy

### ~~Increase Test Coverage~~ 🚧 IN PROGRESS (Nov 17, 2024)
- [x] Set up proper test infrastructure
  - Fixed @testing-library/jest-dom v6 import
  - Added TextEncoder/TextDecoder polyfills for React Router v7
  - Configured Jest with best practices
- [x] Added initial component tests:
  - ✅ makeStyles utilities (100% coverage)
  - ✅ Home component (100% coverage)
  - ✅ AmenityLi component (74% coverage)  
  - ✅ Authenticate component (96% coverage)
  - 🚧 Login component (74% coverage - has failing tests)
- [x] Current coverage: **6.4%** (up from ~1%)
- [ ] Fix failing tests in existing test suite
- [ ] Add component tests for remaining components
- [ ] Add integration tests for key user flows
- [ ] Add tests for API integration points
- [ ] Add tests for authentication flows
- [ ] Target: 50%+ code coverage
- [ ] Consider adding Storybook + Chromatic for visual regression

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
