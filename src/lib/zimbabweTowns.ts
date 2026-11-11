// Towns people can pick in Find care. Coordinates are approximate town centres,
// used only to sort clinics by straight line distance. They are not road distances.
export type Town = { name: string; lat: number; lon: number };

export const TOWNS: Town[] = [
  { name: 'Beitbridge', lat: -22.22, lon: 30.0 },
  { name: 'Bindura', lat: -17.3, lon: 31.33 },
  { name: 'Bulawayo', lat: -20.15, lon: 28.58 },
  { name: 'Chegutu', lat: -18.13, lon: 30.15 },
  { name: 'Chinhoyi', lat: -17.36, lon: 30.2 },
  { name: 'Chitungwiza', lat: -18.01, lon: 31.08 },
  { name: 'Gweru', lat: -19.45, lon: 29.82 },
  { name: 'Harare', lat: -17.83, lon: 31.05 },
  { name: 'Hwange', lat: -18.37, lon: 26.5 },
  { name: 'Kadoma', lat: -18.33, lon: 29.91 },
  { name: 'Kariba', lat: -16.52, lon: 28.8 },
  { name: 'Karoi', lat: -16.81, lon: 29.69 },
  { name: 'Kwekwe', lat: -18.93, lon: 29.81 },
  { name: 'Marondera', lat: -18.19, lon: 31.55 },
  { name: 'Masvingo', lat: -20.07, lon: 30.83 },
  { name: 'Mutare', lat: -18.97, lon: 32.67 },
  { name: 'Rusape', lat: -18.53, lon: 32.13 },
  { name: 'Victoria Falls', lat: -17.93, lon: 25.83 },
  { name: 'Zvishavane', lat: -20.33, lon: 30.07 },
];

const byName = new Map(TOWNS.map((t) => [t.name.toLowerCase(), t]));

export function findTown(name: string): Town | undefined {
  return byName.get(name.trim().toLowerCase());
}

// Straight line distance in kilometres (haversine).
export function distanceKm(a: Town, b: Town): number {
  const rad = (d: number) => (d * Math.PI) / 180;
  const dLat = rad(b.lat - a.lat);
  const dLon = rad(b.lon - a.lon);
  const h =
    Math.sin(dLat / 2) ** 2 + Math.cos(rad(a.lat)) * Math.cos(rad(b.lat)) * Math.sin(dLon / 2) ** 2;
  return 6371 * 2 * Math.asin(Math.sqrt(h));
}

export type NearTown = { town: string; km: number };

// Towns that have clinics, nearest first, never including the chosen town.
// A clinic town missing from TOWNS is left out of the distance list instead of guessed.
export function nearestTowns(chosen: string, townsWithClinics: string[], limit = 3): NearTown[] {
  const from = findTown(chosen);
  if (!from) return [];
  return townsWithClinics
    .filter((t) => t.toLowerCase() !== chosen.toLowerCase())
    .map((t) => ({ town: t, to: findTown(t) }))
    .filter((x): x is { town: string; to: Town } => !!x.to)
    .map((x) => ({ town: x.town, km: Math.round(distanceKm(from, x.to) / 5) * 5 }))
    .sort((a, b) => a.km - b.km)
    .slice(0, limit);
}
