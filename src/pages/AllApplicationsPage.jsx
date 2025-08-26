// "use client"
// import { useState, useEffect } from "react"

// const API_BASE_URL = "https://sra.saavi.co.in"
// const DOCUMENT_BASE_URL = "https://sra.saavi.co.in" 

// const isAuthenticated = () => {
//   if (typeof window === "undefined") return false
//   const token = localStorage.getItem("authToken")
//   return !!token
// }

// const getAuthToken = () => {
//   if (typeof window === "undefined") return null
//   return localStorage.getItem("authToken")
// }

// const AllApplicationsPage = () => {
//   const [searchTerm, setSearchTerm] = useState("")
//   const [applications, setApplications] = useState([])
//   const [loading, setLoading] = useState(true)
//   const [error, setError] = useState(null)
//   const [selectedApplication, setSelectedApplication] = useState(null)
//   const [showModal, setShowModal] = useState(false)
//   const [selectedDocument, setSelectedDocument] = useState(null)
//   const [showDocumentModal, setShowDocumentModal] = useState(false)

//   const extractDocumentPath = (fullPath) => {
//     if (!fullPath) return null
//     const uploadsIndex = fullPath.indexOf("/uploads")
//     if (uploadsIndex !== -1) {
//       return fullPath.substring(uploadsIndex)
//     }
//     return fullPath
//   }

//   // const getDocumentUrl = (documentPath) => {
//   //   if (!documentPath) return null
//   //   const cleanPath = extractDocumentPath(documentPath)
//   //   return cleanPath ? `${cleanPath}` : null
//   // }
//   const getDocumentUrl = (documentPath) => {
//   if (!documentPath) return null

//   // Convert array-like string to proper string without brackets and quotes
//   const cleanPath = documentPath
//     .replace(/^\[|]$/g, '')  // remove [ and ] from start/end
//     .replace(/"/g, '')       // remove all double quotes

//   return cleanPath || null
// }

// // Output: https://sratoday.s3.ap-south-1.amazonaws.com/sra_uploads/photo_self-1756194086119.jpg,https://sratoday.s3.ap-south-1.amazonaws.com/sra_uploads/photo_self-1756194086232.jpg


//   const getFileExtension = (filePath) => {
//     if (!filePath) return ""
//     return filePath.split(".").pop().toLowerCase()
//   }

//   const isImageFile = (filePath) => {
//     const imageExtensions = ["jpg", "jpeg", "png", "gif", "bmp", "webp"]
//     return imageExtensions.includes(getFileExtension(filePath))
//   }

//   const isVideoFile = (filePath) => {
//     const videoExtensions = ["mp4", "avi", "mov", "wmv", "flv", "webm"]
//     return videoExtensions.includes(getFileExtension(filePath))
//   }

//   const isPdfFile = (filePath) => {
//     return getFileExtension(filePath) === "pdf"
//   }

//   useEffect(() => {
//     const fetchApplications = async () => {
//       try {
//         setLoading(true)
//         setError(null)

//         const token = getAuthToken()
//         if (!token) {
//           throw new Error("No authentication token found")
//         }

//         const response = await fetch(`${API_BASE_URL}/api/sra-logs/all-logs`, {
//           method: "GET",
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "Content-Type": "application/json",
//           },
//         })

//         if (!response.ok) {
//           if (response.status === 401) {
//             throw new Error("Authentication failed. Please login again.")
//           }
//           throw new Error(`HTTP error! status: ${response.status}`)
//         }

//         const data = await response.json()
//         setApplications(data)
//       } catch (err) {
//         console.error("Error fetching applications:", err)
//         setError(err.message)
//       } finally {
//         setLoading(false)
//       }
//     }

//     fetchApplications()
//   }, [])

//   const filteredApplications = applications.filter((app) => {
//     const searchString = searchTerm.toLowerCase()
//     return (
//       (app.first_name && app.first_name.toLowerCase().includes(searchString)) ||
//       (app.last_name && app.last_name.toLowerCase().includes(searchString)) ||
//       (app.slum_id && app.slum_id.toLowerCase().includes(searchString)) ||
//       (app.name_of_slum_area && app.name_of_slum_area.toLowerCase().includes(searchString)) ||
//       (app.aadhaar_number && app.aadhaar_number.includes(searchString))
//     )
//   })

//   const getFamilyMembers = (app) => {
//     const members = []
//     for (let i = 1; i <= 6; i++) {
//       if (app[`family_member${i}_name`]) {
//         members.push({
//           name: app[`family_member${i}_name`],
//           age: app[`family_member${i}_age`],
//           relation: app[`family_member${i}_relation`],
//           gender: app[`family_member${i}_gender`],
//         })
//       }
//     }
//     return members
//   }

//   const getDocuments = (app) => {
//     const docs = []
//     const docFields = [
//       "photo_self_path",
//       "photo_family_path",
//       "biometric_path",
//       "front_photo_path",
//       "side_photo_path",
//       "inside_video_path",
//       "declaration_video_path",
//       "adivashihutimage",
//       "doc_before_2000",
//       "submitted_docs_before_2000",
//       "description_doc_before_2000",
//       "after_2000_proof_submitted",
//       "possession_doc_info",
//       "Seldeclaration_letter",
//       "Ration_card_info",
//       "Voter_card_info",
//       "Other_doc_info",
//     ]

