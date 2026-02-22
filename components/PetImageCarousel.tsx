import React, { useState, useRef } from 'react';
import {
  View,
  Image,
  StyleSheet,
  Dimensions,
  ScrollView,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';
import { colors, radii, spacing, sizes } from '../utils/theme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface PetImageCarouselProps {
  imageUrls: string[];
  height?: number;
}

export default function PetImageCarousel({
  imageUrls,
  height = 400,
}: PetImageCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  const onScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(offsetX / SCREEN_WIDTH);
    setActiveIndex(index);
  };

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={onScroll}
        scrollEventThrottle={16}
      >
        {imageUrls.map((url, idx) => (
          <Image
            key={idx}
            source={{ uri: url }}
            style={[styles.image, { height }]}
          />
        ))}
      </ScrollView>
      {imageUrls.length > 1 && (
        <View style={styles.dotsContainer}>
          {imageUrls.map((_, idx) => (
            <View
              key={idx}
              style={[
                styles.dot,
                idx === activeIndex ? styles.dotActive : styles.dotInactive,
              ]}
            />
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  image: {
    width: SCREEN_WIDTH,
    backgroundColor: colors.gray100,
  },
  dotsContainer: {
    position: 'absolute',
    bottom: 12,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.sm,
  },
  dot: {
    width: sizes.dotSize,
    height: sizes.dotSize,
    borderRadius: sizes.dotSize / 2,
  },
  dotActive: {
    backgroundColor: colors.white,
  },
  dotInactive: {
    backgroundColor: 'rgba(255,255,255,0.5)',
  },
});
