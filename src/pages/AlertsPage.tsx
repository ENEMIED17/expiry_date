import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { apiClient } from "@/integrations/apiClient";

type AlertProduct = {
  id: number;
  name: string;
  expire_at: string;
  machine_id: number;
};

export const AlertsPage: React.FC = () => {
  const [expired, setExpired] = useState<AlertProduct[]>([]);
  const [expiring, setExpiring] = useState<AlertProduct[]>([]);
  const [healthy, setHealthy] = useState<AlertProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiClient
      .getProducts()
      .then((products) => {
        const now = new Date();
        const expiredList: AlertProduct[] = [];
        const expiringList: AlertProduct[] = [];
        const healthyList: AlertProduct[] = [];

        products.forEach((p: any) => {
          const expireAt = new Date(p.expire_at);
          const daysLeft = Math.ceil(
            (expireAt.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
          );

          if (daysLeft <= 0) {
            expiredList.push(p);
          } else if (daysLeft <= 7) {
            expiringList.push(p);
          } else {
            healthyList.push(p);
          }
        });

        setExpired(expiredList);
        setExpiring(expiringList);
        setHealthy(healthyList);
      })
      .catch((err) => console.error("Error fetching alerts:", err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="p-6">Loading alerts...</p>;

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold">Alerts</h1>
        <p className="text-muted-foreground">
          Monitor expiring and expired products daily
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Expired Products</CardTitle>
        </CardHeader>
        <CardContent>
          {expired.length === 0 ? (
            <p>No expired products 🎉</p>
          ) : (
            <ul className="list-disc pl-5">
              {expired.map((p) => (
                <li key={p.id}>
                  {p.name} (Machine {p.machine_id}) - Expired on {p.expire_at}
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Expiring Soon (≤ 7 days)</CardTitle>
        </CardHeader>
        <CardContent>
          {expiring.length === 0 ? (
            <p>No products expiring soon</p>
          ) : (
            <ul className="list-disc pl-5">
              {expiring.map((p) => (
                <li key={p.id}>
                  {p.name} (Machine {p.machine_id}) - Expires on {p.expire_at}
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Healthy Products</CardTitle>
        </CardHeader>
        <CardContent>
          {healthy.length === 0 ? (
            <p>No healthy products</p>
          ) : (
            <ul className="list-disc pl-5">
              {healthy.map((p) => (
                <li key={p.id}>
                  {p.name} (Machine {p.machine_id}) - Expires on {p.expire_at}
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
