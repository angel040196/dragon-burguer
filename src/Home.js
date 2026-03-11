function Home() {
  return (
    <div className="min-h-screen bg-yellow-50 p-8">
      {/* Bienvenida */}
      <div className="text-center mb-12">
        <h1 className="text-5xl font-bold text-red-600 mb-4">
          Bienvenido a Dragon Burguer 🍔
        </h1>
        <p className="text-lg text-gray-700">
          Las mejores hamburguesas de Toluca, hechas con pasión y sabor único.
        </p>
      </div>

      {/* Promociones */}
      <h2 className="text-3xl font-semibold text-gray-800 mb-6 text-center">
        Promociones destacadas 🔥
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Promo 1 */}
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1550547660-d9450f859349"
            alt="Promo Hamburguesa"
            className="w-full h-48 object-cover"
          />
          <div className="p-4">
            <h3 className="text-xl font-bold text-gray-800">2x1 en Clásica Dragon</h3>
            <p className="text-gray-600">
              Todos los martes disfruta el doble sabor por el mismo precio.
            </p>
          </div>
        </div>

        {/* Promo 2 */}
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1586190848861-99aa4a171e90"
            alt="Promo Papas"
            className="w-full h-48 object-cover"
          />
          <div className="p-4">
            <h3 className="text-xl font-bold text-gray-800">Combo Papas + Refresco</h3>
            <p className="text-gray-600">
              Por solo $60 acompaña tu hamburguesa con papas y bebida.
            </p>
          </div>
        </div>

        {/* Promo 3 */}
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <img
            src="https://tse1.mm.bing.net/th/id/OIP.6plIDUBK8FbMPlicGzxQSAHaEJ?pid=ImgDet&w=187&h=104&c=7&dpr=1.3&o=7&rm=3"
            alt="Promo Refresco"
            className="w-full h-48 object-cover"
          />
          <div className="p-4">
            <h3 className="text-xl font-bold text-gray-800">Refresco gratis 🍹</h3>
            <p className="text-gray-600">
              En tu primera compra online recibe un refresco gratis.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home
