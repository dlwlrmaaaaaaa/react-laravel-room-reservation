import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Carousel from "../components/Carousel";
import { DateRange } from "react-date-range";
import { format } from "date-fns";
import "react-date-range/dist/styles.css"; // main style file
import "react-date-range/dist/theme/default.css"; // theme css file
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
import { Link, useNavigate } from "react-router-dom";
import Loading from '../components/SimpleLoading';
import room8 from "../assets/images/room8.jpeg";
import buildingAmenities from '../JSON/Room.json'
import axiosClient from "../axios";
const BookRoom = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false);
  const [room, setRoom] = useState([JSON.parse(localStorage.getItem("room"))]);
  {
    /* Calendar */
  }
    const [openDate, setOpenDate] = useState(false);
  const [date, setDate] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: "selection",
    },
  ]);
  useEffect(() => {
    const start = date[0].startDate;
    const end = date[0].endDate;
    
    const startDateString = start.toISOString().split('T')[0];
    const endDateString = end.toISOString().split('T')[0];
    
    localStorage.setItem('days', getTotalDays());
    localStorage.setItem('startDate', startDateString);
    localStorage.setItem('endDate', endDateString);
  }, [date]);
  
  const getTotalDays = () => {
    const start = date[0].startDate;
    const end = date[0].endDate;
    return Math.ceil((end - start) / (1000 * 60 * 60 * 24));
  };

  //   Add or minus guest
  const [number, setNumber] = useState(1);
  const decreaseNumber = () => {
    if (number !== 0) {
      setNumber((prevNumber) => prevNumber - 1);
    }
  };
  const increaseNumber = () => {
    setNumber((prevNumber) => prevNumber + 1);
  };
  useEffect(() => {
      localStorage.setItem('guest', number.toString());
  }, [number])
  
  {
    /* cost computation */
  }
  const totalPrice = (price) => {
      let result = price;
      localStorage.setItem('price', price)
      localStorage.setItem('room_price', price)
    if (number > 4) {
        result = parseInt(price) + 500;
        localStorage.setItem('price', result)
      }
     
    return result;
  };
  // const pricePortion = () => {
  //     return totalPrice() * 0.2;
  // }
  const cancel_booking = (e) => {
    e.preventDefault();
    navigate('/home')
  }
  const continue_booking = (e) => {
    e.preventDefault(); 
    setLoading(true);
    const data = {
      room_id: localStorage.getItem('room_id'),
      starting_date: localStorage.getItem('startDate'),
      ending_date: localStorage.getItem('endDate'),
    }
    axiosClient.post('/reservation', data)
      .then(() => {
        setLoading(false);
        navigate('/book/payment');
      }).catch(() => {
        setLoading(false);
      });
  }

  const renderRoomImage = () => {
      return room.map((room) =>
        
      JSON.parse(room.file_name).map((img, index) => (
        <img
          src={`http://localhost:8000/storage/images/${img}`}
          alt={img}
          key={index}
        />
      ))
    );
  };

  return (
    <>
      <Header />
      <div className="w-full grow bg-backColor h-auto flex flex-col justify-start items-center">
        {/* image slider */}
        <div className="w-full grid grid-cols-3">
          {/* <Carousel slides={room[0].roomSlider} /> */}
          {renderRoomImage()}
        </div>

        {room.map((room) => (
          <React.Fragment key={room.id}>
            <div className="flex items-center justify-center border-actNav">
              <h1 className="text-actText text-4xl font-bold m-5 py-5">
                {room.room_name}
              </h1>
            </div>

            <div
              id="booking"
              className="grid lg:grid-cols-3 md:grid-cols-3 grid-cols-1 gap-4 w-full h-auto"
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
                    <h1 className="text-4xl text-act-text font-semibold">
                      {room.room_name}
                    </h1>
                    <p className="text-sm">{room.mini_description}</p>
                    <h1 className="text-2xl text-act-text font-bold mt-4 text-notActText">
                      Description:
                    </h1>
                    <p className="text-sm">{room.description}</p>
                    <div className="bg-mainBorder h-[3px] w-full mt-2"></div>

                    {/* Policy */}
                    <h1 className="text-2xl text-act-text font-bold mt-4 text-notActText">
                      Policy Details:
                    </h1>
                    <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-3 w-full mt-3">
                      <div className="flex flex-col">
                        <h1 className="text-lg font-bold ">House Rules</h1>
                        <p className="flex justify-start items-center gap-3 mt-2">
                          <MdOutlineAccessTime size={20} /> Check-In 3pm
                        </p>
                        <p className="flex justify-start items-center gap-3 mt-2">
                          <MdOutlineAccessTimeFilled size={20} /> Check-Out 1pm
                        </p>
                        <p className="flex justify-start items-center gap-3 mt-2">
                          <MdPlaylistAdd size={30} /> Additional 200 per guest
                          for pool access
                        </p>
                      </div>
                      <div className="flex flex-col">
                        <h1 className="text-lg font-bold">
                          Cancellation Policy
                        </h1>
                        <p className="flex justify-start items-center gap-3 mt-2">
                          <IoCloseCircleSharp size={30} /> Free Cancellation up
                          to 24hrs before Check-In
                        </p>
                      </div>
                      <div className="flex flex-col">
                        <h1 className="text-lg font-bold">Health & Safety</h1>
                        <p className="flex justify-start items-center gap-3 mt-2">
                          <FaShieldAlt size={30} /> Cleaner in accordance with
                          our COVID safe cleaning policy
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* booking bar */}
              <div
                id="right"
                className="p-2 flex flex-col gap-4 h-auto relative"
              >
                <div className="bg-mainCol border-b-[1px] border-mainBorder p-4 w-full h-auto rounded-xl flex flex-col justify-center items-center gap-6 shadow">
                  <h1 className="text-2xl text-act-text font-bold mt-2">
                    ₱ {room.price} / Per Night
                  </h1>

                  {/* Calendar */}
                  <div className="grid grid-cols-2 w-full gap-4">
                    <div className="flex flex-col w-full">
                      <h1 className="text-sm font-semibold">Check in</h1>
                      <button
                        onClick={() => setOpenDate(!openDate)}
                        className="bg-white flex items-center justify-start gap-3 p-2 rounded-lg"
                      >
                        <FaCalendar />
                        {`${format(date[0].startDate, "MM/dd/yyyy")}`}
                      </button>
                    </div>
                    <div className="flex flex-col w-full">
                      <h1 className="text-sm font-semibold">Check out</h1>
                      <button
                        onClick={() => setOpenDate(!openDate)}
                        className="bg-white  flex items-center justify-start gap-3 p-2 rounded-lg"
                      >
                        <FaCalendar />
                        {`${format(date[0].endDate, "MM/dd/yyyy")}`}
                      </button>
                    </div>
                  </div>
                  {openDate && (
                    <div className="absolute mt-44 w-auto h-auto z-40">
                      <DateRange
                        editableDateInputs={true}
                        onChange={(item) => setDate([item.selection])}
                        moveRangeOnFirstSelection={false}
                        ranges={date}
                      />
                    </div>
                  )}

                  {/* add minus guest */}
                  <div className="grid grid-cols-2 w-full">
                    <div className="flex items-center justify-start gap-3 text-lg">
                      <FaUsers /> Guests
                    </div>
                    <div className="flex items-center justify-end gap-3 text-lg">
                      <button onClick={decreaseNumber}>
                        <FaMinus />
                      </button>{" "}
                      {number}
                      <button onClick={increaseNumber}>
                        <FaPlus />
                      </button>
                    </div>
                  </div>
                  <h1 className="text-sm mt-[-20px]">
                    All amenities are included*
                  </h1>

                  {/* cost computation */}
                  <div className="grid grid-cols-4 w-full mt-3">
                    <div className="col-span-3 flex flex-col gap-2">
                      <h1 className="text-sm font-semibold">Cost Per Night</h1>
                      <h1 className="text-sm font-semibold">
                        Number of Nights Staying
                      </h1>
                      <h1 className="text-sm font-semibold">
                        Additional Guest
                      </h1>
                      <h1 className="text-sm font-semibold">Total Cost</h1>
                      {/* <h1 className='text-sm font-semibold'>Pay upon booking</h1> */}
                    </div>
                    <div className="flex flex-col gap-2">
                      <h1 className="text-sm font-semibold">₱ {room.price}</h1>
                      <h1 className="text-sm font-semibold">
                        {getTotalDays()} Night/s
                      </h1>
                      <h1 className="text-sm font-semibold">
                        {number} Guest/s
                      </h1>
                      <h1 className="text-sm font-semibold">
                        {" "}
                        ₱ {parseInt(getTotalDays()) * totalPrice(room.price)}
                      </h1>
                      {/* <h1 className='text-sm font-semibold'>₱ {pricePortion()}</h1> */}
                    </div>
                  </div>
                  <div className="flex">
                  <button onClick={cancel_booking} className="bg-red-400 text-sm w-40 text-actText px-6 md:ml-5 rounded-full transition duration-75 ease-in-out transform hover:scale-95">
                      Cancel Booking
                    </button>
                    <button onClick={continue_booking} className="bg-actNav text-sm w-40 text-actText px-6 md:ml-5 rounded-full transition duration-75 ease-in-out transform hover:scale-95">
                      {loading && <Loading />}
                      {!loading && "Continue Booking"}
                    </button>
                  </div>
                  <h1 className="text-sm mt-[-10px]">
                    When you continue booking this room, it will not
                    automatically reserve until you finish with the payment
                  </h1>
                </div>
              </div>
            </div>

            {/* <Payment 
                    startDate={startDate}
                    endDate={endDate}
                    getTotalDays={getTotalDays}
                    totalPrice={totalPrice}
                    pricePortion={pricePortion}
                /> */}
          </React.Fragment>
        ))}

        {/* room amenities */}
        <div className="bg-mainBorder h-[3px] w-full mt-2 mb-2"></div>
        <div className="flex w-full justify-start px-7 ">
          <h1 className="text-2xl text-act-text font-bold mt-4 text-notActText">
            Room Amenities:
          </h1>
        </div>
        <div className="grid lg:grid-cols-3 md:grid-cols-3 grid-cols-2 gap-2 w-full justify-start items-start px-7 p-4 mb-4">
          {room.map((roomAmenities) =>
            JSON.parse(JSON.parse(roomAmenities.room_amenities)).map(
              (amenitie, index) => (
                <div className="flex justify-start pr-2" key={index}>
                  <h1 className="text-black font-semibold" key={index}>
                    {amenitie.Amenities}
                  </h1>
                </div>
              )
            )
          )}
        </div>

        {/* building amenities */}
        {/* <div className="bg-mainBorder h-[3px] w-full mt-2 mb-2"></div>
        <div className="flex w-full justify-start px-7 ">
          <h1 className="text-2xl text-act-text font-bold mt-4 text-notActText">
            Building Amenities:
          </h1>
        </div>
        <div className="flex flex-row gap-2 w-full justify-start items-start px-7 p-4 mb-4 overflow-x-auto">
          {buildingAmenities.map(roomItem => (
                    roomItem.buildingAmenities.map(amenity => (
                    <div className='flex justify-center' key={amenity.id}>
                        <div className='h-56 w-48 relative bg-slate-500 rounded-xl border transform duration-75 ease-in-out hover:scale-105 shadow-xl'>
                        <img src={amenity.src} className='object-cover w-full h-full rounded-xl' alt={amenity.name} />               
                        <div className='absolute bottom-0 left-0 right-0 bg-opacity-75 rounded-b-xl bg-gray-900 p-2'>
                            <h1 className='text-white text-center font-semibold'>{amenity.name}</h1>
                        </div>
                        </div>
                    </div>
                    ))
                ))}
        </div> */}
      </div>
      <Footer />
    </>
  );
};

export default BookRoom;
