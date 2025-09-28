/* eslint-disable @typescript-eslint/no-explicit-any */
// "use client"

// import { useState, useRef, useEffect } from "react"
// import { Button } from "@/components/ui/button"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Badge } from "@/components/ui/badge"
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import { QrCode, Camera, CameraOff, Download, Mail, UserPlus, GraduationCap, RefreshCw, Scan, Search } from "lucide-react"

// interface Graduate {
//   id: number
//   registrationNumber: string
//   identificationNumber: string
//   fullName: string
//   college: string
//   degree: string
//   graduationDate: string
//   email: string
//   invitations: Invitation[]
// }

// interface Invitation {
//   id: number
//   guestName: string
//   guestId: string
//   guestPhone: string
//   generatedAt: string
// }

// // Mock data for demonstration
// const mockGraduates = [
//   {
//     id: 1,
//     registrationNumber: "REG123456",
//     identificationNumber: "ID789012",
//     fullName: "John Doe",
//     college: "College of Engineering",
//     degree: "Bachelor of Science in Computer Science",
//     graduationDate: "2023-05-15",
//     email: "john.doe@example.com",
//     invitations: [
//       {
//         id: 1,
//         guestName: "Jane Doe",
//         guestId: "ID345678",
//         guestPhone: "+1234567890",
//         generatedAt: "2023-04-20T10:30:00Z"
//       }
//     ]
//   },
//   {
//     id: 2,
//     registrationNumber: "REG654321",
//     identificationNumber: "ID098765",
//     fullName: "Sarah Wilson",
//     college: "College of Business",
//     degree: "Bachelor of Business Administration",
//     graduationDate: "2023-05-15",
//     email: "sarah.wilson@example.com",
//     invitations: []
//   }
// ]

// export default function QRCodeGraduationScanner() {
//   const [activeTab, setActiveTab] = useState("scanner")
//   const [isScanning, setIsScanning] = useState(false)
//   const [hasCamera, setHasCamera] = useState(false)
//   const [cameraError, setCameraError] = useState("")
//   const [scannedData, setScannedData] = useState("")
//   const [graduate, setGraduate] = useState<Graduate | null>(null)
//   const [error, setError] = useState("")
//   const [isLoading, setIsLoading] = useState(false)
//   const [guestInfo, setGuestInfo] = useState({
//     fullName: "",
//     idNumber: "",
//     phoneNumber: ""
//   })
//   const [email, setEmail] = useState("")
//   const [isSubmitted, setIsSubmitted] = useState(false)
  
//   const videoRef = useRef<HTMLVideoElement>(null)
//   const streamRef = useRef<MediaStream | null>(null)

//   // Check for camera availability
//   useEffect(() => {
//     const checkCamera = async () => {
//       try {
//         const devices = await navigator.mediaDevices.enumerateDevices()
//         const videoDevices = devices.filter(device => device.kind === 'videoinput')
//         setHasCamera(videoDevices.length > 0)
//       } catch (err) {
//         console.error("Error checking camera:", err)
//         setHasCamera(false)
//       }
//     }
    
//     checkCamera()
//   }, [])

//   // Start camera for scanning
//   const startCamera = async () => {
//     try {
//       setCameraError("")
//       const stream = await navigator.mediaDevices.getUserMedia({ 
//         video: { 
//           facingMode: "environment", // Prefer rear camera on mobile
//           width: { ideal: 1280 },
//           height: { ideal: 720 }
//         } 
//       })
      
//       if (videoRef.current) {
//         videoRef.current.srcObject = stream
//         streamRef.current = stream
//       }
      
//       setIsScanning(true)
//       setCameraError("")
//     } catch (err) {
//       console.error("Error accessing camera:", err)
//       setCameraError("Unable to access camera. Please check permissions and try again.")
//       setIsScanning(false)
//     }
//   }

//   // Stop camera
//   const stopCamera = () => {
//     if (streamRef.current) {
//       streamRef.current.getTracks().forEach(track => track.stop())
//       streamRef.current = null
//     }
//     setIsScanning(false)
//   }

//   // Simulate QR code scanning
//   const simulateQRScan = () => {
//     setIsLoading(true)
    
//     // Simulate scanning delay
//     setTimeout(() => {
//       // Mock QR code data - in real app this would come from actual QR scanning
//       const mockQRData = "REG123456:ID789012"
//       setScannedData(mockQRData)
      
//       // Parse the scanned data and verify graduate
//       const [regNumber, idNumber] = mockQRData.split(":")
//       verifyFromQR(regNumber, idNumber)
//     }, 1500)
//   }

//   // Verify graduate from QR data
//   const verifyFromQR = (registrationNumber: string, identificationNumber: string) => {
//     const foundGraduate = mockGraduates.find(g => 
//       g.registrationNumber === registrationNumber && 
//       g.identificationNumber === identificationNumber
//     )
    
//     if (foundGraduate) {
//       setGraduate(foundGraduate)
//       setEmail(foundGraduate.email)
//       setError("")
//       stopCamera() // Stop camera when graduate is found
//     } else {
//       setError("No graduate found with the provided QR code data.")
//       setGraduate(null)
//     }
//     setIsLoading(false)
//   }

//   // Manual verification fallback
//   const verifyManually = (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault()
//     setIsLoading(true)
    
//     // Simulate API call
//     setTimeout(() => {
//       const foundGraduate = mockGraduates.find(g => 
//         g.registrationNumber === scannedData.split(":")[0] && 
//         g.identificationNumber === scannedData.split(":")[1]
//       )
      
//       if (foundGraduate) {
//         setGraduate(foundGraduate)
//         setEmail(foundGraduate.email)
//         setError("")
//       } else {
//         setError("No graduate found with the provided credentials.")
//         setGraduate(null)
//       }
//       setIsLoading(false)
//     }, 1000)
//   }

//   // Handle guest information submission
//   const addGuest = (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault()
    
//     // In a real application, this would make an API call
//     const newInvitation = {
//       id: graduate?.invitations?.length ? graduate.invitations.length + 1 : 1,
//       guestName: guestInfo.fullName,
//       guestId: guestInfo.idNumber,
//       guestPhone: guestInfo.phoneNumber,
//       generatedAt: new Date().toISOString()
//     }
    
//     setIsSubmitted(true)
    
//     // Simulate sending email
//     console.log(`Invitation sent to ${email}`)
//   }

//   // Reset form
//   const resetForm = () => {
//     setScannedData("")
//     setGraduate(null)
//     setError("")
//     setGuestInfo({ fullName: "", idNumber: "", phoneNumber: "" })
//     setEmail("")
//     setIsSubmitted(false)
//     setIsScanning(false)
//     stopCamera()
//   }

//   // Clean up camera on unmount
//   useEffect(() => {
//     return () => {
//       stopCamera()
//     }
//   }, [])

//   return (
//     <div className="min-h-screen bg-gradient-to-b from-blue-50 to-indigo-100 py-6 px-4 sm:px-6 lg:px-8">
//       <div className="max-w-md mx-auto">
//         <div className="text-center mb-6">
//           <div className="flex justify-center items-center mb-3">
//             <GraduationCap className="h-10 w-10 text-blue-600" />
//           </div>
//           <h1 className="text-2xl font-bold text-gray-900 mb-2">Graduation QR Scanner</h1>
//           <p className="text-gray-600 text-sm">
//             Scan your graduation QR code to generate invitations
//           </p>
//         </div>

//         <Card className="w-full">
//           <CardHeader className="pb-4">
//             <CardTitle className="text-lg">QR Code Verification</CardTitle>
//             <CardDescription className="text-sm">
//               Scan your graduation QR code or enter details manually
//             </CardDescription>
//           </CardHeader>
//           <CardContent className="space-y-4">
//             {!graduate ? (
//               <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
//                 <TabsList className="grid grid-cols-2 mb-4">
//                   <TabsTrigger value="scanner" className="text-sm">QR Scanner</TabsTrigger>
//                   <TabsTrigger value="manual" className="text-sm">Manual Entry</TabsTrigger>
//                 </TabsList>

//                 <TabsContent value="scanner" className="space-y-4">
//                   {/* QR Scanner Section */}
//                   <div className="space-y-3">
//                     <div className="aspect-square bg-black rounded-lg overflow-hidden relative border-2 border-blue-300">
//                       {isScanning ? (
//                         <video
//                           ref={videoRef}
//                           autoPlay
//                           playsInline
//                           muted
//                           className="w-full h-full object-cover"
//                         />
//                       ) : (
//                         <div className="w-full h-full flex flex-col items-center justify-center bg-gray-800 text-white">
//                           <QrCode className="h-16 w-16 mb-2 opacity-50" />
//                           <p className="text-sm text-center px-4">
//                             {hasCamera ? "Camera ready for scanning" : "Camera not available"}
//                           </p>
//                         </div>
//                       )}
                      
