import { useEffect, useState } from "react"
import { supabase } from "./supabaseClient"
import { useNavigate } from "react-router-dom"

function Confirmacion() {
  const navigate = useNavigate()
  const [pedido, setPedido] = useState(null)

  useEffect(() => {
    const fetchPedido = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      // Traemos el último pedido del usuario
      const { data, error } = await supabase
        .from("pedidos")
        .select("*")
        .eq("usuario_id", user.id)
        .order("fecha", { ascending: false })
        .limit(1)

      if (!error && data.length > 0) {
        setPedido(data[0])
      }
    }
    fetchPedido()
  }, [])

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold text-green-600 mb-6 text-center">
        Confirmación de pedido ✅
      </h1>

      {!pedido ? (
        <p className="text-center text-gray-600">
          No se encontró ningún pedido reciente.
        </p>
      ) : (
        <div className="space-y-6 bg-white shadow-lg rounded-lg p-6">
          {/* Método de pago */}
          <div className="border-b pb-4">
            <h2 className="text-xl font-semibold">Método de pago</h2>
            <p className="text-gray-700 capitalize">{pedido.metodo_pago}</p>
          </div>

          {/* Total */}
          <div className="border-b pb-4">
            <h2 className="text-xl font-semibold">Total</h2>
            <p className="text-gray-700">${pedido.total.toFixed(2)}</p>
          </div>

          {/* Datos del cliente */}
          <div className="border-b pb-4">
            <h2 className="text-xl font-semibold mb-2">Datos del cliente</h2>
            <div className="grid grid-cols-2 gap-4 text-gray-700">
              {pedido.datos_cliente?.nombre && (
                <div>
                  <span className="font-medium">Nombre:</span>{" "}
                  {pedido.datos_cliente.nombre}
                </div>
              )}
              {pedido.datos_cliente?.direccion && (
                <div>
                  <span className="font-medium">Dirección:</span>{" "}
                  {pedido.datos_cliente.direccion}
                </div>
              )}
              {pedido.metodo_pago === "tarjeta" && (
                <>
                  <div>
                    <span className="font-medium">Tarjeta:</span>{" "}
                    **** **** **** {pedido.datos_cliente.tarjeta?.slice(-4)}
                  </div>
                  <div>
                    <span className="font-medium">Vencimiento:</span>{" "}
                    {pedido.datos_cliente.vencimiento}
                  </div>
                  <div>
                    <span className="font-medium">CVV:</span> ●●●
                  </div>
                </>
              )}
              {pedido.metodo_pago === "transferencia" && (
                <div>
                  <span className="font-medium">Referencia:</span>{" "}
                  {pedido.datos_cliente.referencia}
                </div>
              )}
            </div>
          </div>

          {/* Fecha */}
          <div>
            <h2 className="text-xl font-semibold mb-2">Fecha del pedido</h2>
            <p className="text-gray-700">
              {new Date(pedido.fecha).toLocaleString()}
            </p>
          </div>
        </div>
      )}

      <div className="text-center mt-6">
        <button
          onClick={() => navigate("/menu")}
          className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700"
        >
          Seguir comprando 🍔
        </button>
      </div>
    </div>
  )
}

export default Confirmacion
