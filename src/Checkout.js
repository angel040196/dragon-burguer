import { useNavigate } from "react-router-dom"

function Checkout() {
  const navigate = useNavigate()

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Selecciona método de pago</h1>
      <div className="flex flex-col gap-4">
        <button
          onClick={() => navigate("/confirmacion", { state: { metodo: "efectivo" } })}
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
        >
          Pago en efectivo
        </button>
        <button
          onClick={() => navigate("/pago-tarjeta")}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          Pago con tarjeta
        </button>
        <button
          onClick={() => navigate("/pago-transferencia")}
          className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700"
        >
          Pago por transferencia
        </button>
      </div>
      <button
        onClick={() => navigate("/carrito")}
        className="mt-6 text-blue-600 hover:underline"
      >
        ← Volver al carrito
      </button>
    </div>
  )
}

export default Checkout
