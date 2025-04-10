// app/api/admin/order-status/route.js
import { NextResponse } from "next/server";
import { connectDB, disconnectDB } from "@/configs/dbConfig";
import { Order } from "@/models/Order";

export async function GET(request) {
    try {
        await connectDB();
        const pipeline = [
            {
                $group: {
                    _id: "$status",
                    count: { $sum: 1 },
                },
            },
            { $sort: { _id: 1 } },
        ];
        const statusStats = await Order.aggregate(pipeline);

        return NextResponse.json(statusStats, { status: 200 });
    } catch (error) {
        console.error(error);

        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}
