// src/hooks/useAuth.ts
import { useEffect, useState } from "react";
import { supabase } from "../services/supabaseService";

interface User {
  id: string;
  email: string;
  name: string;
  role: "admin" | "member";
}

/**
 * Hook de autenticação com verificação de role.
 * @param requiredRole Opcional: "admin" ou "member" para restringir acesso
 * @returns { user, loading }
 */
export function useAuth(requiredRole?: "admin" | "member") {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getUser = async () => {
      const { data: sessionData } = await supabase.auth.getSession();
      const session = sessionData.session;

      if (!session) {
        setUser(null);
        setLoading(false);
        return;
      }

      const userId = session.user.id;

      // busca dados do usuário no Supabase
      const { data: profile, error } = await supabase
        .from("profiles")
        .select("id, email, name, role")
        .eq("id", userId)
        .single();

      if (error) {
        console.error("Erro ao buscar perfil:", error);
        setUser(null);
      } else if (requiredRole && profile.role !== requiredRole) {
        // role exigida não corresponde
        setUser(null);
      } else {
        setUser(profile as User);
      }

      setLoading(false);
    };

    getUser();

    // escuta mudanças de sessão (login/logout)
    const { data: listener } = supabase.auth.onAuthStateChange(() => {
      getUser();
    });

    return () => listener.subscription.unsubscribe();
  }, [requiredRole]);

  return { user, loading };
}
