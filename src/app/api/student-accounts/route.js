// app/api/admin/student-accounts/route.js
import { NextResponse } from "next/server";
import { connectDB, disconnectDB } from "@/configs/dbConfig";
import { StudentAccount } from "@/models/StudentAccount";

export async function GET(request) {
    // Get query params: search, page, limit
    console.log("GET request received");
    const { search = "", page = "1", limit = "10" } = Object.fromEntries(
        new URL(request.url).searchParams.entries()
    );
    console.log(search, page, limit);

    const pageNum = parseInt(page) || 1;
    const limitNum = parseInt(limit) || 10;

    try {
        await connectDB();
        // Build pipeline to lookup student details from the "users" collection.
        // Note: the collection name for users is likely "users" (all lowercase).
        let pipeline = [
            {
                $lookup: {
                    from: "users",
                    localField: "student",
                    foreignField: "_id",
                    as: "student",
                },
            },
            { $unwind: "$student" },
        ];

        if (search) {
            pipeline.push({
                $match: {
                    $or: [
                        { "student.firstname": { $regex: search, $options: "i" } },
                        { "student.lastname": { $regex: search, $options: "i" } },
                        { "student.email": { $regex: search, $options: "i" } },
                    ],
                },
            });
        }

        pipeline.push({
            $facet: {
                metadata: [{ $count: "total" }, { $addFields: { page: pageNum } }],
                data: [{ $skip: (pageNum - 1) * limitNum }, { $limit: limitNum }],
            },
        });

        const results = await StudentAccount.aggregate(pipeline);

        return NextResponse.json(results[0], { status: 200 });
    } catch (error) {
        console.error(error);

        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}
