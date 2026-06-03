import { useState } from "react";
import { Link, useLocation, useNavigate, Outlet } from "react-router-dom";
import {
  Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText,
  Toolbar, Box, Typography, Divider, IconButton, useTheme, CssBaseline
} from "@mui/material";
import {
  Dashboard, Inventory, Category, ShoppingCart, Add, Settings,
  Logout, Spa, ChevronLeft, ChevronRight
} from "@mui/icons-material";

const drawerWidth = 240;
const collapsedWidth = 72;

const items = [
  { title: "Dashboard", url: "/dashboard", icon: <Dashboard /> },
  { title: "Productos", url: "/products", icon: <Inventory /> },
  { title: "Categorías", url: "/categories", icon: <Category /> },
  { title: "Ventas", url: "/sales", icon: <ShoppingCart /> },
  { title: "Nueva Venta", url: "/new-sale", icon: <Add /> },
  { title: "Configuración", url: "/settings", icon: <Settings /> },
];

export default function MainLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const theme = useTheme();

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      
      {/* Barra Lateral */}
      <Drawer
        variant="permanent"
        sx={{
          width: collapsed ? collapsedWidth : drawerWidth,
          flexShrink: 0,
          transition: theme.transitions.create("width", {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
          }),
          [`& .MuiDrawer-paper`]: {
            width: collapsed ? collapsedWidth : drawerWidth,
            transition: theme.transitions.create("width", {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.enteringScreen,
            }),
            overflowX: "hidden",
          },
        }}
      >
        <Toolbar sx={{ display: "flex", alignItems: "center", justifyContent: collapsed ? "center" : "space-between", px: 2 }}>
          {!collapsed && (
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Box sx={{ p: 1, borderRadius: 2, background: "linear-gradient(135deg, #1e4620 0%, #4caf50 100%)", color: "white" }}>
                <Spa fontSize="small" />
              </Box>
              <Box>
                <Typography variant="subtitle2" sx={{ fontWeight: 700, lineHeight: 1 }}>VertBien</Typography>
                <Typography variant="caption" color="text.secondary">Stock & Ventas</Typography>
              </Box>
            </Box>
          )}
          <IconButton onClick={() => setCollapsed(!collapsed)}>
            {collapsed ? <ChevronRight /> : <ChevronLeft />}
          </IconButton>
        </Toolbar>

        <Divider />

        <List sx={{ flexGrow: 1 }}>
          {items.map((item) => {
            const isActive = location.pathname === item.url;
            return (
              <ListItem key={item.url} disablePadding sx={{ display: "block" }}>
                <ListItemButton
                  component={Link}
                  to={item.url}
                  sx={{ minHeight: 48, justifyContent: collapsed ? "center" : "initial", px: 2.5 }}
                  selected={isActive}
                >
                  <ListItemIcon sx={{ minWidth: 0, mr: collapsed ? 0 : 3, justifyContent: "center" }}>
                    {item.icon}
                  </ListItemIcon>
                  {!collapsed && <ListItemText primary={item.title} />}
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>

        <Divider />

        <List>
          <ListItem disablePadding sx={{ display: "block" }}>
            <ListItemButton onClick={() => navigate("/login")} sx={{ minHeight: 48, justifyContent: collapsed ? "center" : "initial", px: 2.5 }}>
              <ListItemIcon sx={{ minWidth: 0, mr: collapsed ? 0 : 3, justifyContent: "center" }}>
                <Logout />
              </ListItemIcon>
              {!collapsed && <ListItemText primary="Salir" />}
            </ListItemButton>
          </ListItem>
        </List>
      </Drawer>

      {/* Contenedor Principal */}
      <Box 
        component="main" 
        sx={{ 
          flexGrow: 1, 
          p: 3, 
          bgcolor: "background.default", 
          height: "100vh", 
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
          alignItems: "center"
        }}
      >
        <Box sx={{ width: "100%", maxWidth: 1200 }}>
          <Toolbar /> 
          <Outlet />
        </Box>
      </Box>
    </Box> // <--- ESTE ES EL CIERRE DEL BOX PRINCIPAL (el del display flex)
  );
}