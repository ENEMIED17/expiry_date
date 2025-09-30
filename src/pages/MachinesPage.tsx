import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { apiClient } from "@/integrations/apiClient";
import { VendingMachineMap } from "@/components/dashboard/VendingMachineMap";

export const MachinesPage: React.FC = () => {
  const [machines, setMachines] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    name: "",
    location: "",
    latitude: "",
    longitude: "",
    status: "active",
  });

  // Carica le macchinette
  useEffect(() => {
    loadMachines();
  }, []);

  const loadMachines = async () => {
    setLoading(true);
    try {
      const data = await apiClient.getMachines();
      setMachines(data);
    } catch (err) {
      console.error("Error fetching machines:", err);
    } finally {
      setLoading(false);
    }
  };

  // Gestione form
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await apiClient.addMachine({
        name: form.name,
        location: form.location,
        latitude: parseFloat(form.latitude),
        longitude: parseFloat(form.longitude),
        status: form.status,
      });
      setForm({ name: "", location: "", latitude: "", longitude: "", status: "active" });
      loadMachines();
    } catch (err) {
      console.error("Error creating machine:", err);
    }
  };

  if (loading) return <p className="p-6">Loading machines...</p>;

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold">Vending Machines</h1>
        <p className="text-muted-foreground">
          Manage your vending machines and check their location
        </p>
      </div>

      {/* 🔹 Form aggiunta */}
      <Card>
        <CardHeader>
          <CardTitle>Add New Machine</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
            <Input
              name="name"
              placeholder="Name"
              value={form.name}
              onChange={handleChange}
              required
            />
            <Input
              name="location"
              placeholder="Location"
              value={form.location}
              onChange={handleChange}
              required
            />
            <Input
              name="latitude"
              placeholder="Latitude"
              value={form.latitude}
              onChange={handleChange}
              required
            />
            <Input
              name="longitude"
              placeholder="Longitude"
              value={form.longitude}
              onChange={handleChange}
              required
            />
            <Input
              name="status"
              placeholder="Status (default: active)"
              value={form.status}
              onChange={handleChange}
            />
            <Button type="submit" className="col-span-2">
              Add Machine
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* 🔹 Lista macchine */}
      <Card>
        <CardHeader>
          <CardTitle>Machines List</CardTitle>
        </CardHeader>
        <CardContent>
          {machines.length === 0 ? (
            <p>No machines available.</p>
          ) : (
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-2 text-left">Name</th>
                  <th className="p-2 text-left">Location</th>
                  <th className="p-2 text-left">Latitude</th>
                  <th className="p-2 text-left">Longitude</th>
                  <th className="p-2 text-left">Status</th>
                </tr>
              </thead>
              <tbody>
                {machines.map((m, idx) => (
                  <tr key={idx} className="border-t">
                    <td className="p-2">{m.name}</td>
                    <td className="p-2">{m.location}</td>
                    <td className="p-2">{m.latitude}</td>
                    <td className="p-2">{m.longitude}</td>
                    <td className="p-2">{m.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </CardContent>
      </Card>

      {/* 🔹 Mappa */}
      <VendingMachineMap />
    </div>
  );
};
