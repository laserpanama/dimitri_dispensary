import { useState, useEffect, useMemo } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";
import { Link } from "wouter";
import { ArrowLeft, Trash2, ShoppingCart } from "lucide-react";
import { toast } from "sonner";

interface CartItem {
  productId: number;
  quantity: number;
}

export default function Cart() {
  const { user } = useAuth();
  const [cartItems, setCartItems] = useState<CartItem[]>(() =>
    JSON.parse(localStorage.getItem("cartItems") || "[]")
  );
  const [fulfillmentType, setFulfillmentType] = useState<"pickup" | "delivery">("pickup");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [products, setProducts] = useState<Record<number, any>>({});

  const createOrderMutation = trpc.orders.create.useMutation();

  // Get cart item IDs for fetching product details.
  // We derive this from state and memoize it to avoid unnecessary recalculations and localStorage reads.
  const cartProductIds = useMemo(() => cartItems.map((item) => item.productId), [cartItems]);

  // Optimization: Fetch only the products that are actually in the cart.
  // This avoids loading the entire product catalog, which improves performance as the catalog grows.
  const { data: fetchedProducts = [] } = trpc.products.getByIds.useQuery(
    { ids: cartProductIds },
    { enabled: cartProductIds.length > 0 }
  );

  useEffect(() => {
    // Create product lookup from targeted fetch
    const lookup: Record<number, any> = {};
    fetchedProducts.forEach((p) => {
      lookup[p.id] = p;
    });
    setProducts(lookup);
  }, [fetchedProducts]);

  const handleRemoveItem = (productId: number) => {
    const updated = cartItems.filter((item) => item.productId !== productId);
    setCartItems(updated);
    localStorage.setItem("cartItems", JSON.stringify(updated));
  };

  const handleUpdateQuantity = (productId: number, quantity: number) => {
    if (quantity <= 0) {
      handleRemoveItem(productId);
      return;
    }

    const updated = cartItems.map((item) =>
      item.productId === productId ? { ...item, quantity } : item
    );
    setCartItems(updated);
    localStorage.setItem("cartItems", JSON.stringify(updated));
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => {
      const product = products[item.productId];
      if (!product) return total;
      return total + parseFloat(product.price) * item.quantity;
    }, 0);
  };

  const handleCheckout = async () => {
    if (cartItems.length === 0) {
      toast.error("Your cart is empty");
      return;
    }

    if (fulfillmentType === "delivery" && !deliveryAddress) {
      toast.error("Please enter a delivery address");
      return;
    }

    setIsLoading(true);
    try {
      await createOrderMutation.mutateAsync({
        items: cartItems,
        fulfillmentType,
        deliveryAddress: fulfillmentType === "delivery" ? deliveryAddress : undefined,
      });

      localStorage.removeItem("cartItems");
      setCartItems([]);
      toast.success("Order placed successfully!");
      setTimeout(() => {
        window.location.href = "/orders";
      }, 1000);
    } catch (error) {
      toast.error("Failed to place order");
    } finally {
      setIsLoading(false);
    }
  };

  const total = calculateTotal();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <div className="bg-black/40 backdrop-blur-md border-b border-green-500/20 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center gap-4">
          <Link href="/menu">
            <Button variant="ghost" size="sm" className="text-gray-300 hover:text-white">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Menu
            </Button>
          </Link>
          <h1 className="text-2xl font-bold text-white">Shopping Cart</h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {cartItems.length === 0 ? (
          <div className="text-center py-20">
            <ShoppingCart className="w-20 h-20 text-gray-600 mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-white mb-4">Your cart is empty</h2>
            <p className="text-gray-300 mb-8">Start shopping to add items to your cart</p>
            <Link href="/menu">
              <Button className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700">
                Continue Shopping
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map((item) => {
                const product = products[item.productId];
                if (!product) return null;

                return (
                  <div
                    key={item.productId}
                    className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/30 rounded-xl p-6 backdrop-blur-sm flex items-center justify-between"
                  >
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-white">{product.name}</h3>
                      {product.strain && (
                        <p className="text-sm text-green-400">{product.strain}</p>
                      )}
                      <p className="text-2xl font-bold text-green-400 mt-2">
                        ${(parseFloat(product.price) * item.quantity).toFixed(2)}
                      </p>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="flex items-center border border-green-500/50 rounded-lg">
                        <button
                          onClick={() => handleUpdateQuantity(item.productId, item.quantity - 1)}
                          className="px-3 py-2 text-green-400 hover:bg-green-500/20"
                        >
                          −
                        </button>
                        <span className="px-4 py-2 text-white font-semibold">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => handleUpdateQuantity(item.productId, item.quantity + 1)}
                          className="px-3 py-2 text-green-400 hover:bg-green-500/20"
                        >
                          +
                        </button>
                      </div>

                      <button
                        onClick={() => handleRemoveItem(item.productId)}
                        className="p-2 text-red-400 hover:bg-red-500/20 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Order Summary */}
            <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/30 rounded-2xl p-8 backdrop-blur-sm h-fit sticky top-24">
              <h2 className="text-2xl font-bold text-white mb-6">Order Summary</h2>

              {/* Fulfillment Type */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-300 mb-3">
                  Fulfillment Type
                </label>
                <div className="space-y-2">
                  <label className="flex items-center p-3 border border-green-500/30 rounded-lg cursor-pointer hover:bg-green-500/10">
                    <input
                      type="radio"
                      name="fulfillment"
                      value="pickup"
                      checked={fulfillmentType === "pickup"}
                      onChange={(e) => setFulfillmentType(e.target.value as "pickup")}
                      className="mr-3"
                    />
                    <span className="text-white">Pickup</span>
                  </label>
                  <label className="flex items-center p-3 border border-green-500/30 rounded-lg cursor-pointer hover:bg-green-500/10">
                    <input
                      type="radio"
                      name="fulfillment"
                      value="delivery"
                      checked={fulfillmentType === "delivery"}
                      onChange={(e) => setFulfillmentType(e.target.value as "delivery")}
                      className="mr-3"
                    />
                    <span className="text-white">Delivery</span>
                  </label>
                </div>
              </div>

              {/* Delivery Address */}
              {fulfillmentType === "delivery" && (
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-gray-300 mb-2">
                    Delivery Address
                  </label>
                  <textarea
                    value={deliveryAddress}
                    onChange={(e) => setDeliveryAddress(e.target.value)}
                    placeholder="Enter your delivery address"
                    className="w-full px-4 py-3 bg-slate-800/50 border border-green-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500"
                    rows={3}
                  />
                </div>
              )}

              {/* Pricing */}
              <div className="space-y-3 mb-6 pb-6 border-b border-green-500/30">
                <div className="flex justify-between text-gray-300">
                  <span>Subtotal</span>
                  <span>${total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-300">
                  <span>Estimated Ready Time</span>
                  <span>2 hours</span>
                </div>
                <div className="flex justify-between text-xl font-bold text-green-400">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>

              {/* Checkout Button */}
              <Button
                onClick={handleCheckout}
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold py-3"
              >
                {isLoading ? "Processing..." : "Place Order"}
              </Button>

              <p className="text-xs text-gray-400 text-center mt-4">
                By placing an order, you agree to our terms and conditions.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
