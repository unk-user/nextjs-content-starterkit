import { AdminHeader } from "@/components/admin/header";
import { validateRequest } from "@/lib/validateRequest";
import { redirect } from "next/navigation";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = await validateRequest();
  if (!user || !user.id) redirect("/admin/login");

  return (
    <>
      <AdminHeader userId={user.id} />
      <main className="flex min-h-screen flex-col">{children}</main>
    </>
  );
}
