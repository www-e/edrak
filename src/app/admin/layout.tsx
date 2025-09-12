import { AdminLayout as AdminLayoutComponent } from "@/components/admin/layout/admin-layout";
import { getServerAuthSession } from "@/server/auth";
import { redirect } from "next/navigation";
import { cookies, headers } from "next/headers";
import { type SessionUser } from "@/types/auth";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const reqHeaders = headers();
  const reqCookies = cookies();
  
  const session = await getServerAuthSession({
    req: {
      headers: reqHeaders,
      cookies: reqCookies,
    } as unknown as Parameters<typeof getServerAuthSession>[0]["req"],
    res: {} as unknown as Parameters<typeof getServerAuthSession>[0]["res"],
  });
  
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