//                       {/* Scanning overlay */}
//                       {isScanning && (
//                         <div className="absolute inset-0 flex items-center justify-center">
//                           <div className="w-48 h-48 border-2 border-green-400 rounded-lg relative">
//                             <div className="absolute -top-1 -left-1 w-4 h-4 border-t-2 border-l-2 border-green-400"></div>
//                             <div className="absolute -top-1 -right-1 w-4 h-4 border-t-2 border-r-2 border-green-400"></div>
//                             <div className="absolute -bottom-1 -left-1 w-4 h-4 border-b-2 border-l-2 border-green-400"></div>
//                             <div className="absolute -bottom-1 -right-1 w-4 h-4 border-b-2 border-r-2 border-green-400"></div>
//                           </div>
//                         </div>
//                       )}
//                     </div>

//                     {cameraError && (
//                       <div className="p-2 bg-red-50 text-red-700 rounded-md text-xs">
//                         {cameraError}
//                       </div>
//                     )}

//                     <div className="flex flex-col gap-2">
//                       {!isScanning ? (
//                         <Button 
//                           onClick={startCamera}
//                           disabled={!hasCamera}
//                           className="w-full"
//                         >
//                           <Camera className="mr-2 h-4 w-4" />
//                           Start Camera
//                         </Button>
//                       ) : (
//                         <Button 
//                           onClick={stopCamera}
//                           variant="outline"
//                           className="w-full"
//                         >
//                           <CameraOff className="mr-2 h-4 w-4" />
//                           Stop Camera
//                         </Button>
//                       )}
                      
//                       <Button 
//                         onClick={simulateQRScan}
//                         disabled={!isScanning || isLoading}
//                         variant="secondary"
//                         className="w-full"
//                       >
//                         {isLoading ? (
//                           <>
//                             <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
//                             Scanning...
//                           </>
//                         ) : (
//                           <>
//                             <Scan className="mr-2 h-4 w-4" />
//                             Simulate Scan
//                           </>
//                         )}
//                       </Button>
//                     </div>
//                   </div>

//                   {scannedData && (
//                     <div className="p-3 bg-blue-50 rounded-md">
//                       <p className="text-xs text-blue-700 font-medium">Scanned Data:</p>
//                       <p className="text-blue-800 text-sm break-all">{scannedData}</p>
//                     </div>
//                   )}
//                 </TabsContent>

//                 <TabsContent value="manual">
//                   <form onSubmit={verifyManually} className="space-y-3">
//                     <div className="space-y-2">
//                       <Label htmlFor="scannedData" className="text-sm">QR Code Data</Label>
//                       <Input
//                         id="scannedData"
//                         placeholder="Paste QR code data here (format: REG123:ID456)"
//                         value={scannedData}
//                         onChange={(e) => setScannedData(e.target.value)}
//                         className="text-sm"
//                         required
//                       />
//                     </div>

//                     {error && (
//                       <div className="p-2 bg-red-50 text-red-700 rounded-md text-xs">
//                         {error}
//                       </div>
//                     )}

//                     <Button 
//                       type="submit" 
//                       className="w-full"
//                       disabled={isLoading || !scannedData}
//                     >
//                       {isLoading ? (
//                         <>
//                           <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
//                           Verifying...
//                         </>
//                       ) : (
//                         <>
//                           <Search className="mr-2 h-4 w-4" />
//                           Verify Data
//                         </>
//                       )}
//                     </Button>
//                   </form>
//                 </TabsContent>
//               </Tabs>
//             ) : (
//               <div className="space-y-4">
//                 {/* Graduate Information */}
//                 <div className="p-3 bg-green-50 rounded-md border border-green-200">
//                   <div className="flex items-center justify-between mb-2">
//                     <h3 className="font-medium text-green-800 text-sm">Verified Graduate</h3>
//                     <Badge variant="secondary" className="bg-green-100 text-green-800">
//                       Verified
//                     </Badge>
//                   </div>
//                   <div className="space-y-2">
//                     <div className="flex justify-between">
//                       <span className="text-xs text-gray-600">Name:</span>
//                       <span className="font-medium text-sm">{graduate.fullName}</span>
//                     </div>
//                     <div className="flex justify-between">
//                       <span className="text-xs text-gray-600">Registration:</span>
//                       <span className="font-medium text-sm">{graduate.registrationNumber}</span>
//                     </div>
//                     <div className="flex justify-between">
//                       <span className="text-xs text-gray-600">College:</span>
//                       <span className="font-medium text-sm">{graduate.college}</span>
//                     </div>
//                     <div className="flex justify-between">
//                       <span className="text-xs text-gray-600">Degree:</span>
//                       <span className="font-medium text-sm text-right">{graduate.degree}</span>
//                     </div>
//                   </div>
//                 </div>

//                 {/* Existing Invitations */}
//                 {graduate.invitations.length > 0 && (
//                   <div>
//                     <h3 className="font-medium text-sm mb-2">Existing Invitations</h3>
//                     <div className="space-y-2">
//                       {graduate.invitations.map((invitation) => (
//                         <div key={invitation.id} className="p-2 border rounded-md text-sm">
//                           <p className="font-medium">{invitation.guestName}</p>
//                           <p className="text-gray-600 text-xs">ID: {invitation.guestId}</p>
//                           <p className="text-gray-600 text-xs">
//                             Generated: {new Date(invitation.generatedAt).toLocaleDateString()}
//                           </p>
//                         </div>
//                       ))}
//                     </div>
//                   </div>
//                 )}

//                 {/* Add Guest Form */}
//                 {!isSubmitted && (
//                   <form onSubmit={addGuest} className="space-y-3">
//                     <h3 className="font-medium text-sm">Add Guest Information</h3>
                    
//                     <div className="space-y-2">
//                       <Label htmlFor="guestName" className="text-xs">Guest Full Name</Label>
//                       <Input
//                         id="guestName"
//                         placeholder="Enter guest's full name"
//                         value={guestInfo.fullName}
//                         onChange={(e) => setGuestInfo({...guestInfo, fullName: e.target.value})}
//                         className="text-sm"
//                         required
//                       />
//                     </div>

//                     <div className="space-y-2">
//                       <Label htmlFor="guestId" className="text-xs">Guest ID Number</Label>
//                       <Input
//                         id="guestId"
//                         placeholder="Enter guest's ID number"
//                         value={guestInfo.idNumber}
//                         onChange={(e) => setGuestInfo({...guestInfo, idNumber: e.target.value})}
//                         className="text-sm"
//                         required
//                       />
//                     </div>

//                     <div className="space-y-2">
//                       <Label htmlFor="guestPhone" className="text-xs">Guest Phone Number</Label>
//                       <Input
//                         id="guestPhone"
//                         placeholder="Enter guest's phone number"
//                         value={guestInfo.phoneNumber}
//                         onChange={(e) => setGuestInfo({...guestInfo, phoneNumber: e.target.value})}
//                         className="text-sm"
//                         required
//                       />
//                     </div>

//                     <div className="space-y-2">
//                       <Label htmlFor="email" className="text-xs">Email for Invitation</Label>
//                       <Input
//                         id="email"
//                         type="email"
//                         placeholder="Enter email address"
//                         value={email}
//                         onChange={(e) => setEmail(e.target.value)}
//                         className="text-sm"
//                         required
//                       />
//                     </div>

//                     <Button type="submit" className="w-full text-sm">
//                       <Mail className="mr-2 h-4 w-4" />
//                       Generate & Send Invitation
//                     </Button>
//                   </form>
//                 )}

//                 {/* Success Message */}
//                 {isSubmitted && (
//                   <div className="p-3 bg-green-50 rounded-md text-center border border-green-200">
//                     <div className="flex justify-center mb-2">
//                       <div className="p-1 bg-green-100 rounded-full">
//                         <Mail className="h-5 w-5 text-green-600" />
//                       </div>
//                     </div>
//                     <h3 className="font-medium text-green-800 text-sm mb-1">Success!</h3>
//                     <p className="text-green-700 text-xs">
//                       Invitation sent to {email}
//                     </p>
                    
//                     <div className="mt-3 flex flex-col gap-2">
//                       <Button size="sm" className="w-full">
//                         <Download className="mr-2 h-3 w-3" />
//                         Download Invitation
//                       </Button>
//                       <Button size="sm" variant="outline" onClick={resetForm}>
//                         <UserPlus className="mr-2 h-3 w-3" />
//                         Add Another Guest
//                       </Button>
//                     </div>
//                   </div>
//                 )}

//                 <Button variant="outline" onClick={resetForm} className="w-full text-sm">
//                   Scan Another QR Code
//                 </Button>
//               </div>
//             )}
//           </CardContent>
//           <CardFooter className="flex flex-col items-start text-xs text-gray-500 pt-4 border-t">
//             <p>Need help? Contact graduation@university.edu</p>
//             <p>Make sure you have a valid graduation QR code.</p>
//           </CardFooter>
//         </Card>
//       </div>
//     </div>
//   )
// }





