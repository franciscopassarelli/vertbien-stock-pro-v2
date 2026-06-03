import { createContext, useContext, useEffect, useState, useCallback } from "react";
import type { ReactNode } from "react";

export type ThemeMode = "light" | "dark";
export type AccentKey = "indigo" | "ocean" | "emerald" | "amber" | "coral" | "rose" | "custom";

interface SettingsState {
  theme: ThemeMode;
  accent: AccentKey;
  customHue: number;
  vendedores: string[];
  hydrated: boolean;
  setTheme: (t: ThemeMode) => void;
  setAccent: (a: AccentKey) => void;
  setCustomHue: (h: number) => void;
  addVendedor: (n: string) => void;
  removeVendedor: (n: string) => void;
  renameVendedor: (oldName: string, newName: string) => void;
}

const Ctx = createContext<SettingsState | null>(null);
const KEY = "vertbien-settings-v1";

// 1. Crea la constante que quieres exportar
export const ACCENT_PRESETS = [
  { key: "indigo", hue: 270 },
  { key: "ocean", hue: 220 },
  { key: "emerald", hue: 160 },
  { key: "amber", hue: 70 },
  { key: "coral", hue: 25 },
  { key: "rose", hue: 350 },
] as const;

// Opcional: Si quieres mantener el objeto ACCENT_HUE para uso interno, 
// puedes dejarlo, pero el array anterior es necesario para tu map() en la UI.

const DEFAULT = {
  theme: "light" as ThemeMode,
  accent: "emerald" as AccentKey,
  customHue: 175,
  vendedores: ["Ana", "Lucía", "Sofía", "Martina", "Valentina"],
};

// Nota: En MUI, la aplicación de tema (applyTheme) es diferente a la de shadcn. 
// Por ahora, si solo quieres lógica, esto está bien.
export function SettingsProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState(DEFAULT);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setState({ ...DEFAULT, ...JSON.parse(raw) });
    } catch {}
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try { localStorage.setItem(KEY, JSON.stringify(state)); } catch {}
  }, [state, hydrated]);

  const setTheme = useCallback((t: ThemeMode) => setState((s) => ({ ...s, theme: t })), []);
  const setAccent = useCallback((a: AccentKey) => setState((s) => ({ ...s, accent: a })), []);
  const setCustomHue = useCallback((h: number) => setState((s) => ({ ...s, customHue: h, accent: "custom" })), []);
  
  const addVendedor = useCallback((n: string) => {
    const v = n.trim();
    if (!v) return;
    setState((s) => s.vendedores.includes(v) ? s : ({ ...s, vendedores: [...s.vendedores, v] }));
  }, []);

  const removeVendedor = useCallback((n: string) => {
    setState((s) => ({ ...s, vendedores: s.vendedores.filter((x) => x !== n) }));
  }, []);

  const renameVendedor = useCallback((oldName: string, newName: string) => {
    const v = newName.trim();
    if (!v) return;
    setState((s) => ({ ...s, vendedores: s.vendedores.map((x) => x === oldName ? v : x) }));
  }, []);

  return (
    <Ctx.Provider value={{ ...state, hydrated, setTheme, setAccent, setCustomHue, addVendedor, removeVendedor, renameVendedor }}>
      {children}
    </Ctx.Provider>
  );
}

export function useSettings() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useSettings must be inside SettingsProvider");
  return c;
}