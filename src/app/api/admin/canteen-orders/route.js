// app/api/admin/canteen-orders/route.js
import { NextResponse } from "next/server";
import { connectDB, disconnectDB } from "@/configs/dbConfig";
import { CanteenOrder } from "@/models/CanteenOrder";

export async function GET(request) {
    try {
        await connectDB();
        const pipeline = [
            {
                $lookup: {
                    from: "fooditems", // use lowercase collection name
                    localField: "name",
                    foreignField: "_id",
                    as: "food",
                },
            },
            { $unwind: "$food" },
            {
                $group: {
                    _id: "$food._id",
                    foodName: { $first: "$food.name" },
                    totalOrdered: { $sum: "$quantity" },
                    totalPrepared: { $sum: "$prepared" },
                },
            },
            { $sort: { totalOrdered: -1 } },
        ];

        const canteenStats = await CanteenOrder.aggregate(pipeline);
        console.log(canteenStats);
        return NextResponse.json(canteenStats, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}
