import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ThankYou = () => {
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(10);

  useEffect(() => {
    // Optional: Set dummy login data so the PrivateRoute lets them into the dashboard
    localStorage.setItem("access_token", "temp_token_from_reg");
    localStorage.setItem("user_type", "seller");

    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    const redirect = setTimeout(() => {
      // Full page refresh or direct navigate to dashboard
      window.location.href = "/seller/dashboard";
    }, 10000);

    return () => {
      clearInterval(timer);
      clearTimeout(redirect);
    };
  }, [navigate]);

  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-white py-10">
      <div className="w-[90%] max-w-sm bg-[#047c8a] rounded-md px-6 py-10 shadow-lg min-h-[500px] flex flex-col">
        <h1 className="text-3xl font-light text-black tracking-wide">Kalkideals</h1>
        <div className="w-[70%] h-[1px] bg-white mt-2 mb-5 opacity-50 ml-2"></div>
        
        <div className='flex-grow mt-10'>
          <p className='text-white text-lg leading-relaxed'>
            Thank you! Your seller registration form has been submitted successfully. 
          </p>
          <p className='text-white mt-4 opacity-90'>
            After the verification process is completed, your seller ID and Password will be shared with you via Email/SMS.
          </p>
        </div>

        <div className="mt-auto pt-6 text-center">
          <p className="text-black text-xs font-bold bg-white/20 py-2 rounded-full">
            Redirecting to dashboard in {countdown}s...
          </p>
        </div>
      </div>
    </div>
  );
}

export default ThankYou;