//     docFields.forEach((field) => {
//       if (app[field]) {
//         const documentUrl = getDocumentUrl(app[field])
//         docs.push({
//           name: field
//             .replace(/_/g, " ")
//             .replace(/([A-Z])/g, " $1")
//             .trim(),
//           originalPath: app[field],
//           cleanPath: extractDocumentPath(app[field]),
//           url: documentUrl,
//           lat: app[`${field}_lat`],
//           long: app[`${field}_long`],
//           extension: getFileExtension(app[field]),
//           isImage: isImageFile(app[field]),
//           isVideo: isVideoFile(app[field]),
//           isPdf: isPdfFile(app[field]),
//         })
//       }
//     })
//     return docs
//   }

//   const formatFieldName = (fieldName) => {
//     return fieldName
//       .replace(/_/g, " ")
//       .replace(/([A-Z])/g, " $1")
//       .split(" ")
//       .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
//       .join(" ")
//       .trim()
//   }

//   const getStatusColor = (status) => {
//     if (!status) return "bg-gray-100 text-gray-800"
//     switch (status.toLowerCase()) {
//       case "ready for survey":
//         return "bg-green-100 text-green-800"
//       case "pending":
//         return "bg-yellow-100 text-yellow-800"
//       case "completed":
//         return "bg-blue-100 text-blue-800"
//       default:
//         return "bg-gray-100 text-gray-800"
//     }
//   }

//   const openModal = (app) => {
//     setSelectedApplication(app)
//     setShowModal(true)
//   }

//   const closeModal = () => {
//     setShowModal(false)
//     setSelectedApplication(null)
//   }

//   const openDocumentModal = (document) => {
//     setSelectedDocument(document)
//     setShowDocumentModal(true)
//   }

//   const closeDocumentModal = () => {
//     setShowDocumentModal(false)
//     setSelectedDocument(null)
//   }

//   // const DocumentPreview = ({ document }) => {
//   //   if (!document || !document.url) {
//   //     return <div className="text-center text-gray-500 p-8">Document not available</div>
//   //   }

//   //   if (document.isImage) {
//   //     return (
//   //       <div className="text-center">
//   //         <img
//   //           src={document.url || "/placeholder.svg"}
//   //           alt={document.name}
//   //           className="max-w-full max-h-[70vh] mx-auto rounded-lg shadow-lg"
//   //           onError={(e) => {
//   //             e.target.style.display = "none"
//   //             e.target.nextSibling.style.display = "block"
//   //           }}
//   //         />
//   //         <div style={{ display: "none" }} className="text-red-500 p-4">
//   //           Failed to load image: {document.url}
//   //         </div>
//   //       </div>
//   //     )
//   //   }

//   //   if (document.isVideo) {
//   //     return (
//   //       <div className="text-center">
//   //         <video
//   //           controls
//   //           className="max-w-full max-h-[70vh] mx-auto rounded-lg shadow-lg"
//   //           onError={(e) => {
//   //             e.target.style.display = "none"
//   //             e.target.nextSibling.style.display = "block"
//   //           }}
//   //         >
//   //           <source src={document.url} type={`video/${document.extension}`} />
//   //           Your browser does not support the video tag.
//   //         </video>
//   //         <div style={{ display: "none" }} className="text-red-500 p-4">
//   //           Failed to load video: {document.url}
//   //         </div>
//   //       </div>
//   //     )
//   //   }

//   //   if (document.isPdf) {
//   //     return (
//   //       <div className="text-center">
//   //         <iframe
//   //           src={document.url}
//   //           className="w-full h-[70vh] rounded-lg shadow-lg"
//   //           title={document.name}
//   //           onError={(e) => {
//   //             e.target.style.display = "none"
//   //             e.target.nextSibling.style.display = "block"
//   //           }}
//   //         />
//   //         <div style={{ display: "none" }} className="text-red-500 p-4">
//   //           Failed to load PDF: {document.url}
//   //         </div>
//   //         <div className="mt-4">
//   //           <a
//   //             href={document.url}
//   //             target="_blank"
//   //             rel="noopener noreferrer"
//   //             className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
//   //           >
//   //             Open PDF in New Tab
//   //           </a>
//   //         </div>
//   //       </div>
//   //     )
//   //   }

//   //   return (
//   //     <div className="text-center p-8">
//   //       <div className="text-6xl mb-4">📄</div>
//   //       <p className="text-gray-600 mb-4">File type: {document.extension.toUpperCase()}</p>
//   //       <a
//   //         href={document.url}
//   //         target="_blank"
//   //         rel="noopener noreferrer"
//   //         className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
//   //       >
//   //         Download File
//   //       </a>
//   //     </div>
//   //   )
//   // }
//   // Helper function to clean the URL string
// const cleanUrl = (url) => {
//   if (!url) return null
//   return url.replace(/^\[|]$/g, '').replace(/"/g, '')
// }

// const DocumentPreview = ({ document }) => {
//   if (!document || !document.url) {
//     return <div className="text-center text-gray-500 p-8">Document not available</div>
//   }

//   const url = cleanUrl(document.url) // clean the URL

//   if (document.isImage) {
//     return (
//       <div className="text-center">
//         <img
//           src={url || "/placeholder.svg"}
//           alt={document.name}
//           className="max-w-full max-h-[70vh] mx-auto rounded-lg shadow-lg"
//           onError={(e) => {
//             e.target.style.display = "none"
//             e.target.nextSibling.style.display = "block"
//           }}
//         />
//         <div style={{ display: "none" }} className="text-red-500 p-4">
//           Failed to load image: {url}
//         </div>
//       </div>
//     )
//   }

