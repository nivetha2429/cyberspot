import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Lock } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem("aaro_admin")) {
      navigate("/admin/dashboard", { replace: true });
    }
  }, [navigate]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (email === "admin@aaro.com" && password === "admin123") {
      const adminUser = {
        id: "admin-id",
        name: "Admin User",
        email: "admin@aaro.com",
        role: "admin" as const
      };

      localStorage.setItem("aaro_admin", "true");
      login("demo-admin-token", adminUser);

      toast.success("Welcome back, Admin!");
      navigate("/admin/dashboard", { replace: true });
    } else {
      toast.error("Invalid credentials.");
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <form onSubmit={handleLogin} className="bg-card rounded-lg p-8 shadow-soft w-full max-w-sm">
        <div className="w-14 h-14 rounded-full gradient-purple mx-auto flex items-center justify-center mb-4">
          <Lock className="w-7 h-7 text-primary-foreground" />
        </div>
        <h2 className="text-xl font-bold text-foreground text-center mb-6">Admin Login</h2>
        <div className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2.5 rounded-lg border border-border bg-secondary text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2.5 rounded-lg border border-border bg-secondary text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
          <button type="submit" className="w-full gradient-purple text-primary-foreground py-3 rounded-lg font-medium hover:opacity-90 transition-opacity">
            Login
          </button>
        </div>
        <p className="text-xs text-muted-foreground text-center mt-4">Demo: admin@aaro.com / admin123</p>
      </form>
    </div>
  );
};

export default AdminLogin;
