import { useState } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../components/DashboardNavbar";
import Sidebar from "../components/Sidebar";
import MobileSidebar from "../components/MobileSidebar";

const DashboardLayout = () => {
    const [sidebarOpen, setsidebarOpen] = useState(false);
    const openSidebar = () => {
        setsidebarOpen(true);
    }
    const closeSidebar = () => {
        setsidebarOpen(false);
    }

    return (
        <div className="flex w-screen min-h-screen">

            {/* Desktop Sidebar */}
            <div className="hidden md:block">
                <Sidebar />
            </div>

            {/* Mobile Sidebar */}
            {sidebarOpen && (
                <div className="md:hidden fixed inset-0 z-50 bg-black/50">
                    <MobileSidebar closeSidebar={closeSidebar} sidebarOpen={sidebarOpen} />
                </div>
            )}

            {/* Main */}
            <div className="flex-1">
                <Navbar openSidebar={openSidebar}/>
                <Outlet />
            </div>


            {/* Right Panel */}
            {/* <RightPanel /> */}

        </div>
    );
};

export default DashboardLayout;