"use client"
import { Menu, Bell, User } from "lucide-react"

const TopNavbar = ({ user, onToggleSidebar }) => {
  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button onClick={onToggleSidebar} className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100">
            <Menu className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-lg font-semibold text-gray-900">SRA</h1>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <button className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 relative">
            <Bell className="h-5 w-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>

          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
              <User className="h-4 w-4 text-white" />
            </div>
            <div className="hidden md:block">
              <p className="text-xs text-gray-500">{user?.role || "Administrator"}</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

export default TopNavbar
