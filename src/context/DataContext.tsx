import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import {
    Product, Review, Offer, Category, Customer, Order,
    products as initialProducts,
    reviews as initialReviews,
    offers as initialOffers,
    categories as initialCategories,
    customers as initialCustomers,
    orders as initialOrders
} from "@/data/products";

interface DataContextType {
    products: Product[];
    reviews: Review[];
    offers: Offer[];
    categories: Category[];
    customers: Customer[];
    orders: Order[];
    loading: boolean;
    addProduct: (product: Product) => Promise<void>;
    updateProduct: (product: Product) => Promise<void>;
    deleteProduct: (id: string) => Promise<void>;
    addReview: (review: Review) => void;
    deleteReview: (id: string) => void;
    updateOffer: (offer: Offer) => void;
    deleteOffer: (id: string) => void;
    addOffer: (offer: Offer) => void;
    addCategory: (category: Category) => void;
    deleteCategory: (id: string) => void;
    updateOrderStatus: (id: string, status: Order["status"]) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export const DataProvider = ({ children }: { children: ReactNode }) => {
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchProducts = async () => {
        try {
            const response = await fetch(`${API_URL}/products`);
            if (response.ok) {
                const data = await response.json();
                const mappedData = data.map((p: any) => ({
                    ...p,
                    id: p._id || p.id
                }));
                setProducts(mappedData);
            }
        } catch (error) {
            console.error("Failed to fetch products:", error);
            setProducts([]);
        }
    };

    const fetchCategories = async () => {
        try {
            const response = await fetch(`${API_URL}/categories`);
            if (response.ok) {
                const data = await response.json();
                const mappedData = data.map((c: any) => ({
                    ...c,
                    id: c._id || c.id
                }));
                setCategories(mappedData);
            }
        } catch (error) {
            console.error("Failed to fetch categories:", error);
            setCategories([]);
        }
    };

    const fetchData = async () => {
        setLoading(true);
        await Promise.all([fetchProducts(), fetchCategories()]);
        setLoading(false);
    };

    useEffect(() => {
        fetchData();
    }, []);

    const [reviews, setReviews] = useState<Review[]>([]);
    const [offers, setOffers] = useState<Offer[]>([]);
    const [customers, setCustomers] = useState<Customer[]>(initialCustomers);
    const [orders, setOrders] = useState<Order[]>(initialOrders);

    const getToken = () => localStorage.getItem("aaro_token");

    const addProduct = async (product: Partial<Product>) => {
        try {
            const response = await fetch(`${API_URL}/products`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${getToken()}`
                },
                body: JSON.stringify(product),
            });
            if (response.ok) {
                await fetchProducts();
            } else {
                const error = await response.json();
                throw new Error(error.message || "Failed to add product");
            }
        } catch (error) {
            console.error("Error adding product:", error);
            throw error;
        }
    };

    const updateProduct = async (updatedProduct: Product) => {
        try {
            const response = await fetch(`${API_URL}/products/${updatedProduct.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${getToken()}`
                },
                body: JSON.stringify(updatedProduct),
            });
            if (response.ok) {
                await fetchProducts();
            }
        } catch (error) {
            console.error("Error updating product:", error);
        }
    };

    const deleteProduct = async (id: string) => {
        try {
            const response = await fetch(`${API_URL}/products/${id}`, {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${getToken()}`
                },
            });
            if (response.ok) {
                await fetchProducts();
            }
        } catch (error) {
            console.error("Error deleting product:", error);
        }
    };

    const addCategory = async (category: Partial<Category>) => {
        try {
            const response = await fetch(`${API_URL}/categories`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${getToken()}`
                },
                body: JSON.stringify(category),
            });
            if (response.ok) {
                await fetchCategories();
            }
        } catch (error) {
            console.error("Error adding category:", error);
        }
    };

    const deleteCategory = async (id: string) => {
        try {
            const response = await fetch(`${API_URL}/categories/${id}`, {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${getToken()}`
                },
            });
            if (response.ok) {
                await fetchCategories();
            }
        } catch (error) {
            console.error("Error deleting category:", error);
        }
    };

    const addReview = (review: Review) => setReviews((prev) => [...prev, review]);
    const deleteReview = (id: string) => setReviews((prev) => prev.filter((r) => r.id !== id));
    const updateOffer = (updatedOffer: Offer) => setOffers((prev) => prev.map((o) => (o.id === updatedOffer.id ? updatedOffer : o)));
    const deleteOffer = (id: string) => setOffers((prev) => prev.filter((o) => o.id !== id));
    const addOffer = (offer: Offer) => setOffers((prev) => [...prev, offer]);
    const updateOrderStatus = (id: string, status: Order["status"]) => setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o)));

    return (
        <DataContext.Provider
            value={{
                products, reviews, offers, categories, customers, orders, loading,
                addProduct, updateProduct, deleteProduct,
                addReview, deleteReview,
                updateOffer, deleteOffer, addOffer,
                addCategory, deleteCategory, updateOrderStatus
            }}
        >
            {children}
        </DataContext.Provider>
    );
};

export const useData = () => {
    const context = useContext(DataContext);
    if (context === undefined) throw new Error("useData must be used within a DataProvider");
    return context;
};
