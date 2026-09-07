import dbConnect from "@/lib/mongodb";
import Order from "@/models/Order";
import { NextResponse } from "next/server";

// PATCH: Update order status (making vs shipped)
export async function PATCH(request, context) {
  try {
    await dbConnect();
    const { id } = await context.params;
    const body = await request.json();
    const { status } = body;

    const updatedOrder = await Order.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!updatedOrder) {
      return NextResponse.json({ success: false, error: "Order not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, order: updatedOrder }, { status: 200 });
  } catch (error) {
    console.error("Error updating order status:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}