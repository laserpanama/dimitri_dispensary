import { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { trpc } from "@/lib/trpc";
import { Link } from "wouter";
import { ArrowLeft, Plus, Pencil, Trash2, Package, Lock } from "lucide-react";
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

const emptyForm = {
  name: "",
  description: "",
  category: "flower" as Category,
  price: "",
  quantity: "",
  thcLevel: "",
  cbdLevel: "",
  strain: "",
  effects: "",
  image: "",
  active: true,
};

export default function ProductManagement() {
  const { user } = useAuth();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState(emptyForm);

  const { data: products = [], isLoading, refetch } = trpc.product.getAll.useQuery(undefined, {
    enabled: user?.role === "admin",
  });

  const createMutation = trpc.product.create.useMutation({
    onSuccess: () => {
      toast.success("Product created");
      setDialogOpen(false);
      setForm(emptyForm);
      refetch();
    },
    onError: (err) => toast.error(err.message),
  });

  const updateMutation = trpc.product.update.useMutation({
    onSuccess: () => {
      toast.success("Product updated");
      setDialogOpen(false);
      setEditingId(null);
      setForm(emptyForm);
      refetch();
    },
    onError: (err) => toast.error(err.message),
  });

  const deleteMutation = trpc.product.delete.useMutation({
    onSuccess: () => {
      toast.success("Product deleted");
      refetch();
    },
    onError: (err) => toast.error(err.message),
  });

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

  const openCreate = () => {
    setEditingId(null);
    setForm(emptyForm);
    setDialogOpen(true);
  };

  const openEdit = (product: any) => {
    setEditingId(product.id);
    setForm({
      name: product.name,
      description: product.description ?? "",
      category: product.category,
      price: product.price,
      quantity: String(product.quantity),
      thcLevel: product.thcLevel ?? "",
      cbdLevel: product.cbdLevel ?? "",
      strain: product.strain ?? "",
      effects: product.effects ?? "",
      image: product.image ?? "",
      active: product.active,
    });
    setDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      name: form.name,
      description: form.description || undefined,
      category: form.category,
      price: form.price,
      quantity: parseInt(form.quantity) || 0,
      thcLevel: form.thcLevel || undefined,
      cbdLevel: form.cbdLevel || undefined,
      strain: form.strain || undefined,
      effects: form.effects || undefined,
      image: form.image || undefined,
      active: form.active,
    };

    if (editingId !== null) {
      updateMutation.mutate({ id: editingId, ...payload });
    } else {
      createMutation.mutate(payload);
    }
  };

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this product?")) {
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
                Back
              </Button>
            </Link>
            <h1 className="text-2xl font-bold text-white">Product Management</h1>
          </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button
                onClick={openCreate}
                className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Product
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-slate-800 border-green-500/30 text-white max-w-lg max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{editingId !== null ? "Edit Product" : "New Product"}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label>Name *</Label>
                  <Input
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="bg-slate-700 border-slate-600 text-white"
                    required
                  />
                </div>
                <div>
                  <Label>Description</Label>
                  <Textarea
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Category *</Label>
                    <Select
                      value={form.category}
                      onValueChange={(v) => setForm({ ...form, category: v as Category })}
                    >
                      <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-700 border-slate-600">
                        {CATEGORIES.map((c) => (
                          <SelectItem key={c.value} value={c.value} className="text-white">
                            {c.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Price *</Label>
                    <Input
                      value={form.price}
                      onChange={(e) => setForm({ ...form, price: e.target.value })}
                      placeholder="0.00"
                      className="bg-slate-700 border-slate-600 text-white"
                      required
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Quantity *</Label>
                    <Input
                      type="number"
                      min="0"
                      value={form.quantity}
                      onChange={(e) => setForm({ ...form, quantity: e.target.value })}
                      className="bg-slate-700 border-slate-600 text-white"
                      required
                    />
                  </div>
                  <div>
                    <Label>Strain</Label>
                    <Input
                      value={form.strain}
                      onChange={(e) => setForm({ ...form, strain: e.target.value })}
                      className="bg-slate-700 border-slate-600 text-white"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>THC %</Label>
                    <Input
                      value={form.thcLevel}
                      onChange={(e) => setForm({ ...form, thcLevel: e.target.value })}
                      placeholder="0.00"
                      className="bg-slate-700 border-slate-600 text-white"
                    />
                  </div>
                  <div>
                    <Label>CBD %</Label>
                    <Input
                      value={form.cbdLevel}
                      onChange={(e) => setForm({ ...form, cbdLevel: e.target.value })}
                      placeholder="0.00"
                      className="bg-slate-700 border-slate-600 text-white"
                    />
                  </div>
                </div>
                <div>
                  <Label>Effects</Label>
                  <Input
                    value={form.effects}
                    onChange={(e) => setForm({ ...form, effects: e.target.value })}
                    placeholder="e.g. Relaxed,Euphoric,Sleepy"
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>
                <div>
                  <Label>Image URL</Label>
                  <Input
                    value={form.image}
                    onChange={(e) => setForm({ ...form, image: e.target.value })}
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="active"
                    checked={form.active}
                    onChange={(e) => setForm({ ...form, active: e.target.checked })}
                    className="rounded border-slate-600"
                  />
                  <Label htmlFor="active" className="mb-0">Active</Label>
                </div>
                <div className="flex gap-3 pt-2">
                  <Button
                    type="submit"
                    disabled={createMutation.isPending || updateMutation.isPending}
                    className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 flex-1"
                  >
                    {editingId !== null ? "Update" : "Create"}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => { setDialogOpen(false); setEditingId(null); setForm(emptyForm); }}
                    className="border-slate-600 text-gray-300"
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-green-500 mx-auto mb-4"></div>
            <p className="text-gray-300">Loading products...</p>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-12">
            <Package className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-300 text-lg mb-4">No products yet</p>
            <Button
              onClick={openCreate}
              className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Your First Product
            </Button>
          </div>
        ) : (
          <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/30 rounded-2xl backdrop-blur-sm overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="border-green-500/20">
                  <TableHead className="text-gray-300">ID</TableHead>
                  <TableHead className="text-gray-300">Name</TableHead>
                  <TableHead className="text-gray-300">Category</TableHead>
                  <TableHead className="text-gray-300">Price</TableHead>
                  <TableHead className="text-gray-300">Stock</TableHead>
                  <TableHead className="text-gray-300">Status</TableHead>
                  <TableHead className="text-gray-300 text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.map((product: any) => (
                  <TableRow key={product.id} className="border-green-500/10">
                    <TableCell className="text-gray-400">{product.id}</TableCell>
                    <TableCell className="text-white font-medium">{product.name}</TableCell>
                    <TableCell className="text-gray-300 capitalize">{product.category}</TableCell>
                    <TableCell className="text-green-400">${product.price}</TableCell>
                    <TableCell className="text-gray-300">{product.quantity}</TableCell>
                    <TableCell>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          product.active
                            ? "bg-green-500/20 text-green-400"
                            : "bg-red-500/20 text-red-400"
                        }`}
                      >
                        {product.active ? "Active" : "Inactive"}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => openEdit(product)}
                          className="text-gray-300 hover:text-white hover:bg-green-500/10"
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDelete(product.id)}
                          disabled={deleteMutation.isPending}
                          className="text-gray-300 hover:text-red-400 hover:bg-red-500/10"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </div>
  );
}
