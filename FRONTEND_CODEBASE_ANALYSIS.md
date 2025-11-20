# Frontend Codebase Analysis

This document summarizes the architecture, tools, and implementation details of the chhattisgarh-shaadi-app frontend.

### 1. Project Overview & Tech Stack

*   **Primary Framework:** **React Native** (`v0.74.1`). The project is bootstrapped with the **React Native CLI**.
*   **Language:** **TypeScript**.
*   **Key Libraries & Tools:**
    *   **State Management:** **Zustand** is used for global state management. `useAuthStore` and `useProfileStore` are the primary stores. React'''s `useState` is used for local component state.
    *   **Routing:** **React Navigation** (`v6.x`) is used for all navigation logic. The routing is broken down into multiple stacks (Auth, Main, Home, Matches, etc.).
    *   **Styling & UI Components:**
        *   **React Native Paper** (`v5.14.5`) is the primary UI component library, providing Material Design components.
        *   **react-native-vector-icons** is used for icons.
        *   **react-native-linear-gradient** is used for gradient effects.
    *   **API Communication:**
        *   **Axios** is used for REST API communication. A centralized `apiClient` instance is configured with a base URL and an interceptor to automatically attach JWTs to requests.
        *   **socket.io-client** is included for real-time features, likely for the chat/messaging functionality.
    *   **Form Handling:** **React Hook Form** (`v7.51.0`) is used for managing form state, paired with **Zod** for schema-based validation via `@hookform/resolvers/zod`.
    *   **Build Tool & Environment:** **React Native CLI** with Metro as the bundler.

### 2. Project Structure & Code Organization

The codebase is organized within the `src` directory, following a hybrid pattern of role-based and feature-based modules:

*   `/src`: The main application source code.
    *   `/components`: Reusable, generic components (e.g., `ProfileCard`, `SearchFilters`). It also contains feature-specific components for the multi-step profile creation form.
    *   `/config`: Contains the central Axios instance configuration (`api.config.ts`).
    *   `/constants`: Application-wide constants, such as enums (`enums.ts`).
    *   `/navigation`: All React Navigation stacks and navigators. It defines how screens are structured and navigated.
    *   `/screens`: Top-level components for each screen in the app, organized by feature (e.g., `/auth`, `/home`, `/profile`).
    *   `/services`: A dedicated service layer that abstracts all API communication. Each file corresponds to a specific backend resource (e.g., `auth.service.ts`, `profile.service.ts`).
    *   `/store`: Global Zustand state management stores (`authStore.ts`, `profileStore.ts`).
    *   `/types`: TypeScript type definitions and interfaces.

### 3. Authentication & Authorization

*   **Implementation:** Authentication is handled via Google Sign-In and Phone Verification.
*   **Token Storage:** JWTs (access tokens) are securely stored on the device using **`react-native-keychain`**.
*   **Protected Routes:** The root navigator (`AppNavigator.tsx`) conditionally renders either the `AuthNavigator` (for login/signup screens) or the `MainNavigator` (the main app) based on an `isAuthenticated` flag in the `authStore` (Zustand).
*   **Login/Logout Flow:**
    1.  **Login:** The user signs in via a screen in `AuthNavigator`. The `auth.service` is called, and upon a successful response from the backend, the received JWT is stored in the Keychain. The user'''s data and authentication state are then updated in the `authStore`.
    2.  **App Load:** On app startup, `AppNavigator` attempts to load credentials from the Keychain. If a token exists, it rehydrates the `authStore`, effectively logging the user in automatically.
    3.  **Logout:** A logout function in `auth.service` clears the credentials from the Keychain and resets the `authStore`, which automatically navigates the user back to the `AuthNavigator`.
*   **Authenticated API Calls:** An Axios request interceptor in `api.config.ts` automatically retrieves the token from the Keychain and adds it as a `Bearer` token to the `Authorization` header of all outgoing API requests.

### 4. State Management Strategy

*   **Global State (Zustand):** The `src/store` directory contains global state stores.
    *   `authStore.ts`: Manages the current user, access token, and `isAuthenticated` status.
    *   `profileStore.ts`: Manages state related to the user'''s own profile.
    *   **Usage:** State is read in components using hooks like `const { isAuthenticated } = useAuthStore();`. State is updated by calling action functions defined in the store, e.g., `useAuthStore.getState().setUser(data);`.
*   **Local/Component State (React `useState`):** Used for UI-specific state that doesn'''t need to be shared globally, such as loading and error flags for data fetching, form inputs, or modal visibility.

### 5. API Integration & Data Fetching

*   **Centralized Service Layer:** All backend communication is abstracted into the `src/services` directory. Components do not make direct API calls with Axios; instead, they import and call functions from these services (e.g., `profileService.getRecommendedProfiles()`).
*   **Loading/Error States:** API-calling components typically manage their own loading and error states using `useState`. Asynchronous service functions are called within `useEffect` or event handlers, and are wrapped in `try/catch/finally` blocks to set the loading and error states appropriately for the UI to react to (e.g., showing a loading spinner or an error message).

### 6. Implemented Features

Based on the file structure in `/screens`, `/services`, and `/navigation`, the following features are implemented or in development:

*   **Authentication:** Google Sign-In, Phone Verification.
*   **Profile Creation & Management:** A multi-step profile creation flow (`BasicInfoStep`, `PhotosStep`, etc.) and functionality to edit/view the user'''s own profile.
*   **User Discovery:** A home screen to view recommended profiles and a search screen with filtering capabilities.
*   **Matching:** Ability to view other users''' profiles, send match requests, and view a list of accepted matches.
*   **Messaging:** A list of conversations and a real-time chat screen (indicated by `ChatScreen.tsx` and `socket.io-client`).
*   **Payments/Subscriptions:** A `SubscriptionScreen` and the `react-native-razorpay` library suggest an implemented or planned subscription feature.

### 7. Code Quality & Best Practices

*   **TypeScript:** The project consistently uses TypeScript, providing type safety across the codebase.
*   **Separation of Concerns:** The code demonstrates a strong separation of concerns with distinct layers for UI (components/screens), business logic/API calls (services), and state management (store).
*   **Form Validation:** The use of `react-hook-form` with `zod` for validation is a modern and robust pattern.
*   **Centralized API Configuration:** Using a single, configured Axios instance with an interceptor for auth tokens is a highly effective and maintainable pattern.
*   **Error Handling:** Asynchronous functions consistently use `try/catch` blocks to handle potential errors from API calls.