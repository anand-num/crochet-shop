import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  imageUrl: { type: String, required: true },
  pdfUrl: { type: String }, // Optional PDF link for patterns
  category: { type: String, required: true, enum: ["item", "pattern"] }, // New category field
});

export default mongoose.models.Product || mongoose.model("Product", ProductSchema);