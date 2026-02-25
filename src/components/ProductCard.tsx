import { useState } from "react";
import { Link } from "react-router-dom";
import { Star, ShoppingCart, Check } from "lucide-react";
import { toast } from "sonner";
import { Product } from "@/data/products";
import { useCart } from "@/context/CartContext";

const ProductCard = ({ product }: { product: Product }) => {
  const { addToCart } = useCart();
  const [isAdded, setIsAdded] = useState(false);
  const discount = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);

  const handleAddToCart = () => {
    addToCart(product);
    toast.success(`${product.name} added to cart!`);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  return (
    <div className="glass-card rounded-[2rem] p-4 group animate-fade-in relative flex flex-col h-full border border-white/40 hover:shadow-2xl hover:shadow-primary/10 transition-all duration-500 hover:-translate-y-1">
      <Link to={`/product/${product.id}`} className="block relative overflow-hidden rounded-2xl mb-4 h-48 md:h-56">
        <div className="w-full h-full bg-secondary/30 flex items-center justify-center transition-transform duration-700 group-hover:scale-110">
          {product.images && product.images.length > 0 ? (
            <img
              src={product.images[0]}
              alt={product.name}
              className="w-full h-full object-contain p-4 drop-shadow-2xl"
            />
          ) : (
            <div className="text-6xl md:text-8xl drop-shadow-xl transform transition-all group-hover:rotate-6">
              {product.category === "phone" ? "📱" : "💻"}
            </div>
          )}
        </div>

        {discount > 0 && (
          <div className="absolute top-3 right-3 gradient-offer text-white text-[10px] font-black px-3 py-1.5 rounded-full shadow-lg backdrop-blur-md">
            -{discount}%
          </div>
        )}
      </Link>

      <div className="flex-1 flex flex-col">
        <div className="mb-2">
          <p className="text-[10px] font-black text-primary uppercase tracking-widest mb-1">{product.brand}</p>
          <Link to={`/product/${product.id}`}>
            <h3 className="font-black text-foreground text-sm md:text-base leading-tight hover:text-primary transition-colors line-clamp-2">{product.name}</h3>
          </Link>
        </div>

        <div className="flex items-center gap-1.5 mb-3">
          <div className="flex items-center">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} className={`w-3 h-3 ${i < Math.floor(product.rating) ? "fill-accent text-accent" : "text-border"}`} />
            ))}
          </div>
          <span className="text-[10px] font-bold text-muted-foreground">({product.reviewCount})</span>
        </div>

        <div className="mt-auto">
          <div className="flex items-baseline gap-2 mb-4">
            <span className="text-xl md:text-2xl font-black text-primary tracking-tighter">₹{product.price.toLocaleString()}</span>
            {product.originalPrice > product.price && (
              <span className="text-xs text-muted-foreground line-through opacity-50 font-bold">₹{product.originalPrice.toLocaleString()}</span>
            )}
          </div>

          <button
            onClick={handleAddToCart}
            className={`w-full py-3.5 rounded-2xl text-xs font-black transition-all flex items-center justify-center gap-2 border border-white/10 ${isAdded
              ? "bg-green-500 text-white shadow-xl shadow-green-500/20"
              : "bg-foreground text-background hover:opacity-90 shadow-xl shadow-primary/10 hover:scale-[1.02] active:scale-[0.98]"
              }`}
            disabled={isAdded}
          >
            {isAdded ? (
              <>
                <Check className="w-4 h-4 animate-scale-in" /> Added
              </>
            ) : (
              <>
                <ShoppingCart className="w-4 h-4" /> Add to Cart
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
