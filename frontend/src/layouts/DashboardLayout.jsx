import { Outlet } from "react-router-dom";
import Navbar from "../components/DashboardNavbar";

const DashboardLayout = () => {
    return (
        <div className="flex w-screen min-h-screen">

            {/* Sidebar */}
            {/* <Sidebar /> */}

            {/* Main */}
            <div className="flex-1">
                <Navbar />
                <Outlet /> {/* pages load here */}
            </div>

            {/* Right Panel */}
            {/* <RightPanel /> */}

        </div>
    );
};

export default DashboardLayout;