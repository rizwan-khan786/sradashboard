"use client"
import { useState } from "react"
import SRAEditForm from "./sra-edit-page"

const EditApplicationsPage = () => {
  const [applicationId, setApplicationId] = useState("")
  const [showForm, setShowForm] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (applicationId.trim()) {
      setShowForm(true)
    }
  }

  if (showForm) {
    return <SRAEditForm applicationId={applicationId} />
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-md p-8 w-full max-w-md">
        <h1 className="text-3xl font-bold text-gray-900 mb-6 text-center">Edit SRA Application</h1>

        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Enter Application ID</label>
            <input
              type="text"
              value={applicationId}
              onChange={(e) => setApplicationId(e.target.value)}
              placeholder="Enter your application ID (e.g., 1, 2, 3...)"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-lg"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-orange-600 text-white py-3 px-4 rounded-lg hover:bg-orange-700 font-medium text-lg"
          >
            Load Application for Editing
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-600">
          <p>Enter your application ID to load and edit your SRA application details and documents.</p>
        </div>
      </div>
    </div>
  )
}

export default EditApplicationsPage
