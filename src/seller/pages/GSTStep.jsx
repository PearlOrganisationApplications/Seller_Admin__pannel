import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const GSTStep = () => {
  const [selected, setSelected] = useState("");
  const [gstin, setGstin] = useState("");
  const navigate = useNavigate();

  const handleContinue = () => {
    if (!selected) {
      alert("Please select one of the GST options.");
      return;
    }
    if (selected === "have_gst" && gstin.trim().length < 5) {
      alert("Please enter a valid GSTIN.");
      return;
    }
    navigate('/seller/aadhar');
  };

  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-white py-10">
      <div className="w-[90%] max-w-sm bg-[#047c8a] rounded-md px-6 py-10 shadow-lg flex flex-col justify-between min-h-[500px]">
        <div>
          <h1 className="text-3xl font-light text-black tracking-wide">Kalkideals</h1>
          <div className="w-[70%] h-[1px] bg-white mt-2 mb-5 opacity-50 ml-2"></div>
          <p className="text-center text-black text-sm mb-2">Account Registration For Seller</p>
          <div className="w-full h-[1px] bg-white mb-8 opacity-50"></div>

          <div className="space-y-6">
            <label className="flex items-start gap-3 text-white text-sm cursor-pointer">
              <input type="radio" name="gst" checked={selected === "no_gst"} onChange={() => setSelected("no_gst")} className="mt-1" />
              <span>I don't have GSTIN</span>
            </label>
            <label className="flex items-start gap-3 text-white text-sm cursor-pointer leading-tight">
              <input type="radio" name="gst" checked={selected === "below_threshold"} onChange={() => setSelected("below_threshold")} className="mt-1" />
              <span>I declare my turnover is below the threshold.</span>
            </label>
            <p className="text-center text-white font-semibold">OR</p>
            <label className="flex items-start gap-3 text-white text-sm cursor-pointer">
              <input type="radio" name="gst" checked={selected === "have_gst"} onChange={() => setSelected("have_gst")} className="mt-1" />
              <span>I have GSTIN</span>
            </label>
          </div>

          <input
            type="text"
            placeholder="Enter GSTIN"
            value={gstin}
            disabled={selected !== "have_gst"}
            onChange={(e) => setGstin(e.target.value)}
            className={`w-full px-3 py-3 mt-8 border rounded-md outline-none bg-white text-black ${selected !== "have_gst" ? 'opacity-50' : ''}`}
          />
        </div>

        <button onClick={handleContinue} className="w-full py-3 border border-black rounded-md bg-white font-semibold hover:bg-gray-100 mt-10">
          Continue
        </button>
      </div>
    </div>
  );
};

export default GSTStep;