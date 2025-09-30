"use client";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Download,
  ArrowLeft,
  User,
  Mail,
  Phone,
  Building,
  Briefcase,
  IdCard,
  Info,
  AlertCircle,
} from "lucide-react";
import { useApi } from "@/lib/hooks/api-hooks";
import { InvitationCard } from "@prisma/client";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { usePDF } from "@/lib/hooks/usePDF";
import { useEffect, useState } from "react";
// Status options
const invitationStatusOptions = [
  { value: "IDLE", label: "Idle" },
  { value: "GENERATED", label: "Generated" },
];

const approvalStatusOptions = [
  { value: "IDLE", label: "Idle" },
  { value: "PENDING", label: "Pending" },
  { value: "APPROVED", label: "Approved" },
  { value: "REJECTED", label: "Rejected" },
];

export default function DownloadInvitationPage() {
  const { useApiQuery } = useApi();
  const params = useParams();
  const router = useRouter();
  const [loadingButton, setLoadingButton] = useState('');
  const invitationId = params.id as string;
  const { modifyAndDownloadPDF, loading, error } = usePDF();
  // Get invitation data
  const { data: invitationData, isLoading: loadingInvitation } =
    useApiQuery<InvitationCard[]>(
      ["my-invitation"],
      `/my-invitation/${invitationId}/multiple`,
      {
        retry: false,
        refetchOnReconnect: false,
      }
    );


    const [invitation, setInvitation] = useState<InvitationCard | null>(null);
useEffect(()=>{
  if (invitationData && invitationData.length > 0){
    setInvitation(invitationData[0]);
  }
}, [invitationData])
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
              data: `${invitation.id}:${invitation.regNumber}`,
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

  // Handle print functionality
  if (loadingInvitation) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <LoadingSpinner size="lg" className="border-b-2 mx-auto" />
          <p className="mt-4 text-gray-600">Loading invitation data...</p>
        </div>
      </div>
    );
  }

  if (!invitation) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="h-12 w-12 text-red-500 mx-auto mb-4">❌</div>
          <h1 className="mt-4 text-2xl font-bold text-gray-900">
            Invitation Not Found
          </h1>
          <p className="mt-2 text-gray-600">
            The invitation with ID {invitationId} could not be found.
          </p>
          <Button className="mt-4" onClick={() => router.push("/")}>
            Return to Home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Download Invitation
          </h1>
          <p className="text-gray-600">Review and download your invitation</p>
        </div>

        {/* Invitation Summary Card */}
        <Card className="w-full mb-6">
  <CardHeader className="pb-4">
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div className="space-y-1">
        <CardTitle className="text-xl">Invitation Summary</CardTitle>
        <CardDescription>
          Review your invitation details before downloading
        </CardDescription>
      </div>
      <div className="flex items-center gap-2">
        <Badge
          variant={
            invitation.approval === "APPROVED"
              ? "default"
              : invitation.approval === "REJECTED"
              ? "destructive"
              : invitation.approval === "PENDING"
              ? "secondary"
              : "outline"
          }
          className="capitalize"
        >
          {
            approvalStatusOptions.find(
              (opt) => opt.value === invitation.approval
            )?.label
          }
        </Badge>
        <Badge
          variant={
            invitation.status === "IDLE"
              ? "default"
              : invitation.status === "GENERATED"
              ? "outline"
              : "secondary"
          }
          className="capitalize"
        >
          {
            invitationStatusOptions.find(
              (opt) => opt.value === invitation.status
            )?.label
          }
        </Badge>
      </div>
    </div>
  </CardHeader>

  {invitationData && invitationData.map((invitation, index) => (
    <div key={index} className={index > 0 ? "border-t" : ""}>
      <CardContent className="p-6">
        {/* Personal Information - Improved Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Left Column */}
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <User className="h-4 w-4" />
                  <span>Full Name</span>
                </div>
                <p className="font-semibold text-gray-900 text-base">
                  {invitation.fullName || "Not provided"}
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <IdCard className="h-4 w-4" />
                  {invitation.type === "STUDENT" ?  <span>REG NO</span> : <span>ID NUMBER</span>
                  }
                </div>
                <p className="font-semibold text-gray-900 text-base">
                  { invitation.type === "STUDENT" ? (invitation.regNumber || "Not provided") : (invitation.idNumber || "Not provided")}
                </p>
              </div>
            </div>
            {
              invitation.email&&
              <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Mail className="h-4 w-4" />
                <span>Email</span>
              </div>
              <p className="font-semibold text-gray-900 text-base break-all">
                {invitation.email || "Not provided"}
              </p>
            </div>
            }
            
          </div>

          {/* Right Column */}
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Briefcase className="h-4 w-4" />
                <span>Type</span>
              </div>
              <p className="font-semibold text-gray-900 text-base">
                {invitation.type || "Not provided"}
              </p>
            </div>

            {/* Add more fields here if needed */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center gap-2 text-sm text-blue-800">
                <Info className="h-4 w-4" />
                <span className="font-medium">Download Information</span>
              </div>
              <p className="text-sm text-blue-700 mt-1">
                Click the button below to download your invitation as a PDF document.
              </p>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
            <div className="flex items-center gap-2 text-red-800 text-sm">
              <AlertCircle className="h-4 w-4" />
              <span>Error: {error}</span>
            </div>
          </div>
        )}

        {/* Download Button */}
        <div className="border-t pt-6">
          <Button
            variant="default"
            onClick={() => handleDownload(invitation)}
            disabled={loading}
            className="w-full sm:w-auto min-w-[200px] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            size="lg"
          >
            {loading && loadingButton === invitation.id ? (
              <div className="flex items-center gap-2">
                <LoadingSpinner size="sm" />
                Preparing Download...
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Download className="h-5 w-5" />
                Download Invitation (PDF)
              </div>
            )}
          </Button>
        </div>
      </CardContent>
    </div>
  ))}

  <CardFooter className="flex flex-col sm:flex-row gap-3 justify-between border-t pt-6">
    <Button
      variant="outline"
      onClick={() => router.push("/")}
      className="flex items-center gap-2 w-full sm:w-auto"
    >
      <ArrowLeft className="h-4 w-4" />
      Back to Dashboard
    </Button>
    
    {/* Uncomment if needed
    <Button 
      variant="secondary" 
      onClick={() => router.push(`/confirm-invitation/${invitationId}`)}
      className="w-full sm:w-auto"
    >
      Edit Invitation Details
    </Button>
    */}
  </CardFooter>
</Card>

        {/* Download Instructions */}
        <Card>
          <CardHeader>
            <CardTitle>Download Instructions</CardTitle>
            <CardDescription>
              How to download and use your invitation
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600 mb-2">1</div>
                <h3 className="font-semibold mb-2">Ensure Approval</h3>
                <p className="text-sm text-gray-600">
                  Make sure your invitation has been approved before downloading
                </p>
              </div>
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600 mb-2">2</div>
                <h3 className="font-semibold mb-2">Download</h3>
                <p className="text-sm text-gray-600">
                  Click the download button to get your invitation PDF
                </p>
              </div>
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600 mb-2">3</div>
                <h3 className="font-semibold mb-2">Print & Use</h3>
                <p className="text-sm text-gray-600">
                  Print the invitation and present it at the event
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
