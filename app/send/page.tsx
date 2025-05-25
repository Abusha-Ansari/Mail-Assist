"use client";

import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useState } from "react";

const templates = [
  {
    name: "Normal Email",
    description: "Simple email with subject and body",
    href: "/send/templates/normal",
    cost: 5,
  },
  {
    name: "Job Offer",
    description: "Send a professional job offer",
    href: "/send/templates/job-offer",
    cost: 10,
  },
  {
    name: "Interview Invite",
    description: "Invite a candidate for an interview",
    href: "/send/templates/interview-invite",
    cost: 10,
  },
  {
    name: "Event Reminder",
    description: "Remind someone about an upcoming event",
    href: "/send/templates/event-reminder",
    cost: 10,
  },
  {
    name: "Thank You",
    description: "Send a quick thank-you message",
    href: "/send/templates/thank-you",
    cost: 10,
  },
  {
    name: "Payment Confirmation",
    description: "Notify users of successful payment",
    href: "/send/templates/payment-confirmation",
    cost: 10,
  },
  {
    name: "Custom Template",
    description: "Design your own (Coming Soon)",
    href: "/send/templates/custom",
    cost: 10,
    disabled: true,
  },
];

export default function SendMailHome() {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredTemplates = templates.filter((template) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      template.name.toLowerCase().includes(searchLower) ||
      template.description.toLowerCase().includes(searchLower)
    );
  });

  return (
    <div className="container p-12">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h1 className="text-3xl font-bold text-foreground">Choose a Template</h1>
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search templates..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {filteredTemplates.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No templates found matching your search.</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 gap-6">
          {filteredTemplates.map((template) => (
            <Card key={template.name}>
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-2 text-foreground">{template.name}</h2>
                <p className="text-sm text-muted-foreground mb-4">{template.description}</p>
                <Button asChild disabled={template.disabled}>
                  <Link href={template.href}>
                    {template.disabled ? "Coming Soon" : `Use Template (${template.cost} credits)`}
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}