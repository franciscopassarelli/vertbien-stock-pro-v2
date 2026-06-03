import { useMemo, useState } from "react";
import {
  Box,
  Card,
  Typography,
  Grid,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Stack,
  Chip,
} from "@mui/material";


import {
  Visibility,
} from "@mui/icons-material";

import { useStore, getStockState, PAYMENT_METHODS, Sale } from "../lib/store";
import { SaleDetailModal } from "../components/SalesDetailModal";

type Range = "day" | "week" | "month" | "all";

export function Dashboard() {
  const { products, sales } = useStore();


  const [range, setRange] = useState<Range>("day");

  const [stockOpen, setStockOpen] = useState(false);
  const [selected, setSelected] = useState<Sale | null>(null);

  const filtered = useMemo(() => {
    let list = sales;

    if (range !== "all") {
      const now = new Date();
      const start = new Date(now);

      if (range === "day") start.setHours(0, 0, 0, 0);
      if (range === "week") start.setDate(now.getDate() - 7);
      if (range === "month") start.setMonth(now.getMonth() - 1);

      list = list.filter((s) => new Date(s.fecha) >= start);
    }

    return list;
  }, [sales, range]);
  const total = filtered.reduce((a, s) => a + s.total, 0);
  const ticketAvg = filtered.length ? total / filtered.length : 0;

  const lowProducts = products.filter(
    (p) => getStockState(p) !== "ok"
  );

  const byVendor = useMemo(() => {
    const map = new Map<string, { count: number; total: number }>();

    filtered.forEach((s) => {
      const e = map.get(s.vendedor) || { count: 0, total: 0 };
      e.count++;
      e.total += s.total;
      map.set(s.vendedor, e);
    });

    return Array.from(map.entries());
  }, [filtered]);

  const byMethod = useMemo(() => {
    const map = new Map<string, { count: number; total: number }>();

    PAYMENT_METHODS.forEach((m) =>
      map.set(m, { count: 0, total: 0 })
    );

    filtered.forEach((s) => {
      const e = map.get(s.metodoPago) || { count: 0, total: 0 };
      e.count++;
      e.total += s.total;
      map.set(s.metodoPago, e);
    });

    return Array.from(map.entries()).filter(([, v]) => v.count > 0);
  }, [filtered]);

  const topProducts = useMemo(() => {
    const map = new Map<string, number>();

    filtered.forEach((s) => {
      s.items.forEach((i) => {
        map.set(i.nombre, (map.get(i.nombre) || 0) + i.cantidad);
      });
    });

    return Array.from(map.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);
  }, [filtered]);

  const ranges = [
    { k: "day", label: "Día" },
    { k: "week", label: "Semana" },
    { k: "month", label: "Mes" },
    { k: "all", label: "Todo" },
  ] as const;

  const rangeLabel =
    range === "day"
      ? "hoy"
      : range === "week"
      ? "últ. 7 días"
      : range === "month"
      ? "últ. 30 días"
      : "total";

  return (
    <Stack spacing={3}>

      {/* HEADER */}
      <Box>
        <Typography variant="h4" fontWeight={600}>
          Dashboard
        </Typography>
        <Typography color="text.secondary">
          Resumen general del negocio
        </Typography>
      </Box>

      {/* FILTERS */}
      <Stack direction="row" spacing={1} flexWrap="wrap">
        {ranges.map((r) => (
          <Button
            key={r.k}
            variant={range === r.k ? "contained" : "outlined"}
            onClick={() => setRange(r.k)}
          >
            {r.label}
          </Button>
        ))}
      </Stack>

      {/* KPI CARDS */}
      <Grid container spacing={2}>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ p: 2 }}>
            <Typography variant="caption" color="text.secondary">
              Vendido {rangeLabel}
            </Typography>
            <Typography variant="h5" fontWeight={700}>
              ${total.toFixed(2)}
            </Typography>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ p: 2 }}>
            <Typography variant="caption" color="text.secondary">
              Ticket promedio
            </Typography>
            <Typography variant="h5">
              ${ticketAvg.toFixed(2)}
            </Typography>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ p: 2 }}>
            <Typography variant="caption" color="text.secondary">
              Productos activos
            </Typography>
            <Typography variant="h5">
              {products.length}
            </Typography>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card
            sx={{ p: 2, cursor: "pointer" }}
            onClick={() => setStockOpen(true)}
          >
            <Typography variant="caption" color="text.secondary">
              Stock bajo
            </Typography>
            <Typography variant="h5" color="warning.main">
              {lowProducts.length}
            </Typography>
            <Button size="small">Ver detalles</Button>
          </Card>
        </Grid>

      </Grid>

      {/* TABLES GRID */}
      <Grid container spacing={2}>

        {/* BY VENDOR */}
        <Grid item xs={12} md={4}>
          <Card sx={{ p: 2 }}>
            <Typography fontWeight={600} mb={2}>
              Ventas por vendedor
            </Typography>

            {byVendor.map(([name, v]) => (
              <Box
                key={name}
                display="flex"
                justifyContent="space-between"
                py={1}
              >
                <Box>
                  <Typography>{name}</Typography>
                  <Typography variant="caption">
                    {v.count} ventas
                  </Typography>
                </Box>
                <Typography fontWeight={600} color="primary.main">
                  ${v.total.toFixed(2)}
                </Typography>
              </Box>
            ))}
          </Card>
        </Grid>

        {/* TOP PRODUCTS */}
        <Grid item xs={12} md={4}>
          <Card sx={{ p: 2 }}>
            <Typography fontWeight={600} mb={2}>
              Top productos
            </Typography>

            {topProducts.map(([name, count]) => (
              <Box
                key={name}
                display="flex"
                justifyContent="space-between"
                py={1}
              >
                <Typography noWrap>{name}</Typography>
                <Chip label={`${count} vendidas`} size="small" />
              </Box>
            ))}
          </Card>
        </Grid>

        {/* PAYMENT METHODS */}
        <Grid item xs={12} md={4}>
          <Card sx={{ p: 2 }}>
            <Typography fontWeight={600} mb={2}>
              Métodos de pago
            </Typography>

            {byMethod.map(([m, v]) => (
              <Box
                key={m}
                display="flex"
                justifyContent="space-between"
                py={1}
              >
                <Chip label={m} size="small" />
                <Typography fontWeight={600}>
                  ${v.total.toFixed(2)}
                </Typography>
              </Box>
            ))}
          </Card>
        </Grid>
      </Grid>

      {/* LAST SALES */}
      <Card sx={{ p: 2 }}>
        <Typography fontWeight={600} mb={2}>
          Últimas ventas
        </Typography>

        {filtered.slice(0, 6).map((s) => (
          <Box
            key={s.id}
            display="flex"
            justifyContent="space-between"
            py={1}
          >
            <Box>
              <Typography fontWeight={500}>
                {s.vendedor} · {s.items.length} items
              </Typography>
              <Typography variant="caption">
                {new Date(s.fecha).toLocaleString()}
              </Typography>
            </Box>

            <Stack direction="row" spacing={1} alignItems="center">
              <Typography fontWeight={600} color="primary">
                ${s.total.toFixed(2)}
              </Typography>

              <Button
                size="small"
                onClick={() => setSelected(s)}
              >
                <Visibility fontSize="small" />
              </Button>
            </Stack>
          </Box>
        ))}
      </Card>

      {/* STOCK MODAL */}
      <Dialog open={stockOpen} onClose={() => setStockOpen(false)} fullWidth>
        <DialogTitle>Stock bajo o crítico</DialogTitle>

        <DialogContent>
          {lowProducts.map((p) => (
            <Box
              key={p.id}
              display="flex"
              justifyContent="space-between"
              py={1}
            >
              <Typography>{p.nombre}</Typography>
              <Chip
                label={`${p.stock} ${p.unidad}`}
                color={
                  getStockState(p) === "critical"
                    ? "error"
                    : "warning"
                }
              />
            </Box>
          ))}
        </DialogContent>
      </Dialog>

      <SaleDetailModal
        sale={selected}
        onOpenChange={(o) => !o && setSelected(null)}
      />
    </Stack>
  );
}