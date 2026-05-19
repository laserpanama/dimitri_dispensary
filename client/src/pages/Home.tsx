import { useState, useEffect } from "react";
import AgeVerificationModal from "@/components/AgeVerificationModal";
import { Link } from "wouter";
import { Leaf, Calendar, BookOpen, Award, Users, Truck, ArrowRight } from "lucide-react";
import { trpc } from "@/lib/trpc";
import ProductCard from "@/components/ProductCard";
export default function Home() {
  const [ageVerified, setAgeVerified] = useState(false);
  const { data: featuredProducts = [] } = trpc.products.list.useQuery({ category: "flower" });

  useEffect(() => {
    const verified = localStorage.getItem("ageVerified") === "true";
    if (verified) setAgeVerified(true);
  }, []);

  const handleAgeVerified = () => {
    setAgeVerified(true);
  };

  const handleAddToCart = (productId: number) => {
    const cartItems = JSON.parse(localStorage.getItem("cartItems") || "[]");
    const existingItem = cartItems.find((item: any) => item.productId === productId);
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cartItems.push({ productId, quantity: 1 });
    }
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  };

  if (!ageVerified) {
    return <AgeVerificationModal onVerified={handleAgeVerified} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-green-600/20 via-transparent to-emerald-600/10" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32 relative">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-500/10 border border-green-500/30 rounded-full text-green-400 text-sm font-medium mb-8">
              <Leaf className="w-4 h-4" />
              Premium Cannabis Dispensary
            </div>
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
              Dimitri's
              <span className="block bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                Premium Cannabis
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 max-w-2xl mx-auto mb-10">
              Your trusted source for premium cannabis products in Panama. Quality, selection, and excellence.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link href="/menu">
                <button className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold px-8 py-4 rounded-xl text-lg transition-all duration-200 shadow-lg shadow-green-500/25 flex items-center gap-2">
                  Browse Our Menu
                  <ArrowRight className="w-5 h-5" />
                </button>
              </Link>
              <Link href="/appointments">
                <button className="border border-green-500/50 text-green-400 hover:bg-green-500/10 font-semibold px-8 py-4 rounded-xl text-lg transition-all duration-200">
                  Book Consultation
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <h2 className="text-3xl font-bold text-white text-center mb-12">Why Choose Us</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { icon: Award, title: "Premium Quality", desc: "Lab-tested products from trusted growers", color: "green" },
            { icon: Leaf, title: "Wide Selection", desc: "Flower, edibles, concentrates & more", color: "emerald" },
            { icon: Users, title: "Expert Support", desc: "Knowledgeable staff to guide you", color: "blue" },
            { icon: Truck, title: "Fast Delivery", desc: "Quick and discreet delivery service", color: "amber" },
          ].map((feature) => (
            <div key={feature.title} className="group relative overflow-hidden rounded-2xl bg-white/5 border border-white/10 p-6 hover:border-green-500/30 transition-all duration-300">
              <feature.icon className="w-10 h-10 text-green-400 mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
              <p className="text-gray-400 text-sm">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Featured Products */}
      {featuredProducts.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="flex items-center justify-between mb-12">
            <h2 className="text-3xl font-bold text-white">Featured Products</h2>
            <Link href="/menu">
              <span className="text-green-400 hover:text-green-300 font-medium flex items-center gap-1 cursor-pointer">
                View All <ArrowRight className="w-4 h-4" />
              </span>
            </Link>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProducts.slice(0, 3).map((product) => (
              <ProductCard key={product.id} product={product} onAddToCart={handleAddToCart} />
            ))}
          </div>
        </div>
      )}

      {/* Quick Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link href="/menu" className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/30 p-8 hover:border-green-500/50 transition-all">
            <Leaf className="w-12 h-12 text-green-400 mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">Browse Menu</h3>
            <p className="text-gray-400">Explore our full product catalog</p>
          </Link>
          <Link href="/appointments" className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-500/30 p-8 hover:border-blue-500/50 transition-all">
            <Calendar className="w-12 h-12 text-blue-400 mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">Book Appointment</h3>
            <p className="text-gray-400">Consult with our specialists</p>
          </Link>
          <Link href="/blog" className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/30 p-8 hover:border-purple-500/50 transition-all">
            <BookOpen className="w-12 h-12 text-purple-400 mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">Read Blog</h3>
            <p className="text-gray-400">Cannabis education & news</p>
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-white/10 bg-black/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div>
              <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
                <Leaf className="w-5 h-5 text-green-400" />
                Dimitri's Premium Cannabis
              </h3>
              <p className="text-gray-400 text-sm">Your trusted source for premium cannabis products in Panama.</p>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-gray-300 mb-3 uppercase tracking-wider">Quick Links</h4>
              <div className="space-y-2">
                <Link href="/menu"><span className="block text-gray-400 hover:text-green-400 text-sm cursor-pointer">Menu</span></Link>
                <Link href="/appointments"><span className="block text-gray-400 hover:text-green-400 text-sm cursor-pointer">Appointments</span></Link>
                <Link href="/blog"><span className="block text-gray-400 hover:text-green-400 text-sm cursor-pointer">Blog</span></Link>
                <Link href="/orders"><span className="block text-gray-400 hover:text-green-400 text-sm cursor-pointer">Order History</span></Link>
              </div>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-gray-300 mb-3 uppercase tracking-wider">Contact</h4>
              <p className="text-gray-400 text-sm">Panama City, Panama</p>
              <p className="text-gray-400 text-sm">info@dimitrisdispensary.com</p>
            </div>
          </div>
          <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-gray-500 text-sm">© 2026 Dimitri's Premium Cannabis Dispensary. All rights reserved.</p>
            <p className="text-gray-500 text-sm">For adults 21+ only. Use responsibly.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
