import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";

export async function GET(request) {
  try {
    const clerkUser = await currentUser();
    if (!clerkUser) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    // Find user in MongoDB, or create them if it's their first time signing in
    let dbUser = await User.findOne({ clerkId: clerkUser.id });

    if (!dbUser) {
      dbUser = await User.create({
        clerkId: clerkUser.id,
        email: clerkUser.primaryEmailAddress?.emailAddress || "",
        name: clerkUser.fullName || "Cozy Crafter",
        purchasedPatterns: []
      });
    }

    return NextResponse.json({ success: true, data: dbUser });
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}