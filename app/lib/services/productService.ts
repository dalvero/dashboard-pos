
import { supabase } from "../supabaseClient";

/**
 * TIPE DATA PRODUK
 */
export interface Product {
  id: number;
  name: string;
  price: number;
  image: string | null;
  created_at: string;
}

/**
 * TIPE DATA INPUT UNTUK MEMBUAT/UPDATE PRODUK
 */
export interface ProductInput {
  name: string;
  price: number;
  image?: string | null;  
}

/**
 * FUNGSI UNTUK MEMBUAT PRODUK BARU
 * @param productData OBJECT - DATA PRODUK { name, price, image }
 * @returns DATA PRODUK YANG BERHASIL DIBUAT
 * @throws ERROR JIKA GAGAL MEMBUAT PRODUK
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
 * @param params OBJECT - OPSIONAL FILTER { limit, sortBy, order, search }
 *   - limit NUMBER: BATAS JUMLAH PRODUK
 *   - sortBy STRING: NAMA KOLOM UNTUK SORTING (default: created_at)
 *   - order STRING: "asc" | "desc" (default: desc)
 *   - search STRING: KEYWORD UNTUK MENCARI BERDASARKAN NAMA PRODUK
 * @returns LIST DATA PRODUK
 * @throws ERROR JIKA GAGAL MENGAMBIL PRODUK
 */
export const getProducts = async (params?: {
  limit?: number;
  sortBy?: keyof Product;
  order?: "asc" | "desc";
  search?: string;
}): Promise<Product[]> => {
  let query = supabase.from("products").select("*");

  if (params?.search) {
    query = query.ilike("name", `%${params.search}%`);
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
 * @param id NUMBER - ID PRODUK
 * @returns DATA PRODUK YANG DITEMUKAN
 * @throws ERROR JIKA PRODUK TIDAK DITEMUKAN
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
 * @param id NUMBER - ID PRODUK YANG AKAN DIUPDATE
 * @param productData OBJECT - DATA PRODUK YANG AKAN DIUBAH { name?, price?, image? }
 * @returns DATA PRODUK YANG TELAH DIUPDATE
 * @throws ERROR JIKA GAGAL MENGUPDATE PRODUK
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
 * @param id NUMBER - ID PRODUK YANG AKAN DIHAPUS
 * @returns BOOLEAN - TRUE JIKA BERHASIL MENGHAPUS
 * @throws ERROR JIKA GAGAL MENGHAPUS PRODUK
 */
export const deleteProduct = async (id: number): Promise<boolean> => {
  const { error } = await supabase.from("products").delete().eq("id", id);

  if (error) throw new Error(`Gagal menghapus produk: ${error.message}`);
  return true;
};


export const getProductCount = async () => {
  const { count, error } = await supabase
    .from("products")
    .select("*", { count: "exact", head: true }); // head:true = TIDAK AMBIL DATA, HANYA COUNT

  if (error) throw error;
  return count || 0;
};
