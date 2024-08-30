import { mockDriverId } from "@constants/Constants";
import { useAuth0UserInfoData, useDriverData } from "@hooks/queries";
import { useState, useEffect } from "react";
import { useStore } from "@stores/zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";

export function useDriverFetch() {
  // --- Local state -----------------------------------------------------------
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const [user, setUser] = useState<string>();
  // --- END: Local state ------------------------------------------------------

  // --- Hooks -----------------------------------------------------------------
  const { driver, addDriver } = useStore();  
  const { data: userInfo } = useAuth0UserInfoData(user);
  const { data: driverData, isSuccess } = useDriverData(mockDriverId);  
  // --- END: Hooks ------------------------------------------------------------

  // --- Side effects ----------------------------------------------------------
  useEffect(() => {
    const getData = async () => {
      try {
        const jsonValue = await AsyncStorage.getItem("auth0:email");
        if (jsonValue != null) setUser(jsonValue);
      } catch (e) {
        // error reading value
      }
    };

    getData();
  }, [])

  useEffect(() => {
    if (driverData && userInfo) {
      const newDriver = {
        ...driverData,
        driverName: userInfo?.name,
        logo: userInfo?.picture,
      }
      addDriver(newDriver)
    }
  }, [driverData, userInfo]);
  
  useEffect(() => {
    if (isSuccess && driver) setLoading(false);
  }, [isSuccess]);

  useEffect(() => {
    if(loading === false) setSuccess(true)
  }, [loading])
  // --- END: Side effects -----------------------------------------------------

  return { success, loading };
}