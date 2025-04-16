// app/api/admin/food-stats/route.js
import { NextResponse } from "next/server";
import { connectDB, disconnectDB } from "@/configs/dbConfig";
import { Order } from "@/models/Order";

export async function GET(request) {
    try {
        await connectDB();
        const pipeline = [
            { $unwind: "$items" },
            {
                $lookup: {
                    from: "foodItems", // corrected collection name
                    localField: "items.foodItem",
                    foreignField: "_id",
                    as: "food",
                },
            },
            { $unwind: "$food" },
            {
                $group: {
                    _id: "$food._id",
                    foodName: { $first: "$food.name" },
                    totalQuantity: { $sum: "$items.quantity" },
                    totalRevenue: {
                        $sum: { $multiply: ["$items.quantity", "$food.price"] },
                    },
                },
            },
            { $sort: { totalRevenue: -1 } },
        ];

        console.log(pipeline);
        const foodStats = await Order.aggregate(pipeline);
        console.log(foodStats);

        return NextResponse.json(foodStats, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}
