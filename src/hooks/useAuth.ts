import { useEffect, useState } from "react";
import { supabase } from "../services/supabaseService";

export function useAuth() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    // pega sessão atual
    const session = supabase.auth.session();
    setUser(session?.user ?? null);

    // escuta mudanças de autenticação (login/logout)
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => listener.unsubscribe();
  }, []);

  return user;
}
