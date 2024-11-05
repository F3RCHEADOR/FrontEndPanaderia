import React from "react";
import Footer from "../components/Modules/Footer";

const MainLayout = ({
  children
}) => {
  return (
    <>
      <main>
        <div className="flex flex-row">

        </div>
        <div className="select-none">{children}</div>
      </main>
      <div className="relative z-50 mt-8">
      <Footer />
      </div>
     
    </>
  )
}

export default MainLayout;