"use client";
import { useCallback, useEffect, useState } from "react";

import moment from "moment";
import Link from "next/link";

export function CountDown({
  expiresAt,
  email,
  attempts,
}: {
  expiresAt: Date;
  email: string;
  attempts: number;
}) {
  const [timeLeft, setTimeLeft] = useState<string | null>(" ");
  const expiration = moment(expiresAt);
  const isMaxAttempts = attempts >= 5;

  const calculateTimeLeft = useCallback(() => {
    const now = moment();
    const duration = moment.duration(expiration.diff(now));

    if (duration.asSeconds() < 0 || isMaxAttempts) {
      return null;
    }

    return `${Math.floor(duration.asMinutes())}:${duration.seconds() < 10 ? "0" : ""}${duration.seconds()}`;
  }, [expiration, isMaxAttempts]);

  useEffect(() => {
    setTimeLeft(calculateTimeLeft());

    const interval = setInterval(() => {
      setTimeLeft(calculateTimeLeft());

      // Stop the interval when time is up
      if (calculateTimeLeft() === "OTP expired") {
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [expiration, isMaxAttempts, calculateTimeLeft]);

  if (timeLeft) {
    return <p className="text-sm">{timeLeft}</p>;
  }

  return (
    <div className="text-sm">
      <p className="inline text-red-500">
        {isMaxAttempts ? "Too many attempts, " : "OTP expired, "}
      </p>
      <Link href={`/admin/login?ref=${email}`} className="underline" replace>
        Resend.
      </Link>
    </div>
  );
}
