"use client";

import React, { useEffect, useState } from "react";
import {
  ArrowLeft,
  BellRing,
  ChevronLeft,
  ChevronRight,
  Clock,
  Info,
  ShoppingBag,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getNotifications } from "../api/notification";

const PAGE_SIZE = 10;

export default function SellerNotifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    const loadData = async () => {
      try {
        const res = await getNotifications();

        if (res.success && Array.isArray(res.data)) {
          const filtered = res.data.filter(
            (n) =>
              !n.send_to ||
              n.send_to === "seller" ||
              n.send_to === "all"
          );

          setNotifications(filtered);
          setCurrentPage(1);
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

    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // ---------- Pagination logic ----------
  const totalItems = notifications.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / PAGE_SIZE));
  const safePage = Math.min(currentPage, totalPages);

  const startIndex = (safePage - 1) * PAGE_SIZE;
  const endIndex = Math.min(startIndex + PAGE_SIZE, totalItems);
  const paginatedNotifications = notifications.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages || page === safePage) return;
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const getPageNumbers = () => {
    const pages = [];

    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
      return pages;
    }

    pages.push(1);

    const start = Math.max(2, safePage - 1);
    const end = Math.min(totalPages - 1, safePage + 1);

    if (start > 2) pages.push("...");

    for (let i = start; i <= end; i++) pages.push(i);

    if (end < totalPages - 1) pages.push("...");

    pages.push(totalPages);

    return pages;
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] p-4 md:p-8">

      {/* Header */}
      <div className="max-w-full mx-auto flex items-center gap-4 mb-8">
        <button
          onClick={() => navigate(-1)}
          className="p-2 hover:bg-white bg-white/50 rounded-full transition-all shadow-sm border border-gray-200 group"
        >
          <ArrowLeft className="h-5 w-5 text-gray-600 group-hover:text-blue-600" />
        </button>

        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Notifications
          </h1>

          <p className="text-sm text-gray-500">
            Updates and alerts for your shop
          </p>
        </div>
      </div>

      {/* Loading */}
      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-600"></div>
        </div>
      ) : notifications.length === 0 ? (
        /* Empty State */
        <div className="max-w-full mx-auto text-center py-20 bg-white rounded-3xl border border-gray-100 shadow-sm">
          <div className="bg-gray-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
            <BellRing className="h-10 w-10 text-gray-300" />
          </div>

          <h3 className="text-lg font-semibold text-gray-700">
            No Notifications
          </h3>

          <p className="text-gray-400 max-w-xs mx-auto">
            We'll let you know when something important happens.
          </p>
        </div>
      ) : (
        <>
          {/* Notifications List */}
          <div className="max-w-full mx-auto space-y-4">
            {paginatedNotifications.map((item) => {
              const orderId = item.data?.order_id;

              return (
                <div
                  key={item.id}
                  className={`p-5 rounded-2xl shadow-sm border transition-all cursor-default ${
                    !item.is_read
                      ? "border-l-4 border-l-blue-500 border-gray-100 bg-blue-50/30"
                      : "border-gray-100 bg-white"
                  } hover:shadow-md`}
                >
                  <div className="flex gap-5">

                    {/* Image / Icon */}
                    <div className="shrink-0">
                      {item.image_url ? (
                        <img
                          src={item.image_url}
                          alt="Thumbnail"
                          className="h-14 w-14 rounded-xl object-cover border border-gray-50 shadow-sm"
                        />
                      ) : (
                        <div
                          className={`h-14 w-14 rounded-xl flex items-center justify-center ${
                            orderId
                              ? "bg-green-50 text-green-500"
                              : "bg-blue-50 text-blue-500"
                          }`}
                        >
                          {orderId ? (
                            <ShoppingBag size={24} />
                          ) : (
                            <Info size={24} />
                          )}
                        </div>
                      )}
                    </div>

                    {/* Text Content */}
                    <div className="flex-1 min-w-0">

                      {/* Title + Date */}
                      <div className="flex justify-between items-start mb-1">
                        <h3 className="font-bold text-gray-800 text-base truncate pr-4">
                          {item.title || "New Notification"}

                          {!item.is_read && (
                            <span className="ml-2 inline-block h-2 w-2 bg-blue-500 rounded-full"></span>
                          )}
                        </h3>

                        <div className="flex items-center text-[11px] font-medium text-gray-400 whitespace-nowrap">
                          <Clock className="h-3 w-3 mr-1" />
                          {formatDate(item.created_at)}
                        </div>
                      </div>

                      {/* Body */}
                      <p className="text-sm text-gray-500 leading-relaxed mb-3">
                        {item.body}
                      </p>

                      {/* Type */}
                      <span className="inline-block mb-3 px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-600 capitalize">
                        {item.type || "System"}
                      </span>

                      {/* Meta Footer */}
                      <div className="flex items-center gap-3">

                        {/* Order ID */}
                        {orderId && (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-green-50 text-green-600 border border-green-100">
                            Order: {orderId}
                          </span>
                        )}

                        {/* Notification Type */}
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${
                            item.type === "image"
                              ? "bg-purple-50 text-purple-600 border-purple-100"
                              : "bg-blue-50 text-blue-600 border-blue-100"
                          }`}
                        >
                          {item.type || "System"}
                        </span>
                      </div>

                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="max-w-full mx-auto mt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-sm text-gray-500">
                Showing{" "}
                <span className="font-semibold text-gray-700">
                  {startIndex + 1}–{endIndex}
                </span>{" "}
                of{" "}
                <span className="font-semibold text-gray-700">
                  {totalItems}
                </span>{" "}
                notifications
              </p>

              <div className="flex items-center gap-1.5">
                {/* Previous */}
                <button
                  onClick={() => handlePageChange(safePage - 1)}
                  disabled={safePage === 1}
                  aria-label="Previous page"
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-600 transition hover:border-blue-300 hover:bg-blue-50 hover:text-blue-600 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-gray-200 disabled:hover:bg-white disabled:hover:text-gray-600"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>

                {/* Page numbers */}
                {getPageNumbers().map((page, index) =>
                  page === "..." ? (
                    <span
                      key={`dots-${index}`}
                      className="flex h-9 w-9 items-center justify-center text-gray-400"
                    >
                      …
                    </span>
                  ) : (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      aria-current={page === safePage ? "page" : undefined}
                      className={`flex h-9 min-w-[2.25rem] items-center justify-center rounded-lg border px-2 text-sm font-medium transition ${
                        page === safePage
                          ? "border-blue-600 bg-blue-600 text-white shadow-sm"
                          : "border-gray-200 bg-white text-gray-600 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-600"
                      }`}
                    >
                      {page}
                    </button>
                  )
                )}

                {/* Next */}
                <button
                  onClick={() => handlePageChange(safePage + 1)}
                  disabled={safePage === totalPages}
                  aria-label="Next page"
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-600 transition hover:border-blue-300 hover:bg-blue-50 hover:text-blue-600 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-gray-200 disabled:hover:bg-white disabled:hover:text-gray-600"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}