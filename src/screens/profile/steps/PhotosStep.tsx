import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  Dimensions, // Import Dimensions
} from 'react-native';
// --- Import Image Picker ---
import ImagePicker, { Image as ImageType } from 'react-native-image-crop-picker';
import { Button, Card } from '../../../components';
import { colors } from '../../../theme/colors';

interface PhotosStepProps {
  data: any;
  onNext: (data: any) => void;
  onBack: () => void;
}

const MAX_PHOTOS = 6;
// --- Calculate photo size based on screen width ---
const { width } = Dimensions.get('window');
// (Screen width - Horizontal padding - Gaps between items) / Items per row
const PHOTO_SIZE = (width - 20 * 2 - 10 * 2) / 3;

const PhotosStep: React.FC<PhotosStepProps> = ({ data, onNext, onBack }) => {
  // --- State now holds ImageType objects from the picker ---
  const [photos, setPhotos] = useState<ImageType[]>(data.photos || []); // Use ImageType[]
  const [errors, setErrors] = useState<any>({}); // Keep error state

  const validate = () => {
    const newErrors: any = {};
    if (photos.length < 1) {
      newErrors.photos = 'Please add at least one photo';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // --- Image Picker Logic ---
  const handleChooseFromLibrary = () => {
     if (photos.length >= MAX_PHOTOS) {
      Alert.alert('Maximum Photos', `You can add up to ${MAX_PHOTOS} photos.`);
      return;
    }
    ImagePicker.openPicker({
      multiple: true,
      maxFiles: MAX_PHOTOS - photos.length, // Only allow picking remaining slots
      mediaType: 'photo',
      cropping: true,
      compressImageQuality: 0.8,
      cropperCircleOverlay: false, // Use square crop
      // cropperAspectRatioOptions: { width: 1, height: 1 } // Example: force square crop
    })
      .then(selectedImages => {
        if (selectedImages) {
          // Filter out any potential duplicates (though unlikely with picker)
          const newImages = selectedImages.filter(img => !photos.some(p => p.path === img.path));
          setPhotos(prevPhotos => [...prevPhotos, ...newImages].slice(0, MAX_PHOTOS)); // Ensure max limit
          setErrors({}); // Clear errors
        }
      })
      .catch(error => {
        console.log('ImagePicker Error: ', error);
        if (error.code !== 'E_PICKER_CANCELLED') {
           Alert.alert('Error', 'Could not select photos. Please check permissions and try again.');
        }
      });
  };

  const handleTakePhoto = () => {
    if (photos.length >= MAX_PHOTOS) {
      Alert.alert('Maximum Photos', `You can add up to ${MAX_PHOTOS} photos.`);
      return;
    }
    ImagePicker.openCamera({
      mediaType: 'photo',
      cropping: true,
      compressImageQuality: 0.8,
      cropperCircleOverlay: false,
    })
      .then(image => {
        if (image) {
          setPhotos(prevPhotos => [...prevPhotos, image].slice(0, MAX_PHOTOS));
          setErrors({}); // Clear errors
        }
      })
      .catch(error => {
        console.log('Camera Error: ', error);
        if (error.code !== 'E_PICKER_CANCELLED') {
           Alert.alert('Error', 'Could not take photo. Please check permissions and try again.');
        }
      });
  };
  // --- End Image Picker Logic ---

  const handleRemovePhoto = (indexToRemove: number) => {
    Alert.alert(
      'Remove Photo',
      'Are you sure you want to remove this photo?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () => {
            setPhotos(prevPhotos =>
              prevPhotos.filter((_, index) => index !== indexToRemove),
            );
          },
        },
      ],
    );
  };

  const handleNext = () => {
    if (validate()) {
        // Pass the necessary photo data (local path and mime type)
        const photoData = photos.map(p => ({
            uri: p.path, // Use the path from the picker result
            mime: p.mime,
        }));
        onNext({ photos: photoData });
    } else {
         Alert.alert(
            'Missing Photos',
            'Please add at least one photo to complete your profile.',
         );
    }
    // Remove the skip option for the final step unless explicitly desired
  };

  // Function to render each photo slot
  const renderPhotoSlot = (index: number) => {
    const photo = photos[index];

    if (photo) {
      // Display the selected image
      return (
        <View key={index} style={styles.photoSlot}>
           <TouchableOpacity
              style={styles.photoContainer}
              onPress={() => {/* Maybe allow viewing/editing? */}}
              onLongPress={() => handleRemovePhoto(index)} // Long press to remove
            >
              <Image
                source={{ uri: photo.path }} // Use photo.path from picker
                style={styles.photo}
              />
              <TouchableOpacity /* Use a dedicated remove button instead of onPress on container */
                style={styles.removeButton}
                onPress={() => handleRemovePhoto(index)}
              >
                <Text style={styles.removeIcon}>✕</Text>
              </TouchableOpacity>
              {index === 0 && (
                <View style={styles.primaryBadge}>
                  <Text style={styles.primaryText}>Primary</Text>
                </View>
              )}
           </TouchableOpacity>
        </View>
      );
    } else {
      // Display an "Add Photo" placeholder
      // Make the first empty slot trigger camera/library choice
       const canAddMore = photos.length < MAX_PHOTOS;
       const isNextAvailableSlot = index === photos.length;

      return (
        <View key={index} style={styles.photoSlot}>
            <TouchableOpacity
                style={styles.addPhotoButton}
                onPress={handleChooseFromLibrary} // Default to library, or show options
                disabled={!canAddMore || !isNextAvailableSlot} // Only enable the next empty slot
            >
                <Text style={[styles.addPhotoIcon, (!canAddMore || !isNextAvailableSlot) && styles.disabledIcon]}>+</Text>
                <Text style={[styles.addPhotoText, (!canAddMore || !isNextAvailableSlot) && styles.disabledText]}>
                {index === 0 ? 'Add Primary' : 'Add Photo'}
                </Text>
            </TouchableOpacity>
        </View>
      );
    }
  };


  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>

        {/* Instructions */}
        <Card style={styles.instructionCard}>
          <Text style={styles.instructionEmoji}>📸</Text>
          <Text style={styles.instructionTitle}>Add Your Photos</Text>
          <Text style={styles.instructionText}>
            Add 1 to {MAX_PHOTOS} photos. The first photo is your primary profile picture.
          </Text>
          <Text style={styles.instructionSubText}>
            Clear face photos get more attention!
          </Text>
        </Card>

        {/* Photo Guidelines (Keep as is) */}
        <Card style={styles.guidelinesCard}>
         {/* ... guidelines ... */}
          <Text style={styles.guidelinesTitle}>Photo Guidelines</Text>
          <View style={styles.guidelineItem}>
            <Text style={styles.guidelineIcon}>✓</Text>
            <Text style={styles.guidelineText}>Clear face photos work best</Text>
          </View>
          <View style={styles.guidelineItem}>
            <Text style={styles.guidelineIcon}>✓</Text>
            <Text style={styles.guidelineText}>Good lighting is important</Text>
          </View>
          <View style={styles.guidelineItem}>
            <Text style={styles.guidelineIcon}>✓</Text>
            <Text style={styles.guidelineText}>Smile and look natural</Text>
          </View>
          <View style={styles.guidelineItem}>
            <Text style={styles.guidelineIcon}>✗</Text>
            <Text style={styles.guidelineText}>No group photos</Text>
          </View>
          <View style={styles.guidelineItem}>
            <Text style={styles.guidelineIcon}>✗</Text>
            <Text style={styles.guidelineText}>No blurry or filtered photos</Text>
          </View>
        </Card>

        {/* Photo Grid */}
        <Card style={styles.formCard}>
            {/* --- Updated Photo Grid Rendering --- */}
            <View style={styles.photoGridContainer}>
                {/* Create an array representing all MAX_PHOTOS slots */}
                {Array.from({ length: MAX_PHOTOS }).map((_, index) =>
                    renderPhotoSlot(index)
                )}
            </View>

            {/* Error Message */}
            {errors.photos && (
              <View style={styles.errorContainer}>
                <Text style={styles.errorIcon}>⚠️</Text>
                <Text style={styles.errorText}>{errors.photos}</Text>
              </View>
            )}

            {/* --- Add Photo Buttons --- */}
             <View style={styles.addButtonsContainer}>
                <Button
                    title="Choose from Library"
                    onPress={handleChooseFromLibrary}
                    variant="outline"
                    disabled={photos.length >= MAX_PHOTOS}
                    style={styles.addButton}
                    leftIcon={<Text>🖼️</Text>}
                />
                <Button
                    title="Take Photo"
                    onPress={handleTakePhoto}
                    variant="outline"
                    disabled={photos.length >= MAX_PHOTOS}
                    style={styles.addButton}
                    leftIcon={<Text>📷</Text>}
                />
            </View>


            <Text style={styles.photoCount}>
                {photos.length}/{MAX_PHOTOS} photos added
            </Text>
        </Card>

        {/* Info Card (Keep as is) */}
        <Card style={styles.infoCard}>
         {/* ... info ... */}
          <Text style={styles.infoIcon}>💡</Text>
          <Text style={styles.infoText}>
            Your first photo will be your primary profile photo. Long press a photo to remove it.
          </Text>
        </Card>
      </ScrollView>

      {/* Bottom Buttons */}
      <View style={styles.bottomButtons}>
        <Button
          title="Back"
          onPress={onBack}
          variant="outline"
          style={styles.backButton}
          leftIcon={<Text style={styles.buttonIconOutline}>←</Text>}
        />
        <Button
          title="Complete Profile"
          onPress={handleNext}
          style={styles.nextButton}
          rightIcon={<Text style={styles.buttonIcon}>✓</Text>}
        />
      </View>
    </View>
  );
};

