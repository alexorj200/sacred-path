import { supabase } from "@/integrations/supabase/client";

// ── Profiles ──

export const getProfile = async (userId: string) => {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("user_id", userId)
    .single();
  if (error) throw error;
  return data;
};

export const isAdmin = async (userId: string): Promise<boolean> => {
  const { data, error } = await supabase
    .from("profiles")
    .select("role")
    .eq("user_id", userId)
    .single();
  if (error) return false;
  return data?.role === "admin";
};

// ── Content ──

export const getContent = async (category?: string) => {
  let query = supabase.from("content").select("*").order("created_at", { ascending: false });
  if (category) query = query.eq("category", category);
  const { data, error } = await query;
  if (error) throw error;
  return data;
};

export const getContentById = async (id: string) => {
  const { data, error } = await supabase
    .from("content")
    .select("*")
    .eq("id", id)
    .single();
  if (error) throw error;
  return data;
};

// ── Progress ──

export const getUserProgress = async (userId: string) => {
  const { data, error } = await supabase
    .from("progress")
    .select("*, content(*)")
    .eq("user_id", userId);
  if (error) throw error;
  return data;
};

export const markContentCompleted = async (userId: string, contentId: string) => {
  const { data, error } = await supabase
    .from("progress")
    .upsert(
      { user_id: userId, content_id: contentId, completed: true, completed_at: new Date().toISOString() },
      { onConflict: "user_id,content_id" }
    )
    .select()
    .single();
  if (error) throw error;
  return data;
};

export const getContentProgress = async (userId: string, contentId: string) => {
  const { data, error } = await supabase
    .from("progress")
    .select("*")
    .eq("user_id", userId)
    .eq("content_id", contentId)
    .maybeSingle();
  if (error) throw error;
  return data;
};

// ── Subscriptions ──

export const getUserSubscription = async (userId: string) => {
  const { data, error } = await supabase
    .from("subscriptions")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  if (error) throw error;
  return data;
};
