import { TextStyle, ViewStyle } from 'react-native';

export const colors = {
  plum: '#4A154B',
  plumLight: '#E8DDEF',
  plumDark: '#33103B',
  white: '#FFFFFF',
  cream: '#FAF8F6',
  charcoal: '#1A1A1A',
  gray600: '#555555',
  gray400: '#999999',
  gray200: '#E5E5E5',
  gray100: '#F5F5F5',
  rose: '#E8658A',
  red: '#D32F2F',
  green: '#4CAF50',
  transparent: 'transparent',
} as const;

export const fonts = {
  serifBold: 'PlayfairDisplay_700Bold',
  serifSemiBold: 'PlayfairDisplay_600SemiBold',
  sansRegular: 'Inter_400Regular',
  sansSemiBold: 'Inter_600SemiBold',
} as const;

export const typography: Record<string, TextStyle> = {
  displayLg: {
    fontFamily: fonts.serifBold,
    fontSize: 32,
    lineHeight: 40,
    color: colors.charcoal,
  },
  displayMd: {
    fontFamily: fonts.serifBold,
    fontSize: 24,
    lineHeight: 32,
    color: colors.charcoal,
  },
  displaySm: {
    fontFamily: fonts.serifSemiBold,
    fontSize: 20,
    lineHeight: 28,
    color: colors.charcoal,
  },
  bodyLg: {
    fontFamily: fonts.sansRegular,
    fontSize: 17,
    lineHeight: 24,
    color: colors.charcoal,
  },
  bodyMd: {
    fontFamily: fonts.sansRegular,
    fontSize: 15,
    lineHeight: 22,
    color: colors.charcoal,
  },
  bodySm: {
    fontFamily: fonts.sansRegular,
    fontSize: 13,
    lineHeight: 18,
    color: colors.gray600,
  },
  labelMd: {
    fontFamily: fonts.sansSemiBold,
    fontSize: 15,
    lineHeight: 22,
    color: colors.charcoal,
  },
  labelSm: {
    fontFamily: fonts.sansSemiBold,
    fontSize: 13,
    lineHeight: 18,
    color: colors.charcoal,
  },
};

export const spacing = {
  screenPadding: 20,
  cardPadding: 20,
  sectionGap: 24,
  elementGap: 12,
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
  xxxl: 40,
} as const;

export const radii = {
  card: 16,
  button: 24,
  chip: 20,
  checkbox: 6,
  modal: 20,
  sm: 8,
  md: 12,
  full: 9999,
} as const;

export const shadows: Record<string, ViewStyle> = {
  card: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  actionButton: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 4,
  },
  subtle: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
};

export const sizes = {
  iconSizeTab: 24,
  iconSizeAction: 28,
  actionButtonSize: 56,
  checkboxSize: 24,
  dotSize: 8,
  tabBarHeight: 60,
} as const;

const theme = {
  colors,
  fonts,
  typography,
  spacing,
  radii,
  shadows,
  sizes,
} as const;

export default theme;
