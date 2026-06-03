import { supabase } from "./supabase";

export async function getSales() {
  const { data, error } = await supabase
    .from("sales")
    .select("*");

  if (error) throw error;

  return data;
}