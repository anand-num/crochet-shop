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
      // Matches your dropdown values exactly
      enum: ["keychain", "plushie", "hat", "earwarmer", "scarf", "purse & pouch", "flowes"],
    },
    patternPdfUrl: {
      type: String, // Optional, used if it's a digital pattern
    },
  },
  {
    timestamps: true, // Automatically adds `createdAt` and `updatedAt` for sorting by "Newest"
  }
);

export default mongoose.models.Product || mongoose.model("Product", ProductSchema);