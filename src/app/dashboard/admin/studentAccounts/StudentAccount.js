"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function AdminStudentAccounts() {
    const [accountsData, setAccountsData] = useState({
        metadata: { total: 0, page: 1 },
        data: [],
    });
    const [searchQuery, setSearchQuery] = useState("");
    const [page, setPage] = useState(1);
    const [selectedAccount, setSelectedAccount] = useState(null);
    const [loadingAccounts, setLoadingAccounts] = useState(true);
    const [errorAccounts, setErrorAccounts] = useState("");

    const [detailLoading, setDetailLoading] = useState(false);
    const [detailError, setDetailError] = useState("");

    // For adding transaction in detail view
    const [txnForm, setTxnForm] = useState({
        type: "withdrawal",
        amount: "",
        description: "",
    });
    const [txnStatus, setTxnStatus] = useState("");

    const limit = 10;

    const fetchAccounts = async () => {
        setLoadingAccounts(true);
        try {
            const res = await fetch(
                `/api/admin/student-accounts?search=${searchQuery}&page=${page}&limit=${limit}`
            );
            if (!res.ok) throw new Error("Failed to fetch accounts");
            const data = await res.json();
            setAccountsData(data);
        } catch (error) {
            setErrorAccounts(error.message);
        } finally {
            setLoadingAccounts(false);
        }
    };

    useEffect(() => {
        fetchAccounts();
    }, [searchQuery, page]);

    const fetchAccountDetail = async (studentId) => {
        setDetailLoading(true);
        try {
            const res = await fetch(`/api/admin/student-accounts/${studentId}`);
            if (!res.ok) throw new Error("Failed to fetch account details");
            const data = await res.json();
            setSelectedAccount(data);
        } catch (error) {
            setDetailError(error.message);
        } finally {
            setDetailLoading(false);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        setPage(1);
        fetchAccounts();
    };

    const handleTxnInputChange = (e) => {
        setTxnForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleTxnSubmit = async (e) => {
        e.preventDefault();
        setTxnStatus("");
        if (!selectedAccount) return;
        try {
            const res = await fetch(
                `/api/admin/student-accounts/${selectedAccount.student._id}`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        type: txnForm.type,
                        amount: parseFloat(txnForm.amount),
                        description: txnForm.description,
                    }),
                }
            );
            if (!res.ok) {
                const errData = await res.json();
                throw new Error(errData.error || "Transaction failed");
            }
            const updatedAccount = await res.json();
            setSelectedAccount(updatedAccount);
            setTxnStatus("Transaction successful!");
            setTxnForm({ ...txnForm, amount: "", description: "" });
        } catch (error) {
            setTxnStatus(error.message);
        }
    };

    return (
        <motion.div
            className="container mx-auto p-6 space-y-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
        >
            <h1 className="text-3xl font-bold text-center">Manage Student Accounts</h1>

            {/* Search and List Section */}
            <div className="bg-white p-4 rounded shadow">
                <form onSubmit={handleSearch} className="mb-4 flex">
                    <input
                        type="text"
                        placeholder="Search by name or email"
                        className="flex-grow border rounded-l px-3 py-2"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-r">
                        Search
                    </button>
                </form>
                {loadingAccounts ? (
                    <p>Loading accounts...</p>
                ) : errorAccounts ? (
                    <p className="text-red-500">{errorAccounts}</p>
                ) : (
                    <>
                        <table className="min-w-full border">
                            <thead className="bg-gray-200">
                                <tr>
                                    <th className="px-4 py-2 border">Student Name</th>
                                    <th className="px-4 py-2 border">Email</th>
                                    <th className="px-4 py-2 border">Balance ($)</th>
                                    <th className="px-4 py-2 border">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {accountsData.data.map((account) => (
                                    <tr key={account._id}>
                                        <td className="px-4 py-2 border">
                                            {account.student.firstname} {account.student.lastname}
                                        </td>
                                        <td className="px-4 py-2 border">{account.student.email}</td>
                                        <td className="px-4 py-2 border">{account.balance.toFixed(2)}</td>
                                        <td className="px-4 py-2 border">
                                            <button
                                                className="bg-green-600 text-white px-2 py-1 rounded"
                                                onClick={() => fetchAccountDetail(account.student._id)}
                                            >
                                                Manage
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {/* Pagination Controls */}
                        <div className="flex justify-between items-center mt-4">
                            <button
                                className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
                                onClick={() => setPage(page - 1)}
                                disabled={page <= 1}
                            >
                                Previous
                            </button>
                            <span>Page {page}</span>
                            <button
                                className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
                                onClick={() => setPage(page + 1)}
                                disabled={accountsData.metadata.total <= page * limit}
                            >
                                Next
                            </button>
                        </div>
                    </>
                )}
            </div>

            {/* Detail View Section */}
            {selectedAccount && (
                <div className="bg-white p-6 rounded shadow">
                    <h2 className="text-2xl font-semibold mb-4">
                        Manage Account: {selectedAccount.student.firstname} {selectedAccount.student.lastname}
                    </h2>
                    {detailLoading ? (
                        <p>Loading account details...</p>
                    ) : detailError ? (
                        <p className="text-red-500">{detailError}</p>
                    ) : (
                        <>
                            <div className="mb-4">
                                <p className="text-lg">
                                    Current Balance:{" "}
                                    <span className="font-bold">${selectedAccount.balance.toFixed(2)}</span>
                                </p>
                            </div>
                            <div className="mb-4">
                                <h3 className="text-xl font-semibold mb-2">Transactions</h3>
                                {selectedAccount.transactions.length === 0 ? (
                                    <p>No transactions yet.</p>
                                ) : (
                                    <table className="min-w-full border">
                                        <thead className="bg-gray-200">
                                            <tr>
                                                <th className="px-4 py-2 border">Type</th>
                                                <th className="px-4 py-2 border">Amount</th>
                                                <th className="px-4 py-2 border">Description</th>
                                                <th className="px-4 py-2 border">Date</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {selectedAccount.transactions.map((txn) => (
                                                <tr key={txn._id}>
                                                    <td className="px-4 py-2 border capitalize">{txn.type}</td>
                                                    <td className="px-4 py-2 border">${txn.amount.toFixed(2)}</td>
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
                            <div>
                                <h3 className="text-xl font-semibold mb-2">Add Transaction</h3>
                                <form onSubmit={handleTxnSubmit} className="space-y-4">
                                    <div>
                                        <label className="block mb-1 font-medium">Type:</label>
                                        <select
                                            name="type"
                                            value={txnForm.type}
                                            onChange={handleTxnInputChange}
                                            className="w-full border rounded px-3 py-2"
                                        >
                                            <option value="withdrawal">Withdrawal</option>
                                            <option value="deposit">Deposit</option>
                                            <option value="purchase">Purchase</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block mb-1 font-medium">Amount ($):</label>
                                        <input
                                            type="number"
                                            step="0.01"
                                            name="amount"
                                            value={txnForm.amount}
                                            onChange={handleTxnInputChange}
                                            className="w-full border rounded px-3 py-2"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block mb-1 font-medium">Description:</label>
                                        <input
                                            type="text"
                                            name="description"
                                            value={txnForm.description}
                                            onChange={handleTxnInputChange}
                                            className="w-full border rounded px-3 py-2"
                                            placeholder="Optional description"
                                        />
                                    </div>
                                    <button
                                        type="submit"
                                        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
                                    >
                                        Submit Transaction
                                    </button>
                                    {txnStatus && (
                                        <p className="text-center mt-2 text-green-600">{txnStatus}</p>
                                    )}
                                </form>
                            </div>
                        </>
                    )}
                </div>
            )}
        </motion.div>
    );
}
