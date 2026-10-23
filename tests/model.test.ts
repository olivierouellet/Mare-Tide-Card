import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

import { classifyExtremes, detectExtremes, fromEntity, interpolate, parsePoints } from '../src/data/model';

/** Recorded DFO predictions for Halifax (00490), 2026-09-26 to 10-01: the 15-minute curve and the highs and lows. */
const dfo = (name: string) =>
  (
    JSON.parse(readFileSync(new URL(`../dev/${name}`, import.meta.url), 'utf8')) as {
      eventDate: string;
      value: number;
    }[]
  ).map((p) => ({ time: p.eventDate, value: p.value }));
const curve = parsePoints(dfo('halifax_wlp.json'));
const hilo = parsePoints(dfo('halifax_hilo.json'));

describe('parsePoints', () => {
  it('reads the recorded curve, sorted by time', () => {
    expect(curve).toHaveLength(481);
    expect(curve[0]).toEqual({ t: Date.parse('2026-09-26T03:00:00Z'), v: 0.663 });
  });

  it('drops points without a time or a value', () => {
    expect(
      parsePoints([
        { time: '2026-09-26T04:00:00Z', value: 1 },
        { time: 'bientôt', value: 2 },
        { time: '2026-09-26T03:00:00Z' },
      ]),
    ).toEqual([{ t: Date.parse('2026-09-26T04:00:00Z'), v: 1 }]);
  });
});

describe('interpolate', () => {
  it('is exact on a point and linear between two', () => {
    expect(interpolate(curve, Date.parse('2026-09-26T11:30:00Z'))).toBe(1.774);
    const between = interpolate(curve, Date.parse('2026-09-26T11:22:30Z'))!;
    expect(between).toBeCloseTo((1.769 + 1.774) / 2, 6);
  });

  it('is null outside the data', () => {
    expect(interpolate(curve, Date.parse('2026-09-26T02:59:00Z'))).toBeNull();
    expect(interpolate([], 0)).toBeNull();
  });
});

describe('classifyExtremes', () => {
  it('labels the official highs and lows against the curve', () => {
    const extremes = classifyExtremes(hilo, curve);
    expect(extremes).toHaveLength(20);
    expect(extremes.slice(0, 4).map((e) => [e.v, e.type])).toEqual([
      [0.242, 'low'],
      [1.774, 'high'],
      [0.276, 'low'],
      [1.737, 'high'],
    ]);
    // Highs and lows alternate.
    expect(extremes.every((e, i) => i === 0 || e.type !== extremes[i - 1].type)).toBe(true);
  });

  it('falls back on the neighbours where the curve does not reach', () => {
    const outside = [
      { t: 0, v: 0.2 },
      { t: HOUR_MS * 6, v: 1.8 },
      { t: HOUR_MS * 12, v: 0.3 },
    ];
    expect(classifyExtremes(outside, curve).map((e) => e.type)).toEqual(['low', 'high', 'low']);
  });
});

describe('detectExtremes', () => {
  it('finds the same highs and lows from the curve alone', () => {
    const detected = detectExtremes(curve);
    const official = classifyExtremes(hilo, curve);
    // Inside the curve, each official high or low has a detected one within 15 minutes.
    const inside = official.filter((e) => e.t > curve[0].t && e.t < curve[curve.length - 1].t);
    for (const e of inside) {
      expect(detected.some((d) => d.type === e.type && Math.abs(d.t - e.t) <= 15 * 60_000)).toBe(true);
    }
  });

  it('gives a plateau a single point', () => {
    const flat = [1, 2, 3, 3, 3, 2, 1].map((v, i) => ({ t: i, v }));
    expect(detectExtremes(flat)).toEqual([{ t: 2, v: 3, type: 'high' }]);
  });
});

describe('fromEntity', () => {
  const sensor = (attributes: Record<string, unknown>) => ({
    entity_id: 'sensor.halifax_tide_level',
    state: '1.2',
    last_updated: '',
    attributes,
  });

  it('reads the integration sensor, and checks the extreme types itself', () => {
    const lying = dfo('halifax_hilo.json').map((p) => ({ ...p, type: 'high' }));
    const data = fromEntity(
      sensor({ tide_data: dfo('halifax_wlp.json'), tide_extremes: lying, station_name: 'Halifax' }),
    )!;
    expect(data.stationName).toBe('Halifax');
    expect(data.points).toHaveLength(481);
    expect(data.extremes[0].type).toBe('low');
  });

  it('detects the extremes without tide_extremes, and ignores other sensors', () => {
    expect(fromEntity(sensor({ tide_data: dfo('halifax_wlp.json') }))!.extremes.length).toBeGreaterThan(15);
    expect(fromEntity(sensor({}))).toBeNull();
    expect(fromEntity(sensor({ tide_data: [{ time: '2026-09-26T03:00:00Z', value: 1 }] }))).toBeNull();
  });
});

const HOUR_MS = 3_600_000;
