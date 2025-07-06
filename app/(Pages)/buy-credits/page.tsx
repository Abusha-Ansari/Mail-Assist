"use client";
import { Coffee, CreditCard, IndianRupee } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useState } from "react";
// import { useTheme } from "next-themes";
import Image from "next/image";

const creditPlans = [
  {
    amount: 100,
    label: "Basic",
    priceLabel: "₹100",
    description: "Basic support",
    icon: <IndianRupee className="h-8 w-8 text-primary" />,
  },
  {
    amount: 500,
    label: "Premium",
    priceLabel: "₹500",
    description: "Premium support",
    icon: <IndianRupee className="h-8 w-8 text-primary" />,
  },
  {
    amount: 1000,
    label: "VIP",
    priceLabel: "₹1000",
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

  // const { theme, setTheme } = useTheme();
  // const originalTheme = useRef<string | undefined>(undefined);

  // useEffect(() => {
  //   // Save the original theme
  //   originalTheme.current = theme;

  //   // Change to the desired theme (e.g., dark)
  //   setTheme("dark");

  //   return () => {
  //     setTheme("dark");
  //   };
  // }, [theme, setTheme]);

  const getPlanLabel = (amount: number): string => {
    const plan = creditPlans.find((p) => p.amount === amount);
    return plan?.label || "Basic"; // fallback to Basic
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-muted/30">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(var(--primary),0.1),transparent_50%)]" />

      <section className="relative container flex flex-col items-center justify-center gap-6 px-4 pb-12 pt-6 md:py-16">
        {/* Header Section */}
        <div className="mx-auto flex max-w-[980px] flex-col items-center gap-4 text-center animate-fade-in">
          <div className="relative">
            <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 to-primary/10 rounded-full blur-xl" />
            <Coffee className="relative h-16 w-16 text-primary animate-scale-in" />
          </div>
          <h1 className="text-3xl font-extrabold leading-tight tracking-tighter sm:text-4xl md:text-5xl bg-gradient-to-r from-foreground via-primary to-primary/80 bg-clip-text text-transparent">
            Buy Email Credits
          </h1>
          <p className="max-w-[700px] text-base text-muted-foreground sm:text-lg bg-card/50 backdrop-blur-sm rounded-lg px-6 py-3 border border-border/20">
            Get 2.5x credits on every purchase. Support our service and get more
            emails to send.
          </p>
        </div>

        {/* Credit Plans Grid */}
        <div className="mt-8 grid grid-cols-1 gap-8 sm:grid-cols-3 w-full max-w-4xl animate-slide-in-right">
          {creditPlans.map((plan, index) => (
            <div
              key={index}
              onClick={() => handleAmountSelect(plan.amount)}
              className="group transform transition-all duration-300 hover:scale-105 animate-scale-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <Card
                className={`h-full transition-all cursor-pointer relative overflow-hidden ${
                  selectedAmount === plan.amount
                    ? "ring-2 ring-primary shadow-2xl bg-gradient-to-br from-primary/10 to-primary/5"
                    : "hover:shadow-xl bg-card/70"
                } backdrop-blur-sm border-border/20`}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <CardHeader className="items-center relative z-10">
                  {/* <div className="rounded-full bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 p-4 mb-2">
                    {plan.icon}
                  </div> */}
                  <CardTitle className="text-2xl bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent">
                    {plan.label + " " + plan.priceLabel}
                  </CardTitle>
                  <CardDescription className="text-lg font-semibold text-primary">
                    {calculateCredits(plan.amount)} credits
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-center relative z-10">
                  <p className="text-sm text-muted-foreground">
                    {plan.description}
                  </p>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>

        {/* Payment Button */}
        {selectedAmount && !showPayment && (
          <div className="flex flex-col items-center gap-4 animate-fade-in">
            <Button
              onClick={() => setShowPayment(true)}
              size="lg"
              className="w-full sm:w-auto px-8 border-2 hover:cursor-pointer bg-primary hover:bg-primary/90 transform transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
            >
              <CreditCard className="mr-2 h-5 w-5" />
              Pay{" "}
              {creditPlans.find((p) => p.amount === selectedAmount)?.priceLabel}
            </Button>
          </div>
        )}

        {/* QR Code Payment Section */}
        {showPayment && selectedAmount && (
          <div className="w-full max-w-md mt-8 animate-scale-in">
            <Card className="bg-card/80 backdrop-blur-sm border-border/20 shadow-2xl">
              <CardHeader className="text-center">
                <CardTitle className="bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent">
                  Complete Your Payment
                </CardTitle>
                <CardDescription>
                  Scan the QR code & pay{" "}
                  {
                    creditPlans.find((p) => p.amount === selectedAmount)
                      ?.priceLabel
                  }
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col items-center gap-6">
                <div className="bg-gradient-to-br from-primary/10 to-primary/5 p-6 rounded-lg border border-border/20">
                  <div className="w-64 h-64 bg-muted rounded-lg flex items-center justify-center">
                    <div className="bg-primary/10 p-6 rounded-lg">
                      <Image
                        src={`/QR-${getPlanLabel(selectedAmount)}.jpg`}
                        alt="QR Code"
                        width={256}
                        height={256}
                        className="object-cover rounded-lg"
                      />
                    </div>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground text-center bg-card/50 backdrop-blur-sm rounded-lg px-4 py-2 border border-border/20">
                  {"You'll receive "}
                  <span className="font-bold text-primary">
                    {calculateCredits(selectedAmount)} credits
                  </span>{" "}
                  after payment verification.
                  <br />
                  <span className="font-bold text-primary">
                    (Also enter your{" "}
                    <span className="text-primary font-semibold">
                      Email
                    </span>{" "}
                    in the note while processing the payment)
                  </span>
                </p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Contact Button */}
        {/* <div className="mt-8 animate-fade-in">
          <Link href="/contact">
            <Button
              variant="outline"
              className="hover:cursor-pointer bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border-white/20 hover:bg-white/90 dark:hover:bg-gray-800/90 transform transition-all duration-300 hover:scale-105"
            >
              <Mail className="mr-2 h-4 w-4" />
              Contact Us
            </Button>
          </Link>
        </div> */}
      </section>
    </div>
  );
}
