import React, { useState, useEffect } from 'react';
import axiosClient from "../axios";
import DataTable from 'react-data-table-component';

const ReservationModal = ({ closeModal1 }) => {

    const statusColors = {
        "status-paid": "#90ee90",  // Light green
        "status-pending": "#ffcc00",    // Yellow
        "status-cancelled": "#ff6347",  // Tomato
        "status-done": "##9da19e",  // Light grey
    };
    const [end_book, set_book] = useState('')
    const current_date = new Date()
    const date = new Date(end_book)
    const [loading, setLoading] = useState(false)
    const [isDone, setDone] = useState(false)

    useEffect(() => {
            if (current_date >= date) {
              setDone(true)
          } 
    }, [isDone])
    

    const columns = [
        {
            name: "Room Name",
            selector: row => row.id,
            sortable: true,
            cell: row => <div style={{ wordWrap: "break-word" }}>{row.room_name}</div>,
            width: '47%'
        },
        {
            name: "Starting Date",
            selector: row => row.message,
            cell: row => <div style={{ wordWrap: "break-word" }}>{row.starting_date}</div>,
            width: '20%'
        },
        {
            name: "Ending Date",
            selector: row => row.message_sent,
            cell: row => <div style={{ wordWrap: "break-word" }}>{row.ending_date}</div>,
            width: '20%'
        },
        {
            name: "Status",
            selector: row => row.status,
            cell: row => (
                <div style={{
                    wordWrap: "break-word", 
                    backgroundColor: statusColors[`status-${row.status.toLowerCase()}`]
                }}>
                    {isDone && "Done"}
                    {!isDone && row.status}
                </div>
            ),
            width: '13%',
        },
    
    ];

    const customStyles = {
        headRow: {
            style: {
                border: '1px solid #a18d68',
                boxShadow: '0px 2px 5px rgba(0,0,0,0.1)',
            },
        },
        headCells: {
            style: {
                padding: '12px',
                fontSize: '14px',
                fontWeight: '600',
                textTransform: 'none',
                color: '#422D01',
            },
        },
        rows: {
            style: {
                '&:hover': {
                    backgroundColor: '#ebd8b5',
                    cursor: 'pointer',
                },
                borderBottom: '1px solid #a18d68',
            },
            highlightOnHoverStyle: {
                backgroundColor: '#ebd8b5',
                borderBottomColor: '#a18d68',
                outline: '1px solid #a18d68',
            },
        },
        cells: {
            style: {
                padding: '10px',
                fontSize: '12px',
                color: '#gray-700',
                a: {
                    color: '#4a4130',
                    fontWeight: 'bold',
                    textDecoration: 'underline',
                    '&:hover': {
                        textDecoration: 'none',
                    },
                },
            },
        },
    };

    const [message, setMessage] = useState([]);

    useEffect(() => {
        if (message.length > 0) {
            let done = true; // Assume all reservations are done initially
            for (const item of message) {
                const endDate = new Date(item.ending_date);
                if (current_date < endDate) {
                    done = false; // If any reservation's end date is in the future, set done to false
                    break; // No need to check further
                }
            }
            setDone(done); // Set the done state based on the result
        }
    }, [message, current_date]);
    
    

    useEffect(() => {
        setLoading(true)
        axiosClient
            .get("/reservations")
            .then((res) => {
                console.log("User data received:", res.data); // Check the response structure
                if (res.data && res.data.data) {
                    const sortedData = res.data.data.sort((a, b) => new Date(b.starting_date) - new Date(a.starting_date));
                    const rows = sortedData.slice(0, 6);
                    setMessage(rows); // Ensure this matches the structure you logged
                    console.log(rows);
                } else {
                    console.log("Unexpected data structure:", res.data);
                }
                setLoading(false)
            })
            .catch((err) => {
                console.error("Error fetching user data:", err);
                console.log("Error details:", err.response); // Check if there's more info on the error
            });
    }, []);

    return (
        <div
            id='container'
            className='fixed top-0 left-0 w-full h-full bg-slate-300 bg-opacity-40 items-center justify-center flex z-50'
            onClick={(e) => { if (e.target.id === "container") closeModal1(); }}
        >
            <div id='modal' className='rounded-md p-3 bg-actNav w-5/6 h-5/6 overflow-auto scrollbar-thin scrollbar-webkit'>
                <h1 className='text-2xl font-bold mt-2 text-slate-900'>Reservations</h1>
                <div id='tableContainer' className='flex flex-col w-full flex-grow p-2 mt-1 overflow-hidden'>
                    <div id='table' className='flex-grow overflow-auto rounded-xl scrollbar-thin scrollbar-webkit'>
                        <DataTable columns={columns} data={message} customStyles={customStyles} pagination></DataTable>
                    </div>
                </div>
                <div className="flex items-center justify-end p-3 border-t border-solid border-darkText rounded-b mt-3">
                    <button
                        className="text-darkText background-transparent font-bold uppercase px-4 py-2 text-sm outline-none focus:outline-none mr-1 mb-1"
                        type="button"
                        onClick={closeModal1}  > Close
                    </button>
                </div>
            </div>
        </div>
    )
}

export default ReservationModal
