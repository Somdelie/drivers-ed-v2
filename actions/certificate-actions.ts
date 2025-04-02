"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

// Define TypeScript interfaces for our data
interface CertificateFormData {
  name?: string;
  surname?: string;
  certificateType?: string;
  marks?: string;
  result?: string;
  date?: string;
  city?: string;
  instructor?: string;
  isValid?: boolean;
  studentName?: string; // For backward compatibility
}

interface Certificate {
  id: string;
  certificateId: string;
  name: string;
  surname: string;
  certificateType: string;
  result: string;
  date: Date;
  expiryDate?: Date | null;
  city: string;
  instructor: string;
  isValid: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface ActionResponse {
  success: boolean;
  certificate?: Certificate;
  certificates?: Certificate[];
  isValid?: boolean;
  error?: string;
}

interface DashboardStats {
  totalCertificates: number;
  validCertificates: number;
  invalidCertificates: number;
  expiringCertificates: number;
  averageScore: number;
  recentCertificates: {
    name: string;
    surname: string;
    result: string;
    date: string;
  }[];
  monthlyStats: {
    month: string;
    count: number;
  }[];
}

/**
 * Create a new certificate
 */
export async function createCertificate(
  formData: CertificateFormData
): Promise<ActionResponse> {
  try {
    // Generate a unique certificate ID
    const certificateId = generateCertificateId();

    // Calculate expiry date (12 months from issue date)
    const date = new Date();
    const expiryDate = new Date(date);
    expiryDate.setFullYear(expiryDate.getFullYear() + 1);

    // Create certificate in database
    const certificate = await db.certificate.create({
      data: {
        certificateId,
        name: formData.name || "",
        surname: formData.surname || "",
        certificateType: formData.certificateType || "Driver Risk Assessment",
        result: formData.marks || formData.result || "",
        date,
        expiryDate,
        city: formData.city || "",
        instructor: formData.instructor || "Cautious",
        isValid: true,
      },
    });

    revalidatePath("/certificates");

    return { success: true, certificate };
  } catch (error) {
    console.error("Failed to create certificate:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to create certificate",
    };
  }
}

/**
 * Get all certificates
 */
export async function getCertificates(): Promise<ActionResponse> {
  try {
    const certificates = await db.certificate.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    return { success: true, certificates };
  } catch (error) {
    console.error("Failed to fetch certificates:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to fetch certificates",
    };
  }
}

/**
 * Get a certificate by ID
 */
export async function getCertificateById(id: string): Promise<ActionResponse> {
  try {
    const certificate = await db.certificate.findUnique({
      where: { id },
    });

    if (!certificate) {
      return {
        success: false,
        error: "Certificate not found",
      };
    }

    return { success: true, certificate };
  } catch (error) {
    console.error("Failed to fetch certificate:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to fetch certificate",
    };
  }
}

/**
 * Verify a certificate by ID
 */
export async function verifyCertificate(id: string): Promise<ActionResponse> {
  try {
    const certificate = await db.certificate.findUnique({
      where: { id },
    });

    if (!certificate) {
      return {
        success: false,
        error: "Certificate not found",
      };
    }

    // Check if certificate is valid and not expired
    const isExpired =
      certificate.expiryDate && new Date() > certificate.expiryDate;

    return {
      success: true,
      certificate,
      isValid: certificate.isValid && !isExpired,
    };
  } catch (error) {
    console.error("Failed to verify certificate:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to verify certificate",
    };
  }
}

/**
 * Update a certificate
 */
export async function updateCertificate(
  id: string,
  formData: CertificateFormData
): Promise<ActionResponse> {
  try {
    // Parse date if provided
    let date: Date | undefined = undefined;
    if (formData.date) {
      date = new Date(formData.date);
    }

    // Calculate new expiry date if date is updated
    let expiryDate: Date | undefined = undefined;
    if (date) {
      expiryDate = new Date(date);
      expiryDate.setFullYear(expiryDate.getFullYear() + 1);
    }

    // Get existing data to avoid overwriting fields
    const existingCertificate = await db.certificate.findUnique({
      where: { id },
    });

    if (!existingCertificate) {
      return {
        success: false,
        error: "Certificate not found",
      };
    }

    // Update certificate
    const certificate = await db.certificate.update({
      where: { id },
      data: {
        name: formData.name || existingCertificate.name,
        surname: formData.surname || existingCertificate.surname,
        certificateType:
          formData.certificateType || existingCertificate.certificateType,
        result: formData.result || existingCertificate.result,
        ...(date && { date }),
        ...(expiryDate && { expiryDate }),
        city: formData.city || existingCertificate.city,
        instructor: formData.instructor || existingCertificate.instructor,
        isValid:
          formData.isValid !== undefined
            ? formData.isValid
            : existingCertificate.isValid,
      },
    });

    revalidatePath("/certificates");

    return { success: true, certificate };
  } catch (error) {
    console.error("Failed to update certificate:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to update certificate",
    };
  }
}

/**
 * Delete a certificate
 */
export async function deleteCertificate(id: string) {
  try {
    await db.certificate.delete({
      where: { id },
    });

    revalidatePath("dashboard/certificates");
    revalidatePath("/certificates");

    return { success: true };
  } catch (error) {
    console.error("Failed to delete certificate:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to delete certificate",
    };
  }
}

/**
 * Utility function to generate a unique certificate ID
 */
function generateCertificateId(): string {
  // Get first 8 digits - can use timestamp or other method
  const firstPart = Math.floor(10000000 + Math.random() * 90000000).toString();

  // Get the middle character - use A-Z (could also include 0-9 if needed)
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  const middleChar = characters.charAt(
    Math.floor(Math.random() * characters.length)
  );

  // Get last 4 digits
  const lastPart = Math.floor(1000 + Math.random() * 9000).toString();

  // Combine all parts to form the 13-character ID
  return `${firstPart}${middleChar}${lastPart}`;
}

export async function getDashboardStats(): Promise<DashboardStats> {
  try {
    // Get total certificates count
    const totalCertificates = await db.certificate.count();

    // Get valid certificates count
    const validCertificates = await db.certificate.count({
      where: {
        isValid: true,
        OR: [{ expiryDate: null }, { expiryDate: { gt: new Date() } }],
      },
    });

    // Get invalid certificates count
    const invalidCertificates = await db.certificate.count({
      where: {
        OR: [
          { isValid: false },
          {
            isValid: true,
            expiryDate: { lt: new Date() },
          },
        ],
      },
    });

    // Get expiring soon (next 30 days) certificates count
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);

    const expiringCertificates = await db.certificate.count({
      where: {
        isValid: true,
        expiryDate: {
          gt: new Date(),
          lt: thirtyDaysFromNow,
        },
      },
    });

    // Get average score
    const certificates = await db.certificate.findMany({
      select: {
        result: true,
      },
    });

    const totalScore = certificates.reduce((acc, cert) => {
      const score = parseFloat(cert.result);
      return acc + (isNaN(score) ? 0 : score);
    }, 0);

    const averageScore = totalScore / (certificates.length || 1);

    // Get recent certificates
    const recentCertificates = await db.certificate.findMany({
      select: {
        name: true,
        surname: true,
        result: true,
        date: true,
      },
      orderBy: {
        date: "desc",
      },
      take: 3,
    });

    // Format recent certificates for display
    const formattedRecentCertificates = recentCertificates.map((cert) => ({
      name: cert.name,
      surname: cert.surname,
      result: cert.result,
      date: cert.date.toISOString(),
    }));

    // Generate monthly statistics
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    // Get certificates for the last 3 months
    const monthlyStats = [];
    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    for (let i = 2; i >= 0; i--) {
      const month = (currentMonth - i + 12) % 12; // Handle wrapping around to previous year
      const year = currentMonth - i < 0 ? currentYear - 1 : currentYear;

      const startDate = new Date(year, month, 1);
      const endDate = new Date(year, month + 1, 0); // Last day of month

      const count = await db.certificate.count({
        where: {
          date: {
            gte: startDate,
            lte: endDate,
          },
        },
      });

      monthlyStats.push({
        month: monthNames[month],
        count,
      });
    }

    return {
      totalCertificates,
      validCertificates,
      invalidCertificates,
      expiringCertificates,
      averageScore,
      recentCertificates: formattedRecentCertificates,
      monthlyStats,
    };
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);

    // Return fallback data in case of error
    return {
      totalCertificates: 0,
      validCertificates: 0,
      invalidCertificates: 0,
      expiringCertificates: 0,
      averageScore: 0,
      recentCertificates: [],
      monthlyStats: [
        { month: "Jan", count: 0 },
        { month: "Feb", count: 0 },
        { month: "Mar", count: 0 },
      ],
    };
  }
}
