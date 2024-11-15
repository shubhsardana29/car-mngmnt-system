import { getSession } from "@/lib/auth";
import { DashboardNav } from "@/components/layout/dashboard-nav";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  if (!session) redirect("/auth/login");

  return (
    <div className="flex min-h-screen">
      <aside className="hidden w-64 border-r bg-gray-50/40 md:block p-6">
        <div className="flex h-full flex-col justify-between">
          <DashboardNav />
        </div>
      </aside>
      <main className="flex-1 overflow-y-auto">
        <div className="container max-w-7xl p-6">
          {children}
        </div>
      </main>
    </div>
  );
}