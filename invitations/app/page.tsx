"use client";
import { useApi } from "@/lib/hooks/api-hooks";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useRouter } from "next/navigation";
import {
  Download,
  Search,
  Mail,
  UserPlus,
  GraduationCap,
  RefreshCw,
} from "lucide-react";
import { Graduation_student, InvitationCard } from "@prisma/client";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { usePDF } from "@/lib/hooks/usePDF";

interface Graduate {
  id: number;
  registrationNumber: string;
  identificationNumber: string;
  fullName: string;
  college: string;
  degree: string;
  graduationDate: string;
  email: string;
  invitations: Invitation[];
}

interface Invitation {
  id: number;
  guestName: string;
  guestId: string;
  guestPhone: string;
  generatedAt: string;
}

interface GraduationData {
  id: number;
  regNumber: string | null;
  collegeName: string | null;
  firstName: string | null;
  lastName: string | null;
  degree: string | null;
  status: string | null;
  scannedNumber: string | null;
  createdAt: Date;
  updatedAt: Date;
  invitations: InvitationCard[];
}
export default function GraduationInvitationGenerator() {
    const { modifyAndDownloadPDF, loading } = usePDF();
  const { api, useApiPost } = useApi();
  const [activeTab, setActiveTab] = useState("verify");
  const [registrationNumber, setRegistrationNumber] = useState("");
  const [identificationNumber, setIdentificationNumber] = useState("");
  const [graduate, setGraduate] = useState<GraduationData | null>(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [guestInfo, setGuestInfo] = useState({
    fullName: "",
    idNumber: "",
    phoneNumber: "",
  });
  const [loadingButton, setLoadingButton] = useState('');
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [searchOption, setSearchOption] = useState("registration");
  const [searchQuery, setSearchQuery] = useState("");

  // const { data: graduates, isLoading: isGraduatesLoading } = useApiQuery<Graduation_student[]>(['graduates'],"/admin/graduates");

  // Handle graduate verification
  const verifyGraduate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    await api
      .get<GraduationData>(
        `/admin/graduates/${registrationNumber}/${identificationNumber}`
      )
      .then((response) => {
        setGraduate(response);
        // setEmail(response.)
        setError("");
      })
      .catch((error) => {
        setError("No graduate found with the provided credentials.");
        setGraduate(null);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const { mutateAsync: guestData, isPending: isGuestLoading } =
    useApiPost<InvitationCard>(
      ["create-guest"],
      "/admin/graduates/create-invitation"
    );
  // Handle guest information submission
  const addGuest = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const newInvitation = [
      {
        fullName: graduate?.firstName + " " + graduate?.lastName,
        idNumber: graduate?.id.toString(),
        email: email,
        regNumber: graduate?.regNumber,
        // collegeName: graduate?.collegeName,
        type: "STUDENT",
      },
      {
        idNumber: guestInfo.idNumber,
        regNumber: graduate?.regNumber,
        fullName: guestInfo.fullName,
        phoneNumber: guestInfo.phoneNumber,
        type: "PARENT",
      },
    ];

    await guestData(newInvitation);
    setIsSubmitted(true);

    // Simulate sending email
    console.log(`Invitation sent to ${email}`);
  };
 const handleDownload = async (invitation: InvitationCard) => {
    if (!invitation) return;
    setLoadingButton(invitation.id);

    // Load PDF from public folder or URL
    const loadTemplatePDF = async (): Promise<ArrayBuffer> => {
      try {
        const response = await fetch("/Graduation_Invitation_final.pdf");
        if (!response.ok) {
          throw new Error("Failed to load template PDF");
        }
        return await response.arrayBuffer();
      } catch (error) {
        throw new Error(`Could not load template: ${error}`);
      }
    };

    try {
      const templateBuffer = await loadTemplatePDF();
      const firstname = invitation?.fullName?.split(" ")[0];
      const lastname = invitation?.fullName?.split(" ")[1];
      const names = `${firstname?.toUpperCase()} ${lastname}`;
      await modifyAndDownloadPDF(
        templateBuffer,
        {
          textFields: [
            {
              text: invitation.type ? `( ${invitation.type} )` : '',
              x: 190,
              y: 490,
              size: 19,
              color: { r: 0, g: 0, b: 0 },
              pageIndex: 0,
              maxWidth: 200,
              align: "center" as const,
            },
            {
              text: names,
              x: 190,
              y: 440,
              size: 18,
              color: { r: 0, g: 0, b: 0 },
              pageIndex: 0,
              maxWidth: 200,
              align: "center" as const,
            },
            {
              text: invitation.regNumber ?? "",
              x: 190,
              y: 400,
              size: 18,
              color: { r: 0, g: 0, b: 0 },
              pageIndex: 0,
              maxWidth: 200,
              align: "center" as const,
            },
          ],
          qrCodes: [
            {
              data: `${invitation.id}:${invitation.idNumber}`,
              x: 230,
              y: 50,
              width: 115,
              height: 115,
              pageIndex: 0,
              transparent: true,
            },
          ],
        },
        `invitation-${invitation.fullName}.pdf`
      );

    //   setTimeout(() => {
    //     router.push(`/download-thank-you`);
    //   }, 1500);
    } catch (err) {
      console.error("Failed to generate PDF:", err);
    }finally {
      setLoadingButton('');
    }

  };
  // Reset form
  const resetForm = () => {
    setRegistrationNumber("");
    setIdentificationNumber("");
    setGraduate(null);
    setError("");
    setGuestInfo({ fullName: "", idNumber: "", phoneNumber: "" });
    setEmail("");
    setIsSubmitted(false);
    setSearchQuery("");
    // setSearchResults([]);
  };

  const router = useRouter();
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex justify-center items-center mb-4">
            <GraduationCap className="h-12 w-12 text-blue-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Graduation Invitation Generator
          </h1>
          <p className="text-gray-600">
            Generate invitations for your graduation ceremony and invite your
            guests
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
                      <Label htmlFor="registrationNumber">
                        Registration Number
                      </Label>
                      <Input
                        id="registrationNumber"
                        placeholder="Enter your registration number"
                        value={registrationNumber}
                        onChange={(e) => setRegistrationNumber(e.target.value)}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="identificationNumber">
                        Identification Number
                      </Label>
                      <Input
                        id="identificationNumber"
                        placeholder="Enter your identification number"
                        value={identificationNumber}
                        onChange={(e) =>
                          setIdentificationNumber(e.target.value)
                        }
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
                  <form onSubmit={() => {}} className="space-y-4">
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
                          <SelectItem value="registration">
                            Registration Number
                          </SelectItem>
                          <SelectItem value="name">Full Name</SelectItem>
                          <SelectItem value="college">College Name</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="searchQuery">
                        {searchOption === "registration" &&
                          "Registration Number"}
                        {searchOption === "name" && "Full Name"}
                        {searchOption === "college" && "College Name"}
                      </Label>
                      <Input
                        id="searchQuery"
                        placeholder={
                          searchOption === "registration"
                            ? "Enter registration number"
                            : searchOption === "name"
                            ? "Enter full name"
                            : "Enter college name"
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
                    {/* 
                    {searchResults.length > 0 && (
                      <div className="mt-4 space-y-3">
                        <h3 className="font-medium">Search Results</h3>
                        {searchResults.map((result) => (
                          <div
                            key={result.id}
                            className="p-3 border rounded-md"
                          >
                            <p className="font-medium">{result.fullName}</p>
                            <p className="text-sm text-gray-600">
                              {result.college}
                            </p>
                            <p className="text-sm text-gray-600">
                              Reg: {result.registrationNumber}
                            </p>
                            <Button
                              size="sm"
                              className="mt-2"
                              onClick={() => {
                                setGraduate(result);
                                setEmail(result.email);
                              }}
                            >
                              Select Graduate
                            </Button>
                          </div>
                        ))}
                      </div>
                    )} */}

                    {/* {searchQuery &&
                      searchResults.length === 0 &&
                      !isLoading && (
                        <div className="p-3 bg-yellow-50 text-yellow-700 rounded-md text-sm">
                          No graduates found matching your search criteria.
                        </div>
                      )} */}
                  </form>
                </TabsContent>
              </Tabs>
            ) : (
              <div className="space-y-6">
                {/* Graduate Information */}
                <div className="p-4 bg-blue-50 rounded-md">
                  <h3 className="font-medium text-blue-800">
                    Graduate Information
                  </h3>
                  <div className="mt-2 grid grid-cols-2 gap-2">
                    <div>
                      <p className="text-sm text-gray-600">Name</p>
                      <p className="font-medium">
                        {graduate.firstName} {graduate.lastName}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">
                        Registration Number
                      </p>
                      <p className="font-medium">{graduate.regNumber}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">College</p>
                      <p className="font-medium">{graduate.collegeName}</p>
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
                        <div
                          key={invitation.id}
                          className="p-3 border rounded-md flex justify-between items-center"
                        >
                          <div>
                            <p className="font-medium">{invitation.fullName}</p>
                            <p className="text-sm text-gray-600">
                              ID: {invitation.idNumber}
                            </p>
                            <p className="text-sm text-gray-600">
                              Generated:{" "}
                              {new Date(
                                invitation.dateGenerated
                              ).toLocaleDateString()}
                            </p>
                          </div>
                          <Button size="sm" onClick={() => handleDownload(invitation)} disabled={loading && loadingButton === invitation.id}>
                            {
                              (loading && loadingButton === invitation.id) ?
                              <>
                              <LoadingSpinner size="sm" />
                            Downloading...
                              </>
                              : <>
                              <Download className="mr-2 h-4 w-4" />
                            Download
                            </>
                            }
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Add Guest Form */}
                {!isSubmitted && graduate.invitations.length === 0 && (
                  <form onSubmit={addGuest} className="space-y-4">
                    <h3 className="font-medium">Add Guest Information</h3>

                    <div className="space-y-2">
                      <Label htmlFor="guestName">Guest Full Name</Label>
                      <Input
                        id="guestName"
                        placeholder="Enter guest's full name"
                        value={guestInfo.fullName}
                        onChange={(e) =>
                          setGuestInfo({
                            ...guestInfo,
                            fullName: e.target.value,
                          })
                        }
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="guestId">Guest ID Number</Label>
                      <Input
                        id="guestId"
                        type="number"
                        placeholder="Enter guest's ID number"
                        value={guestInfo.idNumber}
                        onChange={(e) =>
                          setGuestInfo({
                            ...guestInfo,
                            idNumber: e.target.value,
                          })
                        }
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="guestPhone">Guest Phone Number</Label>
                      <Input
                        id="guestPhone"
                        placeholder="Enter guest's phone number"
                        value={guestInfo.phoneNumber}
                        onChange={(e) =>
                          setGuestInfo({
                            ...guestInfo,
                            phoneNumber: e.target.value,
                          })
                        }
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

                    <Button
                      type="submit"
                      className="w-full"
                      disabled={isGuestLoading}
                    >
                      {isGuestLoading ? (
                        <>
                          <LoadingSpinner size="sm" />
                          Adding new guest...
                        </>
                      ) : (
                        <>
                          <Mail className="mr-2 h-4 w-4" />
                          Add new guest
                        </>
                      )}
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
                    <h3 className="font-medium text-green-800 mb-2">
                      Invitation Generated Successfully!
                    </h3>
                    <p className="text-green-700">
                      Your invitation has been generated and sent to {email}.
                      You can also download it below.
                    </p>

                    <div className="mt-4 flex justify-center space-x-3">
                      <Button onClick={() => router.push(`/confirm-invitation/${graduate.regNumber}/download/multiple`)} className="cursor-pointer">
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

                <Button
                  variant="outline"
                  onClick={resetForm}
                  className="w-full"
                >
                  Verify Another Graduate
                </Button>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex flex-col items-start text-sm text-gray-500">
            <p>
              Need help? Contact the graduation committee at
              graduation@university.edu
            </p>
            <p>
              Please have your registration and identification numbers ready.
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
