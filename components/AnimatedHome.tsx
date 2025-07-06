"use client";
import React, { useState, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import {
  Mail,
  Shield,
  Sparkles,
  Send,
  DollarSign,
  Users,
  FileText,
  Eye,
  Upload,
  ArrowRight,
  CheckCircle,
  Play,
  MessageSquare,
  Clock,
  TrendingUp,
  Heart,
  ChevronDown,
} from "lucide-react";
import { useUser } from "@/context/UserContext";
import { useRouter } from "next/navigation";
// import { useTheme } from "next-themes";
import Link from "next/link";

type AnimatedCounterProps = { end: number; duration?: number };

const AnimatedCounter = ({ end, duration = 2000 }: AnimatedCounterProps) => {
  const [count, setCount] = useState(0);

  // const { theme, setTheme } = useTheme();
  // const originalTheme = useRef<string | undefined>(undefined);

  // useEffect(() => {
  //   // Save the original theme only once on mount
  //   originalTheme.current = theme;

  //   // Force dark theme
  //   setTheme("dark");

  //   return () => {
  //     // Restore original theme on unmount
  //     if (originalTheme.current) {
  //       setTheme(originalTheme.current);
  //     }
  //   };
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [setTheme]);

  useEffect(() => {
    let startTime: number | undefined;
    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      setCount(Math.floor(progress * end));

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    requestAnimationFrame(animate);
  }, [end, duration]);

  return count;
};

