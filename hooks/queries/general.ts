import { useQueries, useQuery } from "@tanstack/react-query";
import {
  fetchDriverData,
  fetchCompanyData,
  fetchStatusData,
  fetchStatusByIdData,
  fetchCODByIdData,
  fetchCODData,
  fetchReasonsByIdData,
  fetchReasonsData,
  fetchAuth0UserInfo
} from "@/services/custom-api";
import { queryKeys } from "@constants/Constants";

export function useAuth0UserInfoData(user: string | undefined) {
  const driverData = useQuery({
    queryKey: [`${queryKeys.userInfoData}-${user}`],
    queryFn: async () => {
      const response = await fetchAuth0UserInfo();
      return response?.data ?? {};
    },
    retry: 3,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    enabled: !!user,
  });

  return driverData;
}

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
    enabled: !!id,
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

export function useStatusIdData(companyID: string | undefined) {
  const statusIdData = useQuery({
    queryKey: [queryKeys.statusIdData],
    queryFn: async () => {
      const { data: rawData } = await fetchStatusData({ companyID });
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

export function useReasonsIdData(companyID: string | undefined) {
  const reasonsIdData = useQuery({
    queryKey: [queryKeys.reasonsIdData],
    queryFn: async () => {
      const { data: rawData } = await fetchReasonsData({ companyID });
      return rawData ?? [];
    },
    retry: 3,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

  return reasonsIdData;
}

export function useReasonsByIdData(ids: number[], language: string) {
  const reasonsByIdData = useQueries({
    queries: ids?.map((id) => ({
      queryKey: [`${queryKeys.reasonsByIdData}-${id}`],
      queryFn: async () => {
        const { data: rawData } = await fetchReasonsByIdData({
          id: String(id),
          language
        });
        return rawData ?? [];
      },
      staleTime: Infinity,
    })),
    combine: (results) => {
      return {
        data: results.map((result) => result?.data),
        refetch: () => results.forEach((results) => results?.refetch()),
        pending: results.some((result) => result.isPending),
      };
    },
  });

  return reasonsByIdData;
}

export function useCODIdData(companyID: string | undefined) {
  const reasonsIdData = useQuery({
    queryKey: [queryKeys.CODIdData],
    queryFn: async () => {
      const { data: rawData } = await fetchCODData({ companyID });
      return rawData ?? [];
    },
    retry: 3,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

  return reasonsIdData;
}

export function useCODByIdData(ids: number[], language: string) {
  const reasonsByIdData = useQueries({
    queries: ids?.map((id) => ({
      queryKey: [`${queryKeys.CODByIdData}-${id}`],
      queryFn: async () => {
        const { data: rawData } = await fetchCODByIdData({
          id: String(id),
          language
        });
        return rawData ?? [];
      },
      staleTime: Infinity,
    })),
    combine: (results) => {
      return {
        data: results.map((result) => result?.data),
        refetch: () => results.forEach((results) => results?.refetch()),
        pending: results.some((result) => result.isPending),
      };
    },
  });

  return reasonsByIdData;
}
