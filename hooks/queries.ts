import { useQuery } from "@tanstack/react-query";
import { fetchDriverData, fetchCompanyData } from "@/services/custom-api";

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
export function useCompanyData(id: string | undefined) {
  const companyData = useQuery({
    queryKey: ["companyData"],
    queryFn: async () => {
      const { data: rawData } = await fetchCompanyData(id);
      return rawData ?? {};
    },
    retry: 3,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    enabled: Boolean(id),
  });

  return companyData;
}
