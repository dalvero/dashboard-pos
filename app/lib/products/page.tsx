// app/products/page.tsx
'use client';

import { useEffect, useState } from "react";
import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  Product,
} from "../services/productService";
import { getCategories, Categories } from "../services/categoriesService";
import { getMaterials, Materials } from "../services/materialsService";
import {
  createRecipe,
  getRecipesByProduct,
  Recipe,
} from "../services/recipesService";
import { supabase } from "../supabaseClient";
import DashboardLayout from "../components/DashboardLayout";
import toast from "react-hot-toast";

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Categories[]>([]);
  const [rawMaterials, setRawMaterials] = useState<Materials[]>([]);  
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategoriesId, setFilterCategoriesId] = useState<number | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const [isFormVisible, setIsFormVisible] = useState(false);
  const [formName, setFormName] = useState("");
  const [formPrice, setFormPrice] = useState("");
  const [formCategoryId, setFormCategoryId] = useState<number | null>(null);
  const [formImage, setFormImage] = useState<File | null>(null);

  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  
  const [showRecipeModal, setShowRecipeModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedProductRecipes, setSelectedProductRecipes] = useState<Recipe[]>([]);
  const [selectedMaterialId, setSelectedMaterialId] = useState<number | null>(null);
  const [quantity, setQuantity] = useState<number>(0);

  useEffect(() => {
    loadProducts();
    loadCategories();
    loadMaterials();
  }, []);

  const loadProducts = async () => {
    const data = await getProducts();
    setProducts(data);
  };

  const loadCategories = async () => {
    const data = await getCategories();
    setCategories(data);
  };

  const loadMaterials = async () => {
    const data = await getMaterials();
    setRawMaterials(data);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      let imageUrl = editingProduct?.image || "";

      if (formImage) {
        const { data, error } = await supabase.storage
          .from("products")
          .upload(`${Date.now()}_${formImage.name}`, formImage);
        if (error) throw error;

        imageUrl = supabase.storage.from("products").getPublicUrl(data.path).data.publicUrl;
      }

      if (editingProduct) {
        const updated = await updateProduct(editingProduct.id, {
          name: formName,
          price: Number(formPrice),
          image: imageUrl,
          categories_id: formCategoryId!,
        });
        setProducts((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
        toast.success("Produk berhasil diperbarui")
      } else {
        const created = await createProduct({
          name: formName,
          price: Number(formPrice),
          image: imageUrl,
          categories_id: formCategoryId!,
        });
        setProducts((prev) => [...prev, created]);
        toast.success("Produk berhasil ditambahkan");
      }

      resetForm();
      setIsFormVisible(false);
    } catch (err: any) {
      toast.error("Gagal menyimpan produk: " + (err.message || err));
    }
  };

  const resetForm = () => {
    setFormName("");
    setFormPrice("");
    setFormCategoryId(null);
    setFormImage(null);
    setEditingProduct(null);
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormName(product.name);
    setFormPrice(product.price.toString());
    setFormCategoryId(product.categories_id);
    setIsFormVisible(true);    
  };

   // POP UP DELETE KONFIRMASI
  const openDeleteModal = (id: number) => {
      setDeleteId(id);
      setIsDeleteModalOpen(true);
  };

  // DELETE KONFIRMASI
  const confirmDelete = async () => {
      if (deleteId === null) return;
      try {
          await deleteProduct(deleteId);
          setCategories((prev) => prev.filter((mat) => mat.id !== deleteId));
          toast.success("Produk berhasil dihapus");
      } catch (error: any) {
          toast.error("Gagal menghapus produk: " + error.message);
      } finally {
          setIsDeleteModalOpen(false);
          setDeleteId(null);
      }
  };

  
  const handleShowRecipes = async (product: Product) => {
    const rec = await getRecipesByProduct(product.id);
    setSelectedProduct(product);
    setSelectedProductRecipes(rec);
    setShowRecipeModal(true);
  };

  const handleAddRecipe = async () => {
    if (!selectedProduct || !selectedMaterialId || !quantity) {
      toast.error("Lengkapi bahan & jumlah dulu");
      return;
    }

    try {
      const newRecipe = await createRecipe({
        product_id: selectedProduct.id,
        material_id: selectedMaterialId,
        quantity_needed: quantity,
      });

      setSelectedProductRecipes((prev) => [...prev, newRecipe]);
      setSelectedMaterialId(null);
      setQuantity(0);
      toast.success("Resep berhasil ditambahkan");
    } catch (error: any) {
      toast.error("Gagal menambahkan resep: " + error.message);
    }
  };


  return (
    <DashboardLayout>
      <div className="p-6">
        <div className="flex justify-between mb-6">
          <h1 className="text-2xl font-bold">Manajemen Produk</h1>
          <button
            onClick={() => {
              resetForm();
              setIsFormVisible(true);
            }}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Tambah Produk
          </button>
        </div>

        {/* FROM PRODUK */}
        {isFormVisible && (
          <form onSubmit={handleSubmit} className="mb-6 p-4 rounded dark:bg-gray-900">
            <h2 className="text-xl font-bold mb-3">
              {editingProduct ? "Edit Produk" : "Tambah Produk Baru"}
            </h2>
            <div className="mb-3">
              <label className="block mb-1 font-bold">Nama Produk</label>
              <input
                type="text"
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                className="w-full border p-2 rounded"
                required
              />
            </div>
            <div className="mb-3">
              <label className="block mb-1 font-bold">Harga</label>
              <input
                type="number"
                value={formPrice}
                onChange={(e) => setFormPrice(e.target.value)}
                className="w-full border p-2 rounded"
                required
              />
            </div>
            <div className="mb-3">
              <label className="block mb-1 font-bold">Kategori</label>
              <select
                value={formCategoryId ?? ""}
                onChange={(e) => setFormCategoryId(Number(e.target.value))}
                className="w-full dark:bg-gray-900 border p-2 rounded"
                required
              >
                <option value="">Pilih kategori</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-3">
              <label className="block mb-1 font-bold">Gambar</label>
              <input
                type="file"
                onChange={(e) => {
                  if (e.target.files?.[0]) {
                    setFormImage(e.target.files[0]);
                  }
                }}
                className="w-full border p-2 rounded"
              />
            </div>

            <div className="flex gap-2 font-bold">
              <button
                type="submit"
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              >
                {editingProduct ? "Update Produk" : "Simpan Produk"}
              </button>
              <button
                type="button"
                onClick={() => {
                  resetForm();
                  setIsFormVisible(false);
                }}
                className="bg-gray-400 text-white px-4 py-2 rounded"
              >
                Batal
              </button>
            </div>
          </form>
        )}

        {/* SEARCH & FILTER */}
        <div className="flex flex-col md:flex-row gap-3 mb-4">
          <input
            type="text"
            placeholder="Cari produk..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="border p-2 rounded w-full md:w-1/3"
          />

          <select
            value={filterCategoriesId ?? ""}
            onChange={(e) =>
              setFilterCategoriesId(e.target.value ? Number(e.target.value) : null)
            }
            className="border p-2 cursor-pointer dark:bg-gray-900 rounded w-full md:w-1/3"
          >
            <option value="">Semua Kategori</option>
            {categories.map((c) => (
              <option  key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>


        {/* TABEL PRODUK */}
        <table className="w-full border">
          <thead>
            <tr className="bg-gray-900 text-white">
              <th className="border p-2">ID</th>
              <th className="border p-2">Nama</th>
              <th className="border p-2">Harga</th>
              <th className="border p-2">Kategori</th>
              <th className="border p-2">Gambar</th>
              <th className="border p-2">Aksi</th>
            </tr>
          </thead>
          <tbody>
              {products
                .filter((p) => p.name.toLowerCase().includes(searchQuery.toLowerCase()))
                .filter((p) => filterCategoriesId ? p.categories_id === filterCategoriesId : true)
                .map((p) => (
              <tr key={p.id}>
                <td className="border text-center p-2">{p.id}</td>
                <td className="border text-center p-2">{p.name}</td>
                <td className="border text-center p-2">{p.price}</td>
                <td className="border text-center p-2">
                  {categories.find((c) => c.id === p.categories_id)?.name}
                </td>
                <td className="border p-2 flex items-center justify-center">
                  {p.image && (
                    <img
                      src={p.image}
                      alt={p.name}
                      className="w-25 h-25 object-cover"
                    />
                  )}
                </td>
                <td className="border text-center p-2 space-x-2">
                  <button
                    onClick={() => handleEdit(p)}
                    className="bg-yellow-500 cursor-pointer text-white px-2 py-1 rounded"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => openDeleteModal(p.id)}
                    className="bg-red-500 cursor-pointer text-white px-2 py-1 rounded"
                  >
                    Hapus
                  </button>
                  <button
                    onClick={() => handleShowRecipes(p)}
                    className="bg-blue-600 cursor-pointer text-white px-2 py-1 rounded"
                  >
                    Lihat Resep
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* MODAL RESEP */}
        {showRecipeModal && selectedProduct && (
          <div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm bg-black/10 z-50">
            <div className="bg-white dark:bg-gray-900 p-4 rounded-2xl w-96">
              <h2 className="text-xl font-bold mb-3">
                Resep {selectedProduct.name}
              </h2>

              <ul className="mb-10 mt-10 text-center">
                {selectedProductRecipes.map((recipe) => {
                  const material = rawMaterials.find((m) => m.id === recipe.material_id);
                  return (
                    <li key={recipe.id}>
                      {material
                        ? `${material.name} - ${recipe.quantity_needed} ${material.unit}`
                        : `Bahan tidak ditemukan (ID: ${recipe.material_id})`}
                    </li>
                  );
                })}
              </ul>

              <div className="flex gap-2 mb-3">
                <select
                  value={selectedMaterialId ?? ""}
                  onChange={(e) => setSelectedMaterialId(Number(e.target.value))}
                  className="w-1/2 dark:bg-gray-900 p-2 border rounded"
                >
                  <option value="">Pilih bahan</option>
                  {rawMaterials.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.name} ({m.unit})
                    </option>
                  ))}
                </select>
                <input
                  type="number"
                  placeholder="Jumlah"
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  className="w-1/3 p-2 border rounded"
                />
                <button
                  type="button"
                  onClick={handleAddRecipe}
                  className="bg-blue-500 cursor-pointer text-white px-3 rounded hover:bg-blue-600"
                >
                  +
                </button>
              </div>

              <button
                onClick={() => setShowRecipeModal(false)}
                className="mt-2 cursor-pointer bg-gray-500 text-white px-4 py-2 rounded"
              >
                Tutup
              </button>
            </div>
          </div>
        )}
      </div>

      {/* MODAL KONFIRMASI DELETE */}
        {isDeleteModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm bg-black/10 z-50">
            <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-lg font-bold mb-4">Konfirmasi Hapus</h2>
            <p className="mb-6">Apakah kamu yakin ingin menghapus produk ini?</p>
            <div className="flex justify-end gap-3">
                <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
                >
                Batal
                </button>
                <button
                onClick={confirmDelete}
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                >
                Hapus
                </button>
            </div>
            </div>
        </div>
      )}
    </DashboardLayout>
  );
}
