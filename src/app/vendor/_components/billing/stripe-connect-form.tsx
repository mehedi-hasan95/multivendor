"use client";
import { LoadingButton } from "@/components/common/loading-button";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useTRPC } from "@/trpc/client";
import { useMutation, useSuspenseQuery } from "@tanstack/react-query";
import { CheckCircle, CreditCard, Shield, Store, Zap } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { toast } from "sonner";

export const StripeConnectForm = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const trpc = useTRPC();
  const { data } = useSuspenseQuery(
    trpc.stripe.getStripeConnectId.queryOptions()
  );
  const connetStripe = useMutation(
    trpc.stripe.createStripeConnectLink.mutationOptions({
      onSuccess: (res) => {
        if (res?.url) {
          setIsLoading(true);
          window.location.href = res.url;
        }
      },
      onError: () => {
        setIsLoading(false);
        toast("Stripe connection failed");
      },
    })
  );

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <div className="flex justify-center">
          <div className="bg-blue-100 dark:bg-blue-900 p-3 rounded-full">
            <Store className="h-8 w-8 text-blue-600 dark:text-blue-400" />
          </div>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Start Selling on Our Platform
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          Connect your Stripe account to start receiving payments from customers
          worldwide. It takes less than 2 minutes to get started.
        </p>
      </div>
      <div className="grid md:grid-cols-3 gap-6">
        <Card className="dark:bg-gray-800 dark:border-gray-700 text-center">
          <CardContent className="pt-6">
            <CreditCard className="h-8 w-8 text-green-600 dark:text-green-400 mx-auto mb-3" />
            <h3 className="font-semibold mb-2 dark:text-white">
              Fast Payments
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Get paid in 2 business days with automatic transfers
            </p>
          </CardContent>
        </Card>

        <Card className="dark:bg-gray-800 dark:border-gray-700 text-center">
          <CardContent className="pt-6">
            <Shield className="h-8 w-8 text-blue-600 dark:text-blue-400 mx-auto mb-3" />
            <h3 className="font-semibold mb-2 dark:text-white">
              Secure & Trusted
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Bank-level security with fraud protection
            </p>
          </CardContent>
        </Card>

        <Card className="dark:bg-gray-800 dark:border-gray-700 text-center">
          <CardContent className="pt-6">
            <Zap className="h-8 w-8 text-purple-600 dark:text-purple-400 mx-auto mb-3" />
            <h3 className="font-semibold mb-2 dark:text-white">Easy Setup</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Connect in minutes with our streamlined process
            </p>
          </CardContent>
        </Card>
      </div>
      <Card className="max-w-2xl mx-auto dark:bg-gray-800 dark:border-gray-700">
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center gap-2 dark:text-white">
            Connect with{" "}
            <Image
              src="/stripe-blue.svg"
              alt="Stripe"
              // className="h-6"
              height={40}
              width={60}
            />
          </CardTitle>
          <CardDescription className="dark:text-gray-300">
            Connect your Stripe account to start accepting payments
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-3">
            <h4 className="font-medium text-gray-900 dark:text-white">
              What you&apos;ll get:
            </h4>
            <div className="space-y-2">
              {[
                "Accept credit cards, debit cards, and digital wallets",
                "Automatic tax calculation and reporting",
                "Real-time sales analytics and reporting",
                "Mobile-optimized checkout experience",
                "24/7 customer support",
              ].map((feature, index) => (
                <div key={index} className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400 flex-shrink-0" />
                  <span className="text-sm text-gray-600 dark:text-gray-300">
                    {feature}
                  </span>
                </div>
              ))}
            </div>
            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium dark:text-white">
                    Transaction Fee
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Per successful charge
                  </p>
                </div>
                <Badge
                  variant="secondary"
                  className="text-lg font-semibold dark:bg-gray-600 dark:text-white"
                >
                  10.0%
                </Badge>
              </div>
            </div>
          </div>
          {data?.stripeConnectLink === false || isLoading ? (
            connetStripe.isPending ? (
              <LoadingButton />
            ) : (
              <Button
                onClick={() => connetStripe.mutate()}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-5"
              >
                Connect
                <Image src={"/stripe.svg"} alt="" height={40} width={60} />
              </Button>
            )
          ) : (
            <div className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 cursor-not-allowed flex justify-center gap-2 rounded-md">
              Stripe connected
              <CheckCircle size={20} />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
