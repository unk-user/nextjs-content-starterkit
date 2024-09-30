"use client";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
  InputOTPSeparator,
} from "@/components/ui/input-otp";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import { useCallback, useEffect, useRef, useState, useTransition } from "react";
import { CountDown } from "./countdown";
import { validateOtp } from "./action";
import { toast } from "sonner";

import moment from "moment";

interface OtpInputProps {
  otpId: string;
  email: string;
  expiresAt: Date;
  attempts: number;
}

export function OtpInput({ otpId, email, expiresAt, attempts }: OtpInputProps) {
  const [value, setValue] = useState("");
  const [isPending, startTransition] = useTransition();
  const inputOtpRef = useRef<HTMLInputElement>(null);

  const isExpired = moment(expiresAt).isBefore(moment());
  const isMaxAttempts = attempts >= 5;
  const isDisabled = isExpired || isMaxAttempts || isPending;

  const submitOtp = useCallback(() => {
    startTransition(() => {
      setValue("");
      const promise = validateOtp(otpId, value).then((res) => {
        inputOtpRef.current?.focus();
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
  }, [otpId, value]);

  useEffect(() => {
    if (value.length === 8 && !isDisabled) submitOtp();
  }, [value, isDisabled, submitOtp]);

  return (
    <div className="mb-24 flex w-full max-w-lg flex-col text-center">
      <div className="mb-4 sm:mb-8">
        <h1 className="mb-2 text-2xl font-medium sm:text-3xl">
          Check your email for a code
        </h1>
        <p className="text-primary/80">
          Please enter the 8-digit code we sent to{" "}
          <span className="font-semibold text-primary">{email}</span>
        </p>
      </div>
      <div>
        <InputOTP
          ref={inputOtpRef}
          maxLength={8}
          pattern={REGEXP_ONLY_DIGITS}
          onChange={setValue}
          disabled={isDisabled}
          value={value}
          containerClassName="justify-center mb-2 sm:mb-4"
          autoFocus
        >
          <OtpGroup start={0} />
          <InputOTPSeparator />
          <OtpGroup start={4} />
        </InputOTP>
        <CountDown expiresAt={expiresAt} email={email} attempts={attempts} />
      </div>
    </div>
  );
}

const OtpGroup = ({ start }: { start: 0 | 4 }) => (
  <InputOTPGroup>
    {Array(4)
      .fill(0)
      .map((_, index) => (
        <InputOTPSlot
          key={index + start}
          index={index + start}
          className="sm:h-12 sm:w-12"
        />
      ))}
  </InputOTPGroup>
);
