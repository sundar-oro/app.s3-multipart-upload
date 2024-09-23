import Files from "@/components/Categories/Files";
import { Suspense } from "react";

export default function CategoriesFilesPage() {
  return (
    <Suspense>
      <Files />
    </Suspense>
  );
}
