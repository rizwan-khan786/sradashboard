"use client"
import { useState, useEffect } from "react"
import { Eye, EyeOff, Mail, Phone, Shield } from "lucide-react"
import axios from "axios"
import toast, { Toaster } from "react-hot-toast"
import { isAuthenticated, setAuthToken, removeAuthToken } from "../utils/auth"

const LOGIN_URL = import.meta.env.VITE_BASE_URL || "https://sra.saavi.co.in"

export default function LoginPage({ onNavigate, setUser }) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (isAuthenticated()) {
      onNavigate("dashboard")
    } else {
      removeAuthToken()
    }
  }, [onNavigate])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const response = await axios.post(
        `${LOGIN_URL}/api/auth/login`,
        {
          email: email.trim(),
          password: password.trim(),
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      )

      const data = response.data
      console.log("✅ LOGIN SUCCESS:", data)

      if (response.status === 200 && data.token) {
        setAuthToken(data.token, data.user || null)
        setUser(data.user || null)

        toast.custom(
          (t) => (
            <div
              className={`flex items-center max-w-sm w-full bg-white border border-orange-300 shadow-lg rounded-lg p-4 space-x-4 transition duration-300 ${
                t.visible ? "animate-enter" : "animate-leave"
              }`}
            >
              <img src="/images/logo.jpeg" alt="Logo" width={40} height={40} className="rounded" />
              <div className="flex-1">
                <p className="font-semibold text-gray-800">Login Successful 🎉</p>
                <p className="text-sm text-gray-600">Welcome back to the dashboard</p>
              </div>
            </div>
          ),
          { duration: 3000 },
        )

        setTimeout(() => {
          onNavigate("scheme-selection")
        }, 1000)
      } else {
        setError("Login failed: No token received.")
        toast.error("Login failed: No token received.")
      }
    } catch (err) {
      console.error("❌ LOGIN ERROR:", err?.response?.data || err.message)
      const message = err?.response?.data?.message || "Invalid email or password. Please try again."
      setError(message)
      toast.error(message)
    } finally {
      setLoading(false)
    }
  }

  const fillDemoCredentials = () => {
    setEmail("admin@gmail.com")
    setPassword("123456")
  }

  return (
    <div className="min-h-screen bg-orange-50 flex items-center justify-center p-4 relative">
      <Toaster position="top-right" reverseOrder={false} />
      <div className="absolute inset-0 opacity-10 z-0">
        <img src="/images/logo.jpeg" alt="Background" className="w-full h-full object-contain" />
      </div>
      <div className="relative z-10 w-full max-w-md bg-white/95 backdrop-blur-md rounded-xl shadow-xl p-8">
        <div className="text-center mb-6">
          <div className="inline-block w-16 h-16 rounded-xl border border-gray-200 shadow overflow-hidden">
            <img src="/images/logo.jpeg" alt="Logo" width={64} height={64} />
          </div>
          <h2 className="text-xl font-bold mt-4">SRA</h2>
          <p className="text-sm text-gray-500">Technology for Social Impact</p>
          <span className="inline-flex items-center mt-2 px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-xs">
            <Shield className="h-3 w-3 mr-1" />
            WCD - Maharashtra Dashboard
          </span>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-blue-800">Demo Credentials</p>
            </div>
            <button
              onClick={fillDemoCredentials}
              className="text-xs bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700"
            >
              Fill
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="bg-red-100 border border-red-300 text-red-700 px-4 py-2 rounded text-sm">{error}</div>
          )}

          <div>
            <label htmlFor="email" className="text-sm font-medium text-gray-700 mb-1 block">
              Email / ID
            </label>
            <input
              id="email"
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none"
              placeholder="Enter your email"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="text-sm font-medium text-gray-700 mb-1 block">
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg pr-10 focus:ring-2 focus:ring-orange-500 focus:outline-none"
                placeholder="Enter your password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-orange-500 to-pink-500 text-white py-2 rounded-lg font-medium hover:from-orange-600 hover:to-pink-600 transition disabled:opacity-50"
          >
            {loading ? "Signing in..." : "Sign In to Dashboard"}
          </button>
        </form>

        <div className="text-center text-sm mt-6 border-t pt-4 text-gray-500">
          <a href="#" className="text-orange-600 hover:underline text-xs">
            Forgot Password?
          </a>
          <div className="flex justify-center mt-2 gap-4 text-xs">
            <a href="#" className="flex items-center text-gray-600 hover:text-black">
              <Mail className="h-3 w-3 mr-1" />
              Support
            </a>
            <a href="#" className="flex items-center text-gray-600 hover:text-black">
              <Phone className="h-3 w-3 mr-1" />
              Contact
            </a>
          </div>
        </div>

        <div className="text-center mt-4 text-xs text-gray-400">
          <p>© 2025 All rights reserved.</p>
          <p>SRA</p>
        </div>
      </div>
    </div>
  )
}
