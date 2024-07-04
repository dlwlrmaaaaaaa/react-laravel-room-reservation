import React, { useState, useEffect } from 'react';
import Logo from '../assets/logo.png';

function Redirecting() {
  const [loadingText, setLoadingText] = useState('PLEASE WAIT, PROCESSING');

  useEffect(() => {
    const intervalId = setInterval(() => {
      setLoadingText(prevText => {
        switch (prevText) {
          case 'PLEASE WAIT, PROCESSING.':
            return 'PLEASE WAIT, PROCESSING..';
          case 'PLEASE WAIT, PROCESSING..':
            return 'PLEASE WAIT, PROCESSING...';
          case 'PLEASE WAIT, PROCESSING...':
            return 'PLEASE WAIT, PROCESSING.';
          default:
            return 'PLEASE WAIT, PROCESSING.'; // Reset to default if unexpected value
        }
      });
    }, 1000);

    return () => clearInterval(intervalId); // Cleanup on unmount
  }, []); // Run effect only once after component mount

  return (
    <div className="bg-mainBg w-full overflow-hidden h-screen flex justify-center items-center">
      <div className=" h-64 w-2/6 text-black items-center justify-center flex flex-col">
        <img src={Logo} alt="Logo" className="w-24 h-24 mt-0 m-8 animate-bounce" />
        <h1 className=" text-3xl text-center">{loadingText}</h1>
      </div>
    </div>
  );
}

export default Redirecting;
