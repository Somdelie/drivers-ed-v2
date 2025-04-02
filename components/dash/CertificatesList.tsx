"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import {
  Eye,
  Pencil,
  Trash2,
  Download,
  AlertCircle,
  MoreHorizontal,
} from "lucide-react";
import { deleteCertificate } from "@/actions/certificate-actions";
import CreateDialog from "./CreateDialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Define the Certificate type
interface Certificate {
  id: string;
  certificateId: string;
  name: string;
  surname: string;
  certificateType: string;
  result: string;
  date: Date | string;
  expiryDate?: Date | string | null;
  city: string;
  instructor: string;
  isValid: boolean;
  createdAt: Date | string;
  updatedAt: Date | string;
}

interface CertificatesListProps {
  certificates: Certificate[];
}

export default function CertificatesList({
  certificates,
}: CertificatesListProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const [certificateToDelete, setCertificateToDelete] =
    useState<Certificate | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const formatDate = (dateString: Date | string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const handleDelete = async (): Promise<void> => {
    if (!certificateToDelete) return;

    setIsDeleting(true);
    try {
      const response = await deleteCertificate(certificateToDelete.id);

      if (response.success) {
        toast.success("Certificate deleted successfully", {
          position: "top-right",
          duration: 3000,
          style: {
            backgroundColor: "green",
            color: "white",
          },
        });
        router.refresh();
      } else {
        throw new Error(response.error || "Failed to delete certificate");
      }
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to delete certificate",
        {
          position: "top-right",
          duration: 3000,
          style: {
            backgroundColor: "red",
            color: "white",
          },
        }
      );
    } finally {
      setIsDeleting(false);
      setCertificateToDelete(null);
      setIsDeleteDialogOpen(false);
    }
  };

  const openDeleteDialog = (certificate: Certificate): void => {
    setCertificateToDelete(certificate);
    setIsDeleteDialogOpen(true);
  };

  const isExpired = (certificate: Certificate): boolean => {
    if (!certificate.expiryDate) return false;
    return new Date() > new Date(certificate.expiryDate);
  };

  // Card view for mobile
  const MobileCardView = () => (
    <div className="grid grid-cols-1 gap-4">
      {certificates.map((certificate) => (
        <Card key={certificate.id} className="overflow-hidden">
          <CardContent className="p-4">
            <div className="flex items-start justify-between mb-2">
              <div>
                <h3 className="font-medium">
                  {certificate.name} {certificate.surname}
                </h3>
                <p className="text-sm text-muted-foreground">
                  ID: {certificate.certificateId}
                </p>
              </div>
              {/* Status indicator */}
              <div>
                {!certificate.isValid ? (
                  <span className="inline-flex items-center px-2 py-1 text-xs font-medium text-red-800 bg-red-100 rounded-full">
                    <AlertCircle className="w-3 h-3 mr-1" /> Invalid
                  </span>
                ) : isExpired(certificate) ? (
                  <span className="inline-flex items-center px-2 py-1 text-xs font-medium rounded-full bg-amber-100 text-amber-800">
                    <AlertCircle className="w-3 h-3 mr-1" /> Expired
                  </span>
                ) : (
                  <span className="inline-flex items-center px-2 py-1 text-xs font-medium text-green-800 bg-green-100 rounded-full">
                    Valid
                  </span>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 mb-3 text-sm">
              <div>
                <p className="text-muted-foreground">Type</p>
                <p className="truncate">{certificate.certificateType}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Result</p>
                <p>{certificate.result}%</p>
              </div>
              <div>
                <p className="text-muted-foreground">Date</p>
                <p>{formatDate(certificate.date)}</p>
              </div>
            </div>

            <div className="flex justify-between mt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  router.push(`/certificates/verify/${certificate.id}`)
                }
              >
                <Eye className="w-4 h-4 mr-1" /> View
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    <MoreHorizontal className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    onClick={() =>
                      router.push(`/certificates/${certificate.id}/edit`)
                    }
                  >
                    <Pencil className="w-4 h-4 mr-2" /> Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() =>
                      router.push(`/certificates/${certificate.id}/download`)
                    }
                  >
                    <Download className="w-4 h-4 mr-2" /> Download
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => openDeleteDialog(certificate)}
                    className="text-red-600"
                  >
                    <Trash2 className="w-4 h-4 mr-2" /> Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Certificates</CardTitle>
        <CreateDialog />
      </CardHeader>
      <CardContent>
        {certificates.length === 0 ? (
          <div className="py-10 text-center">
            <p className="text-muted-foreground">
              No certificates found. Create your first certificate.
            </p>
          </div>
        ) : (
          <>
            {/* Mobile view */}
            <div className="md:hidden">
              <MobileCardView />
            </div>

            {/* Desktop view */}
            <div className="hidden overflow-x-auto md:block">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Certificate Type</TableHead>
                    <TableHead>Result</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {certificates.map((certificate) => (
                    <TableRow key={certificate.id}>
                      <TableCell className="font-medium">
                        {certificate.certificateId}
                      </TableCell>
                      <TableCell>
                        {certificate.name} {certificate.surname}
                      </TableCell>
                      <TableCell>{certificate.certificateType}</TableCell>
                      <TableCell>{certificate.result}%</TableCell>
                      <TableCell>{formatDate(certificate.date)}</TableCell>
                      <TableCell>
                        {!certificate.isValid ? (
                          <span className="flex items-center gap-1 text-red-500">
                            <AlertCircle className="w-4 h-4" /> Invalid
                          </span>
                        ) : isExpired(certificate) ? (
                          <span className="flex items-center gap-1 text-amber-500">
                            <AlertCircle className="w-4 h-4" /> Expired
                          </span>
                        ) : (
                          <span className="text-green-500">Valid</span>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() =>
                              router.push(
                                `/certificates/verify/${certificate.id}`
                              )
                            }
                            title="View Certificate"
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() =>
                              router.push(
                                `/certificates/${certificate.id}/edit`
                              )
                            }
                            title="Edit Certificate"
                          >
                            <Pencil className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() =>
                              router.push(
                                `/certificates/${certificate.id}/download`
                              )
                            }
                            title="Download Certificate"
                          >
                            <Download className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => openDeleteDialog(certificate)}
                            title="Delete Certificate"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </>
        )}

        {/* Delete confirmation dialog */}
        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Are you sure?</DialogTitle>
              <DialogDescription>
                This action cannot be undone. This will permanently delete the
                certificate for
                <span className="font-bold">
                  {" "}
                  {certificateToDelete?.name} {certificateToDelete?.surname}
                </span>
                .
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="flex flex-col gap-2 sm:flex-row">
              <Button
                variant="outline"
                onClick={() => setIsDeleteDialogOpen(false)}
                disabled={isDeleting}
                className="w-full sm:w-auto"
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleDelete}
                disabled={isDeleting}
                className="w-full sm:w-auto"
              >
                {isDeleting ? "Deleting..." : "Delete"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}
