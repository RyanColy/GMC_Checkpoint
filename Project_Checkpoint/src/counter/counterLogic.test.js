import {
  applyDelta,
  clamp,
  clampStep,
  isAtMax,
  isAtMin,
} from "./counterLogic";

describe("clamp", () => {
  test("returns the value when inside bounds", () => {
    expect(clamp(5, 0, 10)).toBe(5);
  });

  test("clamps to min when below bounds", () => {
    expect(clamp(-5, 0, 10)).toBe(0);
  });

  test("clamps to max when above bounds", () => {
    expect(clamp(15, 0, 10)).toBe(10);
  });
});

describe("applyDelta", () => {
  test("adds a positive delta within bounds", () => {
    expect(applyDelta(3, 2, 0, 10)).toBe(5);
  });

  test("does not exceed the max bound", () => {
    expect(applyDelta(9, 5, 0, 10)).toBe(10);
  });

  test("does not go below the min bound", () => {
    expect(applyDelta(1, -5, 0, 10)).toBe(0);
  });
});

describe("clampStep", () => {
  test("rounds fractional steps", () => {
    expect(clampStep(2.7)).toBe(3);
  });

  test("floors step at 1", () => {
    expect(clampStep(0)).toBe(1);
    expect(clampStep(-4)).toBe(1);
  });

  test("falls back to the default step for non-finite input", () => {
    expect(clampStep(NaN)).toBe(1);
  });
});

describe("isAtMin / isAtMax", () => {
  test("isAtMin is true at or below the minimum", () => {
    expect(isAtMin(0, 0)).toBe(true);
    expect(isAtMin(-1, 0)).toBe(true);
    expect(isAtMin(1, 0)).toBe(false);
  });

  test("isAtMax is true at or above the maximum", () => {
    expect(isAtMax(10, 10)).toBe(true);
    expect(isAtMax(11, 10)).toBe(true);
    expect(isAtMax(9, 10)).toBe(false);
  });
});
