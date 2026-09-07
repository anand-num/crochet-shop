import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema({
  userId: { type: String, required: true }, 
  items: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
      name: String,
      price: Number,
      quantity: Number,
      category: String, 
      imageUrl: String,
      pdfUrl: String,   
    }
  ],
  totalAmount: { type: Number, required: true },
  status: { type: String, default: "Making" }, 
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.Order || mongoose.model("Order", OrderSchema);