"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Search, FileText, ArrowRight, Zap } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
// import { useTheme } from "next-themes";
import { useUser } from "@/context/UserContext";
import { useRouter } from "next/navigation";

// SearchBar Component
interface SearchBarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

function SearchBar({ searchTerm, onSearchChange }: SearchBarProps) {
  return (
    <div className="relative w-full sm:w-96 group">
      <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-primary/10 rounded-xl blur-xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-500" />
      <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-all duration-300 z-10" />
      <Input
        type="search"
        placeholder="Search templates..."
        className="relative pl-12 h-14 border-2 border-border/50 focus:ring-4 focus:ring-primary/20 focus:border-primary/50 transition-all duration-300 bg-card/80 backdrop-blur-sm shadow-lg hover:shadow-xl text-lg rounded-xl focus:bg-card/90"
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
      />
    </div>
  );
}

// EmptyState Component
interface EmptyStateProps {
  searchTerm: string;
}

function EmptyState({ searchTerm }: EmptyStateProps) {
  return (
    <div className="text-center py-20 animate-fade-in">
      <div className="mx-auto w-32 h-32 bg-gradient-to-br from-primary/10 to-primary/5 rounded-full flex items-center justify-center mb-8 shadow-2xl animate-scale-in relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-primary/5 animate-pulse" />
        {searchTerm ? (
          <Search className="h-12 w-12 text-primary relative z-10" />
        ) : (
          <FileText className="h-12 w-12 text-primary relative z-10" />
        )}
      </div>
      <h3 className="text-3xl font-bold bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent mb-4 animate-slide-in-right">
        {searchTerm ? "No templates found" : "No templates available"}
      </h3>
      <p
        className="text-muted-foreground max-w-lg mx-auto text-lg leading-relaxed animate-slide-in-right opacity-0"
        style={{ animationDelay: "0.2s", animationFillMode: "forwards" }}
      >
        {searchTerm
          ? `No templates match "${searchTerm}". Try adjusting your search terms.`
          : "There are currently no email templates available."}
      </p>
    </div>
  );
}

// TemplateCard Component
interface TemplateCardProps {
  name: string;
  description: string;
  href: string;
  cost: number;
  disabled?: boolean;
}

