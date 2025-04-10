"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from "recharts";

const COLORS = ["#4CAF50", "#2196F3", "#FFC107", "#FF5722", "#9C27B0"];

export default function TransactionHistory({ userId }) {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Prepare chart data from the API's statusCounts
    const getChartData = (statusCounts) => {
        return Object.entries(statusCounts).map(([status, count]) => ({
            name: status,
            value: count,
        }));
    };

    useEffect(() => {
        async function fetchData() {
            try {
                const res = await fetch(`/api/transactions/${userId}`);
                console.log(res);
                if (!res.ok) throw new Error("Failed to fetch data");
                const json = await res.json();
                setData(json);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, [userId]);

    if (loading)
        return <div className="text-center py-10">Loading...</div>;
    if (error)
        return (
            <div className="text-center py-10 text-red-500">
                Error: {error}
            </div>
        );

    const chartData = getChartData(data.statusCounts);

    return (
        <motion.div
            className="container mx-auto px-4 py-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
        >
            <h1 className="text-2xl font-bold mb-6">Transaction History</h1>

            <div className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Statistics Section */}
                <div className="p-6 border rounded shadow-sm">
                    <h2 className="text-xl font-semibold mb-4">Statistics</h2>
                    <p>
                        <span className="font-semibold">Total Orders:</span> {data.totalOrders}
                    </p>
                    <p>
                        <span className="font-semibold">Total Amount Paid:</span> $
                        {data.totalRevenue.toFixed(2)}
                    </p>

                    <div className="mt-6">
                        <h3 className="font-semibold mb-2">Order Status Distribution</h3>
                        <ResponsiveContainer width="100%" height={250}>
                            <PieChart>
                                <Pie
                                    data={chartData}
                                    dataKey="value"
                                    nameKey="name"
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={80}
                                    fill="#8884d8"
                                    label
                                >
                                    {chartData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend verticalAlign="bottom" height={36} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Order List Section */}
                <div className="p-6 border rounded shadow-sm">
                    <h2 className="text-xl font-semibold mb-4">Orders</h2>
                    <ul className="space-y-4 max-h-[400px] overflow-y-auto">
                        {data.orders.map((order) => (
                            <motion.li
                                key={order._id}
                                className="p-4 border rounded shadow-sm"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.3 }}
                            >
                                <p>
                                    <span className="font-semibold">Order ID:</span> {order.orderId}
                                </p>
                                <p>
                                    <span className="font-semibold">Total Price:</span> $
                                    {order.totalPrice.toFixed(2)}

                                </p>
                                <p>
                                    <span className="font-semibold">collectionId: </span>
                                    <span className="font-bold underline underline-offset-2 text-emerald-600">{order.collectionId}</span>

                                </p>
                                <p>
                                    <span className="font-semibold">Status:</span> {order.status}
                                </p>
                                <p>
                                    <span className="font-semibold">Ordered At:</span>{" "}
                                    {new Date(order.orderedAt).toLocaleString()}
                                </p>
                            </motion.li>
                        ))}
                    </ul>
                </div>
            </div>
        </motion.div>
    );
}
