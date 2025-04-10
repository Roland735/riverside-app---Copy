import { NextResponse } from "next/server";
import { connectDB, disconnectDB } from "@/configs/dbConfig";
import { foodItem } from "@/models/FoodItem";

// GET - Fetch all food items
export async function GET() {
    try {
        await connectDB();
        const items = await foodItem.find();
        await disconnectDB();
        return NextResponse.json({ success: true, data: items }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

// POST - Create a new food item
export async function POST(req) {
    try {
        await connectDB();
        const body = await req.json();
        const newItem = new foodItem(body);
        const savedItem = await newItem.save();
        await disconnectDB();
        return NextResponse.json({ success: true, data: savedItem }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }
}

// PUT - Update a food item (requires `id` in the request body)
export async function PUT(req) {
    try {
        await connectDB();
        const { id, ...updates } = await req.json();
        const updatedItem = await foodItem.findByIdAndUpdate(id, updates, { new: true });
        await disconnectDB();

        if (!updatedItem) {
            return NextResponse.json({ success: false, error: "Food item not found" }, { status: 404 });
        }

        return NextResponse.json({ success: true, data: updatedItem }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }
}

// DELETE - Remove a food item (requires `id` in query)
export async function DELETE(req) {
    try {
        const { searchParams } = new URL(req.url);
        const id = searchParams.get("id");

        if (!id) {
            return NextResponse.json({ success: false, error: "ID is required" }, { status: 400 });
        }

        await connectDB();
        const deletedItem = await foodItem.findByIdAndDelete(id);
        await disconnectDB();

        if (!deletedItem) {
            return NextResponse.json({ success: false, error: "Food item not found" }, { status: 404 });
        }

        return NextResponse.json({ success: true, data: deletedItem }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }
}
