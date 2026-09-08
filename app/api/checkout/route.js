import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const body = await request.json();
    const { cartItems, customerInfo } = body;

    if (!cartItems || cartItems.length === 0) {
      return NextResponse.json({ success: false, error: "Cart is empty" }, { status: 400 });
    }
    
    const orderId = "CRCH-" + Math.floor(100000 + Math.random() * 900000);

    return NextResponse.json({ 
      success: true, 
      orderId: orderId,
      message: "Амжилттай захиалга хийлээ!" 
    }, { status: 200 });

  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}