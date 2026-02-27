import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import { Settings, ExternalLink, RefreshCw } from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const AdminOrders = () => {
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const { token, isAdmin } = useAuth();

    useEffect(() => {
        if (isAdmin) fetchAllOrders();
    }, [isAdmin]);

    const fetchAllOrders = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${API_URL}/admin/orders`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await response.json();
            if (response.ok) {
                setOrders(data);
            } else {
                toast.error("Access denied");
            }
        } catch (err) {
            toast.error("Connection error");
        } finally {
            setLoading(false);
        }
    };

    const updateStatus = async (orderId: string, newStatus: string) => {
        try {
            const response = await fetch(`${API_URL}/admin/orders/${orderId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ status: newStatus }),
            });
            if (response.ok) {
                toast.success(`Order ${newStatus}`);
                setOrders(orders.map(o => o._id === orderId ? { ...o, status: newStatus } : o));
            }
        } catch (err) {
            toast.error("Update failed");
        }
    };

    if (!isAdmin) return <div className="p-12 text-center text-red-500 font-bold">Unauthorized Access</div>;
    if (loading) return <div className="p-12 text-center animate-pulse text-muted-foreground">Fetching all orders...</div>;

    return (
        <div className="container mx-auto px-4 py-8 animate-fade-in">
            <div className="flex justify-between items-center mb-10">
                <div>
                    <h1 className="text-3xl font-bold text-foreground">Order Management</h1>
                    <p className="text-muted-foreground">Monitor and manage all customer orders</p>
                </div>
                <button onClick={fetchAllOrders} className="p-2 rounded-lg bg-secondary hover:bg-border transition-colors">
                    <RefreshCw className="w-5 h-5 text-foreground" />
                </button>
            </div>

            <div className="bg-card border border-border rounded-3xl overflow-hidden shadow-soft">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-secondary/50 text-xs uppercase tracking-tighter font-bold text-muted-foreground border-b border-border">
                                <th className="px-6 py-4">Customer</th>
                                <th className="px-6 py-4">Order Items</th>
                                <th className="px-6 py-4">Amount</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {orders.map((order) => (
                                <tr key={order._id} className="hover:bg-secondary/20 transition-colors">
                                    <td className="px-6 py-4">
                                        <p className="font-bold text-foreground">{order.userId?.name || "Deleted User"}</p>
                                        <p className="text-xs text-muted-foreground">{order.userId?.email}</p>
                                    </td>
                                    <td className="px-6 py-4">
                                        {order.items.map((item: any, i: number) => (
                                            <p key={i} className="text-xs text-muted-foreground">{item.product.name} x{item.quantity}</p>
                                        ))}
                                    </td>
                                    <td className="px-6 py-4 font-bold text-primary">₹{order.totalAmount.toLocaleString()}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase transition-all ${order.status === "Delivered" ? "bg-green-500/10 text-green-500 border border-green-500/20" :
                                            order.status === "Shipped" ? "bg-primary/10 text-primary border border-primary/20" :
                                                "bg-orange-500/10 text-orange-500 border border-orange-500/20"
                                            }`}>
                                            {order.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <select
                                            value={order.status}
                                            onChange={(e) => updateStatus(order._id, e.target.value)}
                                            className="bg-secondary text-xs font-bold rounded-lg border border-border p-1.5 focus:outline-none focus:ring-2 focus:ring-primary/30"
                                        >
                                            {["Pending", "Processing", "Shipped", "Delivered"].map(s => (
                                                <option key={s} value={s}>{s}</option>
                                            ))}
                                        </select>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminOrders;
