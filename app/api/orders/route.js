import dbConnect from "@/lib/mongodb";
import Order from "@/models/Order";
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    let orders;
    if (userId) {
      orders = await Order.find({ userId }).sort({ createdAt: -1 });
    } else {
      orders = await Order.find({}).sort({ createdAt: -1 });
    }

    return NextResponse.json({ success: true, orders }, { status: 200 });
  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    await dbConnect();
    const body = await request.json();
    const { userId, items, totalAmount } = body;

    if (!userId || !items || items.length === 0 || !totalAmount) {
      return NextResponse.json({ success: false, error: "Invalid order data provided" }, { status: 400 });
    }

    const newOrder = await Order.create({
      userId,
      items,
      totalAmount,
      status: "making", 
    });

    return NextResponse.json({ success: true, order: newOrder }, { status: 201 });
  } catch (error) {
    console.error("Error creating order:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}