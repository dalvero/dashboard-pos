'use client'

import { useState } from 'react';
import { supabase } from '../../lib/supabaseClient'; 
import Image from 'next/image';
import { useRouter } from 'next/navigation';

import registerImg from "../../assets/images/register.png"; 
import { signUp } from '../../lib/services/authService';

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState(''); 
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const router = useRouter(); // MENGGUNAKAN useRouter UNTUK NAVIGASI

  const handleRegister = async () => {    
    setLoading(true);
    setError('');

    if (!email || !password) {
      setError('Email dan password harus diisi.');
      setLoading(false);
      return;
    }

    try {
       await signUp(email, password, username);
      router.push('/auth/login?message=Cek emailmu untuk verifikasi.');
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 dark:bg-gray-900 font-poppins text-gray-800 dark:text-gray-200">
      <div className="flex flex-col lg:flex-row max-w-6xl w-full p-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
        {/* FORM REGISTER */}
        <div className="flex flex-col items-center justify-center p-8 flex-1">
          <h1 className="text-4xl font-bold mb-2">
            Register
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            Register dengan masukkan email dan password.
          </p>

          {/* ERROR & MESSAGE */}
          {error && <p className="text-red-500 text-center mb-4">{error}</p>}
          {message && <p className="text-blue-500 text-center mb-4">{message}</p>}

          <form onSubmit={(e) => { e.preventDefault(); handleRegister(); }} className="w-full max-w-sm">
            {/* USERNAME INPUT */}
            <div className="relative mb-4">
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Username"
                required
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg 
                bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-200 
                focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={loading}
              />
            </div>

            {/* EMAIL INPUT*/}
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

            {/* TOMBOL REGISTER */}
            <button
              type="submit"
              className="w-full font-bold text-2xl bg-blue-500 text-white py-3 px-4 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-400 cursor-pointer transition-colors duration-200"
              disabled={loading}
            >
              {loading ? 'Loading...' : 'Register'}
            </button>
          </form>

          {/* LINK UNTUK KEMBALI KE LOGIN */}
          <div className="mt-6 text-sm">
            <p className="text-gray-600 dark:text-gray-400">
              Sudah punya akun?
              <button
                className="text-blue-500 hover:text-blue-600 cursor-pointer ml-1"
                onClick={() => router.push('/auth/login')}
              >
                Login
              </button>
            </p>
          </div>
        </div>

        {/* ILLUSTRATION */}
        <div className="hidden lg:flex items-center justify-center p-8 flex-1">
          <Image src={registerImg} alt="Register Illustration" width={600} height={600} />
        </div>
      </div>
    </div>
  );
}