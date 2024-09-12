/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { useEffect, useMemo, useState } from "react";
import { defaultLocation } from "@constants/Constants";
import { useStore } from "@stores/zustand";
import { IFetchShipmentByIdData } from "@constants/types/shipments";

export function useCoordinatesFromAddress({
  address,
  zipCode,
}: {
  address: string;
  zipCode: string;
}) {
  const [loading, setLoading] = useState(false);
  const [location, setLocation] = useState<{ lat: number; lng: number }>(
    defaultLocation,
  );
  const [error, setError] = useState<unknown>(null);

  useEffect(() => {
    const getLocation = async () => {
      setLoading(true);
      const apiKey = process.env.EXPO_PUBLIC_GOOGLE_CLOUD_API_KEY!;
      const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${address})}+${zipCode}&key=${apiKey}`;
      try {
        const response = await fetch(url);
        const json = await response.json();
        const { results } = json;
        if (results.length > 0) {
          const { geometry } = results[0];
          const { location: fetchLocation } = geometry;

          setLocation({
            lat: fetchLocation.lat,
            lng: fetchLocation.lng,
          });
          setLoading(false);
        }
      } catch (error) {
        console.error(
          "🚀 ~ useEffect ~ Error al obtener las coordenadas:",
          error,
        );
        setError(error);
        setLoading(false);
      }
    };
    void getLocation();
  }, [address, zipCode]);

  return { loading, location, error };
}

export const useShipmentData = () => {
  const { shipment: rawShipment } = useStore();
  const shipment: Partial<IFetchShipmentByIdData & { invoiceBarcode: string }> =
    useMemo(() => {
      return {
        ...rawShipment,
        dueDate: new Date(rawShipment?.dueDate ?? "").toLocaleString(),
      };
    }, [rawShipment]);

  return { shipment };
};
