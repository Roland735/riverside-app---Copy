"use client";
import { use, useEffect, useState } from "react";

export default function OrderProcessing() {
    const [studentNumber, setStudentNumber] = useState("");
    const [orderCode, setOrderCode] = useState("");
    const [totalOrders, setTotalOrders] = useState(0);
    const [orderDetails, setOrderDetails] = useState(null);

    // fetch the total number of orders

    useEffect(() => {
        const fetchTotalOrders = async () => {
            try {
                const res = await fetch("/api/order-processing");
                const data = await res.json();
                console.log(data);
                setTotalOrders(data.totalPendingOrders);
            } catch (error) {
                console.error("Error fetching total orders:", error);
            }
        };

        fetchTotalOrders();
    })

    // Handle processing the order:
    // - Sends a POST request with studentNumber and orderCode.
    // - The backend returns order details, including whether it has already been processed.
    const handleProcess = async () => {
        if (studentNumber && orderCode) {
            try {
                const res = await fetch("/api/order-processing", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ studentNumber, orderCode }),
                });
                const data = await res.json();
                console.log(data);

                if (res.ok) {
                    setOrderDetails(data);
                } else {
                    setOrderDetails({ error: data.error });
                }
            } catch (error) {
                setOrderDetails({ error: error.message });
            }
        }
    };

    // Handle proceeding after order processing:
    // - Sends a PATCH request to update the order as processed.
    // - On success, it clears the order details and updates the total orders count.
    const handleProceed = async () => {
        try {
            const res = await fetch("/api/order-processing", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ studentNumber, orderCode }),
            });
            if (res.ok) {
                setOrderDetails(null);
                setTotalOrders((prevTotal) => Math.max(prevTotal - 1, 0));
            } else {
                const data = await res.json();
                setOrderDetails({ error: data.error });
            }
        } catch (error) {
            setOrderDetails({ error: error.message });
        }
    };

    return (
        <div className="bg-stone-100 p-6 shadow-md rounded-lg w-full flex justify-evenly items-center my-10">
            <div className="text-center mb-4 flex-col">
                <div className="text-xl font-bold text-gray-800">Total Orders:</div>
                <div
                    className={`text-3xl font-extrabold ml-2 p-5 rounded-full ${totalOrders === 0
                        ? "bg-green-600 text-white"
                        : "bg-red-900 text-slate-100"
                        }`}
                >
                    {totalOrders}
                </div>
            </div>

            <div className="space-y-4 w-1/2">
                <input
                    type="text"
                    placeholder="Student Number"
                    value={studentNumber}
                    onChange={(e) => setStudentNumber(e.target.value)}
                    className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-500"
                />
                <input
                    type="text"
                    placeholder="Order Code"
                    value={orderCode}
                    onChange={(e) => setOrderCode(e.target.value)}
                    className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-500"
                />
                <button
                    onClick={handleProcess}
                    disabled={!studentNumber || !orderCode}
                    className={`w-full bg-stone-600 text-white py-2 rounded-lg font-medium transition duration-300 ${!studentNumber || !orderCode
                        ? "opacity-50 cursor-not-allowed"
                        : "hover:bg-stone-700"
                        }`}
                >
                    Process Order
                </button>
            </div>

            {orderDetails && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg text-center">
                        {orderDetails.error ? (
                            <p className="text-red-600 font-bold">{orderDetails.error}</p>
                        ) : orderDetails.alreadyProcessed ? (
                            <>
                                <h2 className="text-xl font-bold mb-2">Order Already Processed</h2>
                                <p className="text-gray-700">Student: {orderDetails.name}</p>
                                <p className="text-gray-700">Food: {orderDetails.food}</p>
                                <p className="text-gray-700">Price: {orderDetails.price}</p>
                                <p className="text-gray-700">
                                    Processed Time: {orderDetails.processedTime}
                                </p>
                                <button
                                    onClick={() => setOrderDetails(null)}
                                    className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                                >
                                    Close
                                </button>
                            </>
                        ) : (
                            <>
                                <h2 className="text-xl font-bold mb-2">Order Details</h2>
                                <p className="text-gray-700">Student: {orderDetails.name}</p>
                                <p className="text-gray-700">Food: {orderDetails.food}</p>
                                <p className="text-gray-700">Price: {orderDetails.price}</p>
                                <p className="text-gray-700">
                                    Processed Time: {orderDetails.processedTime}
                                </p>
                                <button
                                    onClick={handleProceed}
                                    className="mt-4 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                                >
                                    Proceed
                                </button>
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
