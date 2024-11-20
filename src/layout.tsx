import { Toaster } from "@/components/ui/sonner"
import {Fragment} from "react";

export default function RootLayout({ children  }: {children: React.ReactNode}) {
    return (
        <Fragment>
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
