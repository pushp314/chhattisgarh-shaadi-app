/**
 * Premium Matrimonial Theme
 * Centralized theme configuration for Chhattisgarh Shaadi app
 */

// ===== COLOR PALETTE =====

export const Colors = {
    // Primary Brand Colors
    loveRed: '#E7383F',
    deepMaroon: '#C0221C',

    // Secondary & Accent Colors
    romanticSoftPink: '#F18C95',
    luxuryGold: '#FAC035',
    luxuryGoldAlt: '#FFD933',
    pastelPeach: '#F9DFC0',
    pastelPeachAlt: '#FEF1EF',
    blushPink: '#FAD2D8',

    // Supportive Greens (use lightly)
    harmonyGreen: '#097533',
    freshGreenAccent: '#7DBA2C',

    // Background & Surfaces
    lightRomanticBg: '#FEF1EF',
    lightRomanticBgAlt: '#FCE7EA',
    cardBgPeach: '#F9DFC0',
    cardBgBlush: '#FAD2D8',
    white: '#FFFFFF',

    // Text Colors
    textPrimary: '#3F3A3B',
    textSecondary: '#ADA5A4',
    textTertiary: '#332F30',
    textLight: '#FFFFFF',

    // Utility Colors
    error: '#E7383F', // Same as love red
    success: '#097533', // Same as harmony green
    warning: '#FAC035', // Same as luxury gold
    disabled: '#E0E0E0',
};

export const DarkColors = {
    // Primary Brand Colors
    loveRed: '#FF6B6B', // Lighter red for dark mode
    deepMaroon: '#FF8A8A', // Lighter maroon

    // Secondary & Accent Colors
    romanticSoftPink: '#FFB3B3',
    luxuryGold: '#FFD700',
    luxuryGoldAlt: '#FFE066',
    pastelPeach: '#4A3B3B', // Darker peach
    pastelPeachAlt: '#3D2E2E',
    blushPink: '#5C3A3A',

    // Background & Surfaces
    lightRomanticBg: '#121212',
    lightRomanticBgAlt: '#1E1E1E',
    cardBgPeach: '#2C2C2C',
    cardBgBlush: '#332222',
    white: '#1E1E1E', // Dark surface

    // Text Colors
    textPrimary: '#FFFFFF',
    textSecondary: '#B0B0B0',
    textTertiary: '#E0E0E0',
    textLight: '#000000',

    // Utility Colors
    error: '#FF6B6B',
    success: '#4CAF50',
    warning: '#FFD700',
    disabled: '#555555',
};

// ===== SEMANTIC COLOR TOKENS =====

