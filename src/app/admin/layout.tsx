import { AdminLayout as AdminLayoutComponent } from "@/components/admin/layout/admin-layout";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { type SessionUser } from "@/types/auth";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // In App Router, we can use getServerSession directly with authOptions
  const session = await getServerSession(authOptions);
  
  // Check if user is authenticated and is an admin
  if (!session?.user || (session.user as SessionUser).role !== "ADMIN") {
    redirect("/auth/admin/signin");
  }

  return (
    <AdminLayoutComponent>
      {children}
    </AdminLayoutComponent>
  );
}