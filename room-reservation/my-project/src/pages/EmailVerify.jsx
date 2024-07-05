import React, { useState, useEffect } from "react";
import { useStateContext } from "../contexts/contextProvider";
import {useNavigate} from 'react-router-dom';
import { MdEmail } from "react-icons/md";
import SimpleLoading from '../components/SimpleLoading'
import { FaExclamationTriangle } from "react-icons/fa";
const EmailVerify = () => {
  const [pin, setPin] = useState(0);
  const [countdown, setCountdown] = useState(0); // Countdown in seconds
  const [isResending, setIsResending] = useState(false);
 
  const { errors, setErrors, loading, email_verify, resend_pin} = useStateContext();
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));
  // if(user.isVerified && auth){
  //   navigate('/home');
  // }else if(!auth){
  //   logout('/logout');
  // }

  const sendPin = (e) => {
    e.preventDefault();
    const data = {
      email: user.email,
      pin: pin,
    };

    if (pin.length !== 6) {
      setErrors({_Html: 'It should be a 6-digit code. Please kindly check your email.'});
      setTimeout(() => {
        setErrors({_Html: ''});
      }, 5000);
      return; // Prevent further execution
    }
    email_verify({email: user.email, pin: pin});
  };

  const handleResendCodeClick = () => {
    // Start the 5-minute countdown
    resend_pin();
    setCountdown(300); // 5 minutes in seconds
    setIsResending(true);
  }

  useEffect(() => {
    let intervalId;
    if (isResending && countdown > 0) {
      intervalId = setInterval(() => {
        setCountdown(prevCountdown => {
          if (prevCountdown === 0) {
            clearInterval(intervalId);
            setIsResending(false); // Countdown finished, make Resend Code clickable
            return 0;
          }
          return prevCountdown - 1;
        });
      }, 1000); // Update countdown every second
    }

    // Clean up the interval when component unmounts or countdown is stopped
    return () => clearInterval(intervalId);
  }, [isResending, countdown]);


  const minutes = Math.floor(countdown / 60);
  const seconds = countdown % 60;
  const formattedTime = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

  return (
    <>
    <div className="bg-yellow-100 h-screen flex flex-col over">
      <form onSubmit={sendPin}>
        <div className="flex flex-col items-center m-10">
          <div className="rounded-full bg-notActText mt-5 p-5 shadow-2xl">
            <MdEmail size={50} className="text-mainBg"/>
          </div>
          <h3 className='font-bold text-neutral-950 text-4xl mt-10 mb-5 text-center'>Please Verify Your Account</h3>
          <h6 className="font-sans text-neutral-950 text-lg text-center mb-5">Enter the 6 digit code we sent through your e-mail address to verify your account</h6>
          {errors._Html && (
                <span className="text-white font-semibold rounded-lg bg-red-400 w-full p-1 m-1 text-sm gap-2 flex items-center justify-center">
                  <i className="text-white">
                    <FaExclamationTriangle size={20} />
                  </i>
                  {errors._Html}
                  {setTimeout(() => {
                    setErrors({_Html: ''})
                  }, 5000)}
                </span>
              )}
   
          <input
            type="text"
            value={pin === 0 ? "" : pin}
            required
            onChange={(e) => {
              const inputVal = e.target.value;
              if(inputVal.length <= 6){
                setPin(inputVal)
              }
            }} // Call handleChange function on change
            className="border border-gray-500 rounded-lg px-4 py-2 w-96 text-lg focus:outline-none focus:border-blue-500 text-center text-actText my-5"
            placeholder="Enter the 6-digit code"
          />
          <h6 className="font-sans text-neutral-950 text-lg text-center mt-5">Didn't got got an email? No Problem.</h6>
          <div className="mt-3">
            {isResending ? (
              <span className="font-semibold text-actText">Resend the code: {formattedTime}</span>
            ) : (
              <a href="#" className={` ${countdown > 0 ? 'pointer-events-none font-bold text-xl' : 'font-bold text-xl text-notActText hover:text-actText'}`} onClick={countdown === 0 ? handleResendCodeClick : undefined}>
                Resend Code
              </a>
            )}
          </div>
          <button className="bg-notActText mt-10 text-white font-bold w-96 h-12 rounded-lg transition duration-75 ease-in-out transform hover:scale-95" type="submit">
          {loading && <SimpleLoading/>}
             {!loading && "Verify"}    
            </button>
        </div>
       
      </form>
      </div>  
    </>
  );
};

export default EmailVerify;
