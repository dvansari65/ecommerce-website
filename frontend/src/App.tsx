
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom"
import Login from "./pages/Login"
import { Toaster } from "react-hot-toast"
import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { userExist, userNotExist } from "./redux/reducer/userReducer"
import Home from "./pages/Home"
import Layout from "./Layout"
import type { RootState } from "./redux/reducer/store"
import Shop from "./pages/Shop"
import ProductDetail from "./pages/ProductDetail"
import Cart from "./pages/Cart"
import PrivateRoute from "./components/ui/PrivateRoute"
import ShippingInfo from "./pages/ShippingInfo"
import CheckOut from "./pages/CheckOut"
import MyOrders from "./pages/MyOrders"
import type { User } from "./types/types"
import BuyProduct from "./pages/BuyProduct"
import Signup from "./pages/Sign-up"

function App() {

  const { user, loading } = useSelector((state: RootState) => state.userReducer)
  const dispatch = useDispatch()
  useEffect(() => {
    
    const token = localStorage.getItem("token")
    const storedUser = localStorage.getItem("user")

    if (storedUser && token) {
      try {
        const localUser: User = JSON.parse(storedUser)
        dispatch(userExist(localUser))
      } catch (error) {
        console.error("Error parsing user from localStorage:", error);
        dispatch(userNotExist());
      }
    } else {
      dispatch(userNotExist())
    }
  }, [])


  return loading ? <div>loading...</div> : (
    <Router>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/cart" element={<PrivateRoute isAuthenticated={user ? true : false}><Cart /></PrivateRoute>} />
          <Route path="/place-order-from-cart" element={<PrivateRoute isAuthenticated={user ? true : false}><ShippingInfo /></PrivateRoute>} />
          <Route path="/payment" element={<PrivateRoute isAuthenticated={user ? true : false}><CheckOut /></PrivateRoute>} />
          <Route path="/my-orders" element={<PrivateRoute isAuthenticated={user ? true : false}><MyOrders /></PrivateRoute>} />
          <Route path="/buy-product" element={<PrivateRoute isAuthenticated={user ? true : false}><BuyProduct /></PrivateRoute>} />
          <Route path="/signup" element={<Signup/>} />
        </Route>
        <Route path="/login" element={<Login />} />
      </Routes>
      <Toaster position="bottom-right" />
    </Router>
  )
}

export default App
