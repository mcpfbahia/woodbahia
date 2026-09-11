"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { type User, onAuthStateChanged, signOut as firebaseSignOut } from "firebase/auth";
import { auth, db } from "~/lib/firebase";
import { doc, getDoc } from "firebase/firestore";

export interface OperadorData {
  uid: string;
  name: string;
  email: string;
  role: "admin" | "vendedor" | "consultor";
}

interface AuthContextType {
  user: User | null;
  operador: OperadorData | null;
  loading: boolean;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  operador: null,
  loading: true,
  logout: async () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [operador, setOperador] = useState<OperadorData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!auth) {
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      
      if (user && db) {
        try {
          const docRef = doc(db, "operadores", user.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            setOperador(docSnap.data() as OperadorData);
          } else {
            setOperador(null);
          }
        } catch (error) {
          console.error("Erro ao buscar dados do operador:", error);
          setOperador(null);
        }
      } else {
        setOperador(null);
      }
      
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const logout = async () => {
    if (auth) {
      await firebaseSignOut(auth);
    }
  };

  return (
    <AuthContext.Provider value={{ user, operador, loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
