"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Mail,
  Shield,
  Rocket,
  Sparkles,
  Send,
  DollarSign,
  Smile,
  LayoutTemplate,
  MessageSquareText,
  Upload,
  History,
} from "lucide-react";
import Link from "next/link";
import { useUser } from "@/context/UserContext";

// New or updated feature data for more detailed sections
const coreFeatures = [
  {
    icon: <Mail className="h-10 w-10 text-primary" />,
    title: "Send Custom Emails",
    description:
      "Craft personalized emails from scratch. Simply fill out the subject and message, and send. Your credits are deducted per email sent.",
  },
  {
    icon: <LayoutTemplate className="h-10 w-10 text-primary" />,
    title: "Predefined Email Templates",
    description:
      "Choose from a library of professional templates like 'Interview Invitation' or 'Payment Confirmation'. Fill in the blanks, preview, and send.",
  },
  {
    icon: <Sparkles className="h-10 w-10 text-primary" />,
    title: "Custom Email Builder",
    description:
      "Unleash your creativity with our drag-and-drop builder. Design unique templates, add placeholders, and customize every detail.",
  },
  {
    icon: <Upload className="h-10 w-10 text-primary" />,
    title: "Batch Email Sending",
    description:
      "Reach many recipients at once. Upload a CSV with contact details, and send personalized emails to everyone effortlessly.",
  },
  {
    icon: <History className="h-10 w-10 text-primary" />,
    title: "Email History Dashboard",
    description:
      "Keep track of all your communications. View sent emails, check their status, and review full content anytime.",
  },
  {
    icon: <Shield className="h-10 w-10 text-primary" />,
    title: "Anonymous Email Sending",
    description:
      "Protect your privacy. Send emails without revealing your personal identity or email address.",
  },
];

const whyChooseUs = [
  {
    icon: <Rocket className="h-8 w-8 text-primary" />,
    title: "Blazing Fast Delivery",
    description:
      "Experience lightning-fast email delivery to any inbox, anywhere in the world.",
  },
  {
    icon: <DollarSign className="h-8 w-8 text-primary" />,
    title: "Affordable & Flexible",
    description:
      "Our pay-as-you-go model means no subscriptions, just affordable credits for when you need them.",
  },
  {
    icon: <Smile className="h-8 w-8 text-primary" />,
    title: "User-Friendly Interface",
    description:
      "A clean, intuitive design that's simple to navigate on both desktop and mobile devices.",
  },
  {
    icon: <Shield className="h-8 w-8 text-primary" />, // Reusing Shield for security emphasis
    title: "Secure & Private",
    description:
      "Your communications are handled with end-to-end encryption, ensuring privacy and reliability.",
  },
];

export default function AnimatedHome() {
  const { loggedIn } = useUser();

  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 },
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <section className="flex flex-col items-center justify-center min-h-screen">
      {/* Hero Section */}
      <div className="container flex flex-col items-center justify-center gap-8 px-4 py-20 text-center md:py-24">
        <motion.div
  initial={{ opacity: 0, y: -20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.7 }}
  className="mx-auto max-w-4xl flex flex-col items-center text-center"
>
  <h1 className="text-4xl font-extrabold leading-tight tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
    <Mail className="inline-block h-12 w-12 text-primary md:h-16 md:w-16 animate-bounce" />{" "}
    <br className="sm:hidden" />
    <span className="bg-gradient-to-l from-primary to-blue-600 text-transparent bg-clip-text">
      Mail_Assist
    </span>{" "}
    Your Seamless Email Solution
  </h1>
  <p className="mt-6 max-w-2xl text-lg text-muted-foreground sm:text-xl lg:text-2xl leading-relaxed">
    Send custom emails, utilize powerful templates, and manage your communications effortlessly, all without using your personal email accounts.
  </p>
