import React, { useState, useEffect } from 'react';
import { FaCaretDown } from "react-icons/fa";
import axiosClient from "../axios";

const FeedbackModal = ({ closeModal, option2 }) => {
    const [message, setMessage] = useState('');
    const [selectedImages, setSelectedImages] = useState([]);
    const [options, setOptions] = useState(null); // Store room options
    const [selectedOption, setSelectedOption] = useState("Choose a Room"); // Track currently selected option
    const [isActive, setIsActive] = useState(false);
    const [selectedRating, setSelectedRating] = useState(0);
    const [roomID, setRoomId] = useState(0);
    const [userId, setUserId] = useState(null); // State to store authenticated user ID
    const [fileObjects, setFileObjects] = useState([]);  // This will hold the actual File objects


    useEffect(() => {
        const fetchUserId = async () => {
            try {
                const response = await axiosClient.get('/user'); 
                setUserId(response.data.id);
            } catch (error) {
                console.error('Error fetching user ID:', error);
            }
        };

        fetchUserId();
    }, []);

    const onSelectFile = (event) => {
        const files = event.target.files;
        const newFilesArray = Array.from(files);
        const newImagesArray = newFilesArray.map(file => URL.createObjectURL(file));
    
        setSelectedImages(prev => [...prev, ...newImagesArray]);  // For previews
        setFileObjects(prev => [...prev, ...newFilesArray]);  // Store actual files
    };
    

    const handleOptionSelect = (room, roomId) => {
        setSelectedOption(room);
        setRoomId(roomId)
        setIsActive(false);
    };    
    console.log(selectedImages);

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        const formData = new FormData();
        formData.append('user_id', userId);
        formData.append('room_id', roomID);
        formData.append('rating', selectedRating);
        formData.append('comment', message);
        
        fileObjects.forEach(file => {
            formData.append('pictures[]', file);  // Ensure this matches the expected array format in backend
        });
    
        try {
            const response = await axiosClient.post('/review', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                  }
            });
            console.log(response.data);
            closeModal();
            location.reload();
        } catch (error) {
            console.error(error);
        }
    };
    
    
 
    const handleRatingSelect = (rating, e) => {
        e.preventDefault();
        setSelectedRating(rating);
    };


    return (
        <div id='container' className='fixed top-0 left-0  w-full h-full bg-slate-300 bg-opacity-40 items-center justify-center flex' onClick={(e) => { if (e.target.id === "container") closeModal(); }}>
            <div id='modal' className='rounded-md p-3 bg-actNav w-5/6 h-5/6 overflow-auto scrollbar-thin scrollbar-webkit'>
                <h1 className='text-2xl font-bold mt-2'>Send us your Feedbacks!</h1>
                <form onSubmit={handleSubmit}>
                    <label className="flex flex-col justify-center items-center">
                        <div className='flex flex-col justify-center items-center bg-white text-darkText rounded-xl border border-solid p-3 aspect-square w-40 cursor-pointer'>
                            <span className='font-lighter text-sm'>Add Image (Up to 10 Images)</span>
                            <input type='file' className='hidden' onChange={onSelectFile} multiple accept='image/jpg, image/jpeg, image/webp' />
                        </div>
                    </label>
                    <div className='flex gap-4 p-4 flex-wrap justify-center items-center mt-3'>
                        {selectedImages.map((image, index) => (
                            <div key={index}>
                                <img src={image} alt="upload preview" className='h-40' />
                                <button type="button" onClick={() => setSelectedImages(current => current.filter(img => img !== image))} className='bg-red-500 hover:bg-red-700 text-white font-bold py-2 mt-2 px-4 rounded mt-2"'>Delete Image</button>
                            </div>
                        ))}
                    </div>

                    <div className="relative p-6 flex-auto">
                        <div className='flex flex-col'>
                            <label className='block text-black text-sm font-semibold mt-2'>Room:</label>
                            <div className="relative">
                                <div className="dropdown bg-white text-darkText text-mg flex font-bold mt-2 p-2 items-center justify-between shadow rounded-xl" onClick={() => setIsActive(!isActive)}>
                                    {selectedOption} <FaCaretDown />
                                </div>
                                {isActive && (
                                    <div className="dropdownContent text-darkText w-full p-2 border-b-[1px] border-mainBorder bg-white mt-1 rounded-xl absolute overflow-y-auto scrollbar-thin scrollbar-webki">
                                        {[...option2, "Choose a Room"].map((room, index) => (
                                            <div key={index} onClick={() => handleOptionSelect(room.room_name, room.id)} className="hover:bg-gray-200 p-2 cursor-pointer">
                                                {room.room_name}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                            
                            <label className='block text-black text-sm font-semibold mt-3'>Rating:</label>
                            <div className='grid grid-cols-5 mt-2 gap-3'>
                                {[1, 2, 3, 4, 5].map(value => (
                                    <button key={value} onClick={(e) => handleRatingSelect(value, e)} className={`bg-white rounded-lg p-3 hover:scale-95 duration-75 ${selectedRating == value ? 'scale-95 bg-rose-400' : ''}`}>
                                        {Array(value).fill('⭐').join('')}
                                    </button>
                                ))}
                            </div>

                            <label className='block text-black text-sm font-semibold mt-3'>Message:</label>
                            <textarea id='description'
                                type="text"
                                className='mt-2 bg-white text-darkText text-mg flex capitalize-first p-2 items-center justify-between shadow rounded-lg resize-none scrollbar-thin scrollbar-webkit'
                                style={{ width: "100%", height: "100px", wordWrap: "break-word" }}
                                onChange={(e) => setMessage(e.target.value)}> 
                            </textarea>

                            <div className="flex items-center justify-end p-3 border-t border-solid border-darkText rounded-b mt-3">
                                <button
                                    className="text-darkText background-transparent font-bold uppercase px-4 py-2 text-sm outline-none focus:outline-none mr-1 mb-1"
                                    type="button"
                                    onClick={closeModal}  > Close
                                </button>
                                <button
                                    className="text-white bg-notActText active:bg-yellow-700 font-bold uppercase text-sm px-4 py-2 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1"
                                    type="submit" > Submit
                                </button>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default FeedbackModal;
