import './App.css'
import RootLayout from "@/layout.tsx";
import {Button} from "@/components/ui/button.tsx";
import {toast} from "sonner";

function App() {

  return (
    <RootLayout>
        <div>
            <Button onClick={() => toast.success("hello")}>Toast</Button>
        </div>
    </RootLayout>
  )
}

export default App
