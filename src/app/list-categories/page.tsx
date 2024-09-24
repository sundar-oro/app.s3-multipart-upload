import CategoriesComponent from "@/components/Categories";
import { Suspense } from "react";

const CategoriesPage = () => {
  return (
    <Suspense>
      <CategoriesComponent />;
    </Suspense>
  );
};
export default CategoriesPage;
