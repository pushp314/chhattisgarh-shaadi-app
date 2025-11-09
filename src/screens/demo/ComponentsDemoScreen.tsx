import React, { useState } from 'react';
import { ScrollView, View, Text, StyleSheet } from 'react-native';
import {
  Button,
  Input,
  Card,
  Avatar,
  Badge,
  Divider,
  Loader,
} from '../../components';
import { colors } from '../../theme/colors';

const ComponentsDemoScreen = () => {
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);

  const handleButtonPress = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 2000);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.sectionTitle}>Buttons</Text>
      <Card style={styles.section}>
        <Button title="Primary Button" onPress={handleButtonPress} />
        <Button
          title="Secondary Button"
          onPress={handleButtonPress}
          variant="secondary"
        />
        <Button
          title="Outline Button"
          onPress={handleButtonPress}
          variant="outline"
        />
        <Button
          title="Loading Button"
          onPress={handleButtonPress}
          loading={loading}
        />
        <Button
          title="Disabled Button"
          onPress={handleButtonPress}
          disabled
        />
      </Card>

      <Text style={styles.sectionTitle}>Inputs</Text>
      <Card style={styles.section}>
        <Input
          label="First Name"
          placeholder="Enter your first name"
          value={inputValue}
          onChangeText={setInputValue}
          required
        />
        <Input
          label="Email"
          placeholder="Enter your email"
          keyboardType="email-address"
          leftIcon={<Text>📧</Text>}
        />
        <Input
          label="Password"
          placeholder="Enter password"
          secureTextEntry
        />
        <Input
          label="Phone"
          placeholder="Enter phone"
          error="Invalid phone number"
          rightIcon={<Text>✓</Text>}
        />
      </Card>

      <Text style={styles.sectionTitle}>Avatars</Text>
      <Card style={styles.section}>
        <View style={styles.avatarRow}>
          <Avatar name="John Doe" size={60} />
          <Avatar name="Jane Smith" size={60} verified />
          <Avatar name="Bob Johnson" size={60} premium />
          <Avatar name="Alice Brown" size={60} online verified premium />
        </View>
      </Card>

      <Text style={styles.sectionTitle}>Badges</Text>
      <Card style={styles.section}>
        <View style={styles.badgeRow}>
          <Badge text="Success" color="success" />
          <Badge text="Warning" color="warning" />
          <Badge text="Error" color="error" />
          <Badge text="Info" color="info" />
        </View>
        <View style={styles.badgeRow}>
          <Badge text="Primary" color="primary" variant="outline" />
          <Badge text="Secondary" color="secondary" variant="outline" />
        </View>
      </Card>

      <Text style={styles.sectionTitle}>Divider</Text>
      <Card style={styles.section}>
        <Text>Content above divider</Text>
        <Divider />
        <Text>Content below divider</Text>
      </Card>

      <Text style={styles.sectionTitle}>Loader</Text>
      <Card style={styles.section}>
        <Loader text="Loading..." />
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.default,
  },
  content: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginTop: 20,
    marginBottom: 12,
  },
  section: {
    marginBottom: 20,
  },
  avatarRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    flexWrap: 'wrap',
  },
  badgeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 10,
  },
});

export default ComponentsDemoScreen;