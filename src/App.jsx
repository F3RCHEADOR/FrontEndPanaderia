import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "./layout/MainLayout";
import Second from "./pages/second.jsx";
import Home from "./pages/home.jsx";
import AddClient from "./pages/AddClient.jsx";
import Inventories from "./pages/Inventories.jsx";
import PaidPage from "./pages/PaidPage.jsx";
import ContadorBilletes from "./pages/ContadorBilletes.jsx";
import Ventas from "./pages/Ventas.jsx";
import Informes from "./pages/Informes.jsx";
import MenuVentas from "./pages/MenuVentas.jsx";
import Login from "./pages/Login.jsx";
import ConfigurationPage from "./pages/ConfigurationPage.jsx";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import ProtectedRoute from "./components/ProtectedRoute"; // Importa el componente

function App() {
  return (
    <DndProvider backend={HTML5Backend}>
      {/* Rutas públicas */}
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Navigate to="/login" />} /> {/* Redirige a /login */}
      </Routes>

      {/* Rutas protegidas que requieren MainLayout */}
      <Routes>
        <Route element={<MainLayout />}>
          <Route
            path="/second"
            element={
              <ProtectedRoute>
                <Second />
              </ProtectedRoute>
            }
          />
          <Route
            path="/home"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />
          <Route
            path="/AddClient"
            element={
              <ProtectedRoute>
                <AddClient />
              </ProtectedRoute>
            }
          />
          <Route
            path="/Inventories"
            element={
              <ProtectedRoute>
                <Inventories />
              </ProtectedRoute>
            }
          />
          <Route
            path="/PaidPage"
            element={
              <ProtectedRoute>
                <PaidPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/ContadorBilletes"
            element={
              <ProtectedRoute>
                <ContadorBilletes />
              </ProtectedRoute>
            }
          />
          <Route
            path="/Ventas"
            element={
              <ProtectedRoute>
                <Ventas />
              </ProtectedRoute>
            }
          />
          <Route
            path="/Informes"
            element={
              <ProtectedRoute>
                <Informes />
              </ProtectedRoute>
            }
          />
          <Route
            path="/MenuVentas"
            element={
              <ProtectedRoute>
                <MenuVentas />
              </ProtectedRoute>
            }
          />
          <Route
            path="/Configuration"
            element={
              <ProtectedRoute>
                <ConfigurationPage />
              </ProtectedRoute>
            }
          />
        </Route>
      </Routes>
    </DndProvider>
  );
}

export default App;
