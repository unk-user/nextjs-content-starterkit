import { Badge } from "../ui/badge";
import { AdminNavbar } from "./navbar";
import { Button } from "../ui/button";
import { LogOut } from "lucide-react";
import { lucia } from "@/auth";
import { revalidatePath } from "next/cache";

import Link from "next/link";

export function AdminHeader({ userId }: { userId: string }) {
  const logout = async () => {
    "use server";
    await lucia.invalidateUserSessions(userId);
    revalidatePath("/admin");
  };

  return (
    <header className="flex w-full flex-col border-b-2 px-12">
      <div className="flex h-16 items-center space-x-2">
        <Link href="/admin" className="text-2xl font-semibold">
          LOGO
        </Link>
        <Badge variant="outline">admin</Badge>
        <form className="!ml-auto" action={logout}>
          <Button variant="ghost" size="icon" title="Log out">
            <LogOut size={20} />
          </Button>
        </form>
      </div>
      <AdminNavbar />
    </header>
  );
}
