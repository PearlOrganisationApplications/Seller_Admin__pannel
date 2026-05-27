import React, { useState, useEffect } from "react";
import {
  ChevronLeft,
  ChevronDown,
  Star,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getSellerRatings } from "../api/ratingListApi";

const Header = ({ title }) => {
  const navigate = useNavigate();
  return (
    <div className="flex items-center gap-3 p-4 bg-white sticky top-0 z-10 border-b border-gray-50">
      <button
        onClick={() => navigate(-1)}
        className="p-1 hover:bg-gray-100 rounded-full transition-colors"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
      <h1 className="text-lg font-bold text-gray-800">{title}</h1>
    </div>
  );
};

const FAB = () => (
  <button className="fixed bottom-6 right-6 w-14 h-14 bg-white rounded-full shadow-2xl flex items-center justify-center border border-gray-100 active:scale-95 transition-transform">
    <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center">
      <div className="w-4 h-4 border-2 border-white rounded-sm rotate-45" />
    </div>
  </button>
);

const ProductCard = ({ ratingData, onClick }) => {
  // Mapped to match your API response keys exactly
  const { product_name, image, price, average_rating, discount } = ratingData;

  const renderStars = (rating) => {
    return [...Array(5)].map((_, i) => (
      <Star
        key={i}
        size={12}
        fill={i < Math.floor(rating) ? "#FACC15" : "none"}
        className={i < Math.floor(rating) ? "text-yellow-400" : "text-gray-300"}
      />
    ));
  };

  return (
    <div
      onClick={onClick}
      className="flex gap-4 p-4 bg-white border border-gray-100 rounded-2xl mb-4 cursor-pointer hover:shadow-md transition-shadow"
    >
      <div className="w-24 h-24 bg-gray-50 rounded-xl flex items-center justify-center overflow-hidden border border-gray-50">
        <img
          src={image || "https://via.placeholder.com/150"}
          alt={product_name}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="flex-1 flex flex-col justify-between py-0.5">
        <div>
          <h3 className="font-bold text-gray-900 leading-tight text-sm line-clamp-2">
            {product_name}
          </h3>
          <div className="flex items-center gap-2 mt-1.5">
            <span className="text-sm font-bold text-green-600">₹{price}</span>
            <span className="text-[10px] font-bold bg-green-50 text-green-700 px-1.5 py-0.5 rounded">
              {discount} OFF
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 mt-2">
          <div className="flex items-center bg-gray-50 px-2 py-1 rounded-lg gap-1">
            <span className="text-xs font-black text-gray-800">
              {average_rating}.0
            </span>
            <div className="flex">{renderStars(average_rating)}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function ReviewRatingList() {
  const navigate = useNavigate();
  const [ratings, setRatings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchRatings();
  }, []);

  const fetchRatings = async () => {
    try {
      setLoading(true);
      const response = await getSellerRatings();

      // FIXED: Changed 'response.status' to 'response.success' to match your API
      if (response.success) {
        setRatings(response.data);
      } else {
        setError("Failed to load ratings");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFDFD] w-full relative pb-20">
      {" "}
      {/* ---------- HEADER ---------- */}
      <div className="relative w-full bg-[#0B1E3A] px-4 pt-4 pb-6 rounded-b-[3rem] shadow-2xl overflow-hidden mb-8">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-16 -mt-16 blur-2xl"></div>
        <div className="absolute bottom-0 left-0 w-40 h-40 bg-blue-500/20 rounded-full -ml-10 -mb-10 blur-xl"></div>

        <div className="relative z-10 max-w-7xl mx-auto flex flex-col gap-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className="p-2 bg-white/10 border border-white/20 text-white rounded-full hover:bg-white/20 transition-all"
            >
              <ChevronLeft size={24} />
            </button>
            <div>
              <h1 className="text-3xl font-extrabold text-white tracking-tight">
                Review & Rating
              </h1>
              <p className="text-blue-200 mt-1 text-sm font-medium">
                Manage product feedback and ratings
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <button className="flex items-center gap-2 px-4 py-2 bg-white/10 border border-white/10 rounded-xl text-xs font-bold text-white backdrop-blur-md">
              Category <ChevronDown size={14} />
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-white/10 border border-white/10 rounded-xl text-xs font-bold text-white backdrop-blur-md">
              Brand <ChevronDown size={14} />
            </button>
          </div>
        </div>
      </div>
      <div className="px-4">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="animate-spin text-gray-300 mb-2" size={32} />
            <p className="text-gray-400 text-sm font-medium">
              Loading reviews...
            </p>
          </div>
        ) : error ? (
          <div className="bg-red-50 text-red-600 p-4 rounded-2xl flex items-center gap-3">
            <AlertCircle size={20} />
            <p className="text-sm font-bold">{error}</p>
          </div>
        ) : ratings.length > 0 ? (
          ratings.map((item) => (
            <ProductCard
              key={item.product_id} // Used product_id from API
              ratingData={item}
              onClick={() =>
                navigate(`/seller/reviews/detail/${item.product_id}`)
              }
            />
          ))
        ) : (
          <div className="text-center py-20">
            <p className="text-gray-400">No reviews found yet.</p>
          </div>
        )}
      </div>
      <FAB />
    </div>
  );
}
