"use client"

import { useState, useEffect } from "react"
import Sidebar from "./components/Sidebar"
import TopNavbar from "./components/TopNavbar"
import LoginPage from "./pages/LoginPage"
import DashboardPage from "./pages/DashboardPage"
import ProfilePage from "./pages/ProfilePage"
import SchemeSelectionPage from "./pages/SchemeSelectionPage"
import AllApplicationsPage from "./pages/AllApplicationsPage"
import PendingApplicationsPage from "./pages/PendingApplicationsPage"
import EditApplicationsPage from "./pages/EditApplicationsPage"
import { isAuthenticated, getUser } from "./utils/auth"
import { Toaster } from "react-hot-toast"
import "./App.css"

function App() {
  const [currentPage, setCurrentPage] = useState("login")
  const [currentMode, setCurrentMode] = useState("view")
  const [isSidebarOpen, setSidebarOpen] = useState(false)
  const [user, setUser] = useState(null)

  useEffect(() => {
    if (isAuthenticated()) {
      const userData = getUser()
      setUser(userData)
      if (currentPage === "login") {
        setCurrentPage("dashboard")
      }
    } else {
      setCurrentPage("login")
    }
  }, [currentPage])

  const handleNavigation = (page, mode = "view") => {
    setCurrentPage(page)
    setCurrentMode(mode)
    // Close sidebar on mobile after navigation
    setSidebarOpen(false)
  }

  const toggleSidebar = () => {
    setSidebarOpen((prev) => !prev)
  }

  const renderPage = () => {
    switch (currentPage) {
      case "login":
        return <LoginPage onNavigate={handleNavigation} setUser={setUser} />
      case "scheme-selection":
        return <SchemeSelectionPage onNavigate={handleNavigation} />
      case "dashboard":
        return <DashboardPage />
      case "profile":
        return <ProfilePage onNavigate={handleNavigation} />
      case "all-applications":
        return <AllApplicationsPage />
      case "pending-applications":
        return <PendingApplicationsPage />
      case "edit-applications":
        return <EditApplicationsPage />
      default:
        return <DashboardPage />
    }
  }

  // Show login page without sidebar
  if (currentPage === "login") {
    return (
      <div className="App">
        <Toaster position="top-right" reverseOrder={false} />
        {renderPage()}
      </div>
    )
  }

  // Show scheme selection without sidebar
  if (currentPage === "scheme-selection") {
    return (
      <div className="App">
        <Toaster position="top-right" reverseOrder={false} />
        {renderPage()}
      </div>
    )
  }

  // Show loading if not authenticated
  if (!isAuthenticated()) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  // Main layout with sidebar
  return (
    <div className="App flex h-screen overflow-hidden bg-gray-50">
      <Toaster position="top-right" reverseOrder={false} />

      {/* Desktop Sidebar */}
      <div className="hidden md:flex md:flex-shrink-0">
        <div className="flex flex-col w-64">
          <Sidebar
            isCollapsed={false}
            currentPage={currentPage}
            currentMode={currentMode}
            onNavigate={handleNavigation}
          />
        </div>
      </div>

      {/* Mobile Sidebar */}
      <div className="md:hidden">
        {/* Mobile Overlay */}
        {isSidebarOpen && <div className="fixed inset-0 z-40 bg-black bg-opacity-50" onClick={toggleSidebar} />}

        {/* Mobile Sidebar */}
        <div
          className={`fixed inset-y-0 left-0 z-50 w-64 bg-white transform transition-transform duration-300 ease-in-out ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"
            }`}
        >
          <Sidebar
            isCollapsed={false}
            currentPage={currentPage}
            currentMode={currentMode}
            onNavigate={handleNavigation}
          />
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-col w-0 flex-1 overflow-hidden">
        <TopNavbar user={user} onToggleSidebar={toggleSidebar} />
        {/* <main className="flex-1 relative overflow-y-auto focus:outline-none">
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">{renderPage()}</div>
          </div>
        </main> */}
        <main className="flex-1 overflow-y-auto focus:outline-none">
          {renderPage()}
        </main>

      </div>
    </div>
  )
}

export default App
