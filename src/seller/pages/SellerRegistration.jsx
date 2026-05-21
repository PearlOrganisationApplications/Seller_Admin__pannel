import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  User,
  Building2,
  Phone,
  Mail,
  MapPin,
  Globe,
  Hash,
  ArrowRight,
  Briefcase,
  Landmark,
} from "lucide-react";

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
    pincode: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleContinue = (e) => {
    e.preventDefault();
    const isAllFilled = Object.values(formData).every(
      (value) => value.trim() !== "",
    );

    if (isAllFilled) {
      navigate("/seller/gst");
    } else {
      alert("Please fill in all fields before continuing.");
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#fcfaff] py-10 px-4 relative overflow-hidden font-sans">
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
        <div className="absolute top-[-10%] right-[-5%] w-[400px] h-[400px] bg-purple-200 rounded-full blur-[120px] opacity-40" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[400px] h-[400px] bg-blue-100 rounded-full blur-[120px] opacity-40" />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-2xl bg-white/90 backdrop-blur-xl rounded-[2.5rem] shadow-[0_25px_70px_rgba(0,0,0,0.07)] border border-white z-10 overflow-hidden"
      >
        <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 p-1.5 w-full" />

        <div className="px-8 pt-12 pb-4 text-center">
          <motion.h1
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-5xl font-black text-[#0f172a] tracking-tight mb-2"
          >
            Kalki<span className="text-purple-600">deals</span>
          </motion.h1>
          <p className="text-gray-500 font-semibold tracking-widest text-xs uppercase opacity-80">
            Official Seller Onboarding
          </p>
        </div>

        <form onSubmit={handleContinue} className="p-8 sm:px-14 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="md:col-span-2">
              <InputGroup
                icon={<User size={19} />}
                name="name"
                placeholder="Full Name"
                onChange={handleChange}
              />
            </div>

            <div className="relative group">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-purple-500 group-focus-within:text-pink-500 transition-colors z-20">
                <Briefcase size={19} />
              </div>
              <select
                name="businessType"
                onChange={handleChange}
                className="w-full pl-12 pr-4 py-4 bg-gray-50/60 border border-gray-100 rounded-2xl outline-none focus:border-purple-400 focus:ring-4 focus:ring-purple-100 transition-all appearance-none text-gray-700 relative z-10"
              >
                <option value="">Business Type</option>
                <option value="Retail">Retail</option>
                <option value="Wholesale">Wholesale</option>
                <option value="Manufacturer">Manufacturer</option>
              </select>
              <span className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400 z-20">
                ▼
              </span>
            </div>

            <InputGroup
              icon={<Building2 size={19} />}
              name="businessName"
              placeholder="Business Name"
              onChange={handleChange}
            />
            <InputGroup
              icon={<Phone size={19} />}
              name="phone"
              placeholder="Phone Number"
              onChange={handleChange}
            />
            <InputGroup
              icon={<Mail size={19} />}
              name="email"
              placeholder="Email Address"
              onChange={handleChange}
            />

            <div className="md:col-span-2">
              <InputGroup
                icon={<MapPin size={19} />}
                name="address"
                placeholder="Store/Office Address"
                onChange={handleChange}
              />
            </div>

            <InputGroup
              icon={<Globe size={19} />}
              name="state"
              placeholder="State"
              onChange={handleChange}
            />
            <InputGroup
              icon={<Landmark size={19} />}
              name="city"
              placeholder="City"
              onChange={handleChange}
            />

            <div className="md:col-span-2">
              <InputGroup
                icon={<Hash size={19} />}
                name="pincode"
                placeholder="Pincode"
                onChange={handleChange}
              />
            </div>
          </div>

          <motion.button
            whileHover={{
              scale: 1.01,
              shadow: "0 20px 25px -5px rgba(124, 58, 237, 0.4)",
            }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            className="w-full mt-8 py-5 bg-gradient-to-r from-purple-400 via-indigo-400 to-blue-600 text-white rounded-2xl font-bold text-lg flex items-center justify-center gap-3 shadow-xl shadow-purple-200 group transition-all"
          >
            Continue to Verification
            <ArrowRight
              className="group-hover:translate-x-2 transition-transform"
              size={20}
            />
          </motion.button>
        </form>

        <div className="pb-12 text-center">
          <p className="text-gray-400 text-sm font-medium">
            Need help?{" "}
            <span className="text-purple-600 cursor-pointer hover:text-pink-500 transition-colors underline underline-offset-4">
              Contact Support
            </span>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

const InputGroup = ({ icon, name, placeholder, onChange }) => (
  <div className="relative group">
    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-purple-500 group-focus-within:text-pink-500 transition-colors duration-300">
      {icon}
    </div>
    <input
      name={name}
      type="text"
      placeholder={placeholder}
      onChange={onChange}
      className="w-full pl-12 pr-4 py-4 bg-gray-50/60 border border-gray-100 rounded-2xl outline-none focus:border-purple-400 focus:ring-4 focus:ring-purple-100 transition-all text-gray-700 placeholder:text-gray-400 placeholder:font-medium"
    />
  </div>
);

export default SellerRegistration;
