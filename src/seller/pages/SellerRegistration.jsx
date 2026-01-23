import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const SellerRegistration = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    businessType: "",
    businessName: "",
    phone: "",
    email: "",
    address: "",
    state: "",
    city: "",
    pincode: ""
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleContinue = (e) => {
    e.preventDefault();
    // Check if all fields are filled
    const isAllFilled = Object.values(formData).every(value => value.trim() !== "");
    
    if (isAllFilled) {
      navigate('/seller/gst');
    } else {
      alert("Please fill in all fields before continuing.");
    }
  };

  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-white px-4 py-10">
      <div className="w-full sm:max-w-sm md:max-w-md bg-[#047c8a] rounded-md px-5 sm:px-6 py-7 sm:py-8 shadow-lg">
        <h1 className="text-3xl sm:text-4xl font-light text-black tracking-wide">Kalkideals</h1>
        <div className="w-2/3 h-px bg-white mt-2 mb-5 opacity-50 ml-2" />
        <p className="text-center text-black text-xs sm:text-sm mb-3">Account Registration For Seller</p>
        
        <form className="space-y-3" onSubmit={handleContinue}>
          <input name="name" type="text" placeholder="Name" onChange={handleChange} className="w-full bg-white px-3 py-2 border rounded-md outline-none text-sm" />
          
          <div className="relative">
            <select name="businessType" onChange={handleChange} className="w-full px-3 py-2 border rounded-md appearance-none outline-none bg-white text-sm">
              <option value="">Type of business</option>
              <option value="Retail">Retail</option>
              <option value="Wholesale">Wholesale</option>
              <option value="Manufacturer">Manufacturer</option>
            </select>
            <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-black">▼</span>
          </div>

          <input name="businessName" type="text" placeholder="Business name" onChange={handleChange} className="w-full bg-white px-3 py-2 border rounded-md outline-none text-sm" />
          <input name="phone" type="text" placeholder="Phone Number" onChange={handleChange} className="w-full bg-white px-3 py-2 border rounded-md outline-none text-sm" />
          <input name="email" type="email" placeholder="Email" onChange={handleChange} className="w-full bg-white px-3 py-2 border rounded-md outline-none text-sm" />
          <input name="address" type="text" placeholder="Enter your address" onChange={handleChange} className="w-full bg-white px-3 py-2 border rounded-md outline-none text-sm" />
          <input name="state" type="text" placeholder="Select your state" onChange={handleChange} className="w-full bg-white px-3 py-2 border rounded-md outline-none text-sm" />
          <input name="city" type="text" placeholder="Enter City" onChange={handleChange} className="w-full bg-white px-3 py-2 border rounded-md outline-none text-sm" />
          <input name="pincode" type="text" placeholder="Pincode" onChange={handleChange} className="w-full bg-white px-3 py-2 border rounded-md outline-none text-sm" />
          
          <button type="submit" className="w-full py-2 border border-black rounded-md bg-white font-semibold text-sm hover:bg-gray-100 transition">
            Continue
          </button>
        </form>
      </div>
    </div>
  );
};

export default SellerRegistration;