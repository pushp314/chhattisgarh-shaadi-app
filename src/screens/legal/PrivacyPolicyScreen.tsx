/**
 * Privacy Policy Screen
 * Displays app privacy policy - legal requirement
 */

import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Text, Surface } from 'react-native-paper';
import { Theme } from '../../constants/theme';

const PrivacyPolicyScreen: React.FC = () => {
    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.content}>
            <Surface style={styles.card} elevation={1}>
                <Text variant="headlineSmall" style={styles.title}>
                    Privacy Policy
                </Text>
                <Text variant="bodySmall" style={styles.lastUpdated}>
                    Last Updated: December 1, 2024
                </Text>

                <View style={styles.section}>
                    <Text variant="titleMedium" style={styles.sectionTitle}>
                        1. Information We Collect
                    </Text>
                    <Text variant="bodyMedium" style={styles.paragraph}>
                        We collect information you provide directly to us, including:
                    </Text>
                    <Text variant="bodyMedium" style={styles.bulletPoint}>
                        • Personal details (name, age, gender, contact information)
                    </Text>
                    <Text variant="bodyMedium" style={styles.bulletPoint}>
                        • Profile information (education, occupation, family details)
                    </Text>
                    <Text variant="bodyMedium" style={styles.bulletPoint}>
                        • Photos and media you upload
                    </Text>
                    <Text variant="bodyMedium" style={styles.bulletPoint}>
                        • Communication preferences and partner preferences
                    </Text>
                    <Text variant="bodyMedium" style={styles.bulletPoint}>
                        • Messages and interactions with other users
                    </Text>
                </View>

                <View style={styles.section}>
                    <Text variant="titleMedium" style={styles.sectionTitle}>
                        2. How We Use Your Information
                    </Text>
                    <Text variant="bodyMedium" style={styles.paragraph}>
                        We use the information we collect to:
                    </Text>
                    <Text variant="bodyMedium" style={styles.bulletPoint}>
                        • Provide and maintain our matrimonial services
                    </Text>
                    <Text variant="bodyMedium" style={styles.bulletPoint}>
                        • Match you with compatible profiles
                    </Text>
                    <Text variant="bodyMedium" style={styles.bulletPoint}>
                        • Facilitate communication between users
                    </Text>
                    <Text variant="bodyMedium" style={styles.bulletPoint}>
                        • Improve and personalize your experience
                    </Text>
                    <Text variant="bodyMedium" style={styles.bulletPoint}>
                        • Send you updates and notifications
                    </Text>
                    <Text variant="bodyMedium" style={styles.bulletPoint}>
                        • Ensure safety and prevent fraud
                    </Text>
                </View>

                <View style={styles.section}>
                    <Text variant="titleMedium" style={styles.sectionTitle}>
                        3. Information Sharing
                    </Text>
                    <Text variant="bodyMedium" style={styles.paragraph}>
                        We do not sell your personal information. We may share your information:
                    </Text>
                    <Text variant="bodyMedium" style={styles.bulletPoint}>
                        • With other users as part of your profile
                    </Text>
                    <Text variant="bodyMedium" style={styles.bulletPoint}>
                        • With service providers who assist our operations
                    </Text>
                    <Text variant="bodyMedium" style={styles.bulletPoint}>
                        • When required by law or to protect rights and safety
                    </Text>
                    <Text variant="bodyMedium" style={styles.bulletPoint}>
                        • With your consent or at your direction
                    </Text>
                </View>

                <View style={styles.section}>
                    <Text variant="titleMedium" style={styles.sectionTitle}>
                        4. Data Security
                    </Text>
                    <Text variant="bodyMedium" style={styles.paragraph}>
                        We implement appropriate security measures to protect your personal information.
                        However, no method of transmission over the internet is 100% secure. We use
                        encryption, secure servers, and regular security audits to safeguard your data.
                    </Text>
                </View>

                <View style={styles.section}>
                    <Text variant="titleMedium" style={styles.sectionTitle}>
                        5. Your Rights
                    </Text>
                    <Text variant="bodyMedium" style={styles.paragraph}>
                        You have the right to:
                    </Text>
                    <Text variant="bodyMedium" style={styles.bulletPoint}>
                        • Access and update your personal information
                    </Text>
                    <Text variant="bodyMedium" style={styles.bulletPoint}>
                        • Delete your account and associated data
                    </Text>
                    <Text variant="bodyMedium" style={styles.bulletPoint}>
                        • Control your privacy settings
                    </Text>
                    <Text variant="bodyMedium" style={styles.bulletPoint}>
                        • Opt-out of marketing communications
                    </Text>
                    <Text variant="bodyMedium" style={styles.bulletPoint}>
                        • Request a copy of your data
                    </Text>
                </View>

                <View style={styles.section}>
                    <Text variant="titleMedium" style={styles.sectionTitle}>
                        6. Photo Privacy
                    </Text>
                    <Text variant="bodyMedium" style={styles.paragraph}>
                        You control who can view your photos through privacy settings. Photos may be
                        visible to registered users, matched users, or hidden based on your preferences.
                        Watermarks can be applied to protect your photos.
                    </Text>
                </View>

                <View style={styles.section}>
                    <Text variant="titleMedium" style={styles.sectionTitle}>
                        7. Data Retention
                    </Text>
                    <Text variant="bodyMedium" style={styles.paragraph}>
                        We retain your information for as long as your account is active or as needed
                        to provide services. When you delete your account, we will delete or anonymize
                        your personal information within 30 days, except where required by law.
                    </Text>
                </View>

                <View style={styles.section}>
                    <Text variant="titleMedium" style={styles.sectionTitle}>
                        8. Children's Privacy
                    </Text>
                    <Text variant="bodyMedium" style={styles.paragraph}>
                        Our service is not intended for users under 18 years of age. We do not knowingly
                        collect information from children. If you believe a child has provided us with
                        personal information, please contact us immediately.
                    </Text>
                </View>

                <View style={styles.section}>
                    <Text variant="titleMedium" style={styles.sectionTitle}>
                        9. Changes to Privacy Policy
                    </Text>
                    <Text variant="bodyMedium" style={styles.paragraph}>
                        We may update this privacy policy from time to time. We will notify you of any
                        changes by posting the new policy on this page and updating the "Last Updated"
                        date.
                    </Text>
                </View>

                <View style={styles.section}>
                    <Text variant="titleMedium" style={styles.sectionTitle}>
                        10. Contact Us
                    </Text>
                    <Text variant="bodyMedium" style={styles.paragraph}>
                        If you have questions about this Privacy Policy, please contact us at:
                    </Text>
                    <Text variant="bodyMedium" style={styles.contactText}>
                        Email: privacy@chhattisgarhshaadi.com
                    </Text>
                    <Text variant="bodyMedium" style={styles.contactText}>
                        Address: Chhattisgarh, India
                    </Text>
                </View>
            </Surface>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Theme.colors.background,
    },
    content: {
        padding: 16,
    },
    card: {
        padding: 20,
        borderRadius: 12,
        backgroundColor: Theme.colors.white,
        ...Theme.shadows.md,
    },
    title: {
        fontWeight: 'bold',
        color: Theme.colors.primary,
        marginBottom: 8,
    },
    lastUpdated: {
        color: Theme.colors.textSecondary,
        marginBottom: 24,
        fontStyle: 'italic',
    },
    section: {
        marginBottom: 24,
    },
    sectionTitle: {
        fontWeight: 'bold',
        color: Theme.colors.text,
        marginBottom: 12,
    },
    paragraph: {
        color: Theme.colors.text,
        lineHeight: 24,
        marginBottom: 8,
    },
    bulletPoint: {
        color: Theme.colors.text,
        lineHeight: 24,
        marginLeft: 8,
        marginBottom: 4,
    },
    contactText: {
        color: Theme.colors.secondary,
        lineHeight: 24,
        marginTop: 4,
    },
});

export default PrivacyPolicyScreen;
