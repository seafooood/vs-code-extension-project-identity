# Change Log

All notable changes to the "Project Identity" extension will be documented in this file.

Check [Keep a Changelog](http://keepachangelog.com/) for recommendations on how to structure this file.

## [1.0.0] - 2025-12-09

### Added
- Initial release of Project Identity extension
- Custom project name support for workspace identification
- 10 predefined color themes for visual workspace differentiation
- Custom hex color code input for advanced customization
- Automatic title bar customization with project name
- Color customization for title bar, status bar, activity bar, and sidebar
- Automatic backup of existing workspace settings
- Keyboard shortcut support (`Ctrl+Alt+S` on Windows/Linux, `Cmd+Alt+S` on macOS)
- Command palette integration ("Set Project Identity")
- Settings preservation - merges new settings with existing workspace configuration
- Comprehensive test suite with 17 unit and integration tests
- Full project documentation with usage examples

### Features
- **Project Names**: Set unique identifiers for multiple instances of the same repository
- **Color Schemes**: Choose from 10 preset colors or enter custom hex codes
- **Non-destructive**: Backs up existing settings before applying changes
- **Easy Access**: Available via keyboard shortcut or command palette
- **Auto-reload**: VS Code reloads automatically to apply changes

### Technical Improvements
- Modular code architecture with single-responsibility functions
- Shared utility module for color validation
- Comprehensive error handling for corrupted settings files
- Cross-platform compatibility (Windows, macOS, Linux)

### Testing
- 17 passing tests covering core functionality
- Unit tests for color validation
- Integration tests for file operations and settings management
- Tests for settings preservation and backup creation

### Fixed
- Proper directory creation with recursive option for nested paths

### Documentation
- Complete README with usage instructions and feature descriptions
- Inline code documentation with JSDoc comments
- Deployment checklist for VS Code Marketplace submission