// "use client"

// import { useState, useRef, useEffect } from "react"
// import { Button } from "@/components/ui/button"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Badge } from "@/components/ui/badge"
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import { QrCode, Camera, CameraOff, Download, Mail, UserPlus, GraduationCap, RefreshCw, Scan, Search } from "lucide-react"

// interface Graduate {
//   id: number
//   registrationNumber: string
//   identificationNumber: string
//   fullName: string
//   college: string
//   degree: string
//   graduationDate: string
//   email: string
//   invitations: Invitation[]
// }

// interface Invitation {
//   id: number
//   guestName: string
//   guestId: string
//   guestPhone: string
//   generatedAt: string
// }

// // Mock data for demonstration
// const mockGraduates = [
//   {
//     id: 1,
//     registrationNumber: "REG123456",
//     identificationNumber: "ID789012",
//     fullName: "John Doe",
//     college: "College of Engineering",
//     degree: "Bachelor of Science in Computer Science",
//     graduationDate: "2023-05-15",
//     email: "john.doe@example.com",
//     invitations: [
//       {
//         id: 1,
//         guestName: "Jane Doe",
//         guestId: "ID345678",
//         guestPhone: "+1234567890",
//         generatedAt: "2023-04-20T10:30:00Z"
//       }
//     ]
//   },
//   {
//     id: 2,
//     registrationNumber: "REG654321",
//     identificationNumber: "ID098765",
//     fullName: "Sarah Wilson",
//     college: "College of Business",
//     degree: "Bachelor of Business Administration",
//     graduationDate: "2023-05-15",
//     email: "sarah.wilson@example.com",
//     invitations: []
//   }
// ]

// export default function QRCodeGraduationScanner() {
//   const [activeTab, setActiveTab] = useState("scanner")
//   const [isScanning, setIsScanning] = useState(false)
//   const [hasCamera, setHasCamera] = useState(false)
//   const [cameraError, setCameraError] = useState("")
//   const [scannedData, setScannedData] = useState("")
//   const [graduate, setGraduate] = useState<Graduate | null>(null)
//   const [error, setError] = useState("")
//   const [isLoading, setIsLoading] = useState(false)
//   const [guestInfo, setGuestInfo] = useState({
//     fullName: "",
//     idNumber: "",
//     phoneNumber: ""
//   })
//   const [email, setEmail] = useState("")
//   const [isSubmitted, setIsSubmitted] = useState(false)
  
//   const videoRef = useRef<HTMLVideoElement>(null)
//   const streamRef = useRef<MediaStream | null>(null)
//   const canvasRef = useRef<HTMLCanvasElement>(null)

//   // Check for camera availability
//   useEffect(() => {
//     const checkCamera = async () => {
//       try {
//         if (navigator.mediaDevices && navigator.mediaDevices.enumerateDevices) {
//           const devices = await navigator.mediaDevices.enumerateDevices()
//           const videoDevices = devices.filter(device => device.kind === 'videoinput')
//           setHasCamera(videoDevices.length > 0)
//         } else {
//           setHasCamera(false)
//           setCameraError("Media devices not supported in this browser")
//         }
//       } catch (err) {
//         console.error("Error checking camera:", err)
//         setHasCamera(false)
//         setCameraError("Cannot access camera devices")
//       }
//     }
    
//     checkCamera()
//   }, [])

//   // Start camera for scanning
//   const startCamera = async () => {
//     try {
//       setCameraError("")
//       setIsScanning(true)
      
//       // Stop any existing stream first
//       if (streamRef.current) {
//         stopCamera()
//       }

//       const constraints = {
//         video: { 
//           facingMode: "environment",
//           width: { ideal: 1280 },
//           height: { ideal: 720 }
//         } 
//       }

//       const stream = await navigator.mediaDevices.getUserMedia(constraints)
      
//       if (videoRef.current) {
//         videoRef.current.srcObject = stream
//         // Wait for video to load and play
//         videoRef.current.onloadedmetadata = () => {
//           videoRef.current?.play().catch(err => {
//             console.error("Error playing video:", err)
//             setCameraError("Cannot play video stream")
//           })
//         }
//         streamRef.current = stream
//       }
      
//       setCameraError("")
//     } catch (err: any) {
//       console.error("Error accessing camera:", err)
//       setIsScanning(false)
      
//       // Provide more specific error messages
//       if (err.name === 'NotAllowedError') {
//         setCameraError("Camera access denied. Please allow camera permissions and try again.")
//       } else if (err.name === 'NotFoundError') {
//         setCameraError("No camera found on this device.")
//       } else if (err.name === 'NotSupportedError') {
//         setCameraError("Camera not supported in this browser.")
//       } else if (err.name === 'NotReadableError') {
//         setCameraError("Camera is already in use by another application.")
//       } else {
//         setCameraError("Unable to access camera. Please check permissions and try again.")
//       }
//     }
//   }

//   // Stop camera
//   const stopCamera = () => {
//     if (streamRef.current) {
//       streamRef.current.getTracks().forEach(track => {
//         track.stop()
//       })
//       streamRef.current = null
//     }
//     if (videoRef.current) {
//       videoRef.current.srcObject = null
//     }
//     setIsScanning(false)
//   }

//   // Toggle camera on/off
//   const toggleCamera = () => {
//     if (isScanning) {
//       stopCamera()
//     } else {
//       startCamera()
//     }
//   }

//   // Simulate QR code scanning
//   const simulateQRScan = () => {
//     if (!isScanning) {
//       setError("Please start camera first")
//       return
//     }

//     setIsLoading(true)
    
//     // Simulate scanning delay
//     setTimeout(() => {
//       // Mock QR code data - in real app this would come from actual QR scanning
//       const mockQRData = "REG123456:ID789012"
//       setScannedData(mockQRData)
      
//       // Parse the scanned data and verify graduate
//       const [regNumber, idNumber] = mockQRData.split(":")
//       verifyFromQR(regNumber, idNumber)
//     }, 1500)
//   }

//   // Verify graduate from QR data
//   const verifyFromQR = (registrationNumber: string, identificationNumber: string) => {
//     const foundGraduate = mockGraduates.find(g => 
//       g.registrationNumber === registrationNumber && 
//       g.identificationNumber === identificationNumber
//     )
    
//     if (foundGraduate) {
//       setGraduate(foundGraduate)
//       setEmail(foundGraduate.email)
//       setError("")
//       stopCamera() // Stop camera when graduate is found
//     } else {
//       setError("No graduate found with the provided QR code data.")
//       setGraduate(null)
//     }
//     setIsLoading(false)
//   }

//   // Manual verification fallback
//   const verifyManually = (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault()
//     setIsLoading(true)
    
//     if (!scannedData || !scannedData.includes(':')) {
//       setError("Invalid QR code format. Expected format: REG123:ID456")
//       setIsLoading(false)
//       return
//     }
    
//     // Simulate API call
//     setTimeout(() => {
//       const [regNumber, idNumber] = scannedData.split(":")
//       const foundGraduate = mockGraduates.find(g => 
//         g.registrationNumber === regNumber && 
//         g.identificationNumber === idNumber
//       )
      
//       if (foundGraduate) {
//         setGraduate(foundGraduate)
//         setEmail(foundGraduate.email)
//         setError("")
//       } else {
//         setError("No graduate found with the provided credentials.")
//         setGraduate(null)
//       }
//       setIsLoading(false)
//     }, 1000)
//   }

//   // Handle guest information submission
//   const addGuest = (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault()
    
//     // Validate guest info
//     if (!guestInfo.fullName.trim() || !guestInfo.idNumber.trim() || !guestInfo.phoneNumber.trim()) {
//       setError("Please fill in all guest information fields")
//       return
//     }

//     if (!email || !/\S+@\S+\.\S+/.test(email)) {
//       setError("Please enter a valid email address")
//       return
//     }
    
//     // In a real application, this would make an API call
//     const newInvitation = {
//       id: graduate?.invitations?.length ? graduate.invitations.length + 1 : 1,
//       guestName: guestInfo.fullName,
//       guestId: guestInfo.idNumber,
//       guestPhone: guestInfo.phoneNumber,
//       generatedAt: new Date().toISOString()
//     }
    
//     // Update graduate with new invitation
//     if (graduate) {
//       const updatedGraduate = {
//         ...graduate,
//         invitations: [...graduate.invitations, newInvitation]
//       }
//       setGraduate(updatedGraduate)
//     }
    
//     setIsSubmitted(true)
//     setError("")
    
//     // Simulate sending email
//     console.log(`Invitation sent to ${email}`)
//   }

