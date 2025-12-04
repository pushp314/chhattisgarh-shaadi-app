import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { SegmentedButtons, Surface, Text } from 'react-native-paper';
import { Theme } from '../../constants/theme';
import InterestsView from './InterestsView';
import ShortlistScreen from '../profile/ShortlistScreen';
import WhoViewedMeScreen from '../profile/WhoViewedMeScreen';

type ActivityTab = 'interests' | 'shortlist' | 'visits';

const ActivityScreen: React.FC = () => {
    const [activeTab, setActiveTab] = useState<ActivityTab>('interests');

    const renderContent = () => {
        switch (activeTab) {
            case 'interests':
                return <InterestsView />;
            case 'shortlist':
                return <ShortlistScreen />;
            case 'visits':
                return <WhoViewedMeScreen />;
            default:
                return null;
        }
    };

    return (
        <View style={styles.container}>
            <Surface style={styles.header} elevation={2}>
                <Text variant="titleLarge" style={styles.headerTitle}>
                    My Activity
                </Text>
                <SegmentedButtons
                    value={activeTab}
                    onValueChange={value => setActiveTab(value as ActivityTab)}
                    buttons={[
                        { value: 'interests', label: 'Interests' },
                        { value: 'shortlist', label: 'Shortlist' },
                        { value: 'visits', label: 'Visits' },
                    ]}
                    style={styles.segmentedButtons}
                />
            </Surface>

            <View style={styles.content}>
                {renderContent()}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Theme.colors.background,
    },
    header: {
        padding: 16,
        paddingTop: 50, // Status bar padding
        backgroundColor: Theme.colors.white,
    },
    headerTitle: {
        fontWeight: 'bold',
        marginBottom: 16,
        color: Theme.colors.text,
    },
    segmentedButtons: {
        backgroundColor: Theme.colors.white,
    },
    content: {
        flex: 1,
    },
});

export default ActivityScreen;
