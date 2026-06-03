import { ThemeProvider, CssBaseline } from "@mui/material";
import { useMemo } from "react";
import { useSettings } from "./lib/settings";
import { buildTheme } from "./theme";

export function AppThemeProvider({ children }: { children: React.ReactNode }) {
  const s = useSettings();

  const theme = useMemo(() => {
    return buildTheme(s.theme, s.accent, s.customHue);
  }, [s.theme, s.accent, s.customHue]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
}