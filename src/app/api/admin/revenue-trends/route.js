// app/api/admin/revenue-trends/route.js
import { NextResponse } from "next/server";
import { connectDB, disconnectDB } from "@/configs/dbConfig";
import { Order } from "@/models/Order";

export async function GET(request) {
    try {
        await connectDB();
        // Group orders by day using the orderedAt field
        const pipeline = [
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$orderedAt" } },
                    dailyRevenue: { $sum: "$totalPrice" },
                    ordersCount: { $sum: 1 },
                },
            },
            { $sort: { _id: 1 } },
        ];
        const revenueTrends = await Order.aggregate(pipeline);

        return NextResponse.json(revenueTrends, { status: 200 });
    } catch (error) {
        console.error(error);

        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}
