import { useState } from "react";
import { Outlet } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import Navbar from "../components/DashboardNavbar";
import Sidebar from "../components/Sidebar";
import MobileSidebar from "../components/MobileSidebar";
import ErrorBoundary from "../components/ErrorBoundary";
import { Fade, SlideLeft, PresenceWrapper } from "../animations";

const PageErrorFallback = (
    <div className="flex flex-col items-center justify-center h-full p-12 text-center">
        <div className="w-12 h-12 rounded-full bg-red-500/15 border border-red-500/30 flex items-center justify-center text-xl mb-4">
            ⚠
        </div>
        <p className="text-white/80 font-medium mb-1">This page crashed</p>
        <p className="text-sm text-white/40 mb-4">The rest of the app is fine. Try refreshing this page.</p>
        <button
            onClick={() => window.location.reload()}
            className="text-sm px-4 py-2 rounded-full border border-white/20 text-white/70 hover:bg-white/10 transition"
        >
            Reload
        </button>
    </div>
);

const DashboardLayout = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);

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
                            onClick={() => setSidebarOpen(false)}
                            className="md:hidden fixed inset-0 z-50 bg-black/50"
                        >
                            <SlideLeft>
                                <MobileSidebar
                                    closeSidebar={() => setSidebarOpen(false)}
                                    sidebarOpen={sidebarOpen}
                                />
                            </SlideLeft>
                        </div>
                    </Fade>
                )}
            </PresenceWrapper>

            {/* Main */}
            <div className="flex-1 flex flex-col h-screen overflow-hidden">
                <div className="shrink-0">
                    <Navbar openSidebar={() => setSidebarOpen(true)} />
                </div>

                {/* Each page gets its own error boundary — sidebar stays alive */}
                <div className="flex-1 overflow-y-auto">
                    <ErrorBoundary fallback={PageErrorFallback}>
                        <Outlet />
                    </ErrorBoundary>
                </div>
            </div>

        </div>
    );
};

export default DashboardLayout;
