"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    Legend,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    LineChart,
    Line,
} from "recharts";

// Updated primary color palette using red tones
const COLORS = ["#E11D48", "#F87171", "#FCA5A5", "#FECACA"];

export default function AdminDashboard() {
    // States for overall stats, food stats, order status, revenue trends, canteen orders, and form data.
    const [stats, setStats] = useState(null);
    const [foodStats, setFoodStats] = useState(null);
    const [orderStatus, setOrderStatus] = useState(null);
    const [revenueTrends, setRevenueTrends] = useState(null);
    const [canteenStats, setCanteenStats] = useState(null);

    const [loadingStats, setLoadingStats] = useState(true);
    const [loadingFoodStats, setLoadingFoodStats] = useState(true);
    const [loadingOrderStatus, setLoadingOrderStatus] = useState(true);
    const [loadingRevenueTrends, setLoadingRevenueTrends] = useState(true);
    const [loadingCanteenStats, setLoadingCanteenStats] = useState(true);

    const [errorStats, setErrorStats] = useState(null);
    const [errorFoodStats, setErrorFoodStats] = useState(null);
    const [errorOrderStatus, setErrorOrderStatus] = useState(null);
    const [errorRevenueTrends, setErrorRevenueTrends] = useState(null);
    const [errorCanteenStats, setErrorCanteenStats] = useState(null);

    // Form state for adding a student
    const [formStatus, setFormStatus] = useState("");
    const [formData, setFormData] = useState({
        userId: "",
        firstname: "",
        lastname: "",
        regNumber: "",
        email: "",
        profilePicture: "",
    });

    // Fetch overall stats
    useEffect(() => {
        async function fetchStats() {
            try {
                const res = await fetch("/api/admin/stats");
                if (!res.ok) throw new Error("Failed to fetch overall stats");
                const data = await res.json();
                setStats(data);
            } catch (err) {
                setErrorStats(err.message);
            } finally {
                setLoadingStats(false);
            }
        }
        fetchStats();
    }, []);

    // Fetch food sales performance stats
    useEffect(() => {
        async function fetchFoodStats() {
            try {
                const res = await fetch("/api/admin/food-stats");
                if (!res.ok) throw new Error("Failed to fetch food stats");
                const data = await res.json();
                setFoodStats(data);
            } catch (err) {
                setErrorFoodStats(err.message);
            } finally {
                setLoadingFoodStats(false);
            }
        }
        fetchFoodStats();
    }, []);

    // Fetch order status distribution
    useEffect(() => {
        async function fetchOrderStatus() {
            try {
                const res = await fetch("/api/admin/order-status");
                if (!res.ok) throw new Error("Failed to fetch order status");
                const data = await res.json();
                setOrderStatus(data);
            } catch (err) {
                setErrorOrderStatus(err.message);
            } finally {
                setLoadingOrderStatus(false);
            }
        }
        fetchOrderStatus();
    }, []);

    // Fetch revenue trends
    useEffect(() => {
        async function fetchRevenueTrends() {
            try {
                const res = await fetch("/api/admin/revenue-trends");
                if (!res.ok) throw new Error("Failed to fetch revenue trends");
                const data = await res.json();
                setRevenueTrends(data);
            } catch (err) {
                setErrorRevenueTrends(err.message);
            } finally {
                setLoadingRevenueTrends(false);
            }
        }
        fetchRevenueTrends();
    }, []);

    // Fetch canteen order performance
    useEffect(() => {
        async function fetchCanteenStats() {
            try {
                const res = await fetch("/api/admin/canteen-orders");
                if (!res.ok) throw new Error("Failed to fetch canteen stats");
                const data = await res.json();
                setCanteenStats(data);
            } catch (err) {
                setErrorCanteenStats(err.message);
            } finally {
                setLoadingCanteenStats(false);
            }
        }
        fetchCanteenStats();
    }, []);

    // Handle student form input changes
    const handleInputChange = (e) => {
        setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    // Handle adding a new student
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch("/api/admin/student", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });
            if (!res.ok) throw new Error("Failed to add student");
            await res.json();
            setFormStatus("Student added successfully!");
            setFormData({
                userId: "",
                firstname: "",
                lastname: "",
                regNumber: "",
                email: "",
                profilePicture: "",
            });
        } catch (err) {
            setFormStatus(err.message);
        }
    };

    // Prepare chart data for order status pie chart
    const orderStatusChartData = orderStatus
        ? orderStatus.map((status) => ({
            name: status._id,
            value: status.count,
        }))
        : [];

    return (
        <motion.div
            className="min-h-screen bg-stone-50 p-6 space-y-12 w-full"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
        >
            <h1 className="text-3xl font-bold text-center text-red-700">
                Admin Dashboard
            </h1>

            {/* Overall Stats Section */}
            <div className="bg-white p-6 rounded-lg shadow-lg border-t-4 border-red-600 text-center">
                <h2 className="text-2xl font-semibold mb-4 text-red-700">
                    Overall Statistics
                </h2>
                {loadingStats ? (
                    <p>Loading overall stats...</p>
                ) : errorStats ? (
                    <p className="text-red-500">{errorStats}</p>
                ) : (
                    <div className="flex flex-col sm:flex-row justify-around">
                        <div className="mb-4 sm:mb-0">
                            <p className="text-lg font-medium">Total Sales</p>
                            <p className="text-2xl">{stats.totalSales}</p>
                        </div>
                        <div className="mb-4 sm:mb-0">
                            <p className="text-lg font-medium">Revenue</p>
                            <p className="text-2xl">${stats.totalRevenue.toFixed(2)}</p>
                        </div>
                        <div>
                            <p className="text-lg font-medium">Total Students</p>
                            <p className="text-2xl">{stats.totalStudents}</p>
                        </div>
                    </div>
                )}
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                {/* Food Sales Performance */}
                <div className="bg-white p-6 rounded-lg shadow-lg border-t-4 border-red-600">
                    <h2 className="text-2xl font-semibold mb-4 text-red-700">
                        Food Sales Performance
                    </h2>
                    {loadingFoodStats || errorFoodStats ? (
                        <p>{errorFoodStats ? errorFoodStats : "Loading food stats..."}</p>
                    ) : (
                        <>
                            <div className="h-64">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={foodStats}>
                                        <XAxis dataKey="foodName" tick={{ fontSize: 12 }} />
                                        <YAxis />
                                        <Tooltip />
                                        <Legend />
                                        <Bar dataKey="totalQuantity" fill="#E11D48" name="Quantity Sold" />
                                        <Bar dataKey="totalRevenue" fill="#F87171" name="Revenue" />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                            <div className="mt-4 overflow-x-auto">
                                <table className="min-w-full border">
                                    <thead className="bg-stone-200">
                                        <tr>
                                            <th className="px-4 py-2 border">Food Item</th>
                                            <th className="px-4 py-2 border">Quantity Sold</th>
                                            <th className="px-4 py-2 border">Revenue ($)</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {foodStats.map((food) => (
                                            <tr key={food._id}>
                                                <td className="px-4 py-2 border">{food.foodName}</td>
                                                <td className="px-4 py-2 border">{food.totalQuantity}</td>
                                                <td className="px-4 py-2 border">
                                                    {food.totalRevenue.toFixed(2)}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </>
                    )}
                </div>

                {/* Order Status Distribution */}
                <div className="bg-white p-6 rounded-lg shadow-lg border-t-4 border-red-600">
                    <h2 className="text-2xl font-semibold mb-4 text-red-700">
                        Order Status Distribution
                    </h2>
                    {loadingOrderStatus || errorOrderStatus ? (
                        <p>{errorOrderStatus ? errorOrderStatus : "Loading order status..."}</p>
                    ) : (
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    data={orderStatusChartData}
                                    dataKey="value"
                                    nameKey="name"
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={80}
                                    label
                                >
                                    {orderStatusChartData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend verticalAlign="bottom" height={36} />
                            </PieChart>
                        </ResponsiveContainer>
                    )}
                </div>

                {/* Revenue Trends */}
                <div className="bg-white p-6 rounded-lg shadow-lg border-t-4 border-red-600 xl:col-span-2">
                    <h2 className="text-2xl font-semibold mb-4 text-red-700">
                        Revenue Trends (Daily)
                    </h2>
                    {loadingRevenueTrends || errorRevenueTrends ? (
                        <p>{errorRevenueTrends ? errorRevenueTrends : "Loading revenue trends..."}</p>
                    ) : (
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={revenueTrends}>
                                <XAxis dataKey="_id" tick={{ fontSize: 12 }} />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Line type="monotone" dataKey="dailyRevenue" stroke="#E11D48" name="Revenue" />
                                <Line type="monotone" dataKey="ordersCount" stroke="#F87171" name="Orders Count" />
                            </LineChart>
                        </ResponsiveContainer>
                    )}
                </div>

                {/* Canteen Order Performance */}
                <div className="bg-white p-6 rounded-lg shadow-lg border-t-4 border-red-600 xl:col-span-2">
                    <h2 className="text-2xl font-semibold mb-4 text-red-700">
                        Canteen Order Performance
                    </h2>
                    {loadingCanteenStats || errorCanteenStats ? (
                        <p>{errorCanteenStats ? errorCanteenStats : "Loading canteen stats..."}</p>
                    ) : (
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={canteenStats}>
                                <XAxis dataKey="foodName" tick={{ fontSize: 12 }} />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="totalOrdered" fill="#E11D48" name="Total Ordered" />
                                <Bar dataKey="totalPrepared" fill="#F87171" name="Total Prepared" />
                            </BarChart>
                        </ResponsiveContainer>
                    )}
                </div>
            </div>

            {/* Add Student Form */}
            <div className="bg-white p-6 rounded-lg shadow-lg border-t-4 border-red-600 max-w-lg mx-auto">
                <h2 className="text-2xl font-semibold mb-4 text-center text-red-700">
                    Add New Student
                </h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block mb-1 font-medium">User ID (Parent):</label>
                        <input
                            type="text"
                            name="userId"
                            value={formData.userId}
                            onChange={handleInputChange}
                            placeholder="Enter parent's user ID"
                            className="w-full border rounded px-3 py-2 focus:outline-red-600"
                            required
                        />
                    </div>
                    <div>
                        <label className="block mb-1 font-medium">First Name:</label>
                        <input
                            type="text"
                            name="firstname"
                            value={formData.firstname}
                            onChange={handleInputChange}
                            placeholder="Student's first name"
                            className="w-full border rounded px-3 py-2 focus:outline-red-600"
                            required
                        />
                    </div>
                    <div>
                        <label className="block mb-1 font-medium">Last Name:</label>
                        <input
                            type="text"
                            name="lastname"
                            value={formData.lastname}
                            onChange={handleInputChange}
                            placeholder="Student's last name"
                            className="w-full border rounded px-3 py-2 focus:outline-red-600"
                            required
                        />
                    </div>
                    <div>
                        <label className="block mb-1 font-medium">Registration Number:</label>
                        <input
                            type="text"
                            name="regNumber"
                            value={formData.regNumber}
                            onChange={handleInputChange}
                            placeholder="Registration number"
                            className="w-full border rounded px-3 py-2 focus:outline-red-600"
                            required
                        />
                    </div>
                    <div>
                        <label className="block mb-1 font-medium">Email:</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            placeholder="Student's email"
                            className="w-full border rounded px-3 py-2 focus:outline-red-600"
                            required
                        />
                    </div>
                    <div>
                        <label className="block mb-1 font-medium">Profile Picture URL:</label>
                        <input
                            type="text"
                            name="profilePicture"
                            value={formData.profilePicture}
                            onChange={handleInputChange}
                            placeholder="Link to profile picture"
                            className="w-full border rounded px-3 py-2 focus:outline-red-600"
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-red-600 text-white py-2 rounded hover:bg-red-700 transition"
                    >
                        Add Student
                    </button>
                    {formStatus && (
                        <p className="text-center mt-2 text-green-600">{formStatus}</p>
                    )}
                </form>
            </div>
        </motion.div>
    );
}
