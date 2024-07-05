import React, { useState, useEffect } from 'react';
import { useStateContext } from '../contexts/contextProvider';
import axiosClient from '../axios';

const UserModal = ({ closeModal, handleAddUser, handleDelete, editMode, selectedUser, data, setData }) => {
    const [userInfo, setUserInfo] = useState({
      name: '',
      email: '',
      contact_number: '',
      password: '',
      password_confirmation: '',
    });
    const {register} = useStateContext();
    useEffect(() => {
      if (editMode && selectedUser) {
        setUserInfo(selectedUser);
      }
    }, [editMode, selectedUser]);
  
    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === 'cpNum' && (!/^\d*$/.test(value) || value.length > 11)) {
            return; 
        }
        
        // let capitalizedValue = value;
        // if (name !== 'cpNum' && name !== 'emailAdd' && name !== 'pass' && value.length > 0) {
        //   capitalizedValue = value.charAt(0).toUpperCase() + value.slice(1);
        // }
      
        setUserInfo((prevState) => ({
          ...prevState,
          [name]: value,
        }));
    };
    
    const handleSubmit = (e) => {

        e.preventDefault();
        const isAnyFieldEmpty = Object.values(userInfo).some(value => value === '');

        if (isAnyFieldEmpty) {
            alert('Please fill out all fields.');
            return;
        }
        if (editMode) {
          handleUpdateUser(userInfo);
        } else {
          axiosClient.post('/admin/add_user', userInfo)
          .then(() => {
            location.reload();
          })
          .catch(err => console.log(err)) ;
        
        }
        closeModal();
      };
  
      // const handleUpdateUser = (updatedUser) => {
      //   const updatedData = data.map((user) => (user.id === updatedUser.id ? updatedUser : user));
      //   setData(updatedData);
      //   closeModal();
      // };

  return (
    <div id='container' className='fixed w-full h-full bg-slate-300 bg-opacity-40 items-center justify-center flex' onClick={(e) => { if(e.target.id === "container") closeModal();}}>
      <div id='modal' className='rounded-md p-3 bg-actNav w-2/4'>
      <h1 className='text-lg font-bold mt-2'>{editMode ? 'Edit User' : 'Add New User'}</h1>
        <form onSubmit={handleSubmit}>
          <div className="relative p-6 flex-auto">
            <div className="flex flex-wrap">
              <div className="w-1/2 pl-2">
                <label className="block text-black text-sm font-semibold mt-1"> Name: </label>
                <input id="name" value={userInfo.name} onChange={handleChange} name='name' className="shadow appearance-none border rounded w-full py-1 px-1 text-black" />
              </div>
                           
              <div className="w-1/2 pl-2">
                    <label className="block text-black text-sm font-semibold mt-1"> Email Address: </label>
                <input id="emailAdd" value={userInfo.emailAdd} onChange={handleChange} name='email' className="shadow appearance-none border rounded w-full py-1 px-1 text-black" />
                </div>
            </div>
            <div className="flex flex-wrap">
  
                <div className="w-1/2 pl-2">
                    <label className="block text-black text-sm font-semibold mt-1"> Password: </label>
                <input id="pass" value={userInfo.pass} onChange={handleChange} name='password' className="shadow appearance-none border rounded w-full py-1 px-1 text-black" />
                </div>
                <div className="w-1/2 pl-2">
                    <label className="block text-black text-sm font-semibold mt-1" > Confirm Password: </label>
                <input id="passConf" value={userInfo.cpNum} onChange={handleChange} name='password_confirmation' className="shadow appearance-none border rounded w-full py-1 px-1 text-black" />
                </div>   
            </div>
            <div className="flex flex-wrap">
                <div className="w-1/2 pl-2">
                    <label className="block text-black text-sm font-semibold mt-1" > Cellphone Number: </label>
                <input id="cpNum" value={userInfo.cpNum} onChange={handleChange} name='contact_number' className="shadow appearance-none border rounded w-full py-1 px-1 text-black" />
                </div>       
    
            </div>
          </div>
          <div className="flex items-center justify-end p-3 border-t border-solid border-darkText rounded-b">
            <button
              className="text-darkText background-transparent font-bold uppercase px-4 py-2 text-sm outline-none focus:outline-none mr-1 mb-1"
              type="button"
              onClick={closeModal} > Close
            </button>
            <button
              className="text-white bg-notActText active:bg-yellow-700 font-bold uppercase text-sm px-4 py-2 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1"
              type="submit"  > Submit
            </button> 
          </div>
        </form>
      </div>
    </div>
  );
    };
    // OKS NA LAHATT

export default UserModal;
