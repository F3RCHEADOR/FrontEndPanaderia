import React from "react";
import Footer from "../components/Modules/Footer";
import { Outlet } from "react-router-dom"; // Importamos el Outlet

const MainLayout = () => {
  return (
    <>
      <main>
        <div className="flex flex-row">
          {/* Aquí puedes agregar un sidebar, navbar, etc. */}
        </div>
        <div className="select-none">
          <Outlet /> {/* Aquí se renderizará el contenido de las rutas hijas */}
        </div>
      </main>
      <div className="relative z-50 mt-8">
        <Footer />
      </div>
    </>
  );
};

export default MainLayout;
