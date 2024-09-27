"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useFormState } from "react-dom";
import { useEffect } from "react";
import { toast } from "sonner";

import loginAdmin from "./action";

export function LoginForm() {
  const [state, formAction, isPending] = useFormState(loginAdmin, null);

  useEffect(() => {
    if (state && !state.success) toast.error(state.error);
  }, [state]);

  return (
    <form
      className="flex w-full max-w-sm flex-col space-y-4"
      action={formAction}
    >
      <h1 className="text-lg font-bold">Welcome Back</h1>
      <div className="space-y-2">
        <Label>Admin Email</Label>
        <Input type="email" name="email" required />
      </div>
      <Button className="ml-auto w-1/2" disabled={isPending}>
        Submit
      </Button>
    </form>
  );
}
