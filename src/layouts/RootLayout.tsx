import { Toaster } from "@/components/ui/sonner.tsx";
import { Fragment } from "react";
import { FullScreenLoading } from "@/components/ui/fullScreenLoading.tsx";
import { useStore } from "@/stores/useStore.ts";
import { Outlet } from "react-router-dom";
import { TopBar } from "@/layouts/components/TopBar.tsx";

export default function RootLayout() {
  const isLoading = useStore((state) => state.isLoading);
  return (
    <Fragment>
      <FullScreenLoading isLoading={isLoading}></FullScreenLoading>
      <main>
        <TopBar />
        <div className="bg-background min-h-screen min-w-screen">
          <Outlet />
        </div>
      </main>
      <Toaster
        position="top-right"
        expand={false}
        richColors={true}
        duration={3000}
        closeButton
        offset="30px"
      />
    </Fragment>
  );
}
