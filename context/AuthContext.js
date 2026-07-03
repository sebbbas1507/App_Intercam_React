import React, { createContext, useState, useEffect } from "react";
import { getAuth } from "firebase/auth";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const auth = getAuth();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      setUser(authUser || null);
    });

    return unsubscribe;
  }, []);

  return <AuthContext.Provider value={user}>{children}</AuthContext.Provider>;
};
