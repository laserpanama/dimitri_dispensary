import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { ArrowLeft, Lock } from "lucide-react";

export default function AdminDashboard() {
  const { user } = useAuth();

  // Check if user is admin
  if (!user || user.role !== "admin") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <Lock className="w-20 h-20 text-red-500 mx-auto mb-6" />
          <h1 className="text-3xl font-bold text-white mb-4">Access Denied</h1>
          <p className="text-gray-300 mb-8">You don't have permission to access the admin dashboard.</p>
          <Link href="/">
            <Button className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700">
              Return Home
            </Button>
          </Link>
        </div>
      </div>
    );
  }

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
          <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {/* Product Management */}
          <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/30 rounded-2xl p-8 backdrop-blur-sm hover:border-green-500/50 transition-all">
            <div className="text-4xl mb-4">📦</div>
            <h3 className="text-xl font-bold text-white mb-3">Product Management</h3>
            <p className="text-gray-300 mb-6">Add, edit, and manage inventory</p>
            <Button
              variant="outline"
              className="w-full border-green-500/50 text-green-400 hover:bg-green-500/10"
            >
              Manage Products
            </Button>
          </div>

          {/* Order Management */}
          <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/30 rounded-2xl p-8 backdrop-blur-sm hover:border-green-500/50 transition-all">
            <div className="text-4xl mb-4">📋</div>
            <h3 className="text-xl font-bold text-white mb-3">Order Management</h3>
            <p className="text-gray-300 mb-6">Track and update customer orders</p>
            <Button
              variant="outline"
              className="w-full border-green-500/50 text-green-400 hover:bg-green-500/10"
            >
              View Orders
            </Button>
          </div>

          {/* Appointment Management */}
          <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/30 rounded-2xl p-8 backdrop-blur-sm hover:border-green-500/50 transition-all">
            <div className="text-4xl mb-4">📅</div>
            <h3 className="text-xl font-bold text-white mb-3">Appointment Management</h3>
            <p className="text-gray-300 mb-6">Manage doctor consultations</p>
            <Button
              variant="outline"
              className="w-full border-green-500/50 text-green-400 hover:bg-green-500/10"
            >
              View Appointments
            </Button>
          </div>

          {/* Blog Management */}
          <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/30 rounded-2xl p-8 backdrop-blur-sm hover:border-green-500/50 transition-all">
            <div className="text-4xl mb-4">📝</div>
            <h3 className="text-xl font-bold text-white mb-3">Blog Management</h3>
            <p className="text-gray-300 mb-6">Create and manage blog posts</p>
            <Button
              variant="outline"
              className="w-full border-green-500/50 text-green-400 hover:bg-green-500/10"
            >
              Manage Blog
            </Button>
          </div>

          {/* User Management */}
          <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/30 rounded-2xl p-8 backdrop-blur-sm hover:border-green-500/50 transition-all">
            <div className="text-4xl mb-4">👥</div>
            <h3 className="text-xl font-bold text-white mb-3">User Management</h3>
            <p className="text-gray-300 mb-6">Manage customer accounts</p>
            <Button
              variant="outline"
              className="w-full border-green-500/50 text-green-400 hover:bg-green-500/10"
            >
              Manage Users
            </Button>
          </div>

          {/* Analytics */}
          <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/30 rounded-2xl p-8 backdrop-blur-sm hover:border-green-500/50 transition-all">
            <div className="text-4xl mb-4">📊</div>
            <h3 className="text-xl font-bold text-white mb-3">Analytics</h3>
            <p className="text-gray-300 mb-6">View sales and performance metrics</p>
            <Button
              variant="outline"
              className="w-full border-green-500/50 text-green-400 hover:bg-green-500/10"
            >
              View Analytics
            </Button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/30 rounded-2xl p-8 backdrop-blur-sm">
          <h2 className="text-2xl font-bold text-white mb-8">Dashboard Overview</h2>
          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center">
              <p className="text-4xl font-bold text-green-400 mb-2">0</p>
              <p className="text-gray-300">Total Orders</p>
            </div>
            <div className="text-center">
              <p className="text-4xl font-bold text-green-400 mb-2">0</p>
              <p className="text-gray-300">Pending Orders</p>
            </div>
            <div className="text-center">
              <p className="text-4xl font-bold text-green-400 mb-2">0</p>
              <p className="text-gray-300">Appointments</p>
            </div>
            <div className="text-center">
              <p className="text-4xl font-bold text-green-400 mb-2">0</p>
              <p className="text-gray-300">Total Revenue</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
