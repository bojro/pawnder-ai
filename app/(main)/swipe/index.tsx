import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Alert, Animated, PanResponder, Dimensions } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import SwipeCard from '../../../components/SwipeCard';
import SwipeActionButtons from '../../../components/SwipeActionButtons';
import LoadingOverlay from '../../../components/LoadingOverlay';
import ErrorMessage from '../../../components/ErrorMessage';
import { usePets } from '../../../hooks/usePets';
import { useActiveMatch } from '../../../hooks/useActiveMatch';
import { swipeService } from '../../../services/swipeService';
import { useAppStore } from '../../../store/useAppStore';
import { PetWithCompatibility } from '../../../types';
import { colors, typography, spacing } from '../../../utils/theme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const SWIPE_THRESHOLD = 120;

export default function SwipeScreen() {
  const { pets, loading, error, fetchPets } = usePets();
  const { hasActiveMatch, fetchActiveMatch } = useActiveMatch();
  const adopterId = useAppStore((s) => s.adopterId);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [position] = useState(new Animated.ValueXY());

  useEffect(() => {
    fetchPets();
    fetchActiveMatch();
  }, []);

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderMove: (evt, gestureState) => {
      position.setValue({ x: gestureState.dx, y: gestureState.dy });
    },
    onPanResponderRelease: (evt, gestureState) => {
      if (Math.abs(gestureState.dx) > SWIPE_THRESHOLD) {
        const direction = gestureState.dx > 0 ? 'right' : 'left';
        handleSwipe(direction);
      } else {
        Animated.spring(position, {
          toValue: { x: 0, y: 0 },
          useNativeDriver: false,
        }).start();
      }
    },
  });

  const handleSwipe = async (direction: 'left' | 'right') => {
    if (!adopterId || !pets[currentIndex]) return;
    
    try {
      await swipeService.recordSwipe(adopterId, pets[currentIndex].id, direction);
      
      if (direction === 'right') {
        router.push({
          pathname: '/(main)/pet/[id]',
          params: { id: pets[currentIndex].id },
        });
      }
      
      // Move to next card
      position.setValue({ x: 0, y: 0 });
      if (currentIndex < pets.length - 1) {
        setCurrentIndex(currentIndex + 1);
      }
    } catch {
      Alert.alert('Error', 'Failed to record swipe');
    }
  };

  // If user has active match, show locked overlay
  if (hasActiveMatch) {
    return (
      <SafeAreaView style={styles.safe} edges={['top']}>
        <View style={styles.lockedContainer}>
          <View style={styles.lockedCircle}>
            <Text style={styles.lockedEmoji}>🔒</Text>
          </View>
          <Text style={styles.lockedTitle}>Browsing Paused</Text>
          <Text style={styles.lockedSubtitle}>
            You have an active foster match.{'\n'}Focus on building your bond!
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  if (loading && pets.length === 0) {
    return <LoadingOverlay visible />;
  }

  if (error) {
    return (
      <SafeAreaView style={styles.safe} edges={['top']}>
        <View style={styles.center}>
          <ErrorMessage message={error} />
        </View>
      </SafeAreaView>
    );
  }

  if (pets.length === 0 || currentIndex >= pets.length) {
    return (
      <SafeAreaView style={styles.safe} edges={['top']}>
        <View style={styles.center}>
          <Text style={styles.emptyText}>No pets available right now.</Text>
          <Text style={styles.emptySubtext}>Check back later!</Text>
        </View>
      </SafeAreaView>
    );
  }

  const currentPet = pets[currentIndex];
  const rotateCard = position.x.interpolate({
    inputRange: [-200, 0, 200],
    outputRange: ['-10deg', '0deg', '10deg'],
  });

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.container}>
        <Animated.View
          style={[
            styles.cardContainer,
            {
              transform: [
                { translateX: position.x },
                { translateY: position.y },
                { rotate: rotateCard },
              ],
            },
          ]}
          {...panResponder.panHandlers}
        >
          <SwipeCard pet={currentPet} />
        </Animated.View>
        
        {currentIndex < pets.length - 1 && (
          <View style={styles.nextCardContainer}>
            <SwipeCard pet={pets[currentIndex + 1]} />
          </View>
        )}
        
        <SwipeActionButtons
          onPass={() => handleSwipe('left')}
          onLike={() => handleSwipe('right')}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.cream,
  },
  container: {
    flex: 1,
    paddingHorizontal: spacing.screenPadding,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardContainer: {
    position: 'absolute',
    width: SCREEN_WIDTH - 40,
    zIndex: 2,
  },
  nextCardContainer: {
    position: 'absolute',
    width: SCREEN_WIDTH - 40,
    opacity: 0.5,
    zIndex: 1,
    transform: [{ scale: 0.95 }],
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.screenPadding,
  },
  lockedContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.screenPadding,
  },
  lockedCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: colors.plumLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  lockedEmoji: {
    fontSize: 48,
  },
  lockedTitle: {
    ...typography.displayMd,
    marginBottom: spacing.sm,
  },
  lockedSubtitle: {
    ...typography.bodyMd,
    color: colors.gray600,
    textAlign: 'center',
  },
  emptyText: {
    ...typography.displaySm,
    textAlign: 'center',
  },
  emptySubtext: {
    ...typography.bodyMd,
    color: colors.gray600,
    marginTop: spacing.sm,
  },
});
