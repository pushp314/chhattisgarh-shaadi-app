import React from 'react';
import {View, StyleSheet, Image, Alert} from 'react-native';
import {
  Button,
  Text,
  Surface,
  IconButton,
} from 'react-native-paper';
import ImagePicker from 'react-native-image-crop-picker';
import {ProfileFormData} from '../../types/profileForm';

type Props = {
  data: Partial<ProfileFormData>;
  onUpdate: (data: Partial<ProfileFormData>) => void;
  onSubmit: () => void;
  onBack: () => void;
  isSubmitting: boolean;
};

const PhotosStep: React.FC<Props> = ({
  data,
  onUpdate,
  onSubmit,
  onBack,
  isSubmitting,
}) => {


  const pickImage = async () => {
    if ((data.photos || []).length >= 5) {
      Alert.alert('Maximum Limit', 'You can upload maximum 5 photos');
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
        onUpdate({photos: [...(data.photos || []), result.path]});
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to pick image');
    }
  };

  const removeImage = (index: number) => {
    Alert.alert(
      'Remove Photo',
      'Are you sure you want to remove this photo?',
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () => {
            const newPhotos = (data.photos || []).filter((_: string, i: number) => i !== index);
            onUpdate({photos: newPhotos});
          },
        },
      ],
    );
  };

  const handleSubmit = () => {
    if (!data.photos || data.photos.length === 0) {
      Alert.alert(
        'No Photos',
        'Are you sure you want to continue without adding photos? Profile photos help others know you better.',
        [
          {text: 'Add Photos', style: 'cancel'},
          {text: 'Continue', onPress: onSubmit},
        ],
      );
    } else {
      onSubmit();
    }
  };

  return (
    <Surface style={styles.container} elevation={1}>
      <Text variant="titleMedium" style={styles.sectionTitle}>
        Add Your Photos
      </Text>
      <Text variant="bodyMedium" style={styles.subtitle}>
        Add at least one photo to make your profile stand out
      </Text>

      <View style={styles.photosGrid}>
        {(data.photos || []).map((photo: string, index: number) => (
          <View key={index} style={styles.photoContainer}>
            <Image source={{uri: photo}} style={styles.photo} />
            <IconButton
              icon="close-circle"
              size={24}
              iconColor="#fff"
              style={styles.removeButton}
              onPress={() => removeImage(index)}
            />
            {index === 0 && (
              <View style={styles.primaryBadge}>
                <Text style={styles.primaryText}>Primary</Text>
              </View>
            )}
          </View>
        ))}

        {(data.photos || []).length < 5 && (
          <Button
            mode="outlined"
            onPress={pickImage}
            style={styles.addPhotoButton}
            icon="camera-plus"
            contentStyle={styles.addPhotoContent}>
            Add Photo
          </Button>
        )}
      </View>

      <View style={styles.infoBox}>
        <Text variant="bodySmall" style={styles.infoText}>
          📸 Tips for great photos:
        </Text>
        <Text variant="bodySmall" style={styles.infoText}>
          • Use clear, well-lit photos
        </Text>
        <Text variant="bodySmall" style={styles.infoText}>
          • Smile and look at the camera
        </Text>
        <Text variant="bodySmall" style={styles.infoText}>
          • Avoid group photos or sunglasses
        </Text>
        <Text variant="bodySmall" style={styles.infoText}>
          • First photo will be your profile picture
        </Text>
      </View>

      <View style={styles.buttonContainer}>
        <Button
          mode="outlined"
          onPress={onBack}
          style={styles.backButton}
          contentStyle={styles.buttonContent}
          disabled={isSubmitting}>
          Back
        </Button>
        <Button
          mode="contained"
          onPress={handleSubmit}
          style={styles.submitButton}
          contentStyle={styles.buttonContent}
          loading={isSubmitting}
          disabled={isSubmitting}>
          {isSubmitting ? 'Creating Profile...' : 'Complete Profile'}
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
    marginBottom: 8,
  },
  subtitle: {
    color: '#666',
    marginBottom: 16,
  },
  photosGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 16,
  },
  photoContainer: {
    width: 100,
    height: 100,
    borderRadius: 8,
    overflow: 'hidden',
    position: 'relative',
  },
  photo: {
    width: '100%',
    height: '100%',
  },
  removeButton: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  primaryBadge: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(216, 27, 96, 0.9)',
    paddingVertical: 2,
  },
  primaryText: {
    color: '#fff',
    fontSize: 10,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  addPhotoButton: {
    width: 100,
    height: 100,
    justifyContent: 'center',
    borderStyle: 'dashed',
  },
  addPhotoContent: {
    height: '100%',
    flexDirection: 'column',
  },
  infoBox: {
    backgroundColor: '#f0f0f0',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  infoText: {
    color: '#666',
    marginBottom: 4,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
    gap: 12,
  },
  backButton: {
    flex: 1,
  },
  submitButton: {
    flex: 2,
  },
  buttonContent: {
    paddingVertical: 8,
  },
});

export default PhotosStep;
