/**
 * Test Data Generator
 * Generates random valid data for testing profile creation forms
 */

import { Gender } from '../constants/enums';

const firstNamesMale = ['Rajesh', 'Amit', 'Suresh', 'Prakash', 'Ramesh', 'Vikas', 'Anil', 'Rahul', 'Rohit', 'Sandeep'];
const firstNamesFemale = ['Priya', 'Anjali', 'Kavita', 'Sunita', 'Rekha', 'Pooja', 'Neha', 'Sneha', 'Ritu', 'Divya'];
const lastNames = ['Sharma', 'Verma', 'Patel', 'Gupta', 'Singh', 'Kumar', 'Sahu', 'Tiwari', 'Jain', 'Yadav'];

const cities = ['Raipur', 'Bilaspur', 'Durg', 'Bhilai', 'Korba', 'Rajnandgaon', 'Jagdalpur', 'Ambikapur'];
const districts = ['Raipur', 'Bilaspur', 'Durg', 'Korba', 'Rajnandgaon', 'Jagdalpur', 'Ambikapur', 'Mahasamund'];
const tehsils = ['Raipur', 'Arang', 'Tilda', 'Baloda Bazar', 'Mungeli', 'Bilha', 'Bhatapara'];
const villages = ['Singhpur', 'Amlidih', 'Tarpongi', 'Bhatha', 'Dongargaon', 'Patewa', 'Silyari'];

const castes = ['Brahmin', 'Kshatriya', 'Vaishya', 'Rajput', 'Maratha', 'Yadav', 'Kurmi', 'Teli', 'Sahu'];
const subCastes = ['Mishra', 'Dwivedi', 'Pandey', 'Agrawal', 'Maheshwari', 'Khandelwal', 'Garg'];
const gothrams = ['Bharadwaj', 'Kashyap', 'Vashishtha', 'Gautam', 'Agastya', 'Atri', 'Vishwamitra'];

const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
const complexions = ['Fair', 'Wheatish', 'Dusky', 'Dark'];
const bodyTypes = ['Slim', 'Athletic', 'Average', 'Heavy'];

const educationLevels = ['DOCTORATE', 'MASTERS', 'BACHELORS', 'DIPLOMA', 'HIGH_SCHOOL'];
const occupationTypes = ['PRIVATE_JOB', 'GOVERNMENT_JOB', 'BUSINESS', 'SELF_EMPLOYED'];
const jobTitles = ['Software Engineer', 'Manager', 'Teacher', 'Doctor', 'Accountant', 'Business Owner', 'Consultant', 'Analyst'];
const industries = ['IT/Software', 'Education', 'Healthcare', 'Finance', 'Manufacturing', 'Retail', 'Construction'];
const workLocations = ['Raipur', 'Bilaspur', 'Durg', 'Bhilai', 'Delhi', 'Mumbai', 'Bangalore', 'Pune'];

const hobbies = [
    'Reading, Traveling, Cooking',
    'Music, Dancing, Fitness',
    'Photography, Painting, Gardening',
    'Sports, Gaming, Movies',
    'Yoga, Meditation, Volunteering',
];

const partnerExpectations = [
    'Looking for a caring and understanding life partner from a good family background.',
    'Seeking someone educated, well-settled, and family-oriented.',
    'Want a partner who respects traditions and values family.',
    'Looking for someone with similar interests and life goals.',
    'Seeking a compatible partner who values honesty and mutual respect.',
];

const rashis = ['Mesh', 'Vrishabh', 'Mithun', 'Kark', 'Simha', 'Kanya', 'Tula', 'Vrishchik', 'Dhanu', 'Makar', 'Kumbh', 'Meen'];
const nakshatras = ['Ashwini', 'Bharani', 'Krittika', 'Rohini', 'Mrigashira', 'Ardra', 'Punarvasu', 'Pushya', 'Ashlesha'];

