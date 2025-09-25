import { supabase } from "../supabaseClient";

/**
 * TIPE DATA PRODUK
 */
export interface Materials {
    id: number;
    name: string;    
    stock: number;
    unit: string;
    created_at: string;
}

/**
 * TIPE DATA INPUT UNTUK MEMBUAT/UPDATE PRODUK
 */
export interface MaterialsInput {
    name: string;    
    stock: number;
    unit: string; 
}

/**
 * FUNGSI UNTUK MEMBUAT MATERIAL BARU
 * @param materialsData OBJECT - DATA MATERIAL { name }
 * @returns DATA MATERIAL YANG BERHASIL DIBUAT
 * @throws ERROR JIKA GAGAL MEMBUAT MATERIAL
 */
export const createMaterials = async (materialsData: MaterialsInput): Promise<Materials> => {
  const { data, error } = await supabase
    .from("raw_materials")
    .insert([materialsData])
    .select()
    .single();

  if (error) throw new Error(`Gagal membuat bahan baku : ${error.message}`);
  return data as Materials;
};

/**
 * FUNGSI UNTUK MENGAMBIL SEMUA MATERIAL
 * @param params OBJECT - OPSIONAL FILTER { limit, sortBy, order, search }
 *   - limit NUMBER: BATAS JUMLAH MATERIAL
 *   - sortBy STRING: NAMA KOLOM UNTUK SORTING (default: created_at)
 *   - order STRING: "asc" | "desc" (default: desc)
 *   - search STRING: KEYWORD UNTUK MENCARI BERDASARKAN NAMA MATERIAL
 * @returns LIST DATA MATERIAL
 * @throws ERROR JIKA GAGAL MENGAMBIL MATERIAL
 */
export const getMaterials = async (params?: {
  limit?: number;
  sortBy?: keyof Materials;
  order?: "asc" | "desc";
  search?: string;
}): Promise<Materials[]> => {
  let query = supabase.from("raw_materials").select("*");

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
  return data as Materials[];
};

/**
 * FUNGSI UNTUK MENGAMBIL MATERIALS BERDASARKAN ID
 * @param id NUMBER - ID MATERIALS
 * @returns DATA MATERIALS YANG DITEMUKAN
 * @throws ERROR JIKA MATERIALS TIDAK DITEMUKAN
 */
export const getMaterialsById = async (id: number): Promise<Materials> => {
  const { data, error } = await supabase
    .from("raw_materials")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw new Error(`Bahan baku tidak ditemukan: ${error.message}`);
  return data as Materials;
};

/**
 * FUNGSI UNTUK UPDATE MATERIALS
 * @param id NUMBER - ID MATERIALS YANG AKAN DIUPDATE
 * @param materialsData OBJECT - DATA MATERIALS YANG AKAN DIUBAH { name? }
 * @returns DATA MATERIALS YANG TELAH DIUPDATE
 * @throws ERROR JIKA GAGAL MENGUPDATE MATERIALS
 */
export const updateMaterials = async (
  id: number,
  materialsData: Partial<MaterialsInput>
): Promise<Materials> => {
  const { data, error } = await supabase
    .from("raw_materials")
    .update(materialsData)
    .eq("id", id)
    .select()
    .single();

  if (error) throw new Error(`Gagal update bahan baku: ${error.message}`);
  return data as Materials;
};

/**
 * FUNGSI UNTUK MENGHAPUS MATERIALS
 * @param id NUMBER - ID MATERIALS YANG AKAN DIHAPUS
 * @returns BOOLEAN - TRUE JIKA BERHASIL MENGHAPUS
 * @throws ERROR JIKA GAGAL MENGHAPUS MATERIALS
 */
export const deleteMaterials = async (id: number): Promise<boolean> => {
  const { error } = await supabase.from("raw_materials").delete().eq("id", id);

  if (error) throw new Error(`Gagal menghapus bahan baku: ${error.message}`);
  return true;
};

export const getMaterialsCount = async () => {
  const { count, error } = await supabase
    .from("raw_materials")
    .select("*", { count: "exact", head: true }); // head:true = TIDAK AMBIL DATA, HANYA COUNT

  if (error) throw error;
  return count || 0;
};