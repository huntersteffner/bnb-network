import { Navigate, Outlet } from "react-router-dom"
// import { useAuthStatus } from "../hooks/useAuthStatus"
import Loading from "./Loading"

const RestrictedRoute = () => {
    // const {signedIn,verifyingStatus} = useAuthStatus()
    // if(verifyingStatus) {
    //     return <Loading/>
    // }

    // return signedIn ? <Outlet/> : <Navigate to='/login'/>
}

export default RestrictedRoute