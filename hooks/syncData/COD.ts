import i18next from "i18next";
import { useEffect } from "react";

import { useStore } from "@stores/zustand";
import { IFetchUserData } from "@constants/types/general";
import { useCODIdData, useCODByIdData } from "@hooks/queries";
import { CODLocalService } from "../../db/repositories/cod.repository";
import { TCODData } from "@/db/schema/cod";

export function useCODFetch(user: IFetchUserData | null) {
  // --- Hooks -----------------------------------------------------------------
  const { addCODIds, CODIds, setCODs } = useStore();

  const { data: CODIdsData } = useCODIdData(user?.companyID);
  const { data: dataCODs, pending } = useCODByIdData(CODIds, i18next.language);
  // --- END: Hooks ------------------------------------------------------------

  // --- Local State ------------------------------------------------------------
  const lang = i18next.language;
  const values = new Map<number, TCODData>();
  // --- END: Local State -------------------------------------------------------

  // --- Side effects ----------------------------------------------------------
  useEffect(() => {
    if (user && CODIdsData) addCODIds(CODIdsData);
  }, [CODIdsData]);

  useEffect(() => {
    if (!pending && dataCODs) {
      dataCODs.map((COD) => {
        if (COD)
          values.set(COD.codTypeID, {
            ...COD,
            lang,
            isSync: false,
            lastSync: "",
          });
      });
    }
  }, [dataCODs, pending]);

  useEffect(() => {
    if (values.size !== 0) {
      CODLocalService.insertMultiple([...values.values()]);
      setCODs([...values.values()]);
    }
  }, [values]);
  // --- END: Side effects -----------------------------------------------------
}
