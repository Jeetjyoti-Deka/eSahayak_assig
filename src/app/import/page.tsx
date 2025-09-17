"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { FileUpload } from "@/components/file-upload";
import { ValidationErrorsTable } from "@/components/import-errors-table";
// import { importLeadsFromCSV } from "@/lib/actions";
import Papa from "papaparse";
import { useRouter } from "next/navigation";
import { useUser } from "@/context/user-context";
import { useFetchApi } from "@/hooks/use-fetch";
import { toast } from "sonner";

interface ValidationError {
  row: number;
  message: string;
}

export default function ImportPage() {
  const [isUploading, setIsUploading] = useState(false);
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>(
    []
  );
  const [uploadComplete, setUploadComplete] = useState(false);
  const [successCount, setSuccessCount] = useState(0);

  const router = useRouter();
  const { user, loading: userLoading } = useUser();

  const fetchApi = useFetchApi();

  useEffect(() => {
    if (userLoading) return;
    if (!user) {
      router.push("/");
      toast.warning("Please sign in to access the page.");
    }
  }, [userLoading]);

  if (userLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-4 h-4 animate-spin" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const handleFileUpload = async (file: File) => {
    setIsUploading(true);
    setValidationErrors([]);
    setUploadComplete(false);

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: async (results) => {
        const rows = results.data as any[];
        if (rows.length > 200) {
          setValidationErrors([{ row: 0, message: "Max 200 rows allowed" }]);
          setIsUploading(false);
          return;
        }

        const res = await fetchApi("/api/buyers/import", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(rows),
        });

        if (!res) {
          setIsUploading(false);
          return;
        }

        const json = await res.json();

        setSuccessCount(json.insertedCount);
        setValidationErrors(json.errors);

        setIsUploading(false);
        setUploadComplete(true);
      },
    });
  };

  const handleReset = () => {
    setValidationErrors([]);
    setUploadComplete(false);
    setSuccessCount(0);
  };

  return (
    <div className="container mx-auto py-8 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/buyers">
          <Button variant="outline" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Leads
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold">Import Leads</h1>
          <p className="text-muted-foreground">
            Upload a CSV file to import leads into your system
          </p>
        </div>
      </div>

      {/* Upload Section */}
      <Card>
        <CardHeader>
          <CardTitle>Upload CSV File</CardTitle>
        </CardHeader>
        <CardContent>
          <FileUpload
            onFileUpload={handleFileUpload}
            isUploading={isUploading}
            disabled={isUploading}
          />

          {uploadComplete && (
            <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-green-800 font-medium">
                Upload completed successfully! {successCount} leads were
                imported.
              </p>
              {validationErrors.length > 0 && (
                <p className="text-green-700 text-sm mt-1">
                  {validationErrors.length} rows had validation errors (see
                  below).
                </p>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Validation Errors */}
      {validationErrors.length > 0 && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-red-600">Validation Errors</CardTitle>
              <p className="text-sm text-muted-foreground">
                {validationErrors.length} error
                {validationErrors.length !== 1 ? "s" : ""} found during import
              </p>
            </div>
            <Button variant="outline" size="sm" onClick={handleReset}>
              Upload New File
            </Button>
          </CardHeader>
          <CardContent>
            <ValidationErrorsTable errors={validationErrors} />
          </CardContent>
        </Card>
      )}

      {/* Instructions */}
      <Card>
        <CardHeader>
          <CardTitle>CSV Format Requirements</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-medium mb-2">Required Columns:</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>
                • <strong>Name</strong> - Full name of the lead
              </li>
              <li>
                • <strong>Phone</strong> - Contact phone number
              </li>
              <li>
                • <strong>Email</strong> - Email address
              </li>
              <li>
                • <strong>City</strong> - City location
              </li>
              <li>
                • <strong>Property Type</strong> - Type of property (Apartment,
                House, Commercial, Land)
              </li>
              <li>
                • <strong>Budget Min</strong> - Minimum budget (number)
              </li>
              <li>
                • <strong>Budget Max</strong> - Maximum budget (number)
              </li>
              <li>
                • <strong>Timeline</strong> - Purchase timeline (Immediate, 1-3
                months, 3-6 months, 6+ months)
              </li>
              <li>
                • <strong>Status</strong> - Lead status (New, Contacted,
                Qualified, Converted, Lost)
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium mb-2">Notes:</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• The first row should contain column headers</li>
              <li>• All fields are required for each row</li>
              <li>• Email addresses must be valid</li>
              <li>• Budget values must be numbers</li>
              <li>• Property Type and Status must match the allowed values</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
