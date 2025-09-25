import { supabase } from "../supabaseClient";

/**
 * TIPE DATA PRODUK
 */
export interface Product {
  id: number;
  name: string;
  price: number;
  image: string | null;
  categories_id: number | null; // kolom baru
  created_at: string;
}

/**
 * TIPE DATA INPUT UNTUK MEMBUAT/UPDATE PRODUK
 */
export interface ProductInput {
  name: string;
  price: number;
  image?: string | null;
  categories_id?: number | null; // kolom baru opsional
}

/**
 * FUNGSI UNTUK MEMBUAT PRODUK BARU
 */
export const createProduct = async (
  productData: ProductInput
): Promise<Product> => {
  const { data, error } = await supabase
    .from("products")
    .insert([productData])
    .select()
    .single();

  if (error) throw new Error(`Gagal membuat produk: ${error.message}`);
  return data as Product;
};

/**
 * FUNGSI UNTUK MENGAMBIL SEMUA PRODUK
 */
export const getProducts = async (params?: {
  limit?: number;
  sortBy?: keyof Product;
  order?: "asc" | "desc";
  search?: string;
  categories_id?: number; // filter berdasarkan kategori
}): Promise<Product[]> => {
  let query = supabase.from("products").select("*");

  if (params?.search) {
    query = query.ilike("name", `%${params.search}%`);
  }

  if (params?.categories_id) {
    query = query.eq("categories_id", params.categories_id);
  }

  if (params?.sortBy) {
    query = query.order(params.sortBy, { ascending: params.order === "asc" });
  } else {
    query = query.order("created_at", { ascending: false });
  }

  if (params?.limit) {
    query = query.limit(params.limit);
  }

  const { data, error } = await query;

  if (error) throw new Error(`Gagal mengambil produk: ${error.message}`);
  return data as Product[];
};

/**
 * FUNGSI UNTUK MENGAMBIL PRODUK BERDASARKAN ID
 */
export const getProductById = async (id: number): Promise<Product> => {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw new Error(`Produk tidak ditemukan: ${error.message}`);
  return data as Product;
};

/**
 * FUNGSI UNTUK UPDATE PRODUK
 */
export const updateProduct = async (
  id: number,
  productData: Partial<ProductInput>
): Promise<Product> => {
  const { data, error } = await supabase
    .from("products")
    .update(productData)
    .eq("id", id)
    .select()
    .single();

  if (error) throw new Error(`Gagal update produk: ${error.message}`);
  return data as Product;
};

/**
 * FUNGSI UNTUK MENGHAPUS PRODUK
 */
export const deleteProduct = async (id: number): Promise<boolean> => {
  const { error } = await supabase.from("products").delete().eq("id", id);

  if (error) throw new Error(`Gagal menghapus produk: ${error.message}`);
  return true;
};

/**
 * FUNGSI UNTUK MENGHITUNG TOTAL PRODUK
 */
export const getProductCount = async () => {
  const { count, error } = await supabase
    .from("products")
    .select("*", { count: "exact", head: true });

  if (error) throw error;
  return count || 0;
};
