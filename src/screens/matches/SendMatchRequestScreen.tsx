import React, { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import {
  Text,
  TextInput,
  Button,
  Surface,
  ActivityIndicator,
} from 'react-native-paper';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { HomeStackParamList } from '../../navigation/types';
import { Theme } from '../../constants/theme';
import matchService from '../../services/match.service';
import ProfileCard from '../../components/ProfileCard';

type SendMatchRequestScreenNavigationProp = NativeStackNavigationProp<
  HomeStackParamList,
  'SendMatchRequest'
>;

type SendMatchRequestScreenRouteProp = RouteProp<
  HomeStackParamList,
  'SendMatchRequest'
>;

type Props = {
  navigation: SendMatchRequestScreenNavigationProp;
  route: SendMatchRequestScreenRouteProp;
};

const SendMatchRequestScreen: React.FC<Props> = ({ navigation, route }) => {
  const { profile } = route.params;
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSendRequest = async () => {
    if (!profile.id) return;

    setIsSubmitting(true);
    try {
      await matchService.sendMatchRequest(profile.id, message);
      Alert.alert(
        'Success',
        'Match request sent successfully!',
        [{ text: 'OK', onPress: () => navigation.goBack() }]
      );
    } catch (error: any) {
      console.error('Error sending match request:', error);
      Alert.alert('Error', error.response?.data?.message || 'Failed to send match request');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      <Surface style={styles.content} elevation={0}>
        <Text variant="titleLarge" style={styles.title}>
          Send Match Request
        </Text>
        <Text variant="bodyMedium" style={styles.subtitle}>
          Send a request to {profile.firstName} to express your interest.
        </Text>

        <View style={styles.profilePreview}>
          <ProfileCard profile={profile} onPress={() => { }} />
        </View>

        <TextInput
          mode="outlined"
          label="Message (Optional)"
          placeholder="Write a short message..."
          value={message}
          onChangeText={setMessage}
          multiline
          numberOfLines={4}
          style={styles.input}
          outlineColor={Theme.colors.border}
          activeOutlineColor={Theme.colors.primary}
        />

        <Button
          mode="contained"
          onPress={handleSendRequest}
          loading={isSubmitting}
          disabled={isSubmitting}
          style={styles.button}
          contentStyle={styles.buttonContent}>
          Send Request
        </Button>
      </Surface>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.colors.background,
  },
  content: {
    padding: 16,
    flex: 1,
  },
  title: {
    fontWeight: 'bold',
    marginBottom: 8,
    color: Theme.colors.text,
  },
  subtitle: {
    color: Theme.colors.textSecondary,
    marginBottom: 24,
  },
  profilePreview: {
    marginBottom: 24,
    pointerEvents: 'none', // Disable interaction with the card preview
  },
  input: {
    backgroundColor: Theme.colors.white,
    marginBottom: 24,
  },
  button: {
    marginTop: 'auto',
    marginBottom: 16,
  },
  buttonContent: {
    paddingVertical: 8,
  },
});

export default SendMatchRequestScreen;
