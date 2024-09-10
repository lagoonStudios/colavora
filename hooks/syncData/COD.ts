import i18next from "i18next";
import { useEffect } from "react";

import { useStore } from "@stores/zustand";
import { insertMultipleCOD } from "@hooks/SQLite";
import { ICODData, IFetchUserData } from "@constants/types/general";
import { useCODIdData, useCODByIdData } from "@hooks/queries";

export function useCODFetch(user: IFetchUserData | null) {
  // --- Hooks -----------------------------------------------------------------
  const { addCODIds, CODIds, setCODs } = useStore();

  const { data: CODIdsData } = useCODIdData(user?.companyID);
  const { data: dataCODs, pending } = useCODByIdData(CODIds, i18next.language);
  // --- END: Hooks ------------------------------------------------------------

  // --- Local State ------------------------------------------------------------
  const lang = i18next.language
  const values = new Map<number, ICODData>()
  // --- END: Local State -------------------------------------------------------

  // --- Side effects ----------------------------------------------------------
  useEffect(() => {
    if (user && CODIdsData) addCODIds(CODIdsData);
  }, [CODIdsData]);

  useEffect(() => {
    if (!pending && dataCODs) {
      dataCODs.map((COD) => {
        if (COD)
          values.set(COD.codTypeID, { ...COD, lang })
      });
    }
  }, [dataCODs, pending]);

  useEffect(() => {
    if (values.size !== 0) {
      insertMultipleCOD([...values.values()])
      setCODs([...values.values()])
    }
  }, [values])
  // --- END: Side effects -----------------------------------------------------
}