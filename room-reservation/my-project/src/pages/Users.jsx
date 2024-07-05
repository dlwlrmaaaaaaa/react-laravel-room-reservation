import React, { useState, useEffect } from 'react'
import Sidebar from '../components/Sidebar'
import UserModal from '../components/UserModal'
import { MdModeEdit, MdDeleteForever } from "react-icons/md";
import DataTable from 'react-data-table-component';
import axiosClient from '../axios';

const Users = () => {
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [data, setData] = useState([]);
  useEffect(() => {

    axiosClient.get('/users')
    .then((res) => {
      return res.data;
    })
    .then((res) => {
      setData(res.data)
    })
  }, [])

  
  const columns = [
    {
      name: "ID",
      selector: row => row.id,
      sortable: true,
      cell: row => <div style={{ wordWrap: "break-word" }}>{row.id}</div>,
      width: '7%'
    },
    {
      name: "Name",
      selector: row => row.name,
      cell: row => <div style={{ wordWrap: "break-word" }}>{row.name}</div>,
      width: '15%'
    },
    {
      name: "Role",
      selector: row => row.role,
      cell: row => <div style={{ wordWrap: "break-word" }}>{row.role}</div>,
      width: '15%'
    },
    {
      name: "Email",
      selector: row => row.email,
      cell: row => <div style={{ wordWrap: "break-word" }}>{row.email}</div>,
      width: '23%'
    },
    {
      name: "Phone #",
      selector: row => row.contact_number,
      cell: row => <div style={{ wordWrap: "break-word" }}>{row.contact_number}</div>,
      width: '15%'
    },
    {
      name: "Action",
      cell: (row) => (
        <div>
          <button className='hover:text-slate-500' onClick={() => handleEdit(row.id)}><MdModeEdit size={18} /></button>
          <button className='text-rose-800 hover:text-rose-500' onClick={() => { handleDelete(row.id) }}><MdDeleteForever size={20} /></button>
        </div>
      ),
    },
  ];

  const handleAddUser = (newUser) => {
    setData((prevData) => [...prevData, newUser]);
    setShowModal(false);
  };

  const handleEdit = (user) => {
    setSelectedUser(user);
    setEditMode(true);
    setShowModal(true);
  };

  const handleDelete = (id) => {
    // setData(data.filter((item) => item.id !== id));
    axiosClient.delete('/delete/user/' + id)
    .then(() => {
      setData(data.filter((item) => item.id !== id));
    });
  };

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

  return (
    <>
      <section className='w-4/5 grow bg-backColor h-screen overflow-y-auto flex flex-col justify-start items-center gap-2 p-4 scrollbar-thin scrollbar-webkit'>
        <div id='container' className='flex flex-col bg-mainCol border-b-[1px] border-mainBorder p-4 w-full h-full rounded-xl justify-between items-center shadow'>
          <div className="w-full flex flex-col sm:flex-row items-start justify-start gap-2">
            <h1 className='text-2xl text-act-text font-semibold'>Users </h1>
          </div>
          <div id='tableContainer' className='flex flex-col w-full flex-grow p-2 mt-1 overflow-hidden'>
            <div id='table' className='flex-grow overflow-auto rounded-xl scrollbar-thin scrollbar-webkit'>
              <DataTable columns={columns} data={data} customStyles={customStyles} pagination></DataTable>
            </div>
          </div>
          <div className="w-full flex flex-col sm:flex-row items-end justify-end gap-2">
            <button
              className='mt-2 justify-end items-end bg-notActText hover:bg-cirlce text-white font-bold py-2 px-4 rounded-full'
              onClick={() => {
                setSelectedUser(null);
                setEditMode(false);
                setShowModal(true);
              }}
            >
              Add New User
            </button>
            {showModal && (
              <UserModal
                closeModal={() => setShowModal(false)}
                // handleAddUser={handleAddUser}
                // handleDelete={handleDelete}
                editMode={editMode}
                selectedUser={selectedUser ? data.find(user => user.id === selectedUser) : {}}
                data={data}
                setData={setData}
              />
            )}
          </div>
        </div>
      </section>
    </>
  )
}

// OKS NA LAHATT

export default Users
