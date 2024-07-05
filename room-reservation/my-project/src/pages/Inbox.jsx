import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import { FaCaretDown, FaEye } from "react-icons/fa";
import { MdDeleteForever } from "react-icons/md";
import DataTable from "react-data-table-component";
import axiosClient from "../axios";

const Inbox = () => {
  const [isActive, setIsActive] = useState(false);
  const [selected, setSelected] = useState("");
  const [selectedOption, setSelectedOption] = useState("Choose a User");
  const [options, setOptions] = useState([]);
  const [message, setMessage] = useState("");
  const [data, setData] = useState([{}]);

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const response = await axiosClient.get("/inbox");
        const names = response.data;
        setOptions(names);
      } catch (error) {
        console.error("Error fetching options:", error);
      }
    };
    const fetchData = async () => {
      try {
        const response = await axiosClient.get("/user-messages"); 
        const messages = response.data.map((message) => ({
          id: message.id,
          name: message.name,
          message: message.user_messages, 
          date: message.date,
        }));
        const sortedData = messages.sort((a, b) => new Date(b.date) - new Date(a.date));
        setData(sortedData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchOptions();
    fetchData();
  }, []);
  console.log(data);
  const sendMessage = async () => {
    try {
      const response = await axiosClient.post("/inbox/message", {
        receiver_email: selectedOption,
        message: message,
      });

      setMessage("");
      setSelectedOption("Choose a User");
    } catch (error) {
      console.error("Error sending message", error);
    }
  };

  const handleOptionSelect = (option) => {
    setSelected(option.name);
    setSelectedOption(option.name);
    setIsActive(false);
  };

  const handleDelete = async (id) => {
    try {
      await axiosClient.delete(`/inbox/messages/${id}`);
      setData(data.filter((item) => item.id !== id));
      window.location.reload(); 
    } catch (error) {
      console.error("Error deleting message:", error);
    }
  };

  const columns = [
    // {
    //   name: "ID",
    //   selector: (row) => row.id,
    //   cell: (row) => <div style={{ wordWrap: "break-word" }}>{row.id}</div>,
    //   width: "7%",
    // },
    {
      name: "Name",
      selector: (row) => row.data.name,
      cell: (row) => <div style={{ wordWrap: "break-word" }}>{row.name}</div>,
      width: "20%",
    },
    {
      name: "Message",
      selector: (row) => row.message,
      cell: (row) => (
        <div style={{ wordWrap: "break-word" }}>{row.message}</div>
      ),
      width: "43%",
    },
    {
      name: "Date",
      selector: (row) => row.date,
      sortable: true,
      cell: (row) => <div style={{ wordWrap: "break-word" }}>{row.date}</div>,
      width: "20%",
    },
    {
      name: "Info",
      selector: (row) => row.action,
      width: "10%",
      cell: (row) => (
        <div>
          <button
            className="text-rose-800 hover:text-rose-500"
            onClick={() => handleDelete(row.id)}
          >
            <MdDeleteForever size={20} />
          </button>
        </div>
      ),
    },
  ];


  const customStyles = {
    headRow: {
      style: {
        border: "1px solid #a18d68", // Use your color value
        boxShadow: "0px 2px 5px rgba(0,0,0,0.1)",
      },
    },
    headCells: {
      style: {
        padding: "12px",
        fontSize: "14px",
        fontWeight: "600",
        textTransform: "none",
        color: "#422D01", // Replace with actual color
      },
    },
    rows: {
      style: {
        "&:hover": {
          backgroundColor: "#ebd8b5",
          cursor: "pointer",
        },
        borderBottom: "1px solid #a18d68",
      },
      highlightOnHoverStyle: {
        backgroundColor: "#ebd8b5",
        borderBottomColor: "#a18d68",
        outline: "1px solid #a18d68",
      },
    },
    cells: {
      style: {
        padding: "10px",
        fontSize: "12px",
        color: "#gray-700", // Adjust color as needed
        a: {
          // targeting link elements specifically
          color: "#4a4130", // Your link color
          fontWeight: "bold",
          textDecoration: "underline",
          "&:hover": {
            textDecoration: "none",
          },
        },
      },
    },
  };

  return (
    <>
      <section className="w-4/5 grow bg-backColor h-screen overflow-y-auto flex flex-col justify-start items-center gap-2 p-4 scrollbar-thin scrollbar-webkit">
        <div
          id="main-section"
          className="grid lg:grid-cols-3 grid-cols-1 gap-4 w-full h-screen"
        >
          <div
            id="left"
            className="col-span-2 p-3 gap-3 flex flex-col items-center h-screen"
          >
            <div
              id="leftContainer"
              className="flex flex-col bg-mainCol border-b-[1px] border-mainBorder p-4 w-full h-full rounded-xl justify-between items-center shadow"
            >
              <div className="w-full flex flex-col sm:flex-row items-start justify-start gap-2">
                <h1 className="text-2xl text-act-text font-semibold">Inbox</h1>
              </div>
              <div
                id="tableContainer"
                className="flex flex-col w-full flex-grow p-2 mt-1 overflow-hidden"
              >
                <div
                  id="table"
                  className="flex-grow overflow-auto rounded-xl scrollbar-thin scrollbar-webkit"
                >
                  <DataTable
                    columns={columns}
                    data={data}
                    customStyles={customStyles}
                    pagination
                  ></DataTable>
                </div>
              </div>
            </div>
          </div>

          <div
            id="right"
            className="p-2 flex flex-col justify-center items-center gap-4 h-screen"
          >
            <div className="bg-mainCol border-b-[1px] border-mainBorder p-4 w-full h-screen rounded-xl flex-col justify-center items-center gap-6 shadow">
              <div className="w-full flex justify-between items-center">
                <h1 className="text-2xl text-act-text font-semibold mb-2">
                  Send a Message
                </h1>
              </div>
              <h1 className="text-base text-darkText font-semibold mb-1">
                Name:
              </h1>
              <div className="dropdown relative">
                <div
                  className=" bg-white text-darkText text-mg flex font-bold p-2 items-center justify-between shadow rounded-xl"
                  onClick={() => setIsActive(!isActive)}
                >
                  {selectedOption} <FaCaretDown />
                </div>
                {isActive && (
                  <div className="dropdownContent text-darkText w-full p-2 border-b-[1px] border-mainBorder bg-white mt-1 rounded-xl absolute max-h-48 overflow-y-auto scrollbar-thin scrollbar-webkit">
                    {options.map((option) => (
                      <div
                        key={`${option.id}-${option.name}`} // Use a combination of id and name for uniqueness
                        onClick={() => handleOptionSelect(option)}
                        className="dropdownItem mt-1 hover:bg-actNav cursor-pointer"
                      >
                        {option.name}
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <textarea
                id="message"
                type="text"
                className="mt-2 bg-white text-darkText font-medium text-mg flex capitalize-first p-2 items-center justify-between shadow rounded-xl resize-none scrollbar-thin scrollbar-webkit"
                style={{
                  width: "100%",
                  height: "420px",
                  wordWrap: "break-word",
                }}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
              <div className="w-full flex flex-col sm:flex-row items-end justify-end gap-2">
                <button
                  id="sendMessage"
                  onClick={sendMessage}
                  className="mt-2 justify-end items-end bg-notActText hover:bg-cirlce text-white font-bold py-2 px-4 rounded-full"
                >
                  Send
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Inbox;
