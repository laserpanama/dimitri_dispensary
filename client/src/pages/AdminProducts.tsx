import { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { trpc } from "@/lib/trpc";
import { Link } from "wouter";
import { ArrowLeft, Lock, Plus, Edit2, Trash2, Upload, Search } from "lucide-react";
import { toast } from "sonner";

type Category = "flower" | "edibles" | "concentrates" | "tinctures" | "topicals" | "accessories";

const CATEGORIES: { value: Category; label: string }[] = [
  { value: "flower", label: "Flower" },
  { value: "edibles", label: "Edibles" },
  { value: "concentrates", label: "Concentrates" },
  { value: "tinctures", label: "Tinctures" },
  { value: "topicals", label: "Topicals" },
  { value: "accessories", label: "Accessories" },
];

export default function AdminProducts() {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState<Category | undefined>();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<number | null>(null);

  const { data: products = [], refetch } = trpc.products.list.useQuery({
    category: filterCategory,
  });

  const createMutation = trpc.adminProducts.create.useMutation({
    onSuccess: () => {
      toast.success("Product created successfully");
      refetch();
      setShowCreateModal(false);
    },
    onError: (error) => {
      toast.error("Failed to create product: " + error.message);
    },
  });

  const updateMutation = trpc.adminProducts.update.useMutation({
    onSuccess: () => {
      toast.success("Product updated successfully");
      refetch();
      setEditingProduct(null);
    },
    onError: (error) => {
      toast.error("Failed to update product: " + error.message);
    },
  });

  const deleteMutation = trpc.adminProducts.delete.useMutation({
    onSuccess: () => {
      toast.success("Product deleted successfully");
      refetch();
    },
    onError: (error) => {
      toast.error("Failed to delete product: " + error.message);
    },
  });

  // Check if user is admin
  if (!user || user.role !== "admin") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <Lock className="w-20 h-20 text-red-500 mx-auto mb-6" />
          <h1 className="text-3xl font-bold text-white mb-4">Access Denied</h1>
          <p className="text-gray-300 mb-8">You don't have permission to access this page.</p>
          <Link href="/">
            <Button className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700">
              Return Home
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDelete = (id: number, name: string) => {
    if (confirm(`Are you sure you want to delete "${name}"?`)) {
      deleteMutation.mutate({ id });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <div className="bg-black/40 backdrop-blur-md border-b border-green-500/20 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/admin">
              <Button variant="ghost" size="sm" className="text-gray-300 hover:text-white">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
            <h1 className="text-2xl font-bold text-white">Product Management</h1>
          </div>
          <Button
            onClick={() => setShowCreateModal(true)}
            className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Product
          </Button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Filters */}
        <div className="mb-8 flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-slate-800 border-slate-700 text-white"
            />
          </div>
          <div className="flex gap-2">
            <Button
              variant={filterCategory === undefined ? "default" : "outline"}
              onClick={() => setFilterCategory(undefined)}
              className={
                filterCategory === undefined
                  ? "bg-gradient-to-r from-green-600 to-emerald-600"
                  : "border-green-500/50 text-green-400 hover:bg-green-500/10"
              }
            >
              All
            </Button>
            {CATEGORIES.map((cat) => (
              <Button
                key={cat.value}
                variant={filterCategory === cat.value ? "default" : "outline"}
                onClick={() => setFilterCategory(cat.value)}
                className={
                  filterCategory === cat.value
                    ? "bg-gradient-to-r from-green-600 to-emerald-600"
                    : "border-green-500/50 text-green-400 hover:bg-green-500/10"
                }
              >
                {cat.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Products Table */}
        <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/30 rounded-2xl p-6 backdrop-blur-sm">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-green-500/30">
                  <th className="text-left p-3 text-gray-300 font-semibold">Image</th>
                  <th className="text-left p-3 text-gray-300 font-semibold">Name</th>
                  <th className="text-left p-3 text-gray-300 font-semibold">Category</th>
                  <th className="text-left p-3 text-gray-300 font-semibold">Price</th>
                  <th className="text-left p-3 text-gray-300 font-semibold">Stock</th>
                  <th className="text-left p-3 text-gray-300 font-semibold">CBD%</th>
                  <th className="text-left p-3 text-gray-300 font-semibold">THC%</th>
                  <th className="text-left p-3 text-gray-300 font-semibold">Status</th>
                  <th className="text-right p-3 text-gray-300 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((product) => (
                  <tr key={product.id} className="border-b border-green-500/20 hover:bg-green-500/5">
                    <td className="p-3">
                      {product.image ? (
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-12 h-12 object-cover rounded"
                        />
                      ) : (
                        <div className="w-12 h-12 bg-slate-700 rounded flex items-center justify-center text-gray-500">
                          No Image
                        </div>
                      )}
                    </td>
                    <td className="p-3 text-white font-medium">{product.name}</td>
                    <td className="p-3 text-gray-300 capitalize">{product.category}</td>
                    <td className="p-3 text-green-400">${product.price}</td>
                    <td className="p-3 text-gray-300">{product.quantity}</td>
                    <td className="p-3 text-blue-400">{product.cbdLevel || "-"}%</td>
                    <td className="p-3 text-purple-400">{product.thcLevel || "-"}%</td>
                    <td className="p-3">
                      <span
                        className={`px-2 py-1 rounded text-xs ${
                          product.active
                            ? "bg-green-500/20 text-green-400"
                            : "bg-red-500/20 text-red-400"
                        }`}
                      >
                        {product.active ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setEditingProduct(product.id)}
                          className="text-blue-400 hover:bg-blue-500/10"
                        >
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDelete(product.id, product.name)}
                          className="text-red-400 hover:bg-red-500/10"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredProducts.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-400">No products found</p>
              </div>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/30 rounded-xl p-4 text-center">
            <p className="text-3xl font-bold text-green-400">{products.length}</p>
            <p className="text-gray-300 text-sm">Total Products</p>
          </div>
          <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/30 rounded-xl p-4 text-center">
            <p className="text-3xl font-bold text-green-400">
              {products.filter((p) => p.active).length}
            </p>
            <p className="text-gray-300 text-sm">Active</p>
          </div>
          <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/30 rounded-xl p-4 text-center">
            <p className="text-3xl font-bold text-yellow-400">
              {products.filter((p) => p.quantity < 10).length}
            </p>
            <p className="text-gray-300 text-sm">Low Stock</p>
          </div>
          <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/30 rounded-xl p-4 text-center">
            <p className="text-3xl font-bold text-red-400">
              {products.filter((p) => p.quantity === 0).length}
            </p>
            <p className="text-gray-300 text-sm">Out of Stock</p>
          </div>
        </div>
      </div>
    </div>
  );
}
