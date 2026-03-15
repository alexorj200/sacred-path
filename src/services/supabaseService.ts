import { supabase } from "@/integrations/supabase/client";

export { supabase };

/* =========================
   CONTENT
========================= */

export const getContent = async () => {
  const { data, error } = await supabase
    .from("content")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;

  return data;
};

/* =========================
   PROGRESS
========================= */

export const getProgress = async (userId: string) => {
  const { data, error } = await supabase
    .from("progress")
    .select("*")
    .eq("user_id", userId);

  if (error) throw error;

  return data;
};

/* =========================
   PROFILES
========================= */

export const getProfile = async (userId: string) => {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();

  if (error) throw error;

  return data;
};