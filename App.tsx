import React from 'react';
import { StatusBar } from 'react-native';
import { RootNavigator } from './src/navigation';
import { colors } from './src/theme/colors';

function App(): React.JSX.Element {
  return (
    <>
      <StatusBar
        barStyle="dark-content"
        backgroundColor={colors.neutral.white}
      />
      <RootNavigator />
    </>
  );
}

export default App;