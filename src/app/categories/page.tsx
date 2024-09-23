import dynamic from "next/dynamic";
import { Suspense } from "react";
const CategoriesComponent = dynamic(() => import("@/components/Categories"), {
  ssr: false,
});

export default function CategoriesPage() {
  return (
    <Suspense>
      <CategoriesComponent />;
    </Suspense>
  );
}
