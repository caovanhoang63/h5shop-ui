import { Route, Routes } from "react-router-dom";
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
import { EmployeePage } from "@/pages/employee/EmployeePage.tsx";
import { SettingPage } from "@/pages/setting/SettingPage.tsx";
import { StockOutPage } from "@/pages/inventory/stockOut/StockOutPage.tsx";
import { ReportPage } from "@/pages/report/ReportPage.tsx";

import StockOutAddPage from "@/pages/inventory/stockOut/StockOutAddPage.tsx";

import WarrantyPage from "@/pages/warranty/WarrantyPage.tsx";
import { OrderPage } from "@/pages/order/OrderPage.tsx";
import { CheckRole } from "@/routes/ProtectedRoute.tsx";

export const MainRoute = () => {
  return (
    <Routes>
      <Route path="login" element={<LoginPage />} />
      <Route path="/" element={<RootLayout />}>
        <Route
          index
          element={CheckRole(
            [
              "admin",
              "owner",
              "warehouse_staff",
              "technical_staff",
              "sale_staff",
              "finance_staff",
            ],
            DashBoardPage,
          )}
        />
        <Route
          path={"product"}
          element={CheckRole(
            [
              "admin",
              "owner",
              "warehouse_staff",
              "technical_staff",
              "sale_staff",
              "finance_staff",
            ],
            ProductPage,
          )}
        />
        <Route
          path={"report"}
          element={CheckRole(["admin", "owner", "finance_staff"], ReportPage)}
        />
        <Route
          path={"inventory"}
          element={CheckRole(
            ["admin", "owner", "warehouse_staff"],
            InventoryPage,
          )}
        />
        <Route
          path={"stock-takes"}
          element={CheckRole(
            ["admin", "owner", "warehouse_staff"],
            InventoryCheckPage,
          )}
        />
        <Route
          path={"partner"}
          element={CheckRole(
            ["admin", "owner", "warehouse_staff", "sale_staff"],
            PartnerPage,
          )}
        />
        <Route
          path={"setting"}
          element={CheckRole(["admin", "owner"], SettingPage)}
        />
        <Route
          path={"employee"}
          element={CheckRole(["admin", "owner"], EmployeePage)}
        />
        <Route
          path={"stock-in"}
          element={CheckRole(
            ["admin", "warehouse_staff", "owner"],
            StockInPage,
          )}
        />
        <Route
          path={"stock-in/new"}
          element={CheckRole(
            ["admin", "warehouse_staff", "owner"],
            StockInAddPage,
          )}
        />
        <Route
          path={"stock-out"}
          element={CheckRole(
            ["admin", "warehouse_staff", "technical_staff", "owner"],
            StockOutPage,
          )}
        />
        <Route
          path={"stock-out/new"}
          element={CheckRole(
            ["admin", "warehouse_staff", "technical_staff", "owner"],
            StockOutAddPage,
          )}
        />
        <Route
          path={"warranty"}
          element={CheckRole(
            ["admin", "technical_staff", "owner"],
            WarrantyPage,
          )}
        />
        <Route
          path={"order"}
          element={CheckRole(["admin", "sale_staff", "owner"], OrderPage)}
        />
      </Route>
      <Route
        path="/sale"
        element={CheckRole(["admin", "sale_staff", "owner"], SalePage)}
      />
      <Route path="/error" element={<ErrorPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};