//   // Reset form
//   const resetForm = () => {
//     setScannedData("")
//     setGraduate(null)
//     setError("")
//     setGuestInfo({ fullName: "", idNumber: "", phoneNumber: "" })
//     setEmail("")
//     setIsSubmitted(false)
//     stopCamera()
//   }

//   // Clean up camera on unmount
//   useEffect(() => {
//     return () => {
//       stopCamera()
//     }
//   }, [])

//   // Handle tab change - stop camera if switching away from scanner
//   useEffect(() => {
//     if (activeTab !== "scanner") {
//       stopCamera()
//     }
//   }, [activeTab])

//   return (
//     <div className="min-h-screen bg-gradient-to-b from-blue-50 to-indigo-100 py-6 px-4 sm:px-6 lg:px-8">
//       <div className="max-w-md mx-auto">
//         <div className="text-center mb-6">
//           <div className="flex justify-center items-center mb-3">
//             <GraduationCap className="h-10 w-10 text-blue-600" />
//           </div>
//           <h1 className="text-2xl font-bold text-gray-900 mb-2">Graduation QR Scanner</h1>
//           <p className="text-gray-600 text-sm">
//             Scan your graduation QR code to generate invitations
//           </p>
//         </div>

//         <Card className="w-full">
//           <CardHeader className="pb-4">
//             <CardTitle className="text-lg">QR Code Verification</CardTitle>
//             <CardDescription className="text-sm">
//               Scan your graduation QR code or enter details manually
//             </CardDescription>
//           </CardHeader>
//           <CardContent className="space-y-4">
//             {!graduate ? (
//               <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
//                 <TabsList className="grid grid-cols-2 mb-4">
//                   <TabsTrigger value="scanner" className="text-sm">QR Scanner</TabsTrigger>
//                   <TabsTrigger value="manual" className="text-sm">Manual Entry</TabsTrigger>
//                 </TabsList>

//                 <TabsContent value="scanner" className="space-y-4">
//                   {/* QR Scanner Section */}
//                   <div className="space-y-3">
//                     <div className="aspect-square bg-black rounded-lg overflow-hidden relative border-2 border-blue-300">
//                       {isScanning ? (
//                         <video
//                           ref={videoRef}
//                           autoPlay
//                           playsInline
//                           muted
//                           className="w-full h-full object-cover"
//                         />
//                       ) : (
//                         <div className="w-full h-full flex flex-col items-center justify-center bg-gray-800 text-white">
//                           <QrCode className="h-16 w-16 mb-2 opacity-50" />
//                           <p className="text-sm text-center px-4">
//                             {hasCamera ? "Camera ready for scanning" : "Camera not available"}
//                           </p>
//                           {!hasCamera && (
//                             <p className="text-xs text-red-300 mt-2 px-4">
//                               No camera detected on this device
//                             </p>
//                           )}
//                         </div>
//                       )}
                      
//                       {/* Scanning overlay */}
//                       {isScanning && (
//                         <div className="absolute inset-0 flex items-center justify-center">
//                           <div className="w-48 h-48 border-2 border-green-400 rounded-lg relative">
//                             <div className="absolute -top-1 -left-1 w-4 h-4 border-t-2 border-l-2 border-green-400"></div>
//                             <div className="absolute -top-1 -right-1 w-4 h-4 border-t-2 border-r-2 border-green-400"></div>
//                             <div className="absolute -bottom-1 -left-1 w-4 h-4 border-b-2 border-l-2 border-green-400"></div>
//                             <div className="absolute -bottom-1 -right-1 w-4 h-4 border-b-2 border-r-2 border-green-400"></div>
//                           </div>
//                         </div>
//                       )}
//                     </div>

//                     {cameraError && (
//                       <div className="p-2 bg-red-50 text-red-700 rounded-md text-xs">
//                         {cameraError}
//                       </div>
//                     )}

//                     <div className="flex flex-col gap-2">
//                       <Button 
//                         onClick={toggleCamera}
//                         disabled={!hasCamera}
//                         className="w-full"
//                         variant={isScanning ? "outline" : "default"}
//                       >
//                         {isScanning ? (
//                           <>
//                             <CameraOff className="mr-2 h-4 w-4" />
//                             Stop Camera
//                           </>
//                         ) : (
//                           <>
//                             <Camera className="mr-2 h-4 w-4" />
//                             Start Camera
//                           </>
//                         )}
//                       </Button>
                      
//                       <Button 
//                         onClick={simulateQRScan}
//                         disabled={!isScanning || isLoading}
//                         variant="secondary"
//                         className="w-full"
//                       >
//                         {isLoading ? (
//                           <>
//                             <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
//                             Scanning...
//                           </>
//                         ) : (
//                           <>
//                             <Scan className="mr-2 h-4 w-4" />
//                             Simulate Scan
//                           </>
//                         )}
//                       </Button>
//                     </div>
//                   </div>

//                   {scannedData && (
//                     <div className="p-3 bg-blue-50 rounded-md">
//                       <p className="text-xs text-blue-700 font-medium">Scanned Data:</p>
//                       <p className="text-blue-800 text-sm break-all">{scannedData}</p>
//                     </div>
//                   )}

//                   {error && (
//                     <div className="p-2 bg-red-50 text-red-700 rounded-md text-xs">
//                       {error}
//                     </div>
//                   )}
//                 </TabsContent>

//                 <TabsContent value="manual">
//                   <form onSubmit={verifyManually} className="space-y-3">
//                     <div className="space-y-2">
//                       <Label htmlFor="scannedData" className="text-sm">QR Code Data</Label>
//                       <Input
//                         id="scannedData"
//                         placeholder="Paste QR code data here (format: REG123:ID456)"
//                         value={scannedData}
//                         onChange={(e) => setScannedData(e.target.value)}
//                         className="text-sm"
//                         required
//                       />
//                       <p className="text-xs text-gray-500">
//                         Format: RegistrationNumber:IdentificationNumber
//                       </p>
//                     </div>

//                     {error && (
//                       <div className="p-2 bg-red-50 text-red-700 rounded-md text-xs">
//                         {error}
//                       </div>
//                     )}

//                     <Button 
//                       type="submit" 
//                       className="w-full"
//                       disabled={isLoading || !scannedData}
//                     >
//                       {isLoading ? (
//                         <>
//                           <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
//                           Verifying...
//                         </>
//                       ) : (
//                         <>
//                           <Search className="mr-2 h-4 w-4" />
//                           Verify Data
//                         </>
//                       )}
//                     </Button>
//                   </form>
//                 </TabsContent>
//               </Tabs>
//             ) : (
//               <div className="space-y-4">
//                 {/* Graduate Information */}
//                 <div className="p-3 bg-green-50 rounded-md border border-green-200">
//                   <div className="flex items-center justify-between mb-2">
//                     <h3 className="font-medium text-green-800 text-sm">Verified Graduate</h3>
//                     <Badge variant="secondary" className="bg-green-100 text-green-800">
//                       Verified
//                     </Badge>
//                   </div>
//                   <div className="space-y-2">
//                     <div className="flex justify-between">
//                       <span className="text-xs text-gray-600">Name:</span>
//                       <span className="font-medium text-sm">{graduate.fullName}</span>
//                     </div>
//                     <div className="flex justify-between">
//                       <span className="text-xs text-gray-600">Registration:</span>
//                       <span className="font-medium text-sm">{graduate.registrationNumber}</span>
//                     </div>
//                     <div className="flex justify-between">
//                       <span className="text-xs text-gray-600">College:</span>
//                       <span className="font-medium text-sm">{graduate.college}</span>
//                     </div>
//                     <div className="flex justify-between">
//                       <span className="text-xs text-gray-600">Degree:</span>
//                       <span className="font-medium text-sm text-right">{graduate.degree}</span>
//                     </div>
//                   </div>
//                 </div>

//                 {/* Existing Invitations */}
//                 {graduate.invitations.length > 0 && (
//                   <div>
//                     <h3 className="font-medium text-sm mb-2">Existing Invitations</h3>
//                     <div className="space-y-2">
//                       {graduate.invitations.map((invitation) => (
//                         <div key={invitation.id} className="p-2 border rounded-md text-sm">
//                           <p className="font-medium">{invitation.guestName}</p>
//                           <p className="text-gray-600 text-xs">ID: {invitation.guestId}</p>
//                           <p className="text-gray-600 text-xs">
//                             Generated: {new Date(invitation.generatedAt).toLocaleDateString()}
//                           </p>
//                         </div>
//                       ))}
//                     </div>
//                   </div>
//                 )}

//                 {/* Add Guest Form */}
//                 {!isSubmitted && (
//                   <form onSubmit={addGuest} className="space-y-3">
//                     <h3 className="font-medium text-sm">Add Guest Information</h3>
                    
