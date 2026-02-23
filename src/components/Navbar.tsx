import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShoppingCart, Menu, X, Search, User, LogOut, LayoutDashboard, Package } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";

import logo from "@/assets/logo.png";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { totalItems } = useCart();
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.info("Logged out successfully");
    navigate("/");
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-background/80 backdrop-blur-md border-b border-border transition-all duration-300">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group shrink-0">
          <img
            src={logo}
            alt="AARO Systems Logo"
            className="h-14 md:h-20 w-auto object-contain transition-transform group-hover:scale-105"
            onError={(e) => {
              e.currentTarget.src = "https://placehold.co/200x60/7c3aed/ffffff?text=AARO+SYSTEMS";
            }}
          />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8 ml-8">
          <Link to="/shop" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">Shop</Link>
          <Link to="/phones" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">Phones</Link>
          <Link to="/laptops" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">Laptops</Link>
          <Link to="/offers" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">Offers</Link>
        </nav>

        <div className="flex-1 max-w-md hidden lg:flex relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search products..."
            className="w-full bg-secondary text-sm border-none rounded-full py-2 pl-10 pr-4 focus:ring-2 focus:ring-primary/20 transition-all outline-none"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button className="lg:hidden p-2 text-muted-foreground hover:text-primary" onClick={() => setIsSearchOpen(!isSearchOpen)}>
            <Search className="w-5 h-5" />
          </button>

          <Link to="/cart" className="p-2 text-muted-foreground hover:text-primary relative group">
            <ShoppingCart className="w-5 h-5 group-hover:scale-110 transition-transform" />
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-primary-foreground text-[10px] font-bold rounded-full flex items-center justify-center animate-bounce">
                {totalItems}
              </span>
            )}
          </Link>

          <div className="h-6 w-px bg-border mx-1" />

          {!isAuthenticated ? (
            <Link to="/login" className="flex items-center gap-2 px-4 py-2 rounded-full border border-border hover:bg-secondary transition-all">
              <User className="w-4 h-4 text-muted-foreground" />
              <span className="text-xs font-bold text-foreground">Login</span>
            </Link>
          ) : (
            <div className="flex items-center gap-2">
              <div className="relative group">
                <button className="flex items-center gap-2 p-2 rounded-full hover:bg-secondary transition-all">
                  <div className="w-8 h-8 rounded-full gradient-purple flex items-center justify-center text-[10px] font-bold text-primary-foreground">
                    {user?.name?.charAt(0).toUpperCase() || "U"}
                  </div>
                </button>
                <div className="absolute right-0 top-full mt-2 w-48 bg-card border border-border rounded-xl shadow-xl py-2 opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-all transform scale-95 group-hover:scale-100 z-[60]">
                  <div className="px-4 py-2 border-b border-border mb-1">
                    <p className="text-xs font-bold text-foreground truncate">{user?.name}</p>
                    <p className="text-[10px] text-muted-foreground truncate">{user?.email}</p>
                  </div>

                  {isAdmin && (
                    <Link to="/admin/dashboard" className="flex items-center gap-3 px-4 py-2 text-xs text-foreground hover:bg-secondary">
                      <LayoutDashboard className="w-4 h-4 text-primary" /> Admin Panel
                    </Link>
                  )}

                  <Link to="/profile" className="flex items-center gap-3 px-4 py-2 text-xs text-foreground hover:bg-secondary">
                    <User className="w-4 h-4 text-primary" /> My Profile
                  </Link>

                  {!isAdmin && (
                    <Link to="/my-orders" className="flex items-center gap-3 px-4 py-2 text-xs text-foreground hover:bg-secondary">
                      <Package className="w-4 h-4 text-primary" /> My Orders
                    </Link>
                  )}

                  <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-2 text-xs text-red-500 hover:bg-red-500/10 transition-colors">
                    <LogOut className="w-4 h-4" /> Logout
                  </button>
                </div>
              </div>
            </div>
          )}

          <button className="md:hidden p-2 text-muted-foreground" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden fixed inset-0 top-[65px] z-40 bg-background animate-fade-in-up">
          <nav className="flex flex-col p-6 gap-6">
            <Link to="/shop" className="text-lg font-bold border-b border-border pb-4" onClick={() => setIsMenuOpen(false)}>Shop</Link>
            <Link to="/phones" className="text-lg font-bold border-b border-border pb-4" onClick={() => setIsMenuOpen(false)}>Phones</Link>
            <Link to="/laptops" className="text-lg font-bold border-b border-border pb-4" onClick={() => setIsMenuOpen(false)}>Laptops</Link>
            <Link to="/offers" className="text-lg font-bold border-b border-border pb-4" onClick={() => setIsMenuOpen(false)}>Offers</Link>

            {isAuthenticated ? (
              <>
                <Link to={isAdmin ? "/admin/dashboard" : "/my-orders"} className="text-lg font-bold text-primary" onClick={() => setIsMenuOpen(false)}>
                  {isAdmin ? "Admin Dashboard" : "My Orders"}
                </Link>
                <button onClick={handleLogout} className="text-lg font-bold text-red-500 text-left">Logout</button>
              </>
            ) : (
              <Link to="/login" className="text-lg font-bold text-primary" onClick={() => setIsMenuOpen(false)}>Login / Register</Link>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;