//   if (document.isVideo) {
//     return (
//       <div className="text-center">
//         <video
//           controls
//           className="max-w-full max-h-[70vh] mx-auto rounded-lg shadow-lg"
//           onError={(e) => {
//             e.target.style.display = "none"
//             e.target.nextSibling.style.display = "block"
//           }}
//         >
//           <source src={url} type={`video/${document.extension}`} />
//           Your browser does not support the video tag.
//         </video>
//         <div style={{ display: "none" }} className="text-red-500 p-4">
//           Failed to load video: {url}
//         </div>
//       </div>
//     )
//   }

//   if (document.isPdf) {
//     return (
//       <div className="text-center">
//         <iframe
//           src={url}
//           className="w-full h-[70vh] rounded-lg shadow-lg"
//           title={document.name}
//           onError={(e) => {
//             e.target.style.display = "none"
//             e.target.nextSibling.style.display = "block"
//           }}
//         />
//         <div style={{ display: "none" }} className="text-red-500 p-4">
//           Failed to load PDF: {url}
//         </div>
//         <div className="mt-4">
//           <a
//             href={url}
//             target="_blank"
//             rel="noopener noreferrer"
//             className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
//           >
//             Open PDF in New Tab
//           </a>
//         </div>
//       </div>
//     )
//   }

//   return (
//     <div className="text-center p-8">
//       <div className="text-6xl mb-4">📄</div>
//       <p className="text-gray-600 mb-4">File type: {document.extension.toUpperCase()}</p>
//       <a
//         href={url}
//         target="_blank"
//         rel="noopener noreferrer"
//         className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
//       >
//         Download File
//       </a>
//     </div>
//   )
// }


//   if (loading) {
//     return (
//       <div className="flex items-center justify-center min-h-screen">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
//           <p className="text-gray-600">Loading SRA applications...</p>
//         </div>
//       </div>
//     )
//   }

//   if (error) {
//     return (
//       <div className="flex items-center justify-center min-h-screen">
//         <div className="text-center">
//           <div className="text-red-600 text-6xl mb-4">⚠️</div>
//           <p className="text-red-600 mb-4 text-xl">Error loading applications</p>
//           <p className="text-gray-600 mb-4">{error}</p>
//           <button
//             onClick={() => window.location.reload()}
//             className="px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
//           >
//             Retry
//           </button>
//         </div>
//       </div>
//     )
//   }

//   return (
//     <div className="min-h-screen bg-gray-50 p-4">
//       <div className="mb-8">
//         <h1 className="text-4xl font-bold text-gray-900 mb-2">SRA APPLICATION DOCUMENTS VIEWER</h1>
//         <p className="text-gray-600 text-lg">
//           Complete view of SRA applications with document preview functionality ({applications.length} total records)
//         </p>
//       </div>

//       <div className="bg-white rounded-lg shadow-md p-6 mb-8">
//         <div className="relative">
//           <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//             <span className="text-gray-400">🔍</span>
//           </div>
//           <input
//             type="text"
//             placeholder="Search by name, slum ID, area, or Aadhaar number..."
//             className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-lg"
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//           />
//         </div>
//       </div>

//       <div className="space-y-8">
//         {filteredApplications.length === 0 ? (
//           <div className="text-center py-12">
//             <p className="text-gray-500 text-xl">No applications found matching your search criteria</p>
//           </div>
//         ) : (
//           filteredApplications.map((app) => (
//             <div key={app.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
//               <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white p-6">
//                 <div className="flex justify-between items-start">
//                   <div>
//                     <h2 className="text-3xl font-bold mb-2">
//                       {app.first_name} {app.middle_name} {app.last_name}
//                     </h2>
//                     <div className="space-y-1">
//                       <p className="text-orange-100 text-lg">
//                         <strong>Slum ID:</strong> {app.slum_id} | <strong>Area:</strong> {app.name_of_slum_area}
//                       </p>
//                       <p className="text-orange-100">
//                         <strong>Ward:</strong> {app.ward} | <strong>District:</strong> {app.district}
//                       </p>
//                     </div>
//                   </div>
//                   <div className="text-right">
//                     <button
//                       onClick={() => openModal(app)}
//                       className="bg-white text-orange-600 px-6 py-3 rounded-lg hover:bg-orange-50 flex items-center gap-2 mb-3"
//                     >
//                       👁️ View All Details
//                     </button>
//                     <span
//                       className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(app.survey_status)}`}
//                     >
//                       {app.survey_status}
//                     </span>
//                   </div>
//                 </div>
//               </div>

//               <div className="p-6">
//                 <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
//                   📄 Documents ({getDocuments(app).length} files)
//                 </h3>
//                 <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
//                   {getDocuments(app)
//                     .slice(0, 8)
//                     .map((doc, index) => (
//                       <div key={index} className="border rounded-lg p-3 hover:shadow-md transition-shadow">
//                         <div className="flex items-center justify-between mb-2">
//                           <h4 className="font-medium text-sm truncate">{doc.name}</h4>
//                           <span className="text-xs bg-gray-100 px-2 py-1 rounded">{doc.extension.toUpperCase()}</span>
//                         </div>

