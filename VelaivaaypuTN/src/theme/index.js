import { MD3LightTheme } from 'react-native-paper';

export const theme = {
    ...MD3LightTheme,
    colors: {
        ...MD3LightTheme.colors,
        primary: '#1A5F7A', // Deep Professional Blue
        secondary: '#159895', // Teal Accent
        accent: '#FBC02D', // Gold Accent
        background: '#F8FAFC', // Slate background
        surface: '#FFFFFF',
        text: '#1E293B',
        textLight: '#64748B',
        error: '#EF4444',
        success: '#10B981',
        warning: '#F59E0B',
        onPrimary: '#FFFFFF',
    },
    gradients: {
        primary: ['#1A5F7A', '#159895'],
        premium: ['#FBC02D', '#D4AF37'],
        surface: ['#FFFFFF', '#F8FAFC'],
    },
    glass: {
        background: 'rgba(255, 255, 255, 0.7)',
        border: 'rgba(255, 255, 255, 0.3)',
    },
    shadows: {
        small: {
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.05,
            shadowRadius: 3,
            elevation: 2,
        },
        medium: {
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.1,
            shadowRadius: 6,
            elevation: 4,
        },
        large: {
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 10 },
            shadowOpacity: 0.15,
            shadowRadius: 12,
            elevation: 8,
        },
    },
    spacing: {
        xs: 4,
        s: 8,
        m: 16,
        l: 24,
        xl: 32,
    },
    layout: {
        headerHeight: 64,
        cardRadius: 20,
        inputRadius: 12,
    },
    roundness: 12,
    fonts: {
        ...MD3LightTheme.fonts,
    },
};
