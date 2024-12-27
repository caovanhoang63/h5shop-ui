import { ToastContainer } from "react-toastify";
import "./App.css";
import { MainRoute } from "@/routes/MainRoute.tsx";
import { BrowserRouter } from "react-router-dom";

function App() {
  return (
    <main>
      <BrowserRouter>
        <MainRoute />
        <ToastContainer />
      </BrowserRouter>
    </main>
  );
}

export default App;
