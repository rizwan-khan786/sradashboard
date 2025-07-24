"use client"
import { useState, useEffect } from "react"
import { ArrowLeft, Mail, User, Shield } from "lucide-react"
import axios from "axios"
import { getAuthToken, isAuthenticated, removeAuthToken } from "../utils/auth"

const BASE_URL = import.meta.env.VITE_BASE_URL || "http://localhost:4200"

export default function ProfilePage({ onNavigate }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  const fetchUserProfile = async () => {
    const token = getAuthToken()
    if (!token) {
      removeAuthToken()
      onNavigate("login")
      return
    }

    try {
      const response = await axios.get(`${BASE_URL}/api/auth/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      setUser(response.data)
    } catch (error) {
      console.error("Error fetching profile:", error)
      removeAuthToken()
      onNavigate("login")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!isAuthenticated()) {
      onNavigate("login")
    } else {
      fetchUserProfile()
    }
  }, [onNavigate])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-orange-100 via-orange-50 to-orange-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-orange-500 mx-auto"></div>
          <p className="mt-4 text-orange-600 text-lg font-medium">Loading profile...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-tr from-orange-50 via-white to-orange-50 flex flex-col">
      

      <main className="flex-grow flex items-center justify-center px-4 pb-12">
        <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 sm:p-10 md:p-12">
          {/* Profile Header */}
          <div className="flex items-center space-x-6 mb-8">
            <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center shadow-inner">
              <User className="w-10 h-10 text-orange-600" />
            </div>
            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900">{user?.name || "User"}</h2>
              <p className="text-md sm:text-lg text-orange-600 capitalize mt-1">{user?.role || "User"}</p>
            </div>
          </div>

          {/* Profile Details */}
          <div className="space-y-6 text-gray-700 text-base sm:text-lg">
            <div className="flex items-center space-x-3">
              <Mail className="h-5 w-5 text-orange-400" />
              <span>{user?.email || "N/A"}</span>
            </div>
            <div className="flex items-center space-x-3">
              <Shield className="h-5 w-5 text-orange-400" />
              <span>
                User ID: <span className="font-medium">{user?.user_id || "N/A"}</span>
              </span>
            </div>
            <div className="flex items-center space-x-3">
              <span className="font-semibold">District:</span>
              <span>{user?.district || "N/A"}</span>
            </div>
            <div className="flex items-center space-x-3">
              <span className="font-semibold">Taluka:</span>
              <span>{user?.taluka || "N/A"}</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
