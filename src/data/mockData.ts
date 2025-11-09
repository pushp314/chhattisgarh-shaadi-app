export interface UserProfile {
  id: number;
  firstName: string;
  lastName: string;
  age: number;
  location: string;
  profession: string;
  education: string;
  religion: string;
  height: string;
  photos: string[];
  bio: string;
  verified: boolean;
  premium: boolean;
  matchPercentage?: number;
  online?: boolean;

  // --- ADDED DETAILED FIELDS ---
  maritalStatus: string;
  motherTongue: string;
  caste: string;
  diet: string;
  fatherStatus: string; // e.g., "Businessman", "Retired"
  motherStatus: string; // e.g., "Homemaker", "Teacher"
}
export interface Activity {
  id: number;
  type: 'view' | 'like' | 'match' | 'message' | 'shortlist';
  user: {
    id: number;
    name: string;
    photo: string;
  };
  timestamp: Date;
  message?: string;
}

export const currentUser = {
  id: 1,
  firstName: 'Pushp',
  lastName: 'Kumar',
  profileCompletion: 85,
  verified: true,
  premium: false,
};

export const userStats = {
  views: 142,
  likes: 38,
  matches: 12,
  messages: 5,
};

export const recommendedProfiles: UserProfile[] = [
  {
    id: 101,
    firstName: 'Priya',
    lastName: 'Sharma',
    age: 26,
    location: 'Raipur, Chhattisgarh',
    profession: 'Software Engineer',
    education: "Bachelor's in Computer Science",
    religion: 'Hindu',
    height: "5'5\"",
    photos: ['https://randomuser.me/api/portraits/women/1.jpg'],
    bio: 'Love traveling and exploring new places. Looking for a life partner who values family.',
    verified: true,
    premium: true,
    matchPercentage: 92,
    online: true,
    // --- ADDED MOCK DATA ---
    maritalStatus: 'Never Married',
    motherTongue: 'Hindi',
    caste: 'Brahmin',
    diet: 'Vegetarian',
    fatherStatus: 'Businessman',
    motherStatus: 'Homemaker',
  },
  {
    id: 102,
    firstName: 'Anjali',
    lastName: 'Verma',
    age: 24,
    location: 'Bhilai, Chhattisgarh',
    profession: 'Teacher',
    education: "Master's in Education",
    religion: 'Hindu',
    height: "5'4\"",
    photos: ['https://randomuser.me/api/portraits/women/2.jpg'],
    bio: 'Traditional values with modern outlook. Family means everything to me.',
    verified: true,
    premium: false,
    matchPercentage: 88,
    online: false,
    // --- ADDED MOCK DATA ---
    maritalStatus: 'Never Married',
    motherTongue: 'Chhattisgarhi',
    caste: 'Kurmi',
    diet: 'Vegetarian',
    fatherStatus: 'Government Service',
    motherStatus: 'Teacher',
  },
  {
    id: 103,
    firstName: 'Roshni',
    lastName: 'Patel',
    age: 27,
    location: 'Durg, Chhattisgarh',
    profession: 'Doctor',
    education: 'MBBS',
    religion: 'Hindu',
    height: "5'6\"",
    photos: ['https://randomuser.me/api/portraits/women/3.jpg'],
    bio: 'Passionate about my career and family. Looking for understanding partner.',
    verified: true,
    premium: true,
    matchPercentage: 85,
    online: true,
    // --- ADDED MOCK DATA ---
    maritalStatus: 'Never Married',
    motherTongue: 'Hindi',
    caste: 'Patel',
    diet: 'Eggetarian',
    fatherStatus: 'Retired',
    motherStatus: 'Homemaker',
  },
  {
    id: 104,
    firstName: 'Kavita',
    lastName: 'Singh',
    age: 25,
    location: 'Raipur, Chhattisgarh',
    profession: 'Business Owner',
    education: "Bachelor's in Commerce",
    religion: 'Hindu',
    height: "5'3\"",
    photos: ['https://randomuser.me/api/portraits/women/4.jpg'],
    bio: 'Running my own boutique. Love arts and crafts.',
    verified: false,
    premium: false,
    matchPercentage: 80,
    online: false,
    // --- ADDED MOCK DATA ---
    maritalStatus: 'Never Married',
    motherTongue: 'Chhattisgarhi',
    caste: 'Thakur',
    diet: 'Non-Vegetarian',
    fatherStatus: 'Farmer',
    motherStatus: 'Homemaker',
  },
];


export const recentActivities: Activity[] = [
  {
    id: 1,
    type: 'match',
    user: {
      id: 105,
      name: 'Priya Sharma',
      photo: 'https://randomuser.me/api/portraits/women/5.jpg',
    },
    timestamp: new Date(2025, 9, 22, 10, 30),
    message: 'You have a new match!',
  },
  {
    id: 2,
    type: 'like',
    user: {
      id: 106,
      name: 'Anjali Verma',
      photo: 'https://randomuser.me/api/portraits/women/6.jpg',
    },
    timestamp: new Date(2025, 9, 22, 9, 15),
    message: 'Liked your profile',
  },
  {
    id: 3,
    type: 'view',
    user: {
      id: 107,
      name: 'Roshni Patel',
      photo: 'https://randomuser.me/api/portraits/women/7.jpg',
    },
    timestamp: new Date(2025, 9, 22, 8, 45),
    message: 'Viewed your profile',
  },
  {
    id: 4,
    type: 'shortlist',
    user: {
      id: 108,
      name: 'Kavita Singh',
      photo: 'https://randomuser.me/api/portraits/women/8.jpg',
    },
    timestamp: new Date(2025, 9, 21, 18, 20),
    message: 'Added you to shortlist',
  },
  {
    id: 5,
    type: 'message',
    user: {
      id: 109,
      name: 'Sneha Gupta',
      photo: 'https://randomuser.me/api/portraits/women/9.jpg',
    },
    timestamp: new Date(2025, 9, 21, 15, 10),
    message: 'Sent you a message',
  },
];