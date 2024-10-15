import { useState, useEffect, useCallback } from "react";
import { useStore } from "@stores/zustand";
import { useTranslation } from "react-i18next";
import { useIsConnected } from "react-native-offline";
import useAuth from "@hooks/Auth";
import Toast from "react-native-root-toast";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { IFetchAuth0UserInfo, IFetchUserData } from "@constants/types/general";
import {
  fetchAuth0UserInfo,
  fetchCompanyData,
  fetchDriverDataByAuth0,
  fetchUserData,
} from "@services/custom-api";

export function useDriverFetch() {
  // --- Local state -----------------------------------------------------------
  const [setOnce] = useState<boolean>(false);
  // --- END: Local state ------------------------------------------------------

  // --- Hooks -----------------------------------------------------------------
  const { t } = useTranslation();
  const { clearSession } = useAuth();
  const isConnected = useIsConnected();

  const { user, addUser, addCompany, setModal, hideModal } = useStore();
  // --- END: Hooks ------------------------------------------------------------

  // --- Data and handlers ------------------------------------------------------------
  const getData = useCallback(async () => {
    const jsonValue = await AsyncStorage.getItem("auth0:email");
    if (jsonValue != null) {
      const response = await fetchAuth0UserInfo();

      if (response?.data) {
        const auth0UserInfo = response.data as IFetchAuth0UserInfo;

        const { data: users } = await fetchDriverDataByAuth0({
          id: auth0UserInfo.sub,
        });

        if (users && users?.length !== 0) {
          const id = String(users[0]);
          const { data: userData } = await fetchUserData(id);

          if (userData && auth0UserInfo) {
            const newUser = {
              ...userData,
              driverName: auth0UserInfo.name ?? "",
              driverID: userData.userID,
              logo: auth0UserInfo.picture,
            };

            const { data: companyData } = await fetchCompanyData(
              userData.companyID,
            );

            if (companyData) {
              const company = { ...companyData, logo: newUser.logo };

              addUser(newUser);
              addCompany(company);
            }
          }
        }
      }
    }
  }, [addCompany, addUser]);

  const getLocalData = useCallback(async () => {
    const jsonValue = await AsyncStorage.getItem("auth0:user");
    if (jsonValue != null) {
      const user: IFetchUserData = JSON.parse(jsonValue) as IFetchUserData;
      const newUser = {
        ...user,
      };
      const { data: companyData } = await fetchCompanyData(user.companyID);

      if (companyData && newUser?.logo) {
        const company = { ...companyData, logo: newUser.logo };

        addUser(newUser);
        addCompany(company);
      }
    }
  }, [addCompany, addUser]);
  // --- END: Data and handlers -------------------------------------------------------

  // --- Side effects ----------------------------------------------------------
  useEffect(() => {
    try {
      if (setOnce === false)
        if (Boolean(isConnected) && user === null) void getData();
        else if (user === null) void getLocalData();
    } catch (error) {
      console.error("🚀 ~ file: user.ts:31  ~ e:", error);

      setModal(t("MODAL.FETCHING_USER_ERROR"));
      setTimeout(() => {
        clearSession();
        Toast.show(t("TOAST.USER_FAIL"));
        hideModal({});
      }, 600);
    }
  }, [
    clearSession,
    getData,
    getLocalData,
    hideModal,
    isConnected,
    setModal,
    setOnce,
    t,
    user,
  ]);

  useEffect(() => {
    if (user !== null)
      void AsyncStorage.setItem("auth0:user", JSON.stringify(user));
  }, [user]);

  // --- END: Side effects -----------------------------------------------------

  return;
}
