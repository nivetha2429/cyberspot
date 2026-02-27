import { useState, useEffect } from "react";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { WHATSAPP_NUMBER } from "@/data/products";
import { MessageCircle, CheckCircle, Package } from "lucide-react";
import { toast } from "sonner";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const OrderForm = () => {
  const { items, totalPrice, clearCart } = useCart();
  const { user, token, isAuthenticated } = useAuth();
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    name: user?.name || "",
    address: "",
    phone: user?.phone || "",
    email: user?.email || ""
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setForm(prev => ({
        ...prev,
        name: user.name || prev.name,
        phone: user.phone || prev.phone,
        email: user.email || prev.email
      }));
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.phone || !form.address) {
      return toast.error("Please fill in name, phone and address");
    }

    if (!isAuthenticated) return toast.error("Please login to place an order");

    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token} `
        },
        body: JSON.stringify({
          items,
          totalAmount: totalPrice,
          shippingAddress: form.address
        }),
      });

      if (response.ok) {
        setSubmitted(true);
        toast.success("Order placed successfully!");
        clearCart();
      } else {
        const data = await response.json();
        toast.error(data.message || "Failed to place order");
      }
    } catch (err) {
      toast.error("Network error. Is the server running?");
    } finally {
      setLoading(false);
    }
  };

  const whatsappMsg = `Order from ${form.name} \nPhone: ${form.phone} \nAddress: ${form.address} \n\nProducts: \n${items.map((i) => `${i.product.name} x${i.quantity} - ₹${i.product.price * i.quantity}`).join("\n")} \n\nTotal: ₹${totalPrice} `;
  const whatsappLink = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(whatsappMsg)}`;

  if (submitted) {
    return (
      <div className="container mx-auto px-4 py-16 text-center animate-fade-in">
        <CheckCircle className="w-16 h-16 mx-auto text-primary mb-4" />
        <h2 className="text-2xl font-bold text-foreground mb-2">Order Placed!</h2>
        <p className="text-muted-foreground mb-6">Your order is being processed. You can track it in My Orders.</p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 bg-[#25D366] text-white px-6 py-2.5 rounded-xl font-medium hover:opacity-90 transition-opacity">
            <MessageCircle className="w-4 h-4" /> Also send via WhatsApp
          </a>
          <a href="/my-orders" className="inline-flex items-center gap-2 bg-secondary text-foreground px-6 py-2.5 rounded-xl font-medium hover:bg-border transition-colors">
            <Package className="w-4 h-4" /> View My Orders
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 max-w-lg animate-fade-in">
      <h1 className="text-3xl font-bold text-foreground mb-6">Delivery Details</h1>
      <form onSubmit={handleSubmit} className="bg-card border border-border rounded-2xl p-6 shadow-soft space-y-4">
        {[
          { label: "Full Name *", key: "name", type: "text" },
          { label: "Phone Number *", key: "phone", type: "tel" },
          { label: "Email (Optional)", key: "email", type: "email" },
        ].map((f) => (
          <div key={f.key}>
            <label className="text-xs font-bold text-muted-foreground uppercase mb-1.5 block tracking-wider">{f.label}</label>
            <input
              type={f.type}
              value={(form as any)[f.key]}
              onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-border bg-secondary text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all font-medium"
            />
          </div>
        ))}
        <div>
          <label className="text-xs font-bold text-muted-foreground uppercase mb-1.5 block tracking-wider">Shipping Address *</label>
          <textarea
            value={form.address}
            onChange={(e) => setForm({ ...form, address: e.target.value })}
            rows={3}
            className="w-full px-4 py-3 rounded-xl border border-border bg-secondary text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none transition-all font-medium"
          />
        </div>

        {items.length > 0 && (
          <div className="bg-secondary/50 rounded-xl p-4 border border-border/50">
            <div className="flex justify-between items-center mb-1 text-xs text-muted-foreground font-bold uppercase">
              <span>Items Total</span>
              <span>{items.length} Product(s)</span>
            </div>
            <div className="flex justify-between items-center text-xl font-bold text-foreground">
              <span>Grand Total</span>
              <span className="text-primary">₹{totalPrice.toLocaleString()}</span>
            </div>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full gradient-purple text-primary-foreground py-3.5 rounded-xl font-bold hover:opacity-90 transition-all transform hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50"
        >
          {loading ? "Processing Order..." : "Confirm & Place Order"}
        </button>
      </form>
    </div>
  );
};

export default OrderForm;
