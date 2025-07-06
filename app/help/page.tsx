"use client";

import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  HelpCircle,
  AlertTriangle,
  Mail,
  Search,
  Clock,
  CreditCard,
  Database,
  FileText,
  RefreshCw,
  LogOut,
  CheckCircle,
  ExternalLink
} from "lucide-react";
import Link from "next/link";
// import { useTheme } from "next-themes";

const faqs = [
  {
    id: "send-email",
    question: "How do I send an email using Mail Assist?",
    answer: "Navigate to the Send Mail page, choose a template or custom email, fill out the form with recipient details and your message, then hit send. You can also personalize emails with dynamic placeholders like {{name}} and {{company}}.",
    icon: Mail
  },
  {
    id: "credits-deducted",
    question: "How are credits deducted?",
    answer: "Credits are deducted based on usage: 5 credits for custom emails, 10 credits for predefined templates. Your current balance is always visible on your dashboard, and you'll see real-time updates after each send.",
    icon: CreditCard
  },
  {
    id: "custom-template",
    question: "How do I create a custom template?",
    answer: "Use the template builder in the Send Mail section. You can drag and drop elements, add rich text styling, insert placeholders, and save your design to reuse it later. All custom templates are stored in your account.",
    icon: FileText
  },
  {
    id: "schedule-emails",
    question: "Can I schedule emails?",
    answer: "Yes! When composing your email, set the desired delivery time using the schedule option in the form. Mail Assist will automatically send your email at the specified time using our reliable scheduling system.",
    icon: Clock
  },
  {
    id: "view-sent-emails",
    question: "Where can I view my sent emails?",
    answer: "Go to the Dashboard to see all your email activity. You can filter by date, search by recipient, and view detailed information including HTML previews, delivery status, and credit usage for each email.",
    icon: Database
  },
  {
    id: "email-fails",
    question: "What do I do if my email fails to send?",
    answer: "First, check your internet connection and try again. If the issue persists, contact our support team with your email ID and error details. We'll investigate and resolve the issue quickly.",
    icon: AlertTriangle
  }
];

const troubleshootingTips = [
  {
    issue: "Emails stuck in 'Sending'",
    solution: "Refresh the page or check your network connection. If the issue persists, the email may still be processing in our queue.",
    icon: RefreshCw
  },
  {
    issue: "Credits not updating",
    solution: "Log out and log back in to refresh your session. Credits should update immediately after this.",
    icon: LogOut
  },
  {
    issue: "Placeholders not rendering",
    solution: "Make sure all required fields in your CSV or form are filled out correctly. Empty placeholder values will not render properly.",
    icon: CheckCircle
  }
];

const trustSignals = [
  "Powered by Resend API",
  "Built on Next.js + Supabase",
  "24/7 Email Delivery",
  "Enterprise-Grade Security"
];


