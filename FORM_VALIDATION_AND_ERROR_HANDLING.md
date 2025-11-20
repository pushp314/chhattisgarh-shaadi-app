# Deep Dive: Form Validation and Error Handling

This document details the established patterns for handling form validation and displaying errors within the chhattisgarh-shaadi-app frontend. The conventions described here are based on the implementation found in components such as `AboutStep.tsx`, `ReligionStep.tsx`, and `PhoneVerificationScreen.tsx`.

### 1. Form State & Validation

The project uses a combination of **React Hook Form** for managing form state and **Zod** for schema-based validation.

*   **Technology Stack:**
    *   **React Hook Form:** Manages form state, submission handling, and validation errors.
    *   **Zod:** Defines the validation schema for form data.
    *   **`@hookform/resolvers/zod`:** A resolver that allows React Hook Form to use a Zod schema for validation.

*   **Implementation Pattern:**
    1.  A Zod schema is defined to specify the shape and validation rules for the form data.
    2.  The `useForm` hook from React Hook Form is initialized with this schema via the `zodResolver`.
    3.  The `control` object from `useForm` is passed to controller components, and the `errors` object is used to display validation messages.

    **Example (`AboutStep.tsx`):**
    The component uses an `errors` object (provided by `useForm`) to manage validation. The `TextInput` component'''s `error` prop is toggled based on the presence of an error for its corresponding field.

    ```typescript
    // In a form component
    <TextInput
      label="About Me *"
      // ... other props
      error={!!errors.aboutMe} // The input is marked invalid if an error exists
    />
    ```

### 2. Displaying Field-Specific Errors

A consistent pattern is used to display validation errors directly below the input field they relate to.

*   **Component:** The `HelperText` component from **React Native Paper** is the standard for displaying these messages.

*   **Implementation Pattern:**
    1.  A `<HelperText>` component with `type="error"` is placed immediately after the input component.
    2.  Its `visible` prop is bound to the existence of a specific error in the `errors` object from React Hook Form.
    3.  The content of the `HelperText` is the error message itself.

    **Example (`ReligionStep.tsx` and `AboutStep.tsx`):**
    This pattern ensures that validation feedback is contextual and appears only when a validation rule is violated.

    ```typescript
    // In ReligionStep.tsx
    <HelperText type="error" visible={!!errors.maritalStatus}>
      {errors.maritalStatus}
    </HelperText>

    // In AboutStep.tsx
    <HelperText type="error" visible={!!errors.aboutMe}>
     {errors.aboutMe}
    </HelperText>
    ```

### 3. Displaying General and API Errors

For errors that are not tied to a specific input field (e.g., network failures, API error responses during form submission), a more general error display pattern is used.

*   **State Management:** These errors are typically stored in a local component state variable using React'''s `useState` hook.

*   **Implementation Pattern:**
    1.  A state variable (e.g., `error`) is used to hold the error message string.
    2.  A dedicated UI block is conditionally rendered in a prominent location on the screen (often near the top or a primary button).
    3.  This block usually contains an icon (e.g., `error-outline` from `react-native-vector-icons`) and the error message to draw the user'''s attention.

    **Example (`PhoneVerificationScreen.tsx`):**
    This component displays API or logic errors in a distinct, styled view above the main form inputs.

    ```typescript
    {error ? (
      <View style={styles.errorContainer}>
        <Icon name="error-outline" size={20} color="#FF5252" />
        <Text style={styles.errorText}>{error}</Text>
      </View>
    ) : null}
    ```
