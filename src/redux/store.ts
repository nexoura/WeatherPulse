import { configureStore } from "@reduxjs/toolkit";
import {
  TypedUseSelectorHook,
  useDispatch as useReduxDispatch,
  useSelector as useReduxSelector,
} from "react-redux";
import { weatherReducer, hydrateWeather } from "./weatherSlice";
import { locationReducer, hydrateLocation } from "./locationSlice";

const STORAGE_KEY = "weather-app:v1";

function loadPersisted() {
  if (typeof window === "undefined") return undefined;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return undefined;
    return JSON.parse(raw);
  } catch {
    return undefined;
  }
}

export const store = configureStore({
  reducer: {
    weather: weatherReducer,
    location: locationReducer,
  },
});

// Hydrate from localStorage after store creation (client-only)
if (typeof window !== "undefined") {
  const persisted = loadPersisted();
  if (persisted?.weather) store.dispatch(hydrateWeather(persisted.weather));
  if (persisted?.location) store.dispatch(hydrateLocation(persisted.location));

  let timeout: ReturnType<typeof setTimeout> | null = null;
  store.subscribe(() => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => {
      try {
        const s = store.getState();
        window.localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify({ weather: s.weather, location: s.location }),
        );
      } catch {
        /* ignore quota */
      }
    }, 200);
  });
}

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch: () => AppDispatch = useReduxDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useReduxSelector;
