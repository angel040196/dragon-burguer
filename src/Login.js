import { useState } from "react"
import { supabase } from "./supabaseClient"
import { useNavigate } from "react-router-dom"

function Login() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [message, setMessage] = useState("")
  const navigate = useNavigate()

  // Validaciones simples
  const validateForm = () => {
    if (!email.includes("@")) {
      setMessage("❌ Ingresa un correo válido (ejemplo: usuario@gmail.com)")
      return false
    }
    if (password.length < 6) {
      setMessage("❌ La contraseña debe tener al menos 6 caracteres")
      return false
    }
    return true
  }

  // Iniciar sesión con correo/contraseña
  const handleLogin = async (e) => {
    e.preventDefault()
    if (!validateForm()) return
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    if (error) {
      setMessage("❌ Error al iniciar sesión: " + error.message)
    } else {
      setMessage("✅ Sesión iniciada correctamente")
      console.log("Usuario:", data.user)
      navigate("/menu")
    }
  }

  // Registrar usuario
  const handleRegister = async (e) => {
    e.preventDefault()
    if (!validateForm()) return
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    })
    if (error) {
      setMessage("❌ Error al registrarse: " + error.message)
    } else {
      setMessage("✅ Usuario registrado correctamente")
      console.log("Usuario:", data.user)
      navigate("/menu")
    }
  }

  // Login con proveedores externos (Google, Facebook, Apple)
  const handleOAuthLogin = async (provider) => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/menu`, // se adapta automáticamente
      },
    })
    if (error) {
      console.error(`❌ Error con ${provider}:`, error.message)
    }
  }

  // Invitado
  const handleGuest = () => {
    setMessage("👤 Entraste como invitado (no podrás comprar)")
    navigate("/menu")
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-red-600 mb-6">
          Inicia sesión y disfruta la experiencia
        </h2>

        {/* Botones de proveedores */}
        <div className="space-y-4 mb-6">
          <button
            onClick={() => handleOAuthLogin("facebook")}
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
          >
            Continuar con Facebook
          </button>

          <button
            onClick={() => handleOAuthLogin("google")}
            className="w-full bg-red-500 text-white py-2 rounded-lg hover:bg-red-600"
          >
            Continuar con Google
          </button>

          <button
            onClick={() => handleOAuthLogin("apple")}
            className="w-full bg-black text-white py-2 rounded-lg hover:bg-gray-800"
          >
            Continuar con Apple
          </button>
        </div>

        {/* Login con correo */}
        <form className="space-y-4 mb-6">
          <input
            type="email"
            placeholder="Ejemplo: usuario@gmail.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg"
          />
          <input
            type="password"
            placeholder="Contraseña (mínimo 6 caracteres)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg"
          />
          <div className="flex justify-between">
            <button
              onClick={handleLogin}
              className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
            >
              Iniciar sesión
            </button>
            <button
              onClick={handleRegister}
              className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
            >
              Registrarse
            </button>
          </div>
        </form>

        {/* Invitado */}
        <div className="text-center">
          <button
            onClick={handleGuest}
            className="text-gray-600 hover:text-gray-800"
          >
            Continuar como invitado →
          </button>
        </div>

        {/* Mensajes */}
        {message && (
          <p className="mt-4 text-center text-gray-700">{message}</p>
        )}
      </div>
    </div>
  )
}

export default Login
