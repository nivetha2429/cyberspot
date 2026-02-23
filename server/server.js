import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { MongoMemoryServer } from 'mongodb-memory-server';

import Product from './models/Product.js';
import User from './models/User.js';
import Order from './models/Order.js';
import { authMiddleware, isAdmin } from './middleware/authMiddleware.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'your_super_secret_jwt_key_change_me';

const connectDB = async () => {
    let mongoUri = process.env.MONGODB_URI;

    try {
        if (mongoUri) {
            console.log(`Verifying connection to MongoDB...`);
            await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 5000 });
            console.log('Connected to MongoDB successfully!');
        } else {
            throw new Error('MONGODB_URI not provided, falling back to Memory Server');
        }
    } catch (err) {
        console.log(`${err.message}. Initializing Fallback Memory Server...`);
        try {
            const mongoServer = await MongoMemoryServer.create();
            const memoryUri = mongoServer.getUri();
            await mongoose.connect(memoryUri);
            console.log('Connected to MongoDB Memory Server');

            const count = await Product.countDocuments();
            if (count === 0) {
                const initialProducts = [
                    // PHONES
                    { name: "iPhone 15 Pro", brand: "Apple", category: "phone", price: 999, originalPrice: 1099, rating: 4.8, reviewCount: 1240, description: "Titanium design, A17 Pro chip, and advanced camera system.", specifications: ["6.1\" OLED", "A17 Pro", "48MP Main", "256GB"], images: [], isFeatured: true },
                    { name: "Galaxy S24 Ultra", brand: "Samsung", category: "phone", price: 1299, originalPrice: 1399, rating: 4.7, reviewCount: 850, description: "AI-powered flagship with S Pen and 200MP camera.", specifications: ["6.8\" AMOLED", "SD 8 Gen 3", "200MP Main", "512GB"], images: [], isFeatured: true },
                    { name: "Xiaomi 14 Ultra", brand: "Xiaomi", category: "phone", price: 1099, originalPrice: 1199, rating: 4.6, reviewCount: 420, description: "Leica optics and professional-grade camera capabilities.", specifications: ["6.73\" LTPO AMOLED", "SD 8 Gen 3", "Leica Quad Camera", "512GB"], images: [], isFeatured: true },
                    { name: "OnePlus 12", brand: "OnePlus", category: "phone", price: 799, originalPrice: 899, rating: 4.5, reviewCount: 310, description: "Smooth Beyond Belief with Hasselblad Camera.", specifications: ["6.82\" 120Hz AMOLED", "SD 8 Gen 3", "50MP Main", "256GB"], images: [], isFeatured: true },
                    { name: "Pixel 8 Pro", brand: "Google", category: "phone", price: 999, originalPrice: 1099, rating: 4.4, reviewCount: 560, description: "The best of Google AI and photography.", specifications: ["6.7\" Super Actua", "Tensor G3", "50MP Camera", "128GB"], images: [], isFeatured: false },
                    { name: "Vivo X100 Pro", brand: "Vivo", category: "phone", price: 899, originalPrice: 999, rating: 4.6, reviewCount: 210, description: "Zeiss APO Telephoto Camera for stunning portraits.", specifications: ["6.78\" AMOLED", "Dimensity 9300", "50MP Zeiss", "512GB"], images: [], isFeatured: false },
                    { name: "Oppo Find X7 Ultra", brand: "Oppo", category: "phone", price: 949, originalPrice: 1049, rating: 4.5, reviewCount: 180, description: "World's first dual-periscope camera flagship.", specifications: ["6.82\" LTPO", "SD 8 Gen 3", "50MP Dual Periscope", "256GB"], images: [], isFeatured: false },
                    { name: "Realme GT 5 Pro", brand: "Realme", category: "phone", price: 549, originalPrice: 649, rating: 4.3, reviewCount: 150, description: "High performance and premium design at an affordable price.", specifications: ["6.78\" 144Hz AMOLED", "SD 8 Gen 3", "50MP Main", "256GB"], images: [], isFeatured: false },
                    { name: "Motorola Edge 50 Pro", brand: "Motorola", category: "phone", price: 449, originalPrice: 549, rating: 4.2, reviewCount: 95, description: "Sleek design with Pantone certified display.", specifications: ["6.7\" pOLED", "SD 7 Gen 3", "50MP Main", "256GB"], images: [], isFeatured: false },
                    { name: "Nothing Phone (2)", brand: "Nothing", category: "phone", price: 599, originalPrice: 699, rating: 4.5, reviewCount: 280, description: "Iconic Glyph interface and unique Nothing OS.", specifications: ["6.7\" LTPO OLED", "SD 8+ Gen 1", "50MP Dual Camera", "256GB"], images: [], isFeatured: true },
                    { name: "Infinix Zero 30 5G", brand: "Infinix", category: "phone", price: 299, originalPrice: 349, rating: 4.1, reviewCount: 75, description: "Curved display and 4K 60fps vlog camera.", specifications: ["6.78\" AMOLED", "Dimensity 8020", "108MP Main", "256GB"], images: [], isFeatured: false },
                    { name: "Tecno Camon 30 Premier", brand: "Tecno", category: "phone", price: 399, originalPrice: 449, rating: 4.0, reviewCount: 65, description: "PolarAce imaging system and stylish design.", specifications: ["6.77\" LTPO", "Dimensity 8200", "50MP Triple", "512GB"], images: [], isFeatured: false },
                    { name: "Honor Magic6 Pro", brand: "Honor", category: "phone", price: 999, originalPrice: 1099, rating: 4.5, reviewCount: 140, description: "Falcon Camera and ultra-tough NanoCrystal Glass.", specifications: ["6.8\" LTPO", "SD 8 Gen 3", "180MP Telephoto", "512GB"], images: [], isFeatured: false },
                    { name: "Lava Agni 3", brand: "Lava", category: "phone", price: 249, originalPrice: 299, rating: 4.2, reviewCount: 80, description: "Dual AMOLED display with versatile Action button.", specifications: ["6.78\" 1.5K AMOLED", "Dimensity 7300 X", "50MP Main", "128GB"], images: [], isFeatured: false },

                    // LAPTOPS
                    { name: "HP Spectre x360", brand: "HP", category: "laptop", price: 1249, originalPrice: 1449, rating: 4.5, reviewCount: 340, description: "Premium 2-in-1 with stunning OLED display.", specifications: ["14\" 2.8K OLED", "Intel Core Ultra 7", "16GB RAM", "1TB SSD"], images: [], isFeatured: true },
                    { name: "Dell XPS 13 Plus", brand: "Dell", category: "laptop", price: 1399, originalPrice: 1599, rating: 4.4, reviewCount: 250, description: "Cutting-edge design with powerful performance.", specifications: ["13.4\" 4K Touch", "Intel Core i7", "16GB RAM", "512GB SSD"], images: [], isFeatured: true },
                    { name: "MacBook Air M3", brand: "Apple", category: "laptop", price: 1099, originalPrice: 1199, rating: 4.9, reviewCount: 920, description: "Lean, mean, M3 machine with incredible battery.", specifications: ["13.6\" Liquid Retina", "Apple M3 Chip", "8GB Unified", "256GB SSD"], images: [], isFeatured: true },
                    { name: "Yoga Slim 7i", brand: "Lenovo", category: "laptop", price: 949, originalPrice: 1099, rating: 4.3, reviewCount: 180, description: "Sleek and powerful for everyday productivity.", specifications: ["14\" 2.8K OLED", "Intel Core Ultra 5", "16GB RAM", "512GB SSD"], images: [], isFeatured: false },
                    { name: "Acer Swift Go 14", brand: "Acer", category: "laptop", price: 749, originalPrice: 849, rating: 4.2, reviewCount: 130, description: "TwinAir cooling and brilliant OLED visuals.", specifications: ["14\" OLED", "Intel Core Ultra 7", "16GB RAM", "512GB SSD"], images: [], isFeatured: false },
                    { name: "Asus ROG Zephyrus G14", brand: "Asus", category: "laptop", price: 1599, originalPrice: 1799, rating: 4.7, reviewCount: 280, description: "The most powerful 14-inch gaming laptop.", specifications: ["14\" QHD+ 120Hz", "Ryzen 9", "RTX 4060", "16GB RAM"], images: [], isFeatured: true },
                    { name: "Galaxy Book4 Ultra", brand: "Samsung", category: "laptop", price: 2399, originalPrice: 2599, rating: 4.6, reviewCount: 95, description: "Ultra performance with NVIDIA GeForce RTX.", specifications: ["16\" 3K AMOLED", "Core Ultra 9", "RTX 4070", "1TB SSD"], images: [], isFeatured: false },
                    { name: "Surface Laptop 5", brand: "Microsoft", category: "laptop", price: 999, originalPrice: 1199, rating: 4.4, reviewCount: 210, description: "Sleek, fast, and light with touch screen.", specifications: ["13.5\" PixelSense", "Intel Core i5", "8GB RAM", "256GB SSD"], images: [], isFeatured: false },
                    { name: "MSI Stealth 14 Studio", brand: "MSI", category: "laptop", price: 1499, originalPrice: 1699, rating: 4.5, reviewCount: 120, description: "Slim gaming laptop with studio-grade color.", specifications: ["14\" QHD+ 240Hz", "Intel Core i7", "RTX 4060", "16GB RAM"], images: [], isFeatured: false },
                ];
                await Product.insertMany(initialProducts);
                console.log('Memory Server seeded with initial data');
            }
        } catch (memErr) {
            console.error('All database connections failed:', memErr);
        }
    }
};

