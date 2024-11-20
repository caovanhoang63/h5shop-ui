import './App.css'
import RootLayout from "@/layout.tsx";
import {Button} from "@/components/ui/button.tsx";
import {useStore} from "@/stores/useStore.ts";

function App() {
    const setLoading = useStore(state => state.setLoading);
    const isLoading = useStore(state => state.isLoading);
    return (
        <RootLayout>
            <div>
                <Button onClick={() => setLoading(!isLoading)}>Toast</Button>
            </div>
        </RootLayout>
    )
}

export default App
