import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { colors, typography, spacing, radii, shadows } from '../../utils/theme';

interface ImagePickerGridProps {
  imageUris: string[];
  coverIndex: number;
  onImagesChange: (uris: string[]) => void;
  onCoverChange: (index: number) => void;
  maxImages?: number;
}

export default function ImagePickerGrid({
  imageUris,
  coverIndex,
  onImagesChange,
  onCoverChange,
  maxImages = 6,
}: ImagePickerGridProps) {
  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Required', 'Please grant photo library access to add images.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsMultipleSelection: true,
      quality: 0.8,
      selectionLimit: maxImages - imageUris.length,
    });

    if (!result.canceled && result.assets.length > 0) {
      const newUris = result.assets.map(a => a.uri);
      onImagesChange([...imageUris, ...newUris].slice(0, maxImages));
    }
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Required', 'Please grant camera access to take photos.');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      quality: 0.8,
    });

    if (!result.canceled && result.assets.length > 0) {
      onImagesChange([...imageUris, result.assets[0].uri].slice(0, maxImages));
    }
  };

  const removeImage = (index: number) => {
    const newUris = imageUris.filter((_, i) => i !== index);
    onImagesChange(newUris);
    if (coverIndex === index) {
      onCoverChange(0);
    } else if (coverIndex > index) {
      onCoverChange(coverIndex - 1);
    }
  };

  const handleAdd = () => {
    Alert.alert('Add Photo', 'Choose a source', [
      { text: 'Camera', onPress: takePhoto },
      { text: 'Photo Library', onPress: pickImage },
      { text: 'Cancel', style: 'cancel' },
    ]);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Photos ({imageUris.length}/{maxImages})</Text>
      <Text style={styles.hint}>Tap the star to set as cover photo</Text>
      <View style={styles.grid}>
        {imageUris.map((uri, index) => (
          <View key={`${uri}-${index}`} style={styles.imageWrapper}>
            <Image source={{ uri }} style={styles.image} />
            {/* Cover star */}
            <TouchableOpacity
              style={styles.starButton}
              onPress={() => onCoverChange(index)}
            >
              <Ionicons
                name={coverIndex === index ? 'star' : 'star-outline'}
                size={18}
                color={coverIndex === index ? colors.golden : colors.white}
              />
            </TouchableOpacity>
            {/* Remove button */}
            <TouchableOpacity
              style={styles.removeButton}
              onPress={() => removeImage(index)}
            >
              <Ionicons name="close-circle" size={22} color={colors.red} />
            </TouchableOpacity>
            {coverIndex === index && (
              <View style={styles.coverLabel}>
                <Text style={styles.coverLabelText}>Cover</Text>
              </View>
            )}
          </View>
        ))}
        {imageUris.length < maxImages && (
          <TouchableOpacity style={styles.addButton} onPress={handleAdd}>
            <Ionicons name="add" size={32} color={colors.teal} />
            <Text style={styles.addText}>Add</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.lg,
  },
  label: {
    ...typography.labelMd,
    color: colors.charcoal,
    marginBottom: spacing.xs,
  },
  hint: {
    ...typography.bodySm,
    color: colors.gray400,
    marginBottom: spacing.md,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  imageWrapper: {
    width: '31%',
    aspectRatio: 1,
    borderRadius: radii.sm,
    overflow: 'hidden',
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: radii.sm,
  },
  starButton: {
    position: 'absolute',
    top: 4,
    left: 4,
    backgroundColor: 'rgba(0,0,0,0.4)',
    borderRadius: 12,
    padding: 4,
  },
  removeButton: {
    position: 'absolute',
    top: 4,
    right: 4,
  },
  coverLabel: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingVertical: 2,
    alignItems: 'center',
  },
  coverLabelText: {
    ...typography.bodySm,
    color: colors.white,
    fontSize: 10,
  },
  addButton: {
    width: '31%',
    aspectRatio: 1,
    borderRadius: radii.sm,
    borderWidth: 2,
    borderColor: colors.gray200,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addText: {
    ...typography.bodySm,
    color: colors.teal,
    marginTop: 2,
  },
});
