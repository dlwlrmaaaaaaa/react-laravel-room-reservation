import React from "react";
import { useEffect, useState } from "react";
import axiosClient from "../axios";
import { useLocation, Navigate, useNavigate } from "react-router-dom";
import { useStateContext } from "../contexts/contextProvider";
import Redirecting from "../components/Redirecting"
const GoogleCallBack = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const { setUsers, setAuth, setRoles } = useStateContext();
  // itong code dito gagawan dapat ng isa pang file hindi ito dapat nandito para to sa GoogleCallBack.jsx
  useEffect(() => {
    axiosClient.get("/sanctum/csrf-cookie");
    axiosClient
      .get(`/auth/callback${location.search}`)
      .then((res) => {
        return res.data;
      })
      .then((res) => {
        setUsers(res);
        setAuth(true);
        setRoles("user");
        localStorage.setItem("auth", true);
        localStorage.setItem("user", JSON.stringify(res.user));
        localStorage.setItem("roles", "user");
        setLoading(false);
        navigate("/home");
      })
      .catch((error) => console.log("ERROR: ", error));
  }, []);

  return (
    <>
      {loading && <Redirecting />}
    </>
  );
};

export default GoogleCallBack;
