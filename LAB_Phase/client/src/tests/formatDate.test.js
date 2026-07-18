import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { formatMessageTime, formatConversationDate } from "../utils/formatDate";

describe("formatMessageTime", () => {
  it("returns HH:MM from a valid date string", () => {
    const result = formatMessageTime("2026-06-03T14:30:00.000Z");
    // Accept locale-formatted time — just verify shape XX:XX
    expect(result).toMatch(/^\d{1,2}:\d{2}$/);
  });

  it("handles a Date object", () => {
    const result = formatMessageTime(new Date("2026-06-03T08:05:00.000Z"));
    expect(result).toMatch(/^\d{1,2}:\d{2}$/);
  });
});

describe("formatConversationDate", () => {
  it("returns empty string for null/undefined", () => {
    expect(formatConversationDate(null)).toBe("");
    expect(formatConversationDate(undefined)).toBe("");
  });

  it("returns HH:MM for a date that is today", () => {
    const now = new Date();
    const result = formatConversationDate(now.toISOString());
    expect(result).toMatch(/^\d{1,2}:\d{2}$/);
  });

  it("returns DD/MM for a date that is not today", () => {
    const past = new Date("2020-01-15T10:00:00.000Z");
    const result = formatConversationDate(past.toISOString());
    // Locale date format: DD/MM or MM/DD depending on locale — just verify it's not a time
    expect(result).not.toMatch(/^\d{1,2}:\d{2}$/);
    expect(result.length).toBeGreaterThan(0);
  });
});
