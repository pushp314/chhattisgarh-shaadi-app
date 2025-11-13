import React, {useEffect, useState} from 'react';
import {View, ScrollView, StyleSheet, RefreshControl} from 'react-native';
import {
  Text,
  Card,
  Button,
  ProgressBar,
  Surface,
  ActivityIndicator,
} from 'react-native-paper';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {HomeStackParamList} from '../../navigation/types';
import {useAuthStore} from '../../store/authStore';
import {useProfileStore} from '../../store/profileStore';

type HomeScreenNavigationProp = NativeStackNavigationProp<
  HomeStackParamList,
  'HomeScreen'
>;

type Props = {
  navigation: HomeScreenNavigationProp;
};

const HomeScreen: React.FC<Props> = ({navigation}) => {
  const user = useAuthStore(state => state.user);
  const {profile, profileCompleteness, fetchProfile} = useProfileStore();
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async (isRefresh = false) => {
    if (isRefresh) {
      setRefreshing(true);
    } else {
      setIsLoading(true);
    }

    try {
      await fetchProfile();
    } catch (error) {
      console.error('Error loading home data:', error);
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  const renderProfileCompletion = () => {
    if (!profile || profileCompleteness === 100) return null;

    return (
      <Card style={styles.completionCard}>
        <Card.Content>
          <View style={styles.completionHeader}>
            <Icon name="account-check" size={32} color="#FF9800" />
            <View style={styles.completionInfo}>
              <Text variant="titleMedium" style={styles.completionTitle}>
                Complete Your Profile
              </Text>
              <Text variant="bodySmall" style={styles.completionSubtitle}>
                {profileCompleteness}% Complete
              </Text>
            </View>
          </View>
          <ProgressBar
            progress={profileCompleteness / 100}
            color="#FF9800"
            style={styles.progressBar}
          />
          <Text variant="bodySmall" style={styles.completionText}>
            A complete profile gets 5x more attention!
          </Text>
          <Button
            mode="contained"
            onPress={() => navigation.navigate('ProfileDetails', {userId: user?.id!})}
            style={styles.completeButton}
            buttonColor="#FF9800">
            Complete Profile
          </Button>
        </Card.Content>
      </Card>
    );
  };

  const renderQuickActions = () => {
    return (
      <View style={styles.quickActions}>
        <Text variant="titleMedium" style={styles.sectionTitle}>
          Quick Actions
        </Text>
        <View style={styles.actionGrid}>
          <Surface style={styles.actionCard} elevation={1}>
            <Icon name="account-search" size={40} color="#D81B60" />
            <Text variant="bodyMedium" style={styles.actionLabel}>
              Browse
            </Text>
            <Text variant="bodySmall" style={styles.actionSubtext}>
              Profiles
            </Text>
            <Button
              mode="text"
              onPress={() => navigation.getParent()?.navigate('Search')}
              compact>
              Go
            </Button>
          </Surface>

          <Surface style={styles.actionCard} elevation={1}>
            <Icon name="heart" size={40} color="#E91E63" />
            <Text variant="bodyMedium" style={styles.actionLabel}>
              My
            </Text>
            <Text variant="bodySmall" style={styles.actionSubtext}>
              Matches
            </Text>
            <Button
              mode="text"
              onPress={() => navigation.getParent()?.navigate('Matches')}
              compact>
              Go
            </Button>
          </Surface>

          <Surface style={styles.actionCard} elevation={1}>
            <Icon name="chat" size={40} color="#2196F3" />
            <Text variant="bodyMedium" style={styles.actionLabel}>
              Messages
            </Text>
            <Text variant="bodySmall" style={styles.actionSubtext}>
              Chat
            </Text>
            <Button
              mode="text"
              onPress={() => navigation.getParent()?.navigate('Messages')}
              compact>
              Go
            </Button>
          </Surface>

          <Surface style={styles.actionCard} elevation={1}>
            <Icon name="account" size={40} color="#4CAF50" />
            <Text variant="bodyMedium" style={styles.actionLabel}>
              My
            </Text>
            <Text variant="bodySmall" style={styles.actionSubtext}>
              Profile
            </Text>
            <Button
              mode="text"
              onPress={() => navigation.getParent()?.navigate('Profile')}
              compact>
              Go
            </Button>
          </Surface>
        </View>
      </View>
    );
  };

  const renderWelcomeSection = () => {
    const firstName = profile?.firstName || user?.email?.split('@')[0] || 'User';
    
    return (
      <Surface style={styles.welcomeCard} elevation={2}>
        <View style={styles.welcomeContent}>
          <View>
            <Text variant="headlineSmall" style={styles.welcomeTitle}>
              Welcome back, {firstName}!
            </Text>
            <Text variant="bodyMedium" style={styles.welcomeSubtitle}>
              Find your perfect match in Chhattisgarh
            </Text>
          </View>
          <Icon name="hand-wave" size={48} color="#FFB300" />
        </View>
      </Surface>
    );
  };

  const renderTipsSection = () => {
    return (
      <Card style={styles.tipsCard}>
        <Card.Content>
          <View style={styles.tipsHeader}>
            <Icon name="lightbulb-on" size={24} color="#FF9800" />
            <Text variant="titleMedium" style={styles.tipsTitle}>
              Tips for Success
            </Text>
          </View>
          <View style={styles.tipsList}>
            <View style={styles.tipItem}>
              <Icon name="check-circle" size={20} color="#4CAF50" />
              <Text variant="bodySmall" style={styles.tipText}>
                Upload clear, recent photos for better matches
              </Text>
            </View>
            <View style={styles.tipItem}>
              <Icon name="check-circle" size={20} color="#4CAF50" />
              <Text variant="bodySmall" style={styles.tipText}>
                Complete all profile sections to increase visibility
              </Text>
            </View>
            <View style={styles.tipItem}>
              <Icon name="check-circle" size={20} color="#4CAF50" />
              <Text variant="bodySmall" style={styles.tipText}>
                Respond to match requests within 24 hours
              </Text>
            </View>
          </View>
        </Card.Content>
      </Card>
    );
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#D81B60" />
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={() => loadData(true)}
        />
      }>
      {renderWelcomeSection()}
      {renderProfileCompletion()}
      {renderQuickActions()}
      {renderTipsSection()}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    padding: 16,
  },
  welcomeCard: {
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 16,
  },
  welcomeContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  welcomeTitle: {
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#333',
  },
  welcomeSubtitle: {
    color: '#666',
  },
  completionCard: {
    marginBottom: 16,
    backgroundColor: '#FFF3E0',
  },
  completionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  completionInfo: {
    marginLeft: 12,
    flex: 1,
  },
  completionTitle: {
    fontWeight: 'bold',
    color: '#333',
  },
  completionSubtitle: {
    color: '#666',
    marginTop: 2,
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
    marginBottom: 8,
  },
  completionText: {
    color: '#666',
    marginBottom: 12,
  },
  completeButton: {
    marginTop: 4,
  },
  quickActions: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333',
  },
  actionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  actionCard: {
    flex: 1,
    minWidth: '45%',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  actionLabel: {
    fontWeight: 'bold',
    marginTop: 8,
    textAlign: 'center',
  },
  actionSubtext: {
    color: '#666',
    textAlign: 'center',
    marginBottom: 8,
  },
  tipsCard: {
    marginBottom: 16,
    backgroundColor: '#fff',
  },
  tipsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  tipsTitle: {
    marginLeft: 8,
    fontWeight: 'bold',
    color: '#333',
  },
  tipsList: {
    gap: 12,
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  tipText: {
    flex: 1,
    color: '#666',
    lineHeight: 20,
  },
});

export default HomeScreen;