//                         <div className="mb-3">
//                           {doc.isImage && (
//                             <img
//                               src={doc.url || "/placeholder.svg"}
//                               alt={doc.name}
//                               className="w-full h-20 object-cover rounded cursor-pointer hover:opacity-80"
//                               onClick={() => openDocumentModal(doc)}
//                               onError={(e) => {
//                                 e.target.src =
//                                   "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iI2Y3ZjdmNyIvPjx0ZXh0IHg9IjUwIiB5PSI1MCIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjEyIiBmaWxsPSIjOTk5IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+SW1hZ2U8L3RleHQ+PC9zdmc+"
//                               }}
//                             />
//                           )}
//                           {doc.isVideo && (
//                             <div
//                               className="w-full h-20 bg-gray-200 rounded flex items-center justify-center cursor-pointer hover:bg-gray-300"
//                               onClick={() => openDocumentModal(doc)}
//                             >
//                               <span className="text-2xl">🎥</span>
//                             </div>
//                           )}
//                           {doc.isPdf && (
//                             <div
//                               className="w-full h-20 bg-red-100 rounded flex items-center justify-center cursor-pointer hover:bg-red-200"
//                               onClick={() => openDocumentModal(doc)}
//                             >
//                               <span className="text-2xl">📄</span>
//                             </div>
//                           )}
//                           {!doc.isImage && !doc.isVideo && !doc.isPdf && (
//                             <div
//                               className="w-full h-20 bg-gray-100 rounded flex items-center justify-center cursor-pointer hover:bg-gray-200"
//                               onClick={() => openDocumentModal(doc)}
//                             >
//                               <span className="text-2xl">📁</span>
//                             </div>
//                           )}
//                         </div>

//                         <button
//                           onClick={() => openDocumentModal(doc)}
//                           className="w-full bg-blue-600 text-white py-2 px-3 rounded text-sm hover:bg-blue-700"
//                         >
//                           View Document
//                         </button>

//                         {doc.lat && doc.long && (
//                           <p className="text-xs text-gray-500 mt-2">
//                             📍 {doc.lat}, {doc.long}
//                           </p>
//                         )}
//                       </div>
//                     ))}
//                 </div>

//                 {getDocuments(app).length > 8 && (
//                   <button
//                     onClick={() => openModal(app)}
//                     className="w-full bg-gray-100 text-gray-700 py-3 rounded-lg hover:bg-gray-200"
//                   >
//                     View All {getDocuments(app).length} Documents
//                   </button>
//                 )}
//               </div>

//               <div className="bg-gray-50 px-6 py-4">
//                 <div className="grid md:grid-cols-4 gap-4 text-sm">
//                   <div>
//                     <strong>Contact:</strong> {app.current_mobile_number}
//                   </div>
//                   <div>
//                     <strong>Area:</strong> {app.area_sq_m} sq.m
//                   </div>
//                   <div>
//                     <strong>Family:</strong> {app.num_family_members} members
//                   </div>
//                   <div>
//                     <strong>Created:</strong> {app.created_date}
//                   </div>
//                 </div>
//               </div>
//             </div>
//           ))
//         )}
//       </div>

//       {showDocumentModal && selectedDocument && (
//         <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
//           <div className="bg-white rounded-lg max-w-6xl w-full max-h-[95vh] overflow-y-auto">
//             <div className="sticky top-0 bg-white border-b p-4 flex justify-between items-center z-10">
//               <div>
//                 <h3 className="text-xl font-bold">{selectedDocument.name}</h3>
//                 <p className="text-sm text-gray-600">
//                   Type: {selectedDocument.extension.toUpperCase()} |
//                   {selectedDocument.lat && selectedDocument.long && (
//                     <span>
//                       {" "}
//                       GPS: {selectedDocument.lat}, {selectedDocument.long}
//                     </span>
//                   )}
//                 </p>
//               </div>
//               <button onClick={closeDocumentModal} className="text-gray-500 hover:text-gray-700 text-2xl font-bold">
//                 ×
//               </button>
//             </div>
//             <div className="p-4">
//               <DocumentPreview document={selectedDocument} />
//               <div className="mt-4 p-4 bg-gray-50 rounded-lg">
//                 <h4 className="font-semibold mb-2">File Information:</h4>
//                 <p className="text-sm text-gray-600 break-all">
//                   <strong>Original Path:</strong> {selectedDocument.originalPath}
//                 </p>
//                 <p className="text-sm text-gray-600 break-all">
//                   <strong>Clean Path:</strong> {selectedDocument.cleanPath}
//                 </p>
//                 <p className="text-sm text-gray-600 break-all">
//                   <strong>URL:</strong> {selectedDocument.url}
//                 </p>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       {showModal && selectedApplication && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-40">
//           <div className="bg-white rounded-lg max-w-7xl w-full max-h-[95vh] overflow-y-auto">
//             <div className="sticky top-0 bg-white border-b p-6 flex justify-between items-center z-10">
//               <h2 className="text-3xl font-bold">
//                 Complete Details - {selectedApplication.first_name} {selectedApplication.last_name}
//               </h2>
//               <button onClick={closeModal} className="text-gray-500 hover:text-gray-700 text-3xl font-bold">
//                 ×
//               </button>
//             </div>

//             <div className="p-6 space-y-8">
//               <div>
//                 <h3 className="text-2xl font-bold mb-4 bg-blue-100 text-blue-900 p-4 rounded-lg flex items-center gap-2">
//                   👨‍👩‍👧‍👦 Family Members Details
//                 </h3>
//                 <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
//                   {getFamilyMembers(selectedApplication).map((member, index) => (
//                     <div key={index} className="border-2 border-blue-200 rounded-lg p-4 bg-blue-50">
//                       <h4 className="font-bold text-blue-900 text-lg">{member.name}</h4>
//                       <div className="mt-2 space-y-1">
//                         <p className="text-sm">
//                           <strong>Relation:</strong> {member.relation}
//                         </p>
//                         <p className="text-sm">
//                           <strong>Gender:</strong> {member.gender}
//                         </p>
//                         <p className="text-sm">
//                           <strong>Age:</strong> {member.age} years
//                         </p>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </div>
              

