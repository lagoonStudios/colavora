import React from "react";
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
  return (
    <Auth0Provider domain={domain} clientId={clientId}>
      {children}
    </Auth0Provider>
  );
}
