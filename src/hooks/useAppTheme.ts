import { useColorScheme } from 'react-native';
import { Theme, DarkTheme } from '../constants/theme';

export const useAppTheme = () => {
    const colorScheme = useColorScheme();
    const isDark = colorScheme === 'dark';
    const theme = isDark ? DarkTheme : Theme;

    return {
        theme,
        isDark,
        colors: theme.colors,
    };
};
