import Navbar from "./components/navbar"
import { HeroContainer } from "./components/HeroSection"


const App = () => {
    return <div className="min-h-[90vh]">
        <Navbar />
        <HeroContainer />
    </div>
}

export default App