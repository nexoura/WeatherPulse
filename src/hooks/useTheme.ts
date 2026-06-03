import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import { setTheme } from "@/redux/weatherSlice";

export function useTheme() {
  const theme = useAppSelector((s) => s.weather.theme);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (typeof document === "undefined") return;
    const root = document.documentElement;
    if (theme === "dark") root.classList.add("dark");
    else root.classList.remove("dark");
  }, [theme]);

  return {
    theme,
    setTheme: (t: "dark" | "light") => dispatch(setTheme(t)),
  };
}
