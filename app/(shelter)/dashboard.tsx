import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useShelterStore } from '../../store/useShelterStore';
import { mockShelterPets } from '../../services/shelterMockData';
import { useAppStore } from '../../store/useAppStore';
import { useMockMode } from '../../hooks/useMockMode';
import ToggleSwitch from '../../components/ui/ToggleSwitch';
import PetListCard from '../../components/shelter/PetListCard';
import { PetStatus, ShelterPet } from '../../types/shelter';
import { colors, typography, spacing, radii, shadows } from '../../utils/theme';

type FilterOption = 'all' | PetStatus;

export default function ShelterDashboard() {
  const { shelterPets, isLoaded, loadFromStorage, startNewPet } = useShelterStore();
  const { mockMode, toggleMockMode } = useMockMode();
  const [filter, setFilter] = useState<FilterOption>('all');

  useEffect(() => {
    loadFromStorage().then(() => {
      // Seed with mock data only in mock mode and if empty
      const store = useShelterStore.getState();
      if (useAppStore.getState().mockMode && store.shelterPets.length === 0) {
        useShelterStore.setState({ shelterPets: mockShelterPets });
      }
    });
  }, []);

  const filteredPets = filter === 'all'
    ? shelterPets
    : shelterPets.filter(p => p.status === filter);

  const handleCreate = async () => {
    try {
      const draftJson = await AsyncStorage.getItem('pawnder_shelter_current_draft');
      if (draftJson) {
        const saved = JSON.parse(draftJson);
        const draftName = saved?.draft?.name?.trim();
        if (draftName) {
          Alert.alert(
            'Resume Draft?',
            `You have an unsaved draft for "${draftName}". Would you like to resume it?`,
            [
              {
                text: 'Start Fresh',
                style: 'destructive',
                onPress: () => {
                  startNewPet();
                  router.push('/(shelter)/(intake)');
                },
              },
              {
                text: 'Resume',
                onPress: () => {
                  // Draft is already loaded from storage via loadFromStorage
                  router.push('/(shelter)/(intake)');
                },
              },
            ],
          );
          return;
        }
      }
    } catch {
      // ignore parse errors
    }
    startNewPet();
    router.push('/(shelter)/(intake)');
  };

  const handleEdit = (pet: ShelterPet) => {
    useShelterStore.getState().editPet(pet.id);
    router.push('/(shelter)/(intake)');
  };

  const handleReview = (pet: ShelterPet) => {
    router.push({ pathname: '/(shelter)/review/[id]', params: { id: pet.id } });
  };

  const handleLogout = async () => {
    const { clearAll } = await import('../../utils/storage');
    const { signOut } = await import('firebase/auth');
    const { auth } = await import('../../services/firebase');
    await clearAll();
    try { await signOut(auth); } catch (e) {}
    router.replace('/(auth)/login');
  };

  const FILTERS: { label: string; value: FilterOption }[] = [
    { label: 'All', value: 'all' },
    { label: 'Draft', value: 'draft' },
    { label: 'Ready', value: 'ready' },
    { label: 'Published', value: 'published' },
  ];

  if (!isLoaded) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.teal} />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Shelter Portal</Text>
          <Text style={styles.headerSubtitle}>{shelterPets.length} pets in system</Text>
        </View>
        <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
          <Ionicons name="log-out-outline" size={22} color={colors.gray600} />
        </TouchableOpacity>
      </View>

      {/* Mock Mode Toggle */}
      <View style={styles.mockRow}>
        <View style={styles.mockInfo}>
          <Ionicons name="code-slash-outline" size={16} color={colors.gray400} />
          <Text style={styles.mockLabel}>Mock Mode</Text>
          <Text style={styles.mockHint}>{mockMode ? 'Local data' : 'Firebase'}</Text>
        </View>
        <ToggleSwitch value={mockMode} onToggle={toggleMockMode} />
      </View>

      {/* Filters */}
      <View style={styles.filterRow}>
        {FILTERS.map(f => (
          <TouchableOpacity
            key={f.value}
            style={[styles.filterChip, filter === f.value && styles.filterChipActive]}
            onPress={() => setFilter(f.value)}
          >
            <Text style={[styles.filterText, filter === f.value && styles.filterTextActive]}>
              {f.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Pet List */}
      <FlatList
        data={filteredPets}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <PetListCard
            pet={item}
            onEdit={() => handleEdit(item)}
            onReview={() => handleReview(item)}
          />
        )}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Ionicons name="paw-outline" size={48} color={colors.gray200} />
            <Text style={styles.emptyText}>No pets found</Text>
            <Text style={styles.emptySubtext}>Tap the + button to add a pet</Text>
          </View>
        }
      />

      {/* FAB */}
      <TouchableOpacity style={[styles.fab, shadows.actionButton]} onPress={handleCreate}>
        <Ionicons name="add" size={28} color={colors.white} />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.cream,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.cream,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.screenPadding,
    paddingVertical: spacing.lg,
  },
  headerTitle: {
    ...typography.displayMd,
  },
  headerSubtitle: {
    ...typography.bodySm,
    color: colors.gray600,
    marginTop: 2,
  },
  logoutButton: {
    padding: spacing.sm,
  },
  mockRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.screenPadding,
    paddingVertical: spacing.sm,
    marginBottom: spacing.sm,
    backgroundColor: colors.white,
    marginHorizontal: spacing.screenPadding,
    borderRadius: radii.card,
    paddingLeft: spacing.md,
    paddingRight: spacing.md,
  },
  mockInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  mockLabel: {
    ...typography.labelSm,
    color: colors.charcoal,
  },
  mockHint: {
    ...typography.bodySm,
    color: colors.gray400,
    marginLeft: spacing.xs,
  },
  filterRow: {
    flexDirection: 'row',
    paddingHorizontal: spacing.screenPadding,
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  filterChip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radii.chip,
    borderWidth: 1,
    borderColor: colors.gray200,
    backgroundColor: colors.white,
  },
  filterChipActive: {
    backgroundColor: colors.tealLight,
    borderColor: colors.teal,
  },
  filterText: {
    ...typography.bodySm,
    color: colors.gray600,
  },
  filterTextActive: {
    color: colors.teal,
    fontFamily: typography.labelSm.fontFamily,
  },
  listContent: {
    paddingHorizontal: spacing.screenPadding,
    paddingBottom: 100,
  },
  emptyState: {
    alignItems: 'center',
    paddingTop: 80,
    gap: spacing.sm,
  },
  emptyText: {
    ...typography.bodyLg,
    color: colors.gray600,
  },
  emptySubtext: {
    ...typography.bodySm,
    color: colors.gray400,
  },
  fab: {
    position: 'absolute',
    bottom: 32,
    right: spacing.screenPadding,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.teal,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
