import { useMemo, useState } from "react";
import {
  Box,
  Card,
  Typography,
  TextField,
  Button,
  Stack,
  Grid,
  Paper,
  IconButton,
  Divider,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Avatar,
} from "@mui/material";

import {
  Add,
  Remove,
  Delete,
  Search,
  Inventory2,
} from "@mui/icons-material";

import { useStore, SaleItem, PaymentMethod, PAYMENT_METHODS } from "../lib/store";
import { useSettings } from "../lib/settings";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export function NewSale() {
  const { products, categories, addSale, updateProduct } = useStore();
  const { vendedores } = useSettings();
  const nav = useNavigate();

  const [q, setQ] = useState("");
  const [cat, setCat] = useState<string>("all");
  const [cart, setCart] = useState<SaleItem[]>([]);
  const [vendedor, setVendedor] = useState("");
  const [metodo, setMetodo] = useState<PaymentMethod>("Efectivo");

  const filtered = useMemo(() => {
    return products
      .filter((p) => (cat === "all" ? true : p.categoria === cat))
      .filter((p) => p.nombre.toLowerCase().includes(q.toLowerCase()))
      .slice(0, 24);
  }, [products, q, cat]);

  const addToCart = (id: string) => {
    const p = products.find((x) => x.id === id);
    if (!p) return;

    setCart((c) => {
      const existing = c.find((i) => i.productId === id);
      if (existing) {
        return c.map((i) =>
          i.productId === id
            ? { ...i, cantidad: i.cantidad + 1 }
            : i
        );
      }

      return [
        ...c,
        {
          productId: id,
          nombre: p.nombre,
          precio: p.precio,
          cantidad: 1,
        },
      ];
    });
  };

  const updateQty = (id: string, delta: number) => {
    setCart((c) =>
      c.map((i) =>
        i.productId === id
          ? { ...i, cantidad: Math.max(1, i.cantidad + delta) }
          : i
      )
    );
  };

  const removeItem = (id: string) =>
    setCart((c) => c.filter((i) => i.productId !== id));

  const total = cart.reduce((a, i) => a + i.precio * i.cantidad, 0);

  const confirm = () => {
    if (!vendedor) return toast.error("Seleccioná una vendedora");
    if (cart.length === 0) return toast.error("Agregá productos");

    addSale({
      items: cart,
      vendedor,
      metodoPago: metodo,
      total,
    });

    cart.forEach((i) => {
      const p = products.find((x) => x.id === i.productId);
      if (!p) return;

      const { id, ...rest } = p;

      updateProduct(id, {
        ...rest,
        stock: Math.max(0, p.stock - i.cantidad),
      });
    });

    toast.success("Venta registrada");
    nav("/sales");
  };

  return (
    <Grid container spacing={3} maxWidth="xl">

      {/* LEFT SIDE - PRODUCTS */}
      <Grid item xs={12} md={8}>
        <Stack spacing={2}>

          <Box>
            <Typography variant="h4" fontWeight={600}>
              Nueva venta
            </Typography>
            <Typography color="text.secondary">
              Buscá productos y armá el ticket
            </Typography>
          </Box>

          <Card sx={{ p: 2 }}>

            {/* SEARCH */}
            <TextField
              fullWidth
              placeholder="Buscar producto..."
              value={q}
              onChange={(e) => setQ(e.target.value)}
              InputProps={{
                startAdornment: <Search sx={{ mr: 1 }} />,
              }}
            />

            {/* CATEGORIES */}
            <Stack direction="row" spacing={1} sx={{ mt: 2, flexWrap: "wrap" }}>
              <Button
                variant={cat === "all" ? "contained" : "outlined"}
                onClick={() => setCat("all")}
              >
                Todas
              </Button>

              {categories.map((c) => (
                <Button
                  key={c}
                  variant={cat === c ? "contained" : "outlined"}
                  onClick={() => setCat(c)}
                >
                  {c}
                </Button>
              ))}
            </Stack>

            {/* PRODUCTS */}
            <Grid container spacing={1} sx={{ mt: 2 }}>
              {filtered.map((p) => (
                <Grid item xs={12} sm={6} key={p.id}>
                  <Paper
                    onClick={() => addToCart(p.id)}
                    sx={{
                      p: 1.5,
                      display: "flex",
                      alignItems: "center",
                      gap: 2,
                      cursor: "pointer",
                      "&:hover": {
                        bgcolor: "action.hover",
                      },
                    }}
                  >
                    <Avatar
                      variant="rounded"
                      src={p.url_imagen}
                    >
                      <Inventory2 />
                    </Avatar>

                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Typography noWrap fontWeight={600}>
                        {p.nombre}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        ${p.precio.toFixed(2)} / {p.unidad} · stock {p.stock}
                      </Typography>
                    </Box>

                    <Add color="primary" />
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </Card>
        </Stack>
      </Grid>

      {/* RIGHT SIDE - CART */}
      <Grid item xs={12} md={4}>
        <Card sx={{ p: 2, position: "sticky", top: 80 }}>

          <Typography variant="h6" fontWeight={600}>
            Ticket
          </Typography>

          <Divider sx={{ my: 2 }} />

          <Stack spacing={1} sx={{ maxHeight: 300, overflowY: "auto" }}>
            {cart.length === 0 && (
              <Typography color="text.secondary" textAlign="center">
                Carrito vacío
              </Typography>
            )}

            {cart.map((i) => (
              <Box
                key={i.productId}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  py: 1,
                  borderBottom: "1px solid",
                  borderColor: "divider",
                }}
              >
                <Box sx={{ flex: 1 }}>
                  <Typography noWrap fontWeight={500}>
                    {i.nombre}
                  </Typography>
                  <Typography variant="caption">
                    ${i.precio.toFixed(2)} × {i.cantidad}
                  </Typography>
                </Box>

                <IconButton onClick={() => updateQty(i.productId, -1)}>
                  <Remove fontSize="small" />
                </IconButton>

                <Typography width={20} textAlign="center">
                  {i.cantidad}
                </Typography>

                <IconButton onClick={() => updateQty(i.productId, 1)}>
                  <Add fontSize="small" />
                </IconButton>

                <IconButton onClick={() => removeItem(i.productId)}>
                  <Delete fontSize="small" color="error" />
                </IconButton>
              </Box>
            ))}
          </Stack>

          <Divider sx={{ my: 2 }} />

          {/* FORM */}
          <Stack spacing={2}>

            <FormControl fullWidth>
              <InputLabel>Vendedora</InputLabel>
              <Select
                value={vendedor}
                label="Vendedora"
                onChange={(e) => setVendedor(e.target.value)}
              >
                {vendedores.map((v) => (
                  <MenuItem key={v} value={v}>
                    {v}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth>
              <InputLabel>Método</InputLabel>
              <Select
                value={metodo}
                label="Método"
                onChange={(e) =>
                  setMetodo(e.target.value as PaymentMethod)
                }
              >
                {PAYMENT_METHODS.map((m) => (
                  <MenuItem key={m} value={m}>
                    {m}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                pt: 1,
              }}
            >
              <Typography color="text.secondary">
                Total
              </Typography>

              <Typography variant="h5" color="primary" fontWeight={700}>
                ${total.toFixed(2)}
              </Typography>
            </Box>

            <Button
              variant="contained"
              size="large"
              fullWidth
              onClick={confirm}
            >
              Confirmar venta
            </Button>

          </Stack>
        </Card>
      </Grid>
    </Grid>
  );
}