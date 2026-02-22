import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useShelterStore } from '../../store/useShelterStore';
import { mockShelterPets } from '../../services/shelterMockData';
import PetListCard from '../../components/shelter/PetListCard';
import { PetStatus, ShelterPet } from '../../types/shelter';
import { colors, typography, spacing, radii, shadows } from '../../utils/theme';

type FilterOption = 'all' | PetStatus;

export default function ShelterDashboard() {
  const { shelterPets, isLoaded, loadFromStorage, startNewPet } = useShelterStore();
  const [filter, setFilter] = useState<FilterOption>('all');

  useEffect(() => {
    loadFromStorage().then(() => {
      // Seed with mock data if empty
      const store = useShelterStore.getState();
      if (store.shelterPets.length === 0) {
        useShelterStore.setState({ shelterPets: mockShelterPets });
      }
    });
  }, []);

  const filteredPets = filter === 'all'
    ? shelterPets
    : shelterPets.filter(p => p.status === filter);

  const handleCreate = () => {
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
    await clearAll();
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