//                     <div className="space-y-2">
//                       <Label htmlFor="guestName" className="text-xs">Guest Full Name</Label>
//                       <Input
//                         id="guestName"
//                         placeholder="Enter guest's full name"
//                         value={guestInfo.fullName}
//                         onChange={(e) => setGuestInfo({...guestInfo, fullName: e.target.value})}
//                         className="text-sm"
//                         required
//                       />
//                     </div>

//                     <div className="space-y-2">
//                       <Label htmlFor="guestId" className="text-xs">Guest ID Number</Label>
//                       <Input
//                         id="guestId"
//                         placeholder="Enter guest's ID number"
//                         value={guestInfo.idNumber}
//                         onChange={(e) => setGuestInfo({...guestInfo, idNumber: e.target.value})}
//                         className="text-sm"
//                         required
//                       />
//                     </div>

//                     <div className="space-y-2">
//                       <Label htmlFor="guestPhone" className="text-xs">Guest Phone Number</Label>
//                       <Input
//                         id="guestPhone"
//                         placeholder="Enter guest's phone number"
//                         value={guestInfo.phoneNumber}
//                         onChange={(e) => setGuestInfo({...guestInfo, phoneNumber: e.target.value})}
//                         className="text-sm"
//                         required
//                       />
//                     </div>

//                     <div className="space-y-2">
//                       <Label htmlFor="email" className="text-xs">Email for Invitation</Label>
//                       <Input
//                         id="email"
//                         type="email"
//                         placeholder="Enter email address"
//                         value={email}
//                         onChange={(e) => setEmail(e.target.value)}
//                         className="text-sm"
//                         required
//                       />
//                     </div>

//                     {error && (
//                       <div className="p-2 bg-red-50 text-red-700 rounded-md text-xs">
//                         {error}
//                       </div>
//                     )}

//                     <Button type="submit" className="w-full text-sm">
//                       <Mail className="mr-2 h-4 w-4" />
//                       Generate & Send Invitation
//                     </Button>
//                   </form>
//                 )}

//                 {/* Success Message */}
//                 {isSubmitted && (
//                   <div className="p-3 bg-green-50 rounded-md text-center border border-green-200">
//                     <div className="flex justify-center mb-2">
//                       <div className="p-1 bg-green-100 rounded-full">
//                         <Mail className="h-5 w-5 text-green-600" />
//                       </div>
//                     </div>
//                     <h3 className="font-medium text-green-800 text-sm mb-1">Success!</h3>
//                     <p className="text-green-700 text-xs">
//                       Invitation sent to {email}
//                     </p>
                    
//                     <div className="mt-3 flex flex-col gap-2">
//                       <Button size="sm" className="w-full">
//                         <Download className="mr-2 h-3 w-3" />
//                         Download Invitation
//                       </Button>
//                       <Button size="sm" variant="outline" onClick={resetForm}>
//                         <UserPlus className="mr-2 h-3 w-3" />
//                         Add Another Guest
//                       </Button>
//                     </div>
//                   </div>
//                 )}

//                 <Button variant="outline" onClick={resetForm} className="w-full text-sm">
//                   Scan Another QR Code
//                 </Button>
//               </div>
//             )}
//           </CardContent>
//           <CardFooter className="flex flex-col items-start text-xs text-gray-500 pt-4 border-t">
//             <p>Need help? Contact graduation@university.edu</p>
//             <p>Make sure you have a valid graduation QR code.</p>
//           </CardFooter>
//         </Card>
//       </div>
//     </div>
//   )
// }






// "use client"

// import { useState, useRef, useEffect } from "react"
// import { Button } from "@/components/ui/button"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Badge } from "@/components/ui/badge"
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import { QrCode, Camera, CameraOff, Download, Mail, UserPlus, GraduationCap, RefreshCw, Scan, Search, X, CheckCircle, AlertCircle } from "lucide-react"

// interface Graduate {
//   id: number
//   registrationNumber: string
//   identificationNumber: string
//   fullName: string
//   college: string
//   degree: string
//   graduationDate: string
//   email: string
//   invitations: Invitation[]
// }

// interface Invitation {
//   id: number
//   guestName: string
//   guestId: string
//   guestPhone: string
//   generatedAt: string
// }

// // Mock data for demonstration
// const mockGraduates = [
//   {
//     id: 1,
//     registrationNumber: "REG123456",
//     identificationNumber: "ID789012",
//     fullName: "John Doe",
//     college: "College of Engineering",
//     degree: "Bachelor of Science in Computer Science",
//     graduationDate: "2023-05-15",
//     email: "john.doe@example.com",
//     invitations: [
//       {
//         id: 1,
//         guestName: "Jane Doe",
//         guestId: "ID345678",
//         guestPhone: "+1234567890",
//         generatedAt: "2023-04-20T10:30:00Z"
//       }
//     ]
//   },
//   {
//     id: 2,
//     registrationNumber: "REG654321",
//     identificationNumber: "ID098765",
//     fullName: "Sarah Wilson",
//     college: "College of Business",
//     degree: "Bachelor of Business Administration",
//     graduationDate: "2023-05-15",
//     email: "sarah.wilson@example.com",
//     invitations: []
//   },
//   {
//     id: 3,
//     registrationNumber: "REG111222",
//     identificationNumber: "ID333444",
//     fullName: "Michael Brown",
//     college: "College of Medicine",
//     degree: "Doctor of Medicine",
//     graduationDate: "2023-05-15",
//     email: "michael.brown@example.com",
//     invitations: []
//   }
// ]

// // Store scanned results
// interface ScanResult {
//   graduate: Graduate
//   timestamp: Date
//   status: 'success' | 'error'
// }

// export default function QRCodeGraduationScanner() {
//   const [isScanning, setIsScanning] = useState(false)
//   const [hasCamera, setHasCamera] = useState(false)
//   const [cameraError, setCameraError] = useState("")
//   const [scannedData, setScannedData] = useState("")
//   const [currentGraduate, setCurrentGraduate] = useState<Graduate | null>(null)
//   const [error, setError] = useState("")
//   const [isLoading, setIsLoading] = useState(false)
//   const [scanResults, setScanResults] = useState<ScanResult[]>([])
//   const [showManualEntry, setShowManualEntry] = useState(false)
//   const [stats, setStats] = useState({
//     total: 0,
//     success: 0,
//     failed: 0
//   })
  
//   const videoRef = useRef<HTMLVideoElement>(null)
//   const streamRef = useRef<MediaStream | null>(null)
//   const lastScanTimeRef = useRef<number>(0)

//   // Check for camera availability
//   useEffect(() => {
//     const checkCamera = async () => {
//       try {
//         if (navigator.mediaDevices && navigator.mediaDevices.enumerateDevices) {
//           const devices = await navigator.mediaDevices.enumerateDevices()
//           const videoDevices = devices.filter(device => device.kind === 'videoinput')
//           setHasCamera(videoDevices.length > 0)
//         } else {
//           setHasCamera(false)
//           setCameraError("Media devices not supported in this browser")
//         }
//       } catch (err) {
//         console.error("Error checking camera:", err)
//         setHasCamera(false)
//         setCameraError("Cannot access camera devices")
//       }
//     }
    
//     checkCamera()
//   }, [])

//   // Start camera for scanning
//   const startCamera = async () => {
//     try {
//       setCameraError("")
//       setIsScanning(true)
      
//       // Stop any existing stream first
//       if (streamRef.current) {
//         stopCamera()
//       }

//       const constraints = {
//         video: { 
//           facingMode: "environment",
//           width: { ideal: 1280 },
//           height: { ideal: 720 }
//         } 
//       }

//       const stream = await navigator.mediaDevices.getUserMedia(constraints)
      
//       if (videoRef.current) {
//         videoRef.current.srcObject = stream
//         videoRef.current.onloadedmetadata = () => {
//           videoRef.current?.play().catch(err => {
//             console.error("Error playing video:", err)
//             setCameraError("Cannot play video stream")
//           })
//         }
//         streamRef.current = stream
//       }
      
//       setCameraError("")
//     } catch (err: any) {
//       console.error("Error accessing camera:", err)
//       setIsScanning(false)
      
//       if (err.name === 'NotAllowedError') {
//         setCameraError("Camera access denied. Please allow camera permissions and try again.")
//       } else if (err.name === 'NotFoundError') {
//         setCameraError("No camera found on this device.")
//       } else if (err.name === 'NotSupportedError') {
//         setCameraError("Camera not supported in this browser.")
//       } else if (err.name === 'NotReadableError') {
//         setCameraError("Camera is already in use by another application.")
//       } else {
//         setCameraError("Unable to access camera. Please check permissions and try again.")
//       }
//     }
//   }

