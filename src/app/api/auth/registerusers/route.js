import { connectDB } from "@/configs/dbConfig";
import { StudentAccount } from "@/models/StudentAccount";
import { userModel } from "@/models/userModel";
import { NextResponse } from "next/server";

connectDB();

// Function to generate password
const generatePassword = (lastname) => {
    const year = new Date().getFullYear();
    const password = `${lastname.charAt(0).toUpperCase() + lastname.slice(1)}@${year}`;
    console.log("Generated Password:", password); // Log password
    return password;
};

export const POST = async (req) => {
    const excelData = await req.json();
    console.log("Received Excel Data:", excelData); // Log received data

    await connectDB();

    const createdUsers = [];
    const errors = [];

    for (const user of excelData) {
        const { firstname, lastname, role, email, regNumber } = user;

        console.log(`Processing User: ${email}`); // Log user being processed

        // Check if the email is already registered
        const existingUser = await userModel.findOne({ email });
        if (existingUser) {
            console.log(`Email ${email} is already registered`); // Log if email exists
            errors.push({ email, message: "Email is already registered" });
            continue;
        }

        // Generate registration number

        console.log(`Generated Registration Number for ${firstname} ${lastname}: ${regNumber}`); // Log registration number

        // Generate password
        const password = generatePassword(lastname);




        // Create the user
        try {


            console.log(`Creating User: ${firstname} ${lastname}`);
            const newUser = await userModel.create({
                firstname,
                lastname,
                role,
                regNumber,
                email,
                password
            });
            createdUsers.push(newUser);
            console.log(`User Created: ${newUser.email}`); // Log user creation

            // If the new user is a student, create a StudentAccount with a balance of zero.
            if (newUser.role.toLowerCase() === "student") {
                console.log(`Creating StudentAccount for ${newUser.email}`);
                await StudentAccount.create({
                    student: newUser._id,
                    balance: 0,
                    transactions: [],
                });
                console.log(`StudentAccount created for ${newUser.email} with balance 0`);
            }


        } catch (error) {
            console.log(`Error creating user for ${email}:`, error.message); // Log error
            errors.push({ email, message: error.message });
        }
    }

    if (errors.length > 0) {
        console.log("Errors encountered:", errors); // Log any errors
        return NextResponse.json(
            { message: "Some users were not registered successfully", errors },
            { status: 400 }
        );
    }

    console.log("Users successfully registered:", createdUsers); // Log successfully created users
    return NextResponse.json(
        { message: "Users registered successfully", createdUsers },
        { status: 201 }
    );
};
