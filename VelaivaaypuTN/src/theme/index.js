import { MD3LightTheme } from 'react-native-paper';

export const theme = {
    ...MD3LightTheme,
    colors: {
        ...MD3LightTheme.colors,
        primary: '#1A5F7A', // Deep Professional Blue
        secondary: '#159895', // Teal Accent
        background: '#F7F9FC', // Clean Light Gray (Not stark white)
        surface: '#FFFFFF',
        text: '#2C3335',
        error: '#D32F2F',
        onPrimary: '#FFFFFF',
        elevation: {
            level1: '0px 2px 4px rgba(0, 0, 0, 0.05)',
            level2: '0px 4px 8px rgba(0, 0, 0, 0.1)',
        }
    },
    roundness: 12, // Modern rounded corners
    fonts: {
        ...MD3LightTheme.fonts,
        // We can customise fonts later if we add custom font files
    },
};
