import DashBoard from "@/components/Dashboard";
import { Suspense } from "react";

export default function DashboardPage() {
  return (
    <Suspense>
      <DashBoard />
    </Suspense>
  );
}
