// components/avatar-uploader.tsx
"use client";

import { CldUploadWidget } from "next-cloudinary";
import { Camera, Upload } from "lucide-react";
interface AvatarUploaderProps {
  onUploadSuccess: (url: string) => Promise<void>;
}

export function AvatarUploader({ onUploadSuccess }: AvatarUploaderProps) {
  return (
    <CldUploadWidget
      uploadPreset={process.env.NEXT_PUBLIC_UPLOAD_PRESET}
      signatureEndpoint="/api/sign-cloudinary-params"
      onSuccess={async (result) => {
        if (typeof result.info === "object" && "secure_url" in result.info) {
          await onUploadSuccess(result.info.secure_url);
        }
      }}
      options={{
        singleUploadAutoClose: true,
      }}
    >
      {({ open }) => (
        <button
          type="button"
          onClick={() => open && open()}
          className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 transition-colors duration-200"
        >
          <Camera className="w-4 h-4" />
          <span className="sr-only">Upload new avatar</span>
        </button>
      )}
    </CldUploadWidget>
  );
}
