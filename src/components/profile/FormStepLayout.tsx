import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { colors } from '../../theme/colors';
import  Button  from '../common/Button';

interface FormStepLayoutProps {
  title: string;
  subtitle: string;
  onNext: () => void;
  onBack: () => void;
  isNextDisabled?: boolean;
  nextButtonText?: string;
  children: React.ReactNode;
}

const FormStepLayout: React.FC<FormStepLayoutProps> = ({
  title,
  subtitle,
  onNext,
  onBack,
  isNextDisabled = false,
  nextButtonText = 'Next',
  children,
}) => {
  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled">
        
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.subtitle}>{subtitle}</Text>
        </View>

        {/* Form Content */}
        {children}

      </ScrollView>

      {/* Footer Navigation */}
      <View style={styles.footer}>
        <Button
          title="Back"
          onPress={onBack}
          variant="outline"
          style={styles.footerButton}
        />
        <Button
          title={nextButtonText}
          onPress={onNext}
          disabled={isNextDisabled}
          style={styles.footerButton}
        />
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.default,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 24,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: colors.text.secondary,
    lineHeight: 22,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 24,
    backgroundColor: colors.neutral.white,
    borderTopWidth: 1,
    borderTopColor: colors.neutral.gray200,
  },
  footerButton: {
    flex: 1,
    marginHorizontal: 8,
  },
});

export default FormStepLayout;