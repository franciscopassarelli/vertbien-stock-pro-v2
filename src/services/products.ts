import { supabase } from "./supabase";

export async function getProducts() {
  const { data, error } = await supabase
    .from("productos")
    .select("*");

  if (error) throw error;

  return data;
}