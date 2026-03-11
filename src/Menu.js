import { supabase } from './supabaseClient'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

function Menu() {
  const [hamburguesas, setHamburguesas] = useState([])
  const [user, setUser] = useState(null)
  const [cantidades, setCantidades] = useState({})
  const navigate = useNavigate()

  // Obtener hamburguesas
  useEffect(() => {
    const getHamburguesas = async () => {
      const { data, error } = await supabase.from('hamburguesas').select('*')
      if (error) {
        console.error("❌ Error conectando a Supabase:", error.message)
      } else {
        setHamburguesas(data)
      }
    }
    getHamburguesas()
  }, [])

  // Obtener usuario en sesión y escuchar cambios
  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
    }
    getUser()

    // Escuchar cambios de sesión en tiempo real
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  // Manejar cantidad seleccionada
  const handleCantidadChange = (id, value) => {
    setCantidades({ ...cantidades, [id]: value })
  }

  // Agregar al carrito y redirigir
  const agregarAlCarrito = async (item) => {
    const cantidad = cantidades[item.id] || 1
    if (!user) {
      alert("Debes iniciar sesión para comprar")
      return
    }
    const { error } = await supabase.from("carrito").insert([
      {
        usuario_id: user.id,
        hamburguesa_id: item.id,
        cantidad: cantidad
      }
    ])
    if (error) {
      console.error("❌ Error agregando al carrito:", error.message)
    } else {
      alert("✅ Producto agregado al carrito")
      navigate("/carrito") // redirige directo al carrito
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-2xl font-bold mb-6">Menú de Hamburguesas 🍔</h1>

      {/* Mostrar usuario en sesión */}
      {user ? (
        <p className="mb-4 text-gray-700">
          👤 Sesión iniciada como: <span className="font-semibold">{user.email}</span>
        </p>
      ) : (
        <p className="mb-4 text-gray-500">No has iniciado sesión</p>
      )}

      {hamburguesas.length === 0 ? (
        <p className="text-gray-600 text-center">No hay productos registrados aún.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {hamburguesas.map((item) => (
            <div key={item.id} className="bg-white shadow-lg rounded-lg overflow-hidden">
              {item.imagen && (
                <div className="w-full bg-gray-100 flex items-center justify-center">
                  <img
                    src={item.imagen}
                    alt={item.nombre}
                    className="w-full h-64 object-contain"
                  />
                </div>
              )}
              <div className="p-4">
                <h2 className="text-xl font-semibold text-gray-800">{item.nombre}</h2>
                <p className="text-gray-600">{item.descripcion}</p>
                <p className="text-green-600 font-bold mt-2">${item.precio}</p>

                {/* Selección de cantidad */}
                <input
                  type="number"
                  min="1"
                  value={cantidades[item.id] || 1}
                  onChange={(e) => handleCantidadChange(item.id, parseInt(e.target.value))}
                  className="w-full border p-2 mt-2"
                />

                {/* Botón de comprar */}
                {user ? (
                  <button
                    onClick={() => agregarAlCarrito(item)}
                    className="mt-4 w-full bg-red-500 text-white py-2 rounded-lg hover:bg-red-600"
                  >
                    Agregar al carrito
                  </button>
                ) : (
                  <button
                    disabled
                    className="mt-4 w-full bg-gray-400 text-white py-2 rounded-lg cursor-not-allowed"
                  >
                    Inicia sesión para comprar
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Menu
