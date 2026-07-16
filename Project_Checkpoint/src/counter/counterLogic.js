export const DEFAULT_MIN = -100;
export const DEFAULT_MAX = 100;
export const DEFAULT_STEP = 1;

export function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

export function applyDelta(current, delta, min = DEFAULT_MIN, max = DEFAULT_MAX) {
  return clamp(current + delta, min, max);
}

export function clampStep(step) {
  const parsed = Number.isFinite(step) ? step : DEFAULT_STEP;
  return Math.max(1, Math.round(parsed));
}

export function isAtMin(value, min = DEFAULT_MIN) {
  return value <= min;
}

export function isAtMax(value, max = DEFAULT_MAX) {
  return value >= max;
}
