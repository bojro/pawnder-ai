import { Stack } from 'expo-router';
import { colors } from '../../../utils/theme';

export default function TrainingLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: true,
        headerTitle: 'Training Plan',
        headerTintColor: colors.plum,
        headerStyle: { backgroundColor: colors.cream },
      }}
    />
  );
}
