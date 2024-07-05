import React, { useEffect } from 'react'
import { Navigate, Outlet } from 'react-router-dom';
import { useStateContext } from '../contexts/contextProvider';
  


const ProtectedRoutes = () => {
  const { user, roles, auth, logout } = useStateContext();

  return (
    <>
      {auth && roles == "user" && user ? (
        <Outlet />
      ) : auth && roles === "admin" ? (
        <Navigate to={"/dashboard"} />
      ) : (
        logout("/logout")
      )}
    </>
  );
}
export default ProtectedRoutes;

