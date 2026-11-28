// Unit tests for scheduled blog publishing date logic.
import { describe, expect, it } from "vitest";

import { getBlogToday, isScheduledForFuture, publishedByDateFilter } from "./blog-schedule";

describe("getBlogToday", () => {
  it("uses Almaty time, not UTC, near midnight", () => {
    // 20:30 UTC on Dec 1 is already Dec 2 in Almaty (UTC+5).
    expect(getBlogToday(new Date("2026-12-01T20:30:00Z"))).toBe("2026-12-02");
  });

  it("returns the same day during Almaty daytime", () => {
    expect(getBlogToday(new Date("2026-12-01T06:00:00Z"))).toBe("2026-12-01");
  });
});

describe("isScheduledForFuture", () => {
  it("treats a later date as scheduled", () => {
    expect(isScheduledForFuture("2026-12-08", "2026-12-01")).toBe(true);
  });

  it("treats today as already live", () => {
    expect(isScheduledForFuture("2026-12-01", "2026-12-01")).toBe(false);
  });

  it("treats a missing date as live", () => {
    expect(isScheduledForFuture(null, "2026-12-01")).toBe(false);
  });
});

describe("publishedByDateFilter", () => {
  it("builds a PostgREST or-filter capped at today", () => {
    expect(publishedByDateFilter("2026-12-01")).toBe(
      "published_at.is.null,published_at.lte.2026-12-01",
    );
  });
});
