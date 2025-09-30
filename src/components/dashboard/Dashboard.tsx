import React from "react";
import { DashboardStats } from "./DashboardStats";
import { VendingMachineMap } from "./VendingMachineMap";

export const Dashboard: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">
          Monitor your vending machines and track product expiration dates
        </p>
      </div>
      <DashboardStats />
      <VendingMachineMap />
    </div>
  );
};
