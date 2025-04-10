// app/api/admin/stats/route.js
import { NextResponse } from "next/server";
import { connectDB, disconnectDB } from "@/configs/dbConfig";
import { Order } from "@/models/Order";
import { userModel } from "@/models/userModel";

export async function GET(request) {
    try {
        await connectDB();
        // Fetch all orders to compute total sales and revenue
        const orders = await Order.find().lean();
        const totalSales = orders.length;
        const totalRevenue = orders.reduce((sum, order) => sum + order.totalPrice, 0);

        // Aggregate the total number of students across all users
        const users = await userModel.find().lean();
        let totalStudents = 0;
        users.forEach(user => {
            if (user.students && user.students.length > 0) {
                totalStudents += user.students.length;
            }
        });


        return NextResponse.json({ totalSales, totalRevenue, totalStudents }, { status: 200 });
    } catch (error) {

        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}
