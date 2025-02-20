// src/components/Navbar.tsx

import React from "react";
import { Button } from "@/components/ui/button"; // Adjust the path as necessary

const Navbar: React.FC = () => {
    return (
        <nav className="shadow-sm">
        <div className=" max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <a href="/" className="text-2xl font-bold">
                Chat
                <span className="text-blue-500">PDF</span>
            </a>
            {/* Sign In Button */}
            <Button variant="outline" className="text-sm">
                Sign In
            </Button>
            </div>
        </div>
        </nav>
    );
};

export default Navbar;
