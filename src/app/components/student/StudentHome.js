// pages/index.js
import { useState } from 'react';
import { motion } from 'framer-motion';
import { FaRegMoneyBillAlt, FaTimesCircle, FaExclamationCircle } from 'react-icons/fa';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

export default function HomeDashboard() {
  // Sample data for the transaction history chart
  const chartData = [
    { name: 'Jan', transactions: 30 },
    { name: 'Feb', transactions: 45 },
    { name: 'Mar', transactions: 28 },
    { name: 'Apr', transactions: 50 },
    { name: 'May', transactions: 40 },
    { name: 'Jun', transactions: 60 },
  ];

  // Sample stats data for overview cards
  const stats = [
    {
      id: 1,
      title: 'Transactions',
      value: 120,
      icon: <FaRegMoneyBillAlt size={30} className="text-red-500" />,
    },
    {
      id: 2,
      title: 'Cancelled Orders',
      value: 15,
      icon: <FaTimesCircle size={30} className="text-red-500" />,
    },
    {
      id: 3,
      title: 'Expired Orders',
      value: 8,
      icon: <FaExclamationCircle size={30} className="text-red-500" />,
    },
  ];

  // Sample orders for the table
  const orders = [
    { id: '#001', item: 'Burger', status: 'Completed', amount: '$5.99', statusColor: 'text-green-600' },
    { id: '#002', item: 'Pizza', status: 'Cancelled', amount: '$7.99', statusColor: 'text-red-600' },
    { id: '#003', item: 'Coffee', status: 'Expired', amount: '$2.99', statusColor: 'text-yellow-600' },
  ];

  return (
    <div className="min-h-screen bg-stone-100 flex flex-col w-full">
      {/* Header */}
      <header className="bg-white shadow-md py-4 px-8">
        <h1 className="text-3xl font-bold text-red-500">Canteen Dashboard</h1>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-7xl mx-auto bg-white rounded-lg p-6 shadow-lg"
        >
          <h2 className="text-2xl font-semibold mb-4 text-center">Welcome, Student!</h2>

          {/* Overview Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {stats.map((item) => (
              <motion.div
                key={item.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center p-4 bg-stone-200 rounded-lg border border-red-500 transition-colors"
              >
                <div className="mr-4">{item.icon}</div>
                <div>
                  <p className="text-xl font-bold">{item.value}</p>
                  <p className="text-sm">{item.title}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Transaction History Chart */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold mb-4 text-center">Transaction History</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#d1d5db" />
                <XAxis dataKey="name" stroke="#4b5563" />
                <YAxis stroke="#4b5563" />
                <Tooltip />
                <Line type="monotone" dataKey="transactions" stroke="#ef4444" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Orders Table */}
          <div>
            <h3 className="text-xl font-semibold mb-4 text-center">Orders Overview</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-stone-300">
                <thead className="bg-stone-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-stone-700 uppercase tracking-wider">
                      Order ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-stone-700 uppercase tracking-wider">
                      Item
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-stone-700 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-stone-700 uppercase tracking-wider">
                      Amount
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-stone-300">
                  {orders.map((order, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap">{order.id}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{order.item}</td>
                      <td className={`px-6 py-4 whitespace-nowrap ${order.statusColor}`}>
                        {order.status}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">{order.amount}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </motion.div>
      </main>

    </div>
  );
}
