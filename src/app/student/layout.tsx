import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { SessionUser } from "@/types/auth";
import { StudentHeader } from "@/components/student/layout/StudentHeader";
import { StudentSidebar } from "@/components/student/layout/StudentSidebar";

export default async function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
  const user = session?.user as SessionUser | undefined;

  // Protect the entire student route group.
  // Redirect if the user is not logged in or is not a STUDENT.
  if (!user || user.role !== "STUDENT") {
    redirect("/auth/student/signin");
  }

  return (
    <div className="min-h-screen bg-background">
      <StudentSidebar user={user} />
      <div className="lg:pl-72">
        <StudentHeader user={user} />
        <main className="py-10">
          <div className="px-4 sm:px-6 lg:px-8">{children}</div>
        </main>
      </div>
    </div>
  );
}