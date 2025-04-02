import { getCertificates } from "@/actions/certificate-actions";
import CertificatesList from "@/components/dash/CertificatesList";
import { Metadata } from "next";

export const metadata = {
  title: "Certificates | DriversEd Admin",
  description: "Manage and view driver certificates",
};

export default async function CertificatesPage() {
  const { certificates, success, error } = await getCertificates();

  return (
    <div className="w-full max-w-full overflow-hidden">
      <div className="space-y-4 md:space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
            Certificates
          </h1>
          <p className="mt-1 text-sm text-muted-foreground md:text-base md:mt-2">
            Manage and view driver certificates
          </p>
        </div>

        {error ? (
          <div className="px-4 py-3 text-red-700 border border-red-200 rounded bg-red-50">
            {error}
          </div>
        ) : (
          <CertificatesList certificates={certificates || []} />
        )}
      </div>
    </div>
  );
}
