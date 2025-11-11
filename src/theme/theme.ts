// OVERWRITE: src/theme/theme.ts
import {
  MD3LightTheme as DefaultTheme,
  // configureFonts, // Commented out as it's not used
} from 'react-native-paper';

// TODO: Configure fonts if you have custom ones
// const fontConfig = { // Commented out as it's not used
//   // Add font config
// };

export const theme = {
  ...DefaultTheme,
  // TODO: Add your custom theme colors
  colors: {
    ...DefaultTheme.colors,
    primary: '#6200ee',
    accent: '#03dac4', // Note: 'accent' is deprecated in MD3, consider 'secondary'
  },
  // If you uncomment 'fonts', be sure to uncomment
  // 'configureFonts' and 'fontConfig' above.
  // fonts: configureFonts({config: fontConfig, isV3: true}),
};