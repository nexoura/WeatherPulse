import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { GeoLocation, SavedCity } from "@/types/weather";
import { DEFAULT_CITY } from "@/config/constants";

export interface LocationState {
  active: GeoLocation;
  favorites: SavedCity[];
  recent: GeoLocation[];
}

const initialState: LocationState = {
  active: DEFAULT_CITY,
  favorites: [],
  recent: [],
};

const idOf = (g: GeoLocation) => `${g.lat.toFixed(3)},${g.lon.toFixed(3)}`;

const slice = createSlice({
  name: "location",
  initialState,
  reducers: {
    setActive(state, action: PayloadAction<GeoLocation>) {
      state.active = action.payload;
      const id = idOf(action.payload);
      state.recent = [action.payload, ...state.recent.filter((r) => idOf(r) !== id)].slice(0, 8);
    },
    addFavorite(state, action: PayloadAction<GeoLocation>) {
      const id = idOf(action.payload);
      if (state.favorites.some((f) => f.id === id)) return;
      state.favorites.unshift({ ...action.payload, id, addedAt: Date.now() });
    },
    removeFavorite(state, action: PayloadAction<string>) {
      state.favorites = state.favorites.filter((f) => f.id !== action.payload);
    },
    clearRecent(state) {
      state.recent = [];
    },
    hydrateLocation(_state, action: PayloadAction<Partial<LocationState>>) {
      return { ...initialState, ...action.payload };
    },
  },
});

export const { setActive, addFavorite, removeFavorite, clearRecent, hydrateLocation } =
  slice.actions;
export const locationReducer = slice.reducer;
