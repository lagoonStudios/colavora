import { useEffect, useState } from "react";
import { useAuth0 } from "react-native-auth0";

export function useAuth0Config() {
  const [domain, setDomain] = useState<string>("");
  const [clientId, setClientId] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    setLoading(true);
    const domain = process.env.EXPO_PUBLIC_AUTH0_DOMAIN;
    const clientId = process.env.EXPO_PUBLIC_AUTH0_CLIENT_ID;
    console.log({ domain, clientId });
    if (domain == undefined || clientId == undefined) {
      setError(new Error("Missing Auth0 configuration"));
      throw new Error("Missing Auth0 configuration");
    }

    if (domain != undefined && clientId != undefined) {
      setLoading(false);
      setDomain(domain);
      setClientId(clientId);
    }
  }, []);

  return { domain, clientId, loading, error };
}

export function useAuth() {
  return useAuth0();
}

export function useUser() {
  const { user } = useAuth();
  return user;
}
