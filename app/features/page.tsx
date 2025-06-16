"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Mail,
  FileText,
  Database,
  Upload,
  User,
  CreditCard,
  Clock,
  Search,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { useTheme } from "next-themes";

const features = [
  {
    id: "smart-sending",
    title: "Smart Email Sending",
    description:
      "Send custom emails or choose from predefined professional templates with dynamic placeholder support.",
    icon: Mail,
    details: [
      "Custom email creation with rich text editor",
      "Dynamic placeholders ({{name}}, {{company}})",
      "Resend API integration for reliable delivery",
      "Professional template library",
    ],
    credits: "5-10 credits per send",
  },
  {
    id: "templates",
    title: "Predefined Templates",
    description:
      "Ready-to-use professional templates for common business communications.",
    icon: FileText,
    details: [
      "Interview Invite, Event Reminder templates",
      "Thank You, Payment Confirmation templates",
      "Live preview before sending",
      "Auto credit deduction system",
    ],
    credits: "10 credits per template",
  },
  {
    id: "template-builder",
    title: "Custom Template Builder",
    description:
      "Drag-and-drop email builder with rich text styling and placeholder insertion.",
    icon: FileText,
    details: [
      "Drag-and-drop interface",
      "Rich text styling options",
      "Placeholder insertion tool",
      "Save and reuse templates",
    ],
    credits: "5 credits per custom send",
  },
  {
    id: "batch-emailing",
    title: "Batch Emailing",
    description:
      "Upload CSV files and send personalized emails to multiple recipients automatically.",
    icon: Upload,
    details: [
      "CSV file upload support",
      "Automatic personalization",
      "Bulk email generation",
      "Real-time progress tracking",
    ],
    credits: "Credits per recipient",
  },
  {
    id: "dashboard",
    title: "User Dashboard",
    description:
      "Comprehensive dashboard to manage your credits, view history, and track performance.",
    icon: Database,
    details: [
      "Credits balance and usage tracking",
      "Searchable email logs",
      "Filterable and paginated history",
      "Detailed email previews",
    ],
    credits: "Free to use",
  },
  {
    id: "credits-system",
    title: "Credits System",
    description:
      "Flexible credit-based pricing with transparent usage tracking.",
    icon: CreditCard,
    details: [
      "Start with 300 free credits",
      "Clear credit deduction system",
      "Easy credit recharging",
      "Usage analytics",
    ],
    credits: "300 credits included",
  },
  {
    id: "scheduling",
    title: "Scheduled Sending",
    description:
      "Schedule emails to be sent at the perfect time with reliable delivery.",
    icon: Clock,
    details: [
      "Schedule emails for future delivery",
      "Cloudflare Worker integration",
      "Reliable scheduled delivery",
      "Timezone support",
    ],
    credits: "Same as regular sending",
  },
  {
    id: "authentication",
    title: "Authentication & Profiles",
    description: "Secure user management with profile linking and API access.",
    icon: User,
    details: [
      "Supabase Auth integration",
      "User profile management",
      "Secure API routes",
      "Email logs linking",
    ],
    credits: "Free to use",
  },
];

const trustSignals = [
  "Powered by Resend API",
  "Built with Next.js + Supabase",
  "Cloudflare Worker Integration",
  "Enterprise-Grade Security",
];

