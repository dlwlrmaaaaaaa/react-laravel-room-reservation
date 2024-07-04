import React, { useState } from 'react';
import Footer from '../components/Footer';
import Header from '../components/Header';
import { FaMapLocationDot } from "react-icons/fa6";
import { MdOutlineMail } from "react-icons/md";
import { FiSmartphone } from "react-icons/fi";
import axiosClient from "../axios";

const Contact = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [user_messages, setUserMessage] = useState("");

  const handleSend = (e) => {
    e.preventDefault();
    axiosClient.post('/contacts', {
      name,
      email,
      user_messages,
    })
      .then(response => {
        console.log('Message sent successfully:', response.data);
        // Optionally reset form here
        setName('');
        setEmail('');
        setUserMessage('');
      })
      .catch((error) => console.error("Error: ", error));
  };

  return (
    <>
      <Header />
      <div className='bg-mainBg'>
        <div className='flex items-center justify-center border-b-2 border-actNav'>
          <h1 className='text-actText text-4xl font-bold m-5'> Contact Us</h1>
        </div>
        <div className='flex justify-center items-center h-auto'>
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d15440.099376951695!2d120.9979647!3d14.6545312!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3397b79bad0c1649%3A0x1813241556e3fd63!2sThe%20Celandine%20by%20DMCI%20Homes!5e0!3m2!1sen!2sph!4v1711117945764!5m2!1sen!2sph"
            width="100%"
            height="350"
            style={{ border: '0' }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>

        <div className='flex justify-center items-center h-auto mt-10'>
          <div className='w-4/6'>
            <div className='grid grid-cols-1 lg:grid-cols-3 bg-white rounded-lg border shadow-lg mb-10'>
              <div className='mx-4 lg:mx-7 my-3 lg:my-5 flex items-start'>
                <FaMapLocationDot className='text-notActText mt-1' size={30} />
                <div className="ml-3">
                  <h1 className='text-actText text-2xl font-semibold'>Location:</h1>
                  <p className='text-sm text-notActText break-words lg:max-w-[250px]'>
                    Bgy, A. Bonifacio Ave, Balintawak, Quezon City, Metro Manila
                  </p>
                </div>
              </div>
              <div className='mx-4 lg:mx-7 my-3 lg:my-5 flex items-start'>
                <MdOutlineMail className='text-notActText' size={30} />
                <div className="ml-3">
                  <h1 className='text-actText text-2xl font-semibold'>Email:</h1>
                  <p className='text-sm text-notActText'>
                    marucutjisselle@gmail.com
                  </p>
                </div>
              </div>
              <div className='mx-4 lg:mx-7 my-3 lg:my-5 flex items-start'>
                <FiSmartphone className='text-notActText' size={30} />
                <div className="ml-3">
                  <h1 className='text-actText text-2xl font-semibold'>Call:</h1>
                  <p className='text-sm text-notActText'>
                    0961 202 7527
                  </p>
                </div>
              </div>
            </div>

            <div id='message' className='w-full flex justify-center items-center rounded-xl shadow-xl p-4 mb-10 bg-white'>
              <form className="relative w-full p-6 flex-auto"
                onSubmit={handleSend}
              >
                <div className="flex flex-wrap mb-5">
                  <div className="w-1/2 pr-2">
                    <input type="text" placeholder='Name' className="shadow appearance-none border rounded w-full py-1 px-1 text-notActText"
                      value={name} onChange={(e) => setName(e.target.value)} />
                  </div>
                  <div className="w-1/2 ">
                    <input type="text" placeholder='Email' className="shadow appearance-none border rounded w-full py-1 px-1 text-notActText"
                      value={email} onChange={(e) => setEmail(e.target.value)} />
                  </div>
                </div>
                <div className="flex flex-wrap mb-5">
                  <textarea type="text" placeholder='Message' className="shadow appearance-none border rounded w-full py-1 px-1 text-notActText resize-none"
                    style={{ width: "100%", height: "120px", wordWrap: "break-word" }}
                    value={user_messages} onChange={(e) => setUserMessage(e.target.value)} />
                </div>
                <button id='sendMessage'
                  className='mt-2 bg-notActText hover:bg-cirlce transition duration-75 ease-in-out transform hover:scale-95 text-white font-bold py-2 px-7 rounded-full'>Send
                </button>
              </form>
            </div>
          </div>
        </div>

      </div>
      <Footer />
    </>
  );
};

export default Contact;