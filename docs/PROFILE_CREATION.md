# Profile Creation Wizard - Implementation Details

## Overview
Complete multi-step profile creation wizard with 6 steps, form validation, and photo upload functionality.

## Architecture

### Main Screen
**File**: `src/screens/profile/CreateProfileScreen.tsx`
- **Purpose**: Orchestrates the multi-step wizard flow
- **State Management**: Local state for form data and step navigation
- **Key Features**:
  - Progress indicator showing current step
  - Step navigation (next/back)
  - Form data accumulation across steps
  - Final submission handler

### Step Components
All step components located in `src/components/profile/`

#### 1. BasicInfoStep.tsx
**Fields**:
- Full Name (text input with validation)
- Date of Birth (DateTimePicker with age validation 18-100)
- Gender (segmented buttons: Male/Female)
- Height (numeric input in cm, 120-250 range)

**Validation**:
- Name: minimum 2 characters
- DOB: must be 18+ years old
- Gender: required
- Height: 120-250 cm range

#### 2. LocationStep.tsx
**Fields**:
- Current State (dropdown with all Indian states)
- Current City (text input)
- Native District (dropdown with 28 Chhattisgarh districts)

**Validation**:
- All fields required
- City minimum 2 characters

**Data**:
- 28 Indian states predefined
- 28 Chhattisgarh districts: Raipur, Bilaspur, Durg, etc.

#### 3. ReligionStep.tsx
**Fields**:
- Religion (dropdown from Religion enum)
- Caste (text input)
- Sub-Caste (optional text input)
- Marital Status (dropdown from MaritalStatus enum)

**Validation**:
- Religion: required
- Caste: minimum 2 characters, required
- Marital Status: required

#### 4. EducationStep.tsx
**Fields**:
- Education Level (dropdown from Education enum)
- Education Details (optional multiline text)
- Occupation (dropdown from Occupation enum)
- Occupation Details (optional multiline text)
- Annual Income (dropdown with income ranges)

**Validation**:
- Education: required
- Occupation: required

**Income Ranges**:
- Below 2 Lakhs
- 2-5 Lakhs
- 5-10 Lakhs
- 10-15 Lakhs
- 15-20 Lakhs
- 20-30 Lakhs
- 30-50 Lakhs
- Above 50 Lakhs

#### 5. AboutStep.tsx
**Fields**:
- About Me (multiline text, min 50 characters)
- Hobbies & Interests (multi-select chips + custom hobby input)

**Validation**:
- About Me: minimum 50 characters, required
- Hobbies: at least 1 hobby required

**Hobby Suggestions**: 15 predefined options
- Reading, Cooking, Traveling, Music, Dancing, Sports, Yoga, Gardening, Photography, Movies, Art, Writing, Gaming, Fitness, Meditation

**Features**:
- Character counter for About Me
- Pre-defined hobby chips
- Custom hobby input with add button
- Selected hobbies with remove functionality

#### 6. PhotosStep.tsx
**Features**:
- Upload up to 5 photos
- Image picker with crop functionality (1024x1024)
- Remove photo functionality
- First photo is primary (profile picture)
- Optional (can skip but shows warning)

**UI Elements**:
- Photo grid showing uploaded images
- Primary badge on first photo
- Remove button on each photo
- Add photo button (dashed border)
- Tips box with photo guidelines

**Image Handling**:
- Uses `react-native-image-crop-picker`
- Cropping enabled
- Compression quality: 0.8
- Max dimensions: 1024x1024px

## Type Safety

### ProfileFormData Type
**File**: `src/types/profileForm.ts`

```typescript
export type ProfileFormData = {
  // Step 1
  name: string;
  dateOfBirth: Date;
  gender: string;
  height: number;
  
  // Step 2
  state: string;
  city: string;
  nativeDistrict: string;
  
  // Step 3
  religion: string;
  caste: string;
  subCaste?: string;
  maritalStatus: string;
  
  // Step 4
  education: string;
  educationDetails?: string;
  occupation: string;
  occupationDetails?: string;
  annualIncome?: string;
  
  // Step 5
  aboutMe: string;
  hobbies: string[];
  
  // Step 6
  photos: string[];
};
```

## New Enums Added

### Education Enum
```typescript
export enum Education {
  HIGH_SCHOOL = 'High School',
  INTERMEDIATE = 'Intermediate',
  DIPLOMA = 'Diploma',
  BACHELORS = 'Bachelors',
  MASTERS = 'Masters',
  DOCTORATE = 'Doctorate',
  PROFESSIONAL = 'Professional Degree',
}
```

