import { ToastContainer } from "react-toastify";
import "./App.css";
import { MainRoute } from "@/routes/MainRoute.tsx";

function App() {
  return (
    <main>
      <MainRoute />
      <ToastContainer />
    </main>
  );
}

export default App;
