import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import {
  PayPalScriptProvider,
  PayPalButtons,
  usePayPalScriptReducer
} from "@paypal/react-paypal-js";

import Footer from "../components/Footer";
import room from "../JSON/Room.json";
import br1 from "../assets/br1.jpg";
import Loading from "../components/SimpleLoading";
import {
  FaCalendar,
  FaUsers,
  FaPlus,
  FaMinus,
  FaShieldAlt,
} from "react-icons/fa";
import {
  MdOutlineAccessTimeFilled,
  MdOutlineAccessTime,
  MdPlaylistAdd,
} from "react-icons/md";
import { IoCloseCircleSharp } from "react-icons/io5";
import axiosClient from "../axios";
import { useNavigate } from "react-router-dom";
const initialOptions = {
  "client-id": "AUZjhukssPPk3IUosdMMnhPX02Dp3Ebpjn0Nv_utiI2THzqv9_FpNApVQ-5YXI5TMpr-7UEs4i4Bkj0C",
  currency: "PHP",
  intent: 'capture'
};
const Payment = () => {
  const startDate = localStorage.getItem('startDate');
  const endDate = localStorage.getItem('endDate');
  const guest = localStorage.getItem('guest');
  const [room_id, setRoomId] = useState(localStorage.getItem("room_id"));
  const [rooms, setRooms] = useState([JSON.parse(localStorage.getItem('room'))]);
  const [image, setImage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    rooms.map((room) => {     
      setImage(JSON.parse(room.file_name)[0]);
   })
  },[])

  const createOrder = (data, actions) => {
    return actions.order.create({
      purchase_units: [
        {
          amount: {
            currency_code: "PHP",
            value: localStorage.getItem('price')
          }
        }
      ]
    })
  }
  const onApprove = (data, actions) => {
    return actions.order.capture().then(function (details) {
      axiosClient.post('/payment', {
        room_id: localStorage.getItem('room_id'),
        amount: localStorage.getItem('price'),
        starting_date: localStorage.getItem("startDate"),
        ending_date: localStorage.getItem("endDate"),
        order_id: data.orderID
      }).then(() => {

        navigate('/home');
      }).catch((err) => {
        console.log(err);
      })
    });
  }

  const cancel_booking = (e) => {
    e.preventDefault();
    setLoading(true);
    axiosClient.post('/cancel_booking', {
      room_id: localStorage.getItem('room_id')
    })
      .then(() => {
        setLoading(false);
        navigate('/home');
      }).catch((err) => {
        setLoading(false);
        console.log(err);
      });
  }
  return (
    <>
      <Header />
      <div className="w-full grow bg-backColor h-auto flex flex-col justify-start items-center">
        {rooms.map((room) => (
            <div
              id="booking"
            className="grid lg:grid-cols-3 md:grid-cols-3 grid-cols-1 gap-4 w-full h-auto"
            key={room.id}
            >
              <div
                id="left"
                className="col-span-2 p-3 gap-3 flex flex-col items-center h-auto"
              >
                <div
                  id="leftContainer"
                  className="flex flex-col  p-4 w-full h-full rounded-xl justify-between items-center"
                >
                  <div className="w-full flex flex-col sm:flex-col items-start justify-start gap-2 py-3">
                    {/* Description */}
                    <h1 className="text-4xl text-act-text font-bold text-actText">
                      Confirm and Pay
                    </h1>
                    <h1 className="text-3xl text-act-text font-bold text-notActText mt-4">
                      Your Reservation:
                    </h1>
                    <div className="flex w-full justify-between items-center mt-2">
                      <h1 className="text-2xl text-act-text font-semibold">
                        Dates
                      </h1>
                      <h1 className="text-lg text-act-text font-semibold">
                        {startDate + " - " + endDate}
                      </h1>
                      <h1 className="text-lg text-act-text font-semibold hover:underline duration-75 ease-in-out hover:scale-95">
                        <a href="">Edit</a>
                      </h1>
                    </div>
                    <div className="flex w-full justify-between items-center">
                      <h1 className="text-2xl text-act-text font-semibold">
                        Guest
                      </h1>
                      <h1 className="text-lg text-act-text font-semibold">
                        # {guest}
                      </h1>
                      <h1 className="text-lg text-act-text font-semibold hover:underline duration-75 ease-in-out hover:scale-95">
                        <a href="">Edit</a>
                      </h1>
                    </div>
                    <div className="bg-mainBorder h-[3px] w-full mt-2"></div>

                    <h1 className="text-3xl text-act-text font-bold text-notActText mt-4">
                      Pay with: Paypal
                    </h1>
                    <img
                      src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/52/GCash_logo.svg/1280px-GCash_logo.svg.png"
                      alt="Gcash"
                      className="h-8 mt-2"
                    />
                    <div className="bg-mainBorder h-[3px] w-full mt-2"></div>

                    <h1 className="text-3xl text-act-text font-bold text-notActText  mt-4">
                      Cancellation Policy
                    </h1>
                    <h1 className="text-lg text-act-text font-semibold">
                      Free Cancellation up to 24hrs before checkin
                    </h1>
                    <div className="bg-mainBorder h-[3px] w-full mt-2"></div>

                    <h1 className="text-3xl text-act-text font-bold text-notActText  mt-4">
                      Ground Rules
                    </h1>
                    <h1 className="text-lg text-act-text font-semibold">
                      We ask every guest to remember a few simple things about
                      what makes a great guest.
                    </h1>
                    <li>Follow the house rules</li>
                    <li>Treat your Host’s home like your own</li>
                    <div className="bg-mainBorder h-[3px] w-full mt-2"></div>
                    <h1 className="text-xs">
                      By confirming, I agree to the Host's House Rules, Ground
                      rules for guests,  JM Staycation Rebooking and Refund
                      Policy, and that  JM Staycation can charge my payment
                      method if I’m responsible for damage.
                    </h1>
                  </div>
                </div>
              </div>

              {/* booking bar */}
              <div id="right" className="p-2 flex mt-5 flex-col gap-4 h-auto">
                <div className="sticky top-24 mb-4">
                  <div className="bg-mainCol border-b-[1px] border-mainBorder mb-4 p-4 w-full h-auto rounded-xl flex flex-col justify-center items-center gap-6 shadow">
                    <div className="flex flex-row gap-5 container">
                      <div className="h-32 w-52">
                        <img
                          src={`http://localhost:8000/public/images/${image}`}
                          alt={room.room_name}
                          className="object-cover w-full h-full rounded-xl"
                        />
                      </div>
                      <h1 className="lg:text-2xl text-md text-act-text font-bold text-actText mt-2">
                        {room.room_name}
                      </h1>
                    </div>

                    {/* cost computation */}
                    <div className="grid grid-cols-4 w-full mt-3">
                      <div className="col-span-3 flex flex-col gap-2">
                        <h1 className="text-sm font-semibold">
                          Cost Per Night
                        </h1>
                        <h1 className="text-sm font-semibold">
                          Number of Nights Staying
                        </h1>
                        <h1 className="text-sm font-semibold">
                          Additional Guest
                        </h1>
                        <h1 className="text-sm font-semibold">Total Cost</h1>
                      </div>
                      <div className="flex flex-col gap-2">
                        <h1 className="text-sm font-semibold">
                          ₱ {localStorage.getItem('room_price')}
                        </h1>
                        <h1 className="text-sm font-semibold"># {localStorage.getItem('days')}</h1>
                        <h1 className="text-sm font-semibold"># {localStorage.getItem('guest')}</h1>
                        <h1 className="text-sm font-semibold"> ₱ {localStorage.getItem('price')}</h1>
                    </div>
                    
                  </div>
                  <div className="w-full">
                  <PayPalScriptProvider options={initialOptions}>
                  <PayPalButtons    
                   createOrder={(data, actions) => createOrder(data, actions)}    
                    onApprove={(data, actions) => { onApprove(data, actions) 
                  }} />
                  </PayPalScriptProvider>
                  </div>
                  <button onClick={cancel_booking} className="bg-red-400 rounded-full px-8 py-2 text-sm text-white hover:transition-all hover:scale-110">
                    {loading && <Loading />}
                    {!loading && "Cancel Booking"}
                  </button>
                  </div>

                  {/* <button
                    className="bg-actNav text-xl font-bold w-full mt-4 text-actText py-3 px-8 
                                rounded-lg transition duration-75 ease-in-out transform hover:scale-95"
                  >
                    Confirm and Pay
                  </button> */}
               
                </div>
              </div>
            </div>
        ))}
      </div>

      <Footer />
    </>
  );
};

export default Payment;
