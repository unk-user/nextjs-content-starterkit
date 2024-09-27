"use client";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import { useEffect, useState, useTransition } from "react";
import { CountDown } from "./countdown";
import { ActionResponse } from "@/lib/types";
import { validateOtp } from "./action";
import { cn } from "@/lib/utils";
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
  const [response, setResponse] = useState<ActionResponse | null>(null);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    const submit = async () => {
      startTransition(() => {
        validateOtp(otp.id, value).then((res) => {
          setResponse(res);
        });
      });
    };
    if (value.length === 8 && moment(otp.expiresAt).isAfter(moment())) submit();
  }, [value, otp]);

  return (
    <div className="flex w-full max-w-sm flex-col space-y-4 text-center">
      <div>
        <h1 className="text-lg font-bold">Otp verification</h1>
        <p className="text-sm text-primary-foreground/60">
          Enter the code sent to your email
        </p>
      </div>
      <InputOTP
        maxLength={8}
        pattern={REGEXP_ONLY_DIGITS}
        onChange={setValue}
        disabled={isPending}
      >
        <InputOTPGroup className="text-max mx-auto">
          {Array(8)
            .fill(0)
            .map((_, index) => (
              <InputOTPSlot
                key={index}
                index={index}
                className={cn(
                  response?.success ? "border-green-500" : "border-red-400",
                )}
              />
            ))}
        </InputOTPGroup>
      </InputOTP>
      <CountDown expiresAt={otp.expiresAt} />
    </div>
  );
}
