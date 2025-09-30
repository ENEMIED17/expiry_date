import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { apiClient } from "@/integrations/apiClient";

export const ProductsPage: React.FC = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiClient
      .getProducts()
      .then(setProducts)
      .catch((err) => console.error("Error fetching products:", err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="p-6">Loading products...</p>;

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold">Products</h1>
        <p className="text-muted-foreground">
          Manage products in your vending machines
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Products List</CardTitle>
        </CardHeader>
        <CardContent>
          {products.length === 0 ? (
            <p>No products found.</p>
          ) : (
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-2 text-left">Name</th>
                  <th className="p-2 text-left">Barcode</th>
                  <th className="p-2 text-left">Expires At</th>
                  <th className="p-2 text-left">Quantity</th>
                  <th className="p-2 text-left">Machine</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p, idx) => (
                  <tr key={idx} className="border-t">
                    <td className="p-2">{p.name}</td>
                    <td className="p-2">{p.barcode}</td>
                    <td className="p-2">{p.expire_at}</td>
                    <td className="p-2">{p.quantity}</td>
                    <td className="p-2">{p.machine_id}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
