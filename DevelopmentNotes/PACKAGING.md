# Packaging Project Identity for Distribution

This guide explains how to package and distribute the Project Identity extension.

## Prerequisites

Before packaging, ensure you have:
- Node.js installed (v14 or higher)
- `vsce` (VS Code Extension CLI) installed globally:
  ```bash
  npm install -g vsce
  ```
- All tests passing: `npm test`
- Code linting passing: `npm run lint`

## Pre-Packaging Checklist

Before creating a package, verify:

- [ ] Version number is correct in `package.json`
- [ ] `CHANGELOG.md` is updated with release notes
- [ ] `LICENSE.md` is present and valid
- [ ] `icon.png` exists (128x128px)
- [ ] `.vscodeignore` is configured
- [ ] All tests pass: `npm test`
- [ ] Code quality is good: `npm run lint`
- [ ] `README.md` is complete and accurate

## Step 1: Configure .vscodeignore

Ensure `.vscodeignore` file exists in the root directory with:

```
.git
.gitignore
test/
.vscode/
DevelopmentNotes/
*.vsix
node_modules/
.eslintrc.json
eslint.config.mjs
jsconfig.json
```

This file tells `vsce` which files to exclude from the packaged extension.

## Step 2: Verify Package.json

Ensure `package.json` contains:

```json
{
  "name": "project-identity",
  "displayName": "Project Identity",
  "version": "1.0.0",
  "publisher": "your-publisher-name",
  "description": "...",
  "license": "MIT",
  "repository": {
    "type": "git",
    "url": "https://github.com/your-username/project-identity"
  },
  "icon": "icon.png"
}
```

**Important**: Replace `your-publisher-name` with your actual VS Code publisher name.

## Step 3: Create the Package

To create a `.vsix` file (packaged extension):

```bash
vsce package
```

This will:
1. Validate the extension configuration
2. Check for required files
3. Create a `.vsix` file named `project-identity-1.0.0.vsix`
4. Display the file size and location

### Example Output:
```
 WARNING  A 'CHANGELOG.md' file matching the pattern 'CHANGELOG.md' does not exist in the root folder
 DONE  Packaged: project-identity-1.0.0.vsix (2.5 MB)
```

## Step 4: Test the Package Locally

To test the packaged extension before publishing:

1. Open VS Code
2. Go to Extensions view (`Ctrl+Shift+X` / `Cmd+Shift+X`)
3. Click the "..." menu → "Install from VSIX"
4. Select the `.vsix` file
5. Test all features manually

## Publishing to VS Code Marketplace

### Option A: Publish Directly (Recommended)

If you have a publisher account and PAT (Personal Access Token):

```bash
vsce publish
```

This will:
1. Validate the extension
2. Upload to the marketplace
3. Publish immediately
4. Update the version in `package.json`

### Option B: Publish Manually

1. Visit [VS Code Marketplace Publisher Portal](https://marketplace.visualstudio.com/manage)
2. Sign in with your Microsoft account
3. Go to your publisher profile
4. Click "New Extension"
5. Upload the `.vsix` file
6. Fill in metadata (screenshots, category, etc.)
7. Click "Create"

## Version Management

### Incrementing Version

Before each release, update the version in `package.json`:

```json
{
  "version": "1.0.1"
}
```

Use semantic versioning:
- **Major** (1.0.0): Breaking changes
- **Minor** (1.1.0): New features, backward compatible
- **Patch** (1.0.1): Bug fixes

Update `CHANGELOG.md` with the new version and release notes.

## Unpublishing

To unpublish a version:

```bash
vsce unpublish your-publisher-name.project-identity
```

## Troubleshooting

### "Missing publisher name" Error
- Set the `publisher` field in `package.json`
- Run: `vsce createPublisher your-username`

### "Authentication required" Error
- Verify you have a VS Code publisher account
- Create a Personal Access Token (PAT) at https://dev.azure.com/
- Run: `vsce login your-publisher-name`

### "File not found" Errors
- Ensure `icon.png` exists in the root
- Verify `.vscodeignore` is properly formatted
- Check that all required files are in the root directory

### Size Too Large
- Verify `.vscodeignore` excludes `node_modules/`
- Check that test files are excluded
- Remove unnecessary files from the repository

## Package Contents

The `.vsix` file includes:

```
project-identity-1.0.0.vsix
├── extension.js
├── src/
│   └── colorValidator.js
├── package.json
├── README.md
├── LICENSE.md
├── CHANGELOG.md
├── icon.png
├── .vscodeignore
└── [other configuration files]
```

**Excluded** (via `.vscodeignore`):
- test/ directory
- node_modules/
- .git/
- DevelopmentNotes/
- Previous .vsix files

## Marketplace Listing

After publishing, your extension will appear in the VS Code Marketplace with:
- **Icon**: The `icon.png` file
- **Display Name**: From `displayName` in package.json
- **Description**: From `description` field
- **Version**: From `version` field
- **Publisher**: Your publisher name
- **License**: MIT

## Updating the Extension

To release a new version:

1. Make code changes
2. Update version in `package.json`
3. Update `CHANGELOG.md`
4. Run tests: `npm test`
5. Create new package: `vsce package`
6. Test locally with new `.vsix`
7. Publish: `vsce publish` or upload manually

## Resources

- [VS Code Extension Publishing Guide](https://code.visualstudio.com/api/working-with-extensions/publishing-extension)
- [vsce Documentation](https://github.com/microsoft/vscode-vsce)
- [Marketplace Policies](https://marketplace.visualstudio.com/vscodepolicies)
- [Extension Manifest Reference](https://code.visualstudio.com/api/references/extension-manifest)