//   // Stop camera
//   const stopCamera = () => {
//     if (streamRef.current) {
//       streamRef.current.getTracks().forEach(track => {
//         track.stop()
//       })
//       streamRef.current = null
//     }
//     if (videoRef.current) {
//       videoRef.current.srcObject = null
//     }
//     setIsScanning(false)
//   }

//   // Toggle camera on/off
//   const toggleCamera = () => {
//     if (isScanning) {
//       stopCamera()
//     } else {
//       startCamera()
//     }
//   }

//   // Simulate QR code scanning
//   const simulateQRScan = () => {
//     if (!isScanning) {
//       setError("Please start camera first")
//       return
//     }

//     // Prevent multiple rapid scans
//     const now = Date.now()
//     if (now - lastScanTimeRef.current < 1000) {
//       return
//     }
//     lastScanTimeRef.current = now

//     setIsLoading(true)
//     setError("")
    
//     // Simulate scanning delay
//     setTimeout(() => {
//       // Randomly select from mock data to simulate different scans
//       const randomIndex = Math.floor(Math.random() * mockGraduates.length)
//       const mockGraduate = mockGraduates[randomIndex]
//       const mockQRData = `${mockGraduate.registrationNumber}:${mockGraduate.identificationNumber}`
      
//       setScannedData(mockQRData)
//       verifyFromQR(mockGraduate.registrationNumber, mockGraduate.identificationNumber)
//     }, 800)
//   }

//   // Verify graduate from QR data
//   const verifyFromQR = (registrationNumber: string, identificationNumber: string) => {
//     const foundGraduate = mockGraduates.find(g => 
//       g.registrationNumber === registrationNumber && 
//       g.identificationNumber === identificationNumber
//     )
    
//     if (foundGraduate) {
//       setCurrentGraduate(foundGraduate)
//       setError("")
      
//       // Add to scan results
//       const newResult: ScanResult = {
//         graduate: foundGraduate,
//         timestamp: new Date(),
//         status: 'success'
//       }
//       setScanResults(prev => [newResult, ...prev.slice(0, 9)]) // Keep last 10 results
      
//       // Update stats
//       setStats(prev => ({
//         total: prev.total + 1,
//         success: prev.success + 1,
//         failed: prev.failed
//       }))
//     } else {
//       setError("No graduate found with the provided QR code data.")
//       setCurrentGraduate(null)
      
//       // Add failed scan to results
//       const failedResult: ScanResult = {
//         graduate: {
//           id: -1,
//           registrationNumber,
//           identificationNumber,
//           fullName: "Not Found",
//           college: "Unknown",
//           degree: "Unknown",
//           graduationDate: "",
//           email: "",
//           invitations: []
//         },
//         timestamp: new Date(),
//         status: 'error'
//       }
//       setScanResults(prev => [failedResult, ...prev.slice(0, 9)])
      
//       // Update stats
//       setStats(prev => ({
//         total: prev.total + 1,
//         success: prev.success,
//         failed: prev.failed + 1
//       }))
//     }
//     setIsLoading(false)
//   }

//   // Manual verification fallback
//   const verifyManually = (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault()
//     setIsLoading(true)
    
//     if (!scannedData || !scannedData.includes(':')) {
//       setError("Invalid QR code format. Expected format: REG123:ID456")
//       setIsLoading(false)
//       return
//     }
    
//     // Simulate API call
//     setTimeout(() => {
//       const [regNumber, idNumber] = scannedData.split(":")
//       verifyFromQR(regNumber, idNumber)
//       setShowManualEntry(false)
//     }, 800)
//   }

//   // Clear current scan and continue
//   const continueScanning = () => {
//     setCurrentGraduate(null)
//     setScannedData("")
//     setError("")
//   }

//   // Clear all results
//   const clearAllResults = () => {
//     setScanResults([])
//     setStats({ total: 0, success: 0, failed: 0 })
//   }

//   // Clean up camera on unmount
//   useEffect(() => {
//     return () => {
//       stopCamera()
//     }
//   }, [])

//   return (
//     <div className="min-h-screen bg-gradient-to-b from-blue-50 to-indigo-100 py-4 px-4 sm:px-6 lg:px-8">
//       <div className="max-w-6xl mx-auto">
//         <div className="text-center mb-6">
//           <div className="flex justify-center items-center mb-3">
//             <GraduationCap className="h-10 w-10 text-blue-600" />
//           </div>
//           <h1 className="text-2xl font-bold text-gray-900 mb-2">Graduation QR Scanner</h1>
//           <p className="text-gray-600 text-sm">
//             High-volume QR code scanning for graduation verification
//           </p>
//         </div>

//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//           {/* Scanner Section - Left Column */}
//           <div className="lg:col-span-2 space-y-4">
//             <Card>
//               <CardHeader className="pb-4">
//                 <CardTitle className="text-lg flex items-center justify-between">
//                   <span>QR Code Scanner</span>
//                   <div className="flex items-center gap-2">
//                     <Badge variant="secondary" className="bg-blue-100 text-blue-800">
//                       Total: {stats.total}
//                     </Badge>
//                     <Badge variant="secondary" className="bg-green-100 text-green-800">
//                       Success: {stats.success}
//                     </Badge>
//                     <Badge variant="secondary" className="bg-red-100 text-red-800">
//                       Failed: {stats.failed}
//                     </Badge>
//                   </div>
//                 </CardTitle>
//                 <CardDescription className="text-sm">
//                   Scan graduation QR codes continuously. Results appear below.
//                 </CardDescription>
//               </CardHeader>
//               <CardContent className="space-y-4">
//                 {/* Scanner View */}
//                 <div className="aspect-video bg-black rounded-lg overflow-hidden relative border-2 border-blue-300">
//                   {isScanning ? (
//                     <video
//                       ref={videoRef}
//                       autoPlay
//                       playsInline
//                       muted
//                       className="w-full h-full object-cover"
//                     />
//                   ) : (
//                     <div className="w-full h-full flex flex-col items-center justify-center bg-gray-800 text-white">
//                       <QrCode className="h-16 w-16 mb-2 opacity-50" />
//                       <p className="text-sm text-center px-4">
//                         {hasCamera ? "Camera ready for scanning" : "Camera not available"}
//                       </p>
//                       {!hasCamera && (
//                         <p className="text-xs text-red-300 mt-2 px-4">
//                           No camera detected on this device
//                         </p>
//                       )}
//                     </div>
//                   )}
                  
//                   {/* Scanning overlay */}
//                   {isScanning && (
//                     <div className="absolute inset-0 flex items-center justify-center">
//                       <div className="w-48 h-48 border-2 border-green-400 rounded-lg relative">
//                         <div className="absolute -top-1 -left-1 w-4 h-4 border-t-2 border-l-2 border-green-400"></div>
//                         <div className="absolute -top-1 -right-1 w-4 h-4 border-t-2 border-r-2 border-green-400"></div>
//                         <div className="absolute -bottom-1 -left-1 w-4 h-4 border-b-2 border-l-2 border-green-400"></div>
//                         <div className="absolute -bottom-1 -right-1 w-4 h-4 border-b-2 border-r-2 border-green-400"></div>
//                       </div>
//                     </div>
//                   )}
//                 </div>

//                 {cameraError && (
//                   <div className="p-3 bg-red-50 text-red-700 rounded-md text-sm">
//                     <AlertCircle className="h-4 w-4 inline mr-2" />
//                     {cameraError}
//                   </div>
//                 )}

//                 {/* Scanner Controls */}
//                 <div className="grid grid-cols-2 gap-3">
//                   <Button 
//                     onClick={toggleCamera}
//                     disabled={!hasCamera}
//                     variant={isScanning ? "outline" : "default"}
//                     className="w-full"
//                   >
//                     {isScanning ? (
//                       <>
//                         <CameraOff className="mr-2 h-4 w-4" />
//                         Stop Camera
//                       </>
//                     ) : (
//                       <>
//                         <Camera className="mr-2 h-4 w-4" />
//                         Start Camera
//                       </>
//                     )}
//                   </Button>
                  
//                   <Button 
//                     onClick={simulateQRScan}
//                     disabled={!isScanning || isLoading}
//                     variant="secondary"
//                     className="w-full"
//                   >
//                     {isLoading ? (
//                       <>
//                         <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
//                         Scanning...
//                       </>
//                     ) : (
//                       <>
//                         <Scan className="mr-2 h-4 w-4" />
//                         Simulate Scan
//                       </>
//                     )}
//                   </Button>
//                 </div>

