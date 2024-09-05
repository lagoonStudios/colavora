import i18next from "i18next";
import { useEffect } from "react";

import { useStore } from "@stores/zustand";
import { insertMultipleCOD } from "@hooks/SQLite";
import { mockCompanyId } from "@constants/Constants";
import { IFetchUserData } from "@constants/types/general";
import { useCODIdData, useCODByIdData } from "@hooks/queries";

export function useCODFetch(user: IFetchUserData | null) {
  // --- Hooks -----------------------------------------------------------------
  const { addCODIds, CODIds, addCOD, CODs } = useStore();

  const { data: CODIdsData } = useCODIdData(user?.companyID);
  const { data: dataCODs, pending } = useCODByIdData(CODIds, i18next.language);
  // --- END: Hooks ------------------------------------------------------------

  // --- Side effects ----------------------------------------------------------
  useEffect(() => {
    if (CODIdsData) addCODIds(CODIdsData);
  }, [CODIdsData]);

  useEffect(() => {
    if (pending === false)
      dataCODs?.map((COD) => {
        if (COD) addCOD(COD);
      });
  }, [dataCODs, pending]);

  useEffect(() => {
    if (CODs)
      if (CODs?.length !== 0)
        insertMultipleCOD(CODs?.map((COD) => ({ ...COD, lang: i18next.language })))
  }, [CODs])
  // --- END: Side effects -----------------------------------------------------
}