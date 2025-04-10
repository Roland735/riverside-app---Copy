// app/api/transactions/[userId]/route.js
import { NextResponse } from "next/server";
import { connectDB, disconnectDB } from "@/configs/dbConfig";
import { Order } from "@/models/Order";

export async function GET(request, { params }) {
    const { userId } = params;
    try {
        await connectDB();
        // Find orders for the specific user and sort them by order date (most recent first)
        const orders = await Order.find({ user: userId }).sort({ orderedAt: -1 }).lean();

        // Compute statistics
        const totalOrders = orders.length;
        const totalRevenue = orders.reduce((acc, order) => acc + order.totalPrice, 0);
        const statusCounts = orders.reduce((acc, order) => {
            acc[order.status] = (acc[order.status] || 0) + 1;
            return acc;
        }, {});

        await disconnectDB();
        return NextResponse.json(
            { orders, totalOrders, totalRevenue, statusCounts },
            { status: 200 }
        );
    } catch (err) {
        console.error(err);
        await disconnectDB();
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}