//                 {/* Manual Entry */}
//                 {showManualEntry ? (
//                   <div className="p-4 border rounded-lg bg-gray-50">
//                     <form onSubmit={verifyManually} className="space-y-3">
//                       <div className="flex items-center justify-between">
//                         <Label htmlFor="scannedData" className="text-sm">Manual QR Data Entry</Label>
//                         <Button
//                           type="button"
//                           variant="ghost"
//                           size="sm"
//                           onClick={() => setShowManualEntry(false)}
//                         >
//                           <X className="h-4 w-4" />
//                         </Button>
//                       </div>
//                       <Input
//                         id="scannedData"
//                         placeholder="Enter QR code data (REG123:ID456)"
//                         value={scannedData}
//                         onChange={(e) => setScannedData(e.target.value)}
//                         className="text-sm"
//                         required
//                         autoFocus
//                       />
//                       <div className="flex gap-2">
//                         <Button type="submit" className="flex-1" disabled={isLoading}>
//                           {isLoading ? "Verifying..." : "Verify"}
//                         </Button>
//                         <Button type="button" variant="outline" onClick={() => setShowManualEntry(false)}>
//                           Cancel
//                         </Button>
//                       </div>
//                     </form>
//                   </div>
//                 ) : (
//                   <Button 
//                     variant="outline" 
//                     onClick={() => setShowManualEntry(true)}
//                     className="w-full"
//                   >
//                     <Search className="mr-2 h-4 w-4" />
//                     Manual Entry
//                   </Button>
//                 )}

//                 {error && (
//                   <div className="p-3 bg-red-50 text-red-700 rounded-md text-sm">
//                     <AlertCircle className="h-4 w-4 inline mr-2" />
//                     {error}
//                   </div>
//                 )}
//               </CardContent>
//             </Card>

//             {/* Current Scan Result */}
//             {currentGraduate && (
//               <Card className="border-green-200 bg-green-50">
//                 <CardHeader className="pb-3">
//                   <CardTitle className="text-lg flex items-center gap-2">
//                     <CheckCircle className="h-5 w-5 text-green-600" />
//                     Scan Successful
//                     <Badge className="bg-green-100 text-green-800 ml-auto">
//                       Verified
//                     </Badge>
//                   </CardTitle>
//                 </CardHeader>
//                 <CardContent>
//                   <div className="grid grid-cols-2 gap-4 text-sm">
//                     <div>
//                       <span className="font-medium">Name:</span>
//                       <p className="text-gray-700">{currentGraduate.fullName}</p>
//                     </div>
//                     <div>
//                       <span className="font-medium">Registration:</span>
//                       <p className="text-gray-700">{currentGraduate.registrationNumber}</p>
//                     </div>
//                     <div>
//                       <span className="font-medium">College:</span>
//                       <p className="text-gray-700">{currentGraduate.college}</p>
//                     </div>
//                     <div>
//                       <span className="font-medium">Degree:</span>
//                       <p className="text-gray-700">{currentGraduate.degree}</p>
//                     </div>
//                   </div>
//                   <Button 
//                     onClick={continueScanning}
//                     className="w-full mt-4"
//                     variant="outline"
//                   >
//                     Continue Scanning
//                   </Button>
//                 </CardContent>
//               </Card>
//             )}
//           </div>

//           {/* Scan Results - Right Column */}
//           <div className="space-y-4">
//             <Card>
//               <CardHeader className="pb-3">
//                 <CardTitle className="text-lg flex items-center justify-between">
//                   <span>Recent Scans</span>
//                   {scanResults.length > 0 && (
//                     <Button variant="ghost" size="sm" onClick={clearAllResults}>
//                       Clear All
//                     </Button>
//                   )}
//                 </CardTitle>
//                 <CardDescription className="text-sm">
//                   Last {scanResults.length} scans
//                 </CardDescription>
//               </CardHeader>
//               <CardContent>
//                 {scanResults.length === 0 ? (
//                   <div className="text-center py-8 text-gray-500">
//                     <QrCode className="h-12 w-12 mx-auto mb-3 opacity-30" />
//                     <p className="text-sm">No scans yet</p>
//                     <p className="text-xs">Scan QR codes to see results here</p>
//                   </div>
//                 ) : (
//                   <div className="space-y-3 max-h-[600px] overflow-y-auto">
//                     {scanResults.map((result, index) => (
//                       <div
//                         key={index}
//                         className={`p-3 border rounded-lg ${
//                           result.status === 'success' 
//                             ? 'bg-white border-green-200' 
//                             : 'bg-red-50 border-red-200'
//                         }`}
//                       >
//                         <div className="flex items-start justify-between mb-2">
//                           <div className="flex items-center gap-2">
//                             {result.status === 'success' ? (
//                               <CheckCircle className="h-4 w-4 text-green-600" />
//                             ) : (
//                               <AlertCircle className="h-4 w-4 text-red-600" />
//                             )}
//                             <span className="font-medium text-sm">
//                               {result.graduate.fullName}
//                             </span>
//                           </div>
//                           <Badge 
//                             variant="secondary" 
//                             className={
//                               result.status === 'success' 
//                                 ? 'bg-green-100 text-green-800' 
//                                 : 'bg-red-100 text-red-800'
//                             }
//                           >
//                             {result.status === 'success' ? 'Success' : 'Failed'}
//                           </Badge>
//                         </div>
//                         <div className="text-xs text-gray-600 space-y-1">
//                           <p>Reg: {result.graduate.registrationNumber}</p>
//                           <p>ID: {result.graduate.identificationNumber}</p>
//                           <p>Time: {result.timestamp.toLocaleTimeString()}</p>
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 )}
//               </CardContent>
//             </Card>

//             {/* Quick Actions */}
//             <Card>
//               <CardHeader className="pb-3">
//                 <CardTitle className="text-lg">Quick Actions</CardTitle>
//               </CardHeader>
//               <CardContent className="space-y-2">
//                 <Button variant="outline" className="w-full justify-start">
//                   <Download className="h-4 w-4 mr-2" />
//                   Export All Results
//                 </Button>
//                 <Button variant="outline" className="w-full justify-start">
//                   <Mail className="h-4 w-4 mr-2" />
//                   Send Batch Report
//                 </Button>
//                 <Button variant="outline" className="w-full justify-start">
//                   <UserPlus className="h-4 w-4 mr-2" />
//                   Bulk Invitations
//                 </Button>
//               </CardContent>
//             </Card>
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }






"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { QrCode, Camera, CameraOff, Download, Mail, RefreshCw, Scan, Search, X, CheckCircle, AlertCircle } from "lucide-react"

interface Graduate {
  id: number
  registrationNumber: string
  identificationNumber: string
  fullName: string
  college: string
  degree: string
  graduationDate: string
  email: string
}

// Mock data for demonstration
const mockGraduates = [
  {
    id: 1,
    registrationNumber: "REG123456",
    identificationNumber: "ID789012",
    fullName: "John Doe",
    college: "College of Engineering",
    degree: "Bachelor of Science in Computer Science",
    graduationDate: "2023-05-15",
    email: "john.doe@example.com",
  },
  {
    id: 2,
    registrationNumber: "REG654321",
    identificationNumber: "ID098765",
    fullName: "Sarah Wilson",
    college: "College of Business",
    degree: "Bachelor of Business Administration",
    graduationDate: "2023-05-15",
    email: "sarah.wilson@example.com",
  },
  {
    id: 3,
    registrationNumber: "REG111222",
    identificationNumber: "ID333444",
    fullName: "Michael Brown",
    college: "College of Medicine",
    degree: "Doctor of Medicine",
    graduationDate: "2023-05-15",
    email: "michael.brown@example.com",
  }
]

