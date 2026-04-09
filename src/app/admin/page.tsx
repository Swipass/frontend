import { Metadata } from "next";
import { AdminShell } from "@/components/admin/AdminShell";
import { AdminOverview } from "@/components/admin/AdminOverview";
export const metadata: Metadata = { title: "Admin" };
export default function Page() { return <AdminShell active="overview"><AdminOverview /></AdminShell>; }
