import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Building2, CheckCircle, Clock, Package } from "lucide-react";
import { apiClient } from "@/integrations/apiClient";

interface Stats {
  totalMachines: number;
  activeMachines: number;
  totalProducts: number;
  expiringProducts: number;
  expiredProducts: number;
  healthyProducts: number;
}

export const DashboardStats: React.FC = () => {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiClient.getStats()
      .then(setStats)
      .catch(err => console.error("Error fetching stats:", err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Loading stats...</p>;
  if (!stats) return <p>No stats available</p>;

  const statCards = [
    { title: "Total Machines", value: stats.totalMachines, description: `${stats.activeMachines} active`, icon: Building2, color: "text-primary" },
    { title: "Total Products", value: stats.totalProducts, description: "Currently stocked", icon: Package, color: "text-primary" },
    { title: "Healthy Products", value: stats.healthyProducts, description: "No action needed", icon: CheckCircle, color: "text-status-green" },
    { title: "Expiring Soon", value: stats.expiringProducts, description: "Need attention", icon: Clock, color: "text-status-yellow" },
    { title: "Expired/Critical", value: stats.expiredProducts, description: "Immediate action", icon: AlertTriangle, color: "text-status-red" },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
      {statCards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <Card key={idx}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{card.title}</CardTitle>
              <Icon className={`w-4 h-4 ${card.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{card.value}</div>
              <p className="text-xs text-muted-foreground">{card.description}</p>
              {card.title === "Expiring Soon" && card.value > 0 && (
                <Badge variant="outline" className="mt-2 bg-yellow-100 text-yellow-600">Action needed</Badge>
              )}
              {card.title === "Expired/Critical" && card.value > 0 && (
                <Badge variant="outline" className="mt-2 bg-red-100 text-red-600">Urgent</Badge>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};
