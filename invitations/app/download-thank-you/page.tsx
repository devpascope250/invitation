"use client";

// import { useRouter } from "next/navigation";
// import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CheckCircle, Download, Mail, Calendar } from "lucide-react";

export default function DownloadThankYouPage() {


  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        {/* Success Icon and Title */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="absolute inset-0 bg-green-200 rounded-full animate-ping"></div>
              <CheckCircle className="h-20 w-20 text-green-600 relative z-10" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Download Complete!
          </h1>
          <p className="text-xl text-gray-600 max-w-md mx-auto">
            Your invitation has been successfully downloaded. Thank you for using our service!
          </p>
        </div>

        {/* Main Thank You Card */}
        <Card className="w-full mb-8 shadow-lg border-0">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-2xl text-gray-900">
              What`s Next?
            </CardTitle>
            <CardDescription className="text-lg">
              Here are the next steps for your event
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Steps */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-100">
                <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Download className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Step 1</h3>
                <p className="text-sm text-gray-600">
                  Save your downloaded invitation in a safe location
                </p>
              </div>

              <div className="text-center p-4 bg-green-50 rounded-lg border border-green-100">
                <div className="bg-green-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Mail className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Step 2</h3>
                <p className="text-sm text-gray-600">
                  Print the invitation or keep it ready on your mobile device
                </p>
              </div>

              <div className="text-center p-4 bg-purple-50 rounded-lg border border-purple-100">
                <div className="bg-purple-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Calendar className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Step 3</h3>
                <p className="text-sm text-gray-600">
                  Present your invitation at the event venue
                </p>
              </div>
            </div>

            {/* Important Notes */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h4 className="font-semibold text-yellow-800 mb-2 flex items-center">
                <span className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></span>
                Important Notes
              </h4>
              <ul className="text-sm text-yellow-700 space-y-1">
                <li>• Keep your invitation secure and do not share it with others</li>
                <li>• Bring a valid ID along with your invitation to the event</li>
                <li>• The invitation is valid only for the person named on it</li>
                <li>• Contact support if you encounter any issues</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Additional Information Card */}
        <Card className="w-full mb-8 shadow-sm border border-gray-200">
          <CardHeader>
            <CardTitle className="text-lg text-gray-900">
              Need Help?
            </CardTitle>
            <CardDescription>
              We`re here to assist you with any questions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-gray-600">Event Support</span>
                <span className="font-semibold text-gray-900">support@example.com</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-gray-600">Phone</span>
                <span className="font-semibold text-gray-900">+1 (555) 123-4567</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-gray-600">Office Hours</span>
                <span className="font-semibold text-gray-900">Mon-Fri, 9AM-5PM</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        {/* <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            onClick={() => router.push("/")}
            className="flex items-center gap-2 px-8 py-3 text-lg"
            size="lg"
          >
            <Home className="h-5 w-5" />
            Return to Dashboard
          </Button>
          
          <Button
            onClick={() => router.push("/my-invitations")}
            variant="outline"
            className="flex items-center gap-2 px-8 py-3 text-lg"
            size="lg"
          >
            <Download className="h-5 w-5" />
            Download Another
          </Button>
        </div> */}

        {/* Footer Note */}
        <div className="text-center mt-8">
          <p className="text-gray-500 text-sm">
            Thank you for choosing our service. We look forward to seeing you at the event!
          </p>
        </div>
      </div>
    </div>
  );
}