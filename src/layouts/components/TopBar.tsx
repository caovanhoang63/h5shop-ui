import { Button } from "@/components/ui/button.tsx";
import {
  ArrowDown,
  ArrowRightLeft,
  BarChart3,
  BookUser,
  ChartColumn,
  Download,
  EyeIcon,
  FileText,
  Handshake,
  List,
  LogOut,
  Package,
  ScrollText,
  Settings,
  ShoppingBasket,
  User,
  UserRound,
  Users,
} from "lucide-react";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar.tsx";
import {
  NavigationMenu,
  NavigationMenuList,
} from "@/components/ui/navigation-menu.tsx";
import { useNavigate } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useUserStore } from "@/stores/userStore.ts";

export const TopBar = () => {
  const navigate = useNavigate();
  const userProfile = useUserStore((state) => state.user);
  const logout = useUserStore((state) => state.logout);
  interface IRoleMap {
    [key: string]: string;
  }
  const roleMap: IRoleMap = {
    admin: "Quản trị viên",
    owner: "Chủ cửa hàng",
    warehouse_staff: "Nhân viên kho",
    technical_staff: "Nhân viên kỹ thuật",
    finance_staff: "Nhân viên tài chính",
  };
  const canViewDashboard = [
    "admin",
    "owner",
    "warehouse_staff",
    "technical_staff",
    "sale_staff",
    "finance_staff",
  ].includes(userProfile?.systemRole || "");
  const canViewProduct = canViewDashboard;
  const canViewReport = ["admin", "owner", "finance_staff"].includes(
    userProfile?.systemRole || "",
  );
  const canViewStock = ["admin", "owner", "warehouse_staff"].includes(
    userProfile?.systemRole || "",
  );
  const canViewPartner = [
    "admin",
    "owner",
    "sale_staff",
    "warehouse_staff",
  ].includes(userProfile?.systemRole || "");
  const canViewEmployee = ["admin", "owner"].includes(
    userProfile?.systemRole || "",
  );
  const canViewSale = ["admin", "sale_staff", "owner"].includes(
    userProfile?.systemRole || "",
  );
  const canViewSettings = ["admin", "owner"].includes(
    userProfile?.systemRole || "",
  );

  return (
    <div className="sticky top-0 z-50">
      <div className="flex justify-between items-center px-5 bg-background">
        <Button
          onClick={() => navigate("/")}
          variant={"ghost"}
          className={"text-2xl font-bold"}
        >
          H5Shop
        </Button>
        <div className={"flex space-x-2 items-center"}>
          <div className={"content-center text-xl"}>
            {userProfile?.firstName + " " + userProfile?.lastName}
          </div>
          <div className={"content-center text-xl"}>
            {userProfile?.phoneNumber}
          </div>
          <div className={"content-center text-xl"}>
            {roleMap[userProfile?.systemRole || ""]}
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Avatar className="cursor-pointer content-center">
                <AvatarImage
                  src={
                    userProfile?.avatar ||
                    "https://media.istockphoto.com/id/1300845620/vector/user-icon-flat-isolated-on-white-background-user-symbol-vector-illustration.jpg?s=612x612&w=0&k=20&c=yBeyba0hUkh14_jgv1OKqIH0CCSWU_4ckRkAoy2p73o="
                  }
                  alt="avatar"
                />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <User />
                Tài khoản
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  localStorage.removeItem("token");
                  window.location.reload();
                  logout();
                }}
              >
                <LogOut />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <div className={"w-full bg-primary px-5 flex justify-between text-white"}>
        <NavigationMenu>
          <NavigationMenuList>
            {canViewDashboard && (
              <Button
                variant="default"
                className="bg-blue-600 hover:bg-blue-700 text-white text-lg"
                onClick={() => navigate("/")}
              >
                <EyeIcon size={20} />
                <p>Tổng quan</p>
              </Button>
            )}
            {canViewProduct && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="default"
                    className="bg-blue-600 hover:bg-blue-700 text-white text-lg"
                  >
                    <Package size={20} />
                    Hàng hóa
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56 bg-blue-600 text-white border-blue-700 ml-24">
                  <DropdownMenuItem
                    className="hover:bg-blue-700 cursor-pointer"
                    onClick={() => navigate("/product")}
                  >
                    <List size={20} />
                    Danh mục
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="hover:bg-blue-700 cursor-pointer"
                    onClick={() => navigate("/warranty")}
                  >
                    <FileText size={20} />
                    Phiếu bảo hành
                  </DropdownMenuItem>
                  {canViewStock && (
                    <DropdownMenuItem
                      className="hover:bg-blue-700 cursor-pointer"
                      onClick={() => navigate("/inventory")}
                    >
                      <BarChart3 size={20} />
                      Kiểm kho
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            )}
            {canViewStock && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="default"
                    className="bg-blue-600 hover:bg-blue-700 text-white text-lg"
                  >
                    <ArrowRightLeft size={20} />
                    <p>Giao dịch</p>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56 bg-blue-600 text-white border-blue-700 ml-24">
                  <DropdownMenuItem
                    className="hover:bg-blue-700 cursor-pointer"
                    onClick={() => navigate("/stock-in")}
                  >
                    <Download size={20} />
                    <p>Nhập hàng</p>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="hover:bg-blue-700 cursor-pointer"
                    onClick={() => navigate("/stock-out")}
                  >
                    <ArrowDown size={20} />
                    <p>Xuất hàng</p>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
            {canViewPartner && (
              <Button
                variant="default"
                className="bg-blue-600 hover:bg-blue-700 text-white text-lg"
                onClick={() => navigate("/partner")}
              >
                <Handshake size={20} />
                <p>Đối tác</p>
              </Button>
            )}
            {canViewEmployee && (
              <Button
                variant="default"
                className="bg-blue-600 hover:bg-blue-700 text-white text-lg"
                onClick={() => navigate("/employee")}
              >
                <Users size={20} />
                <p>Nhân viên</p>
              </Button>
            )}
            {canViewReport && (
              <Button
                variant="default"
                className="bg-blue-600 hover:bg-blue-700 text-white text-lg"
                onClick={() => navigate("/report")}
              >
                <ChartColumn size={20} />
                <p>Báo cáo</p>
              </Button>
            )}
            {canViewSettings && (
              <Button
                variant="default"
                className="bg-blue-600 hover:bg-blue-700 text-white text-lg"
                onClick={() => navigate("/setting")}
              >
                <Settings size={20} />
                <p>Setting</p>
              </Button>
            )}
          </NavigationMenuList>
        </NavigationMenu>
        {canViewSale && (
          <NavigationMenu>
            <NavigationMenuList>
              <Button
                variant="default"
                className="bg-blue-600 hover:bg-blue-700 text-white text-lg"
                onClick={() => navigate("/sale")}
              >
                <ShoppingBasket size={20} />
                <p>Bán hàng</p>
              </Button>
            </NavigationMenuList>
          </NavigationMenu>
        )}
      </div>
    </div>
  );
};
