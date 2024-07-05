import React, { useState, useEffect } from "react";
import axiosClient from "../axios";

const Reservation = () => {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();

  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [selectedMonth, setSelectedMonth] = useState(currentMonth);
  const [selectedTime, setSelectedTime] = useState("");
  const [reservationInfo, setReservationInfo] = useState({});
  const [dates, setDates] = useState([]);

  const years = Array.from(
    { length: 10 },
    (_, index) => currentYear - 5 + index
  );

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const weekDayNames = [
    "Sun",
    "Mon",
    "Tue",
    "Wed",
    "Thu",
    "Fri",
    "Sat",
  ];

  const arrangeDays = () => {
    const orderedDates = [];
    const firstDayOfMonth = new Date(selectedYear, selectedMonth, 1);
    let currentDay = new Date(firstDayOfMonth);
    while (currentDay.getDay() !== 0) {
      currentDay.setDate(currentDay.getDate() - 1);
    }
    while (orderedDates.length < 36) {
      orderedDates.push(new Date(currentDay));
      currentDay.setDate(currentDay.getDate() + 1);
    }
    return orderedDates;
  };
  const getDaysInMonth = (year, month) => {
    return new Date(year, month + 1, 0).getDate();
  };
  const isCurrentDay = (date) => {
    return (
      date.getFullYear() === currentDate.getFullYear() &&
      date.getMonth() === currentDate.getMonth() &&
      date.getDate() === currentDate.getDate()
    );
  };

  useEffect(() => {
    const currentTime = new Date();
    const hours = String(currentTime.getHours()).padStart(2, "0");
    const minutes = String(currentTime.getMinutes()).padStart(2, "0");
    setSelectedTime(`${hours}:${minutes}`);
  }, []);
  useEffect(() => {
    const daysInMonth = getDaysInMonth(selectedYear, selectedMonth);
    const newDates = Array.from(
      { length: daysInMonth },
      (_, index) => new Date(selectedYear, selectedMonth, index + 1)
    );
    setDates(newDates);
  }, [selectedYear, selectedMonth]);

  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const handleDateClick = async (date) => {
    try {
      const formattedDate = formatDate(date);
      const response = await axiosClient.get(
        `/reservations-info?date=${formattedDate}`
      );
      const reservationData = response.data;
      setReservationInfo(reservationData);
      setSelectedDate(date);
    } catch (error) {
      console.error("Error fetching reservation data:", error);
    }
  };

  //Render the page
  return (
    <section className="w-4/5 grow font-semibold bg-backColor h-screen overflow-y-auto flex flex-col justify-start items-center gap-2 p-4 scrollbar-thin scrollbar-webkit">
      <div
        id="main-section"
        className="grid lg:grid-cols-3 grid-cols-1 gap-4 w-full h-full"
      >
        {/* Select Day */}
        <div className="col-span-1 lg:col-span-2">
          <div className="bg-mainCol mt-2 border-b-[1px] border-mainBorder p-4 rounded-xl shadow">
            <h2 className="text-3xl text-act-text font-semibold py-2">
              Reserve Day:
            </h2>
            <div className="grid grid-cols-7 gap-2 md: flex">
              {weekDayNames.map((dayName, index) => (
                <div
                  key={index}
                  className="text-center bg-backColor text-lg md:text-base border border-bordColor border-300 rounded-xl mt-4 flex-grow"
                >
                  {dayName}
                </div>
              ))}
              {arrangeDays().map((date) => (
                <button
                  key={date}
                  className={`date-button ${
                    selectedDate && selectedDate.getTime() === date.getTime()
                      ? "text-black bg-bordColor border-black"
                      : date.getMonth() !== selectedMonth
                      ? "bg-mainBg border-none"
                      : "bg-mainBg border-gray-300 border border--300"
                  } rounded-xl px-4 py-2 m-1 hover:bg-actNav`}
                  style={{
                    backgroundColor: (() => {
                      const status = reservationInfo[date.getTime()]
                        ? reservationInfo.room_status
                        : "Vacant";
                      console.log("Booking Start:", reservationInfo.checkin);
                      console.log("Booking End:", reservationInfo.checkout);
                      const bookingStart = new Date(reservationInfo.checkin);
                      const bookingEnd = new Date(reservationInfo.checkout);

                      // Clone the date to avoid modifying the original
                      const clonedDate = new Date(date);
                      // Set time to 0 to compare only dates
                      clonedDate.setHours(0, 0, 0, 0);
                      // Set booking start time to 0
                      bookingStart.setHours(0, 0, 0, 0);
                      // Set booking end time to 23:59:59.999
                      bookingEnd.setHours(23, 59, 59, 999);

                      console.log("Booking Start (Parsed):", bookingStart);
                      console.log("Booking End (Parsed):", bookingEnd);
                      if (
                        !isNaN(bookingStart.getTime()) && // Check if the date is valid
                        !isNaN(bookingEnd.getTime()) && // Check if the date is valid
                        clonedDate >= bookingStart &&
                        clonedDate <= bookingEnd &&
                        date.getMonth() === selectedMonth
                      ) {
                        if (reservationInfo.room_status === "Reserved") {
                          return "#ed4242"; // Red for reserved rooms
                        }
                      } else if (date.getMonth() !== selectedMonth) {
                        return "rgba(240, 240, 240, 0.5)"; // Grayed out for dates in other months
                      } else if (isCurrentDay(date)) {
                        return "#bef264"; // Light green for current day
                      }
                      return ""; // Default color
                    })(),
                    borderColor: "black",
                  }}
                  onClick={() => handleDateClick(date)}
                  disabled={date.getMonth() !== selectedMonth} // Disable buttons for dates in other months
                >
                  {date.getDate()}
                </button>
              ))}
            </div>
          </div>
          {/* Date Info if it's reserved */}
          <div key="" className="col-span-1 lg:col-span-2 py-4">
            <div className="bg-mainCol mt-2 border-b-[1px] border-mainBorder p-4 rounded-xl shadow">
              <h2 className="text-act-text font-semibold py-2 text-3xl">
                Reservation Info:
              </h2>
              {selectedDate && (
                <div className="bg-backColor rounded-md w-full overflow-wrap flex-col justify-start items-center gap-2 mt-2 p-2">
                  <p className="mt-4">{`Reservation Date: ${reservationInfo.reservation_date}`}</p>
                  <p className="mt-4">{`Room: ${reservationInfo.room_name}`}</p>
                  <p className="mt-4">{`Check-in Date: ${reservationInfo.checkin}`}</p>
                  <p className="mt-4">{`Customer Name: ${reservationInfo.customer_name}`}</p>
                  <p className="mt-4">{`Contact Number: ${reservationInfo.contact_number}`}</p>
                  <p className="mt-4">{`Email Address: ${reservationInfo.email_address}`}</p>
                  <p className="mt-4">{`Check-out Date: ${reservationInfo.checkout}`}</p>
                  <p className="mt-4">{`Room Status: ${reservationInfo.room_status}`}</p>
                </div>
              )}
            </div>
          </div>
        </div>
        {/* Select Year, Time, and Month */}
        {/* Select Year */}
        <div className="col-span-1 lg:col-span-1">
          <div className="bg-mainCol mt-2 pt-1 border-b-[1px] border-mainBorder p-4 rounded-xl shadow">
            <h2 className="py-2 text-3xl text-center">- Year -</h2>
            <select
              value={selectedYear || ""}
              onChange={(e) => {
                const newYear = parseInt(e.target.value);
                setSelectedYear(newYear);
              }}
              className="border border-gray-300 px-4 py-2 w-full"
            >
              {years.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
            {/*Select Month */}
            <div className="bg-mainCol py-2">
              <h2 className="py-2 text-3xl text-center">- Month -</h2>
              <select
                value={selectedMonth || ""}
                onChange={(e) => {
                  const newMonth = parseInt(e.target.value);
                  setSelectedMonth(newMonth);
                }}
                className="border border-gray-300 px-4 py-2 w-full"
              >
                {monthNames.map((month, index) => (
                  <option key={index} value={index}>
                    {month}
                  </option>
                ))}
              </select>
            </div>
            {/* Select Time */}
            <div className="bg-mainCol py-2 ">
              <h2 className="py-2 text-3xl text-center">- Time -</h2>
              <input
                type="time"
                value={selectedTime}
                onChange={(e) => setSelectedTime(e.target.value)}
                className="border border-gray-300 px-4 py-2 w-full"
              />
            </div>
          </div>
          {/* Reservation Part diko pa lang alam gagawin hehe */}
        </div>
      </div>
    </section>
  );
};

export default Reservation;
//Documentations needed too para magets hehe at di makalimutan purposes of each part ng code
