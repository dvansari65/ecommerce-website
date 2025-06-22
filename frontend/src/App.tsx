import Header from "./components/Header"
import { BrowserRouter as Router,Route,Routes } from "react-router-dom"
import Login from "./pages/Login"


function App() {
  

  return (
    <Router>
      <Header/>

        <Routes>
        <Route path="/login" element={<Login/>}/>
        </Routes>
    
    </Router>
  )
}

export default App
