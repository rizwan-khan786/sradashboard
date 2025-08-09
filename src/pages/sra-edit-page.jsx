

"use client"
import { useState, useEffect } from "react"

const API_BASE_URL = "http://13.203.251.59:4200"
const DOCUMENT_BASE_URL = "http://13.203.251.59:4200"

const getAuthToken = () => {
  if (typeof window === "undefined") return null
  return localStorage.getItem("authToken")
}

const SRAEditForm = ({ applicationId }) => {
  const [formData, setFormData] = useState({})
  const [originalData, setOriginalData] = useState({})
  const [files, setFiles] = useState({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)
  const [activeTab, setActiveTab] = useState("personal")

  const fileFieldsMap = {
    photo_self: "photo_self_path",
    photo_family: "photo_family_path",
    biometric: "biometric_path",
    doc_front_view: "front_photo_path",
    doc_side_view: "side_photo_path",
    video_inside: "inside_video_path",
    video_self_declaration: "declaration_video_path",
    adivashihutimage: "adivashihutimage",
    doc_before_2000: "doc_before_2000",
    submitted_docs_before_2000: "submitted_docs_before_2000",
    description_doc_before_2000: "description_doc_before_2000",
    after_2000_proof_submitted: "after_2000_proof_submitted",
    possession_doc_info: "possession_doc_info",
    Seldeclaration_letter: "Seldeclaration_letter",
    Ration_card_info: "Ration_card_info",
    Voter_card_info: "Voter_card_info",
    Other_doc_info: "Other_doc_info",
  }

  const extractDocumentPath = (fullPath) => {
    if (!fullPath) return null
    const uploadsIndex = fullPath.indexOf("/uploads")
    if (uploadsIndex !== -1) {
      return fullPath.substring(uploadsIndex)
    }
    return fullPath
  }

  const getDocumentUrl = (documentPath) => {
    if (!documentPath) return null
    const cleanPath = extractDocumentPath(documentPath)
    return cleanPath ? `${DOCUMENT_BASE_URL}${cleanPath}` : null
  }

  const getFileExtension = (filePath) => {
    if (!filePath) return ""
    return filePath.split(".").pop().toLowerCase()
  }

  const isImageFile = (filePath) => {
    const imageExtensions = ["jpg", "jpeg", "png", "gif", "bmp", "webp"]
    return imageExtensions.includes(getFileExtension(filePath))
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        setError(null)

        const token = getAuthToken()
        if (!token) {
          throw new Error("No authentication token found")
        }

        const response = await fetch(`${API_BASE_URL}/api/sra-logs/all-logs`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        })

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const data = await response.json()
        const application = data.find((app) => app.id == applicationId)

        if (!application) {
          throw new Error("Application not found")
        }

        setOriginalData(application)
        setFormData(application)
      } catch (err) {
        console.error("Error fetching data:", err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    if (applicationId) {
      fetchData()
    }
  }, [applicationId])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleFileChange = (e) => {
    const { name, files: selectedFiles } = e.target
    if (selectedFiles && selectedFiles[0]) {
      setFiles((prev) => ({
        ...prev,
        [name]: selectedFiles[0],
      }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError(null)
    setSuccess(null)

    try {
      const token = getAuthToken()
      if (!token) {
        throw new Error("No authentication token found")
      }

      const formDataToSend = new FormData()

      Object.keys(formData).forEach((key) => {
        if (formData[key] !== originalData[key]) {
          formDataToSend.append(key, formData[key] || "")
        }
      })

      Object.keys(files).forEach((key) => {
        if (files[key]) {
          formDataToSend.append(key, files[key])
        }
      })

      const response = await fetch(`${API_BASE_URL}/api/sra-logs/sra-form-logs/${applicationId}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formDataToSend,
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`)
      }

      const result = await response.json()
      setSuccess("Application updated successfully!")

      setTimeout(() => {
        window.location.reload()
      }, 2000)
    } catch (err) {
      console.error("Error updating application:", err)
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading application data...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="text-red-600 text-6xl mb-4">⚠️</div>
          <p className="text-red-600 mb-4 text-xl">Error loading application</p>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Edit SRA Application</h1>
        <p className="text-gray-600 text-lg">Update your application details and documents - ID: {applicationId}</p>
      </div>

      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">✅ {success}</div>
      )}

      {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">❌ {error}</div>}

      <div className="bg-white rounded-lg shadow-md mb-6">
        <div className="flex border-b">
          <button
            onClick={() => setActiveTab("personal")}
            className={`px-6 py-4 font-medium ${
              activeTab === "personal"
                ? "border-b-2 border-orange-500 text-orange-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            👤 Personal Details
          </button>
          <button
            onClick={() => setActiveTab("location")}
            className={`px-6 py-4 font-medium ${
              activeTab === "location"
                ? "border-b-2 border-orange-500 text-orange-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            📍 Location & Property
          </button>
          <button
            onClick={() => setActiveTab("family")}
            className={`px-6 py-4 font-medium ${
              activeTab === "family"
                ? "border-b-2 border-orange-500 text-orange-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            👨‍👩‍👧‍👦 Family Details
          </button>
          <button
            onClick={() => setActiveTab("documents")}
            className={`px-6 py-4 font-medium ${
              activeTab === "documents"
                ? "border-b-2 border-orange-500 text-orange-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            📄 Documents
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        {activeTab === "personal" && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-2xl font-bold mb-6 text-gray-900">Personal Information</h2>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                <input
                  type="text"
                  name="first_name"
                  value={formData.first_name || ""}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Middle Name</label>
                <input
                  type="text"
                  name="middle_name"
                  value={formData.middle_name || ""}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                <input
                  type="text"
                  name="last_name"
                  value={formData.last_name || ""}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
                <select
                  name="gender"
                  value={formData.gender || ""}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Aadhaar Number</label>
                <input
                  type="text"
                  name="aadhaar_number"
                  value={formData.aadhaar_number || ""}
                  onChange={handleInputChange}
                  maxLength="12"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Mobile Number</label>
                <input
                  type="tel"
                  name="current_mobile_number"
                  value={formData.current_mobile_number || ""}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  name="user_email"
                  value={formData.user_email || ""}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Spouse Name</label>
                <input
                  type="text"
                  name="spouse_name"
                  value={formData.spouse_name || ""}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Residency Since</label>
                <input
                  type="text"
                  name="residency_since"
                  value={formData.residency_since || ""}
                  onChange={handleInputChange}
                  placeholder="YYYY"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>
            </div>

            <h3 className="text-xl font-bold mt-8 mb-4 text-gray-900">Address Information</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Current Address</label>
                <textarea
                  name="current_address"
                  value={formData.current_address || ""}
                  onChange={handleInputChange}
                  rows="3"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Aadhaar Address</label>
                <textarea
                  name="aadhaar_address"
                  value={formData.aadhaar_address || ""}
                  onChange={handleInputChange}
                  rows="3"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Current Pincode</label>
                <input
                  type="text"
                  name="current_pincode"
                  value={formData.current_pincode || ""}
                  onChange={handleInputChange}
                  maxLength="6"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Aadhaar Pincode</label>
                <input
                  type="text"
                  name="aadhaar_pincode"
                  value={formData.aadhaar_pincode || ""}
                  onChange={handleInputChange}
                  maxLength="6"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>
            </div>

            <h3 className="text-xl font-bold mt-8 mb-4 text-gray-900">Bank Details</h3>
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Bank Name</label>
                <input
                  type="text"
                  name="bank_name"
                  value={formData.bank_name || ""}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Account Number</label>
                <input
                  type="text"
                  name="account_number"
                  value={formData.account_number || ""}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">IFSC Code</label>
                <input
                  type="text"
                  name="ifsc_code"
                  value={formData.ifsc_code || ""}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === "location" && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-2xl font-bold mb-6 text-gray-900">Location & Property Details</h2>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Slum ID</label>
                <input
                  type="text"
                  name="slum_id"
                  value={formData.slum_id || ""}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Name of Slum Area</label>
                <input
                  type="text"
                  name="name_of_slum_area"
                  value={formData.name_of_slum_area || ""}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Ward</label>
                <input
                  type="text"
                  name="ward"
                  value={formData.ward || ""}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">District</label>
                <input
                  type="text"
                  name="district"
                  value={formData.district || ""}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Taluka</label>
                <input
                  type="text"
                  name="taluka"
                  value={formData.taluka || ""}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Village</label>
                <input
                  type="text"
                  name="village"
                  value={formData.village || ""}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Municipal Corporation</label>
                <input
                  type="text"
                  name="municipal_corporation"
                  value={formData.municipal_corporation || ""}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Cluster Number</label>
                <input
                  type="text"
                  name="cluster_number"
                  value={formData.cluster_number || ""}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Ownership of Slum Land</label>
                <select
                  name="ownership_of_slum_land"
                  value={formData.ownership_of_slum_land || ""}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                >
                  <option value="">Select Ownership</option>
                  <option value="State Government">State Government</option>
                  <option value="Central Government">Central Government</option>
                  <option value="Municipal Corporation">Municipal Corporation</option>
                  <option value="Private">Private</option>
                </select>
              </div>
            </div>

            <h3 className="text-xl font-bold mt-8 mb-4 text-gray-900">Property Measurements</h3>
            <div className="grid md:grid-cols-4 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Length (m)</label>
                <input
                  type="number"
                  step="0.1"
                  name="length"
                  value={formData.length || ""}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Width (m)</label>
                <input
                  type="number"
                  step="0.1"
                  name="width"
                  value={formData.width || ""}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Area (sq.m)</label>
                <input
                  type="number"
                  step="0.1"
                  name="area_sq_m"
                  value={formData.area_sq_m || ""}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Floor</label>
                <input
                  type="text"
                  name="slum_floor"
                  value={formData.slum_floor || ""}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mt-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Special Feature</label>
                <textarea
                  name="special_feature"
                  value={formData.special_feature || ""}
                  onChange={handleInputChange}
                  rows="3"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Observation</label>
                <textarea
                  name="observation"
                  value={formData.observation || ""}
                  onChange={handleInputChange}
                  rows="3"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === "family" && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-2xl font-bold mb-6 text-gray-900">Family Members</h2>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Number of Family Members</label>
              <input
                type="number"
                name="num_family_members"
                value={formData.num_family_members || ""}
                onChange={handleInputChange}
                min="1"
                max="10"
                className="w-32 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent mb-6"
              />
            </div>

            {[1, 2, 3, 4, 5, 6].map((memberNum) => (
              <div key={memberNum} className="border border-gray-200 rounded-lg p-4 mb-4">
                <h3 className="text-lg font-semibold mb-4 text-gray-800">Family Member {memberNum}</h3>
                <div className="grid md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                    <input
                      type="text"
                      name={`family_member${memberNum}_name`}
                      value={formData[`family_member${memberNum}_name`] || ""}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Age</label>
                    <input
                      type="number"
                      name={`family_member${memberNum}_age`}
                      value={formData[`family_member${memberNum}_age`] || ""}
                      onChange={handleInputChange}
                      min="0"
                      max="120"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Relation</label>
                    <input
                      type="text"
                      name={`family_member${memberNum}_relation`}
                      value={formData[`family_member${memberNum}_relation`] || ""}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
                    <select
                      name={`family_member${memberNum}_gender`}
                      value={formData[`family_member${memberNum}_gender`] || ""}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    >
                      <option value="">Select</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === "documents" && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-2xl font-bold mb-6 text-gray-900">Documents & Media</h2>

            <div className="grid md:grid-cols-2 gap-6">
              {Object.entries(fileFieldsMap).map(([fieldName, dbField]) => (
                <div key={fieldName} className="border border-gray-200 rounded-lg p-4">
                  <h3 className="font-semibold mb-3 capitalize">
                    {fieldName
                      .replace(/_/g, " ")
                      .replace(/([A-Z])/g, " $1")
                      .trim()}
                  </h3>

                  {formData[dbField] && (
                    <div className="mb-4">
                      <p className="text-sm text-gray-600 mb-2">Current Document:</p>
                      {isImageFile(formData[dbField]) ? (
                        <img
                          src={getDocumentUrl(formData[dbField]) || "/placeholder.svg"}
                          alt={fieldName}
                          className="w-full h-32 object-cover rounded border"
                          onError={(e) => {
                            e.target.src =
                              "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iI2Y3ZjdmNyIvPjx0ZXh0IHg9IjUwIiB5PSI1MCIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjEyIiBmaWxsPSIjOTk5IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+RG9jdW1lbnQ8L3RleHQ+PC9zdmc+"
                          }}
                        />
                      ) : (
                        <div className="w-full h-32 bg-gray-100 rounded border flex items-center justify-center">
                          <span className="text-4xl">📄</span>
                        </div>
                      )}
                      <p className="text-xs text-gray-500 mt-1 break-all">{extractDocumentPath(formData[dbField])}</p>
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {formData[dbField] ? "Replace Document:" : "Upload Document:"}
                    </label>
                    <input
                      type="file"
                      name={fieldName}
                      onChange={handleFileChange}
                      accept="image/*,video/*,.pdf,.doc,.docx"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                    {files[fieldName] && (
                      <p className="text-sm text-green-600 mt-1">✅ New file selected: {files[fieldName].name}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-600">Make sure all information is correct before submitting.</div>
            <button
              type="submit"
              disabled={saving}
              className={`px-8 py-3 rounded-lg font-medium ${
                saving ? "bg-gray-400 cursor-not-allowed" : "bg-orange-600 hover:bg-orange-700"
              } text-white flex items-center gap-2`}
            >
              {saving ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Updating...
                </>
              ) : (
                <>💾 Update Application</>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}

export default SRAEditForm

