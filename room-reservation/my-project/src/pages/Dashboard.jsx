import React, { useState, useEffect } from "react";
import { FaUser } from "react-icons/fa";
import { FaHouse, FaRegCalendarCheck } from "react-icons/fa6";
import { Navigate } from "react-router-dom";
import Rooms from "./Rooms";
import { useStateContext } from "../contexts/contextProvider";
import { NavLink } from "react-router-dom";
import axiosClient from "../axios";
import axios from "../axios";
import Loading from "../components/Loading";

const Dashboard = () => {
  const [isLoading, setLoading] = useState(false);
  const [isLoading1, setLoading1] = useState(false);
  const [data, setData] = useState([]);
  const [data1, setData1] = useState([]);
  const [userCount, setUserCount] = useState(0);
  const [roomCount, setRoomCount] = useState(0);
  const [reservationCount, setReservationCount] = useState(0);

  const statusColors = {
    "status-paid": "#90ee90",  // Light green
    "status-pending": "#ffcc00",    // Yellow
    "status-cancelled": "#ff6347",  // Tomato
    "status-done": "##9da19e",  // Light grey
  };

  const getReservations = () => {
    axiosClient
      .post("/admin/dashboard")
      .then((res) => {
        return res.data;
      })
      .then((res) => {
        const sortedData = res.data.sort((a, b) => new Date(b.starting_date) - new Date(a.starting_date));
        const rows = sortedData.slice(0, 6);
        setData(rows);
      })
      .catch((err) => {
        console.log(err);
      });
    setTimeout(() => {
      setLoading(true);
    }, 3000);
  };

  useEffect(() => {
    if (!isLoading) {
      getReservations();
    }
  }, [isLoading]);

  const getReviews = () => {
    axiosClient
      .post("/admin/dashboard/reviews")
      .then((res) => {
        return res.data;
      })
      .then((res) => {
        const sortedData = res.data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        const rows = sortedData.slice(0, 4);
        setData1(rows);
      })
      .catch((err) => {
        console.log(err);
      });
    setTimeout(() => {
      setLoading1(true);
    }, 3000);
  };

  useEffect(() => {
    if (!isLoading1) {
      getReviews();
    }
  }, [isLoading1]);

  useEffect(() => {
    axios.get('/admin/dashboard/user-count')
      .then(response => {
        setUserCount(response.data.count);
      })
      .catch(error => {
        console.error('Error fetching user count:', error);
      });

    axios.get('/admin/dashboard/room-count')
      .then(response => {
        setRoomCount(response.data.count);
      })
      .catch(error => {
        console.error('Error fetching room count:', error);
      });

    axios.get('/admin/dashboard/reservation-count')
      .then(response => {
        setReservationCount(response.data.count);
      })
      .catch(error => {
        console.error('Error fetching reservation count:', error);
      });
  }, []);

  return (
    <>
      <section className="w-4/5 grow bg-backColor h-screen overflow-y-auto flex flex-col justify-start items-center gap-2 p-4 scrollbar-thin scrollbar-webkit">
        <div
          id="main-section"
          className="grid lg:grid-cols-3 grid-cols-1 gap-4 w-full h-screen"
        >
          <div
            id="left"
            className="col-span-2 p-3 gap-3 flex flex-col justify-between items-center h-full"
          >
            {/* 3 pins on above */}
            <div className="grid sm:grid-cols-3 grid-cols-1 gap-4 w-full mb-2">
              <NavLink to="/rooms"
                className="w-full flex flex-col items-center justify-center bg-mainCol border-b-[1px] border-mainBorder p-2 rounded-xl gap-5 
                transition-transform transfrom hover:rotate-[-5deg] hover:scale-105 shadow"
              >
                <div className="w-full flex justify-between items-center">
                  <h1 className="text-md text-act-text font-semibold">Rooms</h1>
                </div>
                <div className="w-full flex justify-between items-center">
                  <div className="flex flex-col justify-center items-start gap-1">
                    <h1 className="text-3xl text-black font-semibold">{roomCount}</h1>
                    <p className="text-slate-700">Current Rooms</p>
                  </div>
                  <div className="bg-cirlce hover:bg-hoverCirlce cursor-pointer text-black p-3 rounded-full">
                    <FaHouse className="w-[30px] h-[30px]" />
                  </div>
                </div>
              </NavLink>
              <NavLink to="/reservation"
                className="w-full flex flex-col items-center justify-center bg-mainCol border-b-[1px] border-mainBorder p-2 rounded-xl gap-5 
                transition-transform transfrom hover:rotate-[-5deg] hover:scale-105 shadow"
              >
                <div className="w-full flex justify-between items-center">
                  <h1 className="text-md text-act-text font-semibold">
                    Reservations
                  </h1>
                </div>
                <div className="w-full flex justify-between items-center">
                  <div className="flex flex-col justify-center items-start gap-1">
                    <h1 className="text-3xl text-black font-semibold">{reservationCount}</h1>
                    <p className="text-slate-700">Reservations</p>
                  </div>
                  <div className="bg-cirlce hover:bg-hoverCirlce cursor-pointer text-black p-3 rounded-full">
                    <FaRegCalendarCheck className="w-[30px] h-[30px]" />
                  </div>
                </div>
              </NavLink>

              <NavLink to="/users"
                className="w-full flex flex-col items-center justify-center bg-mainCol border-b-[1px] border-mainBorder p-2 rounded-xl gap-5 
                transition-transform transfrom hover:rotate-[-5deg] hover:scale-105 shadow"
              >
                <div className="w-full flex justify-between items-center">
                  <h1 className="text-md text-act-text font-semibold">Users</h1>
                </div>
                <div className="w-full flex justify-between items-center">
                  <div className="flex flex-col justify-center items-start gap-1">
                    <h1 className="text-3xl text-black font-semibold">{userCount}</h1>
                    <p className="text-slate-700">Current Users</p>
                  </div>
                  <div className="bg-cirlce hover:bg-hoverCirlce cursor-pointer text-black p-3 rounded-full">
                    <FaUser className="w-[30px] h-[30px]" />
                  </div>
                </div>
              </NavLink>
            </div>

            {/* reservation table */}
            <div className="bg-mainCol border-b-[1px] border-mainBorder p-4 w-full h-full rounded-xl flex-col justify-center items-center gap-6 shadow">
              <h1 className="text-2xl text-act-text font-semibold">
                Recent Reservations
              </h1>
              <div
                id="table"
                className="p-7 h-full mt-1 rounded-xl"
                style={{ maxHeight: "85%" }}
              >
                <table className="w-full">
                  <thead>
                    <tr className="border-b-[1px] border-hoverCirlce">
                      <th className="p-3 text-sm font-semibold tracking-wide text-left">
                        No.
                      </th>
                      <th className="p-3 text-sm font-semibold tracking-wide text-left">
                        Room
                      </th>
                      <th className="p-3 text-sm font-semibold tracking-wide text-left">
                        Start Date
                      </th>
                      <th className="p-3 text-sm font-semibold tracking-wide text-left">
                        End Date
                      </th>
                      <th className="p-3 text-sm font-semibold tracking-wide text-left">
                        Status
                      </th>
                    </tr>
                  </thead>
              
                  <tbody className="divide-y divide-hoverCirlce">

                    {isLoading && (
                      data.map((item, index) => (
                        <tr key={index} className="border-b-[1px] border-hoverCircle hover:bg-actNav cursor-pointer">
                          <td className="p-3 text-sm text-gray-700">
                            <a href="#" className="font-bold text-darkText hover:underline">
                              {item.id}
                            </a>
                          </td>
                          <td className="p-3 text-sm text-gray-700">{item.room_name}</td>
                          <td className="p-3 text-sm text-gray-700">{item.starting_date}</td>
                          <td className="p-3 text-sm text-gray-700">{item.ending_date}</td>
                          <td className="p-3 text-sm justify-center items-center text-gray-700 rounded-full flex font-bold mt-2" style={{ backgroundColor: statusColors[`status-${item.status.toLowerCase()}`] }}>
                            {item.status}
                          </td>
                        </tr>
                      )))}
                  </tbody>
                </table>
              </div>
              <h1
                id="reserSee"
                className="text-sm text-black font-semibold flex justify-end mt-2"
              >
                <NavLink to="/reservation" className="font-bold text-darkText hover:underline">
                  See More
                </NavLink>
              </h1>
            </div>
          </div>

          <div
            id="right"
            className="p-2 flex flex-col justify-center items-center gap-4 h-screen"
          >
            <div className="bg-mainCol border-b-[1px] border-mainBorder p-4 w-full h-full rounded-xl flex-col justify-center items-center gap-6 shadow">
              <div className="w-full flex justify-between items-center">
                <h1 className="text-2xl text-act-text font-semibold mb-1">
                  Recent Feedbacks
                </h1>
              </div>
              <div
                className="overflow-y-auto container scrollbar-thin scrollbar-webkit "
                style={{ maxHeight: "90%" }}
              >
                {isLoading && (
                  data1.map((item, index) => (
                    <div
                      key={index}
                      id="reviews"
                      className="bg-backColor hover:bg-actNav rounded-md w-full overflow-wrap flex-col justify-start items-center gap-2 mt-2 p-2"
                    >
                      <h1 className="text-xl text-darkText font-semibold">
                        {item.name}
                      </h1>
                      <div className='grid grid-cols-5 mt-2 gap-3'>
                        {[item.rating].map((value) => (
                          <div
                            key={value}
                            value={value} >
                            {Array(value).fill('⭐').join('')}
                          </div>
                        ))}
                      </div>
                      <p className="text-slate-700 mt-2 break-words">
                        {item.comment}
                      </p>
                    </div>
                  )))}
              </div>
              <h1 className="text-sm font-semibold flex justify-end mt-2">
                <NavLink to="/reviews" className="font-bold text-darkText hover:underline">
                  See More
                </NavLink>
              </h1>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Dashboard;