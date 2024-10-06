"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useFormState } from "react-dom";
import { useEffect } from "react";
import { toast } from "sonner";
import { useSearchParams } from "next/navigation";

import loginAdmin from "./action";
import { useFormStatus } from "react-dom";

export function LoginForm() {
  const [state, formAction] = useFormState(loginAdmin, null);
  const searchParams = useSearchParams();
  const ref = searchParams.get("ref");

  useEffect(() => {
    if (state && !state.success) toast.error(state.error);
  }, [state]);

  return (
    <form
      className="mb-24 flex w-full max-w-md flex-col px-4"
      action={formAction}
    >
      <div className="mb-4 sm:mb-6">
        <h1 className="mb-2 text-2xl font-medium sm:text-3xl">Welcome Back!</h1>
        <p className="text-primary/80">Use your admin email to login.</p>
      </div>
      <div className="mb-4 space-y-2 text-start">
        <Label>Email</Label>
        <Input type="email" name="email" defaultValue={ref || ""} required />
      </div>
      <SubmitButton />
    </form>
  );
}

function SubmitButton() {
  const { pending: isPending } = useFormStatus();

  return (
    <Button size="lg" className="ml-auto w-full" disabled={isPending}>
      Login
    </Button>
  );
}
