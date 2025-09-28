# Testing Guide

This project has been organized with separate test suites for different testing scenarios.

## Test Structure

### Unit Tests (Mock Tests)
Located in `src/__tests__/` (excluding integration folder):
- `browser.test.ts` - Browser environment tests
- `r1fs.test.ts` - R1FS service mock tests
- `r1fsClient.test.ts` - R1FS HTTP client tests
- `cstore.test.ts` - CStore service mock tests
- `cstoreClient.test.ts` - CStore HTTP client tests
- `e2e.test.ts` - General end-to-end mock tests

### Integration Tests
Located in `src/__tests__/integration/`:
- `e2e.r1fs.test.ts` - R1FS integration tests (requires R1FS server on port 31235)
- `e2e.cstore.test.ts` - CStore integration tests (requires CStore server on port 31234)

## Running Tests

### Unit Tests (Default)
```bash
npm test
# or
npm run test:unit
```
Runs all unit/mock tests. These tests use mocked HTTP responses and don't require running servers.

### Integration Tests
```bash
npm run test:integration
```
Runs integration tests that require actual R1FS and CStore servers to be running.

### All Tests
```bash
npm run test:all
```
Runs both unit and integration tests.

## Prerequisites for Integration Tests

Integration tests require the following servers to be running:

1. **R1FS Server** on port 31235
2. **CStore Server** on port 31234

You can override the default URLs using environment variables:
```bash
R1FS_API_URL=http://localhost:31235 npm run test:integration
CSTORE_API_URL=http://localhost:31234 npm run test:integration
```

## Test Configuration

- **Unit Tests**: Use `jest.config.js` with standard settings
- **Integration Tests**: Use `jest.integration.config.js` with longer timeout (30s) for server communication

## CI/CD Recommendations

- **Development**: Run `npm test` (unit tests only)
- **Pull Requests**: Run `npm run test:unit` 
- **Pre-deployment**: Run `npm run test:all` (if servers are available)
- **Production**: Run `npm run test:integration` (if servers are available)
