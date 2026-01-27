import React, { useState, useEffect } from 'react';
import { ChevronLeft, Star, Loader2, AlertCircle, Trash2 } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { getReviewDetail, deleteReview } from '../api/ratingDetailApi';

const Header = ({ title }) => {
  const navigate = useNavigate();
  return (
    <div className="flex items-center gap-3 p-4 bg-white sticky top-0 z-10 border-b border-gray-50">
      <button onClick={() => navigate(-1)} className="p-1 hover:bg-gray-100 rounded-full">
        <ChevronLeft className="w-6 h-6" />
      </button>
      <h1 className="text-lg font-bold text-gray-800">{title}</h1>
    </div>
  );
};

const ReviewCard = ({ review, onDelete }) => (
  <div className="bg-white border border-gray-100 rounded-2xl p-4 mb-4 shadow-sm">
    <div className="flex justify-between items-start">
      <div className="flex gap-1 text-yellow-400 mb-2">
        {[...Array(5)].map((_, i) => (
          <Star 
            key={i} 
            size={10} 
            fill={i < review.rating ? "currentColor" : "none"} 
            className={i < review.rating ? "" : "text-gray-200"} 
          />
        ))}
      </div>
      <span className="text-[10px] font-bold text-gray-400">
        {review.commented_at ? new Date(review.commented_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : ''}
      </span>
    </div>
    <div className="flex gap-4 mt-1">
      <img 
        src={`https://ui-avatars.com/api/?name=${review.user_name}&background=random`} 
        alt="user" 
        className="w-10 h-10 rounded-full object-cover border border-gray-100" 
      />
      <div className="flex-1">
        <h4 className="text-xs font-bold text-gray-900 mb-1">{review.user_name}</h4>
        <p className="text-xs text-gray-600 leading-relaxed italic">
          "{review.comment}"
        </p>
        <div className="flex justify-end mt-2">
          <button 
            onClick={() => onDelete(review.id)}
            className="flex items-center gap-1 text-[10px] font-black text-red-500 uppercase tracking-widest hover:bg-red-50 px-2 py-1 rounded-lg transition-colors"
          >
            <Trash2 size={12} /> Delete
          </button>
        </div>
      </div>
    </div>
  </div>
);

export default function ReviewRatingDetail() {
  const { id } = useParams(); // Product ID from URL
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (id) fetchDetails();
  }, [id]);

  const fetchDetails = async () => {
    try {
      setLoading(true);
      const res = await getReviewDetail(id); 
      if (res.success) {
        setData(res.data); 
      } else {
        setError("Product reviews not found.");
      }
    } catch (err) {
      setError("Failed to load product details.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (reviewId) => {
    if (window.confirm("Are you sure you want to delete this review?")) {
      try {
        // Pass both Product ID (id) and Review ID (reviewId) to match the new URL structure
        const res = await deleteReview(id, reviewId);
        if (res.success) {
          fetchDetails(); // Refresh list
        } else {
          alert(res.message || "Could not delete review.");
        }
      } catch (err) {
        alert("Error deleting review. Make sure you have permission.");
      }
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <Loader2 className="animate-spin text-purple-600" size={32} />
    </div>
  );

  if (error) return (
    <div className="p-10 text-center">
      <AlertCircle className="mx-auto text-red-400 mb-2" size={40} />
      <p className="text-gray-500 font-bold">{error}</p>
      <button onClick={() => window.location.reload()} className="mt-4 text-purple-600 text-sm font-bold underline">Retry</button>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#FAFAFA] max-w-md mx-auto relative pb-20">
      <Header title="Product Reviews" />
      
      {/* Product Summary */}
      <div className="px-4 py-6 bg-white border-b border-gray-100 mb-6">
        <div className="flex gap-5 items-start">
           <div className="w-24 h-24 rounded-2xl overflow-hidden border border-gray-100 shadow-sm bg-gray-50">
             <img src={data?.image} alt="product" className="w-full h-full object-cover" />
           </div>
           <div className="flex-1">
            <h3 className="font-black text-gray-900 text-base leading-tight">{data?.product_name}</h3>
            <div className="flex items-center gap-2 mt-2">
              <span className="text-lg font-black text-green-600">₹{data?.price}</span>
              <span className="text-xs font-bold bg-green-50 text-green-700 px-2 py-0.5 rounded-lg">{data?.discount} OFF</span>
            </div>
            
            <div className="flex items-center gap-2 mt-3 bg-gray-50 w-fit px-3 py-1.5 rounded-xl">
              <span className="text-sm font-black text-gray-800">{data?.average_rating}.0</span>
              <div className="flex text-yellow-400">
                {[...Array(5)].map((_, i) => (
                   <Star 
                    key={i} 
                    size={12} 
                    fill={i < data?.average_rating ? "currentColor" : "none"} 
                    className={i < data?.average_rating ? "" : "text-gray-200"} 
                  />
                ))}
              </div>
              <span className="text-[10px] font-bold text-gray-400">({data?.ratings?.length || 0} Total)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Reviews List */}
      <div className="px-4">
        <h2 className="text-xs font-black uppercase tracking-widest text-gray-400 mb-4 ml-1">Customer Reviews</h2>
        {data?.ratings && data.ratings.length > 0 ? (
          data.ratings.map((review) => (
            <ReviewCard 
              key={review.id} 
              review={review} 
              onDelete={handleDelete} 
            />
          ))
        ) : (
          <div className="bg-white rounded-2xl p-8 text-center border border-dashed border-gray-200">
            <p className="text-gray-400 text-sm font-medium">No reviews yet.</p>
          </div>
        )}
      </div>

      <button className="fixed bottom-6 right-6 w-14 h-14 bg-black text-white rounded-full shadow-2xl flex items-center justify-center active:scale-95 transition-transform">
        <Star size={24} />
      </button>
    </div>
  );
}