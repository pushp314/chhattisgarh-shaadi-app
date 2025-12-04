import React, { createContext, useContext, useState, useEffect } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Theme, DarkTheme } from '../constants/theme';

type ThemeType = typeof Theme;

interface ThemeContextType {
    theme: ThemeType;
    isDark: boolean;
    toggleTheme: () => void;
    setThemeMode: (mode: 'light' | 'dark' | 'system') => void;
    themeMode: 'light' | 'dark' | 'system';
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const systemScheme = useColorScheme();
    const [themeMode, setThemeModeState] = useState<'light' | 'dark' | 'system'>('system');
    const [isDark, setIsDark] = useState(systemScheme === 'dark');

    useEffect(() => {
        loadThemePreference();
    }, []);

    useEffect(() => {
        if (themeMode === 'system') {
            setIsDark(systemScheme === 'dark');
        } else {
            setIsDark(themeMode === 'dark');
        }
    }, [themeMode, systemScheme]);

    const loadThemePreference = async () => {
        try {
            const savedMode = await AsyncStorage.getItem('themeMode');
            if (savedMode) {
                setThemeModeState(savedMode as 'light' | 'dark' | 'system');
            }
        } catch (error) {
            console.log('Error loading theme preference:', error);
        }
    };

    const setThemeMode = async (mode: 'light' | 'dark' | 'system') => {
        setThemeModeState(mode);
        try {
            await AsyncStorage.setItem('themeMode', mode);
        } catch (error) {
            console.log('Error saving theme preference:', error);
        }
    };

    const toggleTheme = () => {
        const newMode = isDark ? 'light' : 'dark';
        setThemeMode(newMode);
    };

    const theme = isDark ? DarkTheme : Theme;

    return (
        <ThemeContext.Provider value={{ theme, isDark, toggleTheme, setThemeMode, themeMode }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};
