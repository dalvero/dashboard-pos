'use client';

import DashboardLayout from '../components/DashboardLayout';
import { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { getProfile } from '../services/authService';
import { getProductCount } from "../services/productService";
import { getCategoriesCount } from '../services/categoriesService';

interface Profile {
  id: string;
  username: string;
  role: string;    
}

export default function DashboardPage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [totalProducts, setTotalProducts] = useState<number>(0);
  const [totalCategories, setTotalCategories] = useState<number>(0);

  useEffect(() => {
    const fetchProfile = async () => {
      // MENGAMBIL USER YANG SEDANG LOGIN
      const { data: userData, error: userError } = await supabase.auth.getUser();
      if (userError || !userData.user) {
        console.error("User tidak ditemukan:", userError?.message);
        return;
      }

      const userId = userData.user.id;

      // MENGAMBIL DATA PROFILE DARI TABEL PROFILES
      try {
        const data = await getProfile(userId);
        setProfile(data);
      } catch (err: any) {
        console.error("Gagal ambil profile:", err.message);
      }
    };

    fetchProfile();
  }, []);

  useEffect(() => {
    const fetchCount = async () => {
      try {
        const count = await getProductCount();        
        setTotalProducts(count);
      } catch (error: any) {
        console.error("Gagal ambil total produk:", error.message);
      }
    };

    fetchCount();
  }, []);

  useEffect(() => {
    const fetchCount = async () => {
      try {
        const count = await getCategoriesCount();        
        setTotalCategories(count);
      } catch (error: any) {
        console.error("Gagal ambil total produk:", error.message);
      }
    };

    fetchCount();
  }, []);

  return (
    <DashboardLayout>      
      {profile ? (
        <div className="mt-4 mb-4">          
          <h1 className="text-3xl font-bold text-white mb-6">Dashboard <span>{profile.role}</span></h1>
          <h1 className='text-white font-bold text-5xl'><span>Hallo, </span>{profile.username}</h1>                    
        </div>
      ) : (
        <p className="text-gray-400 mt-4 font-bold mb-4 text-5xl">Loading profile...</p>
      )}
      <div className="grid grid-cols-1  sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* CONTOH CARD STATISTIK */}
        <div className="dark:bg-gray-900 p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-600">Total Penjualan</h2>
          <p className="text-4xl font-bold mt-2">$123.456</p>
        </div>

        <div className="dark:bg-gray-900 p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-600">Jumlah Transaksi</h2>
          <p className="text-4xl font-bold mt-2">1.039</p>
        </div>
        
        <div className="dark:bg-gray-900 p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-600">Jumlah Produk</h2>
          <p className="text-4xl font-bold mt-2">{totalProducts}</p>
        </div>
        
        <div className="dark:bg-gray-900 p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-600">Jumlah Kategori</h2>
          <p className="text-4xl font-bold mt-2">{totalCategories}</p>
        </div>

        <div className="dark:bg-gray-900 p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-600">Stok Habis</h2>
          <p className="text-4xl font-bold mt-2 text-red-500">20</p>
        </div>
      </div>
    </DashboardLayout>
  );
}