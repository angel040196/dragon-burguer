import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Home from "./Home"
import Menu from "./Menu"
import Login from "./Login"
import Navbar from "./Navbar"
import Carrito from "./Carrito"
import Checkout from "./Checkout"
import Confirmacion from "./Confirmacion"
import HistorialPedidos from "./HistorialPedidos"

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/menu" element={<Menu />} />
        <Route path="/login" element={<Login />} />
        <Route path="/carrito" element={<Carrito />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/confirmacion" element={<Confirmacion />} />
        <Route path="/historial" element={<HistorialPedidos />} /> 
      </Routes>
    </Router>
  )
}

export default App
