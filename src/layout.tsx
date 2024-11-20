import { Toaster } from "@/components/ui/sonner"

export default function RootLayout({ children  }: {children: React.ReactNode}) {
    return (
        <html lang="en">
            <head>
                <title>
                h5shop
                </title>
            </head>
            <body>
                <main>{children}</main>
                <Toaster position="top-right"
                         expand={false}
                         richColors={true}
                         duration={3000}
                         closeButton
                         offset="30px"/>
            </body>
        </html>
    )
}
