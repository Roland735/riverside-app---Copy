// app/api/admin/search-user/route.js
import { NextResponse } from "next/server";
import { connectDB } from "@/configs/dbConfig";
import { userModel } from "@/models/userModel";


export async function GET(request) {
    try {
        console.log("Request received");
        await connectDB();
        console.log("Database connected");
        const { searchParams } = new URL(request.url);
        console.log("Search parameters:", searchParams);
        const regNumber = searchParams.get("regNumber") || "";
        const firstName = searchParams.get("firstName") || "";
        const lastName = searchParams.get("lastName") || "";
        console.log("Search parameters:", regNumber, firstName, lastName);

        const query = {};
        if (regNumber) {
            query.regNumber = { $regex: regNumber, $options: "i" };
        }
        if (firstName) {
            query.firstName = { $regex: firstName, $options: "i" };
        }
        if (lastName) {
            query.lastName = { $regex: lastName, $options: "i" };
        }

        // Query your user collection (update this with your actual model)
        const users = await userModel.find(query);
        // const users = []; // Replace with your DB query result

        return NextResponse.json({ users });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
