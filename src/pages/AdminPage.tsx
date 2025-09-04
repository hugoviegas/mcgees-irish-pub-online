import React, { useState } from "react";
import Navbar from "../components/Navbar";
import { useAuth } from "../contexts/AuthContext";
import { Button } from "@/components/ui/button";
import AdminMenuPage from "./AdminMenuPage";
import AdminEventsPage from "./AdminEventsPage";
import AdminImageUploadPage from "./AdminImageUploadPage";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import LoginForm from "../components/admin/LoginForm";

const AdminPage: React.FC = () => {
  const { isAuthenticated, loading, logout } = useAuth();
  const [tab, setTab] = useState("menu");

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-irish-red mx-auto mb-4"></div>
          <p className="text-gray-600">Checking authentication...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow flex items-center justify-center bg-gray-50">
          <Card className="max-w-md w-full p-8 mx-auto">
            <h1 className="text-2xl font-bold text-irish-red mb-6 text-center">
              Admin Login
            </h1>
            <LoginForm />
          </Card>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8 pt-24">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-irish-red">Admin Panel</h1>
          <Button
            onClick={async () => {
              await logout();
              // Redirect to homepage after logout
              window.location.href = "/";
            }}
            className="bg-irish-gold text-irish-brown"
          >
            Logout
          </Button>
        </div>
        <Tabs value={tab} onValueChange={setTab} className="w-full">
          <TabsList className="flex justify-center mb-8">
            <TabsTrigger value="menu">Menu</TabsTrigger>
            <TabsTrigger value="events">Events</TabsTrigger>
            <TabsTrigger value="gallery">Gallery Images</TabsTrigger>
          </TabsList>
          <TabsContent value="menu">
            <AdminMenuPage />
          </TabsContent>
          <TabsContent value="events">
            <AdminEventsPage />
          </TabsContent>
          <TabsContent value="gallery">
            <AdminImageUploadPage />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default AdminPage;
