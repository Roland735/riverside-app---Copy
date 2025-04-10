// app/api/admin/student-accounts/[studentId]/route.js
import { NextResponse } from "next/server";
import { connectDB, disconnectDB } from "@/configs/dbConfig";
import { StudentAccount } from "@/models/StudentAccount";

export async function GET(request, { params }) {
    const { studentId } = params;
    try {
        await connectDB();
        const account = await StudentAccount.findOne({ student: studentId })
            .populate("student")
            .lean();

        if (!account) {
            return NextResponse.json({ error: "Account not found" }, { status: 404 });
        }
        return NextResponse.json(account, { status: 200 });
    } catch (error) {
        console.error(error);
        await disconnectDB();
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}

export async function POST(request, { params }) {
    const { studentId } = params;
    try {
        await connectDB();
        const { type, amount, description } = await request.json();

        let account = await StudentAccount.findOne({ student: studentId });
        if (!account) {
            account = new StudentAccount({ student: studentId, balance: 0, transactions: [] });
        }

        let newBalance = account.balance;
        if (type === "deposit") {
            newBalance += amount;
        } else if (type === "purchase" || type === "withdrawal") {
            newBalance -= amount;
            if (newBalance < 0) {
                await disconnectDB();
                return NextResponse.json({ error: "Insufficient balance" }, { status: 400 });
            }
        } else {
            await disconnectDB();
            return NextResponse.json({ error: "Invalid transaction type" }, { status: 400 });
        }

        account.balance = newBalance;
        account.transactions.push({ type, amount, description });
        await account.save();

        return NextResponse.json(account, { status: 201 });
    } catch (error) {
        console.error(error);

        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}
