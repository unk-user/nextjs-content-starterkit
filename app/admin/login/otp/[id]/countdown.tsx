"use client";
import moment from "moment";
import { useEffect, useState } from "react";

export function CountDown({ expiresAt }: { expiresAt: Date }) {
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

  return <div className="text-sm">{timeLeft}</div>;
}
