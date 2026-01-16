import React from 'react';
import { ChevronLeft, ChevronDown, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Shared Header
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

// Shared Floating Action Button
const FAB = () => (
  <button className="fixed bottom-6 right-6 w-14 h-14 bg-white rounded-full shadow-2xl flex items-center justify-center border border-gray-100">
    <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center">
      <div className="w-4 h-4 border-2 border-white rounded-sm rotate-45" />
    </div>
  </button>
);

const ProductCard = ({ onClick }) => (
  <div 
    onClick={onClick}
    className="flex gap-4 p-3 bg-white border border-gray-200 rounded-xl mb-3 cursor-pointer hover:shadow-sm"
  >
    <div className="w-24 h-24 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
      <img src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200" alt="product" className="object-cover" />
    </div>
    <div className="flex-1">
      <h3 className="font-bold text-gray-900 leading-tight">Realme Buds Wireless</h3>
      <div className="flex items-center gap-2 mt-1">
        <span className="text-xs text-gray-400 line-through">₹1299</span>
        <span className="text-sm font-bold text-green-600">₹999</span>
        <span className="text-xs text-gray-500">35%</span>
      </div>
      <p className="text-[10px] text-gray-500">Masala deal</p>
      <div className="flex items-center gap-1 mt-1">
        <span className="text-xs font-bold text-gray-700">4.0</span>
        <div className="flex text-yellow-400">
          {[...Array(4)].map((_, i) => <Star key={i} size={10} fill="currentColor" />)}
          <Star size={10} className="text-gray-300" />
        </div>
        <span className="text-[10px] text-gray-400">(21447)</span>
      </div>
    </div>
  </div>
);

export default function ReviewRatingList() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-white max-w-md mx-auto relative pb-20">
      <Header title="Review & Rating" />
      
      <div className="flex gap-3 px-4 mb-6">
        <button className="flex items-center justify-between gap-2 px-3 py-1.5 border border-gray-300 rounded-lg text-sm min-w-[100px] text-gray-600">
          Category <ChevronDown size={16} />
        </button>
        <button className="flex items-center justify-between gap-2 px-3 py-1.5 border border-gray-300 rounded-lg text-sm min-w-[100px] text-gray-600">
          Brand <ChevronDown size={16} />
        </button>
      </div>

      <div className="px-4">
        {[...Array(5)].map((_, i) => (
          <ProductCard key={i} onClick={() => navigate('/seller/reviews/detail')} />
        ))}
      </div>
      
      <FAB />
    </div>
  );
}