"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Download, Search, Mail, UserPlus, GraduationCap, RefreshCw } from "lucide-react"

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
        generatedAt: "2023-04-20T10:30:00Z",
        downloadUrl: "#"
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

export default function GraduationInvitationGenerator() {
  const [activeTab, setActiveTab] = useState("verify")
  const [registrationNumber, setRegistrationNumber] = useState("")
  const [identificationNumber, setIdentificationNumber] = useState("")
  const [graduate, setGraduate] = useState<Graduate | null>(null);
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [guestInfo, setGuestInfo] = useState({
    fullName: "",
    idNumber: "",
    phoneNumber: ""
  })
  const [email, setEmail] = useState("")
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [searchOption, setSearchOption] = useState("registration")
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<Graduate[]>([])

  // Handle graduate verification
  const verifyGraduate = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    
    // Simulate API call
    setTimeout(() => {
      const foundGraduate = mockGraduates.find(g => 
        g.registrationNumber === registrationNumber && 
        g.identificationNumber === identificationNumber
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
      id: graduate?.invitations?.length ?? 0 + 1,
      guestName: guestInfo.fullName,
      guestId: guestInfo.idNumber,
      guestPhone: guestInfo.phoneNumber,
      generatedAt: new Date().toISOString(),
      downloadUrl: "#"
    }
    
    // setGraduate({
    //   ...graduate,
    //   invitations: [...graduate.invitations, newInvitation]
    // })
    
    setIsSubmitted(true)
    
    // Simulate sending email
    console.log(`Invitation sent to ${email}`)
  }

  // Handle alternative search
  const searchGraduate = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    
    // Simulate API call
    setTimeout(() => {
      let results: { id: number; registrationNumber: string; identificationNumber: string; fullName: string; college: string; degree: string; graduationDate: string; email: string; invitations: { id: number; guestName: string; guestId: string; guestPhone: string; generatedAt: string; downloadUrl: string }[] }[] | ((prevState: never[]) => never[]) = []
      
      if (searchOption === "registration") {
        results = mockGraduates.filter(g => 
          g.registrationNumber.includes(searchQuery)
        )
      } else if (searchOption === "name") {
        results = mockGraduates.filter(g => 
          g.fullName.toLowerCase().includes(searchQuery.toLowerCase())
        )
      } else if (searchOption === "college") {
        results = mockGraduates.filter(g => 
          g.college.toLowerCase().includes(searchQuery.toLowerCase())
        )
      }
      
      setSearchResults(results)
      setIsLoading(false)
    }, 1000)
  }

  // Reset form
  const resetForm = () => {
    setRegistrationNumber("")
    setIdentificationNumber("")
    setGraduate(null)
    setError("")
    setGuestInfo({ fullName: "", idNumber: "", phoneNumber: "" })
    setEmail("")
    setIsSubmitted(false)
    setSearchQuery("")
    setSearchResults([])
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex justify-center items-center mb-4">
            <GraduationCap className="h-12 w-12 text-blue-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Graduation Invitation Generator</h1>
          <p className="text-gray-600">
            Generate invitations for your graduation ceremony and invite your guests
          </p>
        </div>

        <Card className="w-full">
          <CardHeader>
            <CardTitle>Graduate Verification</CardTitle>
            <CardDescription>
              Verify your identity to generate invitations for your guests
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!graduate ? (
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid grid-cols-2 mb-6">
                  <TabsTrigger value="verify">Verify with ID</TabsTrigger>
                  <TabsTrigger value="search">Search Graduate</TabsTrigger>
                </TabsList>

                <TabsContent value="verify">
                  <form onSubmit={verifyGraduate} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="registrationNumber">Registration Number</Label>
                      <Input
                        id="registrationNumber"
                        placeholder="Enter your registration number"
                        value={registrationNumber}
                        onChange={(e) => setRegistrationNumber(e.target.value)}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="identificationNumber">Identification Number</Label>
                      <Input
                        id="identificationNumber"
                        placeholder="Enter your identification number"
                        value={identificationNumber}
                        onChange={(e) => setIdentificationNumber(e.target.value)}
                        required
                      />
                    </div>

                    {error && (
                      <div className="p-3 bg-red-50 text-red-700 rounded-md text-sm">
                        {error}
                      </div>
                    )}

                    <Button 
                      type="submit" 
                      className="w-full"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                          Verifying...
                        </>
                      ) : (
                        <>
                          <Search className="mr-2 h-4 w-4" />
                          Verify Identity
                        </>
                      )}
                    </Button>
                  </form>
                </TabsContent>

                <TabsContent value="search">
                  <form onSubmit={searchGraduate} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="searchOption">Search By</Label>
                      <Select
                        value={searchOption}
                        onValueChange={setSearchOption}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select search option" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="registration">Registration Number</SelectItem>
                          <SelectItem value="name">Full Name</SelectItem>
                          <SelectItem value="college">College Name</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="searchQuery">
                        {searchOption === "registration" && "Registration Number"}
                        {searchOption === "name" && "Full Name"}
                        {searchOption === "college" && "College Name"}
                      </Label>
                      <Input
                        id="searchQuery"
                        placeholder={
                          searchOption === "registration" ? "Enter registration number" :
                          searchOption === "name" ? "Enter full name" :
                          "Enter college name"
                        }
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        required
                      />
                    </div>

                    <Button 
                      type="submit" 
                      className="w-full"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                          Searching...
                        </>
                      ) : (
                        <>
                          <Search className="mr-2 h-4 w-4" />
                          Search Graduate
                        </>
                      )}
                    </Button>

                    {searchResults.length > 0 && (
                      <div className="mt-4 space-y-3">
                        <h3 className="font-medium">Search Results</h3>
                        {searchResults.map((result) => (
                          <div key={result.id} className="p-3 border rounded-md">
                            <p className="font-medium">{result.fullName}</p>
                            <p className="text-sm text-gray-600">{result.college}</p>
                            <p className="text-sm text-gray-600">Reg: {result.registrationNumber}</p>
                            <Button
                              size="sm"
                              className="mt-2"
                              onClick={() => {
                                setGraduate(result)
                                setEmail(result.email)
                              }}
                            >
                              Select Graduate
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}

                    {searchQuery && searchResults.length === 0 && !isLoading && (
                      <div className="p-3 bg-yellow-50 text-yellow-700 rounded-md text-sm">
                        No graduates found matching your search criteria.
                      </div>
                    )}
                  </form>
                </TabsContent>
              </Tabs>
            ) : (
              <div className="space-y-6">
                {/* Graduate Information */}
                <div className="p-4 bg-blue-50 rounded-md">
                  <h3 className="font-medium text-blue-800">Graduate Information</h3>
                  <div className="mt-2 grid grid-cols-2 gap-2">
                    <div>
                      <p className="text-sm text-gray-600">Name</p>
                      <p className="font-medium">{graduate.fullName}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Registration Number</p>
                      <p className="font-medium">{graduate.registrationNumber}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">College</p>
                      <p className="font-medium">{graduate.college}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Degree</p>
                      <p className="font-medium">{graduate.degree}</p>
                    </div>
                  </div>
                </div>

                {/* Existing Invitations */}
                {graduate.invitations.length > 0 && (
                  <div>
                    <h3 className="font-medium mb-3">Existing Invitations</h3>
                    <div className="space-y-3">
                      {graduate.invitations.map((invitation) => (
                        <div key={invitation.id} className="p-3 border rounded-md flex justify-between items-center">
                          <div>
                            <p className="font-medium">{invitation.guestName}</p>
                            <p className="text-sm text-gray-600">ID: {invitation.guestId}</p>
                            <p className="text-sm text-gray-600">Generated: {new Date(invitation.generatedAt).toLocaleDateString()}</p>
                          </div>
                          <Button size="sm">
                            <Download className="mr-2 h-4 w-4" />
                            Download
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Add Guest Form */}
                {!isSubmitted && (
                  <form onSubmit={addGuest} className="space-y-4">
                    <h3 className="font-medium">Add Guest Information</h3>
                    
                    <div className="space-y-2">
                      <Label htmlFor="guestName">Guest Full Name</Label>
                      <Input
                        id="guestName"
                        placeholder="Enter guest's full name"
                        value={guestInfo.fullName}
                        onChange={(e) => setGuestInfo({...guestInfo, fullName: e.target.value})}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="guestId">Guest ID Number</Label>
                      <Input
                        id="guestId"
                        placeholder="Enter guest's ID number"
                        value={guestInfo.idNumber}
                        onChange={(e) => setGuestInfo({...guestInfo, idNumber: e.target.value})}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="guestPhone">Guest Phone Number</Label>
                      <Input
                        id="guestPhone"
                        placeholder="Enter guest's phone number"
                        value={guestInfo.phoneNumber}
                        onChange={(e) => setGuestInfo({...guestInfo, phoneNumber: e.target.value})}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email to Receive Invitation</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="Enter your email address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>

                    <Button type="submit" className="w-full">
                      <Mail className="mr-2 h-4 w-4" />
                      Generate Invitation & Send Email
                    </Button>
                  </form>
                )}

                {/* Success Message */}
                {isSubmitted && (
                  <div className="p-4 bg-green-50 rounded-md text-center">
                    <div className="flex justify-center mb-3">
                      <div className="p-2 bg-green-100 rounded-full">
                        <Mail className="h-6 w-6 text-green-600" />
                      </div>
                    </div>
                    <h3 className="font-medium text-green-800 mb-2">Invitation Generated Successfully!</h3>
                    <p className="text-green-700">
                      Your invitation has been generated and sent to {email}. You can also download it below.
                    </p>
                    
                    <div className="mt-4 flex justify-center space-x-3">
                      <Button>
                        <Download className="mr-2 h-4 w-4" />
                        Download Invitation
                      </Button>
                      <Button variant="outline" onClick={resetForm}>
                        <UserPlus className="mr-2 h-4 w-4" />
                        Add Another Guest
                      </Button>
                    </div>
                  </div>
                )}

                <Button variant="outline" onClick={resetForm} className="w-full">
                  Verify Another Graduate
                </Button>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex flex-col items-start text-sm text-gray-500">
            <p>Need help? Contact the graduation committee at graduation@university.edu</p>
            <p>Please have your registration and identification numbers ready.</p>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}