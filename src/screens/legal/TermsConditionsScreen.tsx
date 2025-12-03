/**
 * Terms & Conditions Screen
 * Displays app terms of service - legal requirement
 */

import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Text, Surface } from 'react-native-paper';
import { Theme } from '../../constants/theme';

const TermsConditionsScreen: React.FC = () => {
    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.content}>
            <Surface style={styles.card} elevation={1}>
                <Text variant="headlineSmall" style={styles.title}>
                    Terms & Conditions
                </Text>
                <Text variant="bodySmall" style={styles.lastUpdated}>
                    Last Updated: December 1, 2024
                </Text>

                <View style={styles.section}>
                    <Text variant="titleMedium" style={styles.sectionTitle}>
                        1. Acceptance of Terms
                    </Text>
                    <Text variant="bodyMedium" style={styles.paragraph}>
                        By accessing and using Chhattisgarh Shaadi App, you accept and agree to be bound
                        by these Terms and Conditions. If you do not agree to these terms, please do not
                        use our service.
                    </Text>
                </View>

                <View style={styles.section}>
                    <Text variant="titleMedium" style={styles.sectionTitle}>
                        2. Eligibility
                    </Text>
                    <Text variant="bodyMedium" style={styles.paragraph}>
                        You must be at least 18 years old to use this service. By using this app, you
                        represent and warrant that:
                    </Text>
                    <Text variant="bodyMedium" style={styles.bulletPoint}>
                        • You are at least 18 years of age
                    </Text>
                    <Text variant="bodyMedium" style={styles.bulletPoint}>
                        • You are legally able to enter into a binding contract
                    </Text>
                    <Text variant="bodyMedium" style={styles.bulletPoint}>
                        • You are not prohibited from using the service under applicable laws
                    </Text>
                    <Text variant="bodyMedium" style={styles.bulletPoint}>
                        • You will use the service for lawful matrimonial purposes only
                    </Text>
                </View>

                <View style={styles.section}>
                    <Text variant="titleMedium" style={styles.sectionTitle}>
                        3. User Accounts
                    </Text>
                    <Text variant="bodyMedium" style={styles.paragraph}>
                        When creating an account, you agree to:
                    </Text>
                    <Text variant="bodyMedium" style={styles.bulletPoint}>
                        • Provide accurate, current, and complete information
                    </Text>
                    <Text variant="bodyMedium" style={styles.bulletPoint}>
                        • Maintain and update your information to keep it accurate
                    </Text>
                    <Text variant="bodyMedium" style={styles.bulletPoint}>
                        • Keep your account credentials secure and confidential
                    </Text>
                    <Text variant="bodyMedium" style={styles.bulletPoint}>
                        • Accept responsibility for all activities under your account
                    </Text>
                    <Text variant="bodyMedium" style={styles.bulletPoint}>
                        • Notify us immediately of any unauthorized access
                    </Text>
                </View>

                <View style={styles.section}>
                    <Text variant="titleMedium" style={styles.sectionTitle}>
                        4. Prohibited Conduct
                    </Text>
                    <Text variant="bodyMedium" style={styles.paragraph}>
                        You agree NOT to:
                    </Text>
                    <Text variant="bodyMedium" style={styles.bulletPoint}>
                        • Provide false or misleading information
                    </Text>
                    <Text variant="bodyMedium" style={styles.bulletPoint}>
                        • Impersonate any person or entity
                    </Text>
                    <Text variant="bodyMedium" style={styles.bulletPoint}>
                        • Harass, abuse, or harm other users
                    </Text>
                    <Text variant="bodyMedium" style={styles.bulletPoint}>
                        • Use the service for commercial purposes without permission
                    </Text>
                    <Text variant="bodyMedium" style={styles.bulletPoint}>
                        • Upload inappropriate, offensive, or illegal content
                    </Text>
                    <Text variant="bodyMedium" style={styles.bulletPoint}>
                        • Attempt to access unauthorized areas of the service
                    </Text>
                    <Text variant="bodyMedium" style={styles.bulletPoint}>
                        • Use automated systems to access the service
                    </Text>
                </View>

                <View style={styles.section}>
                    <Text variant="titleMedium" style={styles.sectionTitle}>
                        5. Content Guidelines
                    </Text>
                    <Text variant="bodyMedium" style={styles.paragraph}>
                        All content you upload must:
                    </Text>
                    <Text variant="bodyMedium" style={styles.bulletPoint}>
                        • Be your own or properly licensed
                    </Text>
                    <Text variant="bodyMedium" style={styles.bulletPoint}>
                        • Not violate any third-party rights
                    </Text>
                    <Text variant="bodyMedium" style={styles.bulletPoint}>
                        • Be appropriate for a matrimonial platform
                    </Text>
                    <Text variant="bodyMedium" style={styles.bulletPoint}>
                        • Not contain nudity, violence, or offensive material
                    </Text>
                    <Text variant="bodyMedium" style={styles.bulletPoint}>
                        • Comply with all applicable laws
                    </Text>
                </View>

                <View style={styles.section}>
                    <Text variant="titleMedium" style={styles.sectionTitle}>
                        6. Subscription and Payments
                    </Text>
                    <Text variant="bodyMedium" style={styles.paragraph}>
                        Premium features require a paid subscription. By subscribing, you agree to:
                    </Text>
                    <Text variant="bodyMedium" style={styles.bulletPoint}>
                        • Pay all applicable fees
                    </Text>
                    <Text variant="bodyMedium" style={styles.bulletPoint}>
                        • Automatic renewal unless cancelled
                    </Text>
                    <Text variant="bodyMedium" style={styles.bulletPoint}>
                        • No refunds for partial subscription periods
                    </Text>
                    <Text variant="bodyMedium" style={styles.bulletPoint}>
                        • Price changes with 30 days notice
                    </Text>
                </View>

                <View style={styles.section}>
                    <Text variant="titleMedium" style={styles.sectionTitle}>
                        7. Intellectual Property
                    </Text>
                    <Text variant="bodyMedium" style={styles.paragraph}>
                        The service and its content are owned by us and protected by copyright, trademark,
                        and other intellectual property laws. You may not copy, modify, distribute, or
                        create derivative works without our permission.
                    </Text>
                </View>

                <View style={styles.section}>
                    <Text variant="titleMedium" style={styles.sectionTitle}>
                        8. Disclaimer of Warranties
                    </Text>
                    <Text variant="bodyMedium" style={styles.paragraph}>
                        The service is provided "as is" without warranties of any kind. We do not guarantee:
                    </Text>
                    <Text variant="bodyMedium" style={styles.bulletPoint}>
                        • Uninterrupted or error-free service
                    </Text>
                    <Text variant="bodyMedium" style={styles.bulletPoint}>
                        • Accuracy of user-provided information
                    </Text>
                    <Text variant="bodyMedium" style={styles.bulletPoint}>
                        • Successful matches or relationships
                    </Text>
                    <Text variant="bodyMedium" style={styles.bulletPoint}>
                        • Security against unauthorized access
                    </Text>
                </View>

                <View style={styles.section}>
                    <Text variant="titleMedium" style={styles.sectionTitle}>
                        9. Limitation of Liability
                    </Text>
                    <Text variant="bodyMedium" style={styles.paragraph}>
                        We shall not be liable for any indirect, incidental, special, or consequential
                        damages arising from your use of the service. Our total liability shall not exceed
                        the amount you paid for the service in the past 12 months.
                    </Text>
                </View>

                <View style={styles.section}>
                    <Text variant="titleMedium" style={styles.sectionTitle}>
                        10. Account Termination
                    </Text>
                    <Text variant="bodyMedium" style={styles.paragraph}>
                        We reserve the right to suspend or terminate your account if you:
                    </Text>
                    <Text variant="bodyMedium" style={styles.bulletPoint}>
                        • Violate these Terms and Conditions
                    </Text>
                    <Text variant="bodyMedium" style={styles.bulletPoint}>
                        • Engage in fraudulent or illegal activities
                    </Text>
                    <Text variant="bodyMedium" style={styles.bulletPoint}>
                        • Harm other users or the service
                    </Text>
                    <Text variant="bodyMedium" style={styles.bulletPoint}>
                        • Provide false information
                    </Text>
                </View>

                <View style={styles.section}>
                    <Text variant="titleMedium" style={styles.sectionTitle}>
                        11. Changes to Terms
                    </Text>
                    <Text variant="bodyMedium" style={styles.paragraph}>
                        We may modify these terms at any time. Continued use of the service after changes
                        constitutes acceptance of the new terms. We will notify you of significant changes.
                    </Text>
                </View>

                <View style={styles.section}>
                    <Text variant="titleMedium" style={styles.sectionTitle}>
                        12. Governing Law
                    </Text>
                    <Text variant="bodyMedium" style={styles.paragraph}>
                        These terms are governed by the laws of India. Any disputes shall be resolved in
                        the courts of Chhattisgarh, India.
                    </Text>
                </View>

                <View style={styles.section}>
                    <Text variant="titleMedium" style={styles.sectionTitle}>
                        13. Contact Information
                    </Text>
                    <Text variant="bodyMedium" style={styles.paragraph}>
                        For questions about these Terms & Conditions, contact us at:
                    </Text>
                    <Text variant="bodyMedium" style={styles.contactText}>
                        Email: support@chhattisgarhshaadi.com
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

export default TermsConditionsScreen;
