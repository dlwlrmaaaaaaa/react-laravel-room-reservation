import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import { FaPlus } from "react-icons/fa";
import RoomModal from "../components/RoomModal";
import axiosClient from "../axios";
import Loading from "../components/Loading";
import { useNavigate, Navigate } from "react-router-dom";
import { useStateContext } from "../contexts/contextProvider";

const Rooms = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [roomToEdit, setRoomToEdit] = useState(null);
  const [data, setData] = useState([]);
  const [datos, setDatos] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const [updateRoom, setUpdateRoom] = useState(null);
  const [id, setId] = useState(null);
  const {auth, role, logout} = useStateContext();
  const navigate = useNavigate();

    // if(!auth || role !== 'admin'){
    //   logout('/logout');
    // }

  const getRooms = () => {
    //itong axiosClient ang reference ay ayung nasa axios.js naka default na siya
    //pag hindi ko gagamitin yung config na yun magiging ganto yung codes niya
    //axios.get("http://localhost:8000/api/admin/rooms", {headers: {Authorization: `Bearer token`}})
    axiosClient
      .get("/admin/rooms")
      .then((res) => {
        return res.data;
      })
      .then((res) => {
        res.data.map((item) => setData((prev) => [...prev, item]));
        setLoading(true)
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const openModal = (id) => {
    //pag merong id it will return to update room
    //pag null pang add room
    //check the handleUpdate and handleAddroom functions
    if (id !== null) {
      setIsModalOpen(true);
      setUpdateRoom(true);
      setId(id);
    }
    setIsModalOpen(true);
  };

  useEffect(() => {
    if (!isLoading) {
      getRooms();
    }
  }, [isLoading]);


  const getImage = (item, index) => {
    // Get first image from JSON array
    const fileName = JSON.parse(item.file_name)[0];
  
    return (
      <>
        <img
          key={index}
          src={`http://localhost:8000/storage/images/${fileName}`}
          alt={fileName}
          className="object-cover w-full h-40 rounded-t-xl"
        />
        <div className="flex flex-col items-start p-4">
          <h1 className="text-lg font-semibold text-actText mb-1">
            {item.room_name}
          </h1>
          <h2 className="text-md font-medium text-darkText mb-1">
            ₱{parseFloat(item.price).toLocaleString()}
          </h2>
          <p className="text-sm text-gray-500 line-clamp-3">
            {item.mini_description}
          </p>
        </div>
      </>
    );
  };
  

  return (
    <>
      <section className="w-4/5 grow bg-backColor h-screen overflow-y-auto flex flex-col justify-start items-center gap-2 p-4 scrollbar-thin scrollbar-webkit">
        <div className="flex flex-col bg-mainCol border-b-[1px] border-mainBorder p-4 w-full h-screen rounded-xl justify-between items-center shadow  overflow-y-auto scrollbar-thin scrollbar-webkit">
          <div className="w-full flex flex-col sm:flex-row items-start justify-start">
            <h1 className="text-2xl text-act-text font-semibold">
              Manage Rooms{" "}
            </h1>
          </div>
          <div className="grid sm:grid-cols-4 grid-cols-1 w-full h-screen mt-3 overflow-y-auto scrollbar-thin scrollbar-webkit">
            {!isLoading && <Loading height="40  " width="40" loadingHeight="40" loadingWidth="40"/>}
            {isLoading && (
              data.map((item, index) => (
                <div
                  id="rooms"
                  className="featured flex justify-center cursor-pointer lg:w-96 lg:h-1/2"
                  key={item.id}
                  onClick={() => openModal(item.id)}
                >
                 <div
                  id="roomEdit"
                  key={index}
                  className="w-5/6 h-5/6 bg-white rounded-xl overflow-hidden shadow transition-transform transform hover:rotate-[-3deg] hover:scale-105"
                >
                  {getImage(item, index)}
                </div>

                </div>
              ))
            ) }

          <div
            className="featured flex justify-center cursor-pointer lg:w-96 lg:h-1/2"
          >
            <div
              id="addNew"
              onClick={() => openModal(null)}
              className="w-5/6 h-5/6 relative bg-white rounded-xl flex flex-col items-center justify-center shadow-md hover:shadow-lg hover:bg-darkText hover:text-white transition duration-300 transform hover:rotate-[-3deg] hover:scale-105"
            >
              <FaPlus size={40} />
              <h1 className="mt-2 text-md font-semibold">Add a New Room</h1>
            </div>
          </div>

            {isModalOpen && (
              <RoomModal
                closeModal={closeModal}
                // addNewRoom={addNewRoom}
                // roomToEdit={roomToEdit}
                // roomId={roomToEdit ? roomToEdit.id : null}
                updateRoom={updateRoom}
                setUpdateRoom={setUpdateRoom}
                setId={setId} //setting the id
                roomId={id} //transferring the id
                setData={setData} //Setting the the data to RoomModal
                data={data} //transferring the data to RoomModal
                // deleteRoom={deleteRoom}
                // setData={setData} // Pass the setData function
              />
            )}
          </div>
        </div>
      </section>
    </>
  );
};

//oks na ADD EDIT DELETE
export default Rooms;
