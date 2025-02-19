import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { ThemeProvider } from '@/components/ThemeProvider.tsx'
import { ModeToggle } from "./components/mode-toggle"

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
            <App />
            <div className="toggle-container fixed top-[95%] right-5">
                <ModeToggle />
            </div>
        </ThemeProvider>
    </StrictMode>,
)
