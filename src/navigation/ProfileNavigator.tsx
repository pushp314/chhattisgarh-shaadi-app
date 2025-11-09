import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ProfileStackParamList } from './types';
import { CreateProfileScreen } from '../screens/profile';

const Stack = createNativeStackNavigator<ProfileStackParamList>();

interface ProfileNavigatorProps {
  onProfileComplete: () => void;
}

const ProfileNavigator: React.FC<ProfileNavigatorProps> = ({ onProfileComplete }) => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="CreateProfile">
        {(props) => <CreateProfileScreen {...props} onComplete={onProfileComplete} />}
      </Stack.Screen>
    </Stack.Navigator>
  );
};

export default ProfileNavigator;