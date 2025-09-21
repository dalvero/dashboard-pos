import Link from 'next/link';

export default function LandingPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen dark:bg-gray-800">
      <h1 className="text-4xl font-bold mb-4">
        Selamat Datang
      </h1>
      <p className="text-lg text-gray-600 mb-8">
        Silakan masuk untuk melanjutkan ke dashboard.
      </p>
      
      <Link href="/auth/login" passHref>
        <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg transition-colors duration-200">
          Mulai Sekarang
        </button>
      </Link>
    </div>
  );
}