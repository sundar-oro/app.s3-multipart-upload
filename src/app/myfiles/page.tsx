import Files from "@/components/Categories/Files";
import { Suspense } from "react";

export default function FilesPage() {
  return (
    <Suspense>
      <Files />
    </Suspense>
  );
}
