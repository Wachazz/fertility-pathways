import type { TextStyle, ViewStyle } from 'react-native';

// All colour pairs used for text meet WCAG AA (4.5:1) on their intended background.
export const colors = {
  primary: '#0E6B68',
  primaryDark: '#094C4A',
  primarySoft: '#E2F2F0',
  onPrimary: '#FFFFFF',
  onPrimaryMuted: '#D3EEEB',
  accent: '#B5441B',
  accentSoft: '#FCEBE3',
  success: '#2E7D32',
  successSoft: '#E8F5E9',
  warning: '#7A4F00',
  warningSoft: '#FFF4D6',
  danger: '#A1231A',
  dangerSoft: '#FDECEA',
  background: '#F4F9F8',
  surface: '#FFFFFF',
  text: '#16211F',
  textMuted: '#4F615E',
  border: '#D3E2DF',
};

export const spacing = { xs: 4, sm: 8, md: 16, lg: 24, xl: 32 };

export const radius = { sm: 6, md: 12, lg: 18, xl: 24, pill: 999 };

export const shadow: Record<'card' | 'raised', ViewStyle> = {
  card: { boxShadow: '0px 2px 8px rgba(9, 76, 74, 0.08)' },
  raised: { boxShadow: '0px 6px 16px rgba(9, 76, 74, 0.18)' },
};

// Line heights scale with the phone's font size because they are only minimums
// set through the type scale; no container uses a fixed height.
export const type: Record<'caption' | 'small' | 'body' | 'label' | 'heading' | 'title', TextStyle> = {
  caption: { fontSize: 12, lineHeight: 16, fontWeight: '700' },
  small: { fontSize: 14, lineHeight: 20 },
  body: { fontSize: 17, lineHeight: 25 },
  label: { fontSize: 17, lineHeight: 23, fontWeight: '700' },
  heading: { fontSize: 20, lineHeight: 26, fontWeight: '700' },
  title: { fontSize: 26, lineHeight: 32, fontWeight: '800' },
};

// Minimum tap target (Android guideline is 48dp).
export const minTap = 52;

// Content is centred and capped on tablets and wide browser windows.
export const maxContentWidth = 640;
