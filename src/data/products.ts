export interface Product {
  id: string;
  name: string;
  brand: string;
  category: string;
  price: number;
  originalPrice: number;
  rating: number;
  reviewCount: number;
  description: string;
  specifications: string[];
  images: string[];
  featured: boolean;
  videoUrl?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  productCount: number;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: "customer" | "admin";
  joinedDate: string;
  totalOrders: number;
}

export interface Order {
  id: string;
  customerId: string;
  customerName: string;
  items: {
    productId: string;
    productName: string;
    quantity: number;
    price: number;
  }[];
  totalAmount: number;
  status: "Pending" | "Processing" | "Shipped" | "Delivered" | "Cancelled";
  date: string;
}

export interface Review {
  id: string;
  productId: string;
  name: string;
  rating: number;
  comment: string;
  date: string;
}

export interface Offer {
  id: string;
  title: string;
  description: string;
  discount: number;
  code: string;
  image?: string;
  active: boolean;
}

export const products: Product[] = [];

export const categories: Category[] = [];

export const customers: Customer[] = [];

export const orders: Order[] = [];

export const reviews: Review[] = [];

export const offers: Offer[] = [];

export const WHATSAPP_NUMBER = "91XXXXXXXXXX";
export const INSTAGRAM_URL = "https://instagram.com/aaro";
