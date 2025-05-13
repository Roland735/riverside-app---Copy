"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

// FoodMenu displays available food items from the database (without icons)
function FoodMenu({ foods, onAddItem, orderItems }) {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4 text-center">Available Foods</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {foods.map((food) => {
          const isDisabled = !food.available;
          return (
            <motion.div
              key={food._id}
              whileHover={food.available ? { scale: 1.05 } : {}}
              className={`p-4 border rounded-lg flex flex-col items-center justify-center cursor-pointer transition-all
                ${isDisabled ? "filter blur-sm opacity-50 cursor-not-allowed" : "hover:shadow-lg"}`}
              onClick={() => !isDisabled && onAddItem(food)}
            >
              <p className="font-medium">
                {food.name} ${food.price}
              </p>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

// OrderSummary displays the current order.
function OrderSummary({ orderItems, onUpdateItem, onRemoveItem, onSubmitOrder }) {
  const [errors, setErrors] = useState({});

  const totalPrice = orderItems.reduce(
    (acc, item) => acc + item.price * Number(item.quantity),
    0
  );

  const validateOrder = () => {
    const newErrors = {};
    orderItems.forEach((item, idx) => {
      const quantity = Number(item.quantity);
      if (!item.quantity || quantity < 1) {
        newErrors[idx] = "Quantity must be at least 1.";
      } else if (!Number.isInteger(quantity)) {
        newErrors[idx] = "Quantity must be an integer.";
      }
    });
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validateOrder();
    if (Object.keys(validationErrors).length === 0) {
      onSubmitOrder(orderItems);
    } else {
      setErrors(validationErrors);
    }
  };

  return (
    <motion.div
      className="bg-white p-6 rounded-lg shadow-lg mt-8"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <h3 className="text-2xl font-bold mb-4 text-center">Your Order</h3>
      {orderItems.length === 0 ? (
        <p className="text-center text-gray-600">No items added yet.</p>
      ) : (
        <form onSubmit={handleSubmit}>
          <ul>
            {orderItems.map((item, idx) => (
              <li key={item._id} className="mb-4 border-b pb-4">
                <div className="flex justify-between items-center">
                  <p className="font-medium">
                    {item.name} (${item.price})
                  </p>
                  <button
                    type="button"
                    onClick={() => onRemoveItem(item._id)}
                    className="text-red-500 text-sm hover:underline"
                  >
                    Remove
                  </button>
                </div>
                <div className="mt-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Quantity:
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) =>
                      onUpdateItem(item._id, { quantity: e.target.value })
                    }
                    className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                  />
                  {errors[idx] && (
                    <p className="mt-1 text-xs text-red-500">{errors[idx]}</p>
                  )}
                </div>
                {/* <div className="mt-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Special Instructions:
                  </label>
                  <textarea
                    value={item.instructions}
                    onChange={(e) =>
                      onUpdateItem(item._id, { instructions: e.target.value })
                    }
                    placeholder="Any special instructions?"
                    className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                  ></textarea>
                </div> */}
              </li>
            ))}
          </ul>

          <div className="text-xl font-semibold text-center my-4">
            Total Price: ${totalPrice.toFixed(2)}
          </div>

          <button
            type="submit"
            className="w-full bg-red-500 text-white py-2 mt-4 rounded-md hover:bg-red-600 transition-colors"
          >
            Submit Order
          </button>
        </form>
      )}
    </motion.div>
  );
}

export default function OrderPage({ session }) {
  const [foods, setFoods] = useState([]);
  const [orderItems, setOrderItems] = useState([]);
  const [popup, setPopup] = useState(null);

  // Fetch menu items using fetch
  useEffect(() => {
    fetch("/api/fooditems")
      .then((res) => res.json())
      .then((data) => {
        console.log(data);

        if (data.success) setFoods(data.data);
        else console.error("Menu fetch failed:", data.error);
      })
      .catch((err) => console.error("Error fetching menu:", err));
  }, []);

  const handleAddItem = (food) => {
    if (!orderItems.some((item) => item._id === food._id)) {
      setOrderItems((prev) => [
        ...prev,
        { ...food, quantity: 1, instructions: "" },
      ]);
      setPopup(null);
    }
  };

  const handleUpdateItem = (id, updates) => {
    setOrderItems((prev) =>
      prev.map((item) => (item._id === id ? { ...item, ...updates } : item))
    );
  };

  const handleRemoveItem = (id) => {
    setOrderItems((prev) => prev.filter((item) => item._id !== id));
  };

  const handleSubmitOrder = async (order) => {
    const totalPrice = order.reduce(
      (acc, item) => acc + item.price * Number(item.quantity),
      0
    );

    const orderData = {
      user: session.user.id,
      items: order.map((item) => ({
        foodItem: item._id,
        quantity: Number(item.quantity),
      })),
      collectionId: "dummy-collection",
      totalPrice,
      status: "pending",
    };

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
      });
      const data = await res.json();
      if (data.success) {
        setPopup({
          type: "success",
          message: `Your order has been submitted successfully! Collection ID: ${data.collectionId}`,
        });
        setOrderItems([]);
      } else {
        throw new Error(data.error || "Unknown error");
      }
    } catch (error) {
      console.error("Error submitting order:", error);
      setPopup({
        type: "error",
        message: error.message || "Transaction failed. Please try again.",
      });
    }
  };

  return (
    <div className="min-h-screen bg-stone-100 p-4 w-full">
      <div className="max-w-5xl mx-auto">
        <FoodMenu foods={foods} onAddItem={handleAddItem} orderItems={orderItems} />
        <OrderSummary
          orderItems={orderItems}
          onUpdateItem={handleUpdateItem}
          onRemoveItem={handleRemoveItem}
          onSubmitOrder={handleSubmitOrder}
        />
      </div>

      {popup && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="absolute inset-0 bg-black opacity-50" />
          <motion.div
            className="bg-white p-8 rounded-lg shadow-lg z-50 max-w-sm mx-auto text-center"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <p
              className={`text-lg font-medium ${popup.type === "success" ? "text-green-800" : "text-red-800"
                }`}
            >
              {popup.message}
            </p>
            <button
              className="mt-4 bg-gray-200 py-2 px-4 rounded hover:bg-gray-300"
              onClick={() => setPopup(null)}
            >
              Close
            </button>
          </motion.div>
        </div>
      )}
    </div>
  );
}
