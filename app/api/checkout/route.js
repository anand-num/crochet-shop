import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const body = await request.json();
    const { cartItems, customerInfo } = body;

    if (!cartItems || cartItems.length === 0) {
      return NextResponse.json({ success: false, error: "Cart is empty" }, { status: 400 });
    }

    // In a production app with Stripe, you would create a Stripe checkout session here.
    // For our custom web app build, we will simulate a successful mock checkout order placement!
    
    const orderId = "CRCH-" + Math.floor(100000 + Math.random() * 900000);

    return NextResponse.json({ 
      success: true, 
      orderId: orderId,
      message: "Order placed successfully!" 
    }, { status: 200 });

  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}