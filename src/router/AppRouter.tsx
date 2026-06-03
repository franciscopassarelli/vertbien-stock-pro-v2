// src/router/AppRouter.tsx
import { Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import { LoginForm as Login } from "../pages/Login";
import {Dashboard} from "../pages/Dashboard";
import {Categories} from "../pages/Categories";
import {SalesPage} from "../pages/Sales";
// Importamos con llaves porque son exportaciones nombradas
import { ProductsPage } from "../pages/Products";
import { SettingsPage } from "../pages/Settings";
import {NewSale} from "../pages/Sales.new";

export default function AppRouter() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<Navigate to="/login" />} />

      <Route element={<MainLayout />}>
        <Route path="/dashboard" element={<Dashboard />} />
        {/* Aquí usamos los componentes directamente */}
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/categories" element={<Categories />} />
        <Route path="/sales" element={<SalesPage />} />
        <Route path="/new-sale" element={<NewSale />} />
        <Route path="/settings" element={<SettingsPage />} />
      </Route>
    </Routes>
  );
}