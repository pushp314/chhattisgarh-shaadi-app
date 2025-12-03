import React, { useState } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import {
  Text,
  Button,
  TextInput,
  Surface,
  Divider,
  Menu,
} from 'react-native-paper';
import { Theme } from '../constants/theme';
import { Religion, MaritalStatus, Education, Occupation } from '../constants/enums';

type FilterValues = {
  minAge?: number;
  maxAge?: number;
  minHeight?: number;
  maxHeight?: number;
  religion?: string;
  caste?: string;
  maritalStatus?: string;
  education?: string;
  occupation?: string;
  state?: string;
  nativeDistrict?: string;
};

type Props = {
  initialFilters: FilterValues;
  onApply: (filters: FilterValues) => void;
  onClose: () => void;
};

const CG_DISTRICTS = [
  'Balod', 'Baloda Bazar', 'Balrampur', 'Bastar', 'Bemetara', 'Bijapur',
  'Bilaspur', 'Dantewada', 'Dhamtari', 'Durg', 'Gariaband',
  'Gaurela-Pendra-Marwahi', 'Janjgir-Champa', 'Jashpur', 'Kabirdham',
  'Kanker', 'Kondagaon', 'Korba', 'Koriya', 'Mahasamund', 'Mungeli',
  'Narayanpur', 'Raigarh', 'Raipur', 'Rajnandgaon', 'Sukma', 'Surajpur', 'Surguja',
];

