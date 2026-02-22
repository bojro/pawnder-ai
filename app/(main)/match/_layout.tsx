import { Stack } from 'expo-router';
import { colors } from '../../../utils/theme';

export default function MatchLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: true,
        headerTitle: '',
        headerBackTitle: 'Back',
        headerTintColor: colors.teal,
        headerStyle: { backgroundColor: colors.cream },
      }}
    />
  );
}