export const Theme = {
    colors: {
        // Primary
        primary: Colors.loveRed,
        primaryDark: Colors.deepMaroon,
        primaryLight: Colors.romanticSoftPink,

        // Secondary/Accent
        secondary: Colors.luxuryGold,
        secondaryAlt: Colors.luxuryGoldAlt,
        accent: Colors.romanticSoftPink,

        // Backgrounds
        background: Colors.lightRomanticBg,
        backgroundAlt: Colors.lightRomanticBgAlt,
        surface: Colors.white,
        surfaceCard: Colors.cardBgPeach,
        surfaceCardAlt: Colors.cardBgBlush,
        white: Colors.white,

        // Text
        text: Colors.textPrimary,
        textSecondary: Colors.textSecondary,
        textTertiary: Colors.textTertiary,
        textOnPrimary: Colors.textLight,
        textOnSecondary: Colors.deepMaroon,

        // Status
        success: Colors.harmonyGreen,
        successLight: Colors.freshGreenAccent,
        error: Colors.error,
        warning: Colors.warning,

        // Borders
        border: '#E8E1E0',
        borderFocus: Colors.luxuryGold,
        borderError: Colors.error,

        // Overlays
        overlay: 'rgba(63, 58, 59, 0.5)',
        modalBackground: 'rgba(0, 0, 0, 0.6)',
    },

    // ===== GRADIENTS =====
    gradients: {
        primary: ['#E7383F', '#C0221C'], // Love Red → Deep Maroon
        romantic: ['#F18C95', '#F9DFC0'], // Romantic Pink → Pastel Peach
        gold: ['#FAC035', '#FFD933'], // Luxury Gold gradient
        header: ['#E7383F', '#F18C95'], // Love Red → Romantic Pink
        card: ['#FEF1EF', '#FCE7EA'], // Light romantic backgrounds
    },

    // ===== SPACING =====
    spacing: {
        xs: 4,
        sm: 8,
        md: 16,
        lg: 24,
        xl: 32,
        xxl: 40,
        xxxl: 48,
    },

    // ===== TYPOGRAPHY =====
    typography: {
        fontFamily: {
            regular: 'System',
            medium: 'System',
            bold: 'System',
        },
        fontSize: {
            xs: 11,
            sm: 13,
            md: 15,
            lg: 18,
            xl: 22,
            xxl: 28,
            xxxl: 36,
        },
        fontWeight: {
            regular: '400' as const,
            medium: '500' as const,
            semibold: '600' as const,
            bold: '700' as const,
        },
        lineHeight: {
            tight: 1.2,
            normal: 1.5,
            relaxed: 1.8,
        },
    },

    // ===== BORDER RADIUS =====
    borderRadius: {
        none: 0,
        sm: 4,
        md: 8,
        lg: 12,
        xl: 16,
        xxl: 24,
        round: 999,
    },

    // ===== SHADOWS =====
    shadows: {
        none: {
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 0 },
            shadowOpacity: 0,
            shadowRadius: 0,
            elevation: 0,
        },
        sm: {
            shadowColor: '#3F3A3B',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 2,
        },
        md: {
            shadowColor: '#3F3A3B',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.15,
            shadowRadius: 8,
            elevation: 4,
        },
        lg: {
            shadowColor: '#3F3A3B',
            shadowOffset: { width: 0, height: 8 },
            shadowOpacity: 0.2,
            shadowRadius: 16,
            elevation: 8,
        },
    },

    // ===== COMPONENT PRESETS =====
    components: {
        button: {
            primary: {
                background: Colors.loveRed,
                text: Colors.textLight,
                borderRadius: 24,
            },
            secondary: {
                background: Colors.luxuryGold,
                text: Colors.deepMaroon,
                borderRadius: 24,
            },
            outlined: {
                background: 'transparent',
                text: Colors.deepMaroon,
                border: Colors.deepMaroon,
                borderRadius: 24,
            },
        },
        input: {
            background: Colors.white,
            border: '#E8E1E0',
            borderFocus: Colors.luxuryGold,
            text: Colors.textPrimary,
            placeholder: Colors.textSecondary,
            borderRadius: 12,
        },
        card: {
            background: Colors.white,
            backgroundAlt: Colors.cardBgPeach,
            border: 'transparent',
            borderRadius: 16,
            shadow: {
                shadowColor: '#3F3A3B',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 8,
                elevation: 3,
            },
        },
    },
};

export const DarkTheme = {
    colors: {
        // Primary
        primary: DarkColors.loveRed,
        primaryDark: DarkColors.deepMaroon,
        primaryLight: DarkColors.romanticSoftPink,

        // Secondary/Accent
        secondary: DarkColors.luxuryGold,
        secondaryAlt: DarkColors.luxuryGoldAlt,
        accent: DarkColors.romanticSoftPink,

        // Backgrounds
        background: DarkColors.lightRomanticBg,
        backgroundAlt: DarkColors.lightRomanticBgAlt,
        surface: DarkColors.white,
        surfaceCard: DarkColors.cardBgPeach,
        surfaceCardAlt: DarkColors.cardBgBlush,
        white: DarkColors.white,

        // Text
        text: DarkColors.textPrimary,
        textSecondary: DarkColors.textSecondary,
        textTertiary: DarkColors.textTertiary,
        textOnPrimary: DarkColors.textLight,
        textOnSecondary: DarkColors.deepMaroon,

        // Status
        success: DarkColors.success,
        successLight: DarkColors.success,
        error: DarkColors.error,
        warning: DarkColors.warning,

        // Borders
        border: '#333333',
        borderFocus: DarkColors.luxuryGold,
        borderError: DarkColors.error,

        // Overlays
        overlay: 'rgba(0, 0, 0, 0.7)',
        modalBackground: 'rgba(0, 0, 0, 0.8)',
    },
    gradients: Theme.gradients, // Reuse gradients for now
    spacing: Theme.spacing,
    typography: Theme.typography,
    borderRadius: Theme.borderRadius,
    shadows: Theme.shadows,
    components: Theme.components, // Reuse component presets
};

// ===== UTILITY FUNCTIONS =====

export const createGradient = (colors: string[]) => colors;

export const withOpacity = (color: string, opacity: number) => {
    // Simple opacity helper for hex colors
    const hex = color.replace('#', '');
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
};

export default Theme;
