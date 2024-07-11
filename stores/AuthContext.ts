import { createContext } from "react";

export interface AuthContextType {
    token: string;
    isLoggedIn: boolean;
    saveToken: (token: string) => void;
    logout: () => void;
}

export const AuthContext = createContext<AuthContextType>({
    token: "",
    isLoggedIn: false,
    saveToken: (token: string) => { }
    ,
    logout: () => { },
});
