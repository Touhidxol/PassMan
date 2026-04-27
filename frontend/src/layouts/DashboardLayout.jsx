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
        <div className="w-12 h-12 rounded-full flex items-center justify-center text-xl mb-4 bg-danger-subtle border border-danger-subtle">
            ⚠
        </div>
        <p className="font-medium mb-1 text-primary">This page crashed</p>
        <p className="text-sm mb-4 text-muted">
            The rest of the app is fine. Try refreshing this page.
        </p>
        <button
            onClick={() => window.location.reload()}
            className="btn-ghost text-sm px-4 py-2"
        >
            Reload
        </button>
    </div>
);

const DashboardLayout = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="flex w-screen h-screen overflow-hidden bg-dashboard">

            {/* ── Desktop Sidebar ── */}
            <div className="hidden md:block shrink-0">
                <Sidebar />
            </div>

            {/* ── Mobile Sidebar Overlay ── */}
            <PresenceWrapper>
                {sidebarOpen && (
                    <Fade>
                        <div
                            onClick={() => setSidebarOpen(false)}
                            className="md:hidden fixed inset-0 z-50 bg-overlay backdrop-sidebar"
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

            {/* ── Main column ── */}
            <div className="flex flex-col flex-1 h-screen overflow-hidden min-w-0">

                {/* Navbar */}
                <div className="shrink-0 bg-navbar border-b border-navbar">
                    <Navbar openSidebar={() => setSidebarOpen(true)} />
                </div>

                {/* Page content */}
                <div className="flex-1 overflow-y-auto min-h-0">
                    <ErrorBoundary fallback={PageErrorFallback}>
                        <Outlet />
                    </ErrorBoundary>
                </div>

            </div>
        </div>
    );
};

export default DashboardLayout;
