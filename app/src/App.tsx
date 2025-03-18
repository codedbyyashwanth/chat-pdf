// Install react-router-dom first if not already installed
// npm install react-router-dom

import { BrowserRouter as Router, Routes, Route, Link } from 'react-router';
import HomePage from './pages/Home';
import ChatPDFPage from './pages/ChatPDF';
import Navbar from './components/navbar';

function App() {
    return (
        <>
            <Navbar />
            <Router>
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/chat-pdf" element={<ChatPDFPage />} />
                </Routes>
            </Router>
        </>
    );
}

export default App;