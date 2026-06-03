import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Box, 
  Button, 
  Card, 
  CardContent, 
  TextField, 
  Typography, 
  Stack 
} from "@mui/material";
import { Spa as LeafIcon } from "@mui/icons-material";

export function LoginForm() {
  const [email, setEmail] = useState("admin@vertbien.com");
  const [password, setPassword] = useState("vertbien");
  const navigate = useNavigate();

  const handleLogin = (userEmail: string) => {
    // Aquí irá tu lógica de Supabase en el futuro
    console.log("Sesión iniciada como:", userEmail);
    navigate("/dashboard");
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    handleLogin(email);
  };

  return (
  <Box
      sx={{
        minHeight: "100vh",
        width: "100%", // Cambiado de 100vw a 100%
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 2,
        // El gradiente vive aquí:
        background: "linear-gradient(135deg, #1e4620 0%, #4caf50 100%)",
        // Eliminamos position: absolute para que no fuerce el layout
        overflow: "hidden", 
      }}
    >
      <Card sx={{ maxWidth: 400, width: "100%", p: 3, boxShadow: 10 }}>
        <CardContent>
          <Stack alignItems="center" spacing={1} mb={3}>
            <Box
              sx={{
                width: 56,
                height: 56,
                borderRadius: 4,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "primary.main",
                color: "white",
                mb: 1
              }}
            >
              <LeafIcon fontSize="large" />
            </Box>
            <Typography variant="h5" fontWeight="bold">VertBien</Typography>
            <Typography variant="body2" color="text.secondary">
              Gestión de stock & ventas
            </Typography>
          </Stack>

          <form onSubmit={submit}>
            <Stack spacing={2}>
              <TextField
                label="Email"
                type="email"
                fullWidth
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <TextField
                label="Contraseña"
                type="password"
                fullWidth
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <Button type="submit" variant="contained" size="large" fullWidth>
                Ingresar
              </Button>
              <Button
                type="button"
                variant="outlined"
                fullWidth
                onClick={() => handleLogin("invitado@vertbien.com")}
              >
                Acceder como invitado
              </Button>
            </Stack>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
}