import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { Units } from "@/types/weather";

export interface WeatherState {
  units: Units;
  theme: "dark" | "light";
}

const initialState: WeatherState = {
  units: "metric",
  theme: "light",
};

const slice = createSlice({
  name: "weather",
  initialState,
  reducers: {
    setUnits(state, action: PayloadAction<Units>) {
      state.units = action.payload;
    },
    toggleUnits(state) {
      state.units = state.units === "metric" ? "imperial" : "metric";
    },
    setTheme(state, action: PayloadAction<"dark" | "light">) {
      state.theme = "light";
    },
    toggleTheme(state) {
      state.theme = "light";
    },
    hydrateWeather(_state, action: PayloadAction<Partial<WeatherState>>) {
      return { ...initialState, ...action.payload };
    },
  },
});

export const { setUnits, toggleUnits, setTheme, toggleTheme, hydrateWeather } = slice.actions;
export const weatherReducer = slice.reducer;
