import { useState, useEffect } from "react";
import AgeVerificationModal from "@/components/AgeVerificationModal";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { Link } from "wouter";
import { Leaf, ShoppingCart, Calendar, BookOpen } from "lucide-react";

export default function Home() {
  const [ageVerified, setAgeVerified] = useState(true); // BYPASSED
  const [loading, setLoading] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
            Dimitri Dispensary
          </h1>
          <div className="flex gap-4">
            <LanguageSwitcher />
            <Link href="/cart" className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90">
              <ShoppingCart className="w-5 h-5" />
              Cart
            </Link>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Link href="/menu" className="group relative overflow-hidden rounded-2xl bg-card p-6 hover:shadow-xl transition-all">
            <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-emerald-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
            <Leaf className="w-12 h-12 mb-4 text-green-600" />
            <h2 className="text-xl font-semibold mb-2">Browse Menu</h2>
            <p className="text-muted-foreground">Explore our products</p>
          </Link>

          <Link href="/appointments" className="group relative overflow-hidden rounded-2xl bg-card p-6 hover:shadow-xl transition-all">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
            <Calendar className="w-12 h-12 mb-4 text-blue-600" />
            <h2 className="text-xl font-semibold mb-2">Appointments</h2>
            <p className="text-muted-foreground">Book a consultation</p>
          </Link>

          <Link href="/blog" className="group relative overflow-hidden rounded-2xl bg-card p-6 hover:shadow-xl transition-all">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
            <BookOpen className="w-12 h-12 mb-4 text-purple-600" />
            <h2 className="text-xl font-semibold mb-2">Blog</h2>
            <p className="text-muted-foreground">Latest articles</p>
          </Link>

          <Link href="/orders" className="group relative overflow-hidden rounded-2xl bg-card p-6 hover:shadow-xl transition-all">
            <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 to-orange-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
            <ShoppingCart className="w-12 h-12 mb-4 text-amber-600" />
            <h2 className="text-xl font-semibold mb-2">Order History</h2>
            <p className="text-muted-foreground">View past orders</p>
          </Link>
        </div>
      </div>
    </div>
  );
}
