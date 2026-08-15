import React, { useState, useRef } from "react";
import { UploadCloud, X, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { adminApi } from "@/lib/adminApi";

export interface ImageUploadDropzoneProps {
  value?: string;
  onChange: (url: string) => void;
  label?: string;
  className?: string;
}

export function ImageUploadDropzone({
  value,
  onChange,
  label = "Recipe Photography (S3)",
  className = "",
}: ImageUploadDropzoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image file (JPEG, PNG, WEBP).");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image file must be smaller than 5MB.");
      return;
    }

    try {
      setUploading(true);
      const res = await adminApi.uploadImage(file);
      onChange(res.url);
      toast.success("Image uploaded successfully to AWS S3.");
    } catch (err: any) {
      toast.error(err.message || "Failed to upload image.");
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && (
        <span className="text-[11px] font-semibold text-[#52565b] uppercase tracking-wider">
          {label}
        </span>
      )}

      {value ? (
        <div className="relative group w-full h-[140px] rounded-[8px] overflow-hidden border border-[#d1d4d9] bg-[#f8f9fa]">
          <img
            src={value}
            alt="Recipe preview"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-[rgba(23,24,26,0.6)] opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-3 py-1.5 bg-white text-[#17181a] text-[11px] font-bold rounded-[6px] hover:bg-[#f0f1f3] cursor-pointer"
            >
              Replace Image
            </button>
            <button
              type="button"
              onClick={() => onChange("")}
              className="p-1.5 bg-[#ef4444] text-white rounded-[6px] hover:bg-[#dc2626] cursor-pointer"
              title="Remove image"
            >
              <X size={14} />
            </button>
          </div>
        </div>
      ) : (
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => fileInputRef.current?.click()}
          className={`flex flex-col items-center justify-center w-full h-[120px] rounded-[8px] border-2 border-dashed transition-colors cursor-pointer p-4 ${isDragging ? "border-[#17181a] bg-[#f0f1f3]" : "border-[#d1d4d9] bg-[#fafbfc] hover:bg-[#f3f4f6] hover:border-[#8a8d92]"}`}
        >
          {uploading ? (
            <div className="flex flex-col items-center gap-2">
              <Loader2 className="w-6 h-6 text-[#17181a] animate-spin" />
              <span className="text-[11px] text-[#52565b] font-medium">
                Uploading to S3...
              </span>
            </div>
          ) : (
            <div className="flex flex-col items-center text-center gap-1.5">
              <div className="w-8 h-8 rounded-full bg-[#f0f1f3] flex items-center justify-center text-[#52565b]">
                <UploadCloud size={18} />
              </div>
              <div>
                <p className="m-0 text-[11px] font-bold text-[#17181a]">
                  Click or drag recipe image here
                </p>
                <p className="m-0 text-[10px] text-[#8a8d92]">
                  Supports PNG, JPG, WEBP (up to 5MB)
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={(e) => {
          if (e.target.files && e.target.files[0]) {
            handleFile(e.target.files[0]);
          }
        }}
      />
    </div>
  );
}

export default ImageUploadDropzone;
