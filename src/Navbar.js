import { useEffect, useState } from "react"
import { supabase } from "./supabaseClient"
import { FaUserCircle, FaShoppingCart, FaHome, FaSignOutAlt, FaUtensils } from "react-icons/fa"
import { Link } from "react-router-dom"

function Navbar() {
  const [user, setUser] = useState(null)

  useEffect(() => {
    // Obtener usuario actual al cargar
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
    }
    getUser()

    // Escuchar cambios de sesión en tiempo real
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    // Limpiar suscripción al desmontar el componente
    return () => {
      subscription.unsubscribe()
    }
  }, [])

  // Cerrar sesión
  const handleLogout = async () => {
    await supabase.auth.signOut()
  }

  return (
    <nav className="bg-red-600 text-white p-4 flex justify-between items-center">
      {/* Logo con link al Home */}
      <Link to="/" className="flex items-center gap-2 hover:text-gray-200">
        <FaHome size={22} />
        <span className="font-bold text-xl">Dragon Burguer</span>
      </Link>

      {/* Iconos de navegación */}
      <div className="flex items-center gap-6">
        {/* Menú (productos) */}
        <Link to="/menu" className="flex items-center gap-2 hover:text-gray-200">
          <FaUtensils size={22} />
          <span>Menú</span>
        </Link>

        {/* Carrito */}
        <Link to="/carrito" className="flex items-center gap-2 hover:text-gray-200">
          <FaShoppingCart size={22} />
          <span>Carrito</span>
        </Link>

        {/* Botón de iniciar sesión */}
        <Link
          to="/login"
          className="flex items-center gap-2 bg-white text-red-600 px-3 py-1 rounded-lg hover:bg-gray-200"
        >
          <FaUserCircle size={22} />
          <span>Iniciar sesión</span>
        </Link>

        {/* Botón de cerrar sesión (solo activo si hay usuario) */}
        <button
          onClick={handleLogout}
          disabled={!user}
          className={`flex items-center gap-2 px-3 py-1 rounded-lg ${
            user
              ? "bg-white text-red-600 hover:bg-gray-200"
              : "bg-gray-400 text-white cursor-not-allowed"
          }`}
        >
          <FaSignOutAlt />
          <span>Cerrar sesión</span>
        </button>
      </div>
    </nav>
  )
}

export default Navbar
