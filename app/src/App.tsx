import Navbar from "./components/navbar"
import { HeroContainer } from "./components/heroContainer"
import { UploadPdf } from "./components/fileUpload"



const App = () => {
    return <div className="min-h-[90vh]">
        <Navbar />
        {/* <HeroContainer /> */}
        <UploadPdf />
    </div>
}

export default App