import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Product from "@/models/Product";

export async function GET() {
  try {
    await connectDB();
    // Fetch unique sub-categories from the database
    const subCategories = await Product.distinct("subCategory");
    return NextResponse.json({ success: true, subCategories }, { status: 200 });
  } catch (error) {
    console.error("Error fetching sub-categories:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}