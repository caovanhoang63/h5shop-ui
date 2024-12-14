import { BrowserRouter, Route, Routes } from "react-router-dom";
import { LoginPage } from "@/pages/login/LoginPage.tsx";
import RootLayout from "@/layouts/RootLayout.tsx";
import { NotFoundPage } from "@/pages/NotFoundPage.tsx";
import { ErrorPage } from "@/pages/ErrorPage.tsx";
import { DashBoardPage } from "@/pages/dashboard/DashBoardPage.tsx";
import ProductPage from "@/pages/product/ProductPage.tsx";
import SalePage from "@/pages/sale/SalePage.tsx";

export const MainRoute = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="login" element={<LoginPage />} />
        <Route path="/" element={<RootLayout />}>
          <Route index element={<DashBoardPage />} />
          <Route path={"product"} element={<ProductPage />} />
        </Route>
        <Route path="/sale" element={<SalePage />} />
        <Route path="/error" element={<ErrorPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
};
