import React, { useEffect } from 'react'
import { Navigate, Outlet } from 'react-router-dom';
import { useStateContext } from '../contexts/contextProvider';
  


const ProtectedRoutes = () => {
    const { user, auth, roles, logout } = useStateContext();
    return (
      auth && roles === 'admin' ? <Outlet/> : logout('/logout')
    )
}

export default ProtectedRoutes;

