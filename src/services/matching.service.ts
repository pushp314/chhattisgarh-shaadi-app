/**
 * Matching Service
 * Handles compatibility matching based on Vedic Astrology (Guna Milan) and Preferences
 */

import { Profile, MatchResult, Gender } from '../types';

class MatchingService {
    // Simplified Rashi (Moon Sign) Compatibility Matrix (0-5 scale for Graha Maitri)
    // Aries, Taurus, Gemini, Cancer, Leo, Virgo, Libra, Scorpio, Sagittarius, Capricorn, Aquarius, Pisces
    private rashiMatrix = [
        [5, 3, 3, 4, 5, 3, 3, 5, 5, 3, 3, 4], // Aries
        [3, 5, 4, 4, 3, 5, 5, 3, 3, 5, 5, 4], // Taurus
        [3, 4, 5, 3, 3, 5, 5, 3, 3, 4, 4, 3], // Gemini
        [4, 4, 3, 5, 4, 3, 3, 4, 4, 3, 3, 5], // Cancer
        [5, 3, 3, 4, 5, 3, 3, 5, 5, 3, 3, 4], // Leo
        [3, 5, 5, 3, 3, 5, 5, 3, 3, 5, 5, 3], // Virgo
        [3, 5, 5, 3, 3, 5, 5, 3, 3, 5, 5, 3], // Libra
        [5, 3, 3, 4, 5, 3, 3, 5, 5, 3, 3, 4], // Scorpio
        [5, 3, 3, 4, 5, 3, 3, 5, 5, 3, 3, 4], // Sagittarius
        [3, 5, 4, 3, 3, 5, 5, 3, 3, 5, 5, 4], // Capricorn
        [3, 5, 4, 3, 3, 5, 5, 3, 3, 5, 5, 4], // Aquarius
        [4, 4, 3, 5, 4, 3, 3, 4, 4, 3, 3, 5], // Pisces
    ];

    // Nakshatra List (27 Nakshatras)
    private nakshatras = [
        'Ashwini', 'Bharani', 'Krittika', 'Rohini', 'Mrigashirsha', 'Ardra',
        'Punarvasu', 'Pushya', 'Ashlesha', 'Magha', 'Purva Phalguni', 'Uttara Phalguni',
        'Hasta', 'Chitra', 'Swati', 'Vishakha', 'Anuradha', 'Jyeshtha',
        'Mula', 'Purva Ashadha', 'Uttara Ashadha', 'Shravana', 'Dhanishta',
        'Shatabhisha', 'Purva Bhadrapada', 'Uttara Bhadrapada', 'Revati'
    ];

    // Rashi List
    private rashis = [
        'Mesh (Aries)', 'Vrishabh (Taurus)', 'Mithun (Gemini)', 'Karka (Cancer)',
        'Simha (Leo)', 'Kanya (Virgo)', 'Tula (Libra)', 'Vrishchik (Scorpio)',
        'Dhanu (Sagittarius)', 'Makar (Capricorn)', 'Kumbh (Aquarius)', 'Meen (Pisces)'
    ];

    /**
     * Calculate Match Score between two profiles
     */
    calculateMatchScore(myProfile: Profile, otherProfile: Profile): MatchResult {
        // 1. Guna Milan Score (Max 36)
        const gunaMilan = this.calculateGunaMilan(myProfile, otherProfile);

        // 2. Manglik Compatibility
        const manglik = this.checkManglikCompatibility(myProfile, otherProfile);

        // 3. Preference Score (Max 64 approx, scaled to balance)
        const preferences = this.calculatePreferenceScore(myProfile, otherProfile);

        // Total Score Calculation
        // Guna Milan weight: 50%
        // Preferences weight: 50%
        // Manglik is a qualifier/disqualifier or penalty

        let totalScore = (gunaMilan.score / 36) * 50 + (preferences.score / 100) * 50;

        // Penalty for Manglik mismatch
        if (!manglik.isCompatible) {
            totalScore = Math.max(0, totalScore - 20);
        }

        return {
            totalScore: Math.round(totalScore),
            gunaMilan,
            manglik,
            preferences,
        };
    }

