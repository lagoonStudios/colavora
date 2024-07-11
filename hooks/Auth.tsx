import { ERROR_CODE } from "@constants/Errors";
import { AuthContext } from "@stores/AuthContext";
import { useContext, useEffect, useState } from "react";
import { Alert } from "react-native";
import Auth0 from "react-native-auth0";

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
    // const envDomain = "dev-ghex3xcv4jb2pti7.us.auth0.com";
    // const envClientId = "d7kLct8IHrc3RtrAYhZKa7lX9SecWd5r";

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

// export function useUser() {
//   const { user } = useAuth0();
//   return user;
// }

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
      console.log("login:", { userName, password });
      // const user = await auth.auth.createUser({
      //   connection: CONNECTION,
      //   name: userName,
      //   email: userName,
      //   password,
      // });
      // console.log("login:", { user });

      // if (!user?.Id) {
      //   throw new Error(ERROR_CODE.USER_NOT_CREATED);
      // }

      const { accessToken } = await auth.auth.passwordRealm({
        username: userName,
        password,
        realm: CONNECTION,
        audience: AUDIENCE,
      });

      saveToken(accessToken);
    } catch (error) {
      console.error("Error loged in:", { error });
      Alert.alert(
        "Sign in failed",
        "We couldn't sign you in. Please try again."
      );
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

// export function useLogin() {
//   const [loading, setLoading] = useState(true);
//   const nativeLogin = async ({
//     userName,
//     password,
//   }: {
//     userName: string;
//     password: string;
//   }) => {
//     try {
//       if (!auth) throw new Error("Auth0 not configured");

//       const user = await auth.auth.createUser({
//         connection: CONNECTION,
//         email: userName,
//         password,
//         name: userName,
//       });
//       console.log({ user });
//       if (!user?.Id) {
//         throw new Error("User not created");
//       }

//       const credentials = await auth.auth.passwordRealm({
//         username: userName,
//         password,
//         realm: CONNECTION,
//         audience: AUDIENCE,
//       });

//       const { accessToken } = credentials;
//       console.log({ accessToken });
//       // saveToken(accessToken);
//       if (!credentials.idToken) {
//         throw new Error("Credentials not created");
//       }
//     } catch (error) {
//       console.error({ error });
//     } finally {
//       setLoading(false);
//     }
//   };

//   return { loading, nativeLogin };
// }
