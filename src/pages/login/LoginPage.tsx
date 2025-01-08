import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Authenticate } from "@/types/authenticate.ts";
import { getProfile, login } from "@/pages/login/api.ts";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useUserStore } from "@/stores/userStore.ts";

export default function LoginPage() {
  const [showPassword] = useState(false);
  const navigate = useNavigate();
  const [authenticateRequest, setAuthenticateRequest] = useState<Authenticate>({
    userName: "",
    password: "",
  });
  const loginStore = useUserStore((state) => state.login);
  async function handleManageButtonClick(navigateDestination: string) {
    try {
      const response = await login(authenticateRequest);
      if (response) {
        localStorage.setItem("token", response.data.accessToken.token);
        localStorage.setItem("refreshToken", response.data.refreshToken.token);
        await getProfile().then((r) => {
          loginStore(r.data.data);
        });

        toast.success("Đăng nhập thành công!", {
          position: "top-right",
          autoClose: 3000, // Tự động đóng sau 3 giây
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        navigate(`/${navigateDestination}`);
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast.error("Đăng nhập thất bại!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            H5Shop
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-xl font-medium">Đăng nhập</div>
          <div className="space-y-4">
            <div className="space-y-2">
              <Input
                type="text"
                placeholder="Tên đăng nhập"
                className="border-b border-t-0 border-x-0 rounded-none focus-visible:ring-0 focus-visible:ring-offset-0 px-0"
                onChange={(e) => {
                  setAuthenticateRequest({
                    ...authenticateRequest,
                    userName: e.target.value,
                  });
                }}
              />
            </div>
            <div className="space-y-2 relative ">
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="Mật khẩu"
                className="border-b border-t-0 border-x-0 rounded-none focus-visible:ring-0 focus-visible:ring-offset-0 px-0 pr-8"
                onChange={(e) => {
                  setAuthenticateRequest({
                    ...authenticateRequest,
                    password: e.target.value,
                  });
                }}
              />
              {/*<button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-0 top-3  text-gray-500"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>*/}
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Checkbox id="remember" />
                <label
                  htmlFor="remember"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Duy trì đăng nhập
                </label>
              </div>
              <Button variant="link" className="p-0 h-auto text-blue-500">
                Quên mật khẩu?
              </Button>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Button
              className="w-full bg-blue-500 hover:bg-blue-600"
              onClick={() => handleManageButtonClick("")}
            >
              Quản lý
            </Button>
            <Button
              className="w-full bg-green-500 hover:bg-green-600"
              onClick={() => handleManageButtonClick("sale")}
            >
              Bán hàng
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