export default function AnimatedHome() {
  const { loggedIn } = useUser();
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "-50%"]);

  const router = useRouter();

  const features = [
    {
      icon: <Send className="h-8 w-8 text-primary" />,
      title: "Custom Email Sending",
      description:
        "Send personalized emails to any recipient with our easy-to-use interface",
      color: "primary",
    },
    {
      icon: <FileText className="h-8 w-8 text-primary/80" />,
      title: "Predefined Templates",
      description:
        "Choose from ready-made templates for interviews, events, thank you notes, and more",
      color: "primary",
    },
    {
      icon: <Sparkles className="h-8 w-8 text-accent" />,
      title: "Custom Email Builder",
      description:
        "Drag-and-drop interface to create your own templates with placeholders",
      color: "accent",
    },
    {
      icon: <Upload className="h-8 w-8 text-green-600 dark:text-green-400" />,
      title: "Batch Email Sending",
      description:
        "Upload CSV files and send personalized emails to multiple contacts at once",
      color: "green",
    },
    {
      icon: <Eye className="h-8 w-8 text-orange-600 dark:text-orange-400" />,
      title: "Email History Dashboard",
      description:
        "View records of all emails sent with full content and delivery status",
      color: "orange",
    },
    {
      icon: <Shield className="h-8 w-8 text-destructive" />,
      title: "Anonymous Sending",
      description:
        "Send emails without revealing your identity for sensitive communications",
      color: "destructive",
    },
  ];

  const templates = [
    {
      name: "Interview Invitation",
      icon: <Users className="h-6 w-6" />,
      usage: "2.5k",
    },
    {
      name: "Event Reminder",
      icon: <Clock className="h-6 w-6" />,
      usage: "1.8k",
    },
    {
      name: "Thank You Note",
      icon: <Heart className="h-6 w-6" />,
      usage: "3.2k",
    },
    {
      name: "Payment Confirmation",
      icon: <CheckCircle className="h-6 w-6" />,
      usage: "1.4k",
    },
  ];

  const stats = [
    { number: 50000, label: "Emails Delivered", icon: <Send /> },
    { number: 2500, label: "Happy Users", icon: <Users /> },
    { number: 99, label: "Uptime %", icon: <TrendingUp /> },
    { number: 24, label: "Support Hours", icon: <Clock /> },
  ];

  const footerSections = [
    {
      title: "Product",
      links: {
        Features: "/features",
        Templates: "/send",
        Pricing: "/buy-credits",
        API: "/api-docs",
      },
    },
    {
      title: "Company",
      links: {
        About: "/about",
        Blog: "/blog",
        Careers: "/careers",
        Contact: "/contact",
      },
    },
    {
      title: "Support",
      links: {
        "Help Center": "/help",
        Documentation: "/",
        Status: "/status",
        Community: "/community",
      },
    },
  ];

  return (
    <div className="min-h-screen overflow-x-hidden bg-gradient-to-br from-background via-background to-muted/20 transition-colors duration-300">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <motion.div
          style={{ y }}
          className="absolute inset-0 bg-gradient-to-r from-primary/20 via-primary/10 to-accent/20"
        />

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mb-6"
            >
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-primary to-primary/80 rounded-full mb-6 shadow-md">
                <Mail className="h-10 w-10 text-primary-foreground" />
              </div>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-foreground via-primary to-primary/80 bg-clip-text text-transparent"
            >
              Mail Assist
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-xl md:text-2xl text-muted-foreground mb-8 leading-relaxed"
            >
              Send emails seamlessly without using your own email address.
              <br className="hidden md:block" />
              Secure, fast, and hassle-free email delivery for everyone.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
            >
              {loggedIn ? (
                <>
                  <button
                    onClick={() => router.push("/dashboard")}
                    className="bg-primary text-primary-foreground px-8 py-4 rounded-full font-semibold text-lg hover:bg-primary/90 transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-1"
                  >
                    Go to Dashboard
                  </button>
                  <button
                    onClick={() => router.push("/send")}
                    className="border-2 border-border text-foreground px-8 py-4 rounded-full font-semibold text-lg hover:border-primary hover:text-primary transition-all duration-300 bg-background hover:bg-accent/50"
                  >
                    Send Mail Now
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => router.push("/auth/signup")}
                    className="bg-primary text-primary-foreground px-8 py-4 rounded-full font-semibold text-lg hover:bg-primary/90 transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-1 flex items-center gap-2 hover:cursor-pointer"
                  >
                    Get Started Free <ArrowRight className="h-5 w-5" />
                  </button>
                  <button
      type="button"
      aria-label="Read Documentation"
      onClick={() => window.open("https://docs.mailassist.abusha.tech", "_blank")}
      className="border-2 border-border text-foreground px-8 py-4 rounded-full font-semibold text-lg hover:border-primary hover:text-primary transition-all duration-300 flex items-center gap-2 bg-background hover:bg-accent/50 hover:cursor-pointer"
    >
      <Play className="h-5 w-5" />
      Read Docs
    </button>
                </>
              )}
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.8 }}
              className="animate-bounce"
            >
              <ChevronDown className="h-8 w-8 text-muted-foreground mx-auto" />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-card transition-colors duration-300">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.5 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-primary to-primary/80 rounded-full mb-4 text-primary-foreground shadow-md">
                  {stat.icon}
                </div>
                <div className="text-3xl md:text-4xl font-bold text-foreground mb-2">
                  <AnimatedCounter end={stat.number} />
                  {stat.label === "Uptime %" && "%"}
                  {stat.label === "Support Hours" && "/7"}
                  {(stat.label === "Emails Delivered" ||
                    stat.label === "Happy Users") &&
                    "+"}
                </div>
                <div className="text-muted-foreground">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gradient-to-r from-muted/20 to-muted/30 transition-colors duration-300">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent">
              Powerful Features
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Everything you need to send professional emails without the
              complexity
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                whileHover={{ y: -10, scale: 1.02 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-card rounded-2xl p-8 shadow-md hover:shadow-lg transition-all duration-300 border border-border"
              >
                <div
                  className={`inline-flex items-center justify-center w-16 h-16 bg-${feature.color}-50 dark:bg-${feature.color}-900/20 rounded-full mb-6`}
                >
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-4 text-foreground">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Templates Section */}
      <section className="py-20 bg-card transition-colors duration-300">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-foreground">
              Ready-Made Templates
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Professional email templates for every occasion, used by thousands
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {templates.map((template, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-gradient-to-br from-card to-muted/20 rounded-xl p-6 shadow-md hover:shadow-lg transition-all duration-300 border border-border"
              >
                <div className="flex items-center justify-center w-12 h-12 bg-primary/10 rounded-lg mb-4 text-primary">
                  {template.icon}
                </div>
                <h3 className="font-semibold text-foreground mb-2">
                  {template.name}
                </h3>
                <p className="text-sm text-muted-foreground">
                  Used {template.usage} times
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-gradient-to-r from-muted/20 to-accent/10 transition-colors duration-300">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent">
              How It Works
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Get started in just three simple steps
            </p>
          </motion.div>

          <div className="relative grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Connector line behind the steps */}
            <div className="hidden md:block absolute top-10 left-0 right-0 h-0.5 bg-gradient-to-r from-primary/30 to-accent/30" />

            {[
              {
                step: "01",
                title: "Sign Up & Get Credits",
                description:
                  "Create your account and receive starter credits to begin sending emails",
                icon: <Users />,
              },
              {
                step: "02",
                title: "Choose or Create",
                description:
                  "Select from templates or build custom emails with our drag-and-drop builder",
                icon: <FileText />,
              },
              {
                step: "03",
                title: "Send & Track",
                description:
                  "Send emails instantly and track delivery status in your dashboard",
                icon: <Send />,
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="text-center relative"
              >
                <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-primary to-primary/80 rounded-full mb-6 text-primary-foreground text-2xl font-bold z-10 shadow-md">
                  {item.step}
                </div>
                <h3 className="text-xl font-bold mb-4 text-foreground">
                  {item.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {item.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 bg-card transition-colors duration-300">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-foreground">
              Simple Pricing
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Pay only for what you use. No subscriptions, no hidden fees.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="max-w-md mx-auto bg-gradient-to-br from-card to-muted/20 rounded-2xl p-8 shadow-lg border border-border"
          >
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-primary to-primary/80 rounded-full mb-4 shadow-md">
                <DollarSign className="h-8 w-8 text-primary-foreground" />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-2">
                Pay-as-you-go
              </h3>
              <p className="text-muted-foreground">
                Perfect for everyone
              </p>
            </div>

            <div className="space-y-4 mb-8">
              {[
                "✓ Custom emails: 1 credit each",
                "✓ Template emails: 2 credits each",
                "✓ Batch emails: 0.5 credits each",
                "✓ Anonymous sending included",
                "✓ Full email history",
                "✓ 24/7 support",
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="flex items-center text-muted-foreground"
                >
                  <span>{feature}</span>
                </motion.div>
              ))}
            </div>

            {loggedIn ? (
              <>
                <button
                  onClick={() => router.push("/send")}
                  className="w-full bg-primary text-primary-foreground py-4 rounded-xl font-semibold text-lg hover:bg-primary/90 transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-1"
                >
                  Send Mail With Free Credits
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => router.push("/auth/signup")}
                  className="w-full bg-primary text-primary-foreground py-4 rounded-xl font-semibold text-lg hover:bg-primary/90 transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-1 hover:cursor-pointer"
                >
                  Start with Free Credits
                </button>
              </>
            )}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary via-primary/90 to-accent">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
              Ready to Transform Your Email Experience?
            </h2>
            <p className="text-xl text-white/90 mb-8 leading-relaxed">
              Join thousands of users who trust Mail Assist for their email
              needs. Start sending professional emails today.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => router.push("/")}
                className="bg-background text-primary px-8 py-4 rounded-full font-semibold text-lg hover:bg-accent/50 transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-1 flex items-center justify-center gap-2 hover:cursor-pointer"
              >
                Get Started Now <ArrowRight className="h-5 w-5" />
              </button>
              <button className="border-2 border-background text-background px-8 py-4 rounded-full font-semibold text-lg hover:bg-background hover:text-primary transition-all duration-300 flex items-center justify-center gap-2">
                <MessageSquare
                  className="h-5 w-5"
                  onClick={() => router.push("/contact")}
                />{" "}
                Contact Sales
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-muted text-foreground transition-colors duration-300">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Logo + Description */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Mail className="h-8 w-8 text-primary" />
              <span className="text-xl font-bold">Mail Assist</span>
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Seamless email delivery without the complexity.
            </p>
          </div>

          {/* Link Sections */}
          <div className="md:col-span-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-8">
            {footerSections.map((section) => (
              <div key={section.title}>
                <h3 className="font-semibold mb-4 text-foreground text-lg">
                  {section.title}
                </h3>
                <ul className="space-y-2">
                  {Object.entries(section.links).map(([label, href]) => (
                    <li key={label}>
                      <Link
                        href={href}
                        className="text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="border-t border-border mt-12 pt-6 text-center text-sm text-muted-foreground">
          <p>&copy; 2025 Mail Assist. All rights reserved.</p>
        </div>
      </div>
    </footer>
    </div>
  );
}