function TemplateCard({
  name,
  description,
  href,
  cost,
  disabled = false,
}: TemplateCardProps) {
  const gradients = [
    "from-primary/10 to-primary/5",
    "from-primary/10 to-accent/10",
    "from-green-500/10 to-emerald-500/10",
    "from-orange-500/10 to-red-500/10",
    "from-primary/10 to-primary/5",
    "from-accent/10 to-primary/10",
    "from-primary/5 to-primary/10",
  ];

  const borderColors = [
    "hover:border-primary/30 hover:shadow-primary/20",
    "hover:border-primary/30 hover:shadow-primary/20",
    "hover:border-green-500/30 hover:shadow-green-500/20",
    "hover:border-orange-500/30 hover:shadow-orange-500/20",
    "hover:border-primary/30 hover:shadow-primary/20",
    "hover:border-accent/30 hover:shadow-accent/20",
    "hover:border-primary/30 hover:shadow-primary/20",
  ];

  const gradient = gradients[Math.abs(name.length) % gradients.length];
  const borderColor = borderColors[Math.abs(name.length) % borderColors.length];

  return (
    <Card
      className={`group relative overflow-hidden border-2 border-border/50 bg-card/90 backdrop-blur-sm transition-all duration-500 hover:-translate-y-3 hover:scale-[1.03] ${borderColor} hover:shadow-2xl rounded-2xl`}
    >
      <div
        className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 transition-opacity duration-500 group-hover:opacity-100`}
      />

      {/* Animated background pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-primary-foreground/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

      <CardContent className="relative z-10 p-8">
        <div className="mb-6 flex items-start justify-between">
          <h3 className="text-2xl font-bold leading-tight bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent transition-all duration-300 group-hover:from-foreground group-hover:to-foreground/80">
            {name}
          </h3>

          <Badge
            variant={disabled ? "secondary" : "default"}
            className="flex items-center gap-2 px-4 py-2 text-sm font-bold shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-300 bg-gradient-to-r from-amber-400 to-orange-500 text-white border-0 rounded-full"
          >
            <Zap className="h-4 w-4 animate-pulse" />
            {cost}
          </Badge>
        </div>

        <p className="mb-8 text-base leading-relaxed text-muted-foreground transition-colors duration-300 group-hover:text-foreground">
          {description}
        </p>

        <Button
          asChild
          disabled={disabled}
          className="group/button relative h-14 w-full text-lg font-bold shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 bg-primary hover:bg-primary/90 border-0 rounded-xl overflow-hidden"
          size="lg"
        >
          <Link
            href={href}
            className="relative flex items-center justify-center gap-3"
          >
            <span className="relative z-10 transition-transform duration-300 group-hover/button:scale-105">
              {disabled ? "Coming Soon" : "Use Template"}
            </span>

            {!disabled && (
              <ArrowRight className="relative z-10 h-5 w-5 transition-all duration-300 group-hover/button:translate-x-2 group-hover/button:scale-110" />
            )}

            {/* Animated background shimmer */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full transition-transform duration-1000 group-hover/button:translate-x-full" />
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}

const templates = [
  {
    name: "Custom Template",
    description:
      "Design your own custom template with our drag-and-drop builder",
    href: "/send/customTemplate",
    cost: 10,
    disabled: false,
  },
  {
    name: "Normal Email",
    description:
      "Simple email with subject and body for everyday communication",
    href: "/send/templates/normal",
    cost: 5,
  },
  {
    name: "Job Offer",
    description: "Send a professional job offer with all necessary details",
    href: "/send/templates/job-offer",
    cost: 10,
  },
  {
    name: "Interview Invite",
    description: "Invite a candidate for an interview with scheduling options",
    href: "/send/templates/interview-invite",
    cost: 10,
  },
  {
    name: "Event Reminder",
    description: "Remind someone about an upcoming event or meeting",
    href: "/send/templates/event-reminder",
    cost: 10,
  },
  {
    name: "Thank You",
    description: "Send a personalized thank-you message to show appreciation",
    href: "/send/templates/thank-you",
    cost: 10,
  },
  {
    name: "Payment Confirmation",
    description: "Notify users of successful payment and transaction details",
    href: "/send/templates/payment-confirmation",
    cost: 10,
  },
];

export default function SendMailHome() {
  const [searchTerm, setSearchTerm] = useState("");
  // const { theme, setTheme } = useTheme();
  // const originalTheme = useRef<string | undefined>(undefined);
  const { loggedIn } = useUser();
  const router = useRouter();

  // useEffect(() => {
  //   // Save the original theme
  //   originalTheme.current = theme;

  //   // Change to the desired theme (e.g., dark)
  //   setTheme("light");

  //   return () => {
  //     // Restore the original theme
  //     if (originalTheme.current) {
  //       setTheme("dark");
  //     }
  //   };
  // }, [theme, setTheme]);

  const filteredTemplates = templates.filter((template) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      template.name.toLowerCase().includes(searchLower) ||
      template.description.toLowerCase().includes(searchLower)
    );
  });

  useEffect(() => {
    if (!loggedIn) {
      router.push("/auth/login");
    }
  }, [loggedIn, router]);

  if (!loggedIn) {
    return null; // Prevent render while redirecting
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-muted/10 relative overflow-hidden">
      {/* Enhanced background decorations */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(var(--primary),0.1),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(var(--primary),0.1),transparent_50%)]" />
      <div
        className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-primary/20 to-primary/10 rounded-full blur-3xl animate-pulse"
        style={{ animationDuration: "4s" }}
      />
      <div
        className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-primary/20 to-accent/20 rounded-full blur-3xl animate-pulse"
        style={{ animationDuration: "6s", animationDelay: "2s" }}
      />
      <div
        className="absolute top-1/2 left-1/2 w-64 h-64 bg-gradient-to-r from-primary/10 to-primary/5 rounded-full blur-2xl animate-pulse -translate-x-1/2 -translate-y-1/2"
        style={{ animationDuration: "8s", animationDelay: "1s" }}
      />

      <div className="container mx-auto px-4 py-20 relative z-10">
        {/* Enhanced Header Section */}
        <div className="text-center mb-20 animate-fade-in">
          <div className="relative inline-block mb-8">
            <h1 className="text-6xl md:text-8xl font-black tracking-tight bg-gradient-to-r from-foreground via-primary to-primary/80 bg-clip-text text-transparent relative z-10">
              Choose Your Template
            </h1>
            <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-primary/10 blur-2xl -z-10 animate-pulse" />
          </div>
          <p
            className="text-xl md:text-2xl text-muted-foreground max-w-4xl mx-auto leading-relaxed animate-slide-in-right font-medium"
            style={{ animationDelay: "0.3s" }}
          >
            Select from our collection of professionally designed email
            templates to create{" "}
            <span className="bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent font-bold">
              engaging communications
            </span>
          </p>
        </div>

        {/* Enhanced Search Section */}
        <div
          className="flex justify-center mb-20 animate-scale-in"
          style={{ animationDelay: "0.6s" }}
        >
          <SearchBar searchTerm={searchTerm} onSearchChange={setSearchTerm} />
        </div>

        {/* Enhanced Results Section */}
        {filteredTemplates.length === 0 ? (
          <EmptyState searchTerm={searchTerm} />
        ) : (
          <div className="animate-fade-in" style={{ animationDelay: "0.9s" }}>
            <div className="flex items-center justify-between mb-12">
              <div className="relative">
                <p className="text-foreground text-xl font-semibold bg-card/80 backdrop-blur-sm px-6 py-3 rounded-full shadow-lg border border-border/50">
                  {searchTerm
                    ? `Found ${filteredTemplates.length} template${filteredTemplates.length !== 1 ? "s" : ""} matching "${searchTerm}"`
                    : `${filteredTemplates.length} template${filteredTemplates.length !== 1 ? "s" : ""} available`}
                </p>
                <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-primary/5 rounded-full blur opacity-50" />
              </div>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-10">
              {filteredTemplates.map((template, index) => (
                <div
                  key={template.name}
                  className="animate-fade-in"
                  style={{
                    animationDelay: `${1.2 + index * 0.15}s`,
                    animationFillMode: "both",
                  }}
                >
                  <TemplateCard
                    name={template.name}
                    description={template.description}
                    href={template.href}
                    cost={template.cost}
                    disabled={template.disabled}
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
