# Running Tests for Project Identity

This guide explains how to run the test suite for the Project Identity extension.

## Prerequisites

Before running tests, ensure you have:
- Node.js installed (v14 or higher)
- Dependencies installed: `npm install`

## Running All Tests

To run the complete test suite:

```bash
npm test
```

This command will:
1. Run ESLint to check code quality
2. Start the VS Code test environment
3. Execute all 17 tests in the test suite
4. Display test results and coverage

## Test Suite Overview

The project includes **17 comprehensive tests** organized into the following categories:

### Color Validation Tests
- **Hex color validation - valid hex codes should pass**: Tests that valid 6-digit, 3-digit, and uppercase hex codes are accepted
- **Hex color validation - invalid hex codes should fail**: Tests that invalid formats are rejected

### Predefined Colors Tests
- **Predefined colors should be valid hex codes**: Validates all 10 color presets
- **Predefined colors should have valid labels**: Ensures all color options have proper labels

### Settings Structure Tests
- **Color customization object should have required properties**: Verifies all color customization keys exist
- **Settings object structure should be valid**: Checks JSON structure is valid
- **Project name should not be empty**: Validates project name input

### File Operations Tests
- **Backup file naming convention should be valid**: Tests backup filename format
- **File paths should use proper separators**: Validates path handling
- **JSON merge operation should preserve existing settings**: Tests settings merging logic
- **saveWorkspaceSettings should create .vscode directory**: Tests directory creation
- **saveWorkspaceSettings should create settings.json file**: Tests file creation
- **saveWorkspaceSettings should write valid JSON**: Validates JSON output
- **saveWorkspaceSettings should include project name in window title**: Tests title generation
- **saveWorkspaceSettings should apply color customizations**: Verifies color application
- **saveWorkspaceSettings should preserve existing settings**: Tests non-destructive updates
- **saveWorkspaceSettings should create backup of existing settings**: Tests backup functionality

## Understanding Test Output

When you run `npm test`, you'll see output like:

```
Project Identity Extension Test Suite
  ✔ Hex color validation - valid hex codes should pass
  ✔ Hex color validation - invalid hex codes should fail
  ...
  17 passing (40ms)
```

- **✔**: Test passed
- **✗**: Test failed (includes error details)
- **Timing**: How long the tests took to run

## Running Linting Only

To check code quality without running tests:

```bash
npm run lint
```

## Debugging Tests

To debug tests in VS Code:

1. Set breakpoints in the test file (`test/extension.test.js`)
2. Press `F5` to open the extension in debug mode
3. Open the debug console to see test output
4. Step through code using the debugger controls

## Test File Locations

- **Main test file**: `test/extension.test.js`
- **Extension code being tested**: `extension.js`
- **Utilities being tested**: `src/colorValidator.js`

## Continuous Integration

For CI/CD pipelines, the test command is:

```bash
npm test
```

This will exit with code 0 on success and code 1 on failure.

## Troubleshooting

### Tests are hanging
- Ensure VS Code process can be started (check display server if on Linux)
- Try clearing cache: `rm -rf .vscode-test`
- Reinstall dependencies: `rm -rf node_modules && npm install`

### Permission errors
- Ensure you have write permissions in the project directory
- Tests use temporary directories in `/tmp` (Linux/macOS) or `%TEMP%` (Windows)

### Module not found errors
- Run `npm install` to ensure all dependencies are installed
- Check that `src/colorValidator.js` exists

## Coverage

Tests cover:
- ✅ Color validation logic (hex code format)
- ✅ Settings file creation and management
- ✅ File system operations (directory/file creation)
- ✅ JSON parsing and merging
- ✅ Settings preservation and backup
- ✅ User input validation

The extension code is thoroughly tested with integration tests that validate real file operations.
