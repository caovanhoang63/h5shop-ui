import { Button } from "@/components/ui/button.tsx";
import {
  ArrowDown,
  ArrowRightLeft,
  BarChart3,
  ChartColumn,
  Download,
  EyeIcon,
  FileText,
  Handshake,
  List,
  LogOut,
  Package,
  Settings,
  ShoppingBasket,
  User,
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
          {/*<button className={"hover:bg-accent p-1 rounded-md"}>
            <Mail size={32} />
          </button>*/}
          {/* <button className={"hover:bg-accent p-1  rounded-md"}>
            <Settings size={32} />
          </button>*/}
          <div className={"content-center text-xl "}>
            {userProfile?.firstName + " " + userProfile?.lastName}
          </div>
          <div className={"content-center text-xl "}>
            {userProfile?.phoneNumber}
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Avatar className="cursor-pointer content-center">
                <AvatarImage
                  src={
                    userProfile?.avatar ||
                    "https://media.istockphoto.com/id/1300845620/vector/user-icon-flat-isolated-on-white-background-user-symbol-vector-illustration.jpg?s=612x612&w=0&k=20&c=yBeyba0hUkh14_jgv1OKqIH0CCSWU_4ckRkAoy2p73o="
                  }
                  alt="@shadcn"
                />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="" align="end">
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
            <Button
              variant="default"
              className="bg-blue-600 hover:bg-blue-700 text-white text-lg"
              onClick={() => navigate("/")}
            >
              <EyeIcon size={20} />
              <p>Tổng quan</p>
            </Button>
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
                  className="hover:bg-blue-700 focus:bg-blue-700 focus:text-white cursor-pointer"
                  onClick={() => navigate("/product")}
                >
                  <List size={20} />
                  Danh mục
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="hover:bg-blue-700 focus:bg-blue-700 focus:text-white cursor-pointer"
                  onClick={() => navigate("/warranty")}
                >
                  <FileText size={20} />
                  Phiếu bảo hành
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="hover:bg-blue-700 focus:bg-blue-700 focus:text-white cursor-pointer"
                  onClick={() => navigate("/inventory")}
                >
                  <BarChart3 size={20} />
                  Kiểm kho
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
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
              <DropdownMenuContent className="w-56 bg-blue-600 text-white border-blue-700 ml-24 ">
                <DropdownMenuItem
                  className="hover:bg-blue-700 focus:bg-blue-700 focus:text-white cursor-pointer"
                  onClick={() => navigate("/stock-in")}
                >
                  <Download size={20} />
                  <p>Nhập hàng</p>
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="hover:bg-blue-700 focus:bg-blue-700 focus:text-white cursor-pointer"
                  onClick={() => navigate("/stock-out")}
                >
                  <ArrowDown size={20} />
                  <p>Xuất hàng</p>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button
              variant="default"
              className="bg-blue-600 hover:bg-blue-700 text-white text-lg"
              onClick={() => navigate("/partner")}
            >
              <Handshake size={20} />
              <p>Đối tác</p>
            </Button>
            <Button
              variant="default"
              className="bg-blue-600 hover:bg-blue-700 text-white text-lg"
              onClick={() => navigate("/employee")}
            >
              <Users size={20} />
              <p>Nhân viên</p>
            </Button>
            <Button
              variant="default"
              className="bg-blue-600 hover:bg-blue-700 text-white text-lg"
              onClick={() => navigate("/report")}
            >
              <ChartColumn size={20} />
              <p>Báo cáo</p>
            </Button>
            {/*<Button
              variant="default"
              className="bg-blue-600 hover:bg-blue-700 text-white text-lg"
              onClick={() => navigate("/warranty")}
            >
              <ShoppingCart size={20} />
              <p>Bảo hành</p>
            </Button>*/}
            <Button
              variant="default"
              className="bg-blue-600 hover:bg-blue-700 text-white text-lg"
              onClick={() => navigate("/setting")}
            >
              <Settings size={20} />
              <p>Setting</p>
            </Button>
          </NavigationMenuList>
        </NavigationMenu>
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
      </div>
    </div>
  );
};

/*const NavButton = ({
  children,
  className = " ",
  link = "/",
}: {
  children: React.ReactNode;
  className?: string;
  link?: string;
}) => {
  return (
    <Fragment>
      <NavigationMenuItem className={`${className} `}>
        <Link to={link}>
          <NavigationMenuLink
            className={`${navigationMenuTriggerStyle()} text-xl py-5 bg-transparent flex items-center space-x-1 `}
          >
            {children}
          </NavigationMenuLink>
        </Link>
      </NavigationMenuItem>
    </Fragment>
  );
};*/
