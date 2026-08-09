import dbConnect from "../../../lib/mongodb";
import Product from "../../../models/Product";
import { NextResponse } from "next/server";

const sampleProducts = [
  {
    name: "Cozy Cat Plushie",
    description: "Handmade soft amigurumi cat plushie, perfect for gifts.",
    price: 25.00,
    imageUrl: "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=500",
    pdfUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf"
  },
  {
    name: "Sunflower Crochet Bag",
    description: "Trendy handmade granny square tote bag featuring cheerful sunflowers.",
    price: 40.00,
    imageUrl: "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=500",
    pdfUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf"
  },
  {
    name: "Pastel Spring Scarf",
    description: "Lightweight and warm lacy crochet scarf made with soft cotton yarn.",
    price: 30.00,
    imageUrl: "https://images.unsplash.com/photo-1608256246200-53e635b5b65f?w=500",
    pdfUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf"
  }
];

export async function GET() {
  try {
    await dbConnect();
    await Product.deleteMany({});
    await Product.insertMany(sampleProducts);
    return NextResponse.json({ success: true, message: "Database seeded successfully!" });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}