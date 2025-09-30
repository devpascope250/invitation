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
} from "lucide-react";
import { useApi } from "@/lib/hooks/api-hooks";
import { InvitationCard } from "@prisma/client";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { usePDF } from "@/lib/hooks/usePDF";
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
  const invitationId = params.id as string;
  const { modifyAndDownloadPDF, loading, error } = usePDF();
  // Get invitation data
  const { data: invitation, isLoading: loadingInvitation } =
    useApiQuery<InvitationCard>(
      ["my-invitation"],
      "/my-invitation/" + invitationId,
      {
        retry: false,
        refetchOnReconnect: false,
      }
    );

  const handleDownload = async () => {
    if (!invitation) return;

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

      setTimeout(() => {
        router.push(`/download-thank-you`);
      }, 1500);
    } catch (err) {
      console.error("Failed to generate PDF:", err);
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
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle>Invitation Summary</CardTitle>
                <CardDescription>
                  Review your invitation details before downloading
                </CardDescription>
              </div>
              <div className="flex items-center space-x-2">
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
          <CardContent className="space-y-6">
            {/* Personal Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <User className="h-5 w-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      Full Name
                    </p>
                    <p className="text-lg font-semibold text-gray-900">
                      {invitation.fullName || "Not provided"}
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Briefcase className="h-5 w-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      Position
                    </p>
                    <p className="text-lg font-semibold text-gray-900">
                      {invitation.position || "Not provided"}
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Mail className="h-5 w-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-500">Email</p>
                    <p className="text-lg font-semibold text-gray-900">
                      {invitation.email || "Not provided"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <IdCard className="h-5 w-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      ID Number
                    </p>
                    <p className="text-lg font-semibold text-gray-900">
                      {invitation.idNumber || "Not provided"}
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Building className="h-5 w-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      Organization
                    </p>
                    <p className="text-lg font-semibold text-gray-900">
                      {invitation.origanization || "Not provided"}
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Phone className="h-5 w-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      Phone Number
                    </p>
                    <p className="text-lg font-semibold text-gray-900">
                      {invitation.phoneNumber || "Not provided"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Download Restrictions Notice */}
            {invitation.approval !== "APPROVED" && (
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="h-5 w-5 text-yellow-400">⚠️</div>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-yellow-800">
                      {invitation.approval === "PENDING"
                        ? "Pending Approval"
                        : invitation.approval === "REJECTED"
                        ? "Invitation Rejected"
                        : "Approval Required"}
                    </h3>
                    <p className="text-sm text-yellow-700 mt-1">
                      {invitation.approval === "PENDING"
                        ? "Your invitation is awaiting approval. You will be able to download it once approved."
                        : invitation.approval === "REJECTED"
                        ? "This invitation has been rejected and cannot be downloaded. Please contact support for more information."
                        : "This invitation requires approval before it can be downloaded."}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {error && (
              <div className="text-red-500 mt-2 text-sm">Error: {error}</div>
            )}

            {/* Download Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t">
              <Button
                variant="default"
                onClick={handleDownload}
                disabled={loading || invitation.approval !== "APPROVED"}
                className="flex-1 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                size="lg"
              >
                {loading ? (
                  <>
                    <LoadingSpinner size="sm" />
                    Preparing Download...
                  </>
                ) : (
                  <>
                    <Download className="mr-2 h-5 w-5" />
                    Download Invitation (PDF)
                  </>
                )}
              </Button>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between border-t pt-6">
            <Button
              variant="outline"
              onClick={() => router.push("/")}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </Button>
            {/*             
            <Button 
              variant="secondary" 
              onClick={() => router.push(`/confirm-invitation/${invitationId}`)}
            >
              Edit Invitation Details
            </Button> */}
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
