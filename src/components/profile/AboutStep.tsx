import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { TextInput, Button, Text, Chip, HelperText } from 'react-native-paper';
import { useOnboardingStore } from '../../store/onboardingStore';

const HOBBY_SUGGESTIONS = [
  'Reading', 'Cooking', 'Traveling', 'Music', 'Dancing', 'Sports', 'Yoga', 'Gardening', 'Photography', 'Movies', 'Art', 'Writing', 'Gaming', 'Fitness', 'Meditation',
];

const aboutSchema = z.object({
  aboutMe: z.string().min(50, 'Please write at least 50 characters about yourself'),
  hobbies: z.array(z.string()).min(1, 'Please select at least one hobby'),
});

type AboutFormData = z.infer<typeof aboutSchema>;

type Props = {
  onNext: () => void;
  onBack: () => void;
};

const AboutStep: React.FC<Props> = ({ onNext, onBack }) => {
  const { aboutMe, hobbies, updateOnboardingData } = useOnboardingStore((state) => ({...state}));

  const { control, handleSubmit, setValue, watch, formState: { errors } } = useForm<AboutFormData>({
    resolver: zodResolver(aboutSchema),
    defaultValues: {
      aboutMe: aboutMe || '',
      hobbies: hobbies || [],
    },
  });

  const currentHobbies = watch('hobbies');

  const toggleHobby = (hobby: string) => {
    const newHobbies = currentHobbies.includes(hobby)
      ? currentHobbies.filter((h) => h !== hobby)
      : [...currentHobbies, hobby];
    setValue('hobbies', newHobbies, { shouldValidate: true });
  };

  const onSubmit = (data: AboutFormData) => {
    updateOnboardingData('aboutMe', data.aboutMe);
    updateOnboardingData('hobbies', data.hobbies);
    onNext();
  };

  return (
    <View style={styles.container}>
      <Text variant="titleMedium" style={styles.sectionTitle}>Tell us more about yourself</Text>

      <Controller
        control={control}
        name="aboutMe"
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            label="About Me *"
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            mode="outlined"
            multiline
            numberOfLines={6}
            error={!!errors.aboutMe}
          />
        )}
      />
      <HelperText type="error" visible={!!errors.aboutMe}>{errors.aboutMe?.message}</HelperText>

      <Text style={styles.label}>Hobbies & Interests *</Text>
      <View style={styles.chipsContainer}>
        {HOBBY_SUGGESTIONS.map((hobby) => (
          <Chip key={hobby} selected={currentHobbies.includes(hobby)} onPress={() => toggleHobby(hobby)}>
            {hobby}
          </Chip>
        ))}
      </View>
      <HelperText type="error" visible={!!errors.hobbies}>{errors.hobbies?.message}</HelperText>

      <View style={styles.buttonContainer}>
        <Button mode="outlined" onPress={onBack} style={styles.backButton}>Back</Button>
        <Button mode="contained" onPress={handleSubmit(onSubmit)} style={styles.nextButton}>Next</Button>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 16 },
  sectionTitle: { marginBottom: 16 },
  label: { marginTop: 16, marginBottom: 8 },
  chipsContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  buttonContainer: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 24, gap: 12 },
  backButton: { flex: 1 },
  nextButton: { flex: 1 },
});

export default AboutStep;
