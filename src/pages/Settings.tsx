import { useState } from "react";
import { 
  Box, Card, Typography, TextField, Button, Stack, 
  IconButton, Badge, Slider, Grid, Paper
} from "@mui/material";
import { 
  DarkMode, LightMode, Add, Delete, Edit, Check, Close, Palette, Settings as SettingsIcon 
} from "@mui/icons-material";
import { useSettings, ACCENT_PRESETS } from "../lib/settings";
import { toast } from "sonner";

export function SettingsPage() {
  const s = useSettings();
  const [newSeller, setNewSeller] = useState("");
  const [editing, setEditing] = useState<string | null>(null);
  const [editName, setEditName] = useState("");

  const themes = [
    { k: "light", label: "Claro", icon: <LightMode /> },
    { k: "dark", label: "Oscuro", icon: <DarkMode /> },

  ] as const;

  return (
    <Stack spacing={4} sx={{ maxWidth: 800 }}>
      <Box>
  <Typography variant="h4" fontWeight="600" sx={{ display: "flex", alignItems: "center", gap: 1 }}>
    <SettingsIcon />
    Configuración
  </Typography>

  <Typography color="text.secondary">
    Personalizá la apariencia y los vendedores
  </Typography>
</Box>
      {/* Apariencia */}
      <Card sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>Apariencia</Typography>
        <Stack direction="row" spacing={2}>
          {themes.map((t) => (
            <Button
              key={t.k}
              variant={s.theme === t.k ? "contained" : "outlined"}
              onClick={() => s.setTheme(t.k as any)}
              startIcon={t.icon}
              sx={{ flex: 1, py: 2 }}
            >
              {t.label}
            </Button>
          ))}
        </Stack>
      </Card>

      {/* Color de Acento */}
      <Card sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>Color de acento</Typography>
        <Grid container spacing={2} sx={{ mb: 3 }}>
          {ACCENT_PRESETS.map((a) => (
            <Grid item key={a.key}>
              <Box
                onClick={() => s.setAccent(a.key as any)}
                sx={{
                  width: 50, height: 50, borderRadius: '50%', cursor: 'pointer',
                  border: s.accent === a.key ? '4px solid #1976d2' : '2px solid transparent',
                  background: `oklch(0.62 0.15 ${a.hue})`
                }}
              />
            </Grid>
          ))}
        </Grid>
        
        <Box sx={{ mt: 2, p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
          <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Palette fontSize="small" /> Personalizado (Matiz: {s.customHue}°)
          </Typography>
          <Slider value={s.customHue} min={0} max={360} onChange={(_, v) => s.setCustomHue(v as number)} />
        </Box>
      </Card>

      {/* Vendedores */}
      <Card sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>Vendedores</Typography>
        <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
          <TextField 
            fullWidth size="small" placeholder="Nombre del vendedor"
            value={newSeller} onChange={(e) => setNewSeller(e.target.value)}
          />
          <Button variant="contained" onClick={() => { s.addVendedor(newSeller); setNewSeller(""); toast.success("Agregado"); }}>
            <Add /> Agregar
          </Button>
        </Stack>
        
        <Stack spacing={1}>
          {s.vendedores.map((v) => (
            <Paper key={v} sx={{ p: 1.5, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              {editing === v ? (
                <Stack direction="row" spacing={1} sx={{ flex: 1 }}>
                  <TextField size="small" value={editName} onChange={(e) => setEditName(e.target.value)} fullWidth />
                  <IconButton onClick={() => { s.renameVendedor(v, editName); setEditing(null); }}><Check /></IconButton>
                  <IconButton onClick={() => setEditing(null)}><Close /></IconButton>
                </Stack>
              ) : (
                <>
                  <Badge color="primary" badgeContent=" " variant="dot" sx={{ mr: 2 }} />
                  <Typography>{v}</Typography>
                  <Box sx={{ flex: 1 }} />
                  <IconButton onClick={() => { setEditing(v); setEditName(v); }}><Edit /></IconButton>
                  <IconButton color="error" onClick={() => s.removeVendedor(v)}><Delete /></IconButton>
                </>
              )}
            </Paper>
          ))}
        </Stack>
      </Card>
    </Stack>
  );
}