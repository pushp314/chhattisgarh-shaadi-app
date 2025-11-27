/**
 * Auto-fill entire profile with random test data
 */

import { useOnboardingStore } from '../store/onboardingStore';
import { generateCompleteTestData } from './testDataGenerator';

export const autoFillCompleteProfile = () => {
    const testData = generateCompleteTestData();
    const store = useOnboardingStore.getState();

    // Fill all fields at once
    Object.entries(testData).forEach(([key, value]) => {
        store.updateOnboardingData(key as any, value);
    });

    console.log('Profile auto-filled with test data:', testData);
    return testData;
};