const SearchFilters: React.FC<Props> = ({ initialFilters, onApply, onClose }) => {
  const [filters, setFilters] = useState<FilterValues>(initialFilters);
  const [religionMenuVisible, setReligionMenuVisible] = useState(false);
  const [maritalMenuVisible, setMaritalMenuVisible] = useState(false);
  const [educationMenuVisible, setEducationMenuVisible] = useState(false);
  const [occupationMenuVisible, setOccupationMenuVisible] = useState(false);
  const [districtMenuVisible, setDistrictMenuVisible] = useState(false);

  const updateFilter = (key: keyof FilterValues, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({});
  };

  const handleApply = () => {
    onApply(filters);
  };

  return (
    <View style={styles.container}>
      <Surface style={styles.header} elevation={0}>
        <Text variant="titleLarge" style={styles.title}>
          Filter Profiles
        </Text>
        <Button mode="text" onPress={clearFilters}>
          Clear All
        </Button>
      </Surface>

      <ScrollView style={styles.content}>
        {/* Age Range */}
        <View style={styles.section}>
          <Text variant="titleMedium" style={styles.sectionTitle}>
            Age Range
          </Text>
          <View style={styles.row}>
            <TextInput
              label="Min Age"
              value={filters.minAge?.toString() || ''}
              onChangeText={text => updateFilter('minAge', parseInt(text, 10) || undefined)}
              keyboardType="number-pad"
              mode="outlined"
              style={styles.halfInput}
            />
            <TextInput
              label="Max Age"
              value={filters.maxAge?.toString() || ''}
              onChangeText={text => updateFilter('maxAge', parseInt(text, 10) || undefined)}
              keyboardType="number-pad"
              mode="outlined"
              style={styles.halfInput}
            />
          </View>
        </View>

        <Divider />

        {/* Height Range */}
        <View style={styles.section}>
          <Text variant="titleMedium" style={styles.sectionTitle}>
            Height (cm)
          </Text>
          <View style={styles.row}>
            <TextInput
              label="Min Height"
              value={filters.minHeight?.toString() || ''}
              onChangeText={text => updateFilter('minHeight', parseInt(text, 10) || undefined)}
              keyboardType="number-pad"
              mode="outlined"
              style={styles.halfInput}
            />
            <TextInput
              label="Max Height"
              value={filters.maxHeight?.toString() || ''}
              onChangeText={text => updateFilter('maxHeight', parseInt(text, 10) || undefined)}
              keyboardType="number-pad"
              mode="outlined"
              style={styles.halfInput}
            />
          </View>
        </View>

        <Divider />

        {/* Religion */}
        <View style={styles.section}>
          <Text variant="titleMedium" style={styles.sectionTitle}>
            Religion
          </Text>
          <Menu
            visible={religionMenuVisible}
            onDismiss={() => setReligionMenuVisible(false)}
            anchor={
              <Button
                mode="outlined"
                onPress={() => setReligionMenuVisible(true)}
                icon="chevron-down"
                contentStyle={styles.menuButtonContent}>
                {filters.religion || 'Select Religion'}
              </Button>
            }>
            {Object.values(Religion).map(religion => (
              <Menu.Item
                key={religion}
                onPress={() => {
                  updateFilter('religion', religion);
                  setReligionMenuVisible(false);
                }}
                title={religion}
              />
            ))}
          </Menu>
        </View>

        <Divider />

        {/* Caste */}
        <View style={styles.section}>
          <Text variant="titleMedium" style={styles.sectionTitle}>
            Caste
          </Text>
          <TextInput
            label="Caste"
            value={filters.caste || ''}
            onChangeText={text => updateFilter('caste', text)}
            mode="outlined"
          />
        </View>

        <Divider />

        {/* Marital Status */}
        <View style={styles.section}>
          <Text variant="titleMedium" style={styles.sectionTitle}>
            Marital Status
          </Text>
          <Menu
            visible={maritalMenuVisible}
            onDismiss={() => setMaritalMenuVisible(false)}
            anchor={
              <Button
                mode="outlined"
                onPress={() => setMaritalMenuVisible(true)}
                icon="chevron-down"
                contentStyle={styles.menuButtonContent}>
                {filters.maritalStatus || 'Select Marital Status'}
              </Button>
            }>
            {Object.values(MaritalStatus).map(status => (
              <Menu.Item
                key={status}
                onPress={() => {
                  updateFilter('maritalStatus', status);
                  setMaritalMenuVisible(false);
                }}
                title={status.replace('_', ' ')}
              />
            ))}
          </Menu>
        </View>

        <Divider />

        {/* Education */}
        <View style={styles.section}>
          <Text variant="titleMedium" style={styles.sectionTitle}>
            Education
          </Text>
          <Menu
            visible={educationMenuVisible}
            onDismiss={() => setEducationMenuVisible(false)}
            anchor={
              <Button
                mode="outlined"
                onPress={() => setEducationMenuVisible(true)}
                icon="chevron-down"
                contentStyle={styles.menuButtonContent}>
                {filters.education || 'Select Education'}
              </Button>
            }>
            {Object.values(Education).map(edu => (
              <Menu.Item
                key={edu}
                onPress={() => {
                  updateFilter('education', edu);
                  setEducationMenuVisible(false);
                }}
                title={edu}
              />
            ))}
          </Menu>
        </View>

        <Divider />

        {/* Occupation */}
        <View style={styles.section}>
          <Text variant="titleMedium" style={styles.sectionTitle}>
            Occupation
          </Text>
          <Menu
            visible={occupationMenuVisible}
            onDismiss={() => setOccupationMenuVisible(false)}
            anchor={
              <Button
                mode="outlined"
                onPress={() => setOccupationMenuVisible(true)}
                icon="chevron-down"
                contentStyle={styles.menuButtonContent}>
                {filters.occupation || 'Select Occupation'}
              </Button>
            }>
            {Object.values(Occupation).map(occ => (
              <Menu.Item
                key={occ}
                onPress={() => {
                  updateFilter('occupation', occ);
                  setOccupationMenuVisible(false);
                }}
                title={occ}
              />
            ))}
          </Menu>
        </View>

        <Divider />

        {/* Native District */}
        <View style={styles.section}>
          <Text variant="titleMedium" style={styles.sectionTitle}>
            Native District (Chhattisgarh)
          </Text>
          <Menu
            visible={districtMenuVisible}
            onDismiss={() => setDistrictMenuVisible(false)}
            anchor={
              <Button
                mode="outlined"
                onPress={() => setDistrictMenuVisible(true)}
                icon="chevron-down"
                contentStyle={styles.menuButtonContent}>
                {filters.nativeDistrict || 'Select District'}
              </Button>
            }>
            {CG_DISTRICTS.map(district => (
              <Menu.Item
                key={district}
                onPress={() => {
                  updateFilter('nativeDistrict', district);
                  setDistrictMenuVisible(false);
                }}
                title={district}
              />
            ))}
          </Menu>
        </View>
      </ScrollView>

      <Surface style={styles.footer} elevation={4}>
        <Button
          mode="outlined"
          onPress={onClose}
          style={styles.footerButton}>
          Cancel
        </Button>
        <Button
          mode="contained"
          onPress={handleApply}
          style={styles.footerButton}
          buttonColor={Theme.colors.secondary}
          textColor={Theme.colors.primaryDark}>
          Apply Filters
        </Button>
      </Surface>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.colors.white,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: Theme.colors.surfaceCard,
  },
  title: {
    fontWeight: 'bold',
    color: Theme.colors.text,
  },
  content: {
    flex: 1,
  },
  section: {
    padding: 16,
  },
  sectionTitle: {
    marginBottom: 12,
    fontWeight: '600',
    color: Theme.colors.text,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  halfInput: {
    flex: 1,
  },
  menuButtonContent: {
    justifyContent: 'space-between',
    flexDirection: 'row-reverse',
  },
  footer: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
    backgroundColor: Theme.colors.white,
    ...Theme.shadows.md,
  },
  footerButton: {
    flex: 1,
    borderRadius: 8,
  },
});

export default SearchFilters;
