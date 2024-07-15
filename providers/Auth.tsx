import { auth } from "@hooks/Auth";
import { AuthContext } from "@stores/AuthContext";
import React, { useCallback, useEffect, useState } from "react";
import { Auth0Provider } from "react-native-auth0";

export default function AuthProvider({
  children,
  domain,
  clientId,
}: {
  children: React.ReactNode;
  domain: string;
  clientId: string;
}) {
  // --- Hooks -----------------------------------------------------------------
  const [token, setToken] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  // --- END: Hooks ------------------------------------------------------------

  // --- Data and handlers -----------------------------------------------------
  const saveToken = (token: string) => {
    setToken(token);
    setIsLoggedIn(true);
  };

  const logout = () => {
    setToken("");
    setIsLoggedIn(false);
    return auth?.credentialsManager.clearCredentials();
  };

  const checkCredentials = useCallback(() => {
    auth?.credentialsManager.getCredentials().then((creds) => {});
  }, []);
  // --- END: Data and handlers ------------------------------------------------

  // --- Side effects ----------------------------------------------------------
  useEffect(() => {
    checkCredentials();
  }, [checkCredentials]);
  // --- END: Side effects -----------------------------------------------------

  return (
    <Auth0Provider domain={domain} clientId={clientId}>
      <AuthContext.Provider value={{ token, isLoggedIn, saveToken, logout }}>
        {children}
      </AuthContext.Provider>
    </Auth0Provider>
  );
}