export default function QRCodeGraduationScanner() {
  const [isScanning, setIsScanning] = useState(false)
  const [hasCamera, setHasCamera] = useState(false)
  const [cameraError, setCameraError] = useState("")
  const [scannedData, setScannedData] = useState("")
  const [currentGraduate, setCurrentGraduate] = useState<Graduate | null>(null)
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [showManualEntry, setShowManualEntry] = useState(false)
  const [scanCount, setScanCount] = useState(0)
  
  const videoRef = useRef<HTMLVideoElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const lastScanTimeRef = useRef<number>(0)

  // Check for camera availability
  useEffect(() => {
    const checkCamera = async () => {
      try {
        if (navigator.mediaDevices && navigator.mediaDevices.enumerateDevices) {
          const devices = await navigator.mediaDevices.enumerateDevices()
          const videoDevices = devices.filter(device => device.kind === 'videoinput')
          setHasCamera(videoDevices.length > 0)
        }
      } catch (err) {
        console.error("Error checking camera:", err)
        setHasCamera(false)
      }
    }
    
    checkCamera()
  }, [])

  // Start camera for scanning
  const startCamera = async () => {
    try {
      setCameraError("")
      setIsScanning(true)
      
      if (streamRef.current) {
        stopCamera()
      }

      const constraints = {
        video: { 
          facingMode: "environment",
          width: { ideal: 1280 },
          height: { ideal: 720 }
        } 
      }

      const stream = await navigator.mediaDevices.getUserMedia(constraints)
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        videoRef.current.onloadedmetadata = () => {
          videoRef.current?.play().catch(err => {
            console.error("Error playing video:", err)
            setCameraError("Cannot play video stream")
          })
        }
        streamRef.current = stream
      }
    } catch (err: any) {
      console.error("Error accessing camera:", err)
      setIsScanning(false)
      
      if (err.name === 'NotAllowedError') {
        setCameraError("Camera access denied")
      } else if (err.name === 'NotFoundError') {
        setCameraError("No camera found")
      } else {
        setCameraError("Unable to access camera")
      }
    }
  }

  // Stop camera
  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => {
        track.stop()
      })
      streamRef.current = null
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null
    }
    setIsScanning(false)
  }

  // Simulate QR code scanning
  const simulateQRScan = () => {
    if (!isScanning) {
      setError("Please start camera first")
      return
    }

    const now = Date.now()
    if (now - lastScanTimeRef.current < 1000) {
      return
    }
    lastScanTimeRef.current = now

    setIsLoading(true)
    setError("")
    
    setTimeout(() => {
      const randomIndex = Math.floor(Math.random() * mockGraduates.length)
      const mockGraduate = mockGraduates[randomIndex]
      const mockQRData = `${mockGraduate.registrationNumber}:${mockGraduate.identificationNumber}`
      
      setScannedData(mockQRData)
      verifyFromQR(mockGraduate.registrationNumber, mockGraduate.identificationNumber)
    }, 800)
  }

  // Verify graduate from QR data
  const verifyFromQR = (registrationNumber: string, identificationNumber: string) => {
    const foundGraduate = mockGraduates.find(g => 
      g.registrationNumber === registrationNumber && 
      g.identificationNumber === identificationNumber
    )
    
    if (foundGraduate) {
      setCurrentGraduate(foundGraduate)
      setError("")
      setScanCount(prev => prev + 1)
    } else {
      setError("No graduate found with this QR code")
      setCurrentGraduate(null)
    }
    setIsLoading(false)
  }

  // Manual verification
  const verifyManually = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    
    if (!scannedData || !scannedData.includes(':')) {
      setError("Invalid format. Use: REG123:ID456")
      setIsLoading(false)
      return
    }
    
    setTimeout(() => {
      const [regNumber, idNumber] = scannedData.split(":")
      verifyFromQR(regNumber, idNumber)
      setShowManualEntry(false)
    }, 800)
  }

  // Continue scanning
  const continueScanning = () => {
    setCurrentGraduate(null)
    setScannedData("")
    setError("")
  }

  // Clean up camera on unmount
  useEffect(() => {
    return () => {
      stopCamera()
    }
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 py-4 px-4">
      <div className="max-w-md mx-auto">
        {/* Header - Minimal */}
        <div className="text-center mb-4">
          <div className="flex justify-center items-center mb-2">
            <QrCode className="h-8 w-8 text-blue-600" />
          </div>
          <h1 className="text-xl font-bold text-gray-900">QR Scanner</h1>
          <p className="text-gray-600 text-sm">Scan graduation codes</p>
          <div className="flex justify-center items-center gap-4 mt-2">
            <Badge variant="secondary" className="bg-blue-100 text-blue-800">
              Scanned: {scanCount}
            </Badge>
            {currentGraduate && (
              <Badge className="bg-green-100 text-green-800">
                Verified
              </Badge>
            )}
          </div>
        </div>

        {/* Scanner Section */}
        <Card className="mb-4">
          <CardContent className="p-4 space-y-4">
            {/* Scanner View */}
            <div className="aspect-square bg-black rounded-lg overflow-hidden relative border-2 border-blue-300">
              {isScanning ? (
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center bg-gray-800 text-white">
                  <QrCode className="h-16 w-16 mb-2 opacity-50" />
                  <p className="text-sm text-center px-4">
                    {hasCamera ? "Camera ready" : "No camera"}
                  </p>
                </div>
              )}
              
              {/* Scanning overlay */}
              {isScanning && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-40 h-40 border-2 border-green-400 rounded-lg relative">
                    <div className="absolute -top-1 -left-1 w-4 h-4 border-t-2 border-l-2 border-green-400"></div>
                    <div className="absolute -top-1 -right-1 w-4 h-4 border-t-2 border-r-2 border-green-400"></div>
                    <div className="absolute -bottom-1 -left-1 w-4 h-4 border-b-2 border-l-2 border-green-400"></div>
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 border-b-2 border-r-2 border-green-400"></div>
                  </div>
                </div>
              )}
            </div>

            {cameraError && (
              <div className="p-2 bg-red-50 text-red-700 rounded-md text-xs text-center">
                <AlertCircle className="h-3 w-3 inline mr-1" />
                {cameraError}
              </div>
            )}

            {/* Scanner Controls */}
            <div className="grid grid-cols-2 gap-2">
              <Button 
                onClick={isScanning ? stopCamera : startCamera}
                disabled={!hasCamera}
                variant={isScanning ? "outline" : "default"}
                size="sm"
                className="w-full"
              >
                {isScanning ? (
                  <>
                    <CameraOff className="mr-1 h-3 w-3" />
                    Stop
                  </>
                ) : (
                  <>
                    <Camera className="mr-1 h-3 w-3" />
                    Start
                  </>
                )}
              </Button>
              
              <Button 
                onClick={simulateQRScan}
                disabled={!isScanning || isLoading}
                variant="secondary"
                size="sm"
                className="w-full"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="mr-1 h-3 w-3 animate-spin" />
                    Scanning
                  </>
                ) : (
                  <>
                    <Scan className="mr-1 h-3 w-3" />
                    Test Scan
                  </>
                )}
              </Button>
            </div>

            {/* Manual Entry */}
            {showManualEntry ? (
              <div className="p-3 border rounded-lg bg-gray-50">
                <form onSubmit={verifyManually} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="scannedData" className="text-xs">Manual Entry</Label>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowManualEntry(false)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                  <Input
                    id="scannedData"
                    placeholder="REG123:ID456"
                    value={scannedData}
                    onChange={(e) => setScannedData(e.target.value)}
                    className="text-sm h-8"
                    required
                    autoFocus
                  />
                  <div className="flex gap-2">
                    <Button type="submit" size="sm" className="flex-1" disabled={isLoading}>
                      {isLoading ? "..." : "Verify"}
                    </Button>
                    <Button type="button" variant="outline" size="sm" onClick={() => setShowManualEntry(false)}>
                      Cancel
                    </Button>
                  </div>
                </form>
              </div>
            ) : (
              <Button 
                variant="outline" 
                onClick={() => setShowManualEntry(true)}
                size="sm"
                className="w-full"
              >
                <Search className="mr-1 h-3 w-3" />
                Manual Entry
              </Button>
            )}

            {error && (
              <div className="p-2 bg-red-50 text-red-700 rounded-md text-xs text-center">
                <AlertCircle className="h-3 w-3 inline mr-1" />
                {error}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Current Scan Result - Below Scanner */}
        {currentGraduate && (
          <Card className="border-green-200 bg-green-50 mb-4">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-3">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span className="font-medium text-sm">Verified Graduate</span>
                <Badge className="bg-green-100 text-green-800 ml-auto text-xs">
                  Success
                </Badge>
              </div>
              
              <div className="space-y-3 text-sm">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <span className="font-medium text-xs text-gray-600">Name:</span>
                    <p className="text-gray-800">{currentGraduate.fullName}</p>
                  </div>
                  <div>
                    <span className="font-medium text-xs text-gray-600">Registration:</span>
                    <p className="text-gray-800">{currentGraduate.registrationNumber}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <span className="font-medium text-xs text-gray-600">College:</span>
                    <p className="text-gray-800">{currentGraduate.college}</p>
                  </div>
                  <div>
                    <span className="font-medium text-xs text-gray-600">ID Number:</span>
                    <p className="text-gray-800">{currentGraduate.identificationNumber}</p>
                  </div>
                </div>
                <div>
                  <span className="font-medium text-xs text-gray-600">Degree:</span>
                  <p className="text-gray-800 text-xs">{currentGraduate.degree}</p>
                </div>
              </div>

              {/* <div className="flex gap-2 mt-4">
                <Button 
                  onClick={continueScanning}
                  size="sm"
                  className="flex-1"
                  variant="outline"
                >
                  Scan Next
                </Button>
                <Button size="sm" className="flex-1">
                  <Download className="mr-1 h-3 w-3" />
                  Save
                </Button>
                <Button size="sm" variant="secondary" className="flex-1">
                  <Mail className="mr-1 h-3 w-3" />
                  Email
                </Button>
              </div> */}
            </CardContent>
          </Card>
        )}

        {/* Quick Stats */}
        {scanCount > 0 && (
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-3">
              <div className="text-center text-sm text-blue-800">
                <p>Total scanned: <strong>{scanCount}</strong> • Ready for next QR code</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}