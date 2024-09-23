import { Dashboard } from "@/components/Dashboard";
import Image from "next/image";
import { Suspense } from "react";

export default function DashboardPage() {
  return (
    <Suspense>
      <Dashboard />
    </Suspense>
  );
}
