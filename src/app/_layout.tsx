import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { UrgentButton } from '../components/UrgentButton';
import { LanguageProvider, useLang } from '../i18n/LanguageContext';
import { headerOptions } from '../navigation/headerOptions';
import { colors } from '../theme';

// Flow: Language -> Welcome -> tabs. Both first screens are replaced, never stacked,
// so the Back button cannot return to them by accident.
function RootStack() {
  const { c } = useLang();
  return (
    <Stack
      screenOptions={{
        ...headerOptions,
        headerBackTitle: c.ui.back,
        headerRight: () => <UrgentButton />,
        contentStyle: { backgroundColor: colors.background },
      }}
    >
      <Stack.Screen
        name="index"
        options={({ route }) => ({
          headerShown: !!(route.params as { change?: string } | undefined)?.change,
          title: c.ui.changeLanguage,
        })}
      />
      <Stack.Screen name="welcome" options={{ title: c.ui.appName, headerBackVisible: false }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="understand" options={{ title: c.understand.title }} />
      <Stack.Screen name="costs" options={{ title: c.costs.title }} />
      <Stack.Screen name="support" options={{ title: c.support.title, headerRight: () => null }} />
      <Stack.Screen name="privacy" options={{ title: c.privacy.title }} />
      <Stack.Screen name="pathway" options={{ title: c.pathway.title }} />
      <Stack.Screen name="warning-signs" options={{ title: c.warning.title }} />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <LanguageProvider>
        <StatusBar style="light" />
        <RootStack />
      </LanguageProvider>
    </SafeAreaProvider>
  );
}
