"use client";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, Loader2, X, ShoppingBag, CheckCircle, AlertCircle } from "lucide-react";
import {
  fetchAllOrders,
  fetchNewOrders,
  fetchPendingOrders,
  fetchConfirmedOrders,
  fetchCancelledOrders,
  processOrderAction,
} from "../api/orderApi";

export default function OrderManagement() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [activeTab, setActiveTab] = useState("All orders");
  const [notification, setNotification] = useState({ show: false, message: "" });

  const reasons = [
    "Out of stock",
    "Price changed",
    "Product discontinued",
    "Can ship to customer’s location",
    "Damaged product in inventory",
    "Incorrect product listing",
    "Minimum order quantity not met",
    "Payment issue (COD not accepted)",
    "Delay in restocking",
    "Other reason",
  ];

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedReason, setSelectedReason] = useState("");
  const [rejectingOrderId, setRejectingOrderId] = useState(null);
  const [isAcceptModalOpen, setIsAcceptModalOpen] = useState(false);
  const [acceptingOrderId, setAcceptingOrderId] = useState(null);

  const loadData = async (tab) => {
    setLoading(true);
    try {
      let data;
      if (tab === "New Orders") data = await fetchNewOrders();
      else if (tab === "Pending Orders") data = await fetchPendingOrders();
      else if (tab === "Confirmed Orders") data = await fetchConfirmedOrders();
      else if (tab === "Cancelled Orders") data = await fetchCancelledOrders();
      else data = await fetchAllOrders();

      if (data && data.success) {
        setOrders(data.orders || []);
      } else {
        setOrders([]);
      }
    } catch (err) {
      showAlert(err.message);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData(activeTab);
  }, [activeTab]);

  const handleAccept = (orderId) => {
    setAcceptingOrderId(orderId);
    setIsAcceptModalOpen(true);
  };

  const handleConfirmAccept = async () => {
    setProcessing(true);
    try {
      const res = await processOrderAction({
        order_id: acceptingOrderId,
        action: "accept",
      });
      if (res.success) {
        setIsAcceptModalOpen(false);
        showAlert("Order accepted successfully!");
        loadData(activeTab);
      }
    } catch (error) {
      showAlert(error.message);
    } finally {
      setProcessing(false);
    }
  };

  const handleConfirmReject = async () => {
    if (!selectedReason) return;
    setProcessing(true);
    try {
      const res = await processOrderAction({
        order_id: rejectingOrderId,
        action: "reject",
        reason: selectedReason,
      });
      if (res.success) {
        setIsModalOpen(false);
        setSelectedReason("");
        showAlert("Order rejected successfully!");
        loadData(activeTab);
      }
    } catch (error) {
      showAlert(error.message);
    } finally {
      setProcessing(false);
    }
  };

  const handleOpenRejectModal = (id) => {
    setRejectingOrderId(id);
    setIsModalOpen(true);
  };

  const showAlert = (msg) => {
    setNotification({ show: true, message: msg });
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.08 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  };

  return (
    <div className="relative min-h-screen w-full bg-gradient-to-b from-white via-purple-50 to-white overflow-hidden pb-16 pt-6">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[400px] h-[400px] bg-purple-200/40 rounded-full blur-[120px]" />
        <div className="absolute top-[30%] right-[-10%] w-[350px] h-[350px] bg-purple-100/50 rounded-full blur-[120px]" />
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-purple-950/20 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative bg-white w-full max-w-md rounded-3xl shadow-2xl shadow-purple-200/50 p-7 border border-purple-100 z-10"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-red-50 flex items-center justify-center text-red-500 border border-red-100">
                    <AlertCircle size={20} />
                  </div>
                  <div>
                    <h2 className="text-xl font-extrabold text-gray-900 tracking-wide">Reject Order</h2>
                    <p className="text-xs text-gray-500 font-medium">Select a reason for rejection</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-gray-400 hover:text-gray-600 p-1 rounded-xl hover:bg-gray-100 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-2 max-h-[50vh] overflow-y-auto pr-1 custom-scrollbar my-4">
                {reasons.map((reason, index) => (
                  <label
                    key={index}
                    className={`flex items-center gap-3 cursor-pointer p-3.5 rounded-2xl border transition-all duration-300 ${
                      selectedReason === reason
                        ? "border-purple-400 bg-purple-50 shadow-sm"
                        : "border-purple-100 hover:border-purple-200 hover:bg-purple-50/30"
                    }`}
                  >
                    <input
                      type="radio"
                      name="rejectReason"
                      className="w-4 h-4 accent-purple-500"
                      checked={selectedReason === reason}
                      onChange={() => setSelectedReason(reason)}
                    />
                    <span className="text-sm text-gray-700 font-semibold">{reason}</span>
                  </label>
                ))}
              </div>

              <div className="mt-6 flex gap-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setIsModalOpen(false)}
                  disabled={processing}
                  className="flex-1 py-3 border border-gray-200 rounded-2xl text-sm font-bold text-gray-600 hover:bg-gray-50 transition-all"
                >
                  Cancel
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleConfirmReject}
                  disabled={!selectedReason || processing}
                  className={`flex-1 py-3 rounded-2xl text-sm font-bold text-white flex items-center justify-center transition-all shadow-lg ${
                    selectedReason && !processing
                      ? "bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 shadow-red-200"
                      : "bg-gray-300 cursor-not-allowed shadow-none"
                  }`}
                >
                  {processing ? <Loader2 className="animate-spin w-5 h-5" /> : "Confirm Reject"}
                </motion.button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isAcceptModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAcceptModalOpen(false)}
              className="absolute inset-0 bg-purple-950/20 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative bg-white w-full max-w-md rounded-3xl shadow-2xl shadow-purple-200/50 p-7 border border-purple-100 z-10"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-2xl bg-purple-50 flex items-center justify-center text-purple-500 border border-purple-100">
                  <CheckCircle size={24} />
                </div>
                <div>
                  <h2 className="text-xl font-extrabold text-gray-900 tracking-wide">Accept Order</h2>
                  <p className="text-xs text-gray-500 font-medium">Confirmation request</p>
                </div>
              </div>
              <p className="text-sm text-gray-600 font-medium my-4">
                Are you sure you want to accept and process this customer order?
              </p>
              <div className="mt-6 flex gap-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setIsAcceptModalOpen(false)}
                  disabled={processing}
                  className="flex-1 py-3 border border-gray-200 rounded-2xl text-sm font-bold text-gray-600 hover:bg-gray-50 transition-all"
                >
                  Cancel
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleConfirmAccept}
                  disabled={processing}
                  className="flex-1 py-3 rounded-2xl text-sm font-bold text-white flex items-center justify-center bg-gradient-to-r from-purple-400 to-purple-300 hover:from-purple-500 hover:to-purple-400 shadow-lg shadow-purple-200 transition-all"
                >
                  {processing ? <Loader2 className="animate-spin w-5 h-5" /> : "Yes, Accept"}
                </motion.button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {notification.show && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setNotification({ show: false, message: "" })}
              className="absolute inset-0 bg-purple-950/20 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative bg-white w-full max-w-sm rounded-3xl shadow-2xl shadow-purple-200/50 p-6 text-center border border-purple-100 z-10"
            >
              <p className="text-base font-semibold text-gray-800 mb-6">{notification.message}</p>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setNotification({ show: false, message: "" })}
                className="w-full py-3 rounded-2xl text-sm font-bold text-white bg-gradient-to-r from-purple-400 to-purple-300 hover:from-purple-500 hover:to-purple-400 shadow-lg shadow-purple-200 transition-all"
              >
                OK
              </motion.button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <div className="relative z-10 max-w-[95%] mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative w-full rounded-3xl bg-gradient-to-br from-purple-100 via-purple-50 to-white p-8 md:p-6 shadow-lg shadow-purple-100 border border-purple-100 overflow-hidden"
        >
          <div className="absolute -right-10 -top-10 w-48 h-48 bg-purple-300/20 rounded-full blur-2xl pointer-events-none" />

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
            <div className="space-y-2">
              <div className="bg-purple-200/50 border border-purple-200 px-3 py-1 rounded-lg backdrop-blur-md inline-flex items-center gap-2">
                <ShoppingBag size={16} className="text-purple-600" />
                <span className="text-purple-700 text-xs font-extrabold tracking-wider uppercase">
                  Sales Center
                </span>
              </div>
              <h1 className="text-3xl md:text-4xl font-extrabold text-purple-900 tracking-wide">
                Order Management
              </h1>
              <p className="text-purple-500 text-base font-medium">
                Track, accept, and manage customer orders
              </p>
            </div>

            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 px-6 py-3.5 bg-white hover:bg-purple-100 text-purple-700 border border-purple-100 backdrop-blur-md rounded-2xl transition-all duration-300 font-bold text-sm shadow-md hover:shadow-xl group self-start md:self-auto"
            >
              <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              Back
            </motion.button>
          </div>
        </motion.div>

        <div className="flex flex-wrap gap-2.5 mt-8">
          {[
            "All orders",
            "New Orders",
            "Pending Orders",
            "Confirmed Orders",
            "Cancelled Orders",
          ].map((tab) => {
            const isActive = activeTab === tab;
            return (
              <motion.button
                key={tab}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2.5 rounded-2xl font-bold text-xs md:text-sm transition-all duration-300 border ${
                  isActive
                    ? "bg-gradient-to-r from-purple-400 to-purple-300 text-white border-purple-300 shadow-md shadow-purple-200"
                    : "bg-white/80 hover:bg-purple-50 text-gray-700 hover:text-purple-600 border-purple-100 hover:border-purple-200"
                }`}
              >
                {tab}
              </motion.button>
            );
          })}
        </div>

        <div className="mt-8">
          {loading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="animate-spin text-purple-400 w-10 h-10" />
            </div>
          ) : orders.length === 0 ? (
            <div className="bg-white/70 backdrop-blur-md border border-purple-100 rounded-3xl p-12 text-center text-gray-500 font-semibold shadow-sm">
              No orders found in this category.
            </div>
          ) : (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="space-y-5"
            >
              {orders.map((order) => (
                <motion.div
                  key={order.order_id}
                  variants={itemVariants}
                  className="bg-white/80 backdrop-blur-md border border-purple-100 rounded-3xl p-6 shadow-sm hover:shadow-xl hover:shadow-purple-100 hover:border-purple-200 transition-all duration-300"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-purple-50">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-2xl bg-purple-50 flex items-center justify-center text-purple-600 font-bold border border-purple-100">
                        {order.buyer?.name ? order.buyer.name.charAt(0).toUpperCase() : "C"}
                      </div>
                      <div>
                        <p className="font-extrabold text-gray-900 text-sm md:text-base">
                          {order.buyer?.name || "Customer"}
                        </p>
                        <p className="text-xs text-gray-500 font-medium">
                          {order.buyer?.mobile || "No Mobile"}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-xs text-gray-400 block font-medium">Order Date</span>
                      <span className="text-xs font-bold text-gray-700">{order.order_date}</span>
                    </div>
                  </div>

                  <p className="text-xs text-gray-500 mt-3 font-medium bg-purple-50/60 p-2.5 rounded-xl border border-purple-100/50">
                    <strong className="text-gray-700">Address: </strong>
                    {order.buyer?.address || order.address}
                  </p>

                  {order.items?.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex flex-col sm:flex-row gap-5 mt-5 pt-4 border-t border-purple-50 first:border-t-0 first:pt-0"
                    >
                      <img
                        src={item.image}
                        alt=""
                        className="w-24 h-28 object-cover rounded-2xl border border-purple-100 shadow-sm"
                      />
                      <div className="flex flex-col justify-center text-xs md:text-sm flex-1 space-y-1">
                        <p className="text-xs font-bold text-gray-400">
                          Order ID: <span className="text-gray-800">#{order.order_id}</span>
                        </p>
                        <p className="font-extrabold text-purple-700 text-base">
                          {item.product_name}
                        </p>
                        <p className="text-gray-500 font-medium">
                          Size: <span className="text-gray-800 font-bold">{item.variant?.size || "N/A"}</span> | Color: <span className="text-gray-800 font-bold">{item.variant?.color || "N/A"}</span>
                        </p>
                      </div>

                      <div className="sm:ml-auto flex flex-col justify-center gap-3 sm:items-end">
                        <span className="bg-gradient-to-r from-purple-400 to-purple-300 text-white px-5 py-2 rounded-2xl font-black text-base shadow-md shadow-purple-200">
                          ₹{order.total_amount}
                        </span>
                        <p className="text-xs text-gray-500 font-bold">
                          Payment: <span className="text-purple-600">{order.payment_method || "COD"}</span>
                        </p>

                        {(order.status === "pending" || order.order_status === "pending") && (
                          <div className="flex gap-2.5 mt-2">
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              disabled={processing}
                              onClick={() => handleOpenRejectModal(order.order_id)}
                              className="px-5 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs transition-all duration-300 border border-gray-200"
                            >
                              Reject
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              disabled={processing}
                              onClick={() => handleAccept(order.order_id)}
                              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-400 to-purple-300 hover:from-purple-500 hover:to-purple-400 text-white font-bold text-xs shadow-md shadow-purple-200 transition-all duration-300"
                            >
                              Accept
                            </motion.button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}