import { Stack } from 'expo-router';
import { colors } from '../../utils/theme';

export default function ShelterLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.cream },
      }}
    >
      <Stack.Screen name="dashboard" />
      <Stack.Screen name="(intake)" />
      <Stack.Screen name="review" />
    </Stack>
  );
}
