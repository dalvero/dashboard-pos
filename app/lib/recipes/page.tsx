"use client";

import { useEffect, useState } from "react";
import DashboardLayout from "../components/DashboardLayout";
import toast from "react-hot-toast";
import { getProducts, Product } from "../services/productService";
import { getMaterials, Materials } from "../services/materialsService";
import {
  getRecipes,
  createRecipe,
  updateRecipe,
  deleteRecipe,
  Recipe,
} from "../services/recipesService";

export default function RecipePage() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [materials, setMaterials] = useState<Materials[]>([]);
  const [loading, setLoading] = useState(true);

  // FORM STATE
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [editingRecipe, setEditingRecipe] = useState<Recipe | null>(null);
  const [productId, setProductId] = useState<number | "">("");
  const [materialId, setMaterialId] = useState<number | "">("");
  const [quantity, setQuantity] = useState<number | "">("");

  // DELETE STATE
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // SEARCH & FILTER
  const [search, setSearch] = useState("");
  const [filterProductId, setFilterProductId] = useState<number | "">("");

  // FETCH DATA
  const fetchAll = async () => {
    setLoading(true);
    try {
      const [recipeData, productData, materialData] = await Promise.all([
        getRecipes(),
        getProducts(),
        getMaterials(),
      ]);
      setRecipes(recipeData);
      setProducts(productData);
      setMaterials(materialData);
    } catch (err: any) {
      toast.error("Gagal memuat data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  // RESET FORM
  const resetForm = () => {
    setEditingRecipe(null);
    setProductId("");
    setMaterialId("");
    setQuantity("");
  };

  // SUBMIT FORM
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!productId || !materialId || !quantity) {
      toast.error("Semua field harus diisi");
      return;
    }

    try {
      if (editingRecipe) {
        const updated = await updateRecipe(editingRecipe.id, {
          product_id: Number(productId),
          material_id: Number(materialId),
          quantity_needed: Number(quantity),
        });
        setRecipes((prev) =>
          prev.map((r) => (r.id === editingRecipe.id ? updated : r))
        );
        toast.success("Resep berhasil diperbarui");
      } else {
        const created = await createRecipe({
          product_id: Number(productId),
          material_id: Number(materialId),
          quantity_needed: Number(quantity),
        });
        setRecipes((prev) => [...prev, created]);
        toast.success("Resep berhasil ditambahkan");
      }

      resetForm();
      setIsFormVisible(false);
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  // DELETE CONFIRM
  const confirmDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteRecipe(deleteId);
      setRecipes((prev) => prev.filter((r) => r.id !== deleteId));
      toast.success("Resep berhasil dihapus");
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setDeleteId(null);
      setIsDeleteModalOpen(false);
    }
  };

  // FILTERED DATA
  const filteredRecipes = recipes.filter((r) => {
    const product = products.find((p) => p.id === r.product_id);
    const material = materials.find((m) => m.id === r.material_id);
    const searchLower = search.toLowerCase();

    const matchesSearch =
      !search ||
      product?.name.toLowerCase().includes(searchLower) ||
      material?.name.toLowerCase().includes(searchLower);

    const matchesProduct =
      !filterProductId || r.product_id === Number(filterProductId);

    return matchesSearch && matchesProduct;
  });

  return (
    <DashboardLayout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Manajemen Resep</h1>
        <button
          onClick={() => {
            resetForm();
            setIsFormVisible(true);
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Tambah Resep
        </button>
      </div>

      {/* SEARCH & FILTER */}
      <div className="flex gap-4 mb-6">
        <input
          type="text"
          placeholder="Cari resep berdasarkan produk atau bahan..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 p-2 border rounded"
        />
        <select
          value={filterProductId}
          onChange={(e) =>
            setFilterProductId(e.target.value ? Number(e.target.value) : "")
          }
          className="p-2 dark:bg-gray-900 border rounded"
        >
          <option value="">Filter Produk</option>
          {products.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>
      </div>

      {/* FORM */}
      {isFormVisible && (
        <form
          onSubmit={handleSubmit}
          className="mb-6 p-4 rounded border bg-white dark:bg-gray-900"
        >
          <h2 className="mb-4 text-xl font-bold">
            {editingRecipe ? "Edit Resep" : "Tambah Resep"}
          </h2>
          <div className="mb-3">
            <label className="block font-semibold mb-1">Produk</label>
            <select
              value={productId}
              onChange={(e) => setProductId(Number(e.target.value))}
              className="w-full dark:bg-gray-900 p-2 border rounded"
              required
            >
              <option value="">-- Pilih Produk --</option>
              {products.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-3">
            <label className="block font-semibold mb-1">Bahan Baku</label>
            <select
              value={materialId}
              onChange={(e) => setMaterialId(Number(e.target.value))}
              className="w-full  dark:bg-gray-900 p-2 border rounded"
              required
            >
              <option value="">-- Pilih Bahan Baku --</option>
              {materials.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name} ({m.unit})
                </option>
              ))}
            </select>
          </div>
          <div className="mb-3">
            <label className="block font-semibold mb-1">Jumlah Dibutuhkan</label>
            <input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div className="flex gap-2">
            <button
              type="submit"
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              {editingRecipe ? "Update" : "Simpan"}
            </button>
            <button
              type="button"
              onClick={() => {
                resetForm();
                setIsFormVisible(false);
              }}
              className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
            >
              Batal
            </button>
          </div>
        </form>
      )}

      {/* TABLE */}
      {loading ? (
        <div>Memuat data...</div>
      ) : filteredRecipes.length === 0 ? (
        <div>Tidak ada resep</div>
      ) : (
        <table className="w-full border-collapse">
          <thead>
            <tr className="dark:bg-gray-900">
              <th className="border px-4 py-2">No</th>
              <th className="border px-4 py-2">Produk</th>
              <th className="border px-4 py-2">Bahan Baku</th>
              <th className="border px-4 py-2">Jumlah</th>
              <th className="border px-4 py-2">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {filteredRecipes.map((r, i) => {
              const product = products.find((p) => p.id === r.product_id);
              const material = materials.find((m) => m.id === r.material_id);
              return (
                <tr key={r.id}>
                  <td className="border px-4 py-2 text-center">{i + 1}</td>
                  <td className="border px-4 py-2 text-center">
                    {product?.name || "-"}
                  </td>
                  <td className="border px-4 py-2 text-center">
                    {material?.name || "-"}
                  </td>
                  <td className="border px-4 py-2 text-center">
                    {r.quantity_needed} {material?.unit}
                  </td>
                  <td className="border px-4 py-2 text-center space-x-2">
                    <button
                      onClick={() => {
                        setEditingRecipe(r);
                        setProductId(r.product_id);
                        setMaterialId(r.material_id);
                        setQuantity(r.quantity_needed);
                        setIsFormVisible(true);
                      }}
                      className="bg-gray-400 text-white px-2 py-1 rounded hover:bg-gray-600"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => {
                        setDeleteId(r.id);
                        setIsDeleteModalOpen(true);
                      }}
                      className="bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700"
                    >
                      Hapus
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}

      {/* MODAL DELETE */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm bg-black/30 z-50">
          <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-lg font-bold mb-4">Konfirmasi Hapus</h2>
            <p className="mb-6">Yakin ingin menghapus resep ini?</p>
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
