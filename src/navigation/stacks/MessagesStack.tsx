/**
 * Messages Stack Navigator
 */

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { MessagesStackParamList } from '../types';

import ConversationsListScreen from '../../screens/messages/ConversationsListScreen.tsx';
import ChatScreen from '../../screens/messages/ChatScreen.tsx';

const Stack = createNativeStackNavigator<MessagesStackParamList>();

const MessagesStack: React.FC = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="ConversationsList"
        component={ConversationsListScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ChatScreen"
        component={ChatScreen}
        options={({ route }) => ({ title: route.params.userName })}
      />
    </Stack.Navigator>
  );
};

export default MessagesStack;
