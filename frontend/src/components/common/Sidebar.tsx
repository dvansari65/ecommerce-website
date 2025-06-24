// src/components/layout/Sidebar.tsx

import { Menu } from "lucide-react";
import { Link } from "react-router-dom";

const Sidebar = () => {
  return (
    <Sheet>
      <SheetTrigger className="md:hidden p-2">
        <Menu className="w-6 h-6" />
      </SheetTrigger>

      <SheetContent side="left" className="w-[250px] bg-white p-6">
        <nav className="space-y-4">
          <Link to="/" className="block text-lg font-semibold text-gray-700 hover:text-blue-600">
            Home
          </Link>
          <Link to="/" className="block text-lg font-semibold text-gray-700 hover:text-blue-600">
            About Us
          </Link>
          <Link to="/" className="block text-lg font-semibold text-gray-700 hover:text-blue-600">
            Catalogue
          </Link>
        </nav>
      </SheetContent>
    </Sheet>
  );
};

export default Sidebar;
