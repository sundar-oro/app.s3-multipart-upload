import FileUpload from "@/components/FileUpload/multipart";
import { Suspense } from "react";

export default function FileUploadPage() {
  return (
    <Suspense>
      <FileUpload />
    </Suspense>
  );
}
