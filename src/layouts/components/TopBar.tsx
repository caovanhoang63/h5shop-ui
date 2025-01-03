import { Button } from "@/components/ui/button.tsx";
import {
  ArrowRightLeft,
  ChartColumn,
  CircleDollarSign,
  EyeIcon,
  Handshake,
  LogOut,
  Mail,
  Package2,
  Settings,
  ShoppingBasket,
  ShoppingCart,
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
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu.tsx";
import { Fragment } from "react";
import { Link } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const TopBar = () => {
  return (
    <div className="sticky top-0 z-50">
      <div className="flex justify-between items-center px-5 bg-background">
        <Button variant={"ghost"} className={"text-2xl font-bold"}>
          H5Shop
        </Button>
        <div className={"flex space-x-5 items-center"}>
          <button className={"hover:bg-accent p-1 rounded-md"}>
            <Mail size={32} />
          </button>
          {/* <button className={"hover:bg-accent p-1  rounded-md"}>
            <Settings size={32} />
          </button>*/}
          <div className={"content-center text-xl "}>0896374872</div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Avatar className="cursor-pointer">
                <AvatarImage
                  src="https://github.com/shadcn.png"
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
            <NavButton>
              <EyeIcon size={20} />
              <p>Tổng quan</p>
            </NavButton>
            <NavButton link={"product"}>
              <Package2 size={20} />
              <p>Hàng hóa</p>
            </NavButton>
            <NavButton>
              <ArrowRightLeft size={20} />
              <p>Giao dịch</p>
            </NavButton>
            <NavButton link={"partner"}>
              <Handshake size={20} />
              <p>Đối tác</p>
            </NavButton>
            <NavButton link={"employee"}>
              <Users size={20} />
              <p>Nhân viên</p>
            </NavButton>
            <NavButton>
              <CircleDollarSign size={20} />
              <p>Sổ quỹ</p>
            </NavButton>
            <NavButton link={"/report"}>
              <ChartColumn size={20} />
              <p>Báo cáo</p>
            </NavButton>
            <NavButton link={"/warranty"}>
              <ShoppingCart size={20} />
              <p>Bảo hành</p>
            </NavButton>
            <NavButton link={"setting"}>
              <Settings size={20} />
              <p>Setting</p>
            </NavButton>
          </NavigationMenuList>
        </NavigationMenu>
        <NavigationMenu>
          <NavigationMenuList>
            <NavButton link={"/sale"}>
              <ShoppingBasket size={20} />
              <p>Bán hàng</p>
            </NavButton>
          </NavigationMenuList>
        </NavigationMenu>
      </div>
    </div>
  );
};

const NavButton = ({
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
};
