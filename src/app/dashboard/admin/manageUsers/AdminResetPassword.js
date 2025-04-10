"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";

export default function AdminResetPassword() {
    const [searchTerm, setSearchTerm] = useState({
        regNumber: "",
        firstName: "",
        lastName: "",
    });
    const [results, setResults] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [newPassword, setNewPassword] = useState("");

    // Function to fetch users (with optional query parameters)
    const fetchUsers = async (params = {}) => {
        const queryParams = new URLSearchParams(params);
        const res = await fetch(`/api/admin/search-user?${queryParams.toString()}`);
        const data = await res.json();
        setResults(data.users || []);
    };

    // Initial fetch: get all users when component mounts
    useEffect(() => {
        console.log("Fetching users...");
        fetchUsers();
        console.log(results);
    }, []);

    // Handle search submission
    const handleSearch = async (e) => {
        e.preventDefault();
        fetchUsers(searchTerm);
    };

    const handleResetPassword = async (userId) => {
        if (!newPassword) {
            alert("Please enter a new password");
            return;
        }
        const res = await fetch("/api/admin/reset-password", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId, newPassword }),
        });
        const data = await res.json();
        if (data.success) {
            alert("Password reset successfully!");
            // Optionally clear fields or update UI here
            setNewPassword("");
            setSelectedUser(null);
            // Refresh the user list after reset if needed
            fetchUsers(searchTerm);
        } else {
            alert("Failed to reset password");
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg">
            <motion.h1
                className="text-2xl font-bold mb-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
            >
                Reset User Password
            </motion.h1>
            <form onSubmit={handleSearch} className="flex flex-col gap-4">
                <div className="flex flex-col md:flex-row gap-4">
                    <input
                        type="text"
                        placeholder="Registration Number"
                        value={searchTerm.regNumber}
                        onChange={(e) =>
                            setSearchTerm({ ...searchTerm, regNumber: e.target.value })
                        }
                        className="p-2 border border-gray-300 rounded flex-1"
                    />
                    <input
                        type="text"
                        placeholder="First Name"
                        value={searchTerm.firstName}
                        onChange={(e) =>
                            setSearchTerm({ ...searchTerm, firstName: e.target.value })
                        }
                        className="p-2 border border-gray-300 rounded flex-1"
                    />
                    <input
                        type="text"
                        placeholder="Last Name"
                        value={searchTerm.lastName}
                        onChange={(e) =>
                            setSearchTerm({ ...searchTerm, lastName: e.target.value })
                        }
                        className="p-2 border border-gray-300 rounded flex-1"
                    />
                </div>
                <button
                    type="submit"
                    className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
                >
                    Search User
                </button>
            </form>

            {results.length > 0 && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mt-6"
                >
                    <h2 className="text-xl font-semibold mb-2">Search Results:</h2>
                    <ul className="space-y-4">
                        {results.map((user) => (
                            <li
                                key={user._id}
                                className="p-4 border border-gray-200 rounded flex flex-col gap-2"
                            >
                                <div>
                                    <span className="font-medium">Reg No:</span> {user.regNumber}
                                </div>
                                <div>
                                    <span className="font-medium">Name:</span> {user.firstName}{" "}
                                    {user.lastName}
                                </div>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        placeholder="New Password"
                                        value={selectedUser === user._id ? newPassword : ""}
                                        onChange={(e) => {
                                            setSelectedUser(user._id);
                                            setNewPassword(e.target.value);
                                        }}
                                        className="p-2 border border-gray-300 rounded flex-1"
                                    />
                                    <button
                                        onClick={() => handleResetPassword(user._id)}
                                        className="bg-red-500 text-white p-2 rounded hover:bg-red-600"
                                    >
                                        Reset Password
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                </motion.div>
            )}
        </div>
    );
}
