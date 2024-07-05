import React, { useState, useEffect } from "react"; // Import useState
import { MultiSelect } from "primereact/multiselect";
import axiosClient from "../axios";
import { useNavigate } from "react-router-dom";
import { deleteRoom } from "../pages/RoomUtils";

const RoomModal = ({
  closeModal,
  updateRoom,
  roomId,
  setId,
  setUpdateRoom,
  setData,
  data,
}) => {
  const navigate = useNavigate();
  const [roomName, setRoomName] = useState("");
  const [price, setPrice] = useState(0);
  const [miniDes, setMiniDes] = useState("");
  const [description, setDescription] = useState("");
  const [roomAmenitiesData, setRoomAmenitiesData] = useState([]);
  const [buildingAmenitiesData, setBuildingAmenitiesData] = useState([]);
  const [maximum_guest, setMaximumGuest] = useState("");
  const [files, setFiles] = useState([]);
  const [image, setImage] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const [deletedImage, setDeletedImages] = useState([]);
  
  const getData = () => {
    const selectedRoom = data.find(room => roomId === room.id);

    if (selectedRoom) {
      setRoomName(selectedRoom.room_name);
      setPrice(selectedRoom.price);
      setMiniDes(selectedRoom.mini_description);
      setDescription(selectedRoom.description);
      setMaximumGuest(JSON.parse(selectedRoom.maximum_guest));
      setImage(JSON.parse(selectedRoom.file_name));
      setRoomAmenitiesData(JSON.parse(JSON.parse(selectedRoom.room_amenities)))
      // setBuildingAmenitiesData(JSON.parse(JSON.parse(selectedRoom.building_amenities)))
    }
    setLoading(true);
  };

  useEffect(() => {
    getData();
  }, [isLoading]);
  const roomAmenities = [
    { Amenities: "Air-Condition" },
    { Amenities: "Unlimited Wifi" },
    { Amenities: "Smart TV/4k UHD" },
    { Amenities: "Board games" },
    { Amenities: "Double size bed with Pull out bed" },
    { Amenities: "Extra blanket" },
    { Amenities: "Bathroom towel" },
    { Amenities: "Shower Heater" },
    { Amenities: "Complete Kitchenware and Utensils" },
    { Amenities: "Refrigerator" },
    { Amenities: "Microwave" },
    { Amenities: "Rice Cooker" },
    { Amenities: "Induction Cooker" },
    { Amenities: "Electric Kettle" },
    { Amenities: "Free Coffee" },
    { Amenities: "Netflix and Karaoke" },
    { Amenities: "Game Cards" },
  ];
  const buildingAmenities = [
    ,
    { Amenities: "🏊🏻‍♂️ Swimming Pool (adult & kids)" },
    { Amenities: "🏀 Basketball Court" },
    { Amenities: "🏋🏻 Gym " },
    { Amenities: "🏙️ Roof Deck" },
    { Amenities: "🛝 Playground" },
    { Amenities: "🛖 Gazebo" },
    { Amenities: "🚬 Smoking Area" },
    { Amenities: "🔥 Grill Pit" },
  ];

  const handleChange = (e) => {
    e.preventDefault();
    const { name, value } = e.target;
    switch (name) {
      case "roomName":
        setRoomName(value);
        break;
      case "price":
        setPrice(parseFloat(value));
        break;
      case "miniDes":
        setMiniDes(value);
        break;
      case "description":
        setDescription(value);
        break;
      case "roomAmenitiesData":
        setRoomAmenitiesData(value);
        break;
      case "maximum_guest":
        setMaximumGuest(value);
        break;
      default:
        break;
    }
  };

  const handleFileInputChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    if (e.target.files) {
      const fileArray = selectedFiles.map((file) => URL.createObjectURL(file));
      setImage((prevFiles) => [...prevFiles, ...selectedFiles]);
      setFiles((prev) => prev.concat(fileArray));
    }
  };

  const handleDeleteImage = (index) => {
    if (updateRoom) {
      const deletedImage = image[index];
      setImage([...image.slice(0, index), ...image.slice(index + 1)]);
      setDeletedImages((prev) => [...prev, deletedImage]);
    } else {
      setImage([...files.slice(0, index), ...files.slice(index + 1)]);
    }
  };


  const handleModal = () => {
    setUpdateRoom(null);
    setId(null);
    closeModal();
  };

  const handleDeleteRoom = () => {
    deleteRoom(roomId)
      .then(() => {
        window.location.reload();
      })
      .catch(error => {
        console.error('Error deleting room:', error);
      });
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    // const files_image = e.target[0].files; // Assuming this is where you're retrieving the files from the file input

    const formData = new FormData();
    var datas = e.target[0].files;
    for (let i = 0; i < datas.length; i++) {
      formData.append("file_name[]", datas[i]);
    }
    formData.append("room_name", roomName);
    formData.append("price", price);
    formData.append("mini_description", miniDes);
    formData.append("description", description);
    formData.append("room_amenities", JSON.stringify(roomAmenitiesData));
    formData.append("maximum_guest", maximum_guest);
    formData.append("file_name", files);
    if (roomId) {
      axiosClient.post(`/admin/room/${roomId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
        .then(() => {
          window.location.reload()
        }).catch((err) => {
          for (const entry of formData.entries()) {
            console.log(entry);
          }
          console.log(err);
        });
    }
    else {
      axiosClient
        .post("/admin/add-room", formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        })
        .then(() => {
          window.location.reload();
        })
        .catch((err) => {
          for (const entry of formData.entries()) {
            console.log(entry);
          }
          console.log(err);
        });
    }
  };

  const renderImage = (image, index) => {
    if (image instanceof File || (image instanceof Blob && image.type.startsWith('image/'))) {
      const imageURL = URL.createObjectURL(image);
      return (
        <img src={imageURL} className="h-40" alt={`Uploaded Image ${index}`} />
      );
    } else {
      const imageURL = `http://localhost:8000/storage/images/${image}`;
      return (
        <img src={imageURL} className="h-40" alt={`Uploaded Image ${index}`} />
      );
    }
  };

  return (
    <div
      id="container"
      className="fixed top-0 left-0  w-full h-full bg-slate-300 bg-opacity-40 items-center justify-center flex"
      onClick={(e) => {
        if (e.target.id === "container") closeModal();
      }}
    >
      <div
        id="modal"
        className="rounded-md p-3 bg-actNav w-5/6 h-5/6 overflow-auto scrollbar-thin scrollbar-webkit"
      >
        <h1 className="text-2xl font-bold mt-2">{roomId ? "Edit Room" : "Add Room"}</h1>
        <form onSubmit={handleSubmit} encType="multipart/form-data">
          <label className="flex flex-col justify-center items-center">
            <div className="flex flex-col justify-center items-center bg-white text-darkText rounded-xl border border-solid p-3 aspect-square w-40 cursor-pointer">
              + Add Image <br />
              <span className="font-lighter text-sm">Up to 10 Images</span>
              <input
                type="file"
                name="file_name[]"
                className="hidden"
                onChange={handleFileInputChange}
                multiple
                accept="image/jpg, image/jpeg, image/webp"
              />
            </div>
          </label>
          <div className="flex flex-wrap justify-center items-center mt-3 w">
            {image.map((image, index) => (
              <div key={index} className="m-2">
                {renderImage(image, index)}
                <button
                  className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mt-2"
                  onClick={(e) => {
                    e.preventDefault();
                    handleDeleteImage(index);
                  }}
                >
                  Delete Image
                </button>
              </div>
            ))}
          </div>
          <div className="relative p-6 flex-auto">
            <div className="flex flex-wrap">
              <div className="w-1/2 pr-2">
                <label className="block text-black text-sm font-semibold mt-1">
                  {" "}
                  Title:{" "}
                </label>
                <input
                  name="roomName"
                  value={roomName}
                  className="shadow appearance-none border rounded w-full py-1 px-1 bg-white text-darkText"
                  // defaultValue={roomToEdit ? roomToEdit.title : ""}
                  onChange={handleChange}
                />
              </div>
              <div className="w-1/2 pl-2">
                <label className="block text-black text-sm font-semibold mt-1">
                  {" "}
                  Price:{" "}
                </label>
                <input
                  name="price"
                  className="shadow appearance-none border rounded w-full py-1 px-1 bg-white text-darkText"
                  value={roomId && price}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="flex flex-wrap flex-col">
              <div className="w-full borer">
                <label className="block text-black text-sm font-semibold mt-1">
                  {" "}
                  Mini Description:{" "}
                </label>
                <input
                  name="miniDes"
                  value={miniDes}
                  className="shadow appearance-none border rounded w-full py-1 px-1 bg-white text-darkText"
                  // defaultValue={roomToEdit ? roomToEdit.miniDes : ""}
                  onChange={handleChange}
                />
              </div>
              <label className="block text-black text-sm font-semibold mt-1">
                {" "}
                Description:{" "}
              </label>
              <textarea
                id="description"
                type="text"
                value={description}
                className="mt-2 bg-white text-darkText text-mg flex capitalize-first p-2 items-center justify-between shadow rounded-lg resize-none scrollbar-thin scrollbar-webkit"
                style={{
                  width: "100%",
                  height: "100px",
                  wordWrap: "break-word",
                }}
                onChange={handleChange}
                name="description"
              // defaultValue={roomToEdit ? roomToEdit.description : ""}
              />
            </div>

            <div className="flex flex-wrap">
              <div className="w-1/2 pr-2">
                <label className="block text-black text-sm font-semibold mt-1">
                  {" "}
                  Room Amenities:{" "}
                </label>
                <MultiSelect
                  name="roomAmenitiesData"
                  onChange={handleChange} // Make sure handleChange is defined
                  value={roomAmenitiesData}
                  options={roomAmenities}
                  style={{ backgroundColor: 'white', borderColor: '#ccc' }}
                  optionLabel="Amenities"
                  filter
                  placeholder="Select Amenities"
                  className="shadow appearance-none border rounded w-full h-9 bg-white text-darkText justify-center items-center"
                />
              </div>
              <div className="w-1/2 pl-2">
                <label className="block text-black text-sm font-semibold mt-1">
                  {" "}
                  Maximum Guest:{" "}
                </label>
                <input
                  name="maximum_guest"
                  value={maximum_guest}
                  className="shadow appearance-none border rounded w-full py-1 px-1 bg-white text-darkText"
                  // defaultValue={roomToEdit ? roomToEdit.miniDes : ""}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>
          <div className="flex items-center justify-end p-3 border-t border-solid border-darkText rounded-b">
            <button
              className="text-darkText background-transparent active:text-gray-100 font-bold uppercase px-4 py-2 text-sm outline-none focus:outline-none mr-1 mb-1"
              type="button"
              onClick={handleModal}
            >
              {" "}
              Close
            </button>


            {roomId ?
              <>
                <button
                  className="text-white bg-notActText active:bg-yellow-700 font-bold uppercase text-sm px-4 py-2 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1"
                  type="submit"
                >
                  {" "}
                  Update
                </button>
                <button
                  className="text-white bg-red-500 active:bg-red-700 font-bold uppercase text-sm px-4 py-2 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1"
                  type="button"
                  onClick={(e) => {
                    e.preventDefault()
                    handleDeleteRoom()
                  }
                  }
                >
                  {" "}
                  Delete
                </button>
              </>

              : <button
                className="text-white bg-notActText active:bg-yellow-700 font-bold uppercase text-sm px-4 py-2 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1"
                type="submit"
              >
                {" "}
                Submit
              </button>
            }
          </div>
        </form>
      </div>
    </div>
  );
};

//oks na ADD EDIT DELETE
export default RoomModal;