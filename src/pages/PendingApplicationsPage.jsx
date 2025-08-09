"use client"

import { useState } from "react"
import { Clock, CheckCircle, XCircle, Eye } from "lucide-react"

const PendingApplicationsPage = () => {
  const [selectedApplications, setSelectedApplications] = useState([])

  const pendingApplications = [
    {
      id: "APP002",
      name: "Rajesh Kumar",
      scheme: "Nutrition Program",
      date: "2024-01-14",
      amount: "₹3,500",
      priority: "high",
    },
    {
      id: "APP005",
      name: "Kavita Singh",
      scheme: "Skill Development",
      date: "2024-01-11",
      amount: "₹2,800",
      priority: "medium",
    },
    {
      id: "APP007",
      name: "Meera Joshi",
      scheme: "Child Care Support",
      date: "2024-01-10",
      amount: "₹4,500",
      priority: "high",
    },
    {
      id: "APP009",
      name: "Ravi Gupta",
      scheme: "Women Empowerment",
      date: "2024-01-09",
      amount: "₹5,200",
      priority: "low",
    },
  ]

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800"
      case "medium":
        return "bg-yellow-100 text-yellow-800"
      case "low":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const handleSelectApplication = (appId) => {
    setSelectedApplications((prev) => (prev.includes(appId) ? prev.filter((id) => id !== appId) : [...prev, appId]))
  }

  const handleBulkAction = (action) => {
    console.log(`${action} applications:`, selectedApplications)
    setSelectedApplications([])
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Pending Applications</h1>
        <p className="text-gray-600">Review and process pending scheme applications</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <Clock className="h-8 w-8 text-yellow-600" />
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-gray-900">Total Pending</h3>
              <p className="text-2xl font-bold text-yellow-600">{pendingApplications.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <CheckCircle className="h-8 w-8 text-green-600" />
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-gray-900">High Priority</h3>
              <p className="text-2xl font-bold text-green-600">
                {pendingApplications.filter((app) => app.priority === "high").length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <XCircle className="h-8 w-8 text-red-600" />
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-gray-900">Overdue</h3>
              <p className="text-2xl font-bold text-red-600">2</p>
            </div>
          </div>
        </div>
      </div>

      {selectedApplications.length > 0 && (
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-between">
            <span className="text-sm text-orange-800">{selectedApplications.length} application(s) selected</span>
            <div className="flex gap-2">
              <button
                onClick={() => handleBulkAction("approve")}
                className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700"
              >
                Approve Selected
              </button>
              <button
                onClick={() => handleBulkAction("reject")}
                className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700"
              >
                Reject Selected
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left">
                  <input
                    type="checkbox"
                    className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedApplications(pendingApplications.map((app) => app.id))
                      } else {
                        setSelectedApplications([])
                      }
                    }}
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Application ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Applicant Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Scheme
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Priority
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {pendingApplications.map((app) => (
                <tr key={app.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="checkbox"
                      className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                      checked={selectedApplications.includes(app.id)}
                      onChange={() => handleSelectApplication(app.id)}
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{app.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{app.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{app.scheme}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{app.amount}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPriorityColor(app.priority)}`}
                    >
                      {app.priority.charAt(0).toUpperCase() + app.priority.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{app.date}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex gap-2">
                      <button className="text-blue-600 hover:text-blue-900">
                        <Eye className="h-4 w-4" />
                      </button>
                      <button className="text-green-600 hover:text-green-900">
                        <CheckCircle className="h-4 w-4" />
                      </button>
                      <button className="text-red-600 hover:text-red-900">
                        <XCircle className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default PendingApplicationsPage
