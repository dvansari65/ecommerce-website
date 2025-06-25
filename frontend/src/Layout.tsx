import { Box } from "@chakra-ui/react";
import { Outlet } from "react-router-dom";
import Sidebar from "./components/common/Sidebar";
import Header from "./components/common/Header";

const Layout = () => {
  return (
    <Box>
      <Sidebar />
      <Box ml="60">
        <Header /> {/* Optional: Can be removed */}
        <Box p="6">
          <main className="pt-6">
          <Outlet />
          </main>
        </Box>
      </Box>
    </Box>
  );
};

export default Layout;
