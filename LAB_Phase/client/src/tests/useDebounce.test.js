import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import useDebounce from "../hooks/useDebounce";

describe("useDebounce", () => {
  beforeEach(() => { vi.useFakeTimers(); });
  afterEach(() => { vi.useRealTimers(); });

  it("returns the initial value immediately", () => {
    const { result } = renderHook(() => useDebounce("hello", 300));
    expect(result.current).toBe("hello");
  });

  it("does not update before the delay elapses", () => {
    const { result, rerender } = renderHook(({ v }) => useDebounce(v, 300), {
      initialProps: { v: "hello" },
    });
    rerender({ v: "world" });
    act(() => { vi.advanceTimersByTime(100); });
    expect(result.current).toBe("hello");
  });

  it("updates after the delay elapses", () => {
    const { result, rerender } = renderHook(({ v }) => useDebounce(v, 300), {
      initialProps: { v: "hello" },
    });
    rerender({ v: "world" });
    act(() => { vi.advanceTimersByTime(300); });
    expect(result.current).toBe("world");
  });

  it("resets the timer on rapid changes (debounce behavior)", () => {
    const { result, rerender } = renderHook(({ v }) => useDebounce(v, 300), {
      initialProps: { v: "a" },
    });
    rerender({ v: "ab" });
    act(() => { vi.advanceTimersByTime(100); });
    rerender({ v: "abc" });
    act(() => { vi.advanceTimersByTime(100); });
    // 200ms total — still below 300ms from last change
    expect(result.current).toBe("a");

    act(() => { vi.advanceTimersByTime(300); });
    expect(result.current).toBe("abc");
  });

  it("uses 300ms as default delay", () => {
    const { result, rerender } = renderHook(({ v }) => useDebounce(v), {
      initialProps: { v: "initial" },
    });
    rerender({ v: "updated" });
    act(() => { vi.advanceTimersByTime(299); });
    expect(result.current).toBe("initial");
    act(() => { vi.advanceTimersByTime(1); });
    expect(result.current).toBe("updated");
  });
});
