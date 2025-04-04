import { Navigate, Outlet } from "react-router-dom"
import { useAuthChecker } from "../hooks/useAuthChecker"
import Loading from "./Loading"
import React from "react"

const RestrictedRoute = () => {
    // This is used for determining if members are logged in and if they are not, they get redirected to login page
    // Custom hook
    const {loggedIn,checkingStatus} = useAuthChecker()
    if(checkingStatus) {
        return <Loading/>
    }
    return loggedIn ? <Outlet /> : <Navigate to='/login'/>
}

export default RestrictedRoute