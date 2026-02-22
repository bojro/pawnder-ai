import { Stack } from 'expo-router';
import { colors } from '../../../utils/theme';

export default function ReviewLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.cream },
      }}
    />
  );
}
