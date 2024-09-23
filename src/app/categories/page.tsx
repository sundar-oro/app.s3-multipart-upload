import CategoriesComponent from "@/components/Categories";
import { Suspense } from "react";

export default function CategoriesPage() {
  return (
    <Suspense>
      <CategoriesComponent />;
    </Suspense>
  );
}
