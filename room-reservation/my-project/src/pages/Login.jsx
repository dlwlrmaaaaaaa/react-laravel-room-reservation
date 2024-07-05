import React, { useState, useEffect } from "react";
import axiosClient from "../axios";
import { useNavigate } from "react-router-dom";
import EmailVerify from "./EmailVerify";
import { useStateContext } from "../contexts/contextProvider";
import { FaExclamationTriangle } from "react-icons/fa";
import { IoMdEye } from "react-icons/io";
import LoadingUI from '../components/Loading'
import Google from '../assets/google.png'
import background from '../assets/images/hdroom8.png'
const Login = () => {

  const { login, register, errors, setErrors, loading } = useStateContext();

  const [signIn, setSignIn] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [Loading, userLoading] = useState(false);
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [showPassword1, setShowPassword1] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);
  const [showPassword3, setShowPassword3] = useState(false);
  const [contactNumber, setContactNumber] = useState("");
  const [error, setError] = useState({ _Html: "" });
  const [url, setUrl] = useState(null);
  const toggleSignIn = () => setSignIn(!signIn);
  const [isLoading, setLoading] = useState(false);
  const navigate = useNavigate();


  const togglePasswordVisibility = (inputField) => {
    if (inputField === 1) {
      setShowPassword1(!showPassword1);
    } else if (inputField === 2) {
      setShowPassword2(!showPassword2);
    } else if (inputField === 3) {
      setShowPassword3(!showPassword3);
    }
  };




  const googleLogin = () => {
    axiosClient
      .get("/auth")
      .then((response) => {
        if (response) {
          return response.data;
        }
        throw new Error("Something went wrong!");
      })
      .then((data) => {
        setUrl(data.url);
      })
      .catch((error) => console.error("Error: ", error));
    setLoading(true);
  };

  useEffect(() => {
    if (!isLoading) {
      googleLogin();
    }
  }, [isLoading]);

  const handleSubmit = (e) => {
    e.preventDefault();
    userLoading(true)
    userLoading(false)
    login({ email, password });
   
  };

  const handleSignup = (e) => {
    e.preventDefault();

    // at least 8 characters long and contains at least one number and one symbol
    const passwordPattern =
      /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,}$/;

    // if (password !== passwordConfirmation) {
    //   setErrors({ ...error, _Html: "Password does not match" });
    //   return;
    // }
    if (!passwordPattern.test(password)) {
      setErrors({
        ...errors,
        _Html:
          "Password must be at least 8 characters long, include at least one symbol and one number.",
      });
      setTimeout(() => {
        setErrors({
          ...errors,
          _Html:
            "",
        });
      }, 2000);
      return;
    }

    const userData = {
      name: name,
      email: email,
      password: password,
      password_confirmation: passwordConfirmation,
      contact_number: contactNumber,
    };

    register({ name, email, password, password_confirmation: passwordConfirmation, contact_number: contactNumber });

  };

  return (
    <>  
      
        <div className="flex justify-center items-center min-h-screen bg-cover" style={{backgroundImage: `url(${background})`, backgroundBlendMode:".1"}}>
        <div className="bg-[#949494]/50 rounded-lg shadow-lg relative overflow-hidden w-full lg:max-w-2xl md:max-w-xl max-w-md min-h-[450px] md:min-h-[550px] mx-auto border-red">
          {/* Sign Up form */}
          <div
            className={`absolute top-0 h-full transition-all duration-600 ease-in-out left-0 w-1/2 ${signIn ? "opacity-0 z-0" : "opacity-100 z-10"
              }`}
          >
            <form
              className="bg-white/10 flex items-center justify-center flex-col py-0 lg:px-12 px-8 h-full text-center"
              onSubmit={handleSignup}
            >
              <h1 className="font-bold text-black mb-3 uppercase">Create Account</h1>
              {errors._Html ? (
                <span className="text-red-500 rounded-lg w-full p-1 m-1 text-sm gap-2 flex items-center justify-center">
                  <i className="text-red">
                    <FaExclamationTriangle size={20} />
                  </i>
                  {errors._Html}
                </span>
              ) : null}
              <input
                type="text"
                placeholder="Name"
                name="name"
                required
                onChange={(e) => setName(e.target.value)}
                className="bg-slate-200 rounded-md border-none md:p-3 p-2  my-2 w-full"
              />
              <input
                type="email"
                name="email"
                required
                placeholder="Email Address"
                className="bg-slate-200 rounded-md border-none md:p-3 p-2  my-2 w-full"
                onChange={(e) => setEmail(e.target.value)}
              />
              <div className="flex gap-2">
                <div className="relative">
                  <input
                    type={showPassword1 ? "text" : "password"}
                    required
                    placeholder="Password"
                    name="password"
                    className="bg-slate-200 rounded-md border-none p-3  my-2 w-full pr-10" 
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility(1)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm text-black hover:text-actText"
                  >
                    <IoMdEye size={20} />
                  </button>
                </div>

              </div>
              <div className="flex gap-2">
                <div className="relative">
                  <input
                    type={showPassword2 ? "text" : "password"}
                    required
                    placeholder="Password"
                    name="password_confirmation"
                    className="bg-slate-200 rounded-md border-none p-3  my-2 w-full pr-10" 
                    onChange={(e) => setPasswordConfirmation(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility(2)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm text-black hover:text-actText"
                  >
                    <IoMdEye size={20} />
                  </button>
                </div>

              </div>
              <input
                type="text"
                placeholder="Phone Number"
                name="contact_number"
                className="bg-slate-200 rounded-md border-none md:p-3 p-2 my-2 w-full"
                onChange={(e) => setContactNumber(e.target.value)}
              />
              <button
                type="submit"
                className="rounded-full border border-white bg-transparent  text-black hover:text-white hover:bg-black text-sm font-bold py-3 px-9 my-2 uppercase transition duration-75 ease-in-out transform hover:scale-95 focus:outline-none"
              > {loading && <LoadingUI height="8" width="8" loadingHeight="12" loadingWidth="12" />}
                {!loading && "SIGN UP"}
              </button>
            </form>
          </div>
          {/* Sign In form */}    
          <div
            className={`absolute bg-white/10 top-0 h-full  transition-all duration-600 ease-in-out left-0 w-1/2 z-20 ${!signIn ? "translate-x-full opacity-0" : "translate-x-0 opacity-100"
              }`}
          >
            <form
              className="flex items-center justify-center flex-col py-0 lg:px-12 px-8 h-full text-center"
              onSubmit={handleSubmit}
            >
              <h1 className="font-bold text-actText mb-4 uppercase">Sign In</h1>
              {errors._Html ? (
                <span className="text-red-500 rounded-lg w-full p-1 m-1 text-sm gap-2 flex items-center justify-center">
                  <i className="text-red">
                    <FaExclamationTriangle size={20} />
                  </i>
                  {errors._Html}
                </span>
              ) : null}
              <input
                type="email"
                placeholder="Email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-slate-200 rounded-md border-none p-3 my-2 w-full"
              />
              <div className="relative">
                <input
                  type={showPassword3 ? "text" : "password"}
                  required
                  placeholder="Password"
                  name="password"
                  className="bg-slate-200 rounded-md border-none p-3  my-2 w-full pr-10" 
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility(3)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm text-notActText hover:text-actText"
                >
                  <IoMdEye size={20} />
                </button>
              </div>
              <a
                href="#"
                className="text-black text-bold text-md  my-4 hover:text-actText hover:font-semibold"
              >
                Forgot your password?
              </a>
              {url && <a className="rounded-full bg-white border flex border-gray-950 text-sm px-2 mb-2 py-1 text-center items-center" href={url}>
                  <img src={Google} className="w-4 h-4 mr-2" />Sign in with Google
              </a> }

              <button className="rounded-full border border-white bg-black text-white hover:text-black hover:bg-transparent text-sm font-bold py-3 px-9 my-2 uppercase transition duration-75 ease-in-out transform hover:scale-95 focus:outline-none">
                {loading && <LoadingUI height="8" width="8" loadingHeight="12" loadingWidth="12" />}
                {!loading && "Sign in"}
              </button>
          </form>
          </div>
          {/* Overlay Container starts here */}
          <div
            className={`absolute top-0 left-1/2 w-1/2 h-full overflow-hidden transition-transform duration-600 ease-in-out z-40`}
          >
            <div
              className={`bg-white/10  text-white h-full w-double transition-transform duration-600 ease-in-out`}
            >
              {/* Left Overlay Panel */}
              <div
                className={`absolute flex items-center justify-center flex-col px-10 text-center h-full w-full transition-transform duration-600 ease-in-out ${!signIn ? "translate-x-20%" : "-translate-x-full"
                  }`}
              >
                <h1 className="font-bold text-black">Already have an Account?</h1>
                <p className="mt-5 mb-8 text-black">
                  To keep connected with us please login with your personal info
                </p>
                <button
                  onClick={toggleSignIn}
                  className="rounded-full border border-white bg-black text-white hover:bg-transparent hover:text-black text-sm font-bold py-3 px-9 uppercase transition duration-75 ease-in-out transform hover:scale-95 focus:outline-none"
                >
                  Sign In
                </button>
              </div>

              {/* Right Overlay Panel */}
              <div
                className={`absolute right-0 flex items-center justify-center flex-col px-10 text-center h-full w-full transition-transform duration-600 ease-in-out ${signIn ? "translate-x-20%" : "translate-x-full"
                  }`}
              >
                <h1 className="font-bold text-black">Don't have an Account yet?</h1>
                <p className="mt-5 mb-8 text-black">
                  Enter your personal details and start journey with us
                </p>
                <button
                  onClick={toggleSignIn}
                  className="rounded-full border border-white bg-transparent text-black text-sm font-bold py-3 px-9 uppercase transition duration-75 ease-in-out transform hover:scale-95 hover:bg-black hover:text-white focus:outline-none"
                  type="submit"
                >
                  Sign Up
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;