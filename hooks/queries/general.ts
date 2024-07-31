import { useQueries, useQuery } from "@tanstack/react-query";
import {
  fetchDriverData,
  fetchCompanyData,
  fetchStatusData,
  fetchStatusByIdData,
} from "@/services/custom-api";
import { queryKeys } from "@constants/Constants";

export function useDriverData(id: string) {
  const driverData = useQuery({
    queryKey: [queryKeys.driverData],
    queryFn: async () => {
      const { data: rawData } = await fetchDriverData(id);
      return rawData ?? {};
    },
    retry: 3,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

  return driverData;
}
export function useCompanyData(id: string | undefined) {
  const companyData = useQuery({
    queryKey: [queryKeys.companyData],
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

export function useStatusIdData() {
  const statusIdData = useQuery({
    queryKey: [queryKeys.statusIdData],
    queryFn: async () => {
      const { data: rawData } = await fetchStatusData();
      return rawData ?? [];
    },
    retry: 3,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

  return statusIdData;
}

export function useStatusByIdData(ids: number[]) {
  const statusByIdData = useQueries({
    queries: ids?.map((id) => ({
      queryKey: [`${queryKeys.statusByIdData}-${id}`],
      queryFn: async () => {
        const { data: rawData } = await fetchStatusByIdData(String(id));
        return rawData ?? [];
      },
      staleTime: Infinity,
    })),
    combine: (results) => {
      return {
        data: results.map((result) => result?.data),
        pending: results.some((result) => result.isPending),
      };
    },
  });

  return statusByIdData;
}
