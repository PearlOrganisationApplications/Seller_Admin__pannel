import React, { useState } from "react";

const GSTStep = () => {
  const [selected, setSelected] = useState("");

  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-white py-10">
      <div className="w-[90%] max-w-sm bg-[#047c8a] rounded-md px-6 py-10 shadow-lg min-h">

        {/* Title Left Aligned */}
        <h1 className="text-3xl font-light text-black tracking-wide">
          Kalkideals
        </h1>

        {/* Underline (Indented, not full) */}
        <div className="w-[70%] h-[1px] bg-white mt-2 mb-5 opacity-50 ml-2"></div>

        {/* Subtitle */}
        <p className="text-center text-black text-sm mb-2">
          Account Registeration For Seller
        </p>

        <div className="w-full h-[1px] bg-white mb-8 opacity-50"></div>

        {/* GST Options */}
        <div className="space-y-6">

          {/* Option 1 */}
          <label className="flex items-start gap-3 text-white text-sm cursor-pointer">
            <input
              type="checkbox"
              checked={selected === "no_gst"}
              onChange={() => setSelected("no_gst")}
              className="w-4 h-4 border border-black rounded-sm bg-white"
            />
            <span>I don't have GSTIN</span>
          </label>

          {/* Option 2 */}
          <label className="flex items-start gap-3 text-white text-sm cursor-pointer leading-tight">
            <input
              type="checkbox"
              checked={selected === "below_threshold"}
              onChange={() => setSelected("below_threshold")}
              className="w-4 h-4 border border-black rounded-sm bg-white"
            />
            <span>
              I declare my turnover is below the threshold. I am not able to
              register under GST as per law
            </span>
          </label>

          {/* OR */}
          <p className="text-center text-white font-semibold">OR</p>

          {/* Option 3 */}
          <label className="flex items-start gap-3 text-white text-sm cursor-pointer">
            <input
              type="checkbox"
              checked={selected === "have_gst"}
              onChange={() => setSelected("have_gst")}
              className="w-4 h-4 border border-black rounded-sm bg-white"
            />
            <span>I have GSTIN</span>
          </label>
        </div>

        {/* GST INPUT (Always Visible as Requested) */}
        <input
          type="text"
          placeholder="Enter GSTIN"
          className="w-full px-3 py-3 mt-8 border border-gray-300 rounded-md outline-none bg-white text-black"
        />

        {/* Continue Button */}
        <button
          className="w-full mt-[50%] py-3 border border-black rounded-md bg-white font-semibold hover:bg-gray-100"
        >
          Continue
        </button>

      </div>
    </div>
  );
};

export default GSTStep;
