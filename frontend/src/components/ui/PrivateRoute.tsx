// components/PrivateRoute.tsx
import { Navigate, Outlet } from "react-router-dom"

import type {  ReactNode } from "react"

interface protectedRouteProps {
  isAuthenticated?:boolean,
  children?:ReactNode,

}

const PrivateRoute = ({ children,isAuthenticated }: protectedRouteProps) => {
    if(!isAuthenticated) return <Navigate to={"/isLoggedInModal"}/>

    return children? children : <Outlet/>
 
}

export default PrivateRoute
