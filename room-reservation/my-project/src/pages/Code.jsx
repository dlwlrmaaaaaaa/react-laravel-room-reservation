import React, { useState, useEffect } from 'react';

function Code() {
  const [code, setCode] = useState('');
    const [countdown, setCountdown] = useState(0); // Countdown in seconds
    const [isResending, setIsResending] = useState(false);

  
  function handleKeyPress(event) {
    // Get the key code of the pressed key
    const keyCode = event.keyCode || event.which;

  
    if (
      !(
        (keyCode >= 48 && keyCode <= 57) || 
        (keyCode >= 96 && keyCode <= 105) || 
        [8, 9, 13, 27, 37, 39, 46].includes(keyCode) 
      )
    ) {
      event.preventDefault(); 
    }

   
    if (code.length >= 6 && keyCode !== 8) {
      event.preventDefault(); //
    }
  }


  // Function to handle Resend Code click


  // Countdown effect to update countdown every second
 
  // Format the remaining time in minutes and seconds
  const minutes = Math.floor(countdown / 60);
  const seconds = countdown % 60;
  const formattedTime = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

  return (
    <div className="bg-yellow-100 min-h-screen flex justify-center items-center">
      <div className="bg-yellow-100 min-h-screen w-11/12 flex flex-col items-center">
        <h1 className='font-bold text-neutral-950 text-6xl mt-32 text-center'>SECURITY VERIFICATION</h1>
        <h2 className="font-sans text-neutral-950 text-2xl m-24">Enter the code sent through your e-mail</h2>
        <input
          type="text"
          value={code}
          onChange={handleChange} // Call handleChange function on change
          onKeyDown={handleKeyPress} // Call handleKeyPress function on key down
          className="border border-gray-500 rounded-lg px-4 py-2 w-96 text-lg focus:outline-none focus:border-blue-500"
          placeholder="Enter the 6-digit code"
        />
        <div className="mt-6">
          {isResending ? (
            <span className="text-blue-500">Resend the code: {formattedTime}</span>
          ) : (
            <a href="#" className={`text-blue-500 ${countdown > 0 ? 'pointer-events-none' : 'underline'}`} onClick={countdown === 0 ? handleResendCodeClick : undefined}>
              Resend Code
            </a>
          )}
        </div>
        <button className="bg-red-500 mt-10 text-white font-bold w-96 h-10 rounded-lg">VERIFY</button>
      </div>
    </div>
  );
}

export default Code;
