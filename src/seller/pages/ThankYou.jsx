import React from 'react'

const ThankYou = () => {
  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-white py-10">
      <div className="w-[90%] max-w-sm bg-[#047c8a] rounded-md px-6 py-10 shadow-lg min-h">
          {/* Title Left Aligned */}
        <h1 className="text-3xl font-light text-black tracking-wide">
          Kalkideals
        </h1>
        {/* Underline (Indented, not full) */}
        <div className="w-[70%] h-[1px] bg-white mt-2 mb-5 opacity-50 ml-2"></div>
        <div className='h-[60vh] ml-5 mt-13'>
             <p className='text-white'>Thank you ! Your seller registration form has been submitted successfully. 
           After the verification process is completed, your seller ID and Password will be shared with you via Email/SMS.</p>
        </div>
       
      </div>
    </div>
  )
}

export default ThankYou