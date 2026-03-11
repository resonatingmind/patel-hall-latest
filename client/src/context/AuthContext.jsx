import React, { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:5000";

/** Fetch the role for the given Supabase session from the backend DB. */
const fetchRoleFromAPI = async (session) => {
  try {
    const res = await fetch(`${API_URL}/api/users/me`, {
      headers: { Authorization: `Bearer ${session.access_token}` },
    });

    if (!res.ok) return null;

    const data = await res.json();

    localStorage.setItem("user_role", data.role);

    return data.role ?? null;
  } catch {
    return null;
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("Setting data");
    const initSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      setUser(session?.user ?? null);

      if (session) {
        const cachedRole = localStorage.getItem("user_role");

        if (cachedRole) {
          setRole(cachedRole);
        } else {
          const dbRole = await fetchRoleFromAPI(session);
          setRole(dbRole);
        }
      }

      setLoading(false);
    };

    initSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setUser(session?.user ?? null);

      if (session) {
        const dbRole = await fetchRoleFromAPI(session);
        setRole(dbRole);
      } else {
        setRole(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const value = {
    user,
    role,
    loading,
    hasRole: (requiredRole) => {
      if (!user || !role) return false;
      if (role === "ADMIN") return true;
      // OTHER role (staff members) only get basic access, no portal access
      if (role === "OTHER") return false;
      if (requiredRole === "STUDENT") return true; // every authenticated user
      if (role === "WARDEN") return true;
      if (
        role === "COUNCIL" &&
        requiredRole !== "WARDEN" &&
        requiredRole !== "ADMIN"
      )
        return true;
      return role === requiredRole;
    },
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
