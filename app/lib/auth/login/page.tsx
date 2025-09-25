'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { signIn } from '../../services/authService';
import loginImg from "../../assets/images/login.png"; 

export default function LoginPage() {
  const router = useRouter(); // NAVIGASI ANTAR HALAMAN
  const searchParams = useSearchParams(); // UNTUK MENGAMBIL QUERY PARAM DARI URL

  // STATE UNTUK INPUT & STATUS
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  // STATE UNTUK FEEDBACK KE USER
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  // MENGAMBIL PESAN SUKSES DARI URL (MISALNYA SETELAH REGISTER REDIRECT KE LOGIN? message = cek-email)
  useEffect(() => {
    const successMessage = searchParams.get('message');
    if (successMessage) {
      setMessage(successMessage);
    }
  }, [searchParams]);

  /**
   * FUNGSI HANDLE LOGIN
   * - MEMANGGIL signIn DARI authService
   * - JIKA BERHASIL → TAMPILKAN PESAN SUKSES + REDIRECT KE DASHBOARD
   * - JIKA GAGAL → TAMPILKAN PESAN ERROR
   */
  const handleSignIn = async () => {
    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      await signIn(email, password);

      // MENAMPILKAN NOTIFIKASI SUKSES LOGIN
      setMessage('Login berhasil! Anda akan diarahkan ke dashboard...');

      // REDIRECT SETELAH 1 DETIK 
      setTimeout(() => {
        router.push('../dashboard');
      }, 1000);

    } catch (err) {
      // MENANGKAP ERROR (contoh : invalid login credentials)
      const errorMsg = (err as Error).message;
      if (errorMsg.includes('Invalid login credentials')) {
        setError('Email atau password salah. Silakan coba lagi.');
      } else {
        setError(errorMsg);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 dark:bg-gray-900 font-poppins text-gray-800 dark:text-gray-200">
      <div className="flex flex-col lg:flex-row max-w-6xl w-full p-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
        
        {/* GAMBAR LOGIN */}
        <div className="hidden lg:flex items-center justify-center p-8 flex-1">
          <Image src={loginImg} alt="Login Illustration" width={600} height={600} />
        </div>

        {/* FORM LOGIN */}
        <div className="flex flex-col items-center justify-center p-8 flex-1">
          <h1 className="text-4xl font-bold mb-2">Login</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            Login dengan memasukan email dan password!
          </p>

          {/* PESAN ERROR & SUKSES */}
          {error && <p className="text-red-500 text-center mb-4">{error}</p>}
          {message && <p className="text-green-500 text-center mb-4">{message}</p>}

          <form 
            onSubmit={(e) => { e.preventDefault(); handleSignIn(); }} 
            className="w-full max-w-sm"
          >
            {/* INPUT EMAIL */}
            <div className="relative mb-4">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email Address"
                required
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={loading}
              />              
            </div>

            {/* INPUT PASSWORD */}
            <div className="relative mb-4">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                required
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={loading}
              />                            
            </div>

            {/* TOMBOL LOGIN */}
            <button
              type="submit"
              className=" mt-3 mb-2 w-full bg-blue-500 font-bold text-2xl text-white py-3 px-4 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-400 cursor-pointer transition-colors duration-200"
              disabled={loading}
            >
              {loading ? 'Memproses...' : 'Login'}
            </button>

            {/* LUPA PASSWORD */}
            <div className="flex justify-end mb-2">
              <button 
                type="button" 
                className="cursor-pointer text-blue-500 hover:text-blue-600 text-sm"
                onClick={() => router.push('/auth/reset-password')}
              >
                Lupa password?
              </button>
            </div>
          </form>
          
          {/* LINK KE REGISTER */}
          <div className="mt-6 text-sm">
            <p className="text-gray-600 dark:text-gray-400">
              Belum punya akun?
              <button
                className="text-blue-500 cursor-pointer hover:text-blue-600 ml-1"
                onClick={() => router.push('/auth/register')}
              >
                Register
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
