import './globals.css';
import { Poppins } from 'next/font/google'; // MENGIMPOR FONT POPPINS DARI GOOGLE
import { Toaster } from "react-hot-toast";

// FONT STYLE
const poppins = Poppins({
  subsets: ['latin'],

  // REGULAR, MEDIUM, SEMIBOLD, DAN BOLD
  weight: ['400', '500', '600', '700'], 
});

export const metadata = {
  title: 'POS Dashboard',
  description: 'Point of Sale Dashboard',
};

export default function RootLayout({ children }) {
  // HANYA MEMASUKAN 'children' DI SINI
  // TATA LETAK DASHBOARD AKAN DITERAPKAN DI HALAMAN DASHBOARD ITU SENDIRI
  return (
    <html lang="en">
      <body className={poppins.className}>
        {children}
        <Toaster position="top-right" reverseOrder={false} />
      </body>
    </html>
  );
}