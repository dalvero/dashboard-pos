"use client";

import { useEffect, useState } from "react";
import {
  getCategories,
  createCategories,
  updateCategories,
  deleteCategories,
  Categories,
} from "../services/categoriesService";
import DashboardLayout from "../components/DashboardLayout";
import toast from "react-hot-toast";

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Categories[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // FORM STATE
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Categories | null>(null);
  const [formName, setFormName] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  // FETCH KATEGORI
  const fetchCategories = async () => {
    setLoading(true);
    try {
      const data = await getCategories();
      if (data && Array.isArray(data)) {
        setCategories(data);
      } else {
        setCategories([]);
      }
    } catch (error: any) {
      toast.error("Gagal memuat data Kategori");
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // FILTER KATEGORI BERDASARKAN SEARCH
  const filteredCategories = categories.filter((cat) =>
    cat.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // RESET FORM
  const resetForm = () => {
    setEditingCategory(null);
    setFormName("");
  };

  // SUBMIT FORM
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (editingCategory) {
        // UPDATE
        const updated = await updateCategories(editingCategory.id, { name: formName });
        setCategories((prev) =>
          prev.map((cat) => (cat.id === editingCategory.id ? updated : cat))
        );
        toast.success("Kategori berhasil diperbarui");
      } else {
        // CREATE
        const created = await createCategories({ name: formName });
        setCategories((prev) => [...prev, created]);
        toast.success("Kategori berhasil diperbarui");
      }
      resetForm();
      setIsFormVisible(false);
    } catch (error: any) {
      toast.error("Error: " + error.message);
    } finally {
      setSubmitting(false);
    }
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
          await deleteCategories(deleteId);
          setCategories((prev) => prev.filter((mat) => mat.id !== deleteId));
          toast.success("Kategori berhasil dihapus");
      } catch (error: any) {
          toast.error("Gagal menghapus kategori: " + error.message);
      } finally {
          setIsDeleteModalOpen(false);
          setDeleteId(null);
      }
  };

  // DELETE KATEGORI
  const handleDeleteClick = async (categoryId: number) => {
    if (!confirm("Apakah kamu yakin ingin menghapus kategori ini?")) return;
    try {
      await deleteCategories(categoryId);
      setCategories((prev) => prev.filter((cat) => cat.id !== categoryId));
    } catch (error: any) {
      alert("Gagal menghapus Kategori: " + error.message);
    }
  };

  // EDIT KATEGORI
  const handleEditClick = (category: Categories) => {
    setEditingCategory(category);
    setFormName(category.name);
    setIsFormVisible(true);
  };

  return (
    <DashboardLayout>
      <div className="flex justify-between mb-6">
        <h1 className="text-2xl font-bold">Manajemen Kategori</h1>
        <button
          type="button"
          onClick={() => {
            resetForm();
            setIsFormVisible(true);
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Tambah Kategori
        </button>
      </div>

      {/* SEARCH */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Cari kategori..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* FORM */}
      {isFormVisible && (
        <form
          onSubmit={handleSubmit}
          className="mb-6 p-4 rounded dark:bg-gray-900"
        >
          <h2 className="mb-4 text-2xl font-bold">
            {editingCategory ? "Edit Kategori" : "Tambah Kategori"}
          </h2>
          <div className="mb-3">
            <label className="block font-semibold mb-1">Nama Kategori</label>
            <input
              type="text"
              value={formName}
              onChange={(e) => setFormName(e.target.value)}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div className="flex gap-2">
            <button
              type="submit"
              disabled={submitting}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50"
            >
              {submitting
                ? "Menyimpan..."
                : editingCategory
                ? "Update"
                : "Simpan"}
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
        <div className="text-center text-gray-500">Memuat data...</div>
      ) : filteredCategories.length === 0 ? (
        <div className="text-center text-gray-500">
          Tidak ada kategori.
        </div>
      ) : (
        <table className="w-full border-collapse">
          <thead>
            <tr className="dark:bg-gray-900">
              <th className="border px-4 py-2">No</th>
              <th className="border px-4 py-2">Nama Kategori</th>
              <th className="border px-4 py-2">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {filteredCategories.map((cat, index) => (
              <tr key={cat.id}>
                <td className="border px-4 py-2 text-center">{index + 1}</td>
                <td className="border px-4 py-2 text-center">{cat.name}</td>
                <td className="border px-4 py-2 text-center space-x-2">
                  <button
                    onClick={() => handleEditClick(cat)}
                    className="bg-gray-400 text-white px-2 py-1 rounded hover:bg-gray-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => openDeleteModal(cat.id)}
                    className="bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700"
                  >
                    Hapus
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* MODAL KONFIRMASI DELETE */}
        {isDeleteModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm bg-black/10 z-50">
              <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-lg w-96">
              <h2 className="text-lg font-bold mb-4">Konfirmasi Hapus</h2>
              <p className="mb-6">Apakah kamu yakin ingin menghapus kategori ini?</p>
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
