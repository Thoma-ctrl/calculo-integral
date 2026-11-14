import { describe, expect, test } from 'bun:test';
import { applicationMetrics, curveModel, integrate, MODES, quadraticPrimitive, revolutionVolume, type Parameters } from './advanced-calculus';
import { MODULES } from '../data/modules';
import { ADVANCED_LESSONS } from '../data/advanced-lessons';

const parameters: Parameters = { a: 2, b: 0.7, c: 2, C: 0, left: 0, right: 1 };
const derivative = (f: (x: number) => number, x: number) => (f(x + 1e-5) - f(x - 1e-5)) / 2e-5;

test('the catalog contains all 21 active modules', () => {
  expect(MODULES.map(module => module.id)).toEqual(Array.from({ length: 21 }, (_, i) => i + 1));
  expect(MODULES.every(module => module.status === 'activo')).toBe(true);
});

test('modules 7–21 have exactly two literal worked examples', () => {
  expect(ADVANCED_LESSONS.map(lesson => lesson.id)).toEqual(Array.from({ length: 15 }, (_, i) => i + 7));
  for (const lesson of ADVANCED_LESSONS) expect(lesson.examples).toHaveLength(2);
});

describe('advanced antiderivatives reproduce their integrands', () => {
  for (const [id, modes] of Object.entries(MODES)) {
    if (Number(id) === 21) continue;
    modes.forEach((mode, index) => test(`module ${id}: ${mode}`, () => {
      const model = curveModel(Number(id), index, parameters);
      let samples = 0;
      for (let i = 1; i < 20; i++) {
        const x = model.domain[0] + (model.domain[1] - model.domain[0]) * i / 20;
        const expected = model.f(x), actual = derivative(model.F, x);
        if (!Number.isFinite(expected) || !Number.isFinite(actual)) continue;
        expect(Math.abs(actual - expected) / Math.max(1, Math.abs(expected))).toBeLessThan(1e-5);
        samples++;
      }
      expect(samples).toBeGreaterThan(5);
    }));
  }
});

test('substitution preserves area in both compound families', () => {
  for (const mode of [0, 1]) {
    const model = curveModel(7, mode, parameters);
    const transformed = mode === 0 ? (u: number) => u ** 2 : (u: number) => Math.exp(u);
    expect(integrate(model.f, 0, 1.5)).toBeCloseTo(integrate(transformed, parameters.b, parameters.a * 2.25 + parameters.b), 6);
  }
});

test('Weierstrass includes the differential in each rational integrand', () => {
  for (const mode of [0, 1]) {
    const model = curveModel(19, mode, parameters);
    for (const t of [-3, -1, 0, 1, 3]) {
      const expected = mode === 0 ? 2 / (3 + t * t) : 2 / (2 * (1 + t * t) + 2 * t);
      expect(model.f(2 * Math.atan(t)) * 2 / (1 + t * t)).toBeCloseTo(expected, 10);
    }
  }
});

test('equal wave frequencies do not divide by zero', () => {
  const model = curveModel(17, 0, { ...parameters, a: 2, b: 2 });
  expect(derivative(model.F, 0.3)).toBeCloseTo(Math.sin(0.6) * Math.cos(0.6), 8);
});

test('quadratic primitives cover positive, zero and negative discriminants', () => {
  for (const c of [2, 0, -1]) for (const radical of [false, true]) {
    const x = 2;
    expect(derivative(t => quadraticPrimitive(t, 1, 0, c, radical), x)).toBeCloseTo(radical ? 1 / Math.sqrt(x * x + c) : 1 / (x * x + c), 8);
  }
});

test('line arc length equals 3√5 and x² average on [0,2] equals 4/3', () => {
  expect(applicationMetrics({ ...parameters, a: 2, b: 1, right: 3 }, 1).length).toBeCloseTo(3 * Math.sqrt(5), 10);
  expect(applicationMetrics({ ...parameters, a: 1, b: 0, right: 2 }, 0).average).toBeCloseTo(4 / 3, 10);
});

test('unit cone disks have volume π/3', () => {
  expect(revolutionVolume({ ...parameters, a: 1 }, 0)).toBeCloseTo(Math.PI / 3, 10);
});
test('annular cone with half inner radius has volume π/4', () => {
  expect(revolutionVolume({ ...parameters, a: 1, b: 0.5 }, 1)).toBeCloseTo(Math.PI / 4, 10);
});
test('unit triangular shells have volume 2π/3', () => {
  expect(revolutionVolume({ ...parameters, a: 1, b: 0 }, 2)).toBeCloseTo(2 * Math.PI / 3, 10);
});