import { Button } from "@/components/ui/button"
import { ModeToggle } from "./components/mode-toggle"

const App = () => {
    return <div>
        <h1 className="text-3xl font-bold underline">
            Hello world!
        </h1>
        <Button>Submit Me</Button>
        <ModeToggle />
    </div>
}

export default App