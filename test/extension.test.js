const assert = require('assert');
const fs = require('fs');
const path = require('path');
const os = require('os');
const { isValidHexColor, PREDEFINED_COLORS } = require('../src/colorValidator');
const { saveWorkspaceSettings } = require('../extension');

// Note: VS Code module tests require the @vscode/test-cli environment
// These tests validate the extension's core logic and configuration

suite('Project Identity Extension Test Suite', () => {
	console.log('Starting Project Identity extension tests...');

	// ===== COLOR VALIDATION TESTS =====
	test('Hex color validation - valid hex codes should pass', () => {
		assert.ok(isValidHexColor('#36558f'), 'Valid 6-digit hex should pass');
		assert.ok(isValidHexColor('#fff'), 'Valid 3-digit hex should pass');
		assert.ok(isValidHexColor('#000000'), 'Black hex should pass');
		assert.ok(isValidHexColor('#FFFFFF'), 'Uppercase hex should pass');
	});

	test('Hex color validation - invalid hex codes should fail', () => {
		assert.strictEqual(isValidHexColor('#12345'), false, 'Invalid length hex should fail');
		assert.strictEqual(isValidHexColor('36558f'), false, 'Hex without # should fail');
		assert.strictEqual(isValidHexColor('#GGGGGG'), false, 'Invalid hex characters should fail');
		assert.strictEqual(isValidHexColor(''), false, 'Empty string should fail');
	});

	// ===== PREDEFINED COLORS TESTS =====
	test('Predefined colors should be valid hex codes', () => {
		// Filter out the custom color option, which has value 'custom', not a hex code
		const colorValues = PREDEFINED_COLORS
			.filter(color => color.value !== 'custom')
			.map(color => color.value);

		colorValues.forEach(color => {
			assert.ok(isValidHexColor(color), `Color ${color} should be valid hex`);
		});

		assert.strictEqual(colorValues.length, 9, 'Should have exactly 9 predefined color values');
		assert.strictEqual(PREDEFINED_COLORS.length, 10, 'Should have 9 colors plus 1 custom option');
	});

	test('Predefined colors should have valid labels', () => {
		PREDEFINED_COLORS.forEach(color => {
			assert.ok(color.label && color.label.length > 0, `Color should have a non-empty label`);
			assert.ok(color.value && color.value.length > 0, `Color should have a non-empty value`);
		});
	});

	// ===== SETTINGS STRUCTURE TESTS =====
	test('Color customization object should have required properties', () => {
		const colorSettings = {
			'titleBar.activeBackground': '#36558f',
			'titleBar.activeForeground': '#ffffff',
			'titleBar.inactiveBackground': '#36558f',
			'titleBar.inactiveForeground': '#cccccc',
			'statusBar.background': '#36558f',
			'statusBar.foreground': '#ffffff',
			'activityBar.border': '#36558f',
			'sideBar.border': '#36558f'
		};

		const requiredKeys = [
			'titleBar.activeBackground',
			'titleBar.activeForeground',
			'statusBar.background',
			'statusBar.foreground'
		];

		requiredKeys.forEach(key => {
			assert.ok(colorSettings.hasOwnProperty(key), `Color settings should have ${key} property`);
		});
	});

	test('Settings object structure should be valid', () => {
		const settings = {
			'window.title': '${projectName} - ${rootName}',
			'workbench.colorCustomizations': {
				'titleBar.activeBackground': '#36558f',
				'titleBar.activeForeground': '#ffffff'
			}
		};

		assert.ok(settings.hasOwnProperty('window.title'), 'Settings should have window.title');
		assert.ok(settings.hasOwnProperty('workbench.colorCustomizations'), 'Settings should have colorCustomizations');
		assert.ok(typeof settings['workbench.colorCustomizations'] === 'object', 'ColorCustomizations should be an object');
	});

	// ===== INPUT VALIDATION TESTS =====
	test('Project name should not be empty', () => {
		const projectNames = ['Frontend', 'Backend', 'AI-Feature', 'Testing'];
		
		projectNames.forEach(name => {
			assert.ok(name && name.trim().length > 0, `Project name "${name}" should not be empty`);
		});
	});

	// ===== FILE OPERATIONS TESTS =====
	test('Backup file naming convention should be valid', () => {
		const timestamp = Date.now();
		const backupFilename = `settings.json.backup.${timestamp}`;
		
		assert.ok(backupFilename.startsWith('settings.json.backup.'), 'Backup filename should start with settings.json.backup.');
		assert.ok(/^\d+$/.test(timestamp.toString()), 'Timestamp should be numeric');
	});

	test('File paths should use proper separators', () => {
		const settingsPath = path.join('.vscode', 'settings.json');
		
		assert.ok(settingsPath.includes('settings.json'), 'Path should include settings.json');
		assert.ok(settingsPath.includes('.vscode'), 'Path should include .vscode directory');
	});

	test('JSON merge operation should preserve existing settings', () => {
		const existingSettings = {
			'editor.fontSize': 14,
			'editor.theme': 'Dark+'
		};

		const newSettings = {
			'window.title': 'Project - ${rootName}'
		};

		const mergedSettings = { ...existingSettings, ...newSettings };

		assert.strictEqual(mergedSettings['editor.fontSize'], 14, 'Existing settings should be preserved');
		assert.strictEqual(mergedSettings['window.title'], 'Project - ${rootName}', 'New settings should be added');
		assert.strictEqual(Object.keys(mergedSettings).length, 3, 'Merged object should have all properties');
	});

	// ===== WORKSPACE SETTINGS FUNCTION TESTS =====
	test('saveWorkspaceSettings should create .vscode directory if it does not exist', () => {
		const tempDir = path.join(os.tmpdir(), `test-${Date.now()}`);
		
		try {
			assert.ok(!fs.existsSync(tempDir), 'Temp directory should not exist initially');
			
			saveWorkspaceSettings(tempDir, 'TestProject', '#36558f');
			
			const vscodeDir = path.join(tempDir, '.vscode');
			assert.ok(fs.existsSync(vscodeDir), '.vscode directory should be created');
		} finally {
			// Cleanup
			if (fs.existsSync(tempDir)) {
				fs.rmSync(tempDir, { recursive: true, force: true });
			}
		}
	});

	test('saveWorkspaceSettings should create settings.json file', () => {
		const tempDir = path.join(os.tmpdir(), `test-${Date.now()}`);
		
		try {
			saveWorkspaceSettings(tempDir, 'TestProject', '#36558f');
			
			const settingsFile = path.join(tempDir, '.vscode', 'settings.json');
			assert.ok(fs.existsSync(settingsFile), 'settings.json should be created');
		} finally {
			// Cleanup
			if (fs.existsSync(tempDir)) {
				fs.rmSync(tempDir, { recursive: true, force: true });
			}
		}
	});

	test('saveWorkspaceSettings should write valid JSON to settings.json', () => {
		const tempDir = path.join(os.tmpdir(), `test-${Date.now()}`);
		const projectName = 'TestProject';
		const color = '#36558f';
		
		try {
			saveWorkspaceSettings(tempDir, projectName, color);
			
			const settingsFile = path.join(tempDir, '.vscode', 'settings.json');
			const content = fs.readFileSync(settingsFile, 'utf8');
			const settings = JSON.parse(content);
			
			assert.ok(settings['window.title'], 'Settings should contain window.title');
			assert.ok(settings['workbench.colorCustomizations'], 'Settings should contain colorCustomizations');
		} finally {
			// Cleanup
			if (fs.existsSync(tempDir)) {
				fs.rmSync(tempDir, { recursive: true, force: true });
			}
		}
	});

	test('saveWorkspaceSettings should include project name in window title', () => {
		const tempDir = path.join(os.tmpdir(), `test-${Date.now()}`);
		const projectName = 'CustomProjectName';
		const color = '#36558f';
		
		try {
			saveWorkspaceSettings(tempDir, projectName, color);
			
			const settingsFile = path.join(tempDir, '.vscode', 'settings.json');
			const content = fs.readFileSync(settingsFile, 'utf8');
			const settings = JSON.parse(content);
			
			assert.ok(settings['window.title'].includes(projectName), `Window title should include project name "${projectName}"`);
		} finally {
			// Cleanup
			if (fs.existsSync(tempDir)) {
				fs.rmSync(tempDir, { recursive: true, force: true });
			}
		}
	});

	test('saveWorkspaceSettings should apply color customizations', () => {
		const tempDir = path.join(os.tmpdir(), `test-${Date.now()}`);
		const projectName = 'TestProject';
		const color = '#ff0000';
		
		try {
			saveWorkspaceSettings(tempDir, projectName, color);
			
			const settingsFile = path.join(tempDir, '.vscode', 'settings.json');
			const content = fs.readFileSync(settingsFile, 'utf8');
			const settings = JSON.parse(content);
			
			const customizations = settings['workbench.colorCustomizations'];
			assert.strictEqual(customizations['titleBar.activeBackground'], color, 'Title bar background should match color');
			assert.strictEqual(customizations['statusBar.background'], color, 'Status bar background should match color');
			assert.strictEqual(customizations['activityBar.border'], color, 'Activity bar border should match color');
		} finally {
			// Cleanup
			if (fs.existsSync(tempDir)) {
				fs.rmSync(tempDir, { recursive: true, force: true });
			}
		}
	});

	test('saveWorkspaceSettings should preserve existing settings', () => {
		const tempDir = path.join(os.tmpdir(), `test-${Date.now()}`);
		
		try {
			// Create initial settings
			const vscodeDir = path.join(tempDir, '.vscode');
			fs.mkdirSync(vscodeDir, { recursive: true });
			const settingsFile = path.join(vscodeDir, 'settings.json');
			fs.writeFileSync(settingsFile, JSON.stringify({ 'editor.fontSize': 14 }));
			
			// Save new settings
			saveWorkspaceSettings(tempDir, 'TestProject', '#36558f');
			
			// Verify both old and new settings exist
			const content = fs.readFileSync(settingsFile, 'utf8');
			const settings = JSON.parse(content);
			
			assert.strictEqual(settings['editor.fontSize'], 14, 'Existing editor.fontSize should be preserved');
			assert.ok(settings['window.title'], 'New window.title should be added');
		} finally {
			// Cleanup
			if (fs.existsSync(tempDir)) {
				fs.rmSync(tempDir, { recursive: true, force: true });
			}
		}
	});

	test('saveWorkspaceSettings should create backup of existing settings', () => {
		const tempDir = path.join(os.tmpdir(), `test-${Date.now()}`);
		
		try {
			// Create initial settings
			const vscodeDir = path.join(tempDir, '.vscode');
			fs.mkdirSync(vscodeDir, { recursive: true });
			const settingsFile = path.join(vscodeDir, 'settings.json');
			const originalContent = JSON.stringify({ 'editor.fontSize': 14 });
			fs.writeFileSync(settingsFile, originalContent);
			
			// Save new settings
			saveWorkspaceSettings(tempDir, 'TestProject', '#36558f');
			
			// Check for backup file
			const files = fs.readdirSync(vscodeDir);
			const backupFiles = files.filter(f => f.startsWith('settings.json.backup.'));
			
			assert.ok(backupFiles.length > 0, 'A backup file should be created');
			
			if (backupFiles.length > 0) {
				const backupPath = path.join(vscodeDir, backupFiles[0]);
				const backupContent = fs.readFileSync(backupPath, 'utf8');
				assert.strictEqual(backupContent, originalContent, 'Backup should contain original content');
			}
		} finally {
			// Cleanup
			if (fs.existsSync(tempDir)) {
				fs.rmSync(tempDir, { recursive: true, force: true });
			}
		}
	});
});
