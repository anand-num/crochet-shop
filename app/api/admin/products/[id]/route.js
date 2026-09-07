import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Product from "@/models/Product";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

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

export async function PATCH(request, context) {
  try {
    await connectDB();
    const { id } = await context.params;
    const data = await request.formData();

    const name = data.get("name");
    const price = Number(data.get("price"));
    const category = data.get("category");
    const subCategory = data.get("subCategory");
    const description = data.get("description");
    const imageFile = data.get("image");
    const pdfFile = data.get("pdf");
    const inStock = data.get("inStock") === "true"; 

    const existingProduct = await Product.findById(id);
    if (!existingProduct) {
      return NextResponse.json({ success: false, error: "Product not found" }, { status: 404 });
    }

    let imageUrl = existingProduct.imageUrl;
    let pdfUrl = existingProduct.pdfUrl;

    if (imageFile && typeof imageFile === "object") {
      imageUrl = await uploadToCloudinary(imageFile, "enoki_images");
    }

    if (pdfFile && typeof pdfFile === "object" && category === "pattern") {
      pdfUrl = await uploadToCloudinary(pdfFile, "enoki_patterns");
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      {
        name,
        price,
        category,
        subCategory,
        description,
        imageUrl,
        pdfUrl: category === "pattern" ? pdfUrl : undefined,
        inStock,
      },
      { new: true }
    );

    return NextResponse.json({ success: true, product: updatedProduct }, { status: 200 });
  } catch (error) {
    console.error("Error updating product:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(request, context) {
  try {
    await connectDB();
    const { id } = await context.params;

    const deletedProduct = await Product.findByIdAndDelete(id);
    if (!deletedProduct) {
      return NextResponse.json({ success: false, error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Product deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error deleting product:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}