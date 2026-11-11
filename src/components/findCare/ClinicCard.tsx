import { Linking, StyleSheet, Text, View } from 'react-native';
import type { Content } from '../../i18n/LanguageContext';
import { colors, radius, spacing, type } from '../../theme';
import { Button } from '../Button';
import { Card } from '../Card';

export type Clinic = {
  id: string;
  name: string;
  town: string;
  lat?: number;
  lon?: number;
  address?: string;
  phone?: string;
  ownership?: 'public' | 'private';
  // Shown only together with feeChecked. Written as the clinic said it, e.g. "USD 20".
  consultationFee?: string;
  feeChecked?: string;
  services: string[];
  lastChecked?: string;
  checkedBy?: string;
};

type Props = { clinic: Clinic; f: Content['findCare']; distance?: string };

export function ClinicCard({ clinic, f, distance }: Props) {
  const hasFee = !!clinic.consultationFee && !!clinic.feeChecked;
  return (
    <Card>
      <View style={styles.top}>
        <Text style={styles.heading}>{clinic.name}</Text>
        {clinic.ownership ? (
          <View style={styles.tag}>
            <Text style={styles.tagText}>{clinic.ownership === 'public' ? f.public : f.private}</Text>
          </View>
        ) : null}
      </View>
      <Text style={styles.body}>
        {clinic.town}
        {clinic.address ? ` · ${clinic.address}` : ''}
      </Text>
      {distance ? <Text style={styles.distance}>{distance}</Text> : null}
      {clinic.services.length > 0 ? (
        <Text style={styles.body}>
          {f.services} {clinic.services.join(', ')}
        </Text>
      ) : null}
      <View style={[styles.fee, hasFee ? styles.feeKnown : styles.feeUnknown]}>
        {hasFee ? (
          <>
            <Text style={styles.feeText}>
              {f.fee} {clinic.consultationFee}
            </Text>
            <Text style={styles.small}>
              {f.feeChecked} {clinic.feeChecked}
            </Text>
          </>
        ) : (
          <Text style={styles.feeText}>{f.feeAsk}</Text>
        )}
      </View>
      {clinic.lastChecked ? (
        <Text style={styles.small}>
          {f.lastChecked} {clinic.lastChecked}
        </Text>
      ) : null}
      {clinic.lat !== undefined && clinic.lon !== undefined ? (
        <Button
          variant="secondary"
          label="Directions"
          hint={clinic.name}
          onPress={() =>
            Linking.openURL(`geo:${clinic.lat},${clinic.lon}?q=${clinic.lat},${clinic.lon}(${encodeURIComponent(clinic.name)})`)
          }
        />
      ) : null}
      {clinic.phone ? (
        <Button
          label={`${f.call} ${clinic.phone}`}
          hint={clinic.name}
          onPress={() => Linking.openURL(`tel:${clinic.phone}`)}
        />
      ) : null}
    </Card>
  );
}

const styles = StyleSheet.create({
  top: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', gap: spacing.sm },
  heading: { ...type.heading, flex: 1, color: colors.text, marginBottom: spacing.sm },
  tag: {
    backgroundColor: colors.primarySoft,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
  },
  tagText: { ...type.small, fontWeight: '700', color: colors.primaryDark },
  body: { ...type.body, color: colors.text, marginBottom: spacing.sm },
  distance: { ...type.small, color: colors.accent, fontWeight: '700', marginBottom: spacing.sm },
  fee: { borderRadius: radius.md, padding: spacing.sm, marginBottom: spacing.sm, gap: 2 },
  feeKnown: { backgroundColor: colors.primarySoft },
  feeUnknown: { backgroundColor: colors.accentSoft },
  feeText: { ...type.body, fontWeight: '700', color: colors.text },
  small: { ...type.small, color: colors.textMuted, marginBottom: spacing.sm },
});
