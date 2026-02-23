import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Leaf } from "lucide-react";
import { Product } from "@shared/types";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface ProductCardProps {
  product: Product;
  onAddToCart: (productId: number) => void;
}

export default function ProductCard({ product, onAddToCart }: ProductCardProps) {
  const [hasImageError, setHasImageError] = useState(false);

  return (
    <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/30 rounded-2xl p-6 backdrop-blur-sm hover:border-green-500/50 transition-all duration-300 group h-full flex flex-col">
      {/* Product Image */}
      <div className="w-full h-48 bg-gradient-to-br from-green-400/20 to-emerald-400/20 rounded-xl mb-4 flex items-center justify-center group-hover:from-green-400/30 group-hover:to-emerald-400/30 transition-all overflow-hidden">
        {product.image && !hasImageError ? (
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
            loading="lazy"
            onError={() => setHasImageError(true)}
          />
        ) : (
          <Leaf className="w-16 h-16 text-green-500/30" />
        )}
      </div>

      {/* Product Info */}
      <h3 className="text-xl font-bold text-white mb-2">{product.name}</h3>

      {product.strain && <p className="text-sm text-green-400 mb-2">Strain: {product.strain}</p>}

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
      <div className="flex items-center justify-between mt-auto">
        <span className="text-2xl font-bold text-green-400">${product.price}</span>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              onClick={() => onAddToCart(product.id)}
              disabled={product.quantity === 0}
              aria-label={`Add ${product.name} to cart${product.quantity === 0 ? " (Out of stock)" : ""}`}
              className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
            >
              <ShoppingCart className="w-4 h-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            {product.quantity === 0 ? "Out of stock" : "Add to cart"}
          </TooltipContent>
        </Tooltip>
      </div>

      {product.quantity === 0 && <p className="text-red-400 text-sm mt-2">Out of stock</p>}
    </div>
  );
}
