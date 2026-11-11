import { Alert, Platform } from 'react-native';

// Alert.alert does nothing on web, so the browser's own dialog is used there.
export function confirm(message: string, yes: string, no: string): Promise<boolean> {
  if (Platform.OS === 'web') return Promise.resolve(window.confirm(message));
  return new Promise((resolve) => {
    Alert.alert('', message, [
      { text: no, style: 'cancel', onPress: () => resolve(false) },
      { text: yes, style: 'destructive', onPress: () => resolve(true) },
    ]);
  });
}
