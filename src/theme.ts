import { createTheme } from "@mui/material/styles";
import type { ThemeMode, AccentKey } from "./lib/settings";

const ACCENT_HUES: Record<AccentKey, number> = {
  indigo: 270,
  ocean: 220,
  emerald: 160,
  amber: 70,
  coral: 25,
  rose: 350,
  custom: 175,
};

export function buildTheme(
  mode: ThemeMode,
  accent: AccentKey,
  customHue: number
) {
  const hue = accent === "custom" ? customHue : ACCENT_HUES[accent];

  return createTheme({
    palette: {
      mode,
      primary: {
        main: `hsl(${hue}, 80%, 50%)`,
      },
      background: {
        default: mode === "dark" ? "#0f0f0f" : "#f5f5f5",
        paper: mode === "dark" ? "#1a1a1a" : "#ffffff",
      },
    },

    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            margin: 0,
            padding: 0,
            height: "100vh",
            width: "100vw",
            overflow: "hidden",
          },
        },
      },
    },
  });
}