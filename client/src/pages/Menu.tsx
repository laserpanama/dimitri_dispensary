import { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";
import { Link } from "wouter";
import { ArrowLeft, ShoppingCart, Leaf } from "lucide-react";
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

export default function Menu() {
  const { user } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState<Category | undefined>();
  const { data: products = [], isLoading } = trpc.products.list.useQuery({
    category: selectedCategory,
  });

  const handleAddToCart = (productId: number) => {
    const cartItems = JSON.parse(localStorage.getItem("cartItems") || "[]");
    const existingItem = cartItems.find((item: any) => item.productId === productId);

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cartItems.push({ productId, quantity: 1 });
    }

    localStorage.setItem("cartItems", JSON.stringify(cartItems));
    toast.success("Added to cart!");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <div className="bg-black/40 backdrop-blur-md border-b border-green-500/20 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <Link href="/">
            <Button variant="ghost" size="sm" className="text-gray-300 hover:text-white">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </Link>
          <h1 className="text-2xl font-bold text-white">Menu</h1>
          <Link href="/cart">
            <Button
              variant="outline"
              size="sm"
              className="border-green-500/50 text-green-400 hover:bg-green-500/10"
            >
              <ShoppingCart className="w-4 h-4 mr-2" />
              Cart
            </Button>
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Category Filter */}
        <div className="mb-12">
          <h2 className="text-xl font-bold text-white mb-6">Categories</h2>
          <div className="flex flex-wrap gap-3">
            <Button
              onClick={() => setSelectedCategory(undefined)}
              variant={selectedCategory === undefined ? "default" : "outline"}
              className={
                selectedCategory === undefined
                  ? "bg-gradient-to-r from-green-600 to-emerald-600"
                  : "border-green-500/50 text-green-400 hover:bg-green-500/10"
              }
            >
              All Products
            </Button>
            {CATEGORIES.map((cat) => (
              <Button
                key={cat.value}
                onClick={() => setSelectedCategory(cat.value)}
                variant={selectedCategory === cat.value ? "default" : "outline"}
                className={
                  selectedCategory === cat.value
                    ? "bg-gradient-to-r from-green-600 to-emerald-600"
                    : "border-green-500/50 text-green-400 hover:bg-green-500/10"
                }
              >
                {cat.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Products Grid */}
        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-green-500 mx-auto mb-4"></div>
            <p className="text-gray-300">Loading products...</p>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-12">
            <Leaf className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-300 text-lg">No products available in this category</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product) => (
              <div
                key={product.id}
                className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/30 rounded-2xl p-6 backdrop-blur-sm hover:border-green-500/50 transition-all duration-300 group"
              >
                {/* Product Image Placeholder */}
                <div className="w-full h-48 bg-gradient-to-br from-green-400/20 to-emerald-400/20 rounded-xl mb-4 flex items-center justify-center group-hover:from-green-400/30 group-hover:to-emerald-400/30 transition-all">
                  <Leaf className="w-16 h-16 text-green-500/30" />
                </div>

                {/* Product Info */}
                <h3 className="text-xl font-bold text-white mb-2">{product.name}</h3>

                {product.strain && (
                  <p className="text-sm text-green-400 mb-2">Strain: {product.strain}</p>
                )}

                {product.description && (
                  <p className="text-gray-300 text-sm mb-4 line-clamp-2">{product.description}</p>
                )}

                {/* THC/CBD Info */}
                <div className="flex gap-4 mb-4 text-sm">
                  {product.thcLevel && (
                    <div className="bg-green-500/20 rounded px-3 py-1">
                      <span className="text-green-400">THC: {product.thcLevel}%</span>
                    </div>
                  )}
                  {product.cbdLevel && (
                    <div className="bg-blue-500/20 rounded px-3 py-1">
                      <span className="text-blue-400">CBD: {product.cbdLevel}%</span>
                    </div>
                  )}
                </div>

                {/* Price and Action */}
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-green-400">${product.price}</span>
                  <Button
                    onClick={() => handleAddToCart(product.id)}
                    disabled={product.quantity === 0}
                    className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                  >
                    <ShoppingCart className="w-4 h-4" />
                  </Button>
                </div>

                {product.quantity === 0 && (
                  <p className="text-red-400 text-sm mt-2">Out of stock</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
