import React from "react";

const SellerRegistration = () => {
  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-white px-4 py-10">
      
      <div className="
        w-full 
        sm:max-w-sm 
        md:max-w-md 
        bg-[#047c8a] 
        rounded-md 
        px-5 sm:px-6 
        py-7 sm:py-8 
        shadow-lg
      ">
        
        {/* Title */}
        <h1 className="text-3xl sm:text-4xl font-light text-black tracking-wide">
          Kalkideals
        </h1>

        {/* Line */}
        <div className="w-2/3 h-px bg-white mt-2 mb-5 opacity-50 ml-2" />

        {/* Subtitle */}
        <p className="text-center text-black text-xs sm:text-sm mb-3">
          Account Registration For Seller
        </p>

        <div className="w-full h-px bg-white mb-5 opacity-50" />

        {/* Form */}
        <form className="space-y-3">

          <input
            type="text"
            placeholder="Name"
            className="w-full bg-white px-3 py-2 border border-gray-300 rounded-md outline-none text-sm"
          />

          {/* Dropdown */}
          <div className="relative">
            <select className="w-full px-3 py-2 border border-gray-300 rounded-md appearance-none outline-none bg-white text-sm">
              <option>Type of business</option>
              <option>Retail</option>
              <option>Wholesale</option>
              <option>Manufacturer</option>
            </select>

            <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-black text-xs">
              ▼
            </span>
          </div>

          <input
            type="text"
            placeholder="Business name"
            className="w-full bg-white px-3 py-2 border border-gray-300 rounded-md outline-none text-sm"
          />

          <input
            type="text"
            placeholder="Phone Number"
            className="w-full bg-white px-3 py-2 border border-gray-300 rounded-md outline-none text-sm"
          />

          <input
            type="email"
            placeholder="Email"
            className="w-full bg-white px-3 py-2 border border-gray-300 rounded-md outline-none text-sm"
          />

          <input
            type="text"
            placeholder="Enter your address"
            className="w-full bg-white px-3 py-2 border border-gray-300 rounded-md outline-none text-sm"
          />

          <input
            type="text"
            placeholder="Select your state"
            className="w-full bg-white px-3 py-2 border border-gray-300 rounded-md outline-none text-sm"
          />

          <input
            type="text"
            placeholder="Enter City"
            className="w-full bg-white px-3 py-2 border border-gray-300 rounded-md outline-none text-sm"
          />

          <input
            type="text"
            placeholder="Pincode"
            className="w-full bg-white px-3 py-2 border border-gray-300 rounded-md outline-none text-sm"
          />

          {/* Button */}
          <button
            type="submit"
            className="w-full py-2 border border-black rounded-md bg-white font-semibold text-sm hover:bg-gray-100 transition"
          >
            Continue
          </button>
        </form>
      </div>
    </div>
  );
};

export default SellerRegistration;
