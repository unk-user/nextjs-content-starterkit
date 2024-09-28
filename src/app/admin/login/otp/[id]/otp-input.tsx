"use client";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
  InputOTPSeparator,
} from "@/components/ui/input-otp";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import { useEffect, useState, useTransition } from "react";
import { CountDown } from "./countdown";
import { ActionResponse } from "@/lib/types";
import { validateOtp } from "./action";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

import moment from "moment";

export function OtpInput({
  otp,
}: {
  otp: {
    id: string;
    email: string;
    expiresAt: Date;
  };
}) {
  const [value, setValue] = useState("");
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    const submit = async () => {
      startTransition(() => {
        const promise = validateOtp(otp.id, value).then((res) => {
          if (res && !res.success) {
            throw new Error(res.error);
          }
          return res;
        });
        toast.promise(promise, {
          loading: "Validating...",
          success: "Login successful",
          error: (err) => err.message,
        });
      });
    };
    if (value.length === 8 && moment(otp.expiresAt).isAfter(moment())) submit();
  }, [value, otp]);

  return (
    <div className="flex w-full max-w-lg flex-col space-y-6 text-center">
      <div>
        <h1 className="mb-3 text-4xl font-bold">Check your email for a code</h1>
        <p className="text-primary/90">
          We&apos;ve sent a 8-digit otp code to{" "}
          <span className="font-semibold">{otp.email}</span>, please enter it
          below.
        </p>
      </div>
      <InputOTP
        maxLength={8}
        pattern={REGEXP_ONLY_DIGITS}
        onChange={setValue}
        disabled={isPending || moment(otp.expiresAt).isBefore(moment())}
        containerClassName="justify-center"
      >
        <OtpGroup start={0} />
        <InputOTPSeparator />
        <OtpGroup start={4} />
      </InputOTP>
      <CountDown expiresAt={otp.expiresAt} email={otp.email} />
    </div>
  );
}

const OtpGroup = ({ start }: { start: 0 | 4 }) => (
  <InputOTPGroup>
    {Array(4)
      .fill(0)
      .map((_, index) => (
        <InputOTPSlot key={index + start} index={index + start} />
      ))}
  </InputOTPGroup>
);
