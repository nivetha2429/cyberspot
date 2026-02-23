import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import User from "./models/User.js";

dotenv.config();

const seedAdmin = async () => {
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
        console.error("MONGODB_URI not found in .env");
        process.exit(1);
    }

    try {
        await mongoose.connect(mongoUri);
        console.log("Connected to MongoDB for seeding...");

        const adminEmail = "admin@aaro.com";
        const existingAdmin = await User.findOne({ email: adminEmail });

        if (existingAdmin) {
            console.log("Admin user already exists.");
        } else {
            const hashedPassword = await bcrypt.hash("admin123", 12);
            await User.create({
                name: "Admin User",
                email: adminEmail,
                password: hashedPassword,
                role: "admin",
            });
            console.log("Admin user created successfully!");
            console.log("Email: admin@aaro.com");
            console.log("Password: admin123");
        }
    } catch (error) {
        console.error("Seeding failed:", error);
    } finally {
        mongoose.connection.close();
    }
};

seedAdmin();
