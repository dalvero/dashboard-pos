'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '../../lib/supabaseClient';

import updatePasswordImg from "../../assets/images/update_password.png"; 

export default function UpdatePasswordPage() {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const router = useRouter();

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);
    
    if (newPassword !== confirmPassword) {
      setError('Password dan konfirmasi password tidak cocok.');
      setLoading(false);
      return;
    }

    const { error } = await supabase.auth.updateUser({ password: newPassword });

    if (error) {
      setError(error.message);
    } else {
      setMessage('Password berhasil diperbarui, silakan login.');
      setTimeout(() => router.push('/auth/login'), 2000);
    }

    setLoading(false);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 dark:bg-gray-900 font-poppins text-gray-800 dark:text-gray-200">
      <div className="flex flex-col lg:flex-row max-w-6xl w-full p-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
        
        {/* ILUSTRASI */}
        <div className="hidden lg:flex items-center justify-center p-8 flex-1">
          <Image src={updatePasswordImg} alt="Update Password Illustration" width={600} height={600} />
        </div>

        {/* FORM UPDATE PASSWORD */}
        <div className="flex flex-col items-center justify-center p-8 flex-1">
          <h1 className="text-4xl font-bold mb-2">Buat Password Baru</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-8 text-center">
            Masukkan password baru Anda di bawah ini.
          </p>

          {/* ERROR & MESSAGE */}
          {error && <p className="text-red-500 mb-4">{error}</p>}
          {message && <p className="text-green-500 mb-4">{message}</p>}

          <form onSubmit={handleUpdate} className="w-full max-w-sm">
            {/* INPUT PASSWORD BARU */}
            <div className="relative mb-4">
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Password Baru"
                required
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* INPUT KONFIRMASI PASSWORD */}
            <div className="relative mb-4">
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Konfirmasi Password"
                required
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* TOMBOL UPDATE */}
            <button
              type="submit"
              className="font-bold cursor-pointer w-full bg-blue-500 text-white py-3 px-4 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200"
              disabled={loading}
            >
              {loading ? 'Mengubah...' : 'Ubah Password'}
            </button>
          </form>

          <div className="mt-6 text-sm">
            <Link href="/auth/login" className="text-blue-500 hover:text-blue-600 cursor-pointer">
              Kembali ke Halaman Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
