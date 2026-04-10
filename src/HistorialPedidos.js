import { useEffect, useState } from "react"
import { supabase } from "./supabaseClient"
import { useNavigate } from "react-router-dom"

function HistorialPedidos() {
  const navigate = useNavigate()
  const [pedidos, setPedidos] = useState([])

  useEffect(() => {
    const fetchPedidos = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data, error } = await supabase
        .from("pedidos")
        .select("*")
        .eq("usuario_id", user.id)
        .order("fecha", { ascending: false })

      if (error) {
        console.error("❌ Error al traer pedidos:", error.message)
      } else {
        setPedidos(data || [])
      }
    }

    fetchPedidos()
  }, [])

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-red-600 mb-6 text-center">
        Historial de pedidos 🍔
      </h1>

      {pedidos.length === 0 ? (
        <p className="text-center text-gray-600">
          No tienes pedidos registrados todavía.
        </p>
      ) : (
        <table className="w-full border-collapse border border-gray-300 shadow-lg rounded-lg overflow-hidden">
          <thead className="bg-gray-100">
            <tr>
              <th className="border px-4 py-2 text-left">Fecha</th>
              <th className="border px-4 py-2 text-left">Método de pago</th>
              <th className="border px-4 py-2 text-left">Total</th>
              <th className="border px-4 py-2 text-left">Detalles</th>
            </tr>
          </thead>
          <tbody>
            {pedidos.map((pedido) => (
              <tr key={pedido.id} className="hover:bg-gray-50">
                <td className="border px-4 py-2">
                  {new Date(pedido.fecha).toLocaleString()}
                </td>
                <td className="border px-4 py-2 capitalize">
                  {pedido.metodo_pago}
                </td>
                <td className="border px-4 py-2">${pedido.total.toFixed(2)}</td>
                <td className="border px-4 py-2">
                  <button
                    onClick={() => navigate(`/pedido/${pedido.id}`)}
                    className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                  >
                    Ver detalles
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <div className="text-center mt-6">
        <button
          onClick={() => navigate("/menu")}
          className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700"
        >
          Volver al menú
        </button>
      </div>
    </div>
  )
}

export default HistorialPedidos
