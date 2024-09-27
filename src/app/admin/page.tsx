import { validateRequest } from "@/lib/validateRequest";
import { redirect } from "next/navigation";

export default async function AdminHomePage() {
  const { user } = await validateRequest();
  if (!user) redirect("/admin/login");

  return <div>Hello world</div>;
}
