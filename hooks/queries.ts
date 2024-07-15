import { useQuery } from "@tanstack/react-query";
import { fetchDriverData, fetchShipmentData } from "@/services/custom-api";

export function useDriverData(id: string) {
  const driverData = useQuery({
    queryKey: ["driverData"],
    queryFn: async () => {
      const { data: rawData } = await fetchDriverData(id);
      return rawData ?? {};
    },
    retry: 1,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

  return driverData;
}
export function useShipmentData(id: string | undefined) {
  const shipmentData = useQuery({
    queryKey: ["shipmentData"],
    queryFn: async () => {
      const { data: rawData } = await fetchShipmentData(id);
      return rawData ?? {};
    },
    retry: 3,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    enabled: Boolean(id),
  });

  return shipmentData;
}
