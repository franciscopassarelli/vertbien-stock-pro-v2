import { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Grid,
  MenuItem,
  Box,
  Typography,
  Avatar,
} from "@mui/material";

import { Upload, Inventory } from "@mui/icons-material";
import { useStore, Product, Unit, UNITS, UNIT_LABELS } from "../lib/store";
import { toast } from "sonner";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editing?: Product | null;
}

const empty: Omit<Product, "id"> = {
  nombre: "",
  categoria: "",
  precio: 0,
  unidad: "unidad",
  stock: 0,
  url_imagen: "",
  stockBajo: 10,
  stockCritico: 3,
};

export function ProductModal({ open, onOpenChange, editing }: Props) {
  const { categories, addProduct, updateProduct } = useStore();
  const [form, setForm] = useState<Omit<Product, "id">>(empty);

  useEffect(() => {
    if (editing) {
      const { id: _id, ...rest } = editing;
      setForm(rest);
    } else {
      setForm(empty);
    }
  }, [editing, open]);

  const handleImage = (file?: File) => {
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () =>
      setForm((f) => ({
        ...f,
        url_imagen: String(reader.result),
      }));

    reader.readAsDataURL(file);
  };

  const save = async () => {
    if (!form.nombre.trim())
      return toast.error("El nombre es obligatorio");

    if (!form.categoria)
      return toast.error("Seleccioná una categoría");

    if (form.precio <= 0)
      return toast.error("El precio debe ser mayor a 0");

    if (form.stock < 0)
      return toast.error("El stock no puede ser negativo");

    if (form.stockCritico >= form.stockBajo)
      return toast.error("Stock crítico debe ser menor que stock bajo");

    const payload = { ...form };

    if (editing) {
      await updateProduct(editing.id, payload);
    } else {
      await addProduct(payload);
    }

    toast.success("Producto guardado");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onClose={() => onOpenChange(false)} fullWidth maxWidth="sm">
      <DialogTitle>
        {editing ? "Editar producto" : "Nuevo producto"}
      </DialogTitle>

      <DialogContent dividers>
        <Grid container spacing={2}>

          {/* IMAGEN */}
          <Grid item xs={12}>
            <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
              <Avatar
                variant="rounded"
                src={form.url_imagen}
                sx={{ width: 80, height: 80 }}
              >
                <Inventory />
              </Avatar>

              <Box>
                <Typography variant="body2" gutterBottom>
                  Imagen del producto
                </Typography>

                <Button
                  variant="outlined"
                  component="label"
                  startIcon={<Upload />}
                >
                  Subir imagen
                  <input
                    hidden
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                      handleImage(e.target.files?.[0])
                    }
                  />
                </Button>
              </Box>
            </Box>
          </Grid>

          {/* NOMBRE */}
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Nombre"
              value={form.nombre}
              onChange={(e) =>
                setForm({ ...form, nombre: e.target.value })
              }
            />
          </Grid>

          {/* CATEGORIA + UNIDAD */}
          <Grid item xs={6}>
            <TextField
              fullWidth
              select
              label="Categoría"
              value={form.categoria}
              onChange={(e) =>
                setForm({ ...form, categoria: e.target.value })
              }
            >
              {categories.map((c) => (
                <MenuItem key={c} value={c}>
                  {c}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid item xs={6}>
            <TextField
              fullWidth
              select
              label="Unidad"
              value={form.unidad}
              onChange={(e) =>
                setForm({
                  ...form,
                  unidad: e.target.value as Unit,
                })
              }
            >
              {UNITS.map((u) => (
                <MenuItem key={u} value={u}>
                  {UNIT_LABELS[u]}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          {/* PRECIO + STOCK */}
          <Grid item xs={6}>
            <TextField
              fullWidth
              type="number"
              label="Precio"
              value={form.precio}
              onChange={(e) =>
                setForm({
                  ...form,
                  precio: Number(e.target.value),
                })
              }
            />
          </Grid>

          <Grid item xs={6}>
            <TextField
              fullWidth
              type="number"
              label="Stock"
              value={form.stock}
              onChange={(e) =>
                setForm({
                  ...form,
                  stock: Number(e.target.value),
                })
              }
            />
          </Grid>

          {/* UMBRALES */}
          <Grid item xs={6}>
            <TextField
              fullWidth
              type="number"
              label="Stock bajo"
              value={form.stockBajo}
              onChange={(e) =>
                setForm({
                  ...form,
                  stockBajo: Number(e.target.value),
                })
              }
            />
          </Grid>

          <Grid item xs={6}>
            <TextField
              fullWidth
              type="number"
              label="Stock crítico"
              value={form.stockCritico}
              onChange={(e) =>
                setForm({
                  ...form,
                  stockCritico: Number(e.target.value),
                })
              }
            />
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions>
        <Button onClick={() => onOpenChange(false)}>
          Cancelar
        </Button>
        <Button variant="contained" onClick={save}>
          Guardar
        </Button>
      </DialogActions>
    </Dialog>
  );
}