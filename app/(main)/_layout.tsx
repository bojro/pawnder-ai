import React from 'react';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAppStore } from '../../store/useAppStore';
import { colors, sizes } from '../../utils/theme';

export default function MainLayout() {
  const hasActive = useAppStore((s) => {
    const m = s.activeMatch;
    return m !== null && (m.status === 'confirmed' || m.status === 'in_foster');
  });

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.white,
        tabBarInactiveTintColor: colors.gray400,
        tabBarStyle: {
          backgroundColor: colors.charcoal,
          borderTopWidth: 0,
          height: sizes.tabBarHeight,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarShowLabel: false,
      }}
    >
      <Tabs.Screen
        name="swipe"
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="paw" size={sizes.iconSizeTab} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="foster"
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="heart" size={sizes.iconSizeTab} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person" size={sizes.iconSizeTab} color={color} />
          ),
        }}
      />
      {/* Hidden routes within main tabs */}
      <Tabs.Screen
        name="pet"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="match"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="visit"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="training"
        options={{
          href: null,
        }}
      />
    </Tabs>
  );
}
