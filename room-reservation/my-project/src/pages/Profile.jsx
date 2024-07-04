import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { FaCircleUser } from "react-icons/fa6";
import { IoMdEye } from "react-icons/io";
import axiosClient from "../axios";
import Loading from "../components/Loading";

const Profile = () => {
    const [user, setUser] = useState(null);
    const [avatarUrl, setAvatarUrl] = useState("");
    const [isEditing, setIsEditing] = useState(false);

    const [password1, setPassword1] = useState("");
    const [password2, setPassword2] = useState("");

    const [showPassword1, setShowPassword1] = useState(false);
    const [showPassword2, setShowPassword2] = useState(false);

    const [image, setImage] = useState("");

    useEffect(() => {
        axiosClient
            .get("/user")
            .then((res) => {
                console.log("User data received:", res.data); // Check the response structure
                if (res.data && res.data.data) {
                    setUser(res.data.data); // Ensure this matches the structure you logged
                } else {
                    console.log("Unexpected data structure:", res.data);
                }
            })
            .catch((err) => {
                console.error("Error fetching user data:", err);
                console.log("Error details:", err.response); // Check if there's more info on the error
            });
    }, []);

    const handleEdit = () => {
        setIsEditing(!isEditing);
    };

    const handleChange = (event) => {
        const { name, value } = event.target;
        setUser((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (event) => {
        event.preventDefault();
    
        // Validate passwords only if they are entered
        if (password1 && password2 && password1 !== password2) {
            console.log("Passwords do not match");
            return;
        }
    
        const formData = new FormData();
        if (user.avatar instanceof File) { // Only append file if it's a valid instance of File
            formData.append("avatar", image);
        }
        formData.append("name", user.name);
        formData.append("email", user.email);
        formData.append("contact_number", user.contact_number);
        
        // Append password only if it's been entered
        if (password1 && password2 && password1 === password2) {
            formData.append("password", password1);
        }
    
        axiosClient
            .post("/updateProfile", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            })
            .then((response) => {
                console.log("Profile updated successfully:", response.data);
                // Clear passwords after successful update
                setPassword1('');
                setPassword2('');
                handleEdit(); // Toggle off editing mode after successful update
            })
            .catch((error) => {
                console.error("Failed to update profile:", error);
            });
    };
    

    const handleFileInputChange = (e) => {
        const selectedFiles = Array.from(e.target.files);
        if (e.target.files) {
        //   const fileArray = selectedFiles.map((file) => URL.createObjectURL(file));
          setImage(...selectedFiles);
        }
    };
    
    const renderImage = (image) => {
        if (image instanceof File) {
          const imageURL = URL.createObjectURL(image);
          return (
              <img src={imageURL} className="lg:w-64 w-32 lg:h-64 h-32 rounded-full mb-4 border-2 border-slate-500" alt={`Uploaded Image ${image}`} />
          );
      }  else{
          const imageURL = `http://localhost:8000/avatars/${user.avatar}`;
          return (
            <img src={imageURL} className="lg:w-64 w-32 lg:h-64 h-32 rounded-full mb-4 border-2 border-slate-500" alt={`Uploaded Image ${image}`} />
          );
        } 
      };

    
    
    const togglePasswordVisibility1 = () => {
        setShowPassword1(!showPassword1);
    };

    const togglePasswordVisibility2 = () => {
        setShowPassword2(!showPassword2);
    };

    if (!user) return (
        <div className="w-full h-screen flex justify-center items-center">
            <Loading height="40" width="40" loadingHeight="40" loadingWidth="40" />
        </div>
    );

    
    return (
        <>
            <Header />
            <div className="w-full grow bg-backColor h-auto flex flex-col justify-start items-center">
                <h1 className="text-actText text-4xl font-bold m-5">User Profile</h1>
                <div className="grid lg:grid-cols-3 md:grid-cols-3 grid-cols-1 gap-4 w-full h-auto">
                    <div className="flex flex-col justify-center items-center">
                        {renderImage(image)}
                        <h1 className="text-2xl font-semibold text-actText">{user.name}</h1>
                    </div>
                    <form
                        className="col-span-2 flex flex-col gap-4 m-4 lg:pr-10 mb-9"
                        onSubmit={handleSubmit}
                    >
                        <div className="flex flex-row gap-3 justify-end items-center">
                            <label className="lg:text-lg text-md font-semibold text-notActText">
                                Avatar:
                            </label>
                            <input
                                type="file"
                                name="avatar"
                                accept="image/*"
                                onChange={(e) => {
                                    if (e.target.files && e.target.files[0]) {
                                        const img = e.target.files[0];
                                        handleFileInputChange(e)
                                        setUser((prev) => ({ ...prev, avatar: img }));
                                    }

                                }}
                                disabled={!isEditing}
                                className="border-2 h-10 w-3/4 text-actText rounded-lg"
                            />
                        </div>
                        <div className="flex flex-row gap-3 justify-end items-center">
                            <label className="lg:text-lg text-md font-semibold text-notActText">
                                Name:
                            </label>
                            <input
                                type="text"
                                name="name"
                                value={user.name}
                                onChange={handleChange}
                                disabled={!isEditing}
                                className="border-2 h-10 w-3/4 text-actText rounded-lg"
                            />
                        </div>
                        <div className="flex flex-row gap-3 justify-end items-center">
                            <label className="lg:text-lg text-md font-semibold text-notActText">
                                Email Address:
                            </label>
                            <input
                                type="email"
                                name="email"
                                value={user.email}
                                onChange={handleChange}
                                disabled={!isEditing}
                                className="border-2 h-10 w-3/4 text-actText rounded-lg"
                            />
                        </div>
                        <div className="flex flex-row gap-3 justify-end items-center">
                            <label className="lg:text-lg text-md font-semibold text-notActText">
                                Contact Number:
                            </label>
                            <input
                                type="text"
                                name="contact_number"
                                value={user.contact_number}
                                onChange={handleChange}
                                disabled={!isEditing}
                                className="border-2 h-10 w-3/4 text-actText rounded-lg"
                            />
                        </div>
                        <div className="relative flex flex-row gap-3 justify-end items-center">
                            <label className="lg:text-lg text-md font-semibold text-notActText">
                                Password:
                            </label>
                            <input
                                type={showPassword1 ? "text" : "password"}
                                name="password"
                                value={password1}
                                onChange={(e) => setPassword1(e.target.value)}
                                disabled={!isEditing}
                                className="border-2 h-10 w-3/4 text-actText rounded-lg"
                            />
                            <button
                                type="button"
                                onClick={togglePasswordVisibility1}
                                disabled={!isEditing}
                                className="text-sm text-notActText hover:text-actText absolute inset-y-0 right-0 pr-3"
                            >
                                <IoMdEye size={20} />
                            </button>
                        </div>
                        <div className="relative flex flex-row gap-3 justify-end items-center">
                            <label className="lg:text-lg text-md font-semibold text-notActText">
                                Confirm Password:
                            </label>
                            <input
                                type={showPassword2 ? "text" : "password"}
                                name="password_confirmation"
                                value={password2}
                                onChange={(e) => setPassword2(e.target.value)}
                                disabled={!isEditing}
                                className="border-2 h-10 w-3/4 text-actText rounded-lg"
                            />
                            <button
                                type="button"
                                onClick={togglePasswordVisibility2}
                                disabled={!isEditing}
                                className="text-sm text-notActText hover:text-actText absolute inset-y-0 right-0 pr-3"
                            >
                                <IoMdEye size={20} />
                            </button>
                        </div>
                        <div className="flex w-full justify-end items-end">
                            {isEditing && (
                                <button
                                    type="submit"
                                    className="bg-actNav text-md font-bold lg:w-1/3 w-2/4 text-actText py-2 px-8 rounded-full transition duration-75 ease-in-out transform hover:scale-95 justify-center items-center"
                                >
                                    Save
                                </button>
                            )}
                            {!isEditing && (
                                <button
                                    type="button"
                                    className="bg-actNav text-md font-bold lg:w-1/3 w-2/4 text-actText py-2 px-8 rounded-full transition duration-75 ease-in-out transform hover:scale-95 justify-center items-center"
                                    onClick={handleEdit}
                                >
                                    Edit Info
                                </button>
                            )}
                        </div>
                    </form>
                </div>
            </div>
            <Footer />
        </>
    );
};
// finish update profile kulang
export default Profile;
