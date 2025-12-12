/**
 * Validates if a string is a valid hex color code
 * @param {string} value - The color code to validate (e.g., '#36558f' or '#fff')
 * @returns {boolean} True if valid hex color, false otherwise
 */
function isValidHexColor(value) {
  return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(value);
}

/**
 * Validation error message for hex color input
 */
const HEX_COLOR_VALIDATION_ERROR = 'Please enter a valid hex color code (e.g., #2d5a87)';

/**
 * Predefined color palette for the extension
 * Includes 10 preset colors plus a custom option
 */
const PREDEFINED_COLORS = [
  { label: '🔵 Blue', value: '#36558f' },
  { label: '🔴 Red', value: '#7d4a4a' },
  { label: '🟢 Green', value: '#4a6b4a' },
  { label: '🟣 Purple', value: '#553366' },
  { label: '🟠 Orange', value: '#8b6f47' },
  { label: '🟡 Yellow', value: '#8b8b3a' },
  { label: '⚫ Dark Gray', value: '#3d3d3d' },
  { label: '⚪ Light Gray', value: '#5a5a5a' },
  { label: '🟤 Brown', value: '#6B4F3A' },
  { label: '✏️ Custom Hex Code', value: 'custom' },
];

module.exports = {
  isValidHexColor,
  HEX_COLOR_VALIDATION_ERROR,
  PREDEFINED_COLORS,
};
