import React, {useState} from 'react';
import {View, StyleSheet} from 'react-native';
import {
  TextInput,
  Button,
  Text,
  Surface,
  HelperText,
  Chip,
} from 'react-native-paper';
import {ProfileFormData} from '../../types/profileForm';

type Props = {
  data: Partial<ProfileFormData>;
  onUpdate: (data: Partial<ProfileFormData>) => void;
  onNext: () => void;
  onBack: () => void;
};

const HOBBY_SUGGESTIONS = [
  'Reading',
  'Cooking',
  'Traveling',
  'Music',
  'Dancing',
  'Sports',
  'Yoga',
  'Gardening',
  'Photography',
  'Movies',
  'Art',
  'Writing',
  'Gaming',
  'Fitness',
  'Meditation',
];

const AboutStep: React.FC<Props> = ({data, onUpdate, onNext, onBack}) => {
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [customHobby, setCustomHobby] = useState('');

  const validate = () => {
    const newErrors: {[key: string]: string} = {};

    if (!data.aboutMe || data.aboutMe.trim().length < 50) {
      newErrors.aboutMe =
        'Please write at least 50 characters about yourself';
    }

    if (!data.hobbies || data.hobbies.length === 0) {
      newErrors.hobbies = 'Please select at least one hobby';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validate()) {
      onNext();
    }
  };

  const toggleHobby = (hobby: string) => {
    const currentHobbies = data.hobbies || [];
    const newHobbies = currentHobbies.includes(hobby)
      ? currentHobbies.filter((h: string) => h !== hobby)
      : [...currentHobbies, hobby];
    onUpdate({hobbies: newHobbies});
  };

  const addCustomHobby = () => {
    if (customHobby.trim() && !(data.hobbies || []).includes(customHobby)) {
      onUpdate({hobbies: [...(data.hobbies || []), customHobby.trim()]});
      setCustomHobby('');
    }
  };

  return (
    <Surface style={styles.container} elevation={1}>
      <Text variant="titleMedium" style={styles.sectionTitle}>
        Tell us more about yourself
      </Text>

      <TextInput
        label="About Me *"
        value={data.aboutMe || ''}
        onChangeText={text => onUpdate({aboutMe: text})}
        mode="outlined"
        style={styles.textArea}
        error={!!errors.aboutMe}
        placeholder="Write a brief description about yourself, your personality, values, and what you're looking for in a life partner..."
        multiline
        numberOfLines={6}
      />
      <HelperText type="info">
        {(data.aboutMe?.length || 0)} / 50 characters minimum
      </HelperText>
      <HelperText type="error" visible={!!errors.aboutMe}>
        {errors.aboutMe}
      </HelperText>

      <Text variant="bodyMedium" style={styles.label}>
        Hobbies & Interests *
      </Text>
      <View style={styles.chipsContainer}>
        {HOBBY_SUGGESTIONS.map(hobby => (
          <Chip
            key={hobby}
            selected={(data.hobbies || []).includes(hobby)}
            onPress={() => toggleHobby(hobby)}
            style={styles.chip}>
            {hobby}
          </Chip>
        ))}
      </View>
      <HelperText type="error" visible={!!errors.hobbies}>
        {errors.hobbies}
      </HelperText>

      <View style={styles.customHobbyContainer}>
        <TextInput
          label="Add Custom Hobby"
          value={customHobby}
          onChangeText={setCustomHobby}
          mode="outlined"
          style={styles.customHobbyInput}
          placeholder="Type a hobby"
          onSubmitEditing={addCustomHobby}
        />
        <Button
          mode="outlined"
          onPress={addCustomHobby}
          style={styles.addButton}
          disabled={!customHobby.trim()}>
          Add
        </Button>
      </View>

      {(data.hobbies || []).length > 0 && (
        <View style={styles.selectedContainer}>
          <Text variant="bodySmall" style={styles.selectedLabel}>
            Selected Hobbies:
          </Text>
          <View style={styles.selectedChips}>
            {(data.hobbies || []).map((hobby: string) => (
              <Chip
                key={hobby}
                onClose={() => toggleHobby(hobby)}
                style={styles.selectedChip}>
                {hobby}
              </Chip>
            ))}
          </View>
        </View>
      )}

      <View style={styles.buttonContainer}>
        <Button
          mode="outlined"
          onPress={onBack}
          style={styles.backButton}
          contentStyle={styles.buttonContent}>
          Back
        </Button>
        <Button
          mode="contained"
          onPress={handleNext}
          style={styles.nextButton}
          contentStyle={styles.buttonContent}>
          Next
        </Button>
      </View>
    </Surface>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    borderRadius: 8,
    backgroundColor: '#fff',
  },
  sectionTitle: {
    fontWeight: 'bold',
    marginBottom: 16,
  },
  textArea: {
    marginBottom: 4,
  },
  label: {
    marginTop: 8,
    marginBottom: 12,
    color: '#666',
  },
  chipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 8,
  },
  chip: {
    marginBottom: 8,
  },
  customHobbyContainer: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 12,
    marginBottom: 16,
  },
  customHobbyInput: {
    flex: 1,
  },
  addButton: {
    justifyContent: 'center',
  },
  selectedContainer: {
    marginTop: 8,
    marginBottom: 16,
  },
  selectedLabel: {
    color: '#666',
    marginBottom: 8,
  },
  selectedChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  selectedChip: {
    marginBottom: 8,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
    gap: 12,
  },
  backButton: {
    flex: 1,
  },
  nextButton: {
    flex: 1,
  },
  buttonContent: {
    paddingVertical: 8,
  },
});

export default AboutStep;
