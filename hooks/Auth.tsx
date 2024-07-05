import { useEffect, useState } from "react";
import { useAuth0 } from "react-native-auth0";

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

export function useAuth() {
  return useAuth0();
}

export function useUser() {
  const { user } = useAuth();
  return user;
}
