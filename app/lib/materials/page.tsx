"use client";

import { useEffect, useState } from "react";
import {
  getMaterials,
  createMaterials,   
  updateMaterials,  
  deleteMaterials,   
  Materials,
} from "../services/materialsService";
import DashboardLayout from "../components/DashboardLayout";
import toast from "react-hot-toast";

export default function MaterialsPage() {
    const [materials, setMaterials] = useState<Materials[]>([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [deleteId, setDeleteId] = useState<number | null>(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    // FORM STATE
    const [isFormVisible, setIsFormVisible] = useState(false);
    const [editingMaterial, setEditingMaterial] = useState<Materials | null>(null);
    const [formName, setFormName] = useState("");
    const [formStock, setFormStock] = useState<number>(0);
    const [formUnit, setFormUnit] = useState("");
    const [searchTerm, setSearchTerm] = useState("");

    


    // FETCH MATERIALS
    const fetchMaterials = async () => {
        setLoading(true);
        try {
        const data = await getMaterials();
        if (data && Array.isArray(data)) {
            setMaterials(data);
        } else {
            setMaterials([]);
        }
        } catch (error: any) {
        toast.error("Gagal memuat data bahan baku");
        setMaterials([]);
        } finally {
        setLoading(false);
        }
    };

    useEffect(() => {
        fetchMaterials();
    }, []);

    // FILTER MATERIALS BERDASARKAN SEARCH
    const filteredMaterials = materials.filter((mat) =>
        mat.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // RESET FORM
    const resetForm = () => {
        setEditingMaterial(null);
        setFormName("");
        setFormStock(0);
        setFormUnit("");
    };

    // SUBMIT FORM
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            if (editingMaterial) {
                // UPDATE
                const updated = await updateMaterials(editingMaterial.id, {
                    name: formName,
                    stock: formStock,
                    unit: formUnit,
                });
                setMaterials((prev) =>
                prev.map((mat) => (mat.id === editingMaterial.id ? updated : mat))
            );
            toast.success("Bahan baku berhasil diperbarui");
        } else {
            // CREATE
            const created = await createMaterials({
                name: formName,
                stock: formStock,
                unit: formUnit,
            });
            setMaterials((prev) => [...prev, created]);
            toast.success("Bahan baku berhasil ditambahkan");
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
            await deleteMaterials(deleteId);
            setMaterials((prev) => prev.filter((mat) => mat.id !== deleteId));
            toast.success("Bahan baku berhasil dihapus");
        } catch (error: any) {
            toast.error("Gagal menghapus bahan baku: " + error.message);
        } finally {
            setIsDeleteModalOpen(false);
            setDeleteId(null);
        }
    };

    // EDIT MATERIAL
    const handleEditClick = (material: Materials) => {
        setEditingMaterial(material);
        setFormName(material.name);
        setFormStock(material.stock);
        setFormUnit(material.unit);
        setIsFormVisible(true);
    };

    return (
        <DashboardLayout>
        <div className="flex justify-between mb-6">
            <h1 className="text-2xl font-bold">Manajemen Bahan Baku</h1>
            <button
            type="button"
            onClick={() => {
                resetForm();
                setIsFormVisible(true);
            }}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
            Tambah Bahan Baku
            </button>
        </div>

        {/* SEARCH */}
        <div className="mb-6">
            <input
            type="text"
            placeholder="Cari bahan baku..."
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
                {editingMaterial ? "Edit Bahan Baku" : "Tambah Bahan Baku"}
            </h2>
            <div className="mb-3">
                <label className="block font-semibold mb-1">Nama Bahan</label>
                <input
                type="text"
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                className="w-full p-2 border rounded"
                required
                />
            </div>
            <div className="mb-3">
                <label className="block font-semibold mb-1">Stok</label>
                <input
                type="number"
                value={formStock}
                onChange={(e) => setFormStock(Number(e.target.value))}
                className="w-full p-2 border rounded"
                required
                min={0}
                />
            </div>
            <div className="mb-3">
                <label className="block font-semibold mb-1">Satuan</label>
                <select
                    value={formUnit}
                    onChange={(e) => setFormUnit(e.target.value)}
                    className="dark:bg-gray-900 w-full p-2 border rounded"
                    required
                >
                    <option value="">-- Pilih Satuan --</option>
                    <option value="pcs">pcs</option>
                    <option value="ml">ml</option>
                    <option value="gr">gr</option>
                    <option value="kg">kg</option>
                    <option value="liter">liter</option>
                    <option value="box">box</option>
                    <option value="pack">pack</option>
                </select>
                </div>
            <div className="flex gap-2">
                <button
                type="submit"
                disabled={submitting}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50"
                >
                {submitting
                    ? "Menyimpan..."
                    : editingMaterial
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
        ) : filteredMaterials.length === 0 ? (
            <div className="text-center text-gray-500">Tidak ada bahan baku.</div>
        ) : (
            <table className="w-full border-collapse">
            <thead>
                <tr className="dark:bg-gray-900">
                <th className="border px-4 py-2">No</th>
                <th className="border px-4 py-2">Nama Bahan</th>
                <th className="border px-4 py-2">Stok</th>
                <th className="border px-4 py-2">Satuan</th>
                <th className="border px-4 py-2">Aksi</th>
                </tr>
            </thead>
            <tbody>
                {filteredMaterials.map((mat, index) => (
                <tr key={mat.id}>
                    <td className="border px-4 py-2 text-center">{index + 1}</td>
                    <td className="border px-4 py-2 text-center">{mat.name}</td>
                    <td className="border px-4 py-2 text-center">{mat.stock}</td>
                    <td className="border px-4 py-2 text-center">{mat.unit}</td>
                    <td className="border px-4 py-2 text-center space-x-2">
                    <button
                        onClick={() => handleEditClick(mat)}
                        className="bg-gray-400 text-white px-2 py-1 rounded hover:bg-gray-600"
                    >
                        Edit
                    </button>
                    <button
                        onClick={() => openDeleteModal(mat.id)}
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
            <p className="mb-6">Apakah kamu yakin ingin menghapus bahan baku ini?</p>
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
