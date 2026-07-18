import { describe, it, expect } from "vitest";
import formatFileSize from "../utils/formatFileSize";

describe("formatFileSize", () => {
  it("returns '0 B' for null, undefined, or 0", () => {
    expect(formatFileSize(null)).toBe("0 B");
    expect(formatFileSize(undefined)).toBe("0 B");
    expect(formatFileSize(0)).toBe("0 B");
  });

  it("formats bytes correctly", () => {
    expect(formatFileSize(512)).toBe("512 B");
  });

  it("formats kilobytes with one decimal", () => {
    expect(formatFileSize(1024)).toBe("1.0 KB");
    expect(formatFileSize(1536)).toBe("1.5 KB");
  });

  it("formats megabytes with one decimal", () => {
    expect(formatFileSize(1024 * 1024)).toBe("1.0 MB");
    expect(formatFileSize(10 * 1024 * 1024)).toBe("10.0 MB");
  });

  it("formats 50 MB (max file size limit)", () => {
    expect(formatFileSize(50 * 1024 * 1024)).toBe("50.0 MB");
  });

  it("formats gigabytes with one decimal", () => {
    expect(formatFileSize(1024 * 1024 * 1024)).toBe("1.0 GB");
  });
});
