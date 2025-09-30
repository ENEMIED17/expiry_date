import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const SettingsPage: React.FC = () => {
  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-muted-foreground">
          Manage your account and company settings
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Account Info</CardTitle>
        </CardHeader>
        <CardContent>
          <p>User and company data will be displayed here.</p>
        </CardContent>
      </Card>
    </div>
  );
};
