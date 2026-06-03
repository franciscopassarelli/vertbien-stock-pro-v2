import { useState } from "react";
import {
  Box,
  Typography,
  Card,
  TextField,
  Button,
  Grid,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Avatar,
  Stack,
  Paper,
} from "@mui/material";

import {
  Add,
  Delete,
  Visibility,
  Inventory,
  Category as CategoryIcon,
} from "@mui/icons-material";
import { Chip } from "@mui/material";

import { useStore, getStockState } from "../lib/store";
import { toast } from "sonner";

export function Categories() {
  const { categories, products, addCategory, deleteCategory } = useStore();

  const [name, setName] = useState("");
  const [openCat, setOpenCat] = useState<string | null>(null);

  const counts = categories.map((c) => {
    const catProducts = products.filter((p) => p.categoria === c);

    return {
      name: c,
      total: catProducts.length,
      stock: catProducts.reduce((a, p) => a + p.stock, 0),
    };
  });

  const add = () => {
    const v = name.trim();
    if (!v) return;

    addCategory(v);
    setName("");
    toast.success("Categoría creada");
  };

  const remove = (name: string) => {
    if (window.confirm(`¿Eliminar categoría "${name}"?`)) {
      deleteCategory(name);
      toast.success("Categoría eliminada");
    }
  };

  const selectedProducts =
    openCat ? products.filter((p) => p.categoria === openCat) : [];

  return (
    <Box sx={{ maxWidth: 1100, mx: "auto", p: 3 }}>
      {/* HEADER */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" fontWeight={600}>
          Categorías
        </Typography>
        <Typography color="text.secondary">
          Organizá tu catálogo
        </Typography>
      </Box>

      {/* CREATE CATEGORY */}
      <Card sx={{ p: 2, mb: 3 }}>
        <Stack direction="row" spacing={2}>
          <TextField
            fullWidth
            size="small"
            placeholder="Nueva categoría (ej: Cocina)"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && add()}
          />

          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={add}
          >
            Agregar
          </Button>
        </Stack>
      </Card>

      {/* GRID */}
      <Grid container spacing={2}>
        {counts.map((c) => (
          <Grid item xs={12} sm={6} md={4} key={c.name}>
            <Card sx={{ p: 2, height: "100%" }}>

              {/* HEADER CARD */}
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  mb: 2,
                }}
              >
                <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
                  <Avatar sx={{ bgcolor: "primary.main" }}>
                    <CategoryIcon />
                  </Avatar>

                  <Box>
                    <Typography fontWeight={600}>
                      {c.name}
                    </Typography>

                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ cursor: "pointer" }}
                      onClick={() => setOpenCat(c.name)}
                    >
                      {c.total} productos · {c.stock} stock
                    </Typography>
                  </Box>
                </Box>

                <IconButton
                  color="error"
                  onClick={() => remove(c.name)}
                >
                  <Delete />
                </IconButton>
              </Box>

              {/* ACTION */}
              <Button
                fullWidth
                variant="outlined"
                startIcon={<Visibility />}
                onClick={() => setOpenCat(c.name)}
              >
                Ver productos
              </Button>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* MODAL */}
      <Dialog
        open={!!openCat}
        onClose={() => setOpenCat(null)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>
          Categoría: {openCat}
        </DialogTitle>

        <DialogContent dividers>
          <Stack spacing={1.5}>
            {selectedProducts.map((p) => {
              const st = getStockState(p);

              const stockColor =
                st === "critical"
                  ? "error"
                  : st === "low"
                  ? "warning"
                  : "default";

              return (
                <Paper
                  key={p.id}
                  sx={{
                    p: 1.5,
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                  }}
                >
                  {/* IMAGE */}
                  <Avatar
                    src={p.url_imagen}
                    variant="rounded"
                  >
                    <Inventory />
                  </Avatar>

                  {/* INFO */}
                  <Box sx={{ flex: 1 }}>
                    <Typography fontWeight={600} noWrap>
                      {p.nombre}
                    </Typography>

                    <Typography
                      variant="body2"
                      color="text.secondary"
                    >
                      ${p.precio.toFixed(2)} / {p.unidad}
                    </Typography>
                  </Box>

                  {/* STOCK */}
                  <Chip
  label={`${p.stock} ${p.unidad}`}
  color={stockColor}
  size="small"
  sx={{
    fontWeight: 500,
  }}
/>
                </Paper>
              );
            })}

            {selectedProducts.length === 0 && (
              <Typography
                textAlign="center"
                color="text.secondary"
                sx={{ py: 4 }}
              >
                No hay productos en esta categoría
              </Typography>
            )}
          </Stack>
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setOpenCat(null)}>
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}