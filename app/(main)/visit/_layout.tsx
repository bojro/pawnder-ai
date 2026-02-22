import { Stack } from 'expo-router';
import { colors } from '../../../utils/theme';

export default function VisitLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: true,
        headerTitle: 'Schedule Visit',
        headerTintColor: colors.plum,
        headerStyle: { backgroundColor: colors.cream },
      }}
    />
  );
}
