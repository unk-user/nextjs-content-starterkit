"use client";
import { useEffect, useState } from "react";

import moment from "moment";
import Link from "next/link";

export function CountDown({
  expiresAt,
  email,
}: {
  expiresAt: Date;
  email: string;
}) {
  const [timeLeft, setTimeLeft] = useState("");
  const expiration = moment(expiresAt);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = moment();
      const duration = moment.duration(expiration.diff(now));

      if (duration.asSeconds() < 0) {
        return "OTP expired";
      }

      return `${Math.floor(duration.asMinutes())}:${duration.seconds() < 10 ? "0" : ""}${duration.seconds()}`;
    };

    setTimeLeft(calculateTimeLeft());

    const interval = setInterval(() => {
      setTimeLeft(calculateTimeLeft());

      // Stop the interval when time is up
      if (calculateTimeLeft() === "OTP expired") {
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [expiration]);

  return (
    <div className="text-sm">
      Can&apos;t find code? Check your spam folder.{" "}
      {timeLeft !== "OTP expired" ? (
        timeLeft
      ) : (
        <Link
          href={`/admin/login?ref=${email}`}
          className="hover:underline"
          replace
        >
          Resend.
        </Link>
      )}
    </div>
  );
}
