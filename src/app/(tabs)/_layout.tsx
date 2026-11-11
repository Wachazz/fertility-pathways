import Ionicons from '@expo/vector-icons/Ionicons';
import { Tabs } from 'expo-router';
import type { ComponentProps } from 'react';
import type { ColorValue } from 'react-native';
import { UrgentButton } from '../../components/UrgentButton';
import { useLang } from '../../i18n/LanguageContext';
import { colors } from '../../theme';
import { headerOptions } from '../../navigation/headerOptions';

type IconName = ComponentProps<typeof Ionicons>['name'];
type IconColor = ComponentProps<typeof Ionicons>['color'];

// The tab bar passes a ColorValue that may be null; Ionicons wants a plain colour.
function TabIcon({ name, color, size }: { name: IconName; color: ColorValue | null; size: number }) {
  return <Ionicons name={name} size={size} color={(color ?? undefined) as IconColor} />;
}

export default function TabLayout() {
  const { c } = useLang();
  return (
    <Tabs
      screenOptions={{
        ...headerOptions,
        headerRight: () => <UrgentButton />,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarLabelStyle: { fontSize: 13, fontWeight: '600' },
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
          paddingTop: 4,
        },
        sceneStyle: { backgroundColor: colors.background },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: c.ui.appName,
          tabBarLabel: c.ui.tabs.home,
          tabBarIcon: ({ color, size }) => <TabIcon name="home" color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="prepare"
        options={{
          title: c.prepare.title,
          tabBarLabel: c.ui.tabs.prepare,
          tabBarIcon: ({ color, size }) => <TabIcon name="clipboard" color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="find-care"
        options={{
          title: c.findCare.title,
          tabBarLabel: c.ui.tabs.findCare,
          tabBarIcon: ({ color, size }) => <TabIcon name="location" color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="assistant"
        options={{
          title: c.assistant.title,
          tabBarLabel: c.ui.tabs.ask,
          tabBarIcon: ({ color, size }) => <TabIcon name="chatbubbles" color={color} size={size} />,
        }}
      />
    </Tabs>
  );
}
