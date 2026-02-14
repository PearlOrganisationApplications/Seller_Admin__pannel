"use client";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, Loader2 } from "lucide-react";
import {
  fetchAllOrders,
  fetchNewOrders,
  fetchPendingOrders,
  fetchConfirmedOrders,
  fetchCancelledOrders,
  processOrderAction
} from "../api/orderApi";

export default function OrderManagement() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [activeTab, setActiveTab] = useState("All orders");

  const reasons = [
    "Out of stock", "Price changed", "Product discontinued",
    "Can ship to customer’s location", "Damaged product in inventory",
    "Incorrect product listing", "Minimum order quantity not met",
    "Payment issue (COD not accepted)", "Delay in restocking", "Other reason",
  ];

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedReason, setSelectedReason] = useState("");
  const [rejectingOrderId, setRejectingOrderId] = useState(null);

  const loadData = async (tab) => {
    setLoading(true);
    try {
      let data;
      // Switching APIs based on tab
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
      alert(err.message); // Show error from try-catch
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData(activeTab);
  }, [activeTab]);

  const handleAccept = async (orderId) => {
    if (!window.confirm("Are you sure you want to accept this order?")) return;
    setProcessing(true);
    try {
      const res = await processOrderAction({ order_id: orderId, action: "accept" });
      if (res.success) {
        alert("Order accepted successfully!");
        loadData(activeTab);
      }
    } catch (error) {
      alert(error.message);
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
        reason: selectedReason
      });
      if (res.success) {
        alert("Order rejected successfully!");
        setIsModalOpen(false);
        setSelectedReason("");
        loadData(activeTab);
      }
    } catch (error) {
      alert(error.message);
    } finally {
      setProcessing(false);
    }
  };

  const handleOpenRejectModal = (id) => {
    setRejectingOrderId(id);
    setIsModalOpen(true);
  };

  return (
    <div className={`w-full min-h-screen bg-white ${isModalOpen ? "overflow-hidden" : ""}`}>

      {/* REJECT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black bg-opacity-40 p-4">
          <div className="bg-white w-full max-w-md rounded-sm shadow-2xl relative p-6">
            <h2 className="text-2xl font-serif text-gray-800">Reject Order</h2>
            <div className="w-full h-px bg-gray-300 mt-2 mb-4" />
            <p className="text-sm text-gray-600 mb-6">Reason for rejecting order</p>
            <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
              {reasons.map((reason, index) => (
                <label key={index} className="flex items-center gap-4 cursor-pointer group">
                  <input
                    type="radio"
                    name="rejectReason"
                    className="w-5 h-5 accent-blue-600"
                    checked={selectedReason === reason}
                    onChange={() => setSelectedReason(reason)}
                  />
                  <span className="text-sm text-gray-700 font-medium">{reason}</span>
                </label>
              ))}
            </div>
            <div className="mt-8 flex gap-3">
              <button onClick={() => setIsModalOpen(false)} disabled={processing} className="flex-1 py-2 border rounded-md text-sm">Cancel</button>
              <button
                onClick={handleConfirmReject}
                disabled={!selectedReason || processing}
                className={`flex-1 py-2 rounded-md text-sm text-white flex items-center justify-center ${selectedReason && !processing ? "bg-red-600" : "bg-gray-400"}`}
              >
                {processing ? <Loader2 className="animate-spin w-4 h-4" /> : "Submit Rejection"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TOP BAR */}
      <div className="w-full flex flex-col sm:flex-row flex-wrap gap-3 px-3 sm:px-6 py-4 shadow-sm border-b">
        <div className="flex flex-wrap items-center gap-2">
          <button onClick={() => navigate(-1)} className="flex items-center px-3 py-2 bg-blue-500 text-white rounded">
            <ChevronLeft className="w-4 h-4 mr-1" /> Back
          </button>
          <h1 className="text-lg font-semibold">Order Management</h1>
        </div>
      </div>

      {/* TABS (Added Pending Orders) */}
      <div className="flex flex-wrap gap-2 px-3 sm:px-6 mt-4">
        {["All orders", "New Orders", "Pending Orders", "Confirmed Orders", "Cancelled Orders"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-3 py-1 border rounded-md text-xs sm:text-sm ${activeTab === tab ? "bg-[#0972f6] text-white" : "bg-white text-black"
              }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* ORDER LIST */}
      <div className="mt-6 px-3 sm:px-6">
        {loading ? (
          <div className="flex justify-center py-20"><Loader2 className="animate-spin text-blue-500 w-10 h-10" /></div>
        ) : orders.length === 0 ? (
          <div className="text-center py-20 text-gray-500">No orders found in this category.</div>
        ) : (
          orders.map((order) => (
            <div key={order.order_id} className="border rounded-xl p-4 mb-6 shadow-sm bg-white">
              <div className="flex flex-wrap gap-3 items-center text-xs sm:text-sm">
                <p className="font-semibold">{order.buyer?.name || "Customer"}</p>
                <p className="text-gray-600">{order.buyer?.mobile || "No Mobile"}</p>
                <p className="text-gray-600">{order.order_date}</p>
              </div>
              <p className="text-xs sm:text-sm text-gray-600 mt-1">{order.buyer?.address || order.address}</p>

              {order.items?.map((item, idx) => (
                <div key={idx} className="flex flex-col sm:flex-row gap-4 mt-4 w-full border-t pt-4 first:border-t-0 first:pt-0">
                  <img src={item.image} alt="" className="w-24 h-28 object-cover rounded-md border" />
                  <div className="flex flex-col text-xs sm:text-sm flex-1">
                    <p><strong>Order Id - </strong>{order.order_id}</p>
                    <p className="font-medium text-blue-600">{item.product_name}</p>
                    <p>Size - {item.variant?.size || "N/A"} | Color - {item.variant?.color || "N/A"}</p>
                  </div>

                  <div className="sm:ml-auto flex flex-col gap-3 sm:items-end">
                    <span className="bg-green-500 text-white px-4 py-1 rounded-md font-semibold text-sm">₹{order.total_amount}</span>
                    <p className="text-xs text-gray-600">Method: {order.payment_method || "COD"}</p>

                    {/* Buttons for Pending/New */}
                    {(order.status === "pending" || order.order_status === "pending") && (
                      <div className="flex gap-2">
                        <button
                          disabled={processing}
                          onClick={() => handleOpenRejectModal(order.order_id)}
                          className="px-4 py-2 rounded-md bg-gray-200 text-sm"
                        >
                          Reject
                        </button>
                        <button
                          disabled={processing}
                          onClick={() => handleAccept(order.order_id)}
                          className="px-4 py-2 rounded-md bg-[#0047ab] text-white text-sm"
                        >
                          Accept
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ))
        )}
      </div>
    </div>
  );
}