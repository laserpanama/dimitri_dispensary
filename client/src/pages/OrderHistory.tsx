import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";
import { Link } from "wouter";
import { ArrowLeft, Package, Clock, CheckCircle } from "lucide-react";

export default function OrderHistory() {
  const { user } = useAuth();
  const { data: orders = [], isLoading } = trpc.orders.list.useQuery();

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-500/20 text-green-400";
      case "ready":
        return "bg-blue-500/20 text-blue-400";
      case "preparing":
        return "bg-yellow-500/20 text-yellow-400";
      case "pending":
        return "bg-gray-500/20 text-gray-400";
      case "cancelled":
        return "bg-red-500/20 text-red-400";
      default:
        return "bg-gray-500/20 text-gray-400";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-5 h-5" />;
      case "ready":
        return <Package className="w-5 h-5" />;
      case "preparing":
        return <Clock className="w-5 h-5" />;
      default:
        return <Clock className="w-5 h-5" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <div className="bg-black/40 backdrop-blur-md border-b border-green-500/20 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center gap-4">
          <Link href="/">
            <Button variant="ghost" size="sm" className="text-gray-300 hover:text-white">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </Link>
          <h1 className="text-2xl font-bold text-white">Order History</h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-green-500 mx-auto mb-4"></div>
            <p className="text-gray-300">Loading orders...</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-20">
            <Package className="w-20 h-20 text-gray-600 mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-white mb-4">No orders yet</h2>
            <p className="text-gray-300 mb-8">Start shopping to place your first order</p>
            <Link href="/menu">
              <Button className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700">
                Browse Menu
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div
                key={order.id}
                className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/30 rounded-2xl p-8 backdrop-blur-sm hover:border-green-500/50 transition-all duration-300"
              >
                <div className="grid md:grid-cols-2 gap-8">
                  {/* Order Info */}
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xl font-bold text-white">{order.orderNumber}</h3>
                      <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(order.status)}`}>
                        {getStatusIcon(order.status)}
                        <span className="capitalize">{order.status}</span>
                      </div>
                    </div>

                    <div className="space-y-3 text-gray-300">
                      <div>
                        <p className="text-sm text-gray-400">Order Date</p>
                        <p className="font-semibold">
                          {new Date(order.createdAt).toLocaleDateString("en-US", {
                            month: "long",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </p>
                      </div>

                      <div>
                        <p className="text-sm text-gray-400">Fulfillment Type</p>
                        <p className="font-semibold capitalize">{order.fulfillmentType}</p>
                      </div>

                      {order.fulfillmentType === "delivery" && order.deliveryAddress && (
                        <div>
                          <p className="text-sm text-gray-400">Delivery Address</p>
                          <p className="font-semibold">{order.deliveryAddress}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Order Details */}
                  <div>
                    <div className="space-y-3 text-gray-300 mb-6">
                      <div>
                        <p className="text-sm text-gray-400">Total Price</p>
                        <p className="text-2xl font-bold text-green-400">${order.totalPrice}</p>
                      </div>

                      {order.estimatedReadyTime && (
                        <div>
                          <p className="text-sm text-gray-400">Estimated Ready Time</p>
                          <p className="font-semibold">
                            {new Date(order.estimatedReadyTime).toLocaleString("en-US", {
                              month: "short",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </p>
                        </div>
                      )}

                      {order.actualReadyTime && (
                        <div>
                          <p className="text-sm text-gray-400">Ready Time</p>
                          <p className="font-semibold">
                            {new Date(order.actualReadyTime).toLocaleString("en-US", {
                              month: "short",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </p>
                        </div>
                      )}
                    </div>

                    <Button
                      variant="outline"
                      className="w-full border-green-500/50 text-green-400 hover:bg-green-500/10"
                    >
                      View Details
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
