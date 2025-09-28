"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { QrCode, Camera, CameraOff, Download, Mail, UserPlus, GraduationCap, RefreshCw, Scan, Search } from "lucide-react"

interface Graduate {
  id: number
  registrationNumber: string
  identificationNumber: string
  fullName: string
  college: string
  degree: string
  graduationDate: string
  email: string
  invitations: Invitation[]
}

interface Invitation {
  id: number
  guestName: string
  guestId: string
  guestPhone: string
  generatedAt: string
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
    invitations: [
      {
        id: 1,
        guestName: "Jane Doe",
        guestId: "ID345678",
        guestPhone: "+1234567890",
        generatedAt: "2023-04-20T10:30:00Z"
      }
    ]
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
    invitations: []
  }
]

export default function QRCodeGraduationScanner() {
  const [activeTab, setActiveTab] = useState("scanner")
  const [isScanning, setIsScanning] = useState(false)
  const [hasCamera, setHasCamera] = useState(false)
  const [cameraError, setCameraError] = useState("")
  const [scannedData, setScannedData] = useState("")
  const [graduate, setGraduate] = useState<Graduate | null>(null)
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [guestInfo, setGuestInfo] = useState({
    fullName: "",
    idNumber: "",
    phoneNumber: ""
  })
  const [email, setEmail] = useState("")
  const [isSubmitted, setIsSubmitted] = useState(false)
  
  const videoRef = useRef<HTMLVideoElement>(null)
  const streamRef = useRef<MediaStream | null>(null)

  // Check for camera availability
  useEffect(() => {
    const checkCamera = async () => {
      try {
        const devices = await navigator.mediaDevices.enumerateDevices()
        const videoDevices = devices.filter(device => device.kind === 'videoinput')
        setHasCamera(videoDevices.length > 0)
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
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: "environment", // Prefer rear camera on mobile
          width: { ideal: 1280 },
          height: { ideal: 720 }
        } 
      })
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        streamRef.current = stream
      }
      
      setIsScanning(true)
      setCameraError("")
    } catch (err) {
      console.error("Error accessing camera:", err)
      setCameraError("Unable to access camera. Please check permissions and try again.")
      setIsScanning(false)
    }
  }

  // Stop camera
  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop())
      streamRef.current = null
    }
    setIsScanning(false)
  }

  // Simulate QR code scanning
  const simulateQRScan = () => {
    setIsLoading(true)
    
    // Simulate scanning delay
    setTimeout(() => {
      // Mock QR code data - in real app this would come from actual QR scanning
      const mockQRData = "REG123456:ID789012"
      setScannedData(mockQRData)
      
      // Parse the scanned data and verify graduate
      const [regNumber, idNumber] = mockQRData.split(":")
      verifyFromQR(regNumber, idNumber)
    }, 1500)
  }

  // Verify graduate from QR data
  const verifyFromQR = (registrationNumber: string, identificationNumber: string) => {
    const foundGraduate = mockGraduates.find(g => 
      g.registrationNumber === registrationNumber && 
      g.identificationNumber === identificationNumber
    )
    
    if (foundGraduate) {
      setGraduate(foundGraduate)
      setEmail(foundGraduate.email)
      setError("")
      stopCamera() // Stop camera when graduate is found
    } else {
      setError("No graduate found with the provided QR code data.")
      setGraduate(null)
    }
    setIsLoading(false)
  }

  // Manual verification fallback
  const verifyManually = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    
    // Simulate API call
    setTimeout(() => {
      const foundGraduate = mockGraduates.find(g => 
        g.registrationNumber === scannedData.split(":")[0] && 
        g.identificationNumber === scannedData.split(":")[1]
      )
      
      if (foundGraduate) {
        setGraduate(foundGraduate)
        setEmail(foundGraduate.email)
        setError("")
      } else {
        setError("No graduate found with the provided credentials.")
        setGraduate(null)
      }
      setIsLoading(false)
    }, 1000)
  }

  // Handle guest information submission
  const addGuest = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    
    // In a real application, this would make an API call
    const newInvitation = {
      id: graduate?.invitations?.length ? graduate.invitations.length + 1 : 1,
      guestName: guestInfo.fullName,
      guestId: guestInfo.idNumber,
      guestPhone: guestInfo.phoneNumber,
      generatedAt: new Date().toISOString()
    }
    
    setIsSubmitted(true)
    
    // Simulate sending email
    console.log(`Invitation sent to ${email}`)
  }

  // Reset form
  const resetForm = () => {
    setScannedData("")
    setGraduate(null)
    setError("")
    setGuestInfo({ fullName: "", idNumber: "", phoneNumber: "" })
    setEmail("")
    setIsSubmitted(false)
    setIsScanning(false)
    stopCamera()
  }

  // Clean up camera on unmount
  useEffect(() => {
    return () => {
      stopCamera()
    }
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-indigo-100 py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-6">
          <div className="flex justify-center items-center mb-3">
            <GraduationCap className="h-10 w-10 text-blue-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Graduation QR Scanner</h1>
          <p className="text-gray-600 text-sm">
            Scan your graduation QR code to generate invitations
          </p>
        </div>

        <Card className="w-full">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg">QR Code Verification</CardTitle>
            <CardDescription className="text-sm">
              Scan your graduation QR code or enter details manually
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {!graduate ? (
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid grid-cols-2 mb-4">
                  <TabsTrigger value="scanner" className="text-sm">QR Scanner</TabsTrigger>
                  <TabsTrigger value="manual" className="text-sm">Manual Entry</TabsTrigger>
                </TabsList>

                <TabsContent value="scanner" className="space-y-4">
                  {/* QR Scanner Section */}
                  <div className="space-y-3">
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
                            {hasCamera ? "Camera ready for scanning" : "Camera not available"}
                          </p>
                        </div>
                      )}
                      
                      {/* Scanning overlay */}
                      {isScanning && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-48 h-48 border-2 border-green-400 rounded-lg relative">
                            <div className="absolute -top-1 -left-1 w-4 h-4 border-t-2 border-l-2 border-green-400"></div>
                            <div className="absolute -top-1 -right-1 w-4 h-4 border-t-2 border-r-2 border-green-400"></div>
                            <div className="absolute -bottom-1 -left-1 w-4 h-4 border-b-2 border-l-2 border-green-400"></div>
                            <div className="absolute -bottom-1 -right-1 w-4 h-4 border-b-2 border-r-2 border-green-400"></div>
                          </div>
                        </div>
                      )}
                    </div>

                    {cameraError && (
                      <div className="p-2 bg-red-50 text-red-700 rounded-md text-xs">
                        {cameraError}
                      </div>
                    )}

                    <div className="flex flex-col gap-2">
                      {!isScanning ? (
                        <Button 
                          onClick={startCamera}
                          disabled={!hasCamera}
                          className="w-full"
                        >
                          <Camera className="mr-2 h-4 w-4" />
                          Start Camera
                        </Button>
                      ) : (
                        <Button 
                          onClick={stopCamera}
                          variant="outline"
                          className="w-full"
                        >
                          <CameraOff className="mr-2 h-4 w-4" />
                          Stop Camera
                        </Button>
                      )}
                      
                      <Button 
                        onClick={simulateQRScan}
                        disabled={!isScanning || isLoading}
                        variant="secondary"
                        className="w-full"
                      >
                        {isLoading ? (
                          <>
                            <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                            Scanning...
                          </>
                        ) : (
                          <>
                            <Scan className="mr-2 h-4 w-4" />
                            Simulate Scan
                          </>
                        )}
                      </Button>
                    </div>
                  </div>

                  {scannedData && (
                    <div className="p-3 bg-blue-50 rounded-md">
                      <p className="text-xs text-blue-700 font-medium">Scanned Data:</p>
                      <p className="text-blue-800 text-sm break-all">{scannedData}</p>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="manual">
                  <form onSubmit={verifyManually} className="space-y-3">
                    <div className="space-y-2">
                      <Label htmlFor="scannedData" className="text-sm">QR Code Data</Label>
                      <Input
                        id="scannedData"
                        placeholder="Paste QR code data here (format: REG123:ID456)"
                        value={scannedData}
                        onChange={(e) => setScannedData(e.target.value)}
                        className="text-sm"
                        required
                      />
                    </div>

                    {error && (
                      <div className="p-2 bg-red-50 text-red-700 rounded-md text-xs">
                        {error}
                      </div>
                    )}

                    <Button 
                      type="submit" 
                      className="w-full"
                      disabled={isLoading || !scannedData}
                    >
                      {isLoading ? (
                        <>
                          <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                          Verifying...
                        </>
                      ) : (
                        <>
                          <Search className="mr-2 h-4 w-4" />
                          Verify Data
                        </>
                      )}
                    </Button>
                  </form>
                </TabsContent>
              </Tabs>
            ) : (
              <div className="space-y-4">
                {/* Graduate Information */}
                <div className="p-3 bg-green-50 rounded-md border border-green-200">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium text-green-800 text-sm">Verified Graduate</h3>
                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                      Verified
                    </Badge>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-xs text-gray-600">Name:</span>
                      <span className="font-medium text-sm">{graduate.fullName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-xs text-gray-600">Registration:</span>
                      <span className="font-medium text-sm">{graduate.registrationNumber}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-xs text-gray-600">College:</span>
                      <span className="font-medium text-sm">{graduate.college}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-xs text-gray-600">Degree:</span>
                      <span className="font-medium text-sm text-right">{graduate.degree}</span>
                    </div>
                  </div>
                </div>

                {/* Existing Invitations */}
                {graduate.invitations.length > 0 && (
                  <div>
                    <h3 className="font-medium text-sm mb-2">Existing Invitations</h3>
                    <div className="space-y-2">
                      {graduate.invitations.map((invitation) => (
                        <div key={invitation.id} className="p-2 border rounded-md text-sm">
                          <p className="font-medium">{invitation.guestName}</p>
                          <p className="text-gray-600 text-xs">ID: {invitation.guestId}</p>
                          <p className="text-gray-600 text-xs">
                            Generated: {new Date(invitation.generatedAt).toLocaleDateString()}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Add Guest Form */}
                {!isSubmitted && (
                  <form onSubmit={addGuest} className="space-y-3">
                    <h3 className="font-medium text-sm">Add Guest Information</h3>
                    
                    <div className="space-y-2">
                      <Label htmlFor="guestName" className="text-xs">Guest Full Name</Label>
                      <Input
                        id="guestName"
                        placeholder="Enter guest's full name"
                        value={guestInfo.fullName}
                        onChange={(e) => setGuestInfo({...guestInfo, fullName: e.target.value})}
                        className="text-sm"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="guestId" className="text-xs">Guest ID Number</Label>
                      <Input
                        id="guestId"
                        placeholder="Enter guest's ID number"
                        value={guestInfo.idNumber}
                        onChange={(e) => setGuestInfo({...guestInfo, idNumber: e.target.value})}
                        className="text-sm"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="guestPhone" className="text-xs">Guest Phone Number</Label>
                      <Input
                        id="guestPhone"
                        placeholder="Enter guest's phone number"
                        value={guestInfo.phoneNumber}
                        onChange={(e) => setGuestInfo({...guestInfo, phoneNumber: e.target.value})}
                        className="text-sm"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-xs">Email for Invitation</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="Enter email address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="text-sm"
                        required
                      />
                    </div>

                    <Button type="submit" className="w-full text-sm">
                      <Mail className="mr-2 h-4 w-4" />
                      Generate & Send Invitation
                    </Button>
                  </form>
                )}

                {/* Success Message */}
                {isSubmitted && (
                  <div className="p-3 bg-green-50 rounded-md text-center border border-green-200">
                    <div className="flex justify-center mb-2">
                      <div className="p-1 bg-green-100 rounded-full">
                        <Mail className="h-5 w-5 text-green-600" />
                      </div>
                    </div>
                    <h3 className="font-medium text-green-800 text-sm mb-1">Success!</h3>
                    <p className="text-green-700 text-xs">
                      Invitation sent to {email}
                    </p>
                    
                    <div className="mt-3 flex flex-col gap-2">
                      <Button size="sm" className="w-full">
                        <Download className="mr-2 h-3 w-3" />
                        Download Invitation
                      </Button>
                      <Button size="sm" variant="outline" onClick={resetForm}>
                        <UserPlus className="mr-2 h-3 w-3" />
                        Add Another Guest
                      </Button>
                    </div>
                  </div>
                )}

                <Button variant="outline" onClick={resetForm} className="w-full text-sm">
                  Scan Another QR Code
                </Button>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex flex-col items-start text-xs text-gray-500 pt-4 border-t">
            <p>Need help? Contact graduation@university.edu</p>
            <p>Make sure you have a valid graduation QR code.</p>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}