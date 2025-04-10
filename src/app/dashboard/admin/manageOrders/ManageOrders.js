"use client";
import React, { useState } from "react";
import Link from "next/link";
import {
    FaMinusCircle,
    FaCheckCircle,
    FaArrowLeft,
    FaFilter,
} from "react-icons/fa";

const ManageOrders = () => {
    // Mock data for orders with additional tracking fields
    const [orders, setOrders] = useState([
        {
            id: 1,
            name: "Burger",
            totalQuantity: 5,
            collected: 0,
            processing: 0,
            completed: 0,
            status: "pending",
        },
        {
            id: 2,
            name: "Sandwich",
            totalQuantity: 3,
            collected: 1,
            processing: 1,
            completed: 1,
            status: "processing",
        },
        {
            id: 3,
            name: "Pizza",
            totalQuantity: 3,
            collected: 3,
            processing: 0,
            completed: 3,
            status: "completed",
        },
        {
            id: 4,
            name: "Fries",
            totalQuantity: 10,
            collected: 0,
            processing: 0,
            completed: 0,
            status: "pending",
        },
        {
            id: 5,
            name: "Fries",
            totalQuantity: 5,
            collected: 2,
            processing: 2,
            completed: 1,
            status: "processing",
        },
        {
            id: 6,
            name: "Burger",
            totalQuantity: 8,
            collected: 4,
            processing: 3,
            completed: 1,
            status: "processing",
        },
    ]);

    // State for filtering orders
    const [filterStatus, setFilterStatus] = useState("all");

    // Function to subtract quantity and update tracking fields
    const subtractQuantity = (orderId) => {
        const updatedOrders = orders.map((order) => {
            if (order.id === orderId && order.totalQuantity > order.collected + order.processing + order.completed) {
                return {
                    ...order,
                    processing: order.processing + 1,
                    status: order.processing + order.collected + order.completed === order.totalQuantity ? "completed" : "processing",
                };
            }
            return order;
        });
        setOrders(updatedOrders);
    };

    // Function to mark an item as collected
    const collectItem = (orderId) => {
        const updatedOrders = orders.map((order) => {
            if (order.id === orderId && order.processing > 0) {
                return {
                    ...order,
                    collected: order.collected + 1,
                    processing: order.processing - 1,
                    status: order.collected + order.completed === order.totalQuantity ? "completed" : "processing",
                };
            }
            return order;
        });
        setOrders(updatedOrders);
    };

    // Filter orders based on status
    const filteredOrders =
        filterStatus === "all"
            ? orders
            : orders.filter((order) => order.status === filterStatus);

    return (
        <div className="p-8">
            <header className="flex items-center justify-between mb-6">
                <Link
                    href="/dashboard/canteen"
                    className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300"
                >
                    <FaArrowLeft /> Back to Dashboard
                </Link>
                <h1 className="text-3xl font-bold">Manage Orders</h1>
                <button
                    onClick={() => setFilterStatus("all")}
                    className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                >
                    <FaFilter /> Clear Filters
                </button>
            </header>

            {/* Section: Order Filters */}
            <div className="mb-4">
                <label className="mr-2 font-medium">Filter by Status:</label>
                <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="px-2 py-1 border border-gray-300 rounded-md"
                >
                    <option value="all">All</option>
                    <option value="pending">Pending</option>
                    <option value="processing">Processing</option>
                    <option value="completed">Completed</option>
                </select>
            </div>

            {/* Section: Order Table */}
            <div className="bg-white shadow-md p-6 rounded-lg">
                <table className="w-full border-collapse">
                    <thead>
                        <tr>
                            <th className="border p-2">ID</th>
                            <th className="border p-2">Item</th>
                            <th className="border p-2">Total Quantity</th>
                            <th className="border p-2">Items Collected</th>
                            <th className="border p-2">Items Being Processed</th>
                            <th className="border p-2">Items Completed</th>
                            <th className="border p-2">Status</th>
                            <th className="border p-2">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredOrders.length > 0 ? (
                            filteredOrders.map((order) => (
                                <tr key={order.id}>
                                    <td className="border p-2">{order.id}</td>
                                    <td className="border p-2">{order.name}</td>
                                    <td className="border p-2">{order.totalQuantity}</td>
                                    <td className="border p-2">{order.collected}</td>
                                    <td className="border p-2">{order.processing}</td>
                                    <td className="border p-2">{order.completed}</td>
                                    <td className="border p-2">{order.status}</td>
                                    <td className="border p-2 flex gap-2">
                                        {/* Collect Item Button */}
                                        <button
                                            onClick={() => collectItem(order.id)}
                                            disabled={order.processing === 0}
                                            className={`${order.processing === 0
                                                ? "text-gray-400 cursor-not-allowed"
                                                : "text-green-500 hover:text-green-700"
                                                }`}
                                        >
                                            <FaCheckCircle />
                                        </button>
                                        {/* Subtract Quantity Button */}
                                        <button
                                            onClick={() => subtractQuantity(order.id)}
                                            disabled={
                                                order.totalQuantity ===
                                                order.collected + order.processing + order.completed
                                            }
                                            className={`${order.totalQuantity ===
                                                order.collected + order.processing + order.completed
                                                ? "text-gray-400 cursor-not-allowed"
                                                : "text-red-500 hover:text-red-700"
                                                }`}
                                        >
                                            <FaMinusCircle />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="8" className="text-center py-4">
                                    No orders found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ManageOrders;