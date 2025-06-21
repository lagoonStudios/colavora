import i18next from "i18next";
import { useEffect } from "react";
import { useStore } from "@stores/zustand";
import { IFetchUserData, IReasonsByIdData } from "@constants/types/general";
import { useReasonsIdData, useReasonsByIdData } from "@hooks/queries";
import { ExceptionLocalService } from "@/db/repositories/exceptions.repository";

export function useReasonsFetch(user: IFetchUserData | null) {
  // --- Hooks -----------------------------------------------------------------
  const { addReasonIds, reasonIds, setReasons } = useStore();

  const { data: reasonsIds } = useReasonsIdData(user?.companyID);
  const { data: reasonsResponse, pending } = useReasonsByIdData(
    reasonIds,
    i18next.language
  );
  // --- END: Hooks ------------------------------------------------------------

  // --- Local State ------------------------------------------------------------
  const lang = i18next.language;
  const values = new Map<number, IReasonsByIdData>();
  // --- END: Local State -------------------------------------------------------

  // --- Side effects ----------------------------------------------------------
  useEffect(() => {
    if (user && reasonsIds) addReasonIds(reasonsIds);
  }, [reasonsIds]);

  useEffect(() => {
    if (!pending && reasonsResponse)
      reasonsResponse.map((reason) => {
        if (reason) values.set(reason.reasonID, { ...reason, lang });
      });
  }, [pending, reasonsResponse]);

  useEffect(() => {
    if (values.size !== 0) {
      ExceptionLocalService.insertMultiple([...values.values()]);
      setReasons([...values.values()]);
    }
  }, [values]);
  // --- END: Side effects -----------------------------------------------------
}
