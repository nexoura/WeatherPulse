import { describe, it, expect } from "vitest";
import {
  formatTemp,
  formatTempShort,
  formatWind,
  formatVisibility,
  aggregateDaily,
  deriveAdvisories,
} from "./format";
import type { ForecastItem } from "@/types/weather";

describe("format.ts Meteorological Helpers", () => {
  describe("formatTemp", () => {
    it("should format temperature in metric Celsius by default", () => {
      expect(formatTemp(23.4)).toBe("23°C");
      expect(formatTemp(23.6)).toBe("24°C");
    });

    it("should format temperature in imperial Fahrenheit when specified", () => {
      expect(formatTemp(74.2, "imperial")).toBe("74°F");
      expect(formatTemp(-5, "imperial")).toBe("-5°F");
    });
  });

  describe("formatTempShort", () => {
    it("should return rounded temp value with degree symbol", () => {
      expect(formatTempShort(15.2)).toBe("15°");
      expect(formatTempShort(-3.8)).toBe("-4°");
    });
  });

  describe("formatWind", () => {
    it("should convert m/s to km/h in metric and round to 1 decimal place", () => {
      expect(formatWind(5)).toBe("18.0 km/h"); // 5 * 3.6 = 18
      expect(formatWind(1.5)).toBe("5.4 km/h");
    });

    it("should display raw mph in imperial and round to 1 decimal place", () => {
      expect(formatWind(10, "imperial")).toBe("10.0 mph");
    });
  });

  describe("formatVisibility", () => {
    it("should format visibility in km if >= 1000m", () => {
      expect(formatVisibility(10000)).toBe("10.0 km");
      expect(formatVisibility(1500)).toBe("1.5 km");
    });

    it("should format visibility in m if < 1000m", () => {
      expect(formatVisibility(800)).toBe("800 m");
    });
  });

  describe("aggregateDaily", () => {
    it("should group 3-hour forecasts by calendar date and compute stats", () => {
      // Mock items for 2 different days
      const mockItems = [
        // Day 1 (2026-06-05)
        {
          dt: 1780660800, // 2026-06-05 12:00:00 UTC
          dt_txt: "2026-06-05 12:00:00",
          main: { temp: 30, temp_min: 28, temp_max: 32, humidity: 60 },
          weather: [{ id: 800, main: "Clear", description: "clear sky", icon: "01d" }],
          wind: { speed: 5 },
          pop: 0.1,
        },
        {
          dt: 1780671600, // 2026-06-05 15:00:00 UTC
          dt_txt: "2026-06-05 15:00:00",
          main: { temp: 29, temp_min: 27, temp_max: 30, humidity: 65 },
          weather: [{ id: 801, main: "Clouds", description: "few clouds", icon: "02d" }],
          wind: { speed: 6 },
          pop: 0.2,
        },
        // Day 2 (2026-06-06)
        {
          dt: 1780747200, // 2026-06-06 12:00:00 UTC
          dt_txt: "2026-06-06 12:00:00",
          main: { temp: 22, temp_min: 20, temp_max: 24, humidity: 80 },
          weather: [{ id: 500, main: "Rain", description: "light rain", icon: "10d" }],
          wind: { speed: 8 },
          pop: 0.8,
        },
      ] as unknown as ForecastItem[];

      const daily = aggregateDaily(mockItems, 0);

      expect(daily.length).toBe(2);

      // Day 1 Checks
      expect(daily[0].date).toBe("2026-06-05");
      expect(daily[0].tempMin).toBe(27);
      expect(daily[0].tempMax).toBe(32);
      expect(daily[0].humidityAvg).toBe(63); // (60+65)/2 = 62.5 -> rounded 63
      expect(daily[0].popMax).toBe(0.2);
      expect(daily[0].wind).toBe(6);

      // Day 2 Checks
      expect(daily[1].date).toBe("2026-06-06");
      expect(daily[1].tempMin).toBe(20);
      expect(daily[1].tempMax).toBe(24);
      expect(daily[1].popMax).toBe(0.8);
    });
  });

  describe("deriveAdvisories", () => {
    it("should return heat advisory when metric temperature exceeds 35C", () => {
      const mockItems = [
        {
          dt: 1234567,
          main: { temp: 36, temp_min: 30, temp_max: 38 },
          weather: [{ main: "Clear" }],
          rain: {},
        },
      ] as unknown as ForecastItem[];

      const advisories = deriveAdvisories(mockItems, "metric");
      expect(advisories).toContainEqual(
        expect.objectContaining({
          level: "warning",
          title: "Heat advisory",
        }),
      );
    });

    it("should return heavy rain advisory when 3h precipitation exceeds 10mm", () => {
      const mockItems = [
        {
          dt: 1234567,
          main: { temp: 24 },
          weather: [{ main: "Rain" }],
          rain: { "3h": 12 },
        },
      ] as unknown as ForecastItem[];

      const advisories = deriveAdvisories(mockItems, "metric");
      expect(advisories).toContainEqual(
        expect.objectContaining({
          level: "warning",
          title: "Heavy rain advisory",
        }),
      );
    });

    it("should return thunderstorm advisory when weather main is Thunderstorm", () => {
      const mockItems = [
        {
          dt: 1234567,
          main: { temp: 24 },
          weather: [{ main: "Thunderstorm" }],
          rain: {},
        },
      ] as unknown as ForecastItem[];

      const advisories = deriveAdvisories(mockItems, "metric");
      expect(advisories).toContainEqual(
        expect.objectContaining({
          level: "danger",
          title: "Thunderstorm advisory",
        }),
      );
    });
  });
});
