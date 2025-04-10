"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function StudentAccount({ studentId }) {
    const [account, setAccount] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [formData, setFormData] = useState({
        type: "withdrawal", // preset for withdrawal; you could allow a selector for 'deposit' as well
        amount: "",
        description: "",
    });
    const [formStatus, setFormStatus] = useState("");

    // Fetch account details
    useEffect(() => {
        async function fetchAccount() {
            try {
                const res = await fetch(`/api/student-account/${studentId}`);
                if (!res.ok) throw new Error("Failed to fetch account");
                const data = await res.json();
                setAccount(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }
        fetchAccount();
    }, [studentId]);

    // Handle input changes
    const handleInputChange = (e) => {
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    // Handle form submission to create a new transaction (withdrawal)
    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormStatus("");
        try {
            const res = await fetch(`/api/student-account/${studentId}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    type: formData.type,
                    amount: parseFloat(formData.amount),
                    description: formData.description,
                }),
            });
            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.error || "Transaction failed");
            }
            const updatedAccount = await res.json();
            setAccount(updatedAccount);
            setFormStatus("Transaction successful!");
            // Reset the form fields
            setFormData({ ...formData, amount: "", description: "" });
        } catch (err) {
            setFormStatus(err.message);
        }
    };

    if (loading)
        return <div className="text-center py-10">Loading account details...</div>;
    if (error)
        return (
            <div className="text-center py-10 text-red-500">Error: {error}</div>
        );

    return (
        <motion.div
            className="container mx-auto p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
        >
            <h1 className="text-3xl font-bold mb-6">Student Account</h1>

            <div className="bg-white p-6 rounded shadow mb-8">
                <h2 className="text-2xl font-semibold mb-4">Current Balance</h2>
                <p className="text-3xl">${account.balance.toFixed(2)}</p>
            </div>

            <div className="bg-white p-6 rounded shadow mb-8">
                <h2 className="text-2xl font-semibold mb-4">Account Statement</h2>
                {account.transactions.length === 0 ? (
                    <p>No transactions yet.</p>
                ) : (
                    <table className="min-w-full border">
                        <thead className="bg-gray-200">
                            <tr>
                                <th className="px-4 py-2 border">Type</th>
                                <th className="px-4 py-2 border">Amount ($)</th>
                                <th className="px-4 py-2 border">Description</th>
                                <th className="px-4 py-2 border">Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {account.transactions.map((txn) => (
                                <tr key={txn._id}>
                                    <td className="px-4 py-2 border capitalize">{txn.type}</td>
                                    <td className="px-4 py-2 border">{txn.amount.toFixed(2)}</td>
                                    <td className="px-4 py-2 border">{txn.description || "-"}</td>
                                    <td className="px-4 py-2 border">
                                        {new Date(txn.createdAt).toLocaleString()}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {/* Transaction Form */}
            <div className="bg-white p-6 rounded shadow max-w-md mx-auto">
                <h2 className="text-2xl font-semibold mb-4 text-center">
                    Request Withdrawal
                </h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block mb-1 font-medium">Amount ($):</label>
                        <input
                            type="number"
                            step="0.01"
                            name="amount"
                            value={formData.amount}
                            onChange={handleInputChange}
                            placeholder="Enter amount"
                            className="w-full border rounded px-3 py-2"
                            required
                        />
                    </div>
                    <div>
                        <label className="block mb-1 font-medium">Description:</label>
                        <input
                            type="text"
                            name="description"
                            value={formData.description}
                            onChange={handleInputChange}
                            placeholder="Optional description"
                            className="w-full border rounded px-3 py-2"
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
                    >
                        Submit Withdrawal
                    </button>
                    {formStatus && (
                        <p className="text-center mt-2 text-green-600">{formStatus}</p>
                    )}
                </form>
            </div>
        </motion.div>
    );
}
