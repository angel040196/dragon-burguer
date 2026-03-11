import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Home from "./Home"
import Menu from "./Menu"
import Login from "./Login"
import Navbar from "./Navbar"

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/menu" element={<Menu />} />
        <Route path="/login" element={<Login />} />
        {/* Más adelante agregaremos /cart */}
      </Routes>
    </Router>
  )
}

export default App
