// app/verify/[id]/page.js
import { verifyCertificate } from "@/actions/certificate-actions";
import Certificate from "@/components/dash/Certificate";
import { CheckCircle2, XCircle } from "lucide-react";
import { notFound } from "next/navigation";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const { certificate, success } = await verifyCertificate(id);

  if (!success) {
    return {
      title: "Certificate Verification Failed | DriversEd",
    };
  }

  return {
    title: `Certificate Verification | DriversEd`,
  };
}

export default async function VerificationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const result = await verifyCertificate(id);

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

  // Format date to a human-readable format
  interface FormatDate {
    (dateInput: string | Date | null | undefined): string;
  }

  const formatDate: FormatDate = (dateInput) => {
    if (!dateInput) return "N/A";
    const date = dateInput instanceof Date ? dateInput : new Date(dateInput);
    return date.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  // Handle verification failure case
  if (!result.success) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen px-4 bg-gray-100">
        <div className="w-full max-w-md p-8 text-center bg-white rounded-lg shadow-md">
          <div className="flex justify-center mb-6">
            <div className="p-3 bg-red-100 rounded-full">
              <XCircle className="w-12 h-12 text-red-500" />
            </div>
          </div>
          <h1 className="mb-2 text-2xl font-bold">Certificate Not Found</h1>
          <p className="mb-6 text-gray-600">
            We couldn't verify the certificate with ID: {id}
          </p>
          <p className="text-sm text-gray-500">
            If you believe this is an error, please contact DriversEd support.
          </p>
        </div>
      </div>
    );
  }

  // Certificate was found in the database
  const { certificate, isValid } = result;
  const studentName = `${certificate?.name} ${certificate?.surname}`;

  return (
    <div className="min-h-screen">
      {/* Verification Banner */}
      {/* <div
        className={`mb-6 p-4 rounded-lg text-center ${
          isValid ? "bg-green-100" : "bg-amber-100"
        }`}
      >
        {isValid ? (
          <div className="flex flex-col items-center">
            <div className="flex items-center mb-2">
              <CheckCircle2 className="w-6 h-6 mr-2 text-green-600" />
              <span className="font-bold text-green-700">
                Valid Certificate
              </span>
            </div>
            <p className="text-sm text-green-700">
              This certificate has been verified as authentic and valid.
            </p>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <div className="flex items-center mb-2">
              <XCircle className="w-6 h-6 mr-2 text-amber-600" />
              <span className="font-bold text-amber-700">
                {!certificate?.isValid
                  ? "Invalid Certificate"
                  : "Expired Certificate"}
              </span>
            </div>
            <p className="text-sm text-amber-700">
              {!certificate?.isValid
                ? "This certificate has been revoked or marked as invalid."
                : "This certificate has expired."}
            </p>
          </div>
        )}
      </div> */}

      {/* Certificate Display */}
      <div className="max-w-[100%]">
        <h2 className="p-2 mb-4 text-xl font-bold text-center border-y sm:text-3xl bg-slate-100">
          DriversEd Certificate
        </h2>
        <Certificate
          studentName={studentName}
          licenseNumber={certificate?.licenseNumber ?? undefined}
          studentId={certificate?.certificateId}
          certificateId={certificate?.id}
          qrCodeValue={`${baseUrl}/certificates/verify/${certificate?.id}`}
          certificateType={certificate?.certificateType}
          result={certificate?.result}
          date={formatDate(certificate?.date)}
          city={certificate?.city}
          instructor={certificate?.instructor}
        />
      </div>

      {/* Simple Certificate Details */}
      {/* <div className="max-w-[90%] p-6 mx-auto bg-white rounded-lg shadow-md">
        <h2 className="pb-2 mb-4 text-lg font-bold border-b">
          Certificate Information
        </h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <p className="text-sm text-gray-500">Certificate ID</p>
            <p className="font-medium">{certificate?.certificateId}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Name</p>
            <p className="font-medium">{studentName}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Certificate Type</p>
            <p className="font-medium">{certificate?.certificateType}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Result</p>
            <p className="font-medium">{certificate?.result}%</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Issue Date</p>
            <p className="font-medium">{formatDate(certificate?.date)}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Expiry Date</p>
            <p className="font-medium">{formatDate(certificate?.expiryDate)}</p>
          </div>
        </div>

        <div className="pt-4 mt-6 text-sm text-center text-gray-500 border-t">
          <p>
            This certificate was issued by DriversEd Advanced Driver Training.
          </p>
          <p className="mt-1">
            For any questions regarding this certificate, please contact{" "}
            <a
              href="mailto:support@drivers-ed.africa"
              className="text-blue-600 hover:underline"
            >
              support@drivers-ed.africa
            </a>
          </p>
        </div>
      </div> */}
    </div>
  );
}
