import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Star, ShoppingCart, MessageCircle, ArrowLeft, Check, Tag } from "lucide-react";
import { WHATSAPP_NUMBER } from "@/data/products";
import { useCart } from "@/context/CartContext";
import { useData } from "@/context/DataContext";
import ReviewSection from "@/components/ReviewSection";
import { toast } from "sonner";

const ProductDetails = () => {
  const { id } = useParams();
  const { products } = useData();
  const product = products.find((p) => p.id === id);
  const { addToCart } = useCart();
  const [isAdded, setIsAdded] = useState(false);

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <p className="text-muted-foreground">Product not found.</p>
        <Link to="/shop" className="text-primary hover:underline text-sm mt-2 inline-block">Back to Shop</Link>
      </div>
    );
  }

  const handleAddToCart = () => {
    addToCart(product);
    toast.success(`${product.name} added to cart!`);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  const discount = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);
  const whatsappLink = `https://wa.me/${WHATSAPP_NUMBER}?text=I want to order ${product.name} - ₹${product.price}`;

  const [selectedImage, setSelectedImage] = useState(product.images?.[0] || "");
  const hasImages = product.images && product.images.length > 0;

  return (
    <div className="container mx-auto px-4 py-6">
      <Link to="/shop" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary mb-6">
        <ArrowLeft className="w-4 h-4" /> Back to Shop
      </Link>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
        {/* Image - Premium Presentation */}
        <div className="space-y-6 animate-fade-in lg:sticky lg:top-24">
          <div className="glass-card rounded-[2.5rem] p-6 md:p-12 aspect-square flex items-center justify-center relative overflow-hidden group border border-white/50 shadow-2xl bg-white/40">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent" />

            {hasImages ? (
              <img
                src={selectedImage}
                alt={product.name}
                className="w-full h-full object-contain drop-shadow-3xl transition-all duration-700 group-hover:scale-105"
              />
            ) : (
              <div className="text-[10rem] md:text-[14rem] transition-transform duration-700 group-hover:scale-110 group-hover:rotate-6 drop-shadow-2xl">
                {product.category === "phone" ? "📱" : "💻"}
              </div>
            )}

            {discount > 0 && (
              <div className="absolute top-8 right-8 gradient-offer text-white px-4 py-2 rounded-2xl font-black text-sm shadow-xl">
                -{discount}%
              </div>
            )}
          </div>

          {hasImages && (
            <div className="grid grid-cols-4 gap-4">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(img)}
                  className={`aspect-square rounded-2xl overflow-hidden transition-all duration-300 border-2 ${selectedImage === img ? "border-primary shadow-lg scale-95" : "border-white/50 grayscale hover:grayscale-0 hover:border-primary/50"}`}
                >
                  <img src={img} alt={`${product.name} view ${i}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info - Clean & Modern */}
        <div className="animate-slide-up">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary mb-6 border border-primary/20">
            <Tag className="w-3.5 h-3.5" />
            <span className="text-[10px] font-black uppercase tracking-wider">{product.brand}</span>
          </div>

          <h1 className="text-3xl md:text-5xl font-black text-foreground mb-4 leading-tight tracking-tight">
            {product.name}
          </h1>

          <div className="flex items-center gap-1 mb-8">
            <div className="flex items-center gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className={`w-4 h-4 ${i < Math.floor(product.rating) ? "fill-accent text-accent" : "text-border"}`} />
              ))}
            </div>
            <span className="text-sm font-bold text-muted-foreground ml-2">
              {product.rating} <span className="font-normal opacity-60">({product.reviewCount} customer reviews)</span>
            </span>
          </div>

          <div className="flex items-baseline gap-4 mb-4">
            <span className="text-4xl md:text-5xl font-black text-primary tracking-tighter">₹{product.price.toLocaleString()}</span>
            {product.originalPrice > product.price && (
              <span className="text-xl text-muted-foreground line-through opacity-50">₹{product.originalPrice.toLocaleString()}</span>
            )}
          </div>

          <p className="text-muted-foreground text-sm md:text-base leading-relaxed mb-10 max-w-xl">
            {product.description}
          </p>

          <div className="mb-10 p-6 rounded-3xl bg-secondary/30 border border-border/50">
            <h3 className="font-black text-xs uppercase tracking-widest text-foreground mb-4">Core Specifications</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-6 text-sm">
              {product.specifications.map((spec, i) => (
                <div key={i} className="flex items-center gap-3 text-muted-foreground font-medium">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary/40" />
                  {spec}
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={handleAddToCart}
              className={`flex-1 py-5 rounded-[1.25rem] font-black transition-all flex items-center justify-center gap-3 text-lg shadow-2xl ${isAdded
                ? "bg-green-500 text-white shadow-green-500/20"
                : "bg-foreground text-background hover:opacity-90 shadow-primary/20 hover:scale-[1.02] active:scale-[0.98]"
                }`}
              disabled={isAdded}
            >
              {isAdded ? (
                <>
                  <Check className="w-5 h-5 animate-scale-in" /> Added to Cart
                </>
              ) : (
                <>
                  <ShoppingCart className="w-5 h-5" /> Add to Cart
                </>
              )}
            </button>
            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 bg-[#25D366] text-white py-5 rounded-[1.25rem] font-black hover:opacity-90 transition-all flex items-center justify-center gap-3 text-lg shadow-2xl shadow-green-500/20 hover:scale-[1.02] active:scale-[0.98]"
            >
              <MessageCircle className="w-5 h-5" /> Buy on WhatsApp
            </a>
          </div>

          <div className="mt-8 flex items-center gap-6 text-[10px] font-black text-muted-foreground uppercase tracking-widest">
            <div className="flex items-center gap-1.5"><Check className="w-3 h-3 text-primary" /> Free Shipping</div>
            <div className="flex items-center gap-1.5"><Check className="w-3 h-3 text-primary" /> 1 Year Warranty</div>
            <div className="flex items-center gap-1.5"><Check className="w-3 h-3 text-primary" /> Secure Payment</div>
          </div>
        </div>
      </div>

      {/* Reviews */}
      <div className="mt-10">
        <h2 className="text-xl font-bold text-foreground mb-4">Reviews & Ratings</h2>
        <ReviewSection productId={product.id} />
      </div>
    </div>
  );
};

export default ProductDetails;
