import { useState } from "react";
import { 
  Box, Typography, Button, TextField, Table, TableBody, TableCell, 
  TableContainer, TableHead, TableRow, Paper, Badge, IconButton, Avatar 
} from "@mui/material";
import { Add, Edit, Delete, Inventory } from "@mui/icons-material";
import { useStore, Product, getStockState } from "../lib/store"; // Asegúrate de esta ruta
import { ProductModal } from "../components/ProductModal"; // Asegúrate de esta ruta
import { toast } from "sonner";
import {ConfirmDialog} from "../components/ConfirmDialog";

export function ProductsPage() {
  const { products, deleteProduct } = useStore();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [q, setQ] = useState("");

  const filtered = products.filter((p) =>
    p.nombre.toLowerCase().includes(q.toLowerCase()) || p.categoria.toLowerCase().includes(q.toLowerCase())
  );

  const [productToDelete, setProductToDelete] = useState<Product | null>(null);

  return (
    <Box sx={{ maxWidth: 1200, mx: "auto", p: 3 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 4 }}>
        <Box>
          <Typography variant="h4" fontWeight="600">Productos</Typography>
          <Typography color="text.secondary">{products.length} productos en el sistema</Typography>
        </Box>
        <Button variant="contained" startIcon={<Add />} onClick={() => { setEditing(null); setOpen(true); }}>
          Nuevo producto
        </Button>
      </Box>

      <Paper sx={{ p: 2, mb: 3 }}>
        <TextField 
          fullWidth placeholder="Buscar por nombre o categoría..." 
          value={q} onChange={(e) => setQ(e.target.value)}
          sx={{ mb: 2 }} size="small"
        />
        
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Imagen</TableCell>
                <TableCell>Nombre</TableCell>
                <TableCell>Categoría</TableCell>
                <TableCell>Unidad</TableCell>
                <TableCell align="right">Precio</TableCell>
                <TableCell align="right">Stock</TableCell>
                <TableCell align="right">Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
  {filtered.map((p) => {
    const st = getStockState(p);

    const stockColor =
      st === "critical"
        ? "error"
        : st === "low"
        ? "warning"
        : "default";

    return (
      <TableRow key={p.id} hover>
        {/* IMAGEN */}
        <TableCell>
          <Avatar
            src={p.url_imagen || undefined}
            variant="rounded"
            sx={{ width: 40, height: 40, bgcolor: "background.default" }}
          >
            <Inventory fontSize="small" />
          </Avatar>
        </TableCell>

        {/* NOMBRE */}
        <TableCell sx={{ fontWeight: 600 }}>
          {p.nombre}
        </TableCell>

        {/* CATEGORÍA */}
        <TableCell>
          <Badge color="primary" badgeContent={p.categoria} />
        </TableCell>

        {/* UNIDAD */}
        <TableCell>{p.unidad}</TableCell>

        {/* PRECIO */}
        <TableCell align="right">
          ${p.precio.toFixed(2)}
        </TableCell>

        {/* STOCK */}
        <TableCell align="right">
          <Badge
            color={stockColor}
            variant="standard"
            sx={{
              px: 1.5,
              py: 0.5,
              borderRadius: 1,
              fontSize: 12,
            }}
          >
            {p.stock} {p.unidad}
          </Badge>
        </TableCell>

        {/* ACCIONES */}
        <TableCell align="right">
          <IconButton
            onClick={() => {
              setEditing(p);
              setOpen(true);
            }}
          >
            <Edit />
          </IconButton>

          <IconButton
            color="error"
            onClick={() => {
              setProductToDelete(p);
            }}
          >
            <Delete />
          </IconButton>
        </TableCell>
      </TableRow>
    );
  })}

  {/* EMPTY STATE */}
  {filtered.length === 0 && (
    <TableRow>
      <TableCell colSpan={7} align="center" sx={{ py: 6 }}>
        <Box sx={{ opacity: 0.6 }}>
          <Inventory />
          <Typography sx={{ mt: 1 }}>
            No hay productos
          </Typography>
        </Box>
      </TableCell>
    </TableRow>
  )}
</TableBody>
          </Table>
        </TableContainer>
      </Paper>
      <ProductModal open={open} onOpenChange={setOpen} editing={editing} />

    <ConfirmDialog
      open={!!productToDelete}
      title="Eliminar producto"
      description={`¿Eliminar el producto "${productToDelete?.nombre}"? Esta acción no se puede deshacer.`}
      onClose={() => setProductToDelete(null)}
      onConfirm={() => {
        if (productToDelete) {
          deleteProduct(productToDelete.id);
          toast.success("Producto eliminado");
        }
        setProductToDelete(null); 
      }}
      />

      </Box>

  );
}