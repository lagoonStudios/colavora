import { useAuth0UserInfoData, useDriverDataByAuth0, useUserData } from "@hooks/queries";
import { useState, useEffect } from "react";
import { useStore } from "@stores/zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTranslation } from "react-i18next";
import { useIsConnected } from "react-native-offline";
import { IFetchUserData } from "@constants/types/general";

export function useDriverFetch() {
  // --- Local state -----------------------------------------------------------
  const [userEmail, setUserEmail] = useState<string>();
  const [userId, setUserId] = useState<number>();
  const [auth0Id, setAuth0Id] = useState<string>();
  // --- END: Local state ------------------------------------------------------

  // --- Hooks -----------------------------------------------------------------
  const isConnected = useIsConnected();
  const { t } = useTranslation();
  const { user, addUser, setModal, setVisible } = useStore();
  const { data: userInfo } = useAuth0UserInfoData(userEmail);
  const { data: users } = useDriverDataByAuth0(auth0Id);
  const { data: userData } = useUserData(userId);
  // --- END: Hooks ------------------------------------------------------------

  // --- Side effects ----------------------------------------------------------
  useEffect(() => {
    const getData = async () => {
      try {
        const jsonValue = await AsyncStorage.getItem("auth0:email");
        if (jsonValue != null) setUserEmail(jsonValue);
      } catch (e) {}
    };

    const getLocalData = async () => {
      try {
        const jsonValue = await AsyncStorage.getItem("auth0:user");
        if (jsonValue != null) {
          const localUser = JSON.parse(jsonValue) as IFetchUserData
          addUser(localUser)
        }
      } catch (e) {}
    }

    if (isConnected && user === null) getData();
    else if(user === null) getLocalData();
  }, [isConnected, user])

  useEffect(() => {
    if (isConnected)
      if (userInfo) {
        setModal(t("MODAL.FETCHING_USER"))
        setAuth0Id(userInfo?.sub)
      }
  }, [isConnected, userInfo])

  useEffect(() => {
    if (isConnected)
      if (users && users?.length !== 0) setUserId(users?.[0])
  }, [isConnected, users])

  useEffect(() => {
    if (isConnected)
      if (userData && userInfo) {
        const newUser = {
          ...userData,
          driverName: userInfo?.name,
          driverID: userData?.userID,
          logo: userInfo?.picture,
        }
        addUser(newUser)
      }
  }, [userData, userInfo]);

  useEffect(() => {
    if (user !== null) {
      AsyncStorage.setItem("auth0:user", JSON.stringify(user));
      setVisible(false);
    }
  }, [user]);
  // --- END: Side effects -----------------------------------------------------

  return;
}