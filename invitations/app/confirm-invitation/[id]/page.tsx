"use client";

import { useState, useEffect } from "react";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, Save } from "lucide-react";
import { useApi } from "@/lib/hooks/api-hooks";
import { InvitationCard } from "@prisma/client";
import { useFormik } from "formik";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { toast } from "sonner";
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

export default function ConfirmInvitationPage() {
  const { useApiQuery, useApiPut, queryClient } = useApi();
  const params = useParams();
  const router = useRouter();
  const [saveMessage, setSaveMessage] = useState("");
  const [saveError, setSaveError] = useState("");
  const invitationId = parseInt(params.id as string);

  // Get invitation ID from URL
  const { data: invitation, isLoading: loadingInvitation } =
    useApiQuery<InvitationCard>(
      ["my-invitation"],
      "/my-invitation/" + invitationId,
      {
        retry: false,
        refetchOnReconnect: false,
      }
    );
  // Fetch invitation data based on ID

  // Handle form changes
  const { mutateAsync: updateInvitation, isPending: updatingInvitation } =
    useApiPut(["update-invitation"], "/update-invitation/" + invitationId);
  const { mutateAsync: approveInvitation, isPending: approvingInvitation } =
    useApiPut(["approve-invitation"], "/approve-invitation/" + invitationId);
  const updateForm = useFormik({
    enableReinitialize: true,
    initialValues: {
      fullName: invitation?.fullName || "",
      email: invitation?.email || "",
      phoneNumber: invitation?.phoneNumber || "",
      origanization: invitation?.origanization || "",
      position: invitation?.position || "",
      idNumber: invitation?.idNumber || "",
    },
    onSubmit: async (values) => {
      console.log(values);
      await updateInvitation(values)
        .then((response) => {
          setSaveError("");
          setSaveMessage("Changes saved successfully!");
        })
        .catch((error) => {
          setSaveMessage("");
          setSaveError("An error occurred while saving changes.");
        });
    },
  });
  // Handle form submission

  if (loadingInvitation) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          {/* <div className="animate-spin rounded-full h-12 w-12 "></div> */}
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
          <XCircle className="h-12 w-12 text-red-500 mx-auto" />
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
            Invitation Approval
          </h1>
          <p className="text-gray-600">
            Review and approve invitation 
          </p>
        </div>

        <Card className="w-full mb-6">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle>Invitation Details</CardTitle>
                <CardDescription>
                  Review and update invitation information
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
          <CardContent>
            <form onSubmit={updateForm.handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Left Column */}
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input
                      id="fullName"
                      name="fullName"
                      value={updateForm.values.fullName}
                      onChange={updateForm.handleChange}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="position">Position</Label>
                    <Input
                      id="position"
                      name="fullName"
                      value={updateForm.values.position || ""}
                      onChange={updateForm.handleChange}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      name="email"
                      value={updateForm.values.email || ""}
                      onChange={updateForm.handleChange}
                    />
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="idNumber">ID Number</Label>
                    <Input
                      id="idNumber"
                      name="idNumber"
                      type="number"
                      value={updateForm.values.idNumber || ""}
                      onChange={updateForm.handleChange}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="organization">Organization</Label>
                    <Input
                      id="organization"
                      name="origanization"
                      value={updateForm.values.origanization || ""}
                      onChange={updateForm.handleChange}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phoneNumber">Phone Number</Label>
                    <Input
                      id="phoneNumber"
                      value={updateForm.values.phoneNumber || ""}
                      onChange={updateForm.handleChange}
                    />
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t">
                <Button
                  type="submit"
                  disabled={updatingInvitation}
                  className="flex-1"
                >
                  {updatingInvitation ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Save Changes
                    </>
                  )}
                </Button>

                <Button
                  type="button"
                  variant="default"
                  onClick={async () => {
                    await approveInvitation({ approval: "APPROVED" }).then(
                      () => {
                        setSaveMessage("Invitation approved successfully");
                        toast.success("Invitation approved successfully", {
                          style: {
                            background: "green",
                            color: "white",
                          },
                        });
                        queryClient.invalidateQueries({
                          queryKey: ["my-invitation"],
                        });
                      }
                    );
                  }}
                  disabled={
                    approvingInvitation || invitation.approval === "APPROVED"
                  }
                  className="flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {approvingInvitation ? (
                    <>
                      <LoadingSpinner size="sm" />
                      Approving ...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="mr-2 h-4 w-4" />
                      Approve Invitation
                    </>
                  )}
                </Button>
                <Button
                  type="button"
                  variant="destructive"
                  onClick={async () => {
                    await approveInvitation({ approval: "REJECTED" }).then(
                      () => {
                        setSaveMessage("Invitation rejected successfully");
                        toast.info("Invitation rejected successfully", {
                          style: {
                            background: "red",
                            color: "white",
                          },
                        });
                        queryClient.invalidateQueries({
                          queryKey: ["my-invitation"],
                        });
                      }
                    );
                  }}
                  disabled={
                    approvingInvitation || invitation.approval === "REJECTED"
                  }
                  className="flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {approvingInvitation ? (
                    <>
                      <LoadingSpinner size="sm" />
                      Rejecting Invitation
                    </>
                  ) : (
                    <>
                      <XCircle className="mr-2 h-4 w-4" />
                      Reject Invitation
                    </>
                  )}
                </Button>
              </div>

              {/* Save Message */}
              {saveMessage && (
                <div className="p-3 bg-green-50 text-green-700 rounded-md text-sm">
                  {saveMessage}
                </div>
              )}

              {/* Save Error */}
              {saveError && (
                <div className="p-3 bg-red-50 text-red-700 rounded-md text-sm">
                  {saveError}
                </div>
              )}
            </form>
          </CardContent>
          {/* <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={() => router.push("/")}>
              Back to Dashboard
            </Button>
            <Button variant="secondary">
              <Download className="mr-2 h-4 w-4" />
              Download Invitation
            </Button>
          </CardFooter> */}
        </Card>

        {/* Image Preview */}
        {/* {invitation.image && (
          <Card>
            <CardHeader>
              <CardTitle>Invitation Image</CardTitle>
              <CardDescription>
                Preview of the invitation image
              </CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center">
              <div className="border rounded-md p-4">
                <img 
                  src={invitation.image} 
                  alt="Invitation" 
                  className="max-w-full h-auto max-h-64 object-contain"
                />
              </div>
            </CardContent>
          </Card>
        )} */}
      </div>
    </div>
  );
}
