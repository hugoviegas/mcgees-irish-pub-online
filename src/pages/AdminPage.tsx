import React from "react";
import Navbar from "../components/Navbar";
import { Link } from "react-router-dom";

const AdminPage: React.FC = () => {
  return (
    <div>
      <Navbar />
      <div className="container mx-auto py-10">
        <h1 className="text-3xl font-bold mb-8">Admin Management</h1>
        <div className="flex flex-col gap-4">
          <Link
            to="/admin/menu"
            className="text-lg text-blue-600 hover:underline"
          >
            Admin Menu
          </Link>
          <Link
            to="/admin/events"
            className="text-lg text-blue-600 hover:underline"
          >
            Admin Events
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
