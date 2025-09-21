// IMPORT INSTANCE Supabase CLIENT YANG SUDAH DIKONFIGURASI DI FILE supabaseClient.ts
import { supabase } from '../supabaseClient';

/**
 * FUNGSI UNTUK MELAKUKAN LOGIN (SIGN IN) DENGAN EMAIL & PASSWORD
 * @param email STRING - ALAMAT EMAIL USER
 * @param password STRING - PASSWORD USER
 * @returns DATA USER YANG BERHASIL LOGIN
 * @throws ERROR JIKA LOGIN GAGAL
 */
export const signIn = async (email: string, password: string) => {
  // MEMANGGIL FUNGSI BAWAAN Supabase UNTUK LOGIN DENGAN EMAIL & PASSWORD
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  // JIKA ADA ERROR (email tidak terdaftar, password salah, dls)
  if (error) throw error;

  // JIKA BERHASIL, KEMBALIKAN DATA USER (BERISI SESSION DAN USER INFO)
  return data;
};

/**
 * FUNGSI UNTUK MELAKUKAN REGISTRASI (SIGN UP) USER BARU
 * @param email STRING - ALAMAT EMAIL USER
 * @param password STRING - PASSWORD USER
 * @param username STRING - USERNAME USER
 * @returns DATA USER YANG BERHASIL DAFTAR (BIASANYA BUTUH VERIFIKASI EMAIL)
 * @throws ERROR JIKA SIGN UP GAGAL
 */
export const signUp = async (email: string, password: string, username: string) => {
 const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${window.location.origin}/auth/login` // REDIRECT KE LOGIn
    },
  });

  if (error) throw error;

  const user = data.user;
  if (!user) throw new Error("User tidak ditemukan setelah signup.");

  // SIMPAN KE TABEL PROFILES
  const { error: profileError } = await supabase
    .from("profiles")
    .insert([{ id: user.id, username, role: "admin" }]);

  if (profileError) throw profileError;

  return data;
};

/**
 * FUNGSI UNTUK MENGAMBIL DATA USER
 * @param userId STRING - USER ID YANG BERHASIL LOGIN
 * @returns DATA USER YANG BERHASIL LOGIN
 * @throws ERROR JIKA  GAGAL
 */
export const getProfile = async (userId: string) => {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();

  if (error) throw error;
  return data;
};


/**
 * FUNGSI UNTUK LOGOUT (SIGN OUT) USER
 * @returns VOID JIKA BERHASIL LOGOUT
 * @throws ERROR JIKA LOGOUT GAGAL
 */
export const signOut = async () => {
  // MEMANGGIL FUNGSI BAWAAN Supabase UNTUK LOGOUT
  const { error } = await supabase.auth.signOut();

  // JIKA ADA ERROR (tidak ada session aktif)
  if (error) throw error;
};