### Occupation Enum
```typescript
export enum Occupation {
  STUDENT = 'Student',
  PRIVATE_SECTOR = 'Private Sector',
  GOVERNMENT = 'Government Employee',
  SELF_EMPLOYED = 'Self Employed',
  BUSINESS = 'Business',
  DOCTOR = 'Doctor',
  ENGINEER = 'Engineer',
  TEACHER = 'Teacher',
  LAWYER = 'Lawyer',
  ACCOUNTANT = 'Accountant',
  FARMER = 'Farmer',
  HOMEMAKER = 'Homemaker',
  NOT_WORKING = 'Not Working',
  OTHER = 'Other',
}
```

## User Experience

### Navigation Flow
1. **Welcome** → tap "Get Started"
2. **Google Sign-In** → authenticate
3. **Phone Verification** → verify one-time
4. **Profile Creation** → 6-step wizard
5. **Main App** → access all features

### Step Navigation
- **Next Button**: Validates current step, proceeds if valid
- **Back Button**: Returns to previous step (preserves data)
- **Progress Bar**: Visual indicator (1/6, 2/6, etc.)
- **Step Title**: Clear indication of current section

### Validation Strategy
- **On Submit**: Validation runs when clicking Next
- **Visual Feedback**: Error messages below fields
- **Field Highlighting**: Error state styling on invalid fields
- **Blocking**: Cannot proceed until step is valid

## Integration Points

### TODO: Backend Integration
**File**: `CreateProfileScreen.tsx`, line 76

```typescript
const handleSubmit = async () => {
  setIsSubmitting(true);
  try {
    // TODO: Call profileService.createProfile(formData)
    console.log('Submitting profile:', formData);
    
    navigation.navigate('Profile');
  } catch (error) {
    console.error('Error creating profile:', error);
    // TODO: Show error message
  } finally {
    setIsSubmitting(false);
  }
};
```

**Implementation Steps**:
1. Add `createProfile` method to `profileService.ts`
2. Transform form data to match backend API format
3. Upload photos separately using `uploadPhotos` API
4. Handle success/error states
5. Update profileStore after successful creation

### API Endpoint
```
POST /api/v1/profiles
Content-Type: multipart/form-data
```

## Dependencies

### New Dependencies Added
- `@react-native-community/datetimepicker` - Date picker component

### Existing Dependencies Used
- `react-native-paper` - UI components (TextInput, Button, Menu, etc.)
- `react-native-image-crop-picker` - Image selection and cropping
- `@react-navigation/native-stack` - Navigation

## Styling

### Theme
- **Primary Color**: #D81B60 (pink)
- **Surface Elevation**: Raised cards with shadow
- **Input Style**: Outlined mode
- **Button Style**: Contained (primary) and Outlined (secondary)

### Layout
- **Container**: White surface with border radius
- **Padding**: 16px throughout
- **Gap**: 12px between buttons
- **Input Margin**: 4px bottom, with HelperText below

## Testing Checklist

### Step 1 - Basic Info
- [ ] Name validation (min 2 chars)
- [ ] Age validation (18-100)
- [ ] Date picker works on iOS and Android
- [ ] Gender selection works
- [ ] Height validation (120-250 cm)

### Step 2 - Location
- [ ] State dropdown shows all states
- [ ] District dropdown shows CG districts
- [ ] City input validation
- [ ] Back button preserves data

### Step 3 - Religion
- [ ] Religion dropdown works
- [ ] Caste input validation
- [ ] Marital status dropdown works
- [ ] Sub-caste optional field

### Step 4 - Education
- [ ] Education dropdown works
- [ ] Occupation dropdown works
- [ ] Income dropdown (optional)
- [ ] Multiline details fields

### Step 5 - About
- [ ] Character counter updates
- [ ] Hobby chips toggle selection
- [ ] Custom hobby add/remove
- [ ] Min 50 chars validation
- [ ] Min 1 hobby validation

### Step 6 - Photos
- [ ] Image picker opens
- [ ] Image cropping works
- [ ] Max 5 photos enforced
- [ ] Remove photo works
- [ ] Primary badge on first photo
- [ ] Skip warning appears
- [ ] Submit button shows loading state

## Performance Considerations

1. **Form State**: Local state management (no re-renders on navigation)
2. **Image Compression**: 0.8 quality, max 1024px
3. **Validation**: On-demand (not on every keystroke)
4. **Scrolling**: KeyboardAvoidingView prevents input hiding
5. **Step Components**: Lazy rendering (only current step rendered)

## Accessibility

- All inputs have labels
- Error messages linked to fields
- Button content descriptive
- Focus management on step change
- Screen reader compatible

## Next Steps

1. **Backend Integration**: Implement `profileService.createProfile()`
2. **Photo Upload**: Implement batch photo upload
3. **Error Handling**: Add Toast/Alert for errors
4. **Success Screen**: Show completion message
5. **Profile View**: Display created profile
6. **Edit Profile**: Build edit functionality
7. **Validation Enhancement**: Add real-time validation (optional)
8. **Analytics**: Track step completion rates
