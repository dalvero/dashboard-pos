'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import { supabase } from '../supabaseClient';
import { Menu, X, Home, Package, Boxes, BarChart2, LogOut, Milk, CookingPot } from 'lucide-react';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = async () => {
    setLoading(true);
    await supabase.auth.signOut();
    router.push('/auth/login');
  };

  return (
    <div className="flex min-h-screen dark:bg-gray-800">
      {/* SIDEBAR */}
      <aside
        className={`
          fixed lg:static top-0 left-0 h-screen w-64 z-40
          transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} 
          lg:translate-x-0
          transition-transform duration-300 ease-in-out
          dark:bg-gray-900 text-white p-4 flex flex-col
        `}
      >
        {/* HEADER + CLOSE */}
        <div className="mb-8 flex justify-between items-center">
          <h2 className="text-2xl font-bold">Dashboard POS</h2>
          <button
            className="lg:hidden p-2 hover:bg-gray-700 rounded"
            onClick={() => setIsOpen(false)}
          >
            <X size={24} />
          </button>
        </div>

        {/* NAVIGATION */}
        <nav className="flex-1">
          <ul>
            {/* DASHBOARD */}
            <li className="mb-2">
              <Link
                href="./dashboard"
                className={`flex items-center gap-2 p-2 rounded transition-all duration-200 ${
                  pathname === '/dashboard'
                    ? 'bg-blue-700'
                    : 'hover:bg-blue-800 hover:translate-x-1'
                }`}
              >
                <Home size={18} /> Dashboard
              </Link>
            </li>

            {/* MANAJEMEN PRODUK */}
            <li className="mb-2">
              <Link
                href="./products"
                className={`flex items-center gap-2 p-2 rounded transition-all duration-200 ${
                  pathname === '/products'
                    ? 'bg-blue-700'
                    : 'hover:bg-blue-800 hover:translate-x-1'
                }`}
              >
                <Package size={18} /> Manajemen Produk
              </Link>
            </li>

            {/* KATEGORI PRODUK */}
            <li className="mb-2">
              <Link
                href="./categories"
                className={`flex items-center gap-2 p-2 rounded transition-all duration-200 ${
                  pathname === '/boxes'
                    ? 'bg-blue-700'
                    : 'hover:bg-blue-800 hover:translate-x-1'
                }`}
              >
                <Boxes size={18} /> Kategori Produk
              </Link>
            </li>
            
            {/* MANAJEMEN BAHAN BAKU */}
            <li className="mb-2">
              <Link href="./materials" className={`flex items-center gap-2 p-2 rounded transition-all duration-200 ${
                    pathname === '/reports'
                      ? 'bg-blue-700'
                      : 'hover:bg-blue-800 hover:translate-x-1'
                  }`
                }
              >
                <Milk size={18} /> Bahan Baku
              </Link>
            </li>

            {/* MANAJEMEN RECIPES */}
            <li className="mb-2">
              <Link href="./recipes" className={`flex items-center gap-2 p-2 rounded transition-all duration-200 ${
                    pathname === '/reports'
                      ? 'bg-blue-700'
                      : 'hover:bg-blue-800 hover:translate-x-1'
                  }`
                }
              >
                <CookingPot size={18} /> Recipes
              </Link>
            </li>

            {/* LAPORAN */}
            <li className="mb-2">
              <Link
                href="/reports"
                className={`flex items-center gap-2 p-2 rounded transition-all duration-200 ${
                  pathname === '/reports'
                    ? 'bg-blue-700'
                    : 'hover:bg-blue-800 hover:translate-x-1'
                }`}
              >
                <BarChart2 size={18} /> Laporan
              </Link>
            </li>
          </ul>
        </nav>

        {/* LOGOUT */}
        <div className="mt-auto">
          <button
            onClick={handleLogout}
            className="cursor-pointer flex items-center gap-2 w-full text-left p-2 rounded hover:bg-red-600 disabled:bg-red-400 transition-all duration-200"
            disabled={loading}
          >
            <LogOut size={18} />
            {loading ? 'Logging out...' : 'Logout'}
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <div className="flex-1 flex flex-col">
        {/* TOPBAR */}
        <header className="lg:hidden flex items-center justify-between p-4 bg-gray-900 text-white">
          <button
            className="p-2 hover:bg-gray-700 rounded"
            onClick={() => setIsOpen(true)}
          >
            <Menu size={24} />
          </button>
          <h1 className="font-bold">Dashboard POS</h1>
        </header>

        {/* CONTENT */}
        <main className="flex-1 p-8 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
