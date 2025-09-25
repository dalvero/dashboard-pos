import { supabase } from "../supabaseClient";

export interface Recipe {
  id: number;
  product_id: number;
  material_id: number;
  quantity_needed: number;
  created_at: string;
}

export interface RecipeInput {
  product_id: number;
  material_id: number;
  quantity_needed: number;
}

export const createRecipe = async (recipeData: RecipeInput): Promise<Recipe> => {
  const { data, error } = await supabase
    .from("recipes")
    .insert([recipeData])
    .select()
    .single();

  if (error) throw new Error(`Gagal membuat resep: ${error.message}`);
  return data as Recipe;
};

export const getRecipes = async (): Promise<Recipe[]> => {
  const { data, error } = await supabase.from("recipes").select("*");

  if (error) throw new Error(`Gagal mengambil resep: ${error.message}`);
  return data as Recipe[];
};

export const getRecipesByProduct = async (productId: number): Promise<Recipe[]> => {
  const { data, error } = await supabase
    .from("recipes")
    .select("*")
    .eq("product_id", productId)
    .order("id", { ascending: true }); // opsional: urutkan
  if (error) throw new Error(`Gagal mengambil resep untuk produk ${productId}: ${error.message}`);
  return data as Recipe[];
};

export const updateRecipe = async (
  id: number,
  recipeData: Partial<RecipeInput>
): Promise<Recipe> => {
  const { data, error } = await supabase
    .from("recipes")
    .update(recipeData)
    .eq("id", id)
    .select()
    .single();

  if (error) throw new Error(`Gagal update resep: ${error.message}`);
  return data as Recipe;
};

export const deleteRecipe = async (id: number): Promise<boolean> => {
  const { error } = await supabase.from("recipes").delete().eq("id", id);
  if (error) throw new Error(`Gagal menghapus resep: ${error.message}`);
  return true;
};


