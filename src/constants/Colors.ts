/**
 * Apple System Colors
 * Based on iOS Human Interface Guidelines
 */

const tintColorLight = '#007AFF';
const tintColorDark = '#0A84FF';

export const Colors = {
  light: {
    text: '#000000',
    secondaryText: '#8E8E93', // System Gray
    background: '#F2F2F7', // System Grouped Background
    card: '#FFFFFF',       // System Background
    tint: tintColorLight,
    border: '#C6C6C8',     // System Separator
    icon: '#8E8E93',       // System Gray
    tabIconDefault: '#8E8E93',
    tabIconSelected: tintColorLight,
    success: '#34C759',    // System Green
    danger: '#FF3B30',     // System Red
    warning: '#FFCC00',    // System Orange
    up: '#FF3B30',         // Red for Up (Chinese Market)
    down: '#34C759',       // Green for Down (Chinese Market)
  },
  dark: {
    text: '#FFFFFF',
    secondaryText: '#98989D', // System Gray
    background: '#000000', // Pure Black for OLED
    card: '#1C1C1E',       // System Background
    tint: tintColorDark,
    border: '#38383A',     // System Separator
    icon: '#98989D',       // System Gray
    tabIconDefault: '#98989D',
    tabIconSelected: tintColorDark,
    success: '#30D158',    // System Green
    danger: '#FF453A',     // System Red
    warning: '#FFD60A',    // System Orange
    up: '#FF453A',         // Red for Up (Chinese Market)
    down: '#30D158',       // Green for Down (Chinese Market)
  },
};
