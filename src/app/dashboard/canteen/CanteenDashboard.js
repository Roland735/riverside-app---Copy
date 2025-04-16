"use client";
import React, { useEffect, useState } from "react";
import { FaClipboardList, FaMinus } from "react-icons/fa";
import OrderProcessing from "./OrderProcessing";

const CanteenDashboard = () => {
    const [orders, setOrders] = useState([]);

    // Fetch orders from the API route
    const fetchOrders = async () => {
        try {
            const res = await fetch("/api/canteen-orders");
            if (res.ok) {
                const data = await res.json();
                console.log(data);
                setOrders(data.orders);
            } else {
                console.error("Failed to fetch orders");
            }
        } catch (error) {
            console.error("Error fetching orders:", error);
        }
    };

    // On mount, fetch orders from the backend and set up interval
    useEffect(() => {
        // Initial fetch of orders
        fetchOrders();

        // Set up an interval to periodically fetch orders (e.g., every 10 seconds)
        const intervalId = setInterval(() => {
            fetchOrders();
        }, 10000);

        // Clean up the interval on component unmount
        return () => clearInterval(intervalId);
    }, []);

    // Function to mark an order as prepared by calling the PATCH endpoint.
    // It finds the first order for the given food item that is not fully prepared.
    const markPrepared = async (itemName) => {
        // Find an order for the food item (populated so order.name.name) that is not yet fully prepared.
        const orderToUpdate = orders.find(
            (order) =>
                order.name.name === itemName && order.prepared < order.quantity
        );
        if (!orderToUpdate) return;

        try {
            const res = await fetch("/api/canteen-orders", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ orderId: orderToUpdate._id }),
            });
            if (res.ok) {
                // Refetch the orders to update the UI.
                fetchOrders();
            } else {
                console.error("Failed to mark order as prepared");
            }
        } catch (error) {
            console.error("Error updating order:", error);
        }
    };

    // Group orders by the food item's name
    const groupedOrders = orders.reduce((acc, order) => {
        // Ensure we have a proper name from the populated food item
        const itemName = order.name.name;
        if (!acc[itemName]) {
            acc[itemName] = { total: 0, prepared: 0 };
        }
        acc[itemName].total += order.quantity;
        acc[itemName].prepared += order.prepared;
        return acc;
    }, {});

    return (
        <div className="min-h-screen bg-gray-50 p-8 w-full">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-900 mb-8 flex items-center gap-2">
                    <FaClipboardList className="text-blue-600" />
                    Canteen Dashboards
                </h1>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {Object.keys(groupedOrders).map((itemName) => {
                        const { total, prepared } = groupedOrders[itemName];
                        const unprepared = total - prepared;
                        const progressPercentage = ((prepared / total) * 100).toFixed(0);
                        return (
                            <div
                                key={itemName}
                                className="bg-stone-100 shadow-sm rounded-xl p-6 hover:shadow-md transition-all duration-300"
                            >
                                <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                                    {itemName}
                                </h3>
                                <div className="mb-4">
                                    <div className="flex justify-between items-center text-lg font-medium">
                                        <span>Total Orders:</span>
                                        <span className="font-bold text-gray-800">{total}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-lg font-medium mt-2">
                                        <span>Prepared:</span>
                                        <span
                                            className={
                                                prepared === total
                                                    ? "font-bold text-green-600"
                                                    : "font-bold text-gray-800"
                                            }
                                        >
                                            {prepared}
                                        </span>
                                    </div>
                                    <div className="flex flex-col justify-between items-center text-lg font-medium mt-2">
                                        <div className="self-start">Unprepared:</div>
                                        <div
                                            className={`font-bold text-white text-4xl p-4 rounded-full ${unprepared === 0 ? "bg-emerald-500" : "bg-red-700"
                                                }`}
                                        >
                                            {unprepared}
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-4">
                                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                                        <div
                                            className="h-2.5 rounded-full"
                                            style={{
                                                width: `${progressPercentage}%`,
                                                backgroundColor:
                                                    prepared === total ? "#34C759" : "#FFC107",
                                            }}
                                        ></div>
                                    </div>
                                    <p className="text-sm text-gray-600 mt-1 text-center">
                                        {progressPercentage}% Prepared
                                    </p>
                                </div>
                                <button
                                    onClick={() => markPrepared(itemName)}
                                    disabled={prepared >= total}
                                    className={`mt-6 w-full py-2 rounded-lg flex items-center justify-center gap-2 ${prepared >= total
                                        ? "bg-gray-300 cursor-not-allowed"
                                        : "bg-red-600 text-white hover:bg-red-700"
                                        }`}
                                >
                                    <FaMinus /> Mark Prepared
                                </button>
                            </div>
                        );
                    })}
                </div>
            </div>
            <OrderProcessing totalOrders={5} />
        </div>
    );
};

export default CanteenDashboard;
