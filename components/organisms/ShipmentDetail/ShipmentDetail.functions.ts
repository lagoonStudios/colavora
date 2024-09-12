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
  const [city, setCity] = useState<string>();
  const [error, setError] = useState<unknown>(null);

  // useEffect(() => {
  //   const getLocation = async () => {
  //     setLoading(true);
  //     const apiKey = process.env.EXPO_PUBLIC_GOOGLE_CLOUD_API_KEY!;
  //     const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${address})}+${zipCode}&key=${apiKey}`;
  //     try {
  //       const response = await fetch(url);
  //       const json = await response.json();
  //       const { results } = json;
  //       if (results.length > 0) {
  //         const { geometry } = results[0];
  //         const { location: fetchLocation } = geometry;

  //         setLocation({
  //           lat: fetchLocation.lat,
  //           lng: fetchLocation.lng,
  //         });
  //         setLoading(false);
  //       }
  //     } catch (error) {
  //       console.error("🚀 ~ useEffect ~ Error al obtener las coordenadas:", error)
  //       setError(error);
  //       setLoading(false);
  //     }
  //   };
  //   getLocation();
  // }, [address, zipCode]);

  // useEffect(() => {
  //   const getCity = async () => {
  //     console.log("getting city");
  //     setLoading(true);
  //     const apiKey = process.env.EXPO_PUBLIC_GOOGLE_CLOUD_API_KEY!;
  //     const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${zipCode}&key=${apiKey}`;
  //     try {
  //       const response = await fetch(url);
  //       const json = await response.json();
  //       const { results } = json;
  //       if (results.length > 0) {
  //         const { formatted_address } = results[0];

  //         setCity(formatted_address);
  //         setLoading(false);
  //       }
  //     } catch (error) {
  //       console.error("🚀 ~ useEffect ~ Error al obtener las coordenadas:", error)
  //       setError(error);
  //       setLoading(false);
  //     }
  //   };
  //   getCity();
  // }, [zipCode]);

  return { loading, location, city, error };
}

export const useShipmentData = () => {
  const { shipment: rawShipment } = useStore();
  const shipment: Partial<IFetchShipmentByIdData & { invoiceBarcode: string }> = useMemo(() => {
    return {
      ...rawShipment,
      dueDate: new Date(rawShipment?.dueDate ?? "").toLocaleString(),
    };
  }, [rawShipment]);

  return { shipment };
};
