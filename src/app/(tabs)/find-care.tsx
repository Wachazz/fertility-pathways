import * as Location from 'expo-location';
import { useMemo, useState } from 'react';
import { StyleSheet, Text } from 'react-native';
import { Button } from '../../components/Button';
import clinicFile from '../../../content/clinics.json';
import { ClinicCard, type Clinic } from '../../components/findCare/ClinicCard';
import { NoClinicsYet } from '../../components/findCare/NoClinicsYet';
import { TownFilter } from '../../components/findCare/TownFilter';
import { Notice } from '../../components/Notice';
import { Screen } from '../../components/Screen';
import { useLang } from '../../i18n/LanguageContext';
import { nearestTowns, TOWNS } from '../../lib/zimbabweTowns';
import { colors, spacing, type } from '../../theme';

const clinics = clinicFile.clinics as Clinic[];

const km = (a: { lat: number; lon: number }, b: { lat: number; lon: number }) => {
  const r = (d: number) => (d * Math.PI) / 180;
  const h = Math.sin(r(b.lat - a.lat) / 2) ** 2 + Math.cos(r(a.lat)) * Math.cos(r(b.lat)) * Math.sin(r(b.lon - a.lon) / 2) ** 2;
  return 6371 * 2 * Math.asin(Math.sqrt(h));
};

const fill = (text: string, values: Record<string, string | number>) =>
  text.replace(/\{(\w+)\}/g, (_, k) => String(values[k] ?? ''));

export default function FindCare() {
  const { c } = useLang();
  const f = c.findCare;
  const [town, setTown] = useState<string | null>(null);
  const [here, setHere] = useState<{ lat: number; lon: number } | null>(null);
  const [locMsg, setLocMsg] = useState('');
  const { lang } = useLang();
  const L = {
    en: { use: 'Use my location', busy: 'Finding you...', near: 'Nearest to you', denied: 'Location is off. Please allow it, or choose your town below.', fail: 'Could not find your location. Choose your town below.' },
    sn: { use: 'Shandisa nzvimbo yangu', busy: 'Ndiri kukutsvaga...', near: 'Pedyo newe', denied: 'Nzvimbo yakavharwa. Ibvumidze, kana sarudza taundi rako pazasi.', fail: 'Handina kuwana nzvimbo yako. Sarudza taundi rako pazasi.' },
    nd: { use: 'Sebenzisa indawo yami', busy: 'Ngiyakufuna...', near: 'Eziseduze lawe', denied: 'Indawo ivaliwe. Yivumele, kumbe khetha idolobha lakho ngezansi.', fail: 'Angiyitholanga indawo yakho. Khetha idolobha lakho ngezansi.' },
  }[lang];
  const locate = async () => {
    setLocMsg(L.busy);
    try {
      const perm = await Location.requestForegroundPermissionsAsync();
      if (!perm.granted) return setLocMsg(L.denied);
      const pos = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
      setHere({ lat: pos.coords.latitude, lon: pos.coords.longitude });
      setTown(null);
      setLocMsg('');
    } catch {
      setLocMsg(L.fail);
    }
  };
  const byDistance = useMemo(
    () =>
      here
        ? clinics
            .filter((cl) => cl.lat !== undefined && cl.lon !== undefined)
            .map((cl) => ({ cl, d: km(here, { lat: cl.lat as number, lon: cl.lon as number }) }))
            .sort((a, b) => a.d - b.d)
            .slice(0, 8)
        : [],
    [here],
  );

  // Every known town can be picked, plus any clinic town not in the list.
  const counts = useMemo(() => {
    const m: Record<string, number> = {};
    clinics.forEach((cl) => {
      m[cl.town] = (m[cl.town] ?? 0) + 1;
    });
    return m;
  }, []);
  const towns = useMemo(
    () => [...new Set([...TOWNS.map((t) => t.name), ...Object.keys(counts)])].sort(),
    [counts],
  );

  const inTown = town ? clinics.filter((cl) => cl.town === town) : clinics;
  const near = town && inTown.length === 0 ? nearestTowns(town, Object.keys(counts)) : [];

  return (
    <Screen contentKey="findCare">
      {clinics.length === 0 ? (
        <NoClinicsYet f={f} />
      ) : (
        <>
          <Notice text={f.intro} />
          <Button label={L.use} onPress={locate} />
          {locMsg ? <Text style={styles.note}>{locMsg}</Text> : null}
          {here ? (
            <>
              <Text style={styles.section} accessibilityRole="header">
                {L.near}
              </Text>
              {byDistance.map(({ cl, d }) => (
                <ClinicCard key={cl.id} clinic={cl} f={f} distance={fill(f.away, { km: Math.round(d) })} />
              ))}
            </>
          ) : null}
          <Text style={styles.label} accessibilityRole="header">
            {f.pickTown}
          </Text>
          <TownFilter towns={towns} selected={town} allLabel={f.all} counts={counts} onSelect={setTown} />
          {!here && town && inTown.length > 0 ? (
            <Text style={styles.section} accessibilityRole="header">
              {fill(f.inTown, { town })}
            </Text>
          ) : null}
          {!here && town && inTown.length === 0 ? <Notice text={fill(f.noneInTown, { town })} /> : null}
          {(here ? [] : inTown).map((cl) => (
            <ClinicCard key={cl.id} clinic={cl} f={f} />
          ))}
          {(here ? [] : near).flatMap((n) =>
            clinics
              .filter((cl) => cl.town === n.town)
              .map((cl) => (
                <ClinicCard key={cl.id} clinic={cl} f={f} distance={fill(f.away, { km: n.km })} />
              )),
          )}
          <Text style={styles.note}>{f.feeNote}</Text>
        </>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  label: { ...type.heading, color: colors.text },
  section: { ...type.heading, color: colors.text, marginTop: spacing.sm },
  note: { ...type.small, color: colors.textMuted },
});
