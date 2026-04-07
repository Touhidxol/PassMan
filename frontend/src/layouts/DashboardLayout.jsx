import { useState } from "react";
import { Outlet } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import Navbar from "../components/DashboardNavbar";
import Sidebar from "../components/Sidebar";
import MobileSidebar from "../components/MobileSidebar";
import { Fade, SlideLeft, PresenceWrapper } from "../animations";

const DashboardLayout = () => {
    const [sidebarOpen, setsidebarOpen] = useState(false);
    const openSidebar = () => {
        setsidebarOpen(true);
    }
    const closeSidebar = () => {
        setsidebarOpen(false);
    }

    return (
        <div className="flex w-screen h-screen overflow-hidden">

            {/* Desktop Sidebar */}
            <div className="hidden md:block">
                <Sidebar />
            </div>

            {/* Mobile Sidebar */}
            <PresenceWrapper>
                {sidebarOpen && (
                    <Fade>
                        <div
                            onClick={closeSidebar}
                            className="md:hidden fixed inset-0 z-50 bg-black/50"
                        >
                            <SlideLeft>
                                <MobileSidebar closeSidebar={closeSidebar} sidebarOpen={sidebarOpen} />
                            </SlideLeft>
                        </div>
                    </Fade>
                )}
            </PresenceWrapper>

            {/* Main */}
            <div className="flex-1 flex flex-col h-screen overflow-hidden">

                {/* Navbar (fixed height, no scroll) */}
                <div className="shrink-0">
                    <Navbar openSidebar={openSidebar} />
                </div>

                {/* Scrollable Outlet */}
                <div className="flex-1 overflow-y-auto">
                    <Outlet />
                </div>

            </div>


            {/* Right Panel */}
            {/* <RightPanel /> */}

        </div>
    );
};

export default DashboardLayout;