import { useEffect, useState } from "react";

export function useAuth0Config() {
  const [domain, setDomain] = useState<string>("");
  const [clientId, setClientId] = useState<string>("");

  useEffect(() => {
    const domain = process.env.EXPO_PUBLIC_AUTH0_DOMAIN;
    const clientId = process.env.EXPO_PUBLIC_AUTH0_CLIENT_ID;
    if (domain == undefined || clientId == undefined) {
      throw new Error("Missing Auth0 configuration");
    }

    setDomain(domain);
    setClientId(clientId);
  }, []);

  return { domain, clientId };
}
