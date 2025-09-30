import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { Icon } from "leaflet";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { apiClient } from "@/integrations/apiClient";

export const VendingMachineMap: React.FC = () => {
  const [machines, setMachines] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiClient.getMachines()
      .then(setMachines)
      .catch(err => console.error("Error fetching machines:", err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Loading map...</p>;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Vending Machines</CardTitle>
      </CardHeader>
      <CardContent>
        <MapContainer center={[44.65, 10.92]} zoom={12} style={{ height: "400px", width: "100%" }}>
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          {machines.map((m, idx) => (
            <Marker
              key={idx}
              position={[m.lat || 44.65, m.lng || 10.92]}
              icon={new Icon({ iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png", iconSize: [25, 25] })}
            >
              <Popup>
                <b>{m.name}</b><br />
                Status: {m.status}
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </CardContent>
    </Card>
  );
};
