import { StyleSheet, Text, View } from 'react-native';
import { colors, radius, spacing, type } from '../theme';

export function Notice({ text }: { text: string }) {
  return (
    <View style={styles.box}>
      <Text style={styles.text}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  box: { backgroundColor: colors.primarySoft, borderRadius: radius.md, padding: spacing.md },
  text: { ...type.small, color: colors.primaryDark },
});
