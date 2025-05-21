"use client";

import { ourFileRouter } from "@/app/api/uploadthing/core";
import { UploadDropzone } from "@/lib/uploadthing";
import Image from "next/image";
import { toast } from "sonner";
import { ClientUploadedFileData } from "uploadthing/types";

interface Props {
  onChange: (url?: string | ClientUploadedFileData<null>[]) => void;
  endPoint: keyof typeof ourFileRouter;
  value: string[];
}
export const ImageUpload = ({ endPoint, onChange, value }: Props) => {
  return (
    <div>
      {value.length > 0 && (
        <div className="flex gap-5">
          {value.map((img, index) => (
            <Image key={index} src={img} alt="" height={40} width={40} />
          ))}
        </div>
      )}
      <UploadDropzone
        endpoint={endPoint}
        onClientUploadComplete={(res) => {
          onChange(res);
          console.log(res);
        }}
        onUploadError={(error: Error) => {
          // Do something with the error.
          toast.error(`ERROR! ${error.message}`);
        }}
      />
    </div>
  );
};
