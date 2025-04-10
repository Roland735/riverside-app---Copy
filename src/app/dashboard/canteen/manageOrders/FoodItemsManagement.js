"use client";
import React, { useState, useEffect } from "react";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import axios from "axios";

const API_URL = "/api/fooditems";

// Modal for creating a new food item
const CreateFoodItem = ({ onClose, onCreate }) => {
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        price: "",
        available: true,
        imageUrl: "",
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(API_URL, formData);
            // Assuming API returns { success: true, data: savedItem }
            onCreate(response.data.data);
            setFormData({
                name: "",
                description: "",
                price: "",
                available: true,
                imageUrl: "",
            });
            onClose();
        } catch (error) {
            console.error("Error creating food item:", error);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-md w-full max-w-md shadow-lg">
                <h2 className="text-2xl font-bold mb-4 text-red-600">Create Food Item</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-700 font-medium mb-1">Name</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-red-600"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 font-medium mb-1">Description</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            rows="3"
                            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-red-600"
                        ></textarea>
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 font-medium mb-1">Price ($)</label>
                        <input
                            type="number"
                            name="price"
                            value={formData.price}
                            onChange={handleChange}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-red-600"
                        />
                    </div>
                    <div className="mb-4 flex items-center">
                        <input
                            type="checkbox"
                            name="available"
                            checked={formData.available}
                            onChange={handleChange}
                            className="mr-2"
                        />
                        <label className="text-gray-700 font-medium">Available</label>
                    </div>
                    <div className="mb-6">
                        <label className="block text-gray-700 font-medium mb-1">Image URL</label>
                        <input
                            type="text"
                            name="imageUrl"
                            value={formData.imageUrl}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-red-600"
                        />
                    </div>
                    <div className="flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100 transition"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
                        >
                            Create
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

// Modal for editing an existing food item
const EditFoodItem = ({ onClose, item, onUpdate }) => {
    const [formData, setFormData] = useState({
        id: item._id,
        name: item.name,
        description: item.description,
        price: item.price,
        available: item.available,
        imageUrl: item.imageUrl,
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.put(API_URL, formData);
            onUpdate(response.data.data);
            onClose();
        } catch (error) {
            console.error("Error updating food item:", error);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-md w-full max-w-md shadow-lg">
                <h2 className="text-2xl font-bold mb-4 text-red-600">Edit Food Item</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-700 font-medium mb-1">Name</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-red-600"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 font-medium mb-1">Description</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            rows="3"
                            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-red-600"
                        ></textarea>
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 font-medium mb-1">Price ($)</label>
                        <input
                            type="number"
                            name="price"
                            value={formData.price}
                            onChange={handleChange}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-red-600"
                        />
                    </div>
                    <div className="mb-4 flex items-center">
                        <input
                            type="checkbox"
                            name="available"
                            checked={formData.available}
                            onChange={handleChange}
                            className="mr-2"
                        />
                        <label className="text-gray-700 font-medium">Available</label>
                    </div>
                    <div className="mb-6">
                        <label className="block text-gray-700 font-medium mb-1">Image URL</label>
                        <input
                            type="text"
                            name="imageUrl"
                            value={formData.imageUrl}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-red-600"
                        />
                    </div>
                    <div className="flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100 transition"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
                        >
                            Update
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const FoodItemsManagement = () => {
    const [foodItems, setFoodItems] = useState([]);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [editItem, setEditItem] = useState(null);

    useEffect(() => {
        axios
            .get(API_URL)
            .then((response) => {
                // Assuming API returns { success: true, data: [...] }
                setFoodItems(response.data.data);
            })
            .catch((error) => console.error("Error fetching food items:", error));
    }, []);

    const handleCreateFoodItem = (newItem) => {
        setFoodItems((prevItems) => [...prevItems, newItem]);
    };

    const handleUpdateFoodItem = (updatedItem) => {
        setFoodItems((prevItems) =>
            prevItems.map((item) => (item._id === updatedItem._id ? updatedItem : item))
        );
    };

    const handleDelete = async (id) => {
        try {
            // API expects the id as a query param
            await axios.delete(`${API_URL}?id=${id}`);
            setFoodItems((prevItems) => prevItems.filter((item) => item._id !== id));
        } catch (error) {
            console.error("Error deleting food item:", error);
        }
    };

    return (
        <div className="p-8 w-full">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">Food Items Management</h1>
            <div className="mb-4 flex justify-end">
                <button
                    onClick={() => setIsCreateModalOpen(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
                >
                    <FaPlus /> Add New Food Item
                </button>
            </div>
            <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-200 rounded shadow-sm">
                    <thead className="bg-red-600 text-white">
                        <tr>
                            <th className="px-4 py-2 border-r border-gray-200">Name</th>
                            <th className="px-4 py-2 border-r border-gray-200">Description</th>
                            <th className="px-4 py-2 border-r border-gray-200">Price ($)</th>
                            <th className="px-4 py-2 border-r border-gray-200">Available</th>
                            <th className="px-4 py-2">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {foodItems.map((item) => (
                            <tr key={item._id} className="text-gray-700 hover:bg-gray-50">
                                <td className="px-4 py-2 border-t border-gray-200">{item.name}</td>
                                <td className="px-4 py-2 border-t border-gray-200">{item.description}</td>
                                <td className="px-4 py-2 border-t border-gray-200">{Number(item.price).toFixed(2)}</td>
                                <td className="px-4 py-2 border-t border-gray-200">{item.available ? "Yes" : "No"}</td>
                                <td className="px-4 py-2 border-t border-gray-200 flex gap-2">
                                    <button
                                        onClick={() => setEditItem(item)}
                                        className="flex items-center gap-1 px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition"
                                    >
                                        <FaEdit /> Edit
                                    </button>
                                    <button
                                        onClick={() => handleDelete(item._id)}
                                        className="flex items-center gap-1 px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition"
                                    >
                                        <FaTrash /> Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {isCreateModalOpen && (
                <CreateFoodItem
                    onClose={() => setIsCreateModalOpen(false)}
                    onCreate={handleCreateFoodItem}
                />
            )}
            {editItem && (
                <EditFoodItem
                    item={editItem}
                    onClose={() => setEditItem(null)}
                    onUpdate={handleUpdateFoodItem}
                />
            )}
        </div>
    );
};

export default FoodItemsManagement;
