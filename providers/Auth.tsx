import { AuthContext } from "@stores/AuthContext";
import React, { useState } from "react";
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
  const [token, setToken] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const saveToken = (token: string) => {
    setToken(token);
    setIsLoggedIn(true);
  };

  const logout = () => {
    setToken("");
    setIsLoggedIn(false);
  };
  return (
    <Auth0Provider domain={domain} clientId={clientId}>
      <AuthContext.Provider value={{ token, isLoggedIn, saveToken, logout }}>
        {children}
      </AuthContext.Provider>
    </Auth0Provider>
  );
}
