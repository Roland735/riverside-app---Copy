// app/api/order-processing/route.js
import { NextResponse } from "next/server";
import { connectDB, disconnectDB } from "@/configs/dbConfig";
import { Order } from "@/models/Order";

// POST: Get order details based on studentNumber and orderCode.
export async function POST(request) {
    try {
        await connectDB();
        const { studentNumber, orderCode } = await request.json();
        console.log("Received request with studentNumber:", studentNumber, "and orderCode:", orderCode);

        // Find the order by collectionId (orderCode) and populate related data.
        const order = await Order.findOne({ collectionId: orderCode })
            .populate("user")
            .populate("items.foodItem");

        if (!order) {

            return NextResponse.json(
                { error: "Order not found" },
                { status: 404 }
            );
        }

        // Verify that the order belongs to the student by matching regNumber.
        if (order.user.regNumber !== studentNumber) {

            return NextResponse.json(
                { error: "Order not found for this student" },
                { status: 404 }
            );
        }

        // Check if the order has already been processed.
        const alreadyProcessed = order.status !== "pending";
        const processedTime = alreadyProcessed
            ? order.processedTime || new Date().toLocaleString()
            : null;

        // For simplicity, assume a single food item per order.
        const orderDetails = {
            name: `${order.user.firstname} ${order.user.lastname}`,
            food: order.items[0]?.foodItem?.name || "N/A",
            price: order.items[0]?.foodItem?.price
                ? "$" + order.items[0]?.foodItem?.price
                : "N/A",
            processedTime,
            alreadyProcessed,
        };


        return NextResponse.json(orderDetails, { status: 200 });
    } catch (error) {

        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// PATCH: Update order as processed.
export async function PATCH(request) {
    try {
        await connectDB();
        const { studentNumber, orderCode } = await request.json();

        // Find the order by collectionId and verify it belongs to the student.
        const order = await Order.findOne({ collectionId: orderCode }).populate("user");
        if (!order) {

            return NextResponse.json(
                { error: "Order not found" },
                { status: 404 }
            );
        }

        if (order.user.regNumber !== studentNumber) {

            return NextResponse.json(
                { error: "Order not found for this student" },
                { status: 404 }
            );
        }

        // If the order is already processed, return an error.
        if (order.status !== "pending") {

            return NextResponse.json(
                { error: "Order already processed" },
                { status: 400 }
            );
        }

        // Update the order status and set a processed timestamp.
        order.status = "confirmed";
        // Note: If you haven't defined processedTime in your Order schema, you can still set it
        // if your schema allows additional fields (or consider updating the schema).
        order.processedTime = new Date().toLocaleString();
        await order.save();


        return NextResponse.json(
            { message: "Order processed successfully" },
            { status: 200 }
        );
    } catch (error) {

        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// get total number of pending orders
export async function GET() {
    try {
        await connectDB();
        const totalPendingOrders = await Order.countDocuments({ status: "pending" });
        console.log("Total pending orders:", totalPendingOrders);

        return NextResponse.json({ totalPendingOrders }, { status: 200 });
    } catch (error) {

        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}