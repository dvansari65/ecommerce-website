import Header from "./components/common/Header"
import { BrowserRouter as Router, Route, Routes, useNavigate, Navigate } from "react-router-dom"
import Login from "./pages/Login"
import { Toaster } from "react-hot-toast"
import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { userExist, userNotExist } from "./redux/reducer/userReducer"
import Home from "./pages/Home"

// import { useLogOut } from "./redux/api/userApi"
import type { User } from "./types/types"
import type { RootState } from "./redux/reducer/store"


function App() {

  const dispatch = useDispatch();
  const { user, loading } = useSelector((state: RootState) => state.userReducer)
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        const user: User = JSON.parse(storedUser);
        dispatch(userExist(user));
      } else {
        dispatch(userNotExist());
      }
    } catch (error) {
      dispatch(userNotExist());
    }
  }, []);

  return loading ? <div>loading..</div> : (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/login" element={<Login />} />
      </Routes>
      <Toaster position="bottom-right" />
    </Router>
  )
}

export default App
