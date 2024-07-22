import { AuthContext } from "@stores/AuthContext";
import { useContext, useEffect, useState } from "react";
import Auth0 from "react-native-auth0";
import handleErrorMessage from "./ErrorMessage";

const CONNECTION = "Username-Password-Authentication";
const AUDIENCE = `https://${process.env.EXPO_PUBLIC_AUTH0_DOMAIN}/api/v2/`;

export const auth =
  process.env.EXPO_PUBLIC_AUTH0_DOMAIN &&
  process.env.EXPO_PUBLIC_AUTH0_CLIENT_ID
    ? new Auth0({
        domain: process.env.EXPO_PUBLIC_AUTH0_DOMAIN,
        clientId: process.env.EXPO_PUBLIC_AUTH0_CLIENT_ID,
      })
    : undefined;

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
      });

      auth.credentialsManager.saveCredentials(credentials);

      saveToken(credentials.accessToken);
    } catch (error) {
      handleErrorMessage({ error });
    } finally {
      setLoading(false);
    }
  };

  const clearSession = () => {
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
