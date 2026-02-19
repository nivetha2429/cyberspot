import ProductCard from "@/components/ProductCard";
import { useData } from "@/context/DataContext";

const Laptops = () => {
  const { products } = useData();
  const laptops = products.filter((p) => p.category === "laptop");

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-3xl font-bold text-foreground mb-6 text-glow">Laptops</h1>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 animate-slide-up">
        {laptops.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </div>
  );
};

export default Laptops;
