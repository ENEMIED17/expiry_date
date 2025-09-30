import React, { useEffect, useState } from "react";
import {
  GoogleMap,
  LoadScript,
  Marker,
  InfoWindow,
} from "@react-google-maps/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { apiClient } from "@/integrations/apiClient";

const containerStyle = {
  width: "100%",
  height: "400px",
};

const defaultCenter = { lat: 44.65, lng: 10.92 }; // posizione di default (Modena)

export const VendingMachineMap: React.FC = () => {
  const [machines, setMachines] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<any | null>(null);

  useEffect(() => {
    apiClient
      .getMachines()
      .then(setMachines)
      .catch((err) => console.error("Error fetching machines:", err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Loading map...</p>;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Vending Machines</CardTitle>
      </CardHeader>
      <CardContent>
        <LoadScript googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_KEY}>
          <GoogleMap
            mapContainerStyle={containerStyle}
            center={defaultCenter}
            zoom={12}
          >
            {machines.map((m, idx) => (
              <Marker
                key={idx}
                position={{
                  lat: m.latitude || 44.65,
                  lng: m.longitude || 10.92,
                }}
                onClick={() => setSelected(m)}
              />
            ))}

            {selected && (
              <InfoWindow
                position={{
                  lat: selected.latitude || 44.65,
                  lng: selected.longitude || 10.92,
                }}
                onCloseClick={() => setSelected(null)}
              >
                <div>
                  <b>{selected.name}</b>
                  <br />
                  Status: {selected.status}
                  <br />
                  Location: {selected.location}
                </div>
              </InfoWindow>
            )}
          </GoogleMap>
        </LoadScript>
      </CardContent>
    </Card>
  );
};
