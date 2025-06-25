import { Box } from "@chakra-ui/react";
import { Outlet, useLocation } from "react-router-dom";

import Header from "./components/common/Header";
import Sidebar from "./components/common/Sidebar";
const Layout = () => {
    const location  = useLocation()
    const isHomePage  = location.pathname === "/"
    return (
        <Box>
           {!isHomePage &&  <Sidebar />}
            <Header /> {/* Optional: Can be removed */}
            <main className="pt-6">
                <Outlet />
            </main>
        </Box>


    );
};

export default Layout;
