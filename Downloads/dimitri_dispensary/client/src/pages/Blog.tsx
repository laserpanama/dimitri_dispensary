import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";
import { Link } from "wouter";
import { ArrowLeft, BookOpen, ArrowRight } from "lucide-react";

export default function Blog() {
  const { user } = useAuth();
  const { data: posts = [], isLoading } = trpc.blog.list.useQuery();

  const categories = [
    { value: "education", label: "Education" },
    { value: "strain_review", label: "Strain Reviews" },
    { value: "industry_news", label: "Industry News" },
    { value: "wellness", label: "Wellness" },
  ];

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
          <h1 className="text-2xl font-bold text-white">Cannabis Education Blog</h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero */}
        <div className="mb-16 text-center">
          <h2 className="text-4xl font-bold text-white mb-4">Learn & Explore</h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Stay informed with expert insights on cannabis education, strain reviews, industry trends, and wellness tips.
          </p>
        </div>

        {/* Loading State */}
        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-green-500 mx-auto mb-4"></div>
            <p className="text-gray-300">Loading blog posts...</p>
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-20">
            <BookOpen className="w-20 h-20 text-gray-600 mx-auto mb-6" />
            <h3 className="text-2xl font-bold text-white mb-4">No posts yet</h3>
            <p className="text-gray-300">Check back soon for cannabis education content!</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <Link key={post.id} href={`/blog/${post.slug}`}>
                <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/30 rounded-2xl overflow-hidden backdrop-blur-sm hover:border-green-500/50 transition-all duration-300 group cursor-pointer h-full flex flex-col">
                  {/* Featured Image */}
                  <div className="w-full h-48 bg-gradient-to-br from-green-400/20 to-emerald-400/20 flex items-center justify-center group-hover:from-green-400/30 group-hover:to-emerald-400/30 transition-all">
                    <BookOpen className="w-16 h-16 text-green-500/30" />
                  </div>

                  {/* Content */}
                  <div className="p-6 flex-1 flex flex-col">
                    {/* Category */}
                    <div className="mb-3">
                      <span className="inline-block px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-xs font-semibold capitalize">
                        {post.category.replace(/_/g, " ")}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="text-xl font-bold text-white mb-3 group-hover:text-green-400 transition-colors line-clamp-2">
                      {post.title}
                    </h3>

                    {/* Excerpt */}
                    <p className="text-gray-300 text-sm mb-4 flex-1 line-clamp-3">
                      {post.excerpt || post.content.substring(0, 150)}...
                    </p>

                    {/* Meta */}
                    <div className="flex items-center justify-between pt-4 border-t border-green-500/20">
                      <div className="text-xs text-gray-400">
                        {new Date(post.publishedAt || post.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </div>
                      <ArrowRight className="w-4 h-4 text-green-400 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
