import React, { useContext } from "react";

export const AuthContext = React.createContext();
export const BadgeContext = React.createContext();
export const StatuscodeContext = React.createContext();

export const useAuthCtx = () => useContext(AuthContext);
