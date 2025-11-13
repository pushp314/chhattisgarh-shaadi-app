import React, {useState} from 'react';
import {View, StyleSheet} from 'react-native';
import {
  TextInput,
  Button,
  Text,
  Surface,
  HelperText,
  Menu,
} from 'react-native-paper';
import {ProfileFormData} from '../../types/profileForm';
import {Education, Occupation} from '../../constants/enums';

type Props = {
  data: Partial<ProfileFormData>;
  onUpdate: (data: Partial<ProfileFormData>) => void;
  onNext: () => void;
  onBack: () => void;
};

const EDUCATIONS = Object.values(Education);
const OCCUPATIONS = Object.values(Occupation);

const INCOME_RANGES = [
  'Below 2 Lakhs',
  '2-5 Lakhs',
  '5-10 Lakhs',
  '10-15 Lakhs',
  '15-20 Lakhs',
  '20-30 Lakhs',
  '30-50 Lakhs',
  'Above 50 Lakhs',
];

const EducationStep: React.FC<Props> = ({data, onUpdate, onNext, onBack}) => {
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [educationMenuVisible, setEducationMenuVisible] = useState(false);
  const [occupationMenuVisible, setOccupationMenuVisible] = useState(false);
  const [incomeMenuVisible, setIncomeMenuVisible] = useState(false);

  const validate = () => {
    const newErrors: {[key: string]: string} = {};

    if (!data.education) {
      newErrors.education = 'Please select your education level';
    }

    if (!data.occupation) {
      newErrors.occupation = 'Please select your occupation';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validate()) {
      onNext();
    }
  };

  return (
    <Surface style={styles.container} elevation={1}>
      <Text variant="titleMedium" style={styles.sectionTitle}>
        Education & Career
      </Text>

      <View style={styles.menuContainer}>
        <Text variant="bodyMedium" style={styles.label}>
          Education Level *
        </Text>
        <Menu
          visible={educationMenuVisible}
          onDismiss={() => setEducationMenuVisible(false)}
          anchor={
            <Button
              mode="outlined"
              onPress={() => setEducationMenuVisible(true)}
              style={styles.menuButton}
              icon="chevron-down"
              contentStyle={styles.menuButtonContent}>
              {data.education || 'Select Education'}
            </Button>
          }>
          {EDUCATIONS.map(edu => (
            <Menu.Item
              key={edu}
              onPress={() => {
                onUpdate({education: edu});
                setEducationMenuVisible(false);
              }}
              title={edu}
            />
          ))}
        </Menu>
        <HelperText type="error" visible={!!errors.education}>
          {errors.education}
        </HelperText>
      </View>

      <TextInput
        label="Education Details (Optional)"
        value={data.educationDetails || ''}
        onChangeText={text => onUpdate({educationDetails: text})}
        mode="outlined"
        style={styles.input}
        placeholder="e.g., B.Tech in Computer Science from NIT Raipur"
        multiline
        numberOfLines={2}
      />

      <View style={styles.menuContainer}>
        <Text variant="bodyMedium" style={styles.label}>
          Occupation *
        </Text>
        <Menu
          visible={occupationMenuVisible}
          onDismiss={() => setOccupationMenuVisible(false)}
          anchor={
            <Button
              mode="outlined"
              onPress={() => setOccupationMenuVisible(true)}
              style={styles.menuButton}
              icon="chevron-down"
              contentStyle={styles.menuButtonContent}>
              {data.occupation || 'Select Occupation'}
            </Button>
          }>
          {OCCUPATIONS.map(occ => (
            <Menu.Item
              key={occ}
              onPress={() => {
                onUpdate({occupation: occ});
                setOccupationMenuVisible(false);
              }}
              title={occ}
            />
          ))}
        </Menu>
        <HelperText type="error" visible={!!errors.occupation}>
          {errors.occupation}
        </HelperText>
      </View>

      <TextInput
        label="Occupation Details (Optional)"
        value={data.occupationDetails || ''}
        onChangeText={text => onUpdate({occupationDetails: text})}
        mode="outlined"
        style={styles.input}
        placeholder="e.g., Software Engineer at TCS Raipur"
        multiline
        numberOfLines={2}
      />

      <View style={styles.menuContainer}>
        <Text variant="bodyMedium" style={styles.label}>
          Annual Income (Optional)
        </Text>
        <Menu
          visible={incomeMenuVisible}
          onDismiss={() => setIncomeMenuVisible(false)}
          anchor={
            <Button
              mode="outlined"
              onPress={() => setIncomeMenuVisible(true)}
              style={styles.menuButton}
              icon="chevron-down"
              contentStyle={styles.menuButtonContent}>
              {data.annualIncome || 'Select Income Range'}
            </Button>
          }>
          {INCOME_RANGES.map(range => (
            <Menu.Item
              key={range}
              onPress={() => {
                onUpdate({annualIncome: range});
                setIncomeMenuVisible(false);
              }}
              title={range}
            />
          ))}
        </Menu>
      </View>

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
  input: {
    marginBottom: 12,
  },
  label: {
    marginBottom: 8,
    color: '#666',
  },
  menuContainer: {
    marginBottom: 12,
  },
  menuButton: {
    marginBottom: 4,
    justifyContent: 'flex-start',
  },
  menuButtonContent: {
    justifyContent: 'space-between',
    flexDirection: 'row-reverse',
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

export default EducationStep;
