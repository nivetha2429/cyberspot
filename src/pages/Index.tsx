import { Link } from "react-router-dom";
import { Smartphone, Laptop, Tag, Truck, Shield, Award, Headphones, Star } from "lucide-react";
import ProductCard from "@/components/ProductCard";

import { OfferPopup } from "@/components/OfferPopup";
import { useData } from "@/context/DataContext";
import heroBanner from "@/assets/hero-banner.jpg";

const categories = [
  { name: "Phones", icon: Smartphone, link: "/shop?category=phone" },
  { name: "Laptops", icon: Laptop, link: "/shop?category=laptop" },
  { name: "Offers", icon: Tag, link: "/offers" },
];

const features = [
  { icon: Truck, label: "Free Shipping" },
  { icon: Shield, label: "Best Quality" },
  { icon: Award, label: "Top Brands" },
  { icon: Headphones, label: "24/7 Support" },
];

const PHONE_BRANDS = [
  "Apple", "Samsung", "Oppo", "Vivo", "Lava", "Realme", "OnePlus",
  "Nothing", "Tecno", "Infinix", "Motorola", "Google", "Xiaomi", "Honor"
];

const LAPTOP_BRANDS = [
  "Dell", "HP", "Lenovo", "Apple", "Asus", "Acer", "Samsung", "Microsoft", "MSI"
];

const Index = () => {
  const { products } = useData();
  const featured = products.filter((p) => p.featured);

  return (
    <>
      <OfferPopup />
      {/* Hero */}
      <section className="relative overflow-hidden rounded-2xl mx-4 mt-4 shadow-soft">
        <img src={heroBanner} alt="Summer Sale" className="w-full h-[300px] md:h-80 object-cover" />
        <div className="absolute inset-0 flex items-center p-4 md:p-12">
          <div className="glass p-6 md:p-8 rounded-2xl max-w-lg transform transition-all hover:scale-105 duration-500">
            <h1 className="text-2xl md:text-5xl font-extrabold text-foreground mb-2 text-glow">Summer Sale</h1>
            <p className="text-lg md:text-3xl font-bold text-foreground/90 mb-4">50% OFF on All Products</p>
            <Link to="/shop" className="inline-block gradient-purple text-primary-foreground px-5 py-2 md:px-6 md:py-3 rounded-lg font-semibold text-sm md:text-base hover:opacity-90 transition-opacity shadow-lg">
              Shop Now
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-4 mt-8">
        <div className="flex flex-wrap justify-center gap-x-6 gap-y-3">
          {features.map((f) => (
            <div key={f.label} className="flex items-center gap-2 text-sm text-muted-foreground">
              <f.icon className="w-4 h-4 text-primary" />
              <span>{f.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="container mx-auto px-4 mt-10">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl md:text-2xl font-bold text-foreground">Featured Products</h2>
          <Link to="/shop" className="text-sm text-primary font-medium hover:underline">View all →</Link>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
          {featured.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="container mx-auto px-4 mt-10">
        <h2 className="text-xl md:text-2xl font-bold text-foreground mb-6 text-glow">Shop by Category</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
          {categories.map((c) => (
            <Link key={c.name} to={c.link} className="glass-card rounded-lg p-6 text-center group">
              <c.icon className="w-8 h-8 md:w-10 md:h-10 mx-auto text-primary mb-2 group-hover:scale-110 transition-transform" />
              <span className="font-medium text-foreground text-sm">{c.name}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Brands Showcase */}
      <section className="container mx-auto px-4 mt-16 group">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <h2 className="text-2xl md:text-4xl font-black text-foreground mb-2 text-glow">Shop by Brand</h2>
            <p className="text-muted-foreground text-sm md:text-base">Explore our wide range of premium electronics from global leaders.</p>
          </div>
          <div className="h-1 w-20 bg-primary rounded-full hidden md:block mb-3 animate-pulse" />
        </div>

        <div className="space-y-10">
          {/* Phone Brands */}
          <div className="animate-fade-in" style={{ animationDelay: "100ms" }}>
            <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-primary mb-4 flex items-center gap-3">
              <Smartphone className="w-4 h-4" /> Phone Brands
            </h3>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-9 gap-2 md:gap-3">
              {Array.from(new Set(products.filter(p => p.category === 'phone').map(p => p.brand))).sort().map((brand) => (
                <Link
                  key={brand}
                  to={`/shop?brand=${brand}`}
                  className="glass-card px-3 py-4 text-center rounded-xl hover:bg-primary/5 transition-all group/brand"
                >
                  <span className="text-xs font-bold text-foreground group-hover/brand:text-primary transition-colors">{brand}</span>
                </Link>
              ))}
            </div>
          </div>

          {/* Laptop Brands */}
          <div className="animate-fade-in" style={{ animationDelay: "200ms" }}>
            <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-primary mb-4 flex items-center gap-3">
              <Laptop className="w-4 h-4" /> Laptop Brands
            </h3>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-9 gap-2 md:gap-3">
              {Array.from(new Set(products.filter(p => p.category === 'laptop').map(p => p.brand))).sort().map((brand) => (
                <Link
                  key={brand}
                  to={`/shop?brand=${brand}`}
                  className="glass-card px-3 py-4 text-center rounded-xl hover:bg-primary/5 transition-all group/brand"
                >
                  <span className="text-xs font-bold text-foreground group-hover/brand:text-primary transition-colors">{brand}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="container mx-auto px-4 mt-10 mb-8">
        <div className="glass rounded-lg p-6 text-center">
          <h3 className="text-lg font-bold text-foreground mb-2">Stay Updated</h3>
          <p className="text-sm text-muted-foreground mb-4">Subscribe for the latest deals and offers.</p>
          <div className="flex flex-col sm:flex-row max-w-md mx-auto gap-2">
            <input type="email" placeholder="Your email address" className="flex-1 px-4 py-2 rounded-lg border border-border bg-secondary text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
            <button className="gradient-purple text-primary-foreground px-6 py-2 rounded-lg font-medium text-sm hover:opacity-90 transition-opacity whitespace-nowrap">Subscribe</button>
          </div>
        </div>
      </section>
    </>
  );
};

export default Index;