//               <div>
//                 <h3 className="text-2xl font-bold mb-4 bg-green-100 text-green-900 p-4 rounded-lg flex items-center gap-2">
//                   📄 All Documents & Media Files ({getDocuments(selectedApplication).length} files)
//                 </h3>
//                 <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
//                   {getDocuments(selectedApplication).map((doc, index) => (
//                     <div key={index} className="border-2 border-green-200 rounded-lg p-4 bg-green-50">
//                       <h4 className="font-bold text-green-900 capitalize text-sm mb-2">{doc.name}</h4>

//                       <div className="mb-3">
//                         {doc.isImage && (
//                           <img
//                             src={doc.url || "/placeholder.svg"}
//                             alt={doc.name}
//                             className="w-full h-24 object-cover rounded cursor-pointer hover:opacity-80"
//                             onClick={() => openDocumentModal(doc)}
//                             onError={(e) => {
//                               e.target.src =
//                                 "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iI2Y3ZjdmNyIvPjx0ZXh0IHg9IjUwIiB5PSI1MCIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjEyIiBmaWxsPSIjOTk5IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+SW1hZ2U8L3RleHQ+PC9zdmc+"
//                             }}
//                           />
//                         )}
//                         {doc.isVideo && (
//                           <div
//                             className="w-full h-24 bg-gray-200 rounded flex items-center justify-center cursor-pointer hover:bg-gray-300"
//                             onClick={() => openDocumentModal(doc)}
//                           >
//                             <span className="text-3xl">🎥</span>
//                           </div>
//                         )}
//                         {doc.isPdf && (
//                           <div
//                             className="w-full h-24 bg-red-100 rounded flex items-center justify-center cursor-pointer hover:bg-red-200"
//                             onClick={() => openDocumentModal(doc)}
//                           >
//                             <span className="text-3xl">📄</span>
//                           </div>
//                         )}
//                       </div>

//                       <button
//                         onClick={() => openDocumentModal(doc)}
//                         className="w-full bg-green-600 text-white py-2 px-3 rounded text-sm hover:bg-green-700 mb-2"
//                       >
//                         View {doc.extension.toUpperCase()}
//                       </button>

//                       <div className="space-y-2">
//                         <p className="text-xs text-gray-600 break-all bg-white p-2 rounded">
//                           <strong>Clean Path:</strong> {doc.cleanPath}
//                         </p>
//                         {doc.lat && doc.long && (
//                           <p className="text-xs text-gray-600 bg-white p-2 rounded">
//                             <strong>GPS:</strong> {doc.lat}, {doc.long}
//                           </p>
//                         )}
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//               <div>
//                 <h3 className="text-2xl font-bold mb-6 text-center bg-gradient-to-r from-orange-500 to-red-500 text-white p-4 rounded-lg">
//                   📋 ALL APPLICATION FIELDS ({Object.keys(selectedApplication).length} Total Fields)
//                 </h3>

//                 <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
//                   {Object.entries(selectedApplication).map(([key, value], index) => (
//                     <div
//                       key={key}
//                       className="border-2 border-gray-200 rounded-lg p-4 hover:border-orange-300 transition-colors"
//                     >
//                       <div className="flex items-start justify-between mb-2">
//                         <h4 className="font-bold text-gray-900 text-sm">
//                           {index + 1}. {formatFieldName(key)}
//                         </h4>
//                         <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">{typeof value}</span>
//                       </div>
//                       <div className="bg-gray-50 rounded p-2">
//                         <p className="text-sm text-gray-700 break-all">
//                           {value !== null && value !== undefined ? value.toString() : "N/A"}
//                         </p>
//                       </div>
//                       <p className="text-xs text-gray-400 mt-1">Field: {key}</p>
//                     </div>
//                   ))}
//                 </div>
//               </div>

             
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   )
// }

// export default AllApplicationsPage


