/**
 * Subscription Store
 * Zustand store for subscription state management
 */

import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import subscriptionService from '../services/subscription.service';
import { Subscription, SubscriptionPlan } from '../types';

interface SubscriptionState {
    subscription: Subscription | null;
    plan: SubscriptionPlan | null;
    isLoading: boolean;
    isPremium: boolean;
    daysRemaining: number;

    // Actions
    fetchSubscription: () => Promise<void>;
    setSubscription: (subscription: Subscription | null, plan?: SubscriptionPlan | null) => void;
    clearSubscription: () => void;
    refreshAfterPayment: () => Promise<void>;
}

export const useSubscriptionStore = create<SubscriptionState>()(
    persist(
        (set, get) => ({
            subscription: null,
            plan: null,
            isLoading: false,
            isPremium: false,
            daysRemaining: 0,

            fetchSubscription: async () => {
                try {
                    set({ isLoading: true });
                    const subscription = await subscriptionService.getCurrentSubscription();

                    if (subscription && subscription.status === 'ACTIVE') {
                        // Calculate days remaining
                        const endDate = new Date(subscription.endDate);
                        const today = new Date();
                        const diffTime = endDate.getTime() - today.getTime();
                        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

                        set({
                            subscription,
                            isPremium: diffDays > 0,
                            daysRemaining: Math.max(0, diffDays),
                            isLoading: false,
                        });
                    } else {
                        set({
                            subscription: null,
                            plan: null,
                            isPremium: false,
                            daysRemaining: 0,
                            isLoading: false,
                        });
                    }
                } catch (error) {
                    console.error('Error fetching subscription:', error);
                    set({ isLoading: false });
                }
            },

            setSubscription: (subscription, plan = null) => {
                if (subscription && subscription.status === 'ACTIVE') {
                    const endDate = new Date(subscription.endDate);
                    const today = new Date();
                    const diffTime = endDate.getTime() - today.getTime();
                    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

                    set({
                        subscription,
                        plan,
                        isPremium: diffDays > 0,
                        daysRemaining: Math.max(0, diffDays),
                    });
                } else {
                    set({
                        subscription: null,
                        plan: null,
                        isPremium: false,
                        daysRemaining: 0,
                    });
                }
            },

            clearSubscription: () => {
                set({
                    subscription: null,
                    plan: null,
                    isPremium: false,
                    daysRemaining: 0,
                    isLoading: false,
                });
            },

            refreshAfterPayment: async () => {
                // Wait a bit for backend to process payment
                await new Promise<void>((resolve) => setTimeout(() => resolve(), 1500));
                await get().fetchSubscription();
            },
        }),
        {
            name: 'subscription-storage',
            storage: createJSONStorage(() => AsyncStorage),
            partialize: (state) => ({
                subscription: state.subscription,
                plan: state.plan,
                isPremium: state.isPremium,
                daysRemaining: state.daysRemaining,
            }),
        }
    )
);
