/**
 * Profile Cache Service
 * Caches profiles for offline access using AsyncStorage
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { Profile } from '../types';

const CACHE_PREFIX = '@profile_cache_';
const CACHE_EXPIRY = 24 * 60 * 60 * 1000; // 24 hours
const MAX_CACHED_PROFILES = 50;

interface CachedProfile {
    profile: Profile;
    timestamp: number;
}

interface CacheIndex {
    profileIds: number[];
    lastUpdated: number;
}

class ProfileCacheService {
    private cacheIndex: CacheIndex | null = null;

    /**
     * Initialize cache index
     */
    private async loadCacheIndex(): Promise<CacheIndex> {
        if (this.cacheIndex) return this.cacheIndex;

        try {
            const indexData = await AsyncStorage.getItem(`${CACHE_PREFIX}index`);
            this.cacheIndex = indexData
                ? JSON.parse(indexData)
                : { profileIds: [], lastUpdated: Date.now() };
            return this.cacheIndex!;
        } catch (error) {
            console.error('Error loading cache index:', error);
            this.cacheIndex = { profileIds: [], lastUpdated: Date.now() };
            return this.cacheIndex;
        }
    }

    /**
     * Save cache index
     */
    private async saveCacheIndex(): Promise<void> {
        try {
            if (this.cacheIndex) {
                await AsyncStorage.setItem(
                    `${CACHE_PREFIX}index`,
                    JSON.stringify(this.cacheIndex)
                );
            }
        } catch (error) {
            console.error('Error saving cache index:', error);
        }
    }

    /**
     * Cache a profile
     */
    async cacheProfile(profile: Profile): Promise<void> {
        try {
            const userId = (profile as any).userId || profile.id;
            const cacheKey = `${CACHE_PREFIX}${userId}`;

            const cachedData: CachedProfile = {
                profile,
                timestamp: Date.now(),
            };

            await AsyncStorage.setItem(cacheKey, JSON.stringify(cachedData));

            // Update index
            const index = await this.loadCacheIndex();
            if (!index.profileIds.includes(userId)) {
                index.profileIds.push(userId);

                // Enforce max cache size
                if (index.profileIds.length > MAX_CACHED_PROFILES) {
                    const removedId = index.profileIds.shift();
                    if (removedId) {
                        await AsyncStorage.removeItem(`${CACHE_PREFIX}${removedId}`);
                    }
                }

                index.lastUpdated = Date.now();
                await this.saveCacheIndex();
            }
        } catch (error) {
            console.error('Error caching profile:', error);
        }
    }

    /**
     * Get cached profile
     */
    async getCachedProfile(userId: number): Promise<Profile | null> {
        try {
            const cacheKey = `${CACHE_PREFIX}${userId}`;
            const cachedData = await AsyncStorage.getItem(cacheKey);

            if (!cachedData) return null;

            const parsed: CachedProfile = JSON.parse(cachedData);

            // Check if cache is expired
            if (Date.now() - parsed.timestamp > CACHE_EXPIRY) {
                await AsyncStorage.removeItem(cacheKey);
                return null;
            }

            return parsed.profile;
        } catch (error) {
            console.error('Error getting cached profile:', error);
            return null;
        }
    }

    /**
     * Cache multiple profiles
     */
    async cacheProfiles(profiles: Profile[]): Promise<void> {
        try {
            const promises = profiles.map(profile => this.cacheProfile(profile));
            await Promise.all(promises);
        } catch (error) {
            console.error('Error caching profiles:', error);
        }
    }

    /**
     * Get all cached profiles
     */
    async getAllCachedProfiles(): Promise<Profile[]> {
        try {
            const index = await this.loadCacheIndex();
            const profiles: Profile[] = [];

            for (const userId of index.profileIds) {
                const profile = await this.getCachedProfile(userId);
                if (profile) {
                    profiles.push(profile);
                }
            }

            return profiles;
        } catch (error) {
            console.error('Error getting all cached profiles:', error);
            return [];
        }
    }

    /**
     * Clear all cached profiles
     */
    async clearCache(): Promise<void> {
        try {
            const index = await this.loadCacheIndex();

            const removePromises = index.profileIds.map(userId =>
                AsyncStorage.removeItem(`${CACHE_PREFIX}${userId}`)
            );

            await Promise.all(removePromises);
            await AsyncStorage.removeItem(`${CACHE_PREFIX}index`);

            this.cacheIndex = { profileIds: [], lastUpdated: Date.now() };
        } catch (error) {
            console.error('Error clearing cache:', error);
        }
    }

    /**
     * Get cache stats
     */
    async getCacheStats(): Promise<{ count: number; oldestTimestamp: number | null }> {
        try {
            const index = await this.loadCacheIndex();
            return {
                count: index.profileIds.length,
                oldestTimestamp: index.lastUpdated,
            };
        } catch (error) {
            return { count: 0, oldestTimestamp: null };
        }
    }
}

export default new ProfileCacheService();
