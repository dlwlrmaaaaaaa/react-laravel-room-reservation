import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Carousel from "../components/Carousel";
import br1 from "../assets/br1.jpg";
import br2 from "../assets/br2.jpg";
import axiosClient from "../axios";
import getRooms from "./axios/getRoom";

const Home = () => {
  const navigate = useNavigate();
  const [rooms, setRooms] = useState([]);
  const location = useLocation();

  useEffect(() => {
    getRooms()
      .then((res) => {
        localStorage.removeItem("room");
        return res.data;
      })
      .then((res) => {
        setRooms(res.data);
      });
  }, []);

  const checkRoom = (id) => {
    axiosClient
      .get("/room/" + id)
      .then((res) => {
        return res.data.data;
      })
      .then((res) => {
        localStorage.setItem("room", JSON.stringify(res));
        localStorage.setItem("room_id", JSON.stringify(res.id));
        navigate("/book");
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const renderImage = (room, room_id) => {
    const file_name = JSON.parse(room.file_name)[0];
    return (
      <img
        src={`http://localhost:8000/storage/images/${file_name}`}
        className=" object-cover w-full h-full px-1 py-1"
        alt={room.room_name}
        key={room_id}
        onClick={(e) => {
          e.preventDefault();
          checkRoom(room_id);
        }}
      ></img>
    );
  };
  useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace("#", "");
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, [location]);

  return (
    <>
      <Header />
      <div className="w-full grow bg-backColor h-auto flex flex-col justify-start items-center">
        {/* image slider */}
        <div className="w-full m-auto">
          <Carousel />
        </div>

        <div
          id="availableRooms"
          className="flex items-center justify-center border-actNav"
        >
          <h1 className="text-actText text-4xl font-bold m-5">
            Available Rooms
          </h1>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 md:grid-cols-2 mt-3 mb-5 p-3 justify-center ">
          {rooms.map((room) => (
            <div
              id="rooms"
              className="flex justify-center cursor-pointer p-4"
              key={room.id}
            >
              <div
                id="roomEdit"
                className="lg:w-full w-full flex flex-col bg-white rounded-xl gap-4 border transform duration-75 ease-in-out shadow-xl"
              >
                {renderImage(room, room.id)}
                <div className="w-full pt-5 bg-white z-10 transition-all ease-in-out flex flex-col items-center justify-center">
                  <div className="text-lg font-semibold">{room.room_name}</div>
                  <div className="text-sm text-gray-500 mt-1 line-clamp-2">{room.mini_description}</div>
                  <div className="text-sm text-gray-500 mt-1 line-clamp-2">{room.description}</div>
                  <div className="text-xl font-bold mt-2">₱{room.price}</div>
                  <div className="mt-4 p-5">
                    <button
                      className="bg-actText text-white px-4 py-2 rounded-md font-bold"
                      onClick={(e) => {
                        e.preventDefault();
                        checkRoom(room.id);
                      }}
                    >
                      View
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Home;
