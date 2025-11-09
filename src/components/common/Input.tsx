import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ViewStyle,
  TextStyle,
  TextInputProps,
  TouchableOpacity,
} from 'react-native';
import { colors } from '../../theme/colors';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  containerStyle?: ViewStyle;
  inputStyle?: TextStyle;
  labelStyle?: TextStyle;
  required?: boolean;
  disabled?: boolean;
}

const Input: React.FC<InputProps> = ({
  label,
  error,
  helperText,
  leftIcon,
  rightIcon,
  containerStyle,
  inputStyle,
  labelStyle,
  required = false,
  disabled = false,
  secureTextEntry,
  ...textInputProps
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const isPassword = secureTextEntry !== undefined;

  // Build input container style array properly
  const getInputContainerStyle = (): ViewStyle[] => {
    const styles: ViewStyle[] = [stylesSheet.inputContainer];
    
    if (isFocused) {
      styles.push(stylesSheet.inputContainerFocused);
    }
    if (error) {
      styles.push(stylesSheet.inputContainerError);
    }
    if (disabled) {
      styles.push(stylesSheet.inputContainerDisabled);
    }
    
    return styles;
  };

  return (
    <View style={[stylesSheet.container, containerStyle]}>
      {/* Label */}
      {label && (
        <View style={stylesSheet.labelContainer}>
          <Text style={[stylesSheet.label, labelStyle]}>
            {label}
            {required && <Text style={stylesSheet.required}> *</Text>}
          </Text>
        </View>
      )}

      {/* Input Container */}
      <View style={getInputContainerStyle()}>
        {/* Left Icon */}
        {leftIcon && <View style={stylesSheet.leftIcon}>{leftIcon}</View>}

        {/* Text Input */}
<TextInput
  style={[
    stylesSheet.input,
    leftIcon ? stylesSheet.inputWithLeftIcon : undefined,
    (rightIcon || isPassword) ? stylesSheet.inputWithRightIcon : undefined,
    inputStyle,
  ]}
  placeholderTextColor={colors.text.disabled}
  onFocus={() => setIsFocused(true)}
  onBlur={() => setIsFocused(false)}
  editable={!disabled}
  secureTextEntry={isPassword && !isPasswordVisible}
  {...textInputProps}
/>


        {/* Right Icon / Password Toggle */}
        {isPassword ? (
          <TouchableOpacity
            style={stylesSheet.rightIcon}
            onPress={() => setIsPasswordVisible(!isPasswordVisible)}>
            <Text style={stylesSheet.passwordToggle}>
              {isPasswordVisible ? '👁️' : '👁️‍🗨️'}
            </Text>
          </TouchableOpacity>
        ) : (
          rightIcon && <View style={stylesSheet.rightIcon}>{rightIcon}</View>
        )}
      </View>

      {/* Error Message */}
      {error && (
        <View style={stylesSheet.errorContainer}>
          <Text style={stylesSheet.errorIcon}>⚠️</Text>
          <Text style={stylesSheet.errorText}>{error}</Text>
        </View>
      )}

      {/* Helper Text */}
      {helperText && !error && (
        <Text style={stylesSheet.helperText}>{helperText}</Text>
      )}
    </View>
  );
};

const stylesSheet = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  labelContainer: {
    marginBottom: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text.primary,
  },
  required: {
    color: colors.error,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.neutral.white,
    borderWidth: 1,
    borderColor: colors.neutral.gray300,
    borderRadius: 12,
    paddingHorizontal: 16,
  },
  inputContainerFocused: {
    borderColor: colors.primary.main,
    borderWidth: 2,
  },
  inputContainerError: {
    borderColor: colors.error,
  },
  inputContainerDisabled: {
    backgroundColor: colors.neutral.gray100,
  },
  input: {
    flex: 1,
    paddingVertical: 14,
    fontSize: 16,
    color: colors.text.primary,
  },
  inputWithLeftIcon: {
    paddingLeft: 8,
  },
  inputWithRightIcon: {
    paddingRight: 8,
  },
  leftIcon: {
    marginRight: 8,
  },
  rightIcon: {
    marginLeft: 8,
  },
  passwordToggle: {
    fontSize: 20,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },
  errorIcon: {
    fontSize: 14,
    marginRight: 4,
  },
  errorText: {
    fontSize: 12,
    color: colors.error,
  },
  helperText: {
    fontSize: 12,
    color: colors.text.secondary,
    marginTop: 6,
  },
});

export default Input;