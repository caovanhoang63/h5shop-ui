import { Toaster } from "@/components/ui/sonner"
import React, {Fragment} from "react";
import {FullScreenLoading} from "@/components/ui/fullScreenLoading.tsx";
import {useStore} from "@/stores/useStore.ts";

export default function RootLayout({ children  }: {children: React.ReactNode}) {
    const isLoading = useStore(state => state.isLoading)
    return (
        <Fragment>
            <FullScreenLoading isLoading={isLoading}></FullScreenLoading>
            <main>{children}</main>
            <Toaster position="top-right"
                     expand={false}
                     richColors={true}
                     duration={3000}
                     closeButton
                     offset="30px"/>
        </Fragment>
    )
}
