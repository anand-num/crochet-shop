import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  clerkId: { type: String, required: true, unique: true },
  email: { type: String, required: true },
  name: { type: String },
  purchasedPatterns: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
      name: { type: String },
      pdfUrl: { type: String },
      purchasedAt: { type: Date, default: Date.now }
    }
  ]
});

export default mongoose.models.User || mongoose.model("User", UserSchema);