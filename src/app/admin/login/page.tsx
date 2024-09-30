import { validateRequest } from "@/lib/validateRequest";
import { LoginForm } from "./login-form";
import { redirect } from "next/navigation";

export default async function Login() {
  const { user } = await validateRequest();
  if (user) redirect("/admin");

  return (
    <section className="grid flex-1 place-items-center px-2">
      <LoginForm />
    </section>
  );
}
