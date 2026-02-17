"use client";
import React, { useEffect, useState } from "react";
import { ArrowLeft, BellRing, Clock, ImageIcon, Info, ShoppingBag } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getNotifications } from "../api/notification";

export default function SellerNotifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadData = async () => {
      try {
        const res = await getNotifications();
        if (res.success && Array.isArray(res.data)) {
          // Logic: Show notifications if:
          // 1. send_to is 'seller' or 'all'
          // 2. OR it's a direct order notification (no send_to field present)
          const filtered = res.data.filter(
            (n) => !n.send_to || n.send_to === "seller" || n.send_to === "all"
          );
          setNotifications(filtered);
        }
      } catch (err) {
        console.error("Failed to load notifications", err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return "Just now";
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] p-4 md:p-8">
      {/* Header */}
      <div className="max-w-4xl mx-auto flex items-center gap-4 mb-8">
        <button
          onClick={() => navigate(-1)}
          className="p-2 hover:bg-white bg-white/50 rounded-full transition-all shadow-sm border border-gray-200 group"
        >
          <ArrowLeft className="h-5 w-5 text-gray-600 group-hover:text-blue-600" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
          <p className="text-sm text-gray-500">Updates and alerts for your shop</p>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-600"></div>
        </div>
      ) : notifications.length === 0 ? (
        <div className="max-w-4xl mx-auto text-center py-20 bg-white rounded-3xl border border-gray-100 shadow-sm">
          <div className="bg-gray-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
            <BellRing className="h-10 w-10 text-gray-300" />
          </div>
          <h3 className="text-lg font-semibold text-gray-700">No Notifications</h3>
          <p className="text-gray-400 max-w-xs mx-auto">We'll let you know when something important happens.</p>
        </div>
      ) : (
        <div className="max-w-4xl mx-auto space-y-4">
          {notifications.map((item) => (
            <div
              key={item.id}
              className={`bg-white p-5 rounded-2xl shadow-sm border transition-all cursor-default ${item.read_at === null ? 'border-l-4 border-l-blue-500 border-gray-100' : 'border-gray-100'
                } hover:shadow-md`}
            >
              <div className="flex gap-5">
                {/* Visual Icon/Image */}
                <div className="shrink-0">
                  {item.image_url ? (
                    <img
                      src={item.image_url}
                      alt="Thumbnail"
                      className="h-14 w-14 rounded-xl object-cover border border-gray-50 shadow-sm"
                    />
                  ) : (
                    <div className={`h-14 w-14 rounded-xl flex items-center justify-center ${item.order_id ? 'bg-green-50 text-green-500' : 'bg-blue-50 text-blue-500'
                      }`}>
                      {item.order_id ? <ShoppingBag size={24} /> : <Info size={24} />}
                    </div>
                  )}
                </div>

                {/* Text Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="font-bold text-gray-800 text-base truncate pr-4">
                      {item.title}
                      {item.read_at === null && <span className="ml-2 inline-block h-2 w-2 bg-blue-500 rounded-full"></span>}
                    </h3>
                    <div className="flex items-center text-[11px] font-medium text-gray-400 whitespace-nowrap">
                      <Clock className="h-3 w-3 mr-1" />
                      {formatDate(item.created_at)}
                    </div>
                  </div>
                  <p className="text-sm text-gray-500 leading-relaxed mb-3">
                    {item.body}
                  </p>

                  {/* Meta Footer */}
                  <div className="flex items-center gap-3">
                    {item.order_id && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-green-50 text-green-600 border border-green-100">
                        Order: {item.order_id}
                      </span>
                    )}
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${item.type === 'image'
                        ? 'bg-purple-50 text-purple-600 border-purple-100'
                        : 'bg-blue-50 text-blue-600 border-blue-100'
                      }`}>
                      {item.type || 'System'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}