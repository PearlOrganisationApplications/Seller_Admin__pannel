import { useEffect, useState } from "react";
import { getAllRatings, deleteRating, updateRating } from "../api/ratingApi";
import toast from "react-hot-toast";
import { FaTrash, FaEdit, FaStar } from "react-icons/fa";

export default function Rating() {
    const [ratings, setRatings] = useState([]);
    const [loading, setLoading] = useState(true);

    // States for Edit Modal
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editData, setEditData] = useState({ id: null, rating: 5, comment: "" });

    const fetchRatings = async () => {
        setLoading(true);
        try {
            const res = await getAllRatings();
            if (res.status) setRatings(res.data);
        } catch (err) {
            toast.error("Failed to load ratings");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchRatings(); }, []);

    const handleDelete = (id) => {
        // Use a custom toast for confirmation instead of window.confirm
        toast((t) => (
            <div style={{ textAlign: 'center' }}>
                <p style={{ marginBottom: '12px', fontSize: '15px' }}>
                    Are you sure you want to delete this rating?
                </p>
                <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                    {/* CONFIRM BUTTON */}
                    <button
                        onClick={async () => {
                            toast.dismiss(t.id); // Remove the confirmation toast
                            const loadingId = toast.loading("Deleting rating...");
                            try {
                                const res = await deleteRating(id);
                                if (res.status) {
                                    toast.success("Rating deleted successfully", { id: loadingId });
                                    setRatings((prev) => prev.filter((r) => r.id !== id));
                                } else {
                                    toast.error(res.message || "Failed to delete", { id: loadingId });
                                }
                            } catch (err) {
                                toast.error("An error occurred", { id: loadingId });
                            }
                        }}
                        style={{
                            background: '#ef4444', // Red color
                            color: '#fff',
                            border: 'none',
                            padding: '6px 16px',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            fontWeight: '600'
                        }}
                    >
                        Delete
                    </button>

                    {/* CANCEL BUTTON */}
                    <button
                        onClick={() => toast.dismiss(t.id)}
                        style={{
                            background: '#475569', // Gray color
                            color: '#fff',
                            border: 'none',
                            padding: '6px 16px',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            fontWeight: '600'
                        }}
                    >
                        Cancel
                    </button>
                </div>
            </div>
        ), {
            duration: 6000, // Give user time to read
            position: 'top-center',
        });
    };
    const handleEditClick = (item) => {
        setEditData({ id: item.id, rating: item.rating, comment: item.comment });
        setIsModalOpen(true);
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        const tid = toast.loading("Updating...");
        try {
            const res = await updateRating(editData.id, {
                rating: editData.rating,
                comment: editData.comment
            });
            if (res.status) {
                toast.success("Updated successfully", { id: tid });
                setIsModalOpen(false);
                fetchRatings(); // Refresh list
            }
        } catch (err) {
            toast.error("Update failed", { id: tid });
        }
    };

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">Rating Management</h2>

            {loading ? <p>Loading...</p> : (
                <div className="table-responsive bg-white rounded shadow">
                    <table className="sellers-table w-full">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Seller</th>
                                <th>Rating</th>
                                <th>Comment</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {ratings.map((r) => (
                                <tr key={r.id}>
                                    <td>{r.id}</td>
                                    <td>{r.seller?.name || "N/A"}</td>
                                    <td className="text-yellow-500 font-bold">
                                        {r.rating} <FaStar className="inline mb-1" />
                                    </td>
                                    <td>{r.comment}</td>
                                    <td>
                                        <button onClick={() => handleEditClick(r)} className="btn view mr-2"><FaEdit /></button>
                                        <button onClick={() => handleDelete(r.id)} className="btn delete"><FaTrash /></button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* EDIT MODAL */}
            {isModalOpen && (
                <div className="modal-overlay fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg w-96 shadow-xl">
                        <h3 className="text-lg font-bold mb-4">Edit Rating</h3>
                        <form onSubmit={handleUpdate}>
                            <div className="mb-4">
                                <label className="block mb-1">Rating (1-5)</label>
                                <input
                                    type="number" min="1" max="5" required
                                    className="w-full border p-2 rounded"
                                    value={editData.rating}
                                    onChange={(e) => setEditData({ ...editData, rating: e.target.value })}
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block mb-1">Comment</label>
                                <textarea
                                    required className="w-full border p-2 rounded"
                                    value={editData.comment}
                                    onChange={(e) => setEditData({ ...editData, comment: e.target.value })}
                                />
                            </div>
                            <div className="flex justify-end gap-2">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="btn view">Cancel</button>
                                <button type="submit" className="btn delete" style={{ backgroundColor: '#1e293b' }}>Save</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}