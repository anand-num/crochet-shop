import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide a product name."],
    },
    description: {
      type: String,
      required: [true, "Please provide a description."],
    },
    price: {
      type: Number,
      required: [true, "Please provide a price."],
    },
    imageUrl: {
      type: String,
      required: [true, "Please provide an image URL."],
    },
    category: {
      type: String,
      required: [true, "Please specify main category (e.g., item or pattern)."],
      enum: ["item", "pattern"],
    },
    subCategory: {
      type: String,
      required: [true, "Please specify a sub-category."],
      enum: ["keychain", "plushie", "hat", "earwarmer", "scarf", "purse & pouch", "flowers"],
    },
    patternPdfUrl: {
      type: String, 
    },
    inStock: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true, 
  }
);

export default mongoose.models.Product || mongoose.model("Product", ProductSchema);