import { Stack } from 'expo-router';
import { colors, typography } from '../../../utils/theme';

export default function PetLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: true,
        headerTitle: '',
        headerBackTitle: 'Back',
        headerTintColor: colors.plum,
        headerStyle: { backgroundColor: colors.cream },
      }}
    />
  );
}
