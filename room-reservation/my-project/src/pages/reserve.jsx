import React, { useState, useEffect } from 'react';

//Beware of my spaghetti code sorry po medyo naguguluhan pa me sa ReactJS
const Reservation = () => {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();

  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [selectedMonth, setSelectedMonth] = useState(currentMonth);
  const [selectedTime, setSelectedTime] = useState('');
  const [reservationInfo, setReservationInfo] = useState({});
  const [dates, setDates] = useState([]);
  const [roomNum, setRoomNum] = useState('Room 1'); // Initialize with 'Room 1'

  const roomOptions = ['Room 1', 'Room 2']; // Array of room options

  const years = Array.from({ length: 10 }, (_, index) => currentYear - 5 + index);

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const weekDayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  useEffect(() => {
    const fetchReservationStatus = async () => {
      const fetchedInfo = {};
      const arrangedDates = arrangeDays();
      for (const date of arrangedDates) {
        try {
          const info = await fetchReservationInfo(date);
          fetchedInfo[date.getTime()] = info.status;
        } catch (error) {
          console.error('Error fetching reservation info:', error);
          fetchedInfo[date.getTime()] = 'Vacant'; // Set default to Vacant if fetching fails
        }
      }
      setReservationInfo(fetchedInfo);
    };
    fetchReservationStatus();
  }, [selectedYear, selectedMonth]);

  // Function to handle date selection
  const handleDateClick = (date) => {
    setSelectedDate(date);
  };

  // Function to fetch reservation info for a specific date
  const fetchReservationInfo = async (date) => {
    try {
      // Implement logic to get the information from the database natin
      // reservation info
      const dayOfWeek = date.getDay();
      let status, room;
      if (dayOfWeek === 0 || dayOfWeek === 6) {
        status = 'Occupied'; // SAMPLE TESTING PURO WEEKENDS TO
        room = 'Room ni Winter'; // SAMPLE
      } else if (dayOfWeek === 1 || dayOfWeek === 3 || dayOfWeek === 5) {
        status = 'Reserved'; // Room is reserved on weekdays (Mon, Wed, Fri) sample only muna 
        room = 'Room ni Mina hehe'; // Example: set room name for reserved days
      } else {
        status = 'Vacant'; // Room is vacant on other weekdays (Tue, Thu)
        room = 'Room ni Rei hehe'; // Example: set room name for vacant days
      }

      // Sample reservation info object containing room status, room name, and date
      const info = {
        date: date.toDateString(),
        name: "Sean Lowie Berbon", 
        status: status,
        room: room,
        // Add more reservation information as needed
      };
      return info;
    } catch (error) {
      throw new Error('Failed to fetch reservation info');
    }
  };

  const arrangeDays = () => {
    // Function to arrange dates in a grid-like structure for display
    const orderedDates = [];
    const firstDayOfMonth = new Date(selectedYear, selectedMonth, 1);
    let currentDay = new Date(firstDayOfMonth);

    // Loop to find the start of the week for the first day of the month
    while (currentDay.getDay() !== 0) {
      currentDay.setDate(currentDay.getDate() - 1);
    }

    // Loop to populate the orderedDates array with dates for display
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
    // Function to check if a given date is the current day
    return (
      date.getFullYear() === currentDate.getFullYear() &&
      date.getMonth() === currentDate.getMonth() &&
      date.getDate() === currentDate.getDate()
    );
  };

  useEffect(() => {
    // Effect to set the current time when the component mounts
    const currentTime = new Date();
    const hours = String(currentTime.getHours()).padStart(2, '0');
    const minutes = String(currentTime.getMinutes()).padStart(2, '0');
    setSelectedTime(`${hours}:${minutes}`);
  }, []);

  useEffect(() => {
    // Effect to update the dates array when the selected year or month changes
    const daysInMonth = getDaysInMonth(selectedYear, selectedMonth);
    const newDates = Array.from({ length: daysInMonth }, (_, index) => new Date(selectedYear, selectedMonth, index + 1));
    setDates(newDates);
  }, [selectedYear, selectedMonth]);

  useEffect(() => {
    // Effect to fetch reservation status for each date when the selected year or month changes
    const fetchReservationStatus = async () => {
      const fetchedInfo = {};
      const arrangedDates = arrangeDays();
      for (const date of arrangedDates) {
        try {
          const info = await fetchReservationInfo(date);
          // Check if the fetched info contains all necessary properties medyo nabaliw ako sa part na to 
          if (info && info.date && info.name && info.status && info.room) {
            fetchedInfo[date.getTime()] = info;
          } else {
            console.error('Incomplete reservation info:', info);
            fetchedInfo[date.getTime()] = { status: 'Vacant' }; // Set default to Vacant if info is incomplete
          }
        } catch (error) {
          console.error('Error fetching reservation info:', error);
          fetchedInfo[date.getTime()] = { status: 'Vacant' }; // Set default to Vacant if fetching fails
        }
      }
      setReservationInfo(fetchedInfo);
    };
    fetchReservationStatus();
  }, [selectedYear, selectedMonth]);

  //Render the page
  return (
    <section className='w-4/5 grow font-semibold bg-backColor h-screen overflow-y-auto flex flex-col justify-start items-center gap-2 p-4 scrollbar-thin scrollbar-webkit'>
      <div id='main-section' className='grid lg:grid-cols-3 grid-cols-1 gap-4 w-full h-full'>
        {/* Select Day */}
        <div className="col-span-1 lg:col-span-2">
          <div className="bg-mainCol mt-2 border-b-[1px] border-mainBorder p-4 rounded-xl shadow">
            <h2 className='text-3xl text-act-text font-semibold py-2'>Reserve Day:</h2>
            <div className="grid grid-cols-7 gap-2">
              {weekDayNames.map((dayName, index) => (
                <div key={index} className="text-center bg-backColor text-lg border border-bordColor border--300 rounded-xl mt-4">{dayName}</div>
              ))}
              {arrangeDays().map(date => (
                <button
                  key={date}
                  className={`date-button ${
                    selectedDate && selectedDate.getTime() === date.getTime() ? 'text-black bg-bordColor border-black' : (date.getMonth() !== selectedMonth ? 'bg-mainBg border-none' : 'bg-mainBg border-gray-300 border border--300')
                  } rounded-xl px-4 py-2 m-1 hover:bg-actNav`}
                  style={{
                    backgroundColor: (() => {
                      const status = reservationInfo[date.getTime()] ? reservationInfo[date.getTime()].status : 'Vacant';
                      if (date.getMonth() !== selectedMonth) {
                        return 'rgba(240, 240, 240, 0.5)'; // Grayed out for dates in other months
                      } else if (isCurrentDay(date)) {
                        return '#bef264'; // Light green for current day
                      } else {
                        switch (status) {
                          case 'Reserved':
                            return '#ed4242'; // Light red for reserved
                          case 'Occupied':
                            return '#ADD8E6'; // Light blue for occupied
                          default:
                            return ''; // Set empty string or null for default (no background color)
                        }
                      }
                    })(),
                    borderColor: 'black',
                  }}
                  onClick={() => handleDateClick(date)
                    
                  }
                  disabled={date.getMonth() !== selectedMonth} // Disable buttons for dates in other months
                >
                  {date.getDate()}
                </button>
              ))}
            </div>
          </div>
          {/* Date Info if it's reserved */}
          <div key="reservationInfo" className="col-span-1 lg:col-span-2 py-4">
            <div className='bg-mainCol mt-2 border-b-[1px] border-mainBorder p-4 rounded-xl shadow'>
              <h2 className='text-act-text font-semibold py-2 text-3xl'>Reservation Info:</h2>
              {/* Render reservation info based on selected date */}
              {reservationInfo && reservationInfo[selectedDate?.getTime()] && (
                <div className='bg-backColor rounded-md w-full overflow-wrap flex-col justify-start items-center gap-2 mt-2 p-2'>
                  <p className="mt-4">{`Reservation Date: ${reservationInfo[selectedDate.getTime()].date}`}</p>
                  <p className="mt-4">{`Customer Name: ${reservationInfo[selectedDate.getTime()].name}`}</p>
                  <p className="mt-4">{`Contact Number: `}</p>
                  <p className="mt-4">{`Email Address: `}</p>
                  <p className="mt-4">{`Room: ${reservationInfo[selectedDate.getTime()].room}`}</p>
                  <p className="mt-4">{`Room Details: `}</p>
                  <p className="mt-4">{`Room Status: ${reservationInfo[selectedDate.getTime()].status}`}</p>
                  {/* Add more reservation information as needed */}
                </div>
              )}
            </div>
          </div>
        </div>
        {/* Select Year, Time, and Month */}
        {/* Select Year */}
        <div className="col-span-1 lg:col-span-1">
          <div className="bg-mainCol mt-2 pt-1 border-b-[1px] border-mainBorder p-4 rounded-xl shadow">
            <h2 className='py-2 text-3xl text-center'>- Year -</h2>
            <select
              value={selectedYear || ''}
              onChange={(e) => {
                const newYear = parseInt(e.target.value);
                setSelectedYear(newYear);
              }}
              className="border border-gray-300 px-4 py-2 w-full"
            >
              {years.map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
            {/*Select Month */}
            <div className='bg-mainCol py-2'>
              <h2 className='py-2 text-3xl text-center'>- Month -</h2>
              <select
                value={selectedMonth || ''}
                onChange={(e) => {
                  const newMonth = parseInt(e.target.value);
                  setSelectedMonth(newMonth);
                }}
                className="border border-gray-300 px-4 py-2 w-full"
              >
                {monthNames.map((month, index) => (
                  <option key={index} value={index}>{month}</option>
                ))}
              </select>
            </div>
            {/* Select Time */}
            <div className="bg-mainCol py-2 ">
              <h2 className='py-2 text-3xl text-center'>- Time -</h2>
              <input
                type="time"
                value={selectedTime}
                onChange={e => setSelectedTime(e.target.value)}
                className="border border-gray-300 px-4 py-2 w-full"
              />
            </div>
          </div>
          {/* Reservation Part diko pa lang alam gagawin hehe */}
          <div className="bg-mainCol mt-4 pt-1 border-b-[1px] border-mainBorder p-4 rounded-xl shadow">
            {/* Add your content for the new grid here */}
            <h2 className='py-2 text-3xl text-center'>- Room Number -</h2>
            <div className="bg-mainCol py-2 flex justify-center items-center">
              <div className='bg-backColor rounded-md w- overflow-wrap flex-col justify-center items-center gap-2 mt-2 p-2'>
              <select 
                value={roomNum}
                onChange={(e) => setRoomNum(e.target.value)}
              >
                {roomOptions.map((room, index) => (
                  <option key={index} value={room}>{room}</option>
                ))}
              </select>
              {/* WORK IN PROGRESS DIKO PA ALAM ILALAGAY HAHAHAHHAHAHA*/}
              </div>
            </div>
            <div className="flex justify-center">
              <button className="bg-notActText hover:bg-cirlce text-white font-bold py-2 px-4 rounded mt-4">
                Extra Button
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Reservation;
//Documentations needed too para magets hehe at di makalimutan purposes of each part ng code