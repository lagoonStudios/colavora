import React, { useEffect, useState } from "react";
import { Auth0Provider } from "react-native-auth0";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AuthContext } from "@stores/AuthContext";
import { dropTables } from "@hooks/SQLite";

export default function AuthProvider({
  children,
  clientId,
  domain,
}: {
  children: React.ReactNode;
  domain: string;
  clientId: string;
}) {
  // --- Local State -----------------------------------------------------------------
  const [token, setToken] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  // --- END: Local State ------------------------------------------------------------

  // --- Data and handlers -----------------------------------------------------
  const saveToken = (token: string, userName: string) => {
    setToken(token);
    AsyncStorage.setItem("auth0:email", userName);
  };

  const logout = () => {
    setToken("");
    dropTables();
    setIsLoggedIn(false);
    AsyncStorage.removeItem("auth0:token");
    AsyncStorage.removeItem("auth0:email");
  };

  // --- END: Data and handlers ------------------------------------------------

  // --- Side effects ----------------------------------------------------------
  useEffect(() => {
    const checkCredentials = async () => {
      const localToken = await AsyncStorage.getItem("auth0:token");
      const remainToken = token || localToken;
      setIsLoggedIn(Boolean(remainToken));
    };

    checkCredentials();
  }, [token]);

  // --- END: Side effects ------------------------------------------------
  return (
    <Auth0Provider domain={domain} clientId={clientId}>
      <AuthContext.Provider value={{ token, isLoggedIn, saveToken, logout }}>
        {children}
      </AuthContext.Provider>
    </Auth0Provider>
  );
}
