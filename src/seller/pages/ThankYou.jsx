import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ThankYou = () => {
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(10);

  useEffect(() => {
    // 1. Timer for the UI text
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // 2. Redirect logic after 10 seconds
    const redirectTimeout = setTimeout(() => {
      console.log("Redirecting to Dashboard...");
      
      // We must set these so PrivateRoute in App.js lets us in
      localStorage.setItem("access_token", "registered_user_session");
      localStorage.setItem("user_type", "seller");
      
      // Use window.location.replace to clear history and force the Auth check
      window.location.replace("/seller/dashboard");
    }, 10000);

    return () => {
      clearInterval(timer);
      clearTimeout(redirectTimeout);
    };
  }, []);

  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-white py-10">
      <div className="w-[90%] max-w-sm bg-[#047c8a] rounded-md px-6 py-10 shadow-lg min-h-[450px] flex flex-col justify-between">
        <div>
          <h1 className="text-3xl font-light text-black tracking-wide">
            Kalkideals
          </h1>
          <div className="w-[70%] h-[1px] bg-white mt-2 mb-8 opacity-50 ml-2"></div>
          
          <div className='mt-10'>
            <p className='text-white text-lg font-medium leading-relaxed'>
              Thank you! 
            </p>
            <p className='text-white mt-4 leading-relaxed'>
              Your seller registration form has been submitted successfully. 
            </p>
            <p className='text-white mt-4 opacity-80 text-sm'>
              After the verification process is completed, your seller ID and Password will be shared via Email/SMS.
            </p>
          </div>
        </div>

        <div className="text-center">
          <div className="bg-black/20 py-3 px-4 rounded-lg border border-white/10">
            <p className="text-white text-xs font-semibold">
              Redirecting to Dashboard in <span className="text-yellow-300 text-lg ml-1">{countdown}s</span>
            </p>
          </div>
          <button 
            onClick={() => {
                localStorage.setItem("access_token", "registered_user_session");
                localStorage.setItem("user_type", "seller");
                window.location.replace("/seller/dashboard");
            }}
            className="mt-4 text-white/50 text-xs underline hover:text-white"
          >
            Click here if not redirected
          </button>
        </div>
      </div>
    </div>
  );
}

export default ThankYou;