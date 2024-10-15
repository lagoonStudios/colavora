import Auth0 from "react-native-auth0";
import { useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

import handleErrorMessage from "./ErrorMessage";
import { AuthContext } from "@stores/AuthContext";
import { createAllDBTables } from "./SQLite";

const CONNECTION = "Username-Password-Authentication";
const AUDIENCE = `https://${process.env.EXPO_PUBLIC_AUTH0_DOMAIN}/api/v2/`;

export const auth = new Auth0({
  domain: process.env.EXPO_PUBLIC_AUTH0_DOMAIN!,
  clientId: process.env.EXPO_PUBLIC_AUTH0_CLIENT_ID!,
});

export function useAuth0Config() {
  const [domain, setDomain] = useState<string>("");
  const [clientId, setClientId] = useState<string>("");
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    setLoaded(false);
    const envDomain = process.env.EXPO_PUBLIC_AUTH0_DOMAIN;
    const envClientId = process.env.EXPO_PUBLIC_AUTH0_CLIENT_ID;

    if (envDomain == undefined || envClientId == undefined) {
      setError(new Error("Missing Auth0 configuration"));
      throw new Error("Missing Auth0 configuration");
    }

    if (envDomain != undefined && envClientId != undefined) {
      setDomain(envDomain);
      setClientId(envClientId);
      setLoaded(true);
    }
  }, []);

  return { domain, clientId, loaded, error };
}

export default function useAuth() {
  const { token, isLoggedIn, saveToken, logout } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);

  const login = async ({
    userName,
    password,
  }: {
    userName: string;
    password: string;
  }) => {
    if (!auth) throw new Error("Auth0 not configured");

    try {
      setLoading(true);

      const credentials = await auth.auth.passwordRealm({
        username: userName,
        password,
        realm: CONNECTION,
        audience: AUDIENCE,
        scope: "openid profile email",
      });
      void createAllDBTables().then(() => {
        saveToken(credentials.accessToken, userName);
        void AsyncStorage.setItem("auth0:token", credentials.accessToken).then(
          () => {
            setLoading(false);
          },
        );
      });
    } catch (error) {
      handleErrorMessage({ error });
      setLoading(false);
    }
  };

  const clearSession = () => {
    void auth?.credentialsManager?.clearCredentials?.();
    logout();
  };

  return {
    isLoggedIn,
    token,
    loading,
    login,
    clearSession,
  };
}
