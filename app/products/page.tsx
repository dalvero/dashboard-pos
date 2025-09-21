"use client";

import { useEffect, useState } from "react";
import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  Product,
} from "../lib/services/productService";
import { supabase } from "../lib/supabaseClient";
import DashboardLayout from "../components/DashboardLayout";
import Image from "next/image";

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // FORM STATE
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formName, setFormName] = useState("");
  const [formPrice, setFormPrice] = useState("");
  const [formImage, setFormImage] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  // SEARCH PRODUK
  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // AMBIL PRODUK DARI SUPABASE
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const data = await getProducts();
      setProducts(data);
    } catch (error: any) {
      console.error("Gagal fetch produk:", error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // UPLOAD GAMBAR KE SUPABASE STORAGE
  const uploadImage = async (file: File): Promise<string> => {
    const fileExt = file.name.split(".").pop();
    const fileName = `${Date.now()}.${fileExt}`;
    const filePath = `products/${fileName}`;

    const { error } = await supabase.storage
      .from("products")
      .upload(filePath, file);

    if (error) throw error;

    const {
      data: { publicUrl },
    } = supabase.storage.from("products").getPublicUrl(filePath);

    return publicUrl;
  };

  // SUBMIT FORM
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      let imageUrl = previewImage || "";

      if (formImage) {
        imageUrl = await uploadImage(formImage);
      }

      if (editingProduct) {
        // UPDATE PRODUK
        const updated = await updateProduct(editingProduct.id, {
          name: formName,
          price: Number(formPrice),
          image: imageUrl,
        });
        setProducts((prev) =>
          prev.map((p) => (p.id === editingProduct.id ? updated : p))
        );
      } else {
        // TAMBAH PRODUK
        const created = await createProduct({
          name: formName,
          price: Number(formPrice),
          image: imageUrl,
        });
        setProducts((prev) => [...prev, created]);
      }

      setIsFormVisible(false);
      resetForm();
    } catch (error: any) {
      alert("Error: " + error.message);
    } finally {
      setSubmitting(false);
    }
  };

  // DELETE PRODUK
  const handleDeleteClick = async (productId: number) => {
    try {
      await deleteProduct(productId);
      setProducts((prev) => prev.filter((p) => p.id !== productId));
      alert(`Produk dengan ID ${productId} berhasil dihapus!`);
    } catch (error: any) {
      alert("Gagal menghapus produk: " + error.message);
    }
  };

  // EDIT PRODUK
  const handleEditClick = (product: Product) => {
    setEditingProduct(product);
    setFormName(product.name);
    setFormPrice(product.price.toString());
    setPreviewImage(product.image);
    setIsFormVisible(true);
  };

  // RESET FORM
  const resetForm = () => {
    setEditingProduct(null);
    setFormName("");
    setFormPrice("");
    setFormImage(null);
    setPreviewImage(null);
  };

  return (
    <DashboardLayout>
      <div className="flex justify-between mb-6">
        <h1 className="text-2xl font-bold">Manajemen Produk</h1>
        <button
          onClick={() => {
            resetForm();
            setIsFormVisible(true);
          }}
          className="cursor-pointer bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Tambah Produk
        </button>
      </div>

      {/* SEARCH BAR */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Cari produk..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* FORM PRODUK */}
      {isFormVisible && (
        <form onSubmit={handleSubmit} className="mb-6 p-4  rounded dark:bg-gray-900" >
          <div className="mb-3">
            <h1 className="mb-5 font-bold text-3xl" >Tambah Produk</h1>
            <label className="block font-bold mb-1">Nama Produk</label>
            <input
              type="text"
              value={formName}
              onChange={(e) => setFormName(e.target.value)}
              className="w-full p-2 border rounded"
              required
            />
          </div>

          <div className="mb-3">
            <label className="block font-bold mb-1">Harga Produk</label>
            <input
              type="number"
              value={formPrice}
              onChange={(e) => setFormPrice(e.target.value)}
              className="w-full p-2 border rounded"
              required
            />
          </div>

          <div className="mb-3 font-bold">
            <label className="block mb-1">Gambar Produk</label>
            <input
              className="cursor-pointer"
              type="file"
              accept="image/*"
              onChange={(e) => {
                if (e.target.files?.[0]) {
                  setFormImage(e.target.files[0]);
                  setPreviewImage(URL.createObjectURL(e.target.files[0]));
                }
              }}
            />
            {previewImage && (
              <img
                src={previewImage}
                alt="Preview"
                className="mt-2 w-32 h-32 object-cover rounded"
              />
            )}
          </div>

          <div className="flex gap-2 font-bold">
            <button
              type="submit"
              disabled={submitting}
              className="bg-green-600 cursor-pointer text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50"
            >
              {submitting
                ? "Menyimpan..."
                : editingProduct
                ? "Update Produk"
                : "Simpan Produk"}
            </button>
            <button
              type="button"
              onClick={() => {
                resetForm();
                setIsFormVisible(false);
              }}
              className="bg-gray-400 cursor-pointer text-white px-4 py-2 rounded hover:bg-gray-500"
            >
              Batal
            </button>
          </div>
        </form>
      )}

      {/* TABEL PRODUK */}
      {loading ? (
        <div className="text-center text-gray-500">Memuat data...</div>
      ) : products.length === 0 ? (
        <div className="text-center text-gray-500">
          Produk kosong, silahkan tambah produk terlebih dahulu.
        </div>
      ) : (
        <table className="w-full">
          <thead>
            <tr className="dark:bg-gray-900">
              <th className="border px-4 py-2">No</th>
              <th className="border px-4 py-2">Nama</th>
              <th className="border px-4 py-2">Harga</th>
              <th className="border px-4 py-2">Gambar</th>
              <th className="border px-4 py-2">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map((p, index) => (                                
              <tr key={p.id}>
                <td className="border text-center px-4 py-2">{index + 1}</td>
                <td className="border text-center px-4 py-2">{p.name}</td>
                <td className="border text-center px-4 py-2">Rp {p.price.toLocaleString()}</td>
                <td className="border text-center px-4 py-2">
                  {p.image ? (
                    <Image
                      src={p.image}
                      alt={p.name}
                      width={100}
                      height={100}
                      className="rounded mx-auto"
                      unoptimized
                    />
                  ) : (
                    <div className="w-12 h-12 flex items-center justify-center bg-gray-700 rounded-full mx-auto">
                      {p.name.charAt(0)}
                    </div>
                  )}
                </td>
                <td className="border px-4 py-2 text-center space-x-2">
                  <button
                    onClick={() => handleEditClick(p)}
                    className="bg-gray-400 text-white px-2 py-1 rounded hover:bg-gray-600 cursor-pointer font-semibold"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteClick(p.id)}
                    className="bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700 cursor-pointer font-semibold"
                  >
                    Hapus
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </DashboardLayout>
  );
}
