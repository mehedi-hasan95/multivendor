"use client";
import { OtpModify } from "@/components/common/otp-modify";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

type Props = {
  setOTP: React.Dispatch<React.SetStateAction<string>>;
  onOTP: string;
  onSubmit: () => void;
  validTill?: number;
};
export const VerifyOtp = ({
  onOTP,
  setOTP,
  onSubmit,
  validTill = 300,
}: Props) => {
  const [timeLeft, setTimeLeft] = useState<number>(validTill);
  const [isTimerActive, setIsTimerActive] = useState<boolean>(true);
  useEffect(() => {
    if (timeLeft > 0 && isTimerActive) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      setIsTimerActive(false);
    }
  }, [timeLeft, isTimerActive]);

  // Format time display
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };
  return (
    <div className="flex items-center justify-center min-h-screen">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">
            Verify Your Account
          </CardTitle>
          <CardDescription>
            Enter the 6-digit verification code sent to your email
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <OtpModify otp={onOTP} setOtp={setOTP} />
          <div className="text-center">
            <div className="text-sm text-muted-foreground mb-4">
              {isTimerActive ? (
                <>
                  Time remaining:{" "}
                  <span className="font-mono font-semibold">
                    {formatTime(timeLeft)}
                  </span>
                </>
              ) : (
                <span className="text-red-500">Code expired</span>
              )}
            </div>
            <Button
              type="submit"
              className={cn("w-full mb-3")}
              disabled={onOTP.length !== 6}
              onClick={onSubmit}
            >
              Verify Code
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
