import { Button } from "@/components/ui/button.tsx";
import {
  ArrowRightLeft,
  ChartColumn,
  CircleDollarSign,
  EyeIcon,
  Handshake,
  Mail,
  Package2,
  Settings,
  ShoppingBasket,
  ShoppingCart,
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
          <button className={"hover:bg-accent p-1  rounded-md"}>
            <Settings size={32} />
          </button>
          <div className={"content-center text-xl "}>0896374872</div>
          <Avatar className={"cursor-pointer"}>
            <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
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
            <NavButton>
              <CircleDollarSign size={20} />
              <p>Sổ quỹ</p>
            </NavButton>
            <NavButton>
              <ChartColumn size={20} />
              <p>Báo cáo</p>
            </NavButton>
            <NavButton>
              <ShoppingCart size={20} />
              <p>Bán Online</p>
            </NavButton>
          </NavigationMenuList>
        </NavigationMenu>
        <NavigationMenu>
          <NavigationMenuList>
            <NavButton>
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
