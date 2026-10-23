import { describe, expect, it } from 'vitest';

import { monotonePath } from '../src/chart';
import { fold, formatKm, haversineKm, rankByDistance, searchStations } from '../src/geo';
import { HOUR, nextMidnight, startOfDay } from '../src/time';
import type { Station } from '../src/types';

const stations: Station[] = [
  { id: 'a', code: '00490', name: 'Halifax', lat: 44.6667, lon: -63.5833 },
  { id: 'b', code: '01700', name: 'Charlottetown', lat: 46.2317, lon: -63.1236 },
  { id: 'c', code: '03248', name: 'Rivière-du-Loup', lat: 47.8475, lon: -69.5658 },
];
const BEDFORD = [44.72, -63.66] as const;

describe('geo', () => {
  it('measures distances on the Earth', () => {
    expect(haversineKm(44.6667, -63.5833, 46.2317, -63.1236)).toBeCloseTo(177.7, 1);
    expect(haversineKm(10, 20, 10, 20)).toBe(0);
  });

  it('ranks stations by distance', () => {
    expect(rankByDistance(stations, ...BEDFORD).map((r) => r.station.name)).toEqual([
      'Halifax',
      'Charlottetown',
      'Rivière-du-Loup',
    ]);
  });

  it('searches names without accents or case, and codes', () => {
    expect(fold('Rivière-du-LOUP')).toBe('riviere-du-loup');
    expect(searchStations(stations, ' riviere ', ...BEDFORD).map((r) => r.station.code)).toEqual(['03248']);
    expect(searchStations(stations, '0049', ...BEDFORD).map((r) => r.station.name)).toEqual(['Halifax']);
    expect(searchStations(stations, '  ', ...BEDFORD)).toEqual([]);
  });

  it('shows one decimal under 10 km', () => {
    expect(formatKm(3.14159, 'en-CA')).toBe('3.1 km');
    expect(formatKm(176.6, 'fr-CA')).toBe('177 km');
  });
});

describe('time', () => {
  const tz = 'America/Halifax';

  it('finds local midnight in a given time zone', () => {
    // 2026-09-26 10:00 in Halifax (ADT, UTC−3) → midnight 03:00 UTC.
    expect(startOfDay(Date.parse('2026-09-26T13:00:00Z'), tz)).toBe(Date.parse('2026-09-26T03:00:00Z'));
    expect(nextMidnight(Date.parse('2026-09-26T13:00:00Z'), tz)).toBe(Date.parse('2026-09-27T03:00:00Z'));
  });

  it('handles the day the clocks go back', () => {
    // 2026-11-01 is 25 hours long in Halifax: midnight ADT (03:00 UTC) to midnight AST (04:00 UTC).
    const noon = Date.parse('2026-11-01T16:00:00Z');
    expect(startOfDay(noon, tz)).toBe(Date.parse('2026-11-01T03:00:00Z'));
    expect(nextMidnight(noon, tz) - startOfDay(noon, tz)).toBe(25 * HOUR);
  });
});

describe('monotonePath', () => {
  it('draws nothing for fewer than two points, and starts at the first', () => {
    expect(monotonePath([[0, 0]])).toBe('');
    expect(
      monotonePath([
        [0, 10],
        [10, 0],
      ]),
    ).toMatch(/^M0\.0,10\.0C/);
  });

  it('stays flat at a high or low instead of overshooting', () => {
    // SVG y grows downward, so the middle point is a high: its tangent is flat, and the control points beside it share its height.
    const path = monotonePath([
      [0, 10],
      [10, 0],
      [20, 10],
    ]);
    const numbers = path.slice(1).split(/[C,]/).map(Number);
    // First curve's second control point, then the second curve's first control point.
    expect(numbers[5]).toBe(0);
    expect(numbers[9]).toBe(0);
  });
});
