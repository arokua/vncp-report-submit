"use client";
import { createContext, useEffect, useState } from "react";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";

export const UserCtx = createContext(null);

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    return onAuthStateChanged(auth, u =>
      setUser(u ? { uid: u.uid, email: u.email } : null)
    );
  }, []);

  return <UserCtx.Provider value={user}>{children}</UserCtx.Provider>;
}
