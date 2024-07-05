import React, { useEffect, useState } from "react";
import { MdDashboard, MdLogout } from "react-icons/md";
import { FaHouse, FaMessage } from "react-icons/fa6";
import { FaArrowRight, FaUser, FaRegCalendarCheck } from "react-icons/fa";
import { motion } from "framer-motion";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useStateContext } from "../contexts/contextProvider";

const variants = {
  expanded: { width: "20%" },
  nonExpanded: { width: "5%" },
};


const navItems = [
  {
    name: "Dashboard",
    icon: MdDashboard,
    path: "/dashboard",
  },
  {
    name: "Inbox",
    icon: FaMessage,
    path: "/inbox",
  },
  {
    name: "Rooms",
    icon: FaHouse,
    path: "/rooms",
  },
  {
    name: "Reservation",
    icon: FaRegCalendarCheck,
    path: "/reservation",
  },
  {
    name: "Users",
    icon: FaUser,
    path: "/users",
  },
];

const Sidebar = () => {
  const { logout, auth, roles } = useStateContext();
  const [isExpanded, setIsExpanded] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  if (!auth && roles !== "admin") {
    navigate('/');
  }
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      setIsExpanded(width > 768);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const logoUrl = "./src/assets/logo.png";
  const handleLogout = () => {
    logout('/logout');
  };
  return (

    <motion.section
      animate={isExpanded ? "expanded" : "nonExpanded"}
      variants={variants}
      className={
        "w-1/5 bg-mainBg border-r-2 border-bordColor h-screen flex flex-col justify-between items-center gap-10 relative " +
        (isExpanded ? "py-8 px-6 " : "px-8 py-6")
      }
    >
      <div className="flex flex-col justify-content items-center gap-8">
        {isExpanded ? (
          <div id="logo-box">
            <img src={logoUrl} className="object-contain w-40" alt="Logo" />
          </div>
        ) : (
          <div className="flex justify-center items-center">
            <img src={logoUrl} className="object-contain w-20" alt="Logo" />
          </div>
        )}

        <div
          id="navlinks-box"
          className="flex flex-col justify-center items-start gap-4 w-full mt-4"
        >
          {navItems.map((item, index) => (
            <NavLink
              key={item.name} 
              to={item.path}
              className={({ isActive }) =>
                `flex justify-start items-center gap-4 w-full cursor-pointer rounded-xl hover:bg-actNav hover:shadow-xl hover:text-actText ${isActive ? "bg-actNav text-actText font-bold" : ""
                } ${isExpanded ? "px-6 py-1" : "p-1"}`
              }
              onClick={() => handleNavItemClick(index)}
            >
              <div className="bg-cirlce p-2 rounded-full">
                <item.icon className="md:w-6 w-4 h-4 md:h-6" />
              </div>
              <span className={"text-lg " + (isExpanded ? "flex" : "hidden")}>
                {item.name}
              </span>
            </NavLink>
          ))}
        </div>
      </div>

      <div
        id="expanded-icon"
        className={`bg-actNav text-actText p-2 rounded-full cursor-pointer absolute -right-4 bottom-20 md:bottom-40 md:flex hidden transition-transform ${isExpanded ? "rotate-180" : ""
          }`}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <FaArrowRight />
      </div>

      <div
        id="logout-box"
        className="w-full flex flex-col justify-start items-center gap-3 cursor-pointer"
        onClick={handleLogout}
      >
        <div className="bg-mainBorder w-full h-[1px]"></div>
        <div className="flex justify-center items-center gap-2"
        >
          <MdLogout className="text-darkText h-6 w-6 hover:text-actText" />
          <span
            className={
              "text-darkText text-lg " +
              (isExpanded ? "flex hover:text-actText font-bold" : "hidden")
            }
          >
            Logout
          </span>
        </div>
      </div>
    </motion.section>

  );
};

export default Sidebar;
