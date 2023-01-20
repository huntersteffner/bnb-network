import { Navigate, Outlet } from "react-router-dom"
import { useAuthChecker } from "../hooks/useAuthChecker"
import Loading from "./Loading"

const RestrictedRoute = () => {
    const {loggedIn,checkingStatus} = useAuthChecker()
    if(checkingStatus) {
        return <Loading/>
    }
    return loggedIn ? <Outlet /> : <Navigate to='/login'/>
}

export default RestrictedRoute