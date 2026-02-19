import React, { useEffect, useState } from "react";
import { getNotifications } from "../api/getNotificationApi";
import { Bell, Clock, Trash2 } from "lucide-react";
import toast from "react-hot-toast";

export default function Notifications() {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const data = await getNotifications();
            // Assuming API returns { status: true, notifications: [...] } 
            // Adjust "data.notifications" based on your actual API response structure
            setNotifications(data.notifications || data.data || []);
        } catch (error) {
            toast.error("Failed to load notifications");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                    <Bell className="text-blue-600" /> Notifications
                </h1>
                <button
                    onClick={fetchData}
                    className="text-sm bg-blue-50 text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-100 transition-colors"
                >
                    Refresh
                </button>
            </div>

            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                </div>
            ) : notifications.length === 0 ? (
                <div className="bg-white rounded-xl shadow-sm p-10 text-center border border-gray-100">
                    <p className="text-gray-500">No notifications found.</p>
                </div>
            ) : (
                <div className="grid gap-4">
                    {notifications.map((item, index) => (
                        <div
                            key={item._id || index}
                            className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow flex justify-between items-start"
                        >
                            <div className="flex gap-4">
                                <div className="bg-blue-100 p-3 rounded-full h-fit">
                                    <Bell size={20} className="text-blue-600" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-900 text-lg">
                                        {item.title || "New Notification"}
                                    </h3>
                                    <p className="text-gray-600 mt-1">{item.message}</p>
                                    <div className="flex items-center gap-2 mt-3 text-xs text-gray-400">
                                        <Clock size={14} />
                                        {new Date(item.createdAt).toLocaleString()}
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