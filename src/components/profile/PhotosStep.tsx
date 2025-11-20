import React from 'react';
import { View, StyleSheet, Image, Alert } from 'react-native';
import { Button, Text, IconButton } from 'react-native-paper';
import ImagePicker from 'react-native-image-crop-picker';
import { useOnboardingStore } from '../../store/onboardingStore';

type Props = {
  onSubmit: () => void;
  onBack: () => void;
  isSubmitting: boolean;
};

const PhotosStep: React.FC<Props> = ({ onSubmit, onBack, isSubmitting }) => {
  const { photos, addPhoto, setPhotos } = useOnboardingStore((state) => ({...state}));

  const pickImage = async () => {
    if (photos.length >= 5) {
      Alert.alert('Maximum Limit', 'You can upload a maximum of 5 photos.');
      return;
    }

    try {
      const result = await ImagePicker.openPicker({
        mediaType: 'photo',
        width: 1024,
        height: 1024,
        cropping: true,
        compressImageQuality: 0.8,
      });

      if (result.path) {
        addPhoto(result.path);
      }
    } catch (error: any) {
      if (!error.message.includes('User cancelled')) {
        console.error('Error picking image:', error);
        Alert.alert('Error', 'Failed to pick image. Please try again.');
      }
    }
  };

  const removeImage = (index: number) => {
    Alert.alert('Remove Photo', 'Are you sure you want to remove this photo?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Remove',
        style: 'destructive',
        onPress: () => {
          const newPhotos = photos.filter((_, i) => i !== index);
          setPhotos(newPhotos);
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <Text variant="titleMedium" style={styles.sectionTitle}>Add Your Photos (Optional)</Text>

      <View style={styles.photosGrid}>
        {photos.map((photo, index) => (
          <View key={index} style={styles.photoContainer}>
            <Image source={{ uri: photo }} style={styles.photo} />
            <IconButton icon="close-circle" size={24} style={styles.removeButton} onPress={() => removeImage(index)} />
            {index === 0 && <Text style={styles.primaryBadge}>Primary</Text>}
          </View>
        ))}

        {photos.length < 5 && (
          <Button mode="outlined" onPress={pickImage} style={styles.addPhotoButton} icon="camera-plus">
            Add Photo
          </Button>
        )}
      </View>

      <View style={styles.buttonContainer}>
        <Button mode="outlined" onPress={onBack} disabled={isSubmitting} style={styles.backButton}>Back</Button>
        <Button mode="contained" onPress={onSubmit} loading={isSubmitting} disabled={isSubmitting} style={styles.submitButton}>
          {isSubmitting ? 'Creating Profile...' : 'Complete Profile'}
        </Button>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 16 },
  sectionTitle: { marginBottom: 16 },
  photosGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 16 },
  photoContainer: { width: 100, height: 100, borderRadius: 8, overflow: 'hidden', position: 'relative' },
  photo: { width: '100%', height: '100%' },
  removeButton: { position: 'absolute', top: -8, right: -8 },
  primaryBadge: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: 'rgba(0,0,0,0.6)', color: 'white', textAlign: 'center', paddingVertical: 2, fontSize: 12 },
  addPhotoButton: { width: 100, height: 100, justifyContent: 'center', alignItems: 'center', borderStyle: 'dashed' },
  buttonContainer: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 24, gap: 12 },
  backButton: { flex: 1 },
  submitButton: { flex: 2 },
});

export default PhotosStep;
