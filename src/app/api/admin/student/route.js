// app/api/admin/student/route.js
import { NextResponse } from "next/server";
import { connectDB, disconnectDB } from "@/configs/dbConfig";
import { userModel } from "@/models/userModel";

export async function POST(request) {
    try {
        await connectDB();
        const { userId, firstname, lastname, regNumber, email, profilePicture } = await request.json();

        // Find the parent user to whom the student will be added
        const user = await userModel.findById(userId);
        if (!user) {
            await disconnectDB();
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        // Create a new student object
        const newStudent = { firstname, lastname, regNumber, email, profilePicture };
        user.students.push(newStudent);
        await user.save();


        return NextResponse.json({ message: "Student added successfully" }, { status: 201 });
    } catch (error) {

        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}
