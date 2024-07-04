import React, { useState, useEffect } from "react";
import logo from "../assets/logo.png";
import { FaBars, FaCircleUser } from "react-icons/fa6";
import { IoCloseSharp } from "react-icons/io5";
import { NavLink } from "react-router-dom"; // Import NavLink
import { useStateContext } from "../contexts/contextProvider";
import MessageModal from "../components/MessageModal";
import ReservationModal from "../components/ReservationModal";
import axiosClient from "../axios";

const Header = () => {
  const Links = [
    { name: "HOME", path: "/home" },
    { name: "CONTACT US", path: "/contact" },
    { name: "REVIEWS", path: "/reviews" },
  ];
  const { auth, roles, logout } = useStateContext();

  const [isOpen, setIsOpen] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  const handleLogout = () => {
    logout('/logout')
  };

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalOpen1, setIsModalOpen1] = useState(false);

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };
  const toggleModal1 = () => {
    setIsModalOpen1(!isModalOpen1);
  };


  const [data, setData] = useState([]);
  const getProfile = () => {
    // setLoading(true);
    axiosClient
      .get("/user")
      .then((res) => {
        return res.data;
      })
      .then((res) => {
        const sortedData = res.data;
        setData(sortedData);
        // setLoading(false);
        console.log(sortedData);
      })
      .catch((err) => {
        console.log(err);
      });
    setTimeout(() => {
      // setLoading(true);
    }, 2000);
  };

  useEffect(() => {
    if (auth && roles === "user") {
      getProfile();
    }
  }, [auth, roles]);


  return (
    <header className="bg-white shadow-md border-b-2 border-bordColor z-50">
      <div className="md:px-10 py-3 px-6 md:flex justify-between items-center relative">
        <NavLink to="/home" path="/home" className="flex text-2xl cursor-pointer items-center gap-2">
          <img src={logo} className="object-contain w-12" alt="Logo" />
        </NavLink>

        <div
          onClick={() => setIsOpen(!isOpen)}
          className="w-7 h-7 absolute top-6 right-8 cursor-pointer md:hidden"
        >
          {isOpen ? <IoCloseSharp /> : <FaBars />}
        </div>

        <ul
          className={`md:flex md:items-center md:pb-0 pb-12 ${isOpen ? "block" : "hidden md:block"
            }`}
        >
          {Links.map((link, index) => (
            <li key={index} className="font-bold my-7 md:my-0 md:ml-8">
              <NavLink
                to={link.path}
                className={({ isActive }) =>
                  isActive
                    ? "text-actText"
                    : "text-notActText hover:text-actText"
                } // Dynamically set the class
              >
                {link.name}
              </NavLink>
            </li>
          ))}

          {auth && roles === 'user' &&
            <>
              <li className="font-bold my-7 md:my-0 md:ml-8 text-notActText cursor-pointer hover:text-actText" onClick={toggleModal1}>
                RESERVATIONS
              </li>
              <NavLink
                to="/home#availableRooms"
                className="bg-actNav text-sm font-bold text-white py-2 px-8 md:ml-8 rounded-full md:static transition duration-75 ease-in-out transform hover:scale-95"
              >
                BOOK NOW
              </NavLink>

              <li
                className="font-semibold my-7 md:my-0 md:ml-8 relative"
                onClick={toggleDropdown}
            >
              <div className="w-10 h-10 rounded-full cursor-pointer" >      
                {data.avatar ? <img src={`https://s3.ap-southeast-2.amazonaws.com/jmstaycation.online/public/${data.avatar}`} alt="Avatar" className="w-10 h-10 rounded-full cursor-pointer" /> : <img src={"https://th.bing.com/th/id/OIP.MtqzdcGHvL8kNnw5IDh1iQHaHa?rs=1&pid=ImgDetMain"} alt="Avatar" className="w-10 h-10 rounded-full cursor-pointer" />}
              </div>
              
                {showDropdown && (
                  <ul className="absolute top-full left-[-150%] bg-white border border-gray-200 rounded-md mt-6 z-10">
                    <li className="py-2 px-4 hover:bg-gray-100">
                      <NavLink to="/profile" className="text-notActText">
                        Profile
                      </NavLink>
                    </li>
                    <li className="py-2 px-4 hover:bg-gray-100 text-notActText cursor-pointer" onClick={toggleModal}>
                      Messages
                    </li>
                    <li className="py-2 px-4 hover:bg-gray-100" onClick={handleLogout}>
                      <a href="#" className="text-notActText">
                        Logout
                      </a>
                    </li>
                  </ul>
                )
                }
              </li>

            </>
          }
          {!auth && roles !== "user" && <NavLink
            to="/login"
            className="bg-actNav text-sm font-bold text-white py-2 px-8 md:ml-8 rounded-full md:static transition duration-75 ease-in-out transform hover:scale-95"
          >
            LOGIN
          </NavLink>}
        </ul>

        {isModalOpen && (
          <MessageModal closeModal={toggleModal} />
        )}

        {isModalOpen1 && (
          <ReservationModal closeModal1={toggleModal1} />
        )}
      </div>
    </header>
  );
};

export default Header;