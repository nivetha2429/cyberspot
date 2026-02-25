import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema({
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String },
    productCount: { type: Number, default: 0 }
}, { timestamps: true });

const Category = mongoose.model('Category', categorySchema);

export default Category;
