import { mockDriverId } from "@constants/Constants";
import { useAuth0UserInfoData, useDriverDataByAuth0, useUserData } from "@hooks/queries";
import { useState, useEffect } from "react";
import { useStore } from "@stores/zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";

export function useDriverFetch() {
  // --- Local state -----------------------------------------------------------
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const [userEmail, setUserEmail] = useState<string>();
  const [userId, setUserId] = useState<number>();
  const [auth0Id, setAuth0Id] = useState<string>();
  // --- END: Local state ------------------------------------------------------

  // --- Hooks -----------------------------------------------------------------
  const { user, addUser } = useStore();  
  const { data: userInfo } = useAuth0UserInfoData(userEmail);
  const { data: users } = useDriverDataByAuth0(auth0Id);
  const { data: userData, isSuccess } = useUserData(userId);  
  // --- END: Hooks ------------------------------------------------------------

  // --- Side effects ----------------------------------------------------------
  useEffect(() => {
    const getData = async () => {
      try {
        const jsonValue = await AsyncStorage.getItem("auth0:email");
        if (jsonValue != null) setUserEmail(jsonValue);
      } catch (e) {
        // error reading value
      }
    };

    getData();
  }, [])

  useEffect(() => {
    if(userInfo) setAuth0Id(userInfo?.sub)
  }, [userInfo])

  useEffect(() => {
    if(users && users?.length !== 0) setUserId(users?.[0])
  }, [users])

  useEffect(() => {
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
    if (isSuccess && user) setLoading(false);
  }, [isSuccess]);

  useEffect(() => {
    if(loading === false) setSuccess(true)
  }, [loading])
  // --- END: Side effects -----------------------------------------------------

  return { success, loading };
}