    /**
     * Calculate Guna Milan (Simplified 8 Kootas)
     */
    private calculateGunaMilan(p1: Profile, p2: Profile) {
        // Note: In a real app, we would need exact birth time/place to calculate Rashi/Nakshatra accurately.
        // Here we assume Rashi/Nakshatra are stored in the profile or we approximate based on available data.
        // Since we don't have Rashi/Nakshatra fields in the Profile interface yet, we will mock this 
        // based on name hashing for demo purposes (consistent for same pairs) or return a default if data missing.

        // Mocking Rashi/Nakshatra indices for demo
        const rashi1 = this.getPseudoRandomIndex(p1.firstName, 12);
        const rashi2 = this.getPseudoRandomIndex(p2.firstName, 12);
        const nak1 = this.getPseudoRandomIndex(p1.lastName, 27);
        const nak2 = this.getPseudoRandomIndex(p2.lastName, 27);

        // 1. Varna (1 point) - Work/Ego compatibility
        const varna = 1; // Simplified

        // 2. Vashya (2 points) - Power dynamic
        const vashya = 1.5;

        // 3. Tara (3 points) - Destiny
        const tara = Math.abs(nak1 - nak2) % 9 % 2 === 0 ? 3 : 1.5;

        // 4. Yoni (4 points) - Physical compatibility
        const yoni = Math.abs(nak1 - nak2) % 4 === 0 ? 4 : 2;

        // 5. Graha Maitri (5 points) - Mental compatibility (Planetary friendship)
        const grahaMaitri = this.rashiMatrix[rashi1][rashi2];

        // 6. Gana (6 points) - Temperament
        const gana = 6; // Simplified

        // 7. Bhakoot (7 points) - Love/Emotional compatibility
        // 6-8, 5-9, 2-12 relationships are bad
        const rashiDiff = Math.abs(rashi1 - rashi2);
        let bhakoot = 7;
        if (rashiDiff === 6 || rashiDiff === 8 || rashiDiff === 1 || rashiDiff === 11 || rashiDiff === 5 || rashiDiff === 9) {
            bhakoot = 0;
        }

        // 8. Nadi (8 points) - Health/Genes
        const nadi = nak1 % 3 !== nak2 % 3 ? 8 : 0;

        const totalGuna = varna + vashya + tara + yoni + grahaMaitri + gana + bhakoot + nadi;

        return {
            score: totalGuna,
            maxScore: 36,
            areaScores: {
                varna,
                vashya,
                tara,
                yoni,
                grahaMaitri,
                gana,
                bhakoot,
                nadi,
            },
        };
    }

    /**
     * Check Manglik Compatibility
     */
    private checkManglikCompatibility(p1: Profile, p2: Profile) {
        // We don't have a direct 'manglik' field in Profile interface yet (it's in onboarding store/partner prefs).
        // We'll assume non-manglik for now or use a placeholder if we add the field.
        // For demo: Randomize based on ID to show different states

        const isManglik1 = p1.id % 5 === 0; // Mock logic
        const isManglik2 = p2.id % 5 === 0;

        let status: 'COMPATIBLE' | 'NOT_COMPATIBLE' | 'CONSULT_ASTROLOGER' = 'COMPATIBLE';
        let isCompatible = true;

        if (isManglik1 && !isManglik2) {
            status = 'NOT_COMPATIBLE';
            isCompatible = false;
        } else if (!isManglik1 && isManglik2) {
            status = 'NOT_COMPATIBLE';
            isCompatible = false;
        }

        return {
            isCompatible,
            status,
            myStatus: isManglik1,
            otherStatus: isManglik2,
        };
    }

    /**
     * Calculate Preference Score
     */
    private calculatePreferenceScore(myProfile: Profile, otherProfile: Profile) {
        let score = 0;
        const maxScore = 100;
        const matches: string[] = [];
        const mismatches: string[] = [];

        // 1. Age Gap (Ideal: Man older by 1-5 years)
        // We need to parse DOB
        const age1 = this.getAge(myProfile.dateOfBirth);
        const age2 = this.getAge(otherProfile.dateOfBirth);

        if (myProfile.gender === Gender.MALE) {
            if (age1 >= age2 && age1 - age2 <= 5) {
                score += 20;
                matches.push('Ideal Age Gap');
            } else if (age1 < age2) {
                mismatches.push('Age Gap (She is older)');
            } else {
                score += 10; // Acceptable
            }
        } else {
            if (age2 >= age1 && age2 - age1 <= 5) {
                score += 20;
                matches.push('Ideal Age Gap');
            } else if (age2 < age1) {
                mismatches.push('Age Gap (He is younger)');
            } else {
                score += 10;
            }
        }

        // 2. Religion/Caste (High weight in Indian context)
        if (myProfile.religion === otherProfile.religion) {
            score += 20;
            matches.push('Same Religion');
            if (myProfile.caste === otherProfile.caste) {
                score += 10;
                matches.push('Same Caste');
            }
        } else {
            mismatches.push('Different Religion');
        }

        // 3. Location (State/City)
        if (myProfile.state === otherProfile.state) {
            score += 10;
            matches.push('Same State');
            if (myProfile.city === otherProfile.city) {
                score += 10;
                matches.push('Same City');
            }
        }

        // 4. Language
        if (myProfile.motherTongue === otherProfile.motherTongue) {
            score += 10;
            matches.push('Same Mother Tongue');
        }

        // 5. Diet (Vegetarian vs Non-Veg)
        // Mocking diet since it's not in Profile interface main fields yet
        const diet1 = myProfile.id % 2 === 0 ? 'VEG' : 'NON_VEG';
        const diet2 = otherProfile.id % 2 === 0 ? 'VEG' : 'NON_VEG';
        if (diet1 === diet2) {
            score += 10;
            matches.push('Diet Preferences Match');
        } else {
            mismatches.push('Diet Preferences Differ');
        }

        // 6. Education/Profession (Basic check)
        if (myProfile.education && otherProfile.education) {
            score += 10;
            matches.push('Education Compatible');
        }

        return {
            score: Math.min(score, maxScore),
            matches,
            mismatches,
        };
    }

    private getAge(dob: string): number {
        const birthDate = new Date(dob);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age;
    }

    private getPseudoRandomIndex(str: string, max: number): number {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            // eslint-disable-next-line no-bitwise
            hash = str.charCodeAt(i) + ((hash << 5) - hash);
        }
        return Math.abs(hash % max);
    }
}

export default new MatchingService();