const random = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];
const randomNumber = (min: number, max: number): number => Math.floor(Math.random() * (max - min + 1)) + min;
const randomDate = (startYear: number, endYear: number): Date => {
    const start = new Date(startYear, 0, 1);
    const end = new Date(endYear, 11, 31);
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
};

export const generateBasicInfo = () => {
    const gender = random([Gender.MALE, Gender.FEMALE]);
    return {
        firstName: gender === Gender.MALE ? random(firstNamesMale) : random(firstNamesFemale),
        lastName: random(lastNames),
        dateOfBirth: randomDate(1985, 2002), // Age between 23-40 years
        gender,
        height: randomNumber(150, 185),
    };
};

export const generateLocationData = () => ({
    city: random(cities),
    state: 'CHHATTISGARH',
    nativeDistrict: random(districts),
    nativeTehsil: random(tehsils),
    nativeVillage: random(villages),
    speaksChhattisgarhi: random([true, false]),
});

export const generateReligionData = () => ({
    religion: 'HINDU' as const,
    caste: random(castes),
    subCaste: random(subCastes),
    gothram: random(gothrams),
});

export const generatePhysicalLifestyleData = () => ({
    weight: randomNumber(45, 90),
    bloodGroup: random(bloodGroups),
    complexion: random(complexions),
    bodyType: random(bodyTypes),
    diet: random(['VEG', 'NON_VEG', 'EGGITARIAN'] as const),
    smokingHabit: random(['NO', 'OCCASIONALLY'] as const),
    drinkingHabit: random(['NO', 'OCCASIONALLY'] as const),
});

export const generateEducationCareerData = () => ({
    highestEducation: random(educationLevels as any),
    educationDetails: `${random(['Computer Science', 'Engineering', 'Commerce', 'Arts', 'Science', 'Management'])} - ${random(['University of Mumbai', 'Delhi University', 'Pt. Ravishankar Shukla University'])}`,
    occupationType: random(occupationTypes as any),
    jobTitle: random(jobTitles),
    occupationDetails: `Working in ${random(industries)}`,
    annualIncome: `${randomNumber(3, 25)} LPA`,
    workLocation: random(workLocations),
});

export const generateFamilyDetails = () => ({
    fatherName: `${random(firstNamesMale)} ${random(lastNames)}`,
    fatherOccupation: random(['Businessman', 'Government Employee', 'Retired', 'Teacher', 'Farmer']),
    motherName: `${random(firstNamesFemale)} Devi`,
    motherOccupation: random(['Homemaker', 'Teacher', 'Government Employee', 'Retired']),
    numberOfBrothers: randomNumber(0, 3),
    numberOfSisters: randomNumber(0, 3),
    familyType: random(['JOINT', 'NUCLEAR'] as const),
    familyStatus: random(['MIDDLE_CLASS', 'UPPER_MIDDLE', 'RICH'] as const),
});

export const generateAboutData = () => ({
    bio: 'A simple, down-to-earth person who values family and traditions. Looking forward to starting a new chapter in life with the right partner.',
    hobbies: random(hobbies),
    partnerExpectations: random(partnerExpectations),
});

export const generateHoroscopeData = () => ({
    manglik: random([true, false]),
    birthTime: `${randomNumber(0, 23).toString().padStart(2, '0')}:${randomNumber(0, 59).toString().padStart(2, '0')}`,
    birthPlace: random(cities),
    rashi: random(rashis),
    nakshatra: random(nakshatras),
});

export const generateCompleteTestData = () => ({
    ...generateBasicInfo(),
    ...generateLocationData(),
    ...generateReligionData(),
    ...generatePhysicalLifestyleData(),
    ...generateEducationCareerData(),
    ...generateFamilyDetails(),
    ...generateAboutData(),
    ...generateHoroscopeData(),
    maritalStatus: 'NEVER_MARRIED' as const,
    motherTongue: 'HINDI' as const,
});