"use client";
import React, { useState, useEffect } from "react";

    const API_BASE_URL = "https://sra.saavi.co.in";

    const isAuthenticated = () => {
      if (typeof window === "undefined") return false;
      const token = localStorage.getItem("authToken");
      return !!token;
    };

    const getAuthToken = () => {
      if (typeof window === "undefined") return null;
      return localStorage.getItem("authToken");
    };

    const AllApplicationsPage = () => {
      const [searchTerm, setSearchTerm] = useState("");
      const [applications, setApplications] = useState([]);
      const [loading, setLoading] = useState(true);
      const [error, setError] = useState(null);
      const [selectedApplication, setSelectedApplication] = useState(null);
      const [showModal, setShowModal] = useState(false);
      const [selectedDocument, setSelectedDocument] = useState(null);
      const [showDocumentModal, setShowDocumentModal] = useState(false);

      const extractDocumentPath = (fullPath) => {
        if (!fullPath) return [];
        if (typeof fullPath === "string") {
          try {
            return fullPath
              .replace(/^\[|]$/g, "")
              .replace(/"/g, "")
              .split(",")
              .map((url) => url.trim())
              .filter((url) => url);
          } catch (e) {
            console.error("Error extracting document path:", e);
            return [];
          }
        }
        return Array.isArray(fullPath) ? fullPath : [];
      };

      const getDocumentUrl = (documentPath) => {
        if (!documentPath) return [];
        let paths = documentPath;
        if (typeof documentPath === "string") {
          try {
            paths = documentPath
              .replace(/^\[|]$/g, "")
              .replace(/"/g, "")
              .split(",")
              .map((url) => url.trim())
              .filter((url) => url);
          } catch (e) {
            console.error("Error parsing documentPath:", e);
            return [];
          }
        }
        return paths.length > 0 ? paths : [];
      };

      const getFileExtension = (filePath) => {
        if (!filePath) return "";
        return filePath.split(".").pop().toLowerCase();
      };

      const isImageFile = (filePath) => {
        const imageExtensions = ["jpg", "jpeg", "png", "gif", "bmp", "webp"];
        return imageExtensions.includes(getFileExtension(filePath));
      };

      const isVideoFile = (filePath) => {
        const videoExtensions = ["mp4", "avi", "mov", "wmv", "flv", "webm"];
        return videoExtensions.includes(getFileExtension(filePath));
      };

      const isPdfFile = (filePath) => {
        return getFileExtension(filePath) === "pdf";
      };

      useEffect(() => {
        const fetchApplications = async () => {
          try {
            setLoading(true);
            setError(null);

            const token = getAuthToken();
            if (!token) {
              throw new Error("No authentication token found");
            }

            const response = await fetch(`${API_BASE_URL}/api/sra-logs/all-logs`, {
              method: "GET",
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
            });

            if (!response.ok) {
              if (response.status === 401) {
                throw new Error("Authentication failed. Please login again.");
              }
              throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            setApplications(data);
          } catch (err) {
            console.error("Error fetching applications:", err);
            setError(err.message);
          } finally {
            setLoading(false);
          }
        };

        fetchApplications();
      }, []);

      const filteredApplications = applications.filter((app) => {
        const searchString = searchTerm.toLowerCase();
        return (
          (app.first_name && app.first_name.toLowerCase().includes(searchString)) ||
          (app.last_name && app.last_name.toLowerCase().includes(searchString)) ||
          (app.slum_id && app.slum_id.toLowerCase().includes(searchString)) ||
          (app.name_of_slum_area && app.name_of_slum_area.toLowerCase().includes(searchString)) ||
          (app.aadhaar_number && app.aadhaar_number.includes(searchString))
        );
      });

      const getFamilyMembers = (app) => {
        const members = [];
        for (let i = 1; i <= 6; i++) {
          if (app[`family_member${i}_name`]) {
            members.push({
              name: app[`family_member${i}_name`],
              age: app[`family_member${i}_age`],
              relation: app[`family_member${i}_relation`],
              gender: app[`family_member${i}_gender`],
            });
          }
        }
        return members;
      };

      const getDocuments = (app) => {
        const docs = [];
        const docFields = [
          "photo_self_path",
          "photo_family_path",
          "biometric_path",
          "front_photo_path",
          "side_photo_path",
          "inside_video_path",
          "declaration_video_path",
          "adivashihutimage",
          "doc_before_2000",
          "submitted_docs_before_2000",
          "description_doc_before_2000",
          "after_2000_proof_submitted",
          "possession_doc_info",
          "Seldeclaration_letter",
          "Ration_card_info",
          "Voter_card_info",
          "Other_doc_info",
        ];

        docFields.forEach((field) => {
          if (app[field]) {
            const documentUrls = getDocumentUrl(app[field]);
            documentUrls.forEach((url, index) => {
              docs.push({
                name: `${field
                  .replace(/_/g, " ")
                  .replace(/([A-Z])/g, " $1")
                  .trim()}${documentUrls.length > 1 ? ` (${index + 1})` : ""}`,
                originalPath: app[field],
                cleanPath: url,
                url: url,
                lat: app[`${field}_lat`],
                long: app[`${field}_long`],
                extension: getFileExtension(url),
                isImage: isImageFile(url),
                isVideo: isVideoFile(url),
                isPdf: isPdfFile(url),
              });
            });
          }
        });
        return docs;
      };

      const formatFieldName = (fieldName) => {
        return fieldName
          .replace(/_/g, " ")
          .replace(/([A-Z])/g, " $1")
          .split(" ")
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" ")
          .trim();
      };

      const getStatusColor = (status) => {
        if (!status) return "bg-gray-100 text-gray-800";
        switch (status.toLowerCase()) {
          case "ready for survey":
            return "bg-green-100 text-green-800";
          case "pending":
            return "bg-yellow-100 text-yellow-800";
          case "completed":
            return "bg-blue-100 text-blue-800";
          default:
            return "bg-gray-100 text-gray-800";
        }
      };

      const openModal = (app) => {
        setSelectedApplication(app);
        setShowModal(true);
      };

      const closeModal = () => {
        setShowModal(false);
        setSelectedApplication(null);
      };

      const openDocumentModal = (document) => {
        setSelectedDocument(document);
        setShowDocumentModal(true);
      };

      const closeDocumentModal = () => {
        setShowDocumentModal(false);
        setSelectedDocument(null);
      };

      const DocumentPreview = ({ document }) => {
        if (!document || !document.url) {
          return <div className="text-center text-gray-500 p-8">Document not available</div>;
        }

        const url = document.url;

        if (document.isImage) {
          return (
            <div className="text-center">
              <img
                src={url || "/placeholder.svg"}
                alt={document.name}
                className="max-w-full max-h-[70vh] mx-auto rounded-lg shadow-lg"
                onError={(e) => {
                  e.target.style.display = "none";
                  e.target.nextSibling.style.display = "block";
                }}
              />
              <div style={{ display: "none" }} className="text-red-500 p-4">
                Failed to load image: {url}
              </div>
            </div>
          );
        }

        if (document.isVideo) {
          return (
            <div className="text-center">
              <video
                controls
                autoPlay
                className="max-w-full max-h-[70vh] mx-auto rounded-lg shadow-lg"
                onError={(e) => {
                  e.target.style.display = "none";
                  e.target.nextSibling.style.display = "block";
                }}
              >
                <source src={url} type={`video/${document.extension}`} />
                Your browser does not support the video tag.
              </video>
              <div style={{ display: "none" }} className="text-red-500 p-4">
                Failed to load video: {url}
              </div>
            </div>
          );
        }

        if (document.isPdf) {
          return (
            <div className="text-center">
              <iframe
                src={url}
                className="w-full h-[70vh] rounded-lg shadow-lg"
                title={document.name}
                onError={(e) => {
                  e.target.style.display = "none";
                  e.target.nextSibling.style.display = "block";
                }}
              />
              <div style={{ display: "none" }} className="text-red-500 p-4">
                Failed to load PDF: {url}
              </div>
              <div className="mt-4">
                <a
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                  Open PDF in New Tab
                </a>
              </div>
            </div>
          );
        }

        return (
          <div className="text-center p-8">
            <div className="text-6xl mb-4">📄</div>
            <p className="text-gray-600 mb-4">File type: {document.extension.toUpperCase()}</p>
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
            >
              Download File
            </a>
          </div>
        );
      };

      const DocumentGallery = ({ documents }) => {
        const images = documents.filter((doc) => doc.isImage);
        const nonImages = documents.filter((doc) => !doc.isImage);

        return (
          <div className="space-y-4">
            {images.length > 0 && (
              <div className="overflow-x-auto flex space-x-4 p-4">
                {images.map((doc, index) => (
                  <div key={index} className="flex-shrink-0 w-64">
                    <img
                      src={doc.url || "/placeholder.svg"}
                      alt={doc.name}
                      className="w-full h-40 object-cover rounded cursor-pointer hover:opacity-80"
                      onClick={() => openDocumentModal(doc)}
                      onError={(e) => {
                        e.target.src =
                          "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iI2Y3ZjdmNyIvPjx0ZXh0IHg9IjUwIiB5PSI1MCIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjEyIiBmaWxsPSIjOTk5IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+SW1hZ2U8L3RleHQ+PC9zdmc+";
                      }}
                    />
                    <p className="text-sm text-gray-600 mt-2 truncate">{doc.name}</p>
                  </div>
                ))}
              </div>
            )}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {nonImages.map((doc, index) => (
                <div key={index} className="border rounded-lg p-3 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-sm truncate">{doc.name}</h4>
                    <span className="text-xs bg-gray-100 px-2 py-1 rounded">{doc.extension.toUpperCase()}</span>
                  </div>
                  <div className="mb-3">
                    {doc.isVideo && (
                      <div
                        className="w-full h-20 bg-gray-200 rounded flex items-center justify-center cursor-pointer hover:bg-gray-300"
                        onClick={() => openDocumentModal(doc)}
                      >
                        <span className="text-2xl">🎥</span>
                      </div>
                    )}
                    {doc.isPdf && (
                      <div
                        className="w-full h-20 bg-red-100 rounded flex items-center justify-center cursor-pointer hover:bg-red-200"
                        onClick={() => openDocumentModal(doc)}
                      >
                        <span className="text-2xl">📄</span>
                      </div>
                    )}
                    {!doc.isVideo && !doc.isPdf && (
                      <div
                        className="w-full h-20 bg-gray-100 rounded flex items-center justify-center cursor-pointer hover:bg-gray-200"
                        onClick={() => openDocumentModal(doc)}
                      >
                        <span className="text-2xl">📁</span>
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => openDocumentModal(doc)}
                    className="w-full bg-blue-600 text-white py-2 px-3 rounded text-sm hover:bg-blue-700"
                  >
                    View Document
                  </button>
                  {doc.lat && doc.long && (
                    <p className="text-xs text-gray-500 mt-2">
                      📍 {doc.lat}, {doc.long}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        );
      };

      if (loading) {
        return (
          <div className="flex items-center justify-center min-h-screen">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading SRA applications...</p>
            </div>
          </div>
        );
      }

      if (error) {
        return (
          <div className="flex items-center justify-center min-h-screen">
            <div className="text-center">
              <div className="text-red-600 text-6xl mb-4">⚠️</div>
              <p className="text-red-600 mb-4 text-xl">Error loading applications</p>
              <p className="text-gray-600 mb-4">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
              >
                Retry
              </button>
            </div>
          </div>
        );
      }

      return (
        <div className="min-h-screen bg-gray-50 p-4">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">SRA APPLICATION DOCUMENTS VIEWER</h1>
            <p className="text-gray-600 text-lg">
              Complete view of SRA applications with document preview functionality ({applications.length} total records)
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-400">🔍</span>
              </div>
              <input
                type="text"
                placeholder="Search by name, slum ID, area, or Aadhaar number..."
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-lg"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-8">
            {filteredApplications.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 text-xl">No applications found matching your search criteria</p>
              </div>
            ) : (
              filteredApplications.map((app) => (
                <div key={app.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
                  <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white p-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <h2 className="text-3xl font-bold mb-2">
                          {app.first_name} {app.middle_name} {app.last_name}
                        </h2>
                        <div className="space-y-1">
                          <p className="text-orange-100 text-lg">
                            <strong>Slum ID:</strong> {app.slum_id} | <strong>Area:</strong> {app.name_of_slum_area}
                          </p>
                          <p className="text-orange-100">
                            <strong>Ward:</strong> {app.ward} | <strong>District:</strong> {app.district}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <button
                          onClick={() => openModal(app)}
                          className="bg-white text-orange-600 px-6 py-3 rounded-lg hover:bg-orange-50 flex items-center gap-2 mb-3"
                        >
                          👁️ View All Details
                        </button>
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(app.survey_status)}`}
                        >
                          {app.survey_status}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                      📄 Documents ({getDocuments(app).length} files)
                    </h3>
                    <DocumentGallery documents={getDocuments(app)} />
                  </div>

                  <div className="bg-gray-50 px-6 py-4">
                    <div className="grid md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <strong>Contact:</strong> {app.current_mobile_number}
                      </div>
                      <div>
                        <strong>Area:</strong> {app.area_sq_m} sq.m
                      </div>
                      <div>
                        <strong>Family:</strong> {app.num_family_members} members
                      </div>
                      <div>
                        <strong>Created:</strong> {app.created_date}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {showDocumentModal && selectedDocument && (
            <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
              <div className="bg-white rounded-lg max-w-6xl w-full max-h-[95vh] overflow-y-auto">
                <div className="sticky top-0 bg-white border-b p-4 flex justify-between items-center z-10">
                  <div>
                    <h3 className="text-xl font-bold">{selectedDocument.name}</h3>
                    <p className="text-sm text-gray-600">
                      Type: {selectedDocument.extension.toUpperCase()} |
                      {selectedDocument.lat && selectedDocument.long && (
                        <span>
                          {" "}
                          GPS: {selectedDocument.lat}, {selectedDocument.long}
                        </span>
                      )}
                    </p>
                  </div>
                  <button onClick={closeDocumentModal} className="text-gray-500 hover:text-gray-700 text-2xl font-bold">
                    ×
                  </button>
                </div>
                <div className="p-4">
                  <DocumentPreview document={selectedDocument} />
                  <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-semibold mb-2">File Information:</h4>
                    <p className="text-sm text-gray-600 break-all">
                      <strong>Original Path:</strong> {selectedDocument.originalPath}
                    </p>
                    <p className="text-sm text-gray-600 break-all">
                      <strong>Clean Path:</strong> {selectedDocument.cleanPath}
                    </p>
                    <p className="text-sm text-gray-600 break-all">
                      <strong>URL:</strong> {selectedDocument.url}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {showModal && selectedApplication && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-40">
              <div className="bg-white rounded-lg max-w-7xl w-full max-h-[95vh] overflow-y-auto">
                <div className="sticky top-0 bg-white border-b p-6 flex justify-between items-center z-10">
                  <h2 className="text-3xl font-bold">
                    Complete Details - {selectedApplication.first_name} {selectedApplication.last_name}
                  </h2>
                  <button onClick={closeModal} className="text-gray-500 hover:text-gray-700 text-3xl font-bold">
                    ×
                  </button>
                </div>

                <div className="p-6 space-y-8">
                  <div>
                    <h3 className="text-2xl font-bold mb-4 bg-blue-100 text-blue-900 p-4 rounded-lg flex items-center gap-2">
                      👨‍👩‍👧‍👦 Family Members Details
                    </h3>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {getFamilyMembers(selectedApplication).map((member, index) => (
                        <div key={index} className="border-2 border-blue-200 rounded-lg p-4 bg-blue-50">
                          <h4 className="font-bold text-blue-900 text-lg">{member.name}</h4>
                          <div className="mt-2 space-y-1">
                            <p className="text-sm">
                              <strong>Relation:</strong> {member.relation}
                            </p>
                            <p className="text-sm">
                              <strong>Gender:</strong> {member.gender}
                            </p>
                            <p className="text-sm">
                              <strong>Age:</strong> {member.age} years
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-2xl font-bold mb-4 bg-green-100 text-green-900 p-4 rounded-lg flex items-center gap-2">
                      📄 All Documents & Media Files ({getDocuments(selectedApplication).length} files)
                    </h3>
                    <DocumentGallery documents={getDocuments(selectedApplication)} />
                  </div>

                  <div>
                    <h3 className="text-2xl font-bold mb-6 text-center bg-gradient-to-r from-orange-500 to-red-500 text-white p-4 rounded-lg">
                      📋 ALL APPLICATION FIELDS ({Object.keys(selectedApplication).length} Total Fields)
                    </h3>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {Object.entries(selectedApplication).map(([key, value], index) => (
                        <div
                          key={key}
                          className="border-2 border-gray-200 rounded-lg p-4 hover:border-orange-300 transition-colors"
                        >
                          <div className="flex items-start justify-between mb-2">
                            <h4 className="font-bold text-gray-900 text-sm">
                              {index + 1}. {formatFieldName(key)}
                            </h4>
                            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">{typeof value}</span>
                          </div>
                          <div className="bg-gray-50 rounded p-2">
                            <p className="text-sm text-gray-700 break-all">
                              {value !== null && value !== undefined ? value.toString() : "N/A"}
                            </p>
                          </div>
                          <p className="text-xs text-gray-400 mt-1">Field: {key}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      );
    };

export default AllApplicationsPage



