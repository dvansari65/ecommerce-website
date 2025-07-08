// components/PrivateRoute.tsx
import { Navigate } from "react-router-dom"
import { useSelector } from "react-redux"
import type { RootState } from "../../redux/reducer/store"
import type { JSX } from "react"

const PrivateRoute = ({ children }: { children: JSX.Element }) => {
  const { user, loading } = useSelector((state: RootState) => state.userReducer)

  if (loading) return <div>Loading...</div>;
  return user ? children : <Navigate to="/login" />
}

export default PrivateRoute
