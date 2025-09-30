import React, { useState } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { ProductsPage } from "@/pages/ProductsPage";
import { AlertsPage } from "@/pages/AlertsPage";
import { SettingsPage } from "@/pages/SettingsPage";
import { MachinesPage } from "@/pages/MachinesPage";
import { Dashboard as DashboardView } from "@/components/dashboard/Dashboard";
import { useAuth } from "@/components/auth/AuthProvider";
import { Navigate } from "react-router-dom";

const Dashboard: React.FC = () => {
  const [activeView, setActiveView] = useState("dashboard");
  const { user, loading } = useAuth();

  if (loading) {
    return <p className="p-6">Checking session...</p>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const renderContent = () => {
  switch (activeView) {
    case "dashboard":
      return <DashboardView />;
    case "machines":
      return <MachinesPage />;
    case "products":
      return <ProductsPage />;
    case "alerts":
      return <AlertsPage />;
    case "settings":
      return <SettingsPage />;
    default:
      return <DashboardView />;
  }
};


  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar activeView={activeView} onViewChange={setActiveView} />
      <main className="flex-1 overflow-auto">
        <div className="p-6">{renderContent()}</div>
      </main>
    </div>
  );
};

export default Dashboard;
