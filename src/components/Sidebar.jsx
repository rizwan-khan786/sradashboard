"use client"
import { LayoutDashboard, FileClock, Edit3, LogOut, ArrowLeft, User, FileText } from 'lucide-react'
import { removeAuthToken } from "../utils/auth"
import toast from "react-hot-toast"

const Sidebar = ({ isCollapsed, currentPage, currentMode, onNavigate }) => {
  const handleLogout = () => {
    removeAuthToken()
    toast.custom(
      (t) => (
        <div
          className={`flex items-center max-w-sm w-full bg-white border border-orange-300 shadow-lg rounded-lg p-4 space-x-4 transition duration-300 ${
            t.visible ? "animate-enter" : "animate-leave"
          }`}
        >
          <img src="/images/logo.jpeg" alt="Logo" width={40} height={40} className="rounded" />
          <div className="flex-1">
            <p className="font-semibold text-gray-800">Logged out successfully 👋</p>
            <p className="text-sm text-gray-600">See you again soon!</p>
          </div>
        </div>
      ),
      {
        duration: 3000,
      },
    )
    onNavigate("login")
  }

  const navigationItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "profile", label: "Profile", icon: User },
    { id: "all-applications", label: "All Applications", icon: FileText },
    { id: "edit-applications", label: "Edit Applications", icon: Edit3 },
    
  ]

  const handleNavigation = (viewId) => {
    onNavigate(viewId, currentMode)
  }

  return (
    <div
      className={`bg-white border-r border-gray-200 transition-all duration-300 ${
        isCollapsed ? "w-16" : "w-64"
      } flex flex-col h-full shadow-lg`}
    >
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          {!isCollapsed && (
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-xl overflow-hidden">
                <img src="/images/logo.jpeg" alt="Logo" width={48} height={48} className="w-full h-full object-cover" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-gray-900">SRA</h2>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="p-4 border-b border-gray-200">
        <button
          onClick={() => onNavigate("scheme-selection")}
          className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors"
          title={isCollapsed ? "Back to Schemes" : undefined}
        >
          <ArrowLeft className="h-5 w-5 flex-shrink-0" />
          {!isCollapsed && <span>Back</span>}
        </button>
      </div>

      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {navigationItems.map((item) => (
            <li key={item.id}>
              <button
                onClick={() => handleNavigation(item.id)}
                className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  currentPage === item.id
                    ? "bg-orange-100 text-orange-700 border-r-2 border-orange-500"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                }`}
                title={isCollapsed ? item.label : undefined}
              >
                <item.icon className="h-5 w-5 flex-shrink-0" />
                {!isCollapsed && <span>{item.label}</span>}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      <div className="p-4 border-t border-gray-200">
        <button
          onClick={handleLogout}
          className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
          title={isCollapsed ? "Logout" : undefined}
        >
          <LogOut className="h-5 w-5 flex-shrink-0" />
          {!isCollapsed && <span>Logout</span>}
        </button>
      </div>
    </div>
  )
}

export default Sidebar
