import React from 'react';
import { ChevronLeft, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Header = ({ title }) => {
  const navigate = useNavigate();
  return (
    <div className="flex items-center gap-3 p-4 bg-white sticky top-0 z-10">
      <button onClick={() => navigate(-1)} className="p-1">
        <ChevronLeft className="w-6 h-6" />
      </button>
      <h1 className="text-lg font-semibold">{title}</h1>
    </div>
  );
};

const FAB = () => (
  <button className="fixed bottom-6 right-6 w-14 h-14 bg-white rounded-full shadow-2xl flex items-center justify-center border border-gray-100">
    <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center">
      <div className="w-4 h-4 border-2 border-white rounded-sm rotate-45" />
    </div>
  </button>
);

const ReviewCard = () => (
  <div className="bg-white border border-gray-200 rounded-xl p-4 mb-3">
    <div className="flex justify-end">
      <span className="text-xs font-semibold text-gray-900">15 Sept 2025</span>
    </div>
    <div className="flex gap-4 mt-1">
      <img 
        src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100" 
        alt="user" 
        className="w-12 h-12 rounded-full object-cover" 
      />
      <div className="flex-1">
        <p className="text-xs text-gray-600 leading-relaxed">
          Reliable and secure, I trust them completely. Fast response whenever I needed help. Simple process, no hidden charges.
        </p>
        <div className="flex justify-end mt-2">
          <button className="text-xs font-bold text-gray-900 hover:underline">Delete</button>
        </div>
      </div>
    </div>
  </div>
);

export default function ReviewRatingDetail() {
  return (
    <div className="min-h-screen bg-white max-w-md mx-auto relative pb-20">
      <Header title="Review & Rating" />
      
      <div className="px-4 mb-6">
        <div className="flex gap-4 items-start">
           <img src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200" alt="product" className="w-24 h-24 rounded-lg object-cover" />
           <div className="flex-1">
            <h3 className="font-bold text-gray-900">Realme Buds Wireless</h3>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs text-gray-400 line-through">₹1299</span>
              <span className="text-sm font-bold text-green-600">₹999</span>
              <span className="text-xs text-gray-500">35%</span>
            </div>
            <p className="text-[10px] text-gray-500">Masala deal</p>
            <div className="flex items-center gap-1 mt-1">
              <span className="text-xs font-bold">4.0</span>
              <div className="flex text-yellow-400">
                {[...Array(4)].map((_, i) => <Star key={i} size={10} fill="currentColor" />)}
              </div>
              <span className="text-[10px] text-gray-400">(21447)</span>
            </div>
          </div>
        </div>
      </div>

      <div className="px-4">
        {[...Array(3)].map((_, i) => (
          <ReviewCard key={i} />
        ))}
      </div>

      <FAB />
    </div>
  );
}