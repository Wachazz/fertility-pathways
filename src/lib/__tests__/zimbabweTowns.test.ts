import { distanceKm, findTown, nearestTowns, TOWNS } from '../zimbabweTowns';

describe('zimbabweTowns', () => {
  it('finds towns without caring about case', () => {
    expect(findTown('harare')?.name).toBe('Harare');
    expect(findTown(' Bulawayo ')?.name).toBe('Bulawayo');
    expect(findTown('Nowhere')).toBeUndefined();
  });

  it('gives a sensible Harare to Bulawayo distance', () => {
    const km = distanceKm(findTown('Harare')!, findTown('Bulawayo')!);
    expect(km).toBeGreaterThan(350);
    expect(km).toBeLessThan(400);
  });

  it('lists the nearest towns with clinics first and skips the chosen town', () => {
    const near = nearestTowns('Chitungwiza', ['Harare', 'Bulawayo', 'Chitungwiza', 'Mutare']);
    expect(near.map((n) => n.town)).toEqual(['Harare', 'Mutare', 'Bulawayo']);
    expect(near[0].km).toBeLessThan(40);
  });

  it('leaves out clinic towns it has no position for', () => {
    expect(nearestTowns('Harare', ['Unknownville', 'Mutare']).map((n) => n.town)).toEqual(['Mutare']);
  });

  it('returns nothing for an unknown chosen town', () => {
    expect(nearestTowns('Unknownville', ['Harare'])).toEqual([]);
  });

  it('has no duplicate towns', () => {
    expect(new Set(TOWNS.map((t) => t.name)).size).toBe(TOWNS.length);
  });
});