export default function HelpPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredFaqs = faqs.filter(faq =>
    faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-muted/30">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(var(--primary),0.1),transparent_50%)]" />
      
      {/* Hero Section */}
      <section className="relative container mx-auto px-4 py-16 text-center">
        <div className="max-w-4xl mx-auto animate-fade-in">
          <div className="relative mb-8">
            <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 to-primary/10 rounded-full blur-xl" />
            <HelpCircle className="relative h-20 w-20 mx-auto text-primary animate-scale-in" />
          </div>
          
          <h1 className="text-4xl md:text-6xl font-extrabold mb-6 bg-gradient-to-r from-foreground via-primary to-primary/80 bg-clip-text text-transparent">
            Help & Support
          </h1>
          
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto bg-card/50 backdrop-blur-sm rounded-lg px-6 py-4 border border-border/20">
            Need help with Mail Assist? Find answers to common questions or contact us directly for personalized support.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Button 
              size="lg" 
              className="bg-primary hover:bg-primary/90 transform transition-all duration-300 hover:scale-105 shadow-md hover:shadow-lg"
              onClick={() => window.open('mailto:support@mailassist.com', '_blank')}
            >
              <Mail className="w-4 h-4 mr-2" />
              Contact Support
            </Button>
            <Link href="/">
              <Button 
                variant="outline" 
                size="lg"
                className="bg-card/70 backdrop-blur-sm border-border/20 hover:bg-card/90 transform transition-all duration-300 hover:scale-105"
              >
                Back to Dashboard
              </Button>
            </Link>
          </div>
          
          {/* Trust Signals */}
          <div className="flex flex-wrap justify-center gap-3 mb-16">
            {trustSignals.map((signal, index) => (
              <Badge 
                key={index} 
                variant="secondary" 
                className="bg-card/70 backdrop-blur-sm border border-border/20 text-sm py-1 px-3 animate-scale-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {signal}
              </Badge>
            ))}
          </div>
        </div>
      </section>

      {/* Search Section */}
      <section className="relative container mx-auto px-4 pb-8">
        <div className="max-w-2xl mx-auto animate-fade-in">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search Help Topics..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-card/80 backdrop-blur-sm border-border/20 focus:bg-card transition-all duration-300"
            />
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="relative container mx-auto px-4 pb-16">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12 animate-fade-in">
            <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent">
              Frequently Asked Questions
            </h2>
            <p className="text-muted-foreground">
              Find quick answers to the most common questions about Mail Assist
            </p>
          </div>

          {filteredFaqs.length > 0 ? (
            <Card className="bg-card/80 backdrop-blur-sm border-border/20 animate-scale-in shadow-md">
              <CardContent className="p-6">
                <Accordion type="single" collapsible className="w-full">
                  {filteredFaqs.map((faq, index) => (
                    <AccordionItem 
                      key={faq.id} 
                      value={faq.id}
                      className="animate-scale-in"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <AccordionTrigger className="text-left hover:no-underline group">
                        <div className="flex items-center gap-3">
                          <div className="rounded-full bg-gradient-to-br from-primary/10 to-accent/10 p-2 group-hover:scale-110 transition-transform duration-200 shadow-sm">
                            <faq.icon className="h-4 w-4 text-primary" />
                          </div>
                          <span className="font-medium">{faq.question}</span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="text-muted-foreground pt-4 pl-11">
                        {faq.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            </Card>
          ) : (
            <Card className="bg-card/80 backdrop-blur-sm border-border/20 animate-scale-in shadow-md">
              <CardContent className="p-8 text-center">
                <Search className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No results found</h3>
                <p className="text-muted-foreground">
                  Try searching with different keywords or contact our support team for help.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </section>

      {/* Troubleshooting Section */}
      <section className="relative container mx-auto px-4 pb-16">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12 animate-fade-in">
            <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent">
              Quick Troubleshooting
            </h2>
            <p className="text-muted-foreground">
              Common issues and their solutions
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {troubleshootingTips.map((tip, index) => (
              <Card 
                key={index} 
                className="group hover:shadow-lg transition-all duration-300 hover:scale-105 bg-card/80 backdrop-blur-sm border-border/20 animate-scale-in shadow-md"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="rounded-full bg-gradient-to-br from-orange-100/50 to-red-100/50 dark:from-orange-900/20 dark:to-red-900/20 p-3 group-hover:scale-110 transition-transform duration-200 shadow-sm">
                      <tip.icon className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                    </div>
                  </div>
                  <CardTitle className="text-lg text-orange-600 dark:text-orange-400">
                    {tip.issue}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {tip.solution}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Support Section */}
      <section className="relative container mx-auto px-4 pb-16">
        <Card className="max-w-2xl mx-auto bg-gradient-to-r from-primary/5 to-accent/5 backdrop-blur-sm border-border/20 animate-fade-in shadow-lg">
          <CardHeader className="text-center">
            <div className="rounded-full bg-gradient-to-br from-primary/10 to-accent/10 p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center shadow-md">
              <Mail className="h-8 w-8 text-primary" />
            </div>
            <CardTitle className="text-2xl bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent">
              Still Need Help?
            </CardTitle>
            <CardDescription className="text-lg">
              Our support team is here to help you succeed
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-6">
            <div className="space-y-3">
              <p className="text-muted-foreground">
                {`Can't find what you're looking for? Send us an email and we'll get back to you within 24 hours.`}
              </p>
              <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>Average response time: 4 hours</span>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-primary hover:bg-primary/90 transform transition-all duration-300 hover:scale-105 shadow-md hover:shadow-lg"
                onClick={() => window.open('mailto:support@mailassist.com', '_blank')}
              >
                <Mail className="w-4 h-4 mr-2" />
                Email Support
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                className="bg-card/70 backdrop-blur-sm border-border/20 hover:bg-card/90 transform transition-all duration-300 hover:scale-105"
                // onClick={() => window.open('https://docs.lovable.dev/', '_blank')}
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                Documentation
              </Button>
            </div>
            
            <div className="pt-4 border-t border-border/20">
              <p className="text-sm text-muted-foreground">
                <strong>Email:</strong> support@mailassist.com
              </p>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
};