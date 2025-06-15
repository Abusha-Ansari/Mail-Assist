"use client";
import React, { useState, useEffect, useRef } from "react";
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
import { useTheme } from "next-themes";

type AnimatedCounterProps = { end: number; duration?: number };

const AnimatedCounter = ({ end, duration = 2000 }: AnimatedCounterProps) => {
  const [count, setCount] = useState(0);

  const { theme, setTheme } = useTheme();
  const originalTheme = useRef<string | undefined>(undefined);

  useEffect(() => {
    // Save the original theme
    originalTheme.current = theme;

    // Change to the desired theme (e.g., dark)
    setTheme("dark");

    return () => {
      setTheme("dark");
    };
  }, [theme, setTheme]);

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
      icon: <Send className="h-8 w-8 text-blue-500" />,
      title: "Custom Email Sending",
      description:
        "Send personalized emails to any recipient with our easy-to-use interface",
      color: "blue",
    },
    {
      icon: <FileText className="h-8 w-8 text-purple-500" />,
      title: "Predefined Templates",
      description:
        "Choose from ready-made templates for interviews, events, thank you notes, and more",
      color: "purple",
    },
    {
      icon: <Sparkles className="h-8 w-8 text-pink-500" />,
      title: "Custom Email Builder",
      description:
        "Drag-and-drop interface to create your own templates with placeholders",
      color: "pink",
    },
    {
      icon: <Upload className="h-8 w-8 text-green-500" />,
      title: "Batch Email Sending",
      description:
        "Upload CSV files and send personalized emails to multiple contacts at once",
      color: "green",
    },
    {
      icon: <Eye className="h-8 w-8 text-orange-500" />,
      title: "Email History Dashboard",
      description:
        "View records of all emails sent with full content and delivery status",
      color: "orange",
    },
    {
      icon: <Shield className="h-8 w-8 text-red-500" />,
      title: "Anonymous Sending",
      description:
        "Send emails without revealing your identity for sensitive communications",
      color: "red",
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

  return (
    <div className="min-h-screen overflow-x-hidden bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900 transition-colors duration-300">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <motion.div
          style={{ y }}
          className="absolute inset-0 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-pink-600/20 dark:from-blue-400/10 dark:via-purple-400/10 dark:to-pink-400/10"
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
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mb-6">
                <Mail className="h-10 w-10 text-white" />
              </div>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 dark:from-gray-100 dark:via-blue-100 dark:to-purple-100 bg-clip-text text-transparent"
            >
              Mail Assist
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed"
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
                    className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-full font-semibold text-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                  >
                    Go to Dashboard
                  </button>
                  <button
                    onClick={() => router.push("/send")}
                    className="border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 px-8 py-4 rounded-full font-semibold text-lg hover:border-blue-500 hover:text-blue-600 dark:hover:border-blue-400 dark:hover:text-blue-400 transition-all duration-300 bg-white dark:bg-gray-800"
                  >
                    Send Mail Now
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => router.push("/auth/signup")}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-full font-semibold text-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center gap-2"
                  >
                    Get Started Free <ArrowRight className="h-5 w-5" />
                  </button>
                  <button className="border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 px-8 py-4 rounded-full font-semibold text-lg hover:border-blue-500 hover:text-blue-600 dark:hover:border-blue-400 dark:hover:text-blue-400 transition-all duration-300 flex items-center gap-2 bg-white dark:bg-gray-800">
                    <Play className="h-5 w-5" /> Watch Demo
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
              <ChevronDown className="h-8 w-8 text-gray-400 dark:text-gray-500 mx-auto" />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-white dark:bg-gray-800 transition-colors duration-300">
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
                <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mb-4 text-white">
                  {stat.icon}
                </div>
                <div className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
                  <AnimatedCounter end={stat.number} />
                  {stat.label === "Uptime %" && "%"}
                  {stat.label === "Support Hours" && "/7"}
                  {(stat.label === "Emails Delivered" ||
                    stat.label === "Happy Users") &&
                    "+"}
                </div>
                <div className="text-gray-600 dark:text-gray-400">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gradient-to-r from-gray-50 to-blue-50 dark:from-gray-900 dark:to-blue-900 transition-colors duration-300">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-gray-900 to-blue-900 dark:from-gray-100 dark:to-blue-100 bg-clip-text text-transparent">
              Powerful Features
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
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
                className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg hover:shadow-2xl dark:shadow-gray-900/20 transition-all duration-300 border border-gray-100 dark:border-gray-700"
              >
                <div
                  className={`inline-flex items-center justify-center w-16 h-16 bg-${feature.color}-50 dark:bg-${feature.color}-900/20 rounded-full mb-6`}
                >
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Templates Section */}
      <section className="py-20 bg-white dark:bg-gray-800 transition-colors duration-300">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900 dark:text-white">
              Ready-Made Templates
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
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
                className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-700 dark:to-gray-800 rounded-xl p-6 shadow-lg hover:shadow-xl dark:shadow-gray-900/20 transition-all duration-300 border border-gray-100 dark:border-gray-600"
              >
                <div className="flex items-center justify-center w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg mb-4 text-blue-600 dark:text-blue-400">
                  {template.icon}
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                  {template.name}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Used {template.usage} times
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 transition-colors duration-300">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-gray-900 to-blue-900 dark:from-gray-100 dark:to-blue-100 bg-clip-text text-transparent">
              How It Works
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Get started in just three simple steps
            </p>
          </motion.div>

          <div className="relative grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Connector line behind the steps */}
            <div className="hidden md:block absolute top-10 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-200 to-purple-200 dark:from-blue-600 dark:to-purple-600" />

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
                <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mb-6 text-white text-2xl font-bold z-10">
                  {item.step}
                </div>
                <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
                  {item.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  {item.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 bg-white dark:bg-gray-800 transition-colors duration-300">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900 dark:text-white">
              Simple Pricing
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Pay only for what you use. No subscriptions, no hidden fees.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="max-w-md mx-auto bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-2xl p-8 shadow-xl border border-blue-100 dark:border-blue-800"
          >
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mb-4">
                <DollarSign className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Pay-as-you-go
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
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
                  className="flex items-center text-gray-700 dark:text-gray-300"
                >
                  <span>{feature}</span>
                </motion.div>
              ))}
            </div>

            {loggedIn ? (
              <>
                <button
                  onClick={() => router.push("/send")}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 rounded-xl font-semibold text-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                >
                  Send Mail With Free Credits
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => router.push("/auth/signup")}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 rounded-xl font-semibold text-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                >
                  Start with Free Credits
                </button>
              </>
            )}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600">
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
                className="bg-white text-blue-600 px-8 py-4 rounded-full font-semibold text-lg hover:bg-gray-100 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center justify-center gap-2"
              >
                Get Started Now <ArrowRight className="h-5 w-5" />
              </button>
              <button className="border-2 border-white text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-white hover:text-blue-600 transition-all duration-300 flex items-center justify-center gap-2">
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
      <footer className="py-12 bg-gray-900 dark:bg-gray-950 text-white transition-colors duration-300">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Mail className="h-8 w-8 text-blue-400" />
                <span className="text-xl font-bold">Mail Assist</span>
              </div>
              <p className="text-gray-400">
                Seamless email delivery without the complexity.
              </p>
            </div>

            {[
              {
                title: "Product",
                links: ["Features", "Templates", "Pricing", "API"],
              },
              {
                title: "Company",
                links: ["About", "Blog", "Careers", "Contact"],
              },
              {
                title: "Support",
                links: ["Help Center", "Documentation", "Status", "Community"],
              },
            ].map((section, index) => (
              <div key={index}>
                <h3 className="font-semibold mb-4">{section.title}</h3>
                <ul className="space-y-2">
                  {section.links.map((link, linkIndex) => (
                    <li key={linkIndex}>
                      <a
                        href="#"
                        className="text-gray-400 hover:text-white transition-colors"
                      >
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="border-t border-gray-800 dark:border-gray-700 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 Mail Assist. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
