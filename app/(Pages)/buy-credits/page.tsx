"use client";

import { motion } from "framer-motion";
import { Coffee, CreditCard, Mail, IndianRupee } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const creditPlans = [
  {
    amount: 100,
    label: "₹100",
    description: "Basic support",
    icon: <IndianRupee className="h-8 w-8 text-primary" />,
  },
  {
    amount: 500,
    label: "₹500",
    description: "Premium support",
    icon: <IndianRupee className="h-8 w-8 text-primary" />,
  },
  {
    amount: 1000,
    label: "₹1000",
    description: "VIP support",
    icon: <IndianRupee className="h-8 w-8 text-primary" />,
  },
];

export default function BuyCreditsPage() {
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [showPayment, setShowPayment] = useState(false);

  const calculateCredits = (amount: number) => {
    return amount * 2.5;
  };

  const handleAmountSelect = (amount: number) => {
    setSelectedAmount(amount);
    setShowPayment(false);
  };

  return (
    <section className="container flex flex-col items-center justify-center gap-6 px-4 pb-12 pt-6 md:py-16">
      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mx-auto flex max-w-[980px] flex-col items-center gap-4 text-center"
      >
        <h1 className="text-3xl font-extrabold leading-tight tracking-tighter sm:text-4xl md:text-5xl">
          <Coffee className="inline h-10 w-10 text-primary" /> <br />
          Buy Email Credits
        </h1>
        <p className="max-w-[700px] text-base text-muted-foreground sm:text-lg">
          Get 2.5x credits on every purchase. Support our service and get more
          emails to send.
        </p>
      </motion.div>

      {/* Credit Plans Grid */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="mt-8 grid grid-cols-1 gap-8 sm:grid-cols-3 w-full max-w-4xl"
      >
        {creditPlans.map((plan, index) => (
          <motion.div
            key={index}
            whileHover={{ y: -5 }}
            onClick={() => handleAmountSelect(plan.amount)}
          >
            <Card
              className={`h-full transition-all ${selectedAmount === plan.amount ? "ring-2 ring-primary" : ""} hover:cursor-pointer`}
            >
              <CardHeader className="items-center">
                {/* <div className="rounded-full bg-primary/10 p-4">{plan.icon}</div> */}
                <CardTitle className="text-2xl">{plan.label}</CardTitle>
                <CardDescription className="text-lg">
                  {calculateCredits(plan.amount)} credits
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-sm text-muted-foreground">
                  {plan.description}
                </p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* Rest of the component remains the same */}
      {/* Payment Button */}
      {selectedAmount && !showPayment && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="flex flex-col items-center gap-4"
        >
          <Button
            onClick={() => setShowPayment(true)}
            size="lg"
            className="w-full sm:w-auto px-8 border-2 hover:cursor-pointer"
          >
            <CreditCard className="mr-2 h-5 w-5" />
            Pay {creditPlans.find((p) => p.amount === selectedAmount)?.label}
          </Button>
        </motion.div>
      )}

      {/* QR Code Payment Section */}
      {showPayment && selectedAmount && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="w-full max-w-md mt-8"
        >
          <Card>
            <CardHeader className="text-center">
              <CardTitle>Complete Your Payment</CardTitle>
              <CardDescription>
                Scan the QR code & pay{" "}
                {creditPlans.find((p) => p.amount === selectedAmount)?.label}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center gap-6">
              <div className="bg-primary/10 p-6 rounded-lg">
                {/* Replace with your QR code image */}
                <Image
                  src="/QR-Code.png"
                  alt="Payment QR Code"
                  width={256}
                  height={256}
                  className="mx-auto"
                />
              </div>
              <p className="text-sm text-muted-foreground text-center">
                {"You'll receive "}
                <span className="font-bold">
                  {calculateCredits(selectedAmount)} credits
                </span>{" "}
                after payment verification.
              </p>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Contact Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="mt-8"
      >
        <Link href="/contact">
          <Button variant="outline" className="hover:cursor-pointer">
            <Mail className="mr-2 h-4 w-4" />
            Contact Us
          </Button>
        </Link>
      </motion.div>
    </section>
  );
}