// --- Updated Styles ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 100,
  },
  // Instruction/Guideline/Info Card styles (keep as is)
  instructionCard: { alignItems: 'center', marginBottom: 20 },
  instructionEmoji: { fontSize: 40, marginBottom: 12 },
  instructionTitle: { fontSize: 20, fontWeight: 'bold', color: colors.text.primary, marginBottom: 8 },
  instructionText: { fontSize: 14, color: colors.text.secondary, textAlign: 'center', lineHeight: 20, marginBottom: 4 },
  instructionSubText: { fontSize: 12, color: colors.text.secondary, textAlign: 'center', fontStyle: 'italic' },
  guidelinesCard: { marginBottom: 20, backgroundColor: colors.info + '10' },
  guidelinesTitle: { fontSize: 16, fontWeight: 'bold', color: colors.text.primary, marginBottom: 12 },
  guidelineItem: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  guidelineIcon: { fontSize: 16, marginRight: 8, width: 20 },
  guidelineText: { fontSize: 13, color: colors.text.secondary },
  infoCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.success + '10' },
  infoIcon: { fontSize: 24, marginRight: 12 },
  infoText: { flex: 1, fontSize: 13, color: colors.text.secondary, lineHeight: 18 },

  formCard: { // Card containing the grid and add buttons
    marginBottom: 20,
  },
  photoGridContainer: { // Container for the photo slots
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 20,
  },
  photoSlot: { // View containing either photo or add button
    width: PHOTO_SIZE,
    height: PHOTO_SIZE,
    // No background needed here, it's in the children
  },
  photoContainer: { // Container for the actual image + remove button
    width: '100%',
    height: '100%',
    borderRadius: 12,
    overflow: 'hidden', // Clip image
    position: 'relative', // For absolute positioning children
    backgroundColor: colors.neutral.gray100, // Background while image loads
  },
  photo: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  removeButton: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  removeIcon: {
    fontSize: 14, // Smaller icon
    color: colors.neutral.white,
    fontWeight: 'bold',
    lineHeight: 16 // Adjust centering
  },
  primaryBadge: {
    position: 'absolute',
    bottom: 4,
    left: 4,
    // Removed right: 4 to make it smaller
    backgroundColor: colors.primary.main,
    paddingVertical: 2, // Smaller padding
    paddingHorizontal: 6,
    borderRadius: 4,
    alignItems: 'center',
  },
  primaryText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: colors.neutral.white,
  },
  addPhotoButton: { // Placeholder button style
    width: '100%',
    height: '100%',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.neutral.gray300,
    borderStyle: 'dashed',
    backgroundColor: colors.neutral.gray50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addPhotoIcon: {
    fontSize: 32,
    color: colors.text.disabled,
    marginBottom: 4,
  },
  addPhotoText: {
    fontSize: 11,
    color: colors.text.secondary,
    fontWeight: '600',
    textAlign: 'center'
  },
  disabledIcon: { // Style for disabled add icon
      color: colors.neutral.gray300,
  },
  disabledText: { // Style for disabled add text
      color: colors.neutral.gray400,
  },
  addButtonsContainer: { // Container for Library/Camera buttons
      flexDirection: 'row',
      gap: 10,
      marginTop: 10, // Add some space above
      marginBottom: 10,
  },
  addButton: { // Style for Library/Camera buttons
      flex: 1, // Make them share space
  },
  photoCount: {
    fontSize: 13,
    color: colors.text.secondary,
    textAlign: 'center',
    marginTop: 8,
    fontWeight: '600',
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
    width: '100%' // Ensure error shows below grid
  },
  errorIcon: {
    fontSize: 14,
    marginRight: 4,
  },
  errorText: {
    fontSize: 12,
    color: colors.error,
  },
  bottomButtons: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    paddingBottom: 30, // Extra padding for home bar
    backgroundColor: colors.neutral.white,
    borderTopWidth: 1,
    borderTopColor: colors.neutral.gray200,
    flexDirection: 'row',
    gap: 12,
  },
  backButton: {
    flex: 1,
  },
  nextButton: {
    flex: 2,
  },
  buttonIcon: {
    fontSize: 20,
    color: colors.neutral.white,
  },
  buttonIconOutline: {
    fontSize: 20,
    color: colors.primary.main,
  },
});

export default PhotosStep;