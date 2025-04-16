// app/api/canteen-orders/route.js
import { NextResponse } from "next/server";
import { connectDB, disconnectDB } from "@/configs/dbConfig";
import { CanteenOrder } from "@/models/CanteenOrder";

// GET endpoint to fetch all canteen orders
export async function GET() {
    try {
        await connectDB();
        // Populate the 'name' field (which references FoodItem) to get details from the FoodItem model
        const orders = await CanteenOrder.find().populate('name');
        console.log("Fetched orders:", orders);


        return NextResponse.json({ orders }, { status: 200 });
    } catch (error) {

        console.log(error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// PATCH endpoint to increment the 'prepared' count for a specific order
export async function PATCH(request) {
    try {
        await connectDB();
        // Expecting the request body to include the order id (or item identifier) to update
        const { orderId } = await request.json();
        const order = await CanteenOrder.findById(orderId);
        if (!order) {

            return NextResponse.json({ error: "Order not found" }, { status: 404 });
        }
        // Only increment if prepared count is less than the total quantity ordered
        if (order.prepared < order.quantity) {
            order.prepared += 1;
            await order.save();

            return NextResponse.json({ order }, { status: 200 });
        } else {

            return NextResponse.json(
                { error: "All items are already prepared" },
                { status: 400 }
            );
        }
    } catch (error) {

        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
