"use client"
import { Eye, Pencil } from "lucide-react"

export default function SchemeSelectionPage({ onNavigate }) {
  const handleModeSelect = (mode) => {
    onNavigate("dashboard", mode)
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-3xl mx-auto px-6">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-3">Choose an Action</h1>
          <p className="text-gray-600 text-lg">Select whether you want to view or edit the dashboard</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          <div className="bg-white rounded-xl shadow-lg p-8 flex flex-col justify-between">
            <div>
              <div className="w-14 h-14 bg-blue-500 rounded-lg flex items-center justify-center mb-5">
                <Eye className="h-7 w-7 text-white" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-2">View Dashboard</h3>
              <p className="text-gray-600 mb-6">Check scheme details in view-only mode.</p>
            </div>
            <button
              onClick={() => handleModeSelect("view")}
              className="flex items-center justify-center px-4 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
            >
              View Now
              <Eye className="h-5 w-5 ml-2" />
            </button>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-8 flex flex-col justify-between">
            <div>
              <div className="w-14 h-14 bg-green-500 rounded-lg flex items-center justify-center mb-5">
                <Pencil className="h-7 w-7 text-white" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-2">Edit Dashboard</h3>
              <p className="text-gray-600 mb-6">Update or manage scheme information.</p>
            </div>
            <button
              onClick={() => handleModeSelect("edit")}
              className="flex items-center justify-center px-4 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition"
            >
              Edit Now
              <Pencil className="h-5 w-5 ml-2" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
