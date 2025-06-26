import { Box } from "@chakra-ui/react";
import { Outlet } from "react-router-dom";

import Header from "./components/common/Header";
// import Sidebar from "./components/common/Sidebar";
const Layout = () => {
    // const location  = useLocation()
    // const isHomePage  = location.pathname === "/"
    return (
        <Box>
            <Header /> {/* Optional: Can be removed */}
            <main className="pt-20 px-4">
                <Outlet />
            </main>
        </Box>


    );
};

export default Layout;
