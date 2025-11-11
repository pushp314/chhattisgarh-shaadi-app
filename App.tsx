// OVERWRITE: App.tsx
import 'react-native-gesture-handler'; // Must be at the top
import React, {useEffect} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {PaperProvider} from 'react-native-paper';
import {RootNavigator} from './src/navigation/RootNavigator';
import {theme} from './src/theme/theme';
import {StatusBar, useColorScheme} from 'react-native';
import {configureGoogleSignIn} from './src/services/google.config';

const App = () => {
  const colorScheme = useColorScheme();

  // TODO: Add support for dark theme
  const appTheme = theme; //
  // const appTheme = colorScheme === 'dark' ? darkTheme : lightTheme;

  useEffect(() => {
    // Configure Google Sign-In on app start
    configureGoogleSignIn();
  }, []);

  return (
    <PaperProvider theme={appTheme}>
      <NavigationContainer>
        <StatusBar
          barStyle={colorScheme === 'dark' ? 'light-content' : 'dark-content'}
          backgroundColor={appTheme.colors.background}
        />
        <RootNavigator />
      </NavigationContainer>
    </PaperProvider>
  );
};

export default App;