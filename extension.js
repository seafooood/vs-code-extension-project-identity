const vscode = require('vscode');
const fs = require('fs');
const path = require('path');
const { isValidHexColor, HEX_COLOR_VALIDATION_ERROR, PREDEFINED_COLORS } = require('./src/colorValidator');

/**
 * Prompts user to enter a project name
 * @returns {Promise<string|undefined>} The project name entered by user, or undefined if cancelled
 */
async function requestInputProjectName() {
  return await vscode.window.showInputBox({
    prompt: 'Enter a project name',
    placeHolder: 'e.g., Frontend, Backend, AI',
  });
}

/**
 * Prompts user to select a color from predefined options
 * @returns {Promise<{label: string, value: string}|undefined>} The selected color object, or undefined if cancelled
 */
async function requestInputColour() {
  return await vscode.window.showQuickPick(PREDEFINED_COLORS, {
    placeHolder: 'Select a color for the title bar',
  });
}

/**
 * Prompts user to enter a custom hex color code
 * @returns {Promise<string|undefined>} The hex color code entered, or undefined if cancelled
 */
async function requestInputCustomColour() {
  return await vscode.window.showInputBox({
    prompt: 'Enter a hex color code for the title bar',
    placeHolder: '#2d5a87',
    validateInput: (value) => {
      return isValidHexColor(value) ? null : HEX_COLOR_VALIDATION_ERROR;
    },
  });
}

/**
 * Saves workspace settings to .vscode/settings.json
 * @param {string} workspaceRoot - The root directory of the workspace
 * @param {string} projectName - The project name to display in title
 * @param {string} color - The hex color code for customization
 */
function saveWorkspaceSettings(workspaceRoot, projectName, color) {
  const vscodeDir = path.join(workspaceRoot, '.vscode');
  const settingsFile = path.join(vscodeDir, 'settings.json');

  if (!fs.existsSync(vscodeDir)) {
    fs.mkdirSync(vscodeDir, { recursive: true });
  }

  const settings = {
    'window.title': `${projectName} - \${rootName}`,
    'workbench.colorCustomizations': {
      'titleBar.activeBackground': color,
      'titleBar.activeForeground': '#ffffff',
      'titleBar.inactiveBackground': color,
      'titleBar.inactiveForeground': '#cccccc',
      'statusBar.background': color,
      'statusBar.foreground': '#ffffff',
      'activityBar.border': color,
      'sideBar.border': color
    },
  };

  let existingSettings = {};
  if (fs.existsSync(settingsFile)) {
    try {
      existingSettings = JSON.parse(fs.readFileSync(settingsFile, 'utf8'));
      
      // Backup the existing settings file
      const backupFile = path.join(vscodeDir, `settings.json.backup.${Date.now()}`);
      fs.copyFileSync(settingsFile, backupFile);
    } catch (error) {
      console.error('Error parsing existing settings.json:', error);
      // Backup the corrupted file for inspection
      const corruptedBackup = path.join(vscodeDir, `settings.json.corrupted.${Date.now()}`);
      fs.copyFileSync(settingsFile, corruptedBackup);
    }
  }

  const newSettings = { ...existingSettings, ...settings };

  fs.writeFileSync(settingsFile, JSON.stringify(newSettings, null, 4));
}

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
  let disposable = vscode.commands.registerCommand('project-identity.set', async function () {

    // Request project name
    const projectName = await requestInputProjectName();
    if (!projectName) {
      return;
    }

    // Request color selection
    const colorSelection = await requestInputColour();
    if (!colorSelection) {
      return;
    }

    let color = colorSelection.value;

    // If custom color selected, request hex code
    if (color === 'custom') {
      color = await requestInputCustomColour();
      if (!color) {
        return;
      }
    }

    // Verify workspace is open
    const workspaceFolders = vscode.workspace.workspaceFolders;
    if (!workspaceFolders) {
      vscode.window.showErrorMessage('No workspace folder open.');
      return;
    }

    // Save settings to workspace
    const workspaceRoot = workspaceFolders[0].uri.fsPath;
    saveWorkspaceSettings(workspaceRoot, projectName, color);

    // Reload window to apply changes
    vscode.commands.executeCommand('workbench.action.reloadWindow');
  });

  context.subscriptions.push(disposable);
}

function deactivate() {}

module.exports = {
  activate,
  deactivate,
  // Export functions for testing
  saveWorkspaceSettings,
  requestInputProjectName,
  requestInputColour,
  requestInputCustomColour,
};