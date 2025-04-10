// app/api/admin/reset-password/route.js
import { NextResponse } from "next/server";
import { connectDB } from "@/configs/dbConfig";
// import User from "@/models/User"; // Uncomment and adjust to your User model
import bcrypt from "bcryptjs";

export async function POST(request) {
    try {
        await connectDB();
        const { userId, newPassword } = await request.json();

        if (!userId || !newPassword) {
            return NextResponse.json(
                { error: "Missing parameters" },
                { status: 400 }
            );
        }

        // Hash the new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Update the user's password (adjust query for your DB)
        // const updatedUser = await User.findByIdAndUpdate(
        //   userId,
        //   { password: hashedPassword },
        //   { new: true }
        // );
        // if (!updatedUser) {
        //   return NextResponse.json({ error: "User not found" }, { status: 404 });
        // }

        // Simulate success for now
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
