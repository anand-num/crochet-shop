import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema({
  userId: { type: String, required: true }, // Clerk User ID
  items: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
      name: String,
      price: Number,
      quantity: Number,
      category: String, // "item" or "pattern"
      imageUrl: String,
      pdfUrl: String,   // Present if it's a pattern
    }
  ],
  totalAmount: { type: Number, required: true },
  status: { type: String, default: "Making 🧶" }, // "Making 🧶", "Shipped 🚚"
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.Order || mongoose.model("Order", OrderSchema);