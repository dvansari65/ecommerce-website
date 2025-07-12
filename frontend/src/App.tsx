
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
import PrivateRoute from "./components/features/PrivateRoute"
import ShippingInfo from "./pages/ShippingInfo"
import Payment from "./pages/Payment"

function App() {
  const dispatch = useDispatch()
  const { user, loading } = useSelector((state: RootState) => state.userReducer)
  useEffect(() => {
    const userFromStorage = localStorage.getItem("user");
    const token = localStorage.getItem("token");
    if (userFromStorage && token) {
      const user = JSON.parse(userFromStorage);
      dispatch(userExist(user));
    } else {
      dispatch(userNotExist());
    }

  }, []);

  return loading ? <div>loading..</div> : (
    <Router>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/product/:id" element={user ? <ProductDetail /> : <Navigate to='/login' />} />
          <Route path="/cart" element={<PrivateRoute><Cart /></PrivateRoute>} />
          <Route path="/place-order-from-cart" element={<PrivateRoute><ShippingInfo /></PrivateRoute>} />
          <Route path="/create-payment" element={<PrivateRoute><Payment /></PrivateRoute>} />
        </Route>
        <Route path="/login" element={<Login />} />
      </Routes>
      <Toaster position="bottom-right" />
    </Router>
  )
}

export default App
