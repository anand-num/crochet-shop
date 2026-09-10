import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server"; 
import connectDB from "@/lib/mongodb";
import Product from "@/models/Product";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request) {
  try {
    const user = await currentUser();
    const userEmail = user?.emailAddresses[0]?.emailAddress;

    if (!userEmail || userEmail !== process.env.ADMIN_EMAIL) {
      return NextResponse.json(
        { success: false, error: "Unauthorized access" },
        { status: 403 }
      );
    }

    await connectDB();
    const data = await request.formData();
    
    const name = data.get("name");
    const price = Number(data.get("price"));
    const category = data.get("category");
    const subCategory = data.get("subCategory");
    const description = data.get("description");
    const imageFile = data.get("image");
    const pdfFile = data.get("pdf");
    const inStock = data.get("inStock") === "true"; 

    let imageUrl = "";
    let pdfUrl = "";

    const uploadToCloudinary = async (file, folder) => {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      return new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
          { folder, resource_type: "auto" },
          (error, result) => {
            if (error) reject(error);
            resolve(result.secure_url);
          }
        ).end(buffer);
      });
    };

    if (imageFile && typeof imageFile === "object") {
      imageUrl = await uploadToCloudinary(imageFile, "enoki_images");
    }

    if (pdfFile && typeof pdfFile === "object" && category === "pattern") {
      pdfUrl = await uploadToCloudinary(pdfFile, "enoki_patterns");
    }

    const newProduct = await Product.create({
      name,
      price,
      category,
      subCategory,
      description,
      imageUrl,
      pdfUrl: category === "pattern" ? pdfUrl : undefined,
      inStock,
    });

    return NextResponse.json({ success: true, product: newProduct });
  } catch (error) {
    console.error("Admin product creation error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}