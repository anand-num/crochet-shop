import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import dbConnect from "@/lib/mongodb";
import Order from "@/models/Order";
import Product from "@/models/Product";

export async function POST(request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json(
        { success: false, error: "Нэвтрэх шаардлагатай." },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { phone, address, items } = body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { success: false, error: "Сагс хоосон байна." },
        { status: 400 }
      );
    }

    const phoneRegex = /^[8976]\d{7}$/;
    if (!phone || !phoneRegex.test(phone.trim())) {
      return NextResponse.json(
        { success: false, error: "Утасны дугаар буруу байна." },
        { status: 400 }
      );
    }

    if (!address || address.trim().length < 5) {
      return NextResponse.json(
        { success: false, error: "Хүргэлтийн хаяг дутуу байна." },
        { status: 400 }
      );
    }

    await dbConnect();

    let calculatedTotal = 0;
    const verifiedItems = [];

    for (const item of items) {
      const productId = item._id || item.productId;
      const product = await Product.findById(productId);

      if (!product) {
        return NextResponse.json(
          { success: false, error: `Бараа олдсонгүй: ${item.name || productId}` },
          { status: 404 }
        );
      }

      const quantity = Math.max(1, parseInt(item.quantity) || 1);
      calculatedTotal += product.price * quantity;

      verifiedItems.push({
        productId: product._id,
        name: product.name,
        price: product.price,
        quantity: quantity,
      });
    }

    const orderId = "CRCH-" + Math.floor(100000 + Math.random() * 900000);

    const newOrder = await Order.create({
      orderId,
      userId,
      phone: phone.trim(),
      address: address.trim(),
      items: verifiedItems,
      totalAmount: calculatedTotal,
      status: "making",
    });

    return NextResponse.json({
      success: true,
      orderId: newOrder.orderId,
      order: newOrder,
      message: "Амжилттай захиалга хийлээ!",
    }, { status: 201 });

  } catch (error) {
    console.error("Checkout API error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}