</motion.div>


        {/* Dynamic Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="flex flex-col items-center gap-4 sm:flex-row mt-8"
        >
          {loggedIn ? (
            <>
              <Button
                asChild
                size="lg"
                className="w-full sm:w-auto px-8 py-3 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <Link href="/dashboard">Go to Dashboard</Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="w-full sm:w-auto px-8 py-3 text-lg font-semibold border-2 border-primary hover:bg-primary/10 transition-all duration-300"
              >
                <Link href="/send">Send a Mail</Link>
              </Button>
            </>
          ) : (
            <>
              <Button
                asChild
                size="lg"
                className="w-full sm:w-auto px-8 py-3 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <Link href="/auth/signup">Get Started Free</Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="w-full sm:w-auto px-8 py-3 text-lg font-semibold border-2 border-primary hover:bg-primary/10 transition-all duration-300"
              >
                <Link href="/auth/login">Login</Link>
              </Button>
            </>
          )}
        </motion.div>
      </div>

      <hr className="w-full border-t border-muted-foreground/20" />

      {/* How It Works Section */}
      <div className="container py-16 md:py-24">
        <motion.h2
          {...fadeIn}
          className="text-center text-3xl font-bold mb-12 md:text-4xl"
        >
          How Mail_Assist Simplifies Your Communication
        </motion.h2>
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center"
        >
          <motion.div
            variants={item}
            className="flex flex-col items-center p-6 rounded-lg border bg-card text-card-foreground shadow-md"
          >
            <div className="rounded-full bg-primary/10 p-4 mb-4">
              <Sparkles className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">
              1. Sign Up & Get Credits
            </h3>
            <p className="text-muted-foreground">
              Quickly create your secure account and receive initial credits to
              start sending emails.
            </p>
          </motion.div>
          <motion.div
            variants={item}
            className="flex flex-col items-center p-6 rounded-lg border bg-card text-card-foreground shadow-md"
          >
            <div className="rounded-full bg-primary/10 p-4 mb-4">
              <MessageSquareText className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">2. Compose Your Mail</h3>
            <p className="text-muted-foreground">
              Use our intuitive editor, pick a template, or build your own
              custom design. Personalize with ease.
            </p>
          </motion.div>
          <motion.div
            variants={item}
            className="flex flex-col items-center p-6 rounded-lg border bg-card text-card-foreground shadow-md"
          >
            <div className="rounded-full bg-primary/10 p-4 mb-4">
              <Send className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">3. Send & Track</h3>
            <p className="text-muted-foreground">
              Send your emails instantly. Credits are deducted per send, and you
              can track everything on your dashboard.
            </p>
          </motion.div>
        </motion.div>
      </div>

      <hr className="w-full border-t border-muted-foreground/20" />

      {/* Core Features Section */}
      <div className="container py-16 md:py-24">
        <motion.h2
          {...fadeIn}
          className="text-center text-3xl font-bold mb-12 md:text-4xl"
        >
          Unlock Powerful Email Capabilities
        </motion.h2>
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {coreFeatures.map((feature, index) => (
            <motion.div
              key={index}
              variants={item}
              whileHover={{ y: -5, boxShadow: "0 10px 15px rgba(0,0,0,0.1)" }}
              className="flex flex-col items-center p-6 rounded-lg border bg-card text-card-foreground text-center shadow-sm"
            >
              <div className="rounded-full bg-primary/10 p-4 mb-4">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>

      <hr className="w-full border-t border-muted-foreground/20" />

      {/* Why Choose Mail_Assist Section */}
      <div className="container py-16 md:py-24">
        <motion.h2
          {...fadeIn}
          className="text-center text-3xl font-bold mb-12 md:text-4xl"
        >
          Why Choose Mail_Assist?
        </motion.h2>
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {whyChooseUs.map((benefit, index) => (
            <motion.div
              key={index}
              variants={item}
              whileHover={{ y: -5, boxShadow: "0 10px 15px rgba(0,0,0,0.1)" }}
              className="flex flex-col items-center p-6 rounded-lg border bg-card text-card-foreground text-center shadow-sm"
            >
              <div className="rounded-full bg-primary/10 p-4 mb-4">
                {benefit.icon}
              </div>
              <h3 className="text-xl font-bold mb-2">{benefit.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {benefit.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>

      <hr className="w-full border-t border-muted-foreground/20" />

      {/* Call to Action Section - End */}
      <div className="container py-16 md:py-24 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mx-auto max-w-3xl"
        >
          <h2 className="text-3xl font-bold leading-tight sm:text-4xl md:text-5xl">
            Ready to Revolutionize Your Email Sending?
          </h2>
          <p className="mt-6 text-lg text-muted-foreground sm:text-xl">
            Join thousands of users who are sending emails seamlessly and
            securely with Mail_Assist.
          </p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="mt-8 flex flex-col items-center gap-4 sm:flex-row justify-center"
          >
            {loggedIn ? (
              <Button
                asChild
                size="lg"
                className="w-full sm:w-auto px-10 py-4 text-xl font-bold shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <Link href="/dashboard">Access Dashboard</Link>
              </Button>
            ) : (
              <Button
                asChild
                size="lg"
                className="w-full sm:w-auto px-10 py-4 text-xl font-bold shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <Link href="/auth/signup">Get Started Now</Link>
              </Button>
            )}
            

          </motion.div>

        </motion.div>
      </div>
    </section>
  );
}
