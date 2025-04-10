import { NextResponse } from "next/server";
import { connectDB, disconnectDB } from "@/configs/dbConfig";
import { Order } from "@/models/Order";
import { CanteenOrder } from "@/models/CanteenOrder";
import { StudentAccount } from "@/models/StudentAccount";
import { foodItem } from "@/models/FoodItem"; // Ensure this model has a 'price' field

// Helper function to generate a unique 5-character collectionId.
function generateCollectionId() {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let result = "";
    for (let i = 0; i < 5; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}

export async function POST(req) {
    try {
        await connectDB();
        const body = await req.json();
        console.log("Order request body:", body);

        // Compute totalPrice from the items if it's not provided
        if (typeof body.totalPrice !== "number") {
            let computedTotal = 0;
            for (const item of body.items) {
                // Look up the food item from the Food model to get its price
                const food = await foodItem.findById(item.foodItem);
                if (food && food.price) {
                    computedTotal += food.price * item.quantity;
                }
            }
            body.totalPrice = computedTotal;
            console.log("Computed totalPrice:", body.totalPrice);
        }

        // Retrieve the student's account
        const studentAccount = await StudentAccount.findOne({ student: body.user });
        if (!studentAccount) {
            console.log("Student account not found");
            await disconnectDB();
            return NextResponse.json(
                { success: false, error: "Student account not found" },
                { status: 404 }
            );
        }

        // Check if the student has enough balance
        if (studentAccount.balance < body.totalPrice) {
            console.log("Insufficient funds");
            await disconnectDB();
            return NextResponse.json(
                { success: false, error: "Insufficient funds" },
                { status: 400 }
            );
        }

        console.log("Sufficient funds");

        // Deduct the amount from the student's balance
        studentAccount.balance -= body.totalPrice;
        console.log("Updated student balance:", studentAccount.balance);

        studentAccount.transactions.push({
            type: "purchase",
            amount: body.totalPrice,
            description: "Canteen purchase",
        });
        await studentAccount.save();
        console.log("Student account updated");

        // Generate a unique collectionId.
        body.collectionId = generateCollectionId();

        // Generate a sequential orderId using the "Order" collection
        const lastOrder = await Order.findOne({}, {}, { sort: { orderId: -1 } });
        body.orderId = lastOrder ? lastOrder.orderId + 1 : 1;

        // Create a new order document
        const newOrder = new Order(body);
        const savedOrder = await newOrder.save();

        // Update CanteenOrder stock
        for (const item of body.items) {
            const CanteenFoodItem = await CanteenOrder.findOne({ name: item.foodItem });
            if (CanteenFoodItem) {
                CanteenFoodItem.quantity += item.quantity;
                await CanteenFoodItem.save();
            } else {
                const newCanteenFoodItem = new CanteenOrder({
                    name: item.foodItem,
                    quantity: item.quantity,
                });
                await newCanteenFoodItem.save();
            }
        }

        await disconnectDB();
        return NextResponse.json(
            { success: true, collectionId: body.collectionId, data: savedOrder },
            { status: 201 }
        );
    } catch (error) {
        await disconnectDB();
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 400 }
        );
    }
}
