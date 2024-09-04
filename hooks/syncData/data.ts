import { useState, useEffect, useMemo, useCallback } from "react";

import { useStore } from "@stores/zustand";
import { IFetchUserData } from "@constants/types/general";
import { useTranslation } from "react-i18next";
import { fetchData } from "@utils/functions";
import { differenceInCalendarDays } from 'date-fns';
import { insertMultipleManifests, insertMultipleShipments } from "@hooks/SQLite";
import { insertMultipleComments } from "@hooks/SQLite/queries/comments.local.queries";
import { insertMultiplePieces } from "@hooks/SQLite/queries/pieces.local.queries";



export function useDataFetch(user: IFetchUserData | null) {
  // --- Local state -----------------------------------------------------------
  const [success, setSuccess] = useState(false);
  // --- END: Local state ------------------------------------------------------

  // --- Hooks -----------------------------------------------------------------
  const {
    addManifestIds,
    setModal,
    setVisible,
    setSyncing,
    setLastSyncDate,
    lastSyncDate
  } = useStore();
  const { t } = useTranslation();
  // --- END: Hooks ------------------------------------------------------------

  // --- Data and handlers -----------------------------------------------------------
  const createdDate = useMemo(() => {
    const date = new Date();

    date.setTime(date.getTime() - 14 * 24 * 60 * 60 * 1000);
    date.setHours(1);
    date.setMinutes(0);
    date.setSeconds(0);
    date.setMilliseconds(0);

    return date.toISOString();
  }, [])

  const fetchDataLocally = useCallback((user: IFetchUserData) => {
    setSyncing(true);
      fetchData(user, { 
        t, 
        optionalDate: createdDate, 
        setModalMessage: setModal, 
      }).then((values) => {
        setLastSyncDate(new Date().toISOString());
        insertMultipleManifests(values.manifests).then(() => {
          insertMultipleShipments(values.shipments).then(() => {
            insertMultipleComments(values.comments);
            insertMultiplePieces(values.pieces);
          });
        });

        addManifestIds(values.manifests.map(({ manifest }) => Number(manifest)))
        setSyncing(false);
        setVisible(false);
      })
      .catch(() => {
        setSyncing(false);
        setVisible(false);
      })
  }, [])
  // --- END: Data and handlers ------------------------------------------------------

  // --- Side effects ----------------------------------------------------------
  useEffect(() => {
    if (user && lastSyncDate === null) {
      fetchDataLocally(user)
    } else if(user && lastSyncDate !== null){
      const actualDate = new Date();
      const lastDate = new Date(lastSyncDate);
      
      /* TO DO: si la diferencia de fecha es 0 requerir la local data para meterla en zustand */
      if(differenceInCalendarDays(actualDate, lastDate) > 0) fetchDataLocally(user)
    }
  }, [user])
  // --- END: Side effects -----------------------------------------------------

  return { success };
}