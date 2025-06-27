
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom"
import Login from "./pages/Login"
import { Toaster } from "react-hot-toast"
import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { userExist, userNotExist } from "./redux/reducer/userReducer"
import Home from "./pages/Home"
import Layout from "./Layout"
// import { useLogOut } from "./redux/api/userApi"
import type { User } from "./types/types"
import type { RootState } from "./redux/reducer/store"
// import Signup from "./pages/Sign-up"
import Shop from "./pages/Shop"
import ProductDetail from "./pages/ProductDetail"

function App() {
const dispatch = useDispatch()
  const { user, loading } = useSelector((state: RootState) => state.userReducer)
  useEffect(() => {
    const localUser = localStorage.getItem("user");
    const token = localStorage.getItem("token");
  
    if (localUser && token) {
      dispatch(userExist(JSON.parse(localUser)));
    } else {
      dispatch(userNotExist());
    }
  }, []);
  
  return loading ? <div>loading..</div> : (
    <Router>
      <Routes>
        <Route element={<Layout />}>
        <Route path="/" element={<Home/>} />
        <Route path="/shop" element={<Shop/>} />
        <Route path="/product/:id" element={user ? <ProductDetail/> : <Navigate to={"/login"}/>} />
        </Route>
          <Route path="/login" element={<Login/>} />
      </Routes>
      <Toaster position="bottom-right" />
    </Router>
  )
}

export default App
