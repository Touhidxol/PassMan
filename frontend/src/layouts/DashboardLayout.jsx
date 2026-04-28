import { useState } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../components/DashboardNavbar";
import Sidebar from "../components/Sidebar";
import MobileSidebar from "../components/MobileSidebar";
import ErrorBoundary from "../components/ErrorBoundary";
import { Fade, SlideLeft, PresenceWrapper } from "../animations";

const PageErrorFallback = (
    <div className="dashboard-error-card">
        <div className="dashboard-error-icon">⚠</div>
        <p className="dashboard-error-title">This page crashed</p>
        <p className="dashboard-error-body">
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
        <div className="dashboard-shell">

            {/* ── Desktop Sidebar ─────────────────────────── */}
            <div className="hidden md:block">
                <Sidebar />
            </div>

            {/* ── Mobile Sidebar Overlay ───────────────────── */}
            <PresenceWrapper>
                {sidebarOpen && (
                    <Fade>
                        <div
                            onClick={() => setSidebarOpen(false)}
                            className="md:hidden fixed inset-0 z-50 modal-backdrop"
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

            {/* ── Main column ──────────────────────────────── */}
            <div className="dashboard-main">

                {/* Navbar */}
                <Navbar openSidebar={() => setSidebarOpen(true)} />

                {/* Page content */}
                <div className="dashboard-outlet">
                    <ErrorBoundary fallback={PageErrorFallback}>
                        <Outlet />
                    </ErrorBoundary>
                </div>

            </div>
        </div>
    );
};

export default DashboardLayout;