export default function FeaturesPage() {
  const { theme, setTheme } = useTheme();
  const originalTheme = useRef<string | undefined>(undefined);

  useEffect(() => {
    // Save the original theme only once on mount
    originalTheme.current = theme;

    // Force dark theme
    setTheme("dark");

    return () => {
      // Restore original theme on unmount
      if (originalTheme.current) {
        setTheme(originalTheme.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setTheme]);
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-blue-900/20 dark:to-indigo-900/30">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.1),transparent_50%)]" />

      {/* Hero Section */}
      <section className="relative container mx-auto px-4 py-16 text-center text-black dark:text-white">
        <div className="max-w-4xl mx-auto animate-fade-in">
          <div className="relative mb-8">
            <div className="absolute -inset-4 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full blur-xl" />
            <Mail className="relative h-20 w-20 mx-auto text-primary animate-scale-in" />
          </div>

          <h1 className="text-4xl md:text-6xl font-extrabold mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
            Mail Assist Features
          </h1>

          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-lg px-6 py-4 border border-white/20 text-black dark:text-white">
            Discover all the powerful features that make Mail Assist the perfect
            solution for creating, customizing, and sending emails efficiently.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Link href="/">
              <Button
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transform transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
              >
                Start Sending Smarter Emails Today
              </Button>
            </Link>
            <Link href="/send">
              <Button
                variant="outline"
                size="lg"
                className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border-white/20 hover:bg-white/90 dark:hover:bg-gray-800/90 transform transition-all duration-300 hover:scale-105 text-black dark:text-white"
              >
                View Templates
              </Button>
            </Link>
          </div>

          {/* Trust Signals */}
          <div className="flex flex-wrap justify-center gap-3 mb-16">
            {trustSignals.map((signal, index) => (
              <Badge
                key={index}
                variant="secondary"
                className="text-black dark:text-white bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border border-white/20 text-sm py-1 px-3 animate-scale-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {signal}
              </Badge>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="relative container mx-auto px-4 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {features.map((feature, index) => (
            <Card
              key={feature.id}
              className="text-black dark:text-white group hover:shadow-2xl transition-all duration-300 hover:scale-105 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-white/20 relative overflow-hidden animate-scale-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              <CardHeader className="relative z-10">
                <div className="flex items-center gap-3 mb-3">
                  <div className="rounded-full bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 p-3">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {feature.credits}
                  </Badge>
                </div>

                <CardTitle className="text-xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  {feature.title}
                </CardTitle>

                <CardDescription className="text-sm leading-relaxed">
                  {feature.description}
                </CardDescription>
              </CardHeader>

              <CardContent className="relative z-10">
                <ul className="space-y-2">
                  {feature.details.map((detail, detailIndex) => (
                    <li
                      key={detailIndex}
                      className="flex items-start gap-2 text-sm text-muted-foreground"
                    >
                      <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                      {detail}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Responsive & Accessible UI Feature */}
      <section className="relative container mx-auto px-4 pb-16 text-black dark:text-white">
        <Card className="max-w-4xl mx-auto bg-gradient-to-r from-blue-500/10 to-purple-500/10 backdrop-blur-sm border-white/20 animate-fade-in">
          <CardHeader className="text-center">
            <div className="rounded-full bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <Search className="h-8 w-8 text-primary" />
            </div>
            <CardTitle className="text-2xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Responsive & Accessible UI
            </CardTitle>
            <CardDescription className="text-lg">
              Built with modern technologies for the best user experience
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h4 className="font-semibold text-primary">Technology Stack</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                    Built with Next.js & TypeScript
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                    Styled with Tailwind CSS
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                    Enhanced with ShadCN components
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                    Animated with Framer Motion
                  </li>
                </ul>
              </div>
              <div className="space-y-3">
                <h4 className="font-semibold text-primary">User Experience</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                    Mobile-friendly responsive design
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                    Accessible for all users
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                    Microinteractions & hover effects
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                    Smooth animations & transitions
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Call to Action */}
      <section className="relative container mx-auto px-4 pb-16 text-center text-black dark:text-white">
        <div className="max-w-2xl mx-auto animate-fade-in">
          <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Ready to Transform Your Email Experience?
          </h2>
          <p className="text-muted-foreground mb-8 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-lg px-6 py-3 border border-white/20">
            Join thousands of users who are already sending smarter, more
            efficient emails with Mail Assist.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/">
              <Button
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transform transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
              >
                Get Started Free
              </Button>
            </Link>
            <Link href="/buy-credits">
              <Button
                variant="outline"
                size="lg"
                className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border-white/20 hover:bg-white/90 dark:hover:bg-gray-800/90 transform transition-all duration-300 hover:scale-105"
              >
                View Pricing
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
