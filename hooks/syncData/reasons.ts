import { mockCompanyId } from "@constants/Constants";
import { useReasonsIdData, useReasonsByIdData } from "@hooks/queries";
import i18next from "i18next";
import { useEffect } from "react";
import { useStore } from "@stores/zustand";
import { insertMultipleExceptions } from "@hooks/SQLite";
import { IFetchUserData } from "@constants/types/general";

export function useReasonsFetch(user: IFetchUserData | null) {
  // --- Hooks -----------------------------------------------------------------
  const { addReasonIds, reasonIds, addReason, reasons } = useStore();

  const { data: reasonsIds } = useReasonsIdData(user?.companyID);
  const { data: reasonsResponse, pending } = useReasonsByIdData(reasonIds, i18next.language);
  // --- END: Hooks ------------------------------------------------------------

  // --- Side effects ----------------------------------------------------------
  useEffect(() => {
    if (reasonsIds) addReasonIds(reasonsIds);
  }, [reasonsIds]);

  useEffect(() => {
    if (pending === false)
      reasonsResponse?.map((reason) => {
        if (reason) addReason(reason);
      });
  }, [pending, reasonsResponse]);

  useEffect(() => {
    if (reasons)
      if (reasons?.length !== 0)
        insertMultipleExceptions(reasons)
  }, [reasons])
  // --- END: Side effects -----------------------------------------------------
}