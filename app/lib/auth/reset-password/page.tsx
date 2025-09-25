'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { supabase } from '../../supabaseClient';

// Ganti dengan path ilustrasi kamu
import resetPasswordImg from "../../assets/images/reset_password.png";

export default function ResetPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/update-password`, 
    });

    if (resetError) {
      setError(resetError.message);
    } else {
      setMessage('Tautan reset password sudah dikirim. Silakan cek email Anda.');
    }

    setLoading(false);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 dark:bg-gray-900 font-poppins text-gray-800 dark:text-gray-200">
      <div className="flex flex-col lg:flex-row max-w-6xl w-full p-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
        {/* FORM RESET PASSWORD */}
        <div className="flex flex-col items-center justify-center p-8 flex-1">
          <h1 className="text-4xl font-bold mb-2">
            Lupa Password?
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-8 text-center">
            Masukkan email Anda untuk menerima instruksi reset password.
          </p>

          {/* Menampilkan pesan error atau sukses */}
          {error && <p className="text-red-500 text-center mb-4">{error}</p>}
          {message && <p className="text-blue-500 text-center mb-4">{message}</p>}
          
          <form onSubmit={handleReset} className="w-full max-w-sm">
            {/* INPUT EMAIL */}
            <div className="relative mb-4">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email Address"
                required
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            {/* TOMBOL KIRIM */}
            <button
              type="submit"
              disabled={loading}
              className="font-bold cursor-pointer w-full bg-blue-500 text-white py-3 px-4 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-400 transition-colors duration-200"
            >
              {loading ? 'Memproses...' : 'Kirim Tautan Reset'}
            </button>
          </form>

          {/* TOMBOL KEMBALI KE LOGIN */}
          <div className="mt-6 text-sm">
            <Link href="/auth/login" className="text-blue-500 hover:text-blue-600 cursor-pointer">
              Kembali ke Halaman Login
            </Link>
          </div>
        </div>

        {/* ILUSTRASI */}
        <div className="hidden lg:flex items-center justify-center p-8 flex-1">
          <Image src={resetPasswordImg} alt="Reset Password Illustration" width={600} height={600} />
        </div>
      </div>
    </div>
  );
}