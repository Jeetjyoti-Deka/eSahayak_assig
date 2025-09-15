"use client";

import type React from "react";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Upload, File, X, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface FileUploadProps {
  onFileUpload: (file: File) => void;
  isUploading?: boolean;
  disabled?: boolean;
}

export function FileUpload({
  onFileUpload,
  isUploading = false,
  disabled = false,
}: FileUploadProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (!disabled) {
      setIsDragOver(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);

    if (disabled) return;

    const files = Array.from(e.dataTransfer.files);
    const csvFile = files.find(
      (file) => file.type === "text/csv" || file.name.endsWith(".csv")
    );

    if (csvFile) {
      setSelectedFile(csvFile);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && (file.type === "text/csv" || file.name.endsWith(".csv"))) {
      setSelectedFile(file);
    }
  };

  const handleUpload = () => {
    if (selectedFile && !isUploading) {
      onFileUpload(selectedFile);
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleClick = () => {
    if (!disabled) {
      fileInputRef.current?.click();
    }
  };

  return (
    <div className="space-y-4">
      {/* Drop Zone */}
      <div
        className={cn(
          "border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer",
          isDragOver && !disabled
            ? "border-primary bg-primary/5"
            : "border-muted-foreground/25 hover:border-muted-foreground/50",
          disabled && "opacity-50 cursor-not-allowed"
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleClick}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".csv"
          onChange={handleFileSelect}
          className="hidden"
          disabled={disabled}
        />

        <div className="flex flex-col items-center gap-4">
          <div className="p-3 bg-muted rounded-full">
            <Upload className="h-6 w-6 text-muted-foreground" />
          </div>

          <div className="space-y-2">
            <p className="text-lg font-medium">
              {isDragOver
                ? "Drop your CSV file here"
                : "Drag and drop your CSV file"}
            </p>
            <p className="text-sm text-muted-foreground">
              or click to browse and select a file
            </p>
          </div>

          <Button variant="outline" type="button" disabled={disabled}>
            Choose File
          </Button>
        </div>
      </div>

      {/* Selected File */}
      {selectedFile && (
        <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
          <div className="flex items-center gap-3">
            <File className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="font-medium">{selectedFile.name}</p>
              <p className="text-sm text-muted-foreground">
                {(selectedFile.size / 1024).toFixed(1)} KB
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button onClick={handleUpload} disabled={isUploading} size="sm">
              {isUploading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4 mr-2" />
                  Upload
                </>
              )}
            </Button>

            {!isUploading && (
              <Button variant="outline" size="sm" onClick={handleRemoveFile}>
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      )}

      {/* File Requirements */}
      <div className="text-xs text-muted-foreground space-y-1">
        <p>• Only CSV files are accepted</p>
        <p>• Maximum 200 rows (excluding header)</p>
        <p>• Maximum file size: 10MB</p>
        <div className="mt-3 p-3 bg-muted/30 rounded border">
          <p className="font-medium mb-2">Required CSV Headers:</p>
          <p className="font-mono text-xs break-all">
            fullName,email,phone,city,propertyType,bhk,purpose,budgetMin,budgetMax,timeline,source,notes,tags,status
          </p>
          <p className="mt-2 text-xs">
            • propertyType: apartment, house, commercial, land
          </p>
          <p className="text-xs">
            • timeline: immediate, 1-3months, 3-6months, 6months+
          </p>
          <p className="text-xs">
            • status: new, contacted, qualified, converted, closed
          </p>
        </div>
      </div>
    </div>
  );
}
