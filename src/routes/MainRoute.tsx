import {BrowserRouter, Route, Routes} from "react-router-dom";
import {LoginPage} from "@/pages/login/LoginPage.tsx";
import RootLayout from "@/layouts/RootLayout.tsx";
import {NotFoundPage} from "@/pages/NotFoundPage.tsx";
import {ErrorPage} from "@/pages/ErrorPage.tsx";


export const MainRoute = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="login" element={<LoginPage />} />
                <Route path="/" element={<RootLayout />}/>
                <Route path="/error" element={<ErrorPage/>}/>
                <Route path="*" element={<NotFoundPage />} />
            </Routes>
        </BrowserRouter>
    )
}