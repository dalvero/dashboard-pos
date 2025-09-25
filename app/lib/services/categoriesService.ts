import { supabase } from "../supabaseClient";

/**
 * TIPE DATA PRODUK
 */
export interface Categories {
    id: number;
    name: string;    
    created_at: string;
}

/**
 * TIPE DATA INPUT UNTUK MEMBUAT/UPDATE PRODUK
 */
export interface CategoriesInput {
    name: string;    
}

/**
 * FUNGSI UNTUK MEMBUAT PRODUK BARU
 * @param categoriesData OBJECT - DATA KATEGORI { name }
 * @returns DATA KATEGORI YANG BERHASIL DIBUAT
 * @throws ERROR JIKA GAGAL MEMBUAT KATEGORI
 */
export const createCategories = async (categoriesData: CategoriesInput): Promise<Categories> => {
  const { data, error } = await supabase
    .from("categories")
    .insert([categoriesData])
    .select()
    .single();

  if (error) throw new Error(`Gagal membuat kategori : ${error.message}`);
  return data as Categories;
};

/**
 * FUNGSI UNTUK MENGAMBIL SEMUA KATEGORI
 * @param params OBJECT - OPSIONAL FILTER { limit, sortBy, order, search }
 *   - limit NUMBER: BATAS JUMLAH KATEGORI
 *   - sortBy STRING: NAMA KOLOM UNTUK SORTING (default: created_at)
 *   - order STRING: "asc" | "desc" (default: desc)
 *   - search STRING: KEYWORD UNTUK MENCARI BERDASARKAN NAMA KATEGORI
 * @returns LIST DATA KATEGORI
 * @throws ERROR JIKA GAGAL MENGAMBIL KATEGORI
 */
export const getCategories = async (params?: {
  limit?: number;
  sortBy?: keyof Categories;
  order?: "asc" | "desc";
  search?: string;
}): Promise<Categories[]> => {
  let query = supabase.from("categories").select("*");

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

  if (error) throw new Error(`Gagal mengambil kategori: ${error.message}`);
  return data as Categories[];
};

/**
 * FUNGSI UNTUK MENGAMBIL KATEGORI BERDASARKAN ID
 * @param id NUMBER - ID KATEGORI
 * @returns DATA KATEGORI YANG DITEMUKAN
 * @throws ERROR JIKA KATEGORI TIDAK DITEMUKAN
 */
export const getCategoriesById = async (id: number): Promise<Categories> => {
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw new Error(`Kategori tidak ditemukan: ${error.message}`);
  return data as Categories;
};

/**
 * FUNGSI UNTUK UPDATE KATEGORI
 * @param id NUMBER - ID KATEGORI YANG AKAN DIUPDATE
 * @param categoriesData OBJECT - DATA KATEGORI YANG AKAN DIUBAH { name? }
 * @returns DATA KATEGORI YANG TELAH DIUPDATE
 * @throws ERROR JIKA GAGAL MENGUPDATE KATEGORI
 */
export const updateCategories = async (
  id: number,
  categoriesData: Partial<CategoriesInput>
): Promise<Categories> => {
  const { data, error } = await supabase
    .from("categories")
    .update(categoriesData)
    .eq("id", id)
    .select()
    .single();

  if (error) throw new Error(`Gagal update kategori: ${error.message}`);
  return data as Categories;
};

/**
 * FUNGSI UNTUK MENGHAPUS KATEGORI
 * @param id NUMBER - ID KATEGORI YANG AKAN DIHAPUS
 * @returns BOOLEAN - TRUE JIKA BERHASIL MENGHAPUS
 * @throws ERROR JIKA GAGAL MENGHAPUS KATEGORI
 */
export const deleteCategories = async (id: number): Promise<boolean> => {
  const { error } = await supabase.from("categories").delete().eq("id", id);

  if (error) throw new Error(`Gagal menghapus kategori: ${error.message}`);
  return true;
};

export const getCategoriesCount = async () => {
  const { count, error } = await supabase
    .from("categories")
    .select("*", { count: "exact", head: true }); // head:true = TIDAK AMBIL DATA, HANYA COUNT

  if (error) throw error;
  return count || 0;
};