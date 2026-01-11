import { useParams } from "wouter";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";
import { Link } from "wouter";
import { ArrowLeft, Calendar, User } from "lucide-react";
import { Streamdown } from "streamdown";

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  const { user } = useAuth();
  const { data: post, isLoading } = trpc.blog.getBySlug.useQuery({ slug: slug || "" });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-green-500 mx-auto mb-4"></div>
          <p className="text-gray-300">Loading post...</p>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Link href="/blog">
            <Button variant="ghost" className="text-gray-300 hover:text-white mb-8">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Blog
            </Button>
          </Link>
          <div className="text-center py-20">
            <h1 className="text-3xl font-bold text-white mb-4">Post not found</h1>
            <p className="text-gray-300 mb-8">The blog post you're looking for doesn't exist.</p>
            <Link href="/blog">
              <Button className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700">
                Return to Blog
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <div className="bg-black/40 backdrop-blur-md border-b border-green-500/20 sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link href="/blog">
            <Button variant="ghost" size="sm" className="text-gray-300 hover:text-white">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Blog
            </Button>
          </Link>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Featured Image */}
        <div className="w-full h-96 bg-gradient-to-br from-green-400/20 to-emerald-400/20 rounded-2xl mb-8 flex items-center justify-center border border-green-500/30">
          <div className="text-center">
            <div className="text-6xl mb-4">📚</div>
            <p className="text-gray-400">Featured Image</p>
          </div>
        </div>

        {/* Title */}
        <h1 className="text-5xl font-bold text-white mb-6">{post.title}</h1>

        {/* Meta Information */}
        <div className="flex flex-wrap items-center gap-6 mb-8 pb-8 border-b border-green-500/30">
          {/* Category */}
          <div>
            <span className="inline-block px-4 py-2 bg-green-500/20 text-green-400 rounded-full text-sm font-semibold capitalize">
              {post.category.replace(/_/g, " ")}
            </span>
          </div>

          {/* Author */}
          <div className="flex items-center gap-2 text-gray-400">
            <User className="w-4 h-4" />
            <span>{post.author}</span>
          </div>

          {/* Date */}
          <div className="flex items-center gap-2 text-gray-400">
            <Calendar className="w-4 h-4" />
            <span>
              {new Date(post.publishedAt || post.createdAt).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </span>
          </div>

          {/* AI Generated Badge */}
          {post.generatedByAI && (
            <div>
              <span className="inline-block px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-xs font-semibold">
                AI Generated
              </span>
            </div>
          )}
        </div>

        {/* Excerpt */}
        {post.excerpt && (
          <p className="text-xl text-gray-300 mb-8 italic border-l-4 border-green-500 pl-6">
            {post.excerpt}
          </p>
        )}

        {/* Content */}
        <div className="prose prose-invert max-w-none mb-12">
          <Streamdown>{post.content}</Streamdown>
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/30 rounded-2xl p-8 backdrop-blur-sm text-center">
          <h3 className="text-2xl font-bold text-white mb-4">Ready to explore our products?</h3>
          <p className="text-gray-300 mb-6">
            Visit our menu to browse our premium selection or book a consultation with our specialists.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/menu">
              <Button className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700">
                Browse Menu
              </Button>
            </Link>
            <Link href="/appointments">
              <Button
                variant="outline"
                className="border-green-500/50 text-green-400 hover:bg-green-500/10"
              >
                Book Consultation
              </Button>
            </Link>
          </div>
        </div>

        {/* Related Posts */}
        <div className="mt-16 pt-16 border-t border-green-500/30">
          <h3 className="text-3xl font-bold text-white mb-8">More from the Blog</h3>
          <Link href="/blog">
            <Button
              variant="outline"
              className="border-green-500/50 text-green-400 hover:bg-green-500/10"
            >
              View All Posts
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
