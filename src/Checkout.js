import { useEffect, useState } from "react"
import { supabase } from "./supabaseClient"
import { useNavigate } from "react-router-dom"

function Checkout() {
  const navigate = useNavigate()
  const [metodo, setMetodo] = useState(null)
  const [formData, setFormData] = useState({
    nombre: "",
    direccion: "",
    tarjeta: "",
    vencimiento: "",
    cvv: "",
    referencia: ""
  })
  const [message, setMessage] = useState("")
  const [total, setTotal] = useState(0)
  const [items, setItems] = useState([])

  // Traer carrito y calcular total
  useEffect(() => {
    const fetchCarrito = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data, error } = await supabase
        .from("carrito")
        .select(`
          cantidad,
          hamburguesas:hamburguesa_id (
            precio,
            nombre
          )
        `)
        .eq("usuario_id", user.id)

      if (error) {
        console.error("❌ Error al traer carrito:", error.message)
        return
      }

      setItems(data || [])

      const totalCalc = (data || []).reduce(
        (acc, item) => acc + item.cantidad * (item.hamburguesas?.precio || 0),
        0
      )
      setTotal(totalCalc)
    }

    fetchCarrito()
  }, [])

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const validarTarjeta = (num) => /^[0-9]{16}$/.test(num)
  const validarCVV = (cvv) => /^[0-9]{3,4}$/.test(cvv)

  const confirmarPedido = async () => {
    // Validaciones según método
    if (metodo === "tarjeta") {
      if (!validarTarjeta(formData.tarjeta)) {
        setMessage("❌ La tarjeta debe tener exactamente 16 dígitos")
        return
      }
      if (!validarCVV(formData.cvv)) {
        setMessage("❌ El CVV debe tener 3 o 4 dígitos")
        return
      }
    }
    if (metodo === "transferencia" && !formData.referencia) {
      setMessage("❌ Ingresa el número de referencia de la transferencia")
      return
    }

    const { data: { user } } = await supabase.auth.getUser()

    // Guardar pedido en Supabase
    const { error } = await supabase.from("pedidos").insert([
      {
        usuario_id: user.id,
        total: total, // ahora guarda el total real
        metodo_pago: metodo,
        datos_cliente: formData,
        fecha: new Date()
      }
    ])

    if (error) {
      setMessage("❌ Error al guardar pedido: " + error.message)
    } else {
      // ✅ Vaciar carrito después de confirmar pedido
      await supabase.from("carrito").delete().eq("usuario_id", user.id)

      setMessage(`✅ Pedido confirmado con pago en ${metodo}`)
      setTimeout(() => navigate("/confirmacion"), 2000)
    }
  }

  return (
    <div className="p-6 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold mb-4">Selecciona método de pago</h1>
      <h2 className="text-lg mb-6">Total a pagar: ${total.toFixed(2)}</h2>

      {!metodo ? (
        <div className="flex flex-col gap-4">
          <button onClick={() => setMetodo("efectivo")} className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">Pago en efectivo</button>
          <button onClick={() => setMetodo("tarjeta")} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">Pago con tarjeta</button>
          <button onClick={() => setMetodo("transferencia")} className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700">Pago por transferencia</button>
        </div>
      ) : (
        <div className="mt-6 space-y-3">
          <h2 className="text-xl font-semibold mb-4">Datos para pago en {metodo}</h2>

          {metodo === "efectivo" && (
            <>
              <input type="text" name="nombre" placeholder="Nombre completo" value={formData.nombre} onChange={handleChange} className="w-full border px-3 py-2 rounded" />
              <input type="text" name="direccion" placeholder="Dirección de entrega" value={formData.direccion} onChange={handleChange} className="w-full border px-3 py-2 rounded" />
            </>
          )}

          {metodo === "tarjeta" && (
            <>
              <input type="text" name="nombre" placeholder="Nombre en la tarjeta" value={formData.nombre} onChange={handleChange} className="w-full border px-3 py-2 rounded" />
              <input type="text" name="tarjeta" placeholder="Número de tarjeta (16 dígitos)" value={formData.tarjeta} onChange={handleChange} className="w-full border px-3 py-2 rounded" />
              <input type="text" name="vencimiento" placeholder="MM/AA" value={formData.vencimiento} onChange={handleChange} className="w-full border px-3 py-2 rounded" />
              <input type="text" name="cvv" placeholder="CVV (3-4 dígitos)" value={formData.cvv} onChange={handleChange} className="w-full border px-3 py-2 rounded" />
            </>
          )}

          {metodo === "transferencia" && (
            <>
              <input type="text" name="nombre" placeholder="Nombre del titular" value={formData.nombre} onChange={handleChange} className="w-full border px-3 py-2 rounded" />
              <input type="text" name="referencia" placeholder="Número de referencia de transferencia" value={formData.referencia} onChange={handleChange} className="w-full border px-3 py-2 rounded" />
            </>
          )}

          <button onClick={confirmarPedido} className="mt-4 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700">Confirmar pedido</button>
        </div>
      )}

      {message && <p className="mt-4 text-center">{message}</p>}
      <button onClick={() => navigate("/carrito")} className="mt-6 text-blue-600 hover:underline">← Volver al carrito</button>
    </div>
  )
}

export default Checkout
