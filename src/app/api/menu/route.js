import { NextResponse } from "next/server";
import { connectDB, disconnectDB } from "@/configs/dbConfig";
import { foodItem } from "@/models/FoodItem";

// GET - Return available food items (the menu)
export async function GET() {
    try {
        await connectDB();
        // Get only available items
        const items = await foodItem.find({ available: true });
        await disconnectDB();
        return NextResponse.json({ success: true, data: items }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