connectDB();

// --- Auth Routes ---
app.post('/api/auth/register', async (req, res) => {
    try {
        const { name, email, password, phone } = req.body;
        if (!name || !email || !password || !phone) {
            return res.status(400).json({ message: "All fields including phone are required" });
        }
        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ message: "Email already exists" });

        const hashedPassword = await bcrypt.hash(password, 12);
        const user = await User.create({ name, email, password: hashedPassword, phone });

        const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '7d' });
        res.status(201).json({ token, user: { id: user._id, name: user.name, email: user.email, phone: user.phone, role: user.role } });
    } catch (error) {
        res.status(500).json({ message: "Registration failed", error: error.message });
    }
});

app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: "Invalid credentials" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

        const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '7d' });
        res.json({ token, user: { id: user._id, name: user.name, email: user.email, phone: user.phone, role: user.role } });
    } catch (error) {
        res.status(500).json({ message: "Login failed" });
    }
});

app.put('/api/auth/profile', authMiddleware, async (req, res) => {
    try {
        const { name, email, phone } = req.body;
        const user = await User.findById(req.user.id);

        if (!user) return res.status(404).json({ message: "User not found" });

        if (name) user.name = name;
        if (email) user.email = email;
        if (phone) user.phone = phone;

        await user.save();
        res.json({ user: { id: user._id, name: user.name, email: user.email, phone: user.phone, role: user.role } });
    } catch (error) {
        res.status(500).json({ message: "Update failed", error: error.message });
    }
});

// --- Product Routes ---
app.get('/api/products', async (req, res) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

app.post('/api/products', isAdmin, async (req, res) => {
    const product = new Product(req.body);
    try {
        const newProduct = await product.save();
        res.status(201).json(newProduct);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// --- Order Routes ---
app.post('/api/orders', authMiddleware, async (req, res) => {
    try {
        const order = await Order.create({
            userId: req.userId,
            items: req.body.items,
            totalAmount: req.body.totalAmount,
            shippingAddress: req.body.shippingAddress
        });
        res.status(201).json(order);
    } catch (error) {
        res.status(500).json({ message: "Order creation failed" });
    }
});

app.get('/api/orders', authMiddleware, async (req, res) => {
    try {
        const orders = await Order.find({ userId: req.userId }).sort({ createdAt: -1 });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch orders" });
    }
});

// Admin Route: Get all orders
app.get('/api/admin/orders', authMiddleware, isAdmin, async (req, res) => {
    try {
        const orders = await Order.find().populate('userId', 'name email').sort({ createdAt: -1 });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch all orders" });
    }
});

// Admin Route: Update order status
app.put('/api/admin/orders/:id', authMiddleware, isAdmin, async (req, res) => {
    try {
        const updatedOrder = await Order.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
        res.json(updatedOrder);
    } catch (error) {
        res.status(400).json({ message: "Failed to update order" });
    }
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
});
