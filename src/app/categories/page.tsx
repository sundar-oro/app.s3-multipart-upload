import CategoriesComponent from "@/components/Categories";
import dynamic from "next/dynamic";
import { Suspense } from "react";

const CategoriesPage = () => {
  return (
    <Suspense>
      <CategoriesComponent />;
    </Suspense>
  );
};
export default CategoriesPage;
