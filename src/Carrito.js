import { useEffect, useState } from "react"
import { supabase } from "./supabaseClient"
import { Link, useNavigate } from "react-router-dom"

function Carrito() {
  const [items, setItems] = useState([])
  const [user, setUser] = useState(null)
  const navigate = useNavigate()

  // Obtener usuario en sesión
  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
    }
    getUser()
  }, [])

  // Obtener carrito del usuario
  useEffect(() => {
    const getCarrito = async () => {
      if (!user) return
      const { data, error } = await supabase
        .from("carrito")
        .select(`
          id,
          cantidad,
          hamburguesas:hamburguesa_id (
            id,
            nombre,
            precio,
            imagen
          )
        `)
        .eq("usuario_id", user.id)

      if (error) {
        console.error("❌ Error cargando carrito:", error.message)
      } else {
        setItems(data)
      }
    }
    getCarrito()
  }, [user])

  // Calcular total
  const total = items.reduce(
    (acc, item) => acc + item.cantidad * item.hamburguesas.precio,
    0
  )

  // Cancelar compra (vaciar carrito)
  const cancelarCompra = async () => {
    if (!user) return
    const { error } = await supabase.from("carrito").delete().eq("usuario_id", user.id)
    if (error) {
      console.error("❌ Error cancelando compra:", error.message)
    } else {
      setItems([])
      alert("🛑 Compra cancelada, carrito vacío")
    }
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Carrito de compras 🛒</h1>
      {items.length === 0 ? (
        <p>No hay productos en el carrito.</p>
      ) : (
        <div>
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-200">
                <th className="border p-2">Producto</th>
                <th className="border p-2">Cantidad</th>
                <th className="border p-2">Precio</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id}>
                  <td className="border p-2 flex items-center gap-2">
                    {item.hamburguesas.imagen && (
                      <img
                        src={item.hamburguesas.imagen}
                        alt={item.hamburguesas.nombre}
                        className="w-12 h-12 object-cover rounded"
                      />
                    )}
                    {item.hamburguesas.nombre}
                  </td>
                  <td className="border p-2">{item.cantidad}</td>
                  <td className="border p-2">${item.hamburguesas.precio}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <h2 className="text-xl font-bold mt-4">Total: ${total.toFixed(2)}</h2>
          <button
            onClick={() => navigate("/checkout")}
            className="mt-4 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
          >
            Finalizar compra
          </button>
          <button
            onClick={cancelarCompra}
            className="mt-4 ml-4 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700"
          >
            Cancelar compra
          </button>
        </div>
      )}
      <div className="mt-4 flex gap-4">
        <Link to="/menu" className="text-blue-600 hover:underline">
          ← Seguir comprando
        </Link>
        <Link to="/" className="text-blue-600 hover:underline">
          🏠 Ir al Home
        </Link>
      </div>
    </div>
  )
}

export default Carrito
