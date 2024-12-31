import { Route, Routes, useNavigate } from "react-router-dom";
import RootLayout from "@/layouts/RootLayout.tsx";
import { NotFoundPage } from "@/pages/NotFoundPage.tsx";
import { ErrorPage } from "@/pages/ErrorPage.tsx";
import { DashBoardPage } from "@/pages/dashboard/DashBoardPage.tsx";
import ProductPage from "@/pages/product/ProductPage.tsx";
import { InventoryPage } from "@/pages/inventory/InventoryPage.tsx";
import InventoryCheckPage from "@/pages/inventory/stockTakes/StockTakesPage.tsx";
import PartnerPage from "@/pages/partner/PartnerPage.tsx";
import SalePage from "@/pages/sale/SalePage.tsx";

import { StockInPage } from "@/pages/inventory/stockIn/StockInPage.tsx";
import StockInAddPage from "@/pages/inventory/stockIn/StockInAddPage.tsx";

import LoginPage from "@/pages/login/LoginPage.tsx";
import { useEffect } from "react";


export const MainRoute = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    }
  }, [navigate]);
  return (

    <BrowserRouter>
      <Routes>
        <Route path="login" element={<LoginPage />} />
        <Route path="/" element={<RootLayout />}>
          <Route index element={<DashBoardPage />} />
          <Route path={"product"} element={<ProductPage />} />
          <Route path={"inventory"} element={<InventoryPage />} />
          <Route path={"stock-takes"} element={<InventoryCheckPage />} />
          <Route path={"partner"} element={<PartnerPage />} />
          <Route path={"stock-in"} element={<StockInPage />} />
          <Route path={"stock-in/new"} element={<StockInAddPage />} />
        </Route>
        <Route path="/sale" element={<SalePage />} />
        <Route path="/error" element={<ErrorPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>

    <Routes>
      <Route path="login" element={<LoginPage />} />
      <Route path="/" element={<RootLayout />}>
        <Route index element={<DashBoardPage />} />
        <Route path={"product"} element={<ProductPage />} />
        <Route path={"inventory"} element={<InventoryPage />} />
        <Route path={"stock-takes"} element={<InventoryCheckPage />} />
        <Route path={"partner"} element={<PartnerPage />} />
        <Route path={"stock-in"} element={<StockInPage />} />
          <Route path={"stock-in/new"} element={<StockInAddPage />} />
      </Route>
      <Route path="/sale" element={<SalePage />} />
      <Route path="/error" element={<ErrorPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>

  );
};
