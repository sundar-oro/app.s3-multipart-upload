import dynamic from "next/dynamic";
import { Suspense } from "react";

const FilesComponent = dynamic(() => import("@/components/Categories/Files"), {
  ssr: false,
});

export default function CategoriesFilesPage() {
  return (
    <Suspense>
      <FilesComponent />
    </Suspense>
  );
}
