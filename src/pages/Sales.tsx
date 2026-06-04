import { useMemo, useState } from "react";
import {
  Box,
  Typography,
  Card,
  Button,
  Grid,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
} from "@mui/material";

import {
  TrendingUp,
  ShoppingCart,
  Visibility,
  Add,
} from "@mui/icons-material";

import { useStore, Sale, PAYMENT_METHODS } from "../lib/store";
import { useSettings } from "../lib/settings";
import { SaleDetailModal } from "@/components/SalesDetailModal";

export function SalesPage() {
  const { sales } = useStore();
  const { vendedores } = useSettings();

  const [range, setRange] = useState<"day" | "week" | "month" | "all">("day");
  const [vendor, setVendor] = useState("all");
  const [method, setMethod] = useState("all");
  const [selected, setSelected] = useState<Sale | null>(null);

  const ranges = [
    { k: "day", label: "Día" },
    { k: "week", label: "Semana" },
    { k: "month", label: "Mes" },
    { k: "all", label: "Todo" },
  ] as const;

  const filteredSales = useMemo(() => {
    
    let list = sales;

    if (range !== "all") {
      const now = new Date();
      const start = new Date(now);

      if (range === "day") start.setHours(0, 0, 0, 0);
      if (range === "week") start.setDate(now.getDate() - 7);
      if (range === "month") start.setMonth(now.getMonth() - 1);

      list = list.filter((s) => new Date(s.fecha) >= start);
    }

    if (vendor !== "all") list = list.filter((s) => s.vendedor === vendor);
    if (method !== "all") list = list.filter((s) => s.metodoPago === method);

    return list;
  }, [sales, range, vendor, method]);

  console.log("SALES", sales);

  const totalRange = filteredSales.reduce((a, s) => a + s.total, 0);
  const ticketAvg = filteredSales.length
    ? totalRange / filteredSales.length
    : 0;

  const rangeLabel =
    range === "day"
      ? "hoy"
      : range === "week"
      ? "últ. 7 días"
      : range === "month"
      ? "últ. 30 días"
      : "total";

  return (
    <Box sx={{ maxWidth: 1200, mx: "auto", p: 3 }}>

      {/* HEADER */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" fontWeight={600}>
          Ventas
        </Typography>
        <Typography color="text.secondary">
          Historial completo de operaciones
        </Typography>
      </Box>

      {/* ACTION BAR */}
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          gap: 2,
          mb: 3,
          alignItems: "center",
        }}
      >
        {ranges.map((r) => (
          <Button
            key={r.k}
            variant={range === r.k ? "contained" : "outlined"}
            size="small"
            onClick={() => setRange(r.k)}
          >
            {r.label}
          </Button>
        ))}

        <Box sx={{ flexGrow: 1 }} />

        {/* VENDEDOR */}
        <FormControl size="small" sx={{ minWidth: 160 }}>
          <InputLabel>Vendedor</InputLabel>
          <Select
            value={vendor}
            label="Vendedor"
            onChange={(e) => setVendor(e.target.value)}
          >
            <MenuItem value="all">Todos</MenuItem>
            {vendedores.map((v) => (
              <MenuItem key={v} value={v}>
                {v}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* MÉTODO */}
        <FormControl size="small" sx={{ minWidth: 160 }}>
          <InputLabel>Método</InputLabel>
          <Select
            value={method}
            label="Método"
            onChange={(e) => setMethod(e.target.value)}
          >
            <MenuItem value="all">Todos</MenuItem>
            {PAYMENT_METHODS.map((m) => (
              <MenuItem key={m} value={m}>
                {m}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => (window.location.href = "/new-sale")}
        >
          Nueva venta
        </Button>
      </Box>

      {/* STATS */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} md={4}>
          <Card sx={{ p: 2 }}>
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Total {rangeLabel}
                </Typography>
                <Typography variant="h5" fontWeight={600}>
                  ${totalRange.toFixed(2)}
                </Typography>
              </Box>
              <TrendingUp />
            </Box>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={{ p: 2 }}>
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Ticket promedio
                </Typography>
                <Typography variant="h5" fontWeight={600}>
                  ${ticketAvg.toFixed(2)}
                </Typography>
              </Box>
              <ShoppingCart />
            </Box>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={{ p: 2 }}>
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Ventas {rangeLabel}
                </Typography>
                <Typography variant="h5" fontWeight={600}>
                  {filteredSales.length}
                </Typography>
              </Box>
              <ShoppingCart />
            </Box>
          </Card>
        </Grid>
      </Grid>

      {/* TABLE */}
      <Card>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Fecha</TableCell>
                <TableCell>Productos</TableCell>
                <TableCell>Vendedor</TableCell>
                <TableCell>Método</TableCell>
                <TableCell align="right">Total</TableCell>
                <TableCell align="right">Acciones</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {filteredSales.map((s) => (
                <TableRow key={s.id} hover>
                  <TableCell sx={{ fontFamily: "monospace", fontSize: 12 }}>
                    {String(s.id).slice(0, 8)}
                  </TableCell>

                  <TableCell>
                    {s.fecha
                      ? new Date(s.fecha).toLocaleString()
                      : "sin fecha"}
                  </TableCell>

                  <TableCell>{s.items.length} items</TableCell>

                  <TableCell>{s.vendedor}</TableCell>

                  <TableCell>
                    <Chip
                      label={s.metodoPago}
                      size="small"
                      variant="outlined"
                    />
                  </TableCell>

                  <TableCell align="right" sx={{ fontWeight: 600 }}>
                    ${s.total.toFixed(2)}
                  </TableCell>

                  <TableCell align="right">
                    <IconButton onClick={() => setSelected(s)}>
                      <Visibility />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}

              {filteredSales.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 5 }}>
                    <Typography color="text.secondary">
                      No hay ventas en este rango
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>

      <SaleDetailModal
        sale={selected}
        onOpenChange={(o) => !o && setSelected(null)}
      />
    </Box>
  );
}