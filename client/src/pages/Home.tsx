import { useEffect, useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { getLoginUrl } from "@/const";
import AgeVerificationModal from "@/components/AgeVerificationModal";
import { Link } from "wouter";
import { Leaf, ShoppingCart, Calendar, BookOpen, LogOut } from "lucide-react";

export default function Home() {
  const { user, loading, isAuthenticated, logout } = useAuth();
  const [ageVerified, setAgeVerified] = useState(false);
  const [showAgeModal, setShowAgeModal] = useState(false);

  useEffect(() => {
    // Check if age was already verified in this session
    const verified = localStorage.getItem("ageVerified") === "true";
    setAgeVerified(verified);
    if (!verified) {
      setShowAgeModal(true);
    }
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-green-500 mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  if (showAgeModal && !ageVerified) {
    return <AgeVerificationModal onVerified={() => setAgeVerified(true)} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Navigation */}
      <nav className="bg-black/40 backdrop-blur-md border-b border-green-500/20 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Leaf className="w-8 h-8 text-green-500" />
            <h1 className="text-2xl font-bold text-white">Dimitri's Premium Dispensary</h1>
          </div>
          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <>
                <span className="text-gray-300 text-sm">{user?.name}</span>
                <Button
                  onClick={() => logout()}
                  variant="outline"
                  size="sm"
                  className="border-red-500/50 text-red-400 hover:bg-red-500/10"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </Button>
              </>
            ) : (
              <Button
                onClick={() => (window.location.href = getLoginUrl())}
                className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
              >
                Sign In
              </Button>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 sm:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div>
                <h2 className="text-5xl sm:text-6xl font-bold text-white mb-6 leading-tight">
                  Premium Cannabis,
                  <span className="block text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-400">
                    Elevated Experience
                  </span>
                </h2>
                <p className="text-xl text-gray-300 mb-8">
                  Discover our curated selection of premium cannabis products, expert consultations, and seamless ordering.
                </p>
              </div>

              <div className="flex flex-wrap gap-4">
                {isAuthenticated ? (
                  <>
                    <Link href="/menu">
                      <Button className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-8 py-6 text-lg">
                        <ShoppingCart className="w-5 h-5 mr-2" />
                        Browse Menu
                      </Button>
                    </Link>
                    <Link href="/appointments">
                      <Button
                        variant="outline"
                        className="border-green-500/50 text-green-400 hover:bg-green-500/10 px-8 py-6 text-lg"
                      >
                        <Calendar className="w-5 h-5 mr-2" />
                        Book Consultation
                      </Button>
                    </Link>
                  </>
                ) : (
                  <Button
                    onClick={() => (window.location.href = getLoginUrl())}
                    className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-8 py-6 text-lg"
                  >
                    Get Started
                  </Button>
                )}
              </div>
            </div>

            {/* Hero Image */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-3xl blur-3xl"></div>
              <div className="relative bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/30 rounded-3xl p-8 backdrop-blur-sm">
                <div className="aspect-square bg-gradient-to-br from-green-400/20 to-emerald-400/20 rounded-2xl flex items-center justify-center">
                  <Leaf className="w-32 h-32 text-green-500/30" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-black/20 border-y border-green-500/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-4xl font-bold text-white text-center mb-16">Why Choose Us</h3>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/30 rounded-2xl p-8 backdrop-blur-sm hover:border-green-500/50 transition-all duration-300">
              <ShoppingCart className="w-12 h-12 text-green-400 mb-4" />
              <h4 className="text-xl font-bold text-white mb-3">Premium Selection</h4>
              <p className="text-gray-300">
                Carefully curated products from trusted growers and manufacturers.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/30 rounded-2xl p-8 backdrop-blur-sm hover:border-green-500/50 transition-all duration-300">
              <Calendar className="w-12 h-12 text-green-400 mb-4" />
              <h4 className="text-xl font-bold text-white mb-3">Expert Consultations</h4>
              <p className="text-gray-300">
                Book appointments with our cannabis specialists for personalized guidance.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/30 rounded-2xl p-8 backdrop-blur-sm hover:border-green-500/50 transition-all duration-300">
              <BookOpen className="w-12 h-12 text-green-400 mb-4" />
              <h4 className="text-xl font-bold text-white mb-3">Educational Content</h4>
              <p className="text-gray-300">
                Stay informed with our regularly updated blog on cannabis education and wellness.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      {!isAuthenticated && (
        <section className="py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h3 className="text-4xl font-bold text-white mb-6">Ready to Explore?</h3>
            <p className="text-xl text-gray-300 mb-8">
              Sign in to browse our menu, place orders, and book consultations.
            </p>
            <Button
              onClick={() => (window.location.href = getLoginUrl())}
              className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-8 py-6 text-lg"
            >
              Sign In Now
            </Button>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="bg-black/40 border-t border-green-500/20 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-gray-400">
          <p>&copy; 2026 Dimitri's Premium Cannabis Dispensary. All rights reserved.</p>
          <p className="text-sm mt-2">
            This site is intended for adults 21 and older. Please consume responsibly.
          </p>
        </div>
      </footer>
    </div>
  );
}
