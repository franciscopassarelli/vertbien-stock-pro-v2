import {
  Dialog,
  DialogTitle,
  DialogContent,
  Box,
  Typography,
  Grid,
  Paper,
  Chip,
  Divider,
  Stack,
} from "@mui/material";

import {
  CalendarMonth,
  CreditCard,
  Person,
} from "@mui/icons-material";

import { Sale, useStore } from "../lib/store";

interface Props {
  sale: Sale | null;
  onOpenChange: (v: boolean) => void;
}

export function SaleDetailModal({ sale, onOpenChange }: Props) {
  const { products } = useStore();

  return (
    <Dialog
      open={!!sale}
      onClose={() => onOpenChange(false)}
      fullWidth
      maxWidth="md"
    >
      <DialogTitle>
        Detalle de venta
      </DialogTitle>

      <DialogContent dividers>
        {sale && (
          <Stack spacing={3}>

            {/* INFO HEADER */}
            <Grid container spacing={2}>
              <Grid item xs={12} md={4}>
                <Paper sx={{ p: 2 }}>
                  <Box sx={{ display: "flex", gap: 1.5 }}>
                    <CalendarMonth color="primary" />
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        Fecha
                      </Typography>
                      <Typography variant="body2" fontWeight={500}>
                        {new Date(sale.fecha).toLocaleString()}
                      </Typography>
                    </Box>
                  </Box>
                </Paper>
              </Grid>

              <Grid item xs={12} md={4}>
                <Paper sx={{ p: 2 }}>
                  <Box sx={{ display: "flex", gap: 1.5 }}>
                    <Person color="primary" />
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        Vendedor
                      </Typography>
                      <Typography variant="body2" fontWeight={500}>
                        {sale.vendedor}
                      </Typography>
                    </Box>
                  </Box>
                </Paper>
              </Grid>

              <Grid item xs={12} md={4}>
                <Paper sx={{ p: 2 }}>
                  <Box sx={{ display: "flex", gap: 1.5 }}>
                    <CreditCard color="primary" />
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        Método de pago
                      </Typography>
                      <Typography variant="body2" fontWeight={500}>
                        {sale.metodoPago}
                      </Typography>
                    </Box>
                  </Box>
                </Paper>
              </Grid>
            </Grid>

            {/* ITEMS HEADER */}
            <Box>
              <Typography variant="subtitle1" fontWeight={600} mb={1}>
                Productos
              </Typography>

              <Paper variant="outlined">
                {/* HEADER */}
                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: "2fr 1fr 1fr",
                    px: 2,
                    py: 1,
                    bgcolor: "action.hover",
                  }}
                >
                  <Typography variant="caption">Producto</Typography>
                  <Typography variant="caption" textAlign="right">
                    Cantidad
                  </Typography>
                  <Typography variant="caption" textAlign="right">
                    Subtotal
                  </Typography>
                </Box>

                {/* ITEMS */}
                {sale.items.map((i) => {
                  const p = products.find((x) => x.id === i.productId);

                  return (
                    <Box
                      key={i.productId}
                      sx={{
                        display: "grid",
                        gridTemplateColumns: "2fr 1fr 1fr",
                        px: 2,
                        py: 1.5,
                        borderTop: "1px solid",
                        borderColor: "divider",
                      }}
                    >
                      {/* PRODUCTO */}
                      <Box>
                        <Typography fontWeight={600} noWrap>
                          {i.nombre}
                        </Typography>

                        <Typography
                          variant="caption"
                          color="text.secondary"
                        >
                          ${i.precio.toFixed(2)} / {p?.unidad ?? "unidad"}
                        </Typography>
                      </Box>

                      {/* CANTIDAD */}
                      <Box textAlign="right">
                        <Chip
                          label={i.cantidad}
                          size="small"
                        />
                      </Box>

                      {/* SUBTOTAL */}
                      <Typography
                        textAlign="right"
                        fontWeight={600}
                      >
                        ${(i.cantidad * i.precio).toFixed(2)}
                      </Typography>
                    </Box>
                  );
                })}
              </Paper>
            </Box>

            <Divider />

            {/* TOTAL */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Typography color="text.secondary">
                Total final
              </Typography>

              <Typography
                variant="h5"
                fontWeight={700}
                color="primary"
              >
                ${sale.total.toFixed(2)}
              </Typography>
            </Box>
          </Stack>
        )}
      </DialogContent>
    </Dialog>
  );
}