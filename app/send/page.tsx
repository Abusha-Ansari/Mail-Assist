// "use client";

// import { useState } from "react";
// import Link from "next/link";
// import { Search, FileText, ArrowRight, Zap } from "lucide-react";
// import { Input } from "@/components/ui/input";
// import { Card, CardContent } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Badge } from "@/components/ui/badge";

// // SearchBar Component
// interface SearchBarProps {
//   searchTerm: string;
//   onSearchChange: (value: string) => void;
// }

// function SearchBar({ searchTerm, onSearchChange }: SearchBarProps) {
//   return (
//     <div className="relative w-full sm:w-80">
//       <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
//       <Input
//         type="search"
//         placeholder="Search templates..."
//         className="pl-10 h-11 border-2 focus:ring-2 focus:ring-primary/20"
//         value={searchTerm}
//         onChange={(e) => onSearchChange(e.target.value)}
//       />
//     </div>
//   );
// }

// // EmptyState Component
// interface EmptyStateProps {
//   searchTerm: string;
// }

// function EmptyState({ searchTerm }: EmptyStateProps) {
//   return (
//     <div className="text-center py-16">
//       <div className="mx-auto w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-6">
//         {searchTerm ? (
//           <Search className="h-10 w-10 text-muted-foreground" />
//         ) : (
//           <FileText className="h-10 w-10 text-muted-foreground" />
//         )}
//       </div>
//       <h3 className="text-xl font-semibold text-foreground mb-2">
//         {searchTerm ? "No templates found" : "No templates available"}
//       </h3>
//       <p className="text-muted-foreground max-w-md mx-auto">
//         {searchTerm 
//           ? `No templates match "${searchTerm}". Try adjusting your search terms.`
//           : "There are currently no email templates available."
//         }
//       </p>
//     </div>
//   );
// }

// // TemplateCard Component
// interface TemplateCardProps {
//   name: string;
//   description: string;
//   href: string;
//   cost: number;
//   disabled?: boolean;
// }

// function TemplateCard({ name, description, href, cost, disabled = false }: TemplateCardProps) {
//   return (
//     <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-2 hover:border-primary/20">
//       <CardContent className="p-6">
//         <div className="flex items-start justify-between mb-3">
//           <h3 className="text-xl font-semibold text-foreground group-hover:text-primary transition-colors">
//             {name}
//           </h3>
//           <Badge variant={disabled ? "secondary" : "default"} className="flex items-center gap-1">
//             <Zap className="h-3 w-3" />
//             {cost}
//           </Badge>
//         </div>
        
//         <p className="text-muted-foreground mb-6 leading-relaxed">
//           {description}
//         </p>
        
//         <Button 
//           asChild 
//           disabled={disabled} 
//           className="w-full group/button transition-all duration-200"
//           size="lg"
//         >
//           <Link href={href} className="flex items-center justify-center gap-2">
//             {disabled ? "Coming Soon" : "Use Template"}
//             {!disabled && (
//               <ArrowRight className="h-4 w-4 group-hover/button:translate-x-1 transition-transform" />
//             )}
//           </Link>
//         </Button>
//       </CardContent>
//     </Card>
//   );
// }

// const templates = [
//   {
//     name: "Normal Email",
//     description: "Simple email with subject and body for everyday communication",
//     href: "/send/templates/normal",
//     cost: 5,
//   },
//   {
//     name: "Job Offer",
//     description: "Send a professional job offer with all necessary details",
//     href: "/send/templates/job-offer",
//     cost: 10,
//   },
//   {
//     name: "Interview Invite",
//     description: "Invite a candidate for an interview with scheduling options",
//     href: "/send/templates/interview-invite",
//     cost: 10,
//   },
//   {
//     name: "Event Reminder",
//     description: "Remind someone about an upcoming event or meeting",
//     href: "/send/templates/event-reminder",
//     cost: 10,
//   },
//   {
//     name: "Thank You",
//     description: "Send a personalized thank-you message to show appreciation",
//     href: "/send/templates/thank-you",
//     cost: 10,
//   },
//   {
//     name: "Payment Confirmation",
//     description: "Notify users of successful payment and transaction details",
//     href: "/send/templates/payment-confirmation",
//     cost: 10,
//   },
//   {
//     name: "Custom Template",
//     description: "Design your own custom template with our drag-and-drop builder",
//     href: "/send/customTemplate",
//     cost: 10,
//     disabled: false,
//   },
// ];

// export default function SendMailHome() {
//   const [searchTerm, setSearchTerm] = useState("");

//   const filteredTemplates = templates.filter((template) => {
//     const searchLower = searchTerm.toLowerCase();
//     return (
//       template.name.toLowerCase().includes(searchLower) ||
//       template.description.toLowerCase().includes(searchLower)
//     );
//   });

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
//       <div className="container mx-auto px-4 py-12">
//         {/* Header Section */}
//         <div className="text-center mb-12">
//           <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4 tracking-tight">
//             Choose Your Template
//           </h1>
//           <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
//             Select from our collection of professionally designed email templates 
//             to create engaging communications
//           </p>
//         </div>

//         {/* Search Section */}
//         <div className="flex justify-center mb-12">
//           <SearchBar searchTerm={searchTerm} onSearchChange={setSearchTerm} />
//         </div>

//         {/* Results Section */}
//         {filteredTemplates.length === 0 ? (
//           <EmptyState searchTerm={searchTerm} />
//         ) : (
//           <>
//             <div className="flex items-center justify-between mb-8">
//               <p className="text-muted-foreground">
//                 {searchTerm 
//                   ? `Found ${filteredTemplates.length} template${filteredTemplates.length !== 1 ? 's' : ''} matching "${searchTerm}"`
//                   : `${filteredTemplates.length} template${filteredTemplates.length !== 1 ? 's' : ''} available`
//                 }
//               </p>
//             </div>
            
//             <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
//               {filteredTemplates.map((template) => (
//                 <TemplateCard
//                   key={template.name}
//                   name={template.name}
//                   description={template.description}
//                   href={template.href}
//                   cost={template.cost}
//                   disabled={template.disabled}
//                 />
//               ))}
//             </div>
//           </>
//         )}
//       </div>
//     </div>
//   );
// }


"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, FileText, ArrowRight, Zap } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

// SearchBar Component
interface SearchBarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

function SearchBar({ searchTerm, onSearchChange }: SearchBarProps) {
  return (
    <div className="relative w-full sm:w-96 group">
      <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors duration-200" />
      <Input
        type="search"
        placeholder="Search templates..."
        className="pl-12 h-14 border-2 focus:ring-4 focus:ring-primary/10 focus:border-primary/50 transition-all duration-300 bg-blue/50 backdrop-blur-sm shadow-lg hover:shadow-xl text-lg"
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
      <div className="mx-auto w-32 h-32 bg-gradient-to-br from-muted to-muted/50 rounded-full flex items-center justify-center mb-8 shadow-lg animate-scale-in">
        {searchTerm ? (
          <Search className="h-12 w-12 text-muted-foreground animate-pulse" />
        ) : (
          <FileText className="h-12 w-12 text-muted-foreground animate-pulse" />
        )}
      </div>
      <h3 className="text-2xl font-bold text-foreground mb-4 animate-slide-in-right">
        {searchTerm ? "No templates found" : "No templates available"}
      </h3>
      <p className="text-muted-foreground max-w-lg mx-auto text-lg leading-relaxed animate-slide-in-right" style={{animationDelay: '0.1s'}}>
        {searchTerm 
          ? `No templates match "${searchTerm}". Try adjusting your search terms.`
          : "There are currently no email templates available."
        }
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

function TemplateCard({ name, description, href, cost, disabled = false }: TemplateCardProps) {
  return (
    <Card className="group relative overflow-hidden border-2 bg-blue/80 backdrop-blur-sm transition-transform duration-300 hover:-translate-y-2 hover:scale-[1.02] hover:border-primary/30 hover:shadow-xl">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

      <CardContent className="relative z-10 p-8">
        <div className="mb-4 flex items-start justify-between">
          <h3 className="text-2xl font-bold leading-tight text-foreground transition-colors duration-300 group-hover:text-primary">
            {name}
          </h3>

          <Badge 
            variant={disabled ? "secondary" : "default"} 
            className="flex items-center gap-2 px-3 py-1 text-sm font-semibold shadow group-hover:shadow-md group-hover:scale-110 transition-transform duration-300"
          >
            <Zap className="h-4 w-4 animate-pulse" />
            {cost}
          </Badge>
        </div>

        <p className="mb-8 text-base leading-relaxed text-muted-foreground transition-colors duration-300 group-hover:text-foreground/80">
          {description}
        </p>

        <Button
          asChild
          disabled={disabled}
          className="relative h-12 w-full text-lg font-semibold shadow group-hover:shadow-lg transition-shadow duration-300 disabled:opacity-50"
          size="lg"
        >
          <Link href={href} className="relative flex items-center justify-center gap-3 overflow-hidden">
            <span className="relative z-10">{disabled ? "Coming Soon" : "Use Template"}</span>

            {!disabled && (
              <ArrowRight className="relative z-10 h-5 w-5 transition-transform duration-300 group-hover/button:translate-x-1.5" />
            )}

            {!disabled && (
              <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-primary to-primary/80 transition-transform duration-300 group-hover/button:translate-x-0" />
            )}
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}


const templates = [
  {
    name: "Normal Email",
    description: "Simple email with subject and body for everyday communication",
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
  {
    name: "Custom Template",
    description: "Design your own custom template with our drag-and-drop builder",
    href: "/send/customTemplate",
    cost: 10,
    disabled: false,
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
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5" />
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl -translate-y-20 translate-x-20" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-secondary/20 rounded-full blur-3xl translate-y-20 -translate-x-20" />
      
      <div className="container mx-auto px-4 py-16 relative z-10">
        {/* Header Section */}
        <div className="text-center mb-16 animate-fade-in">
          <h1 className="text-5xl md:text-7xl font-extrabold text-foreground mb-6 tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">
            Choose Your Template
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed animate-slide-in-right" style={{animationDelay: '0.2s'}}>
            Select from our collection of professionally designed email templates 
            to create engaging communications
          </p>
        </div>

        {/* Search Section */}
        <div className="flex justify-center mb-16 animate-scale-in" style={{animationDelay: '0.4s'}}>
          <SearchBar searchTerm={searchTerm} onSearchChange={setSearchTerm} />
        </div>

        {/* Results Section */}
        {filteredTemplates.length === 0 ? (
          <EmptyState searchTerm={searchTerm} />
        ) : (
          <div className="animate-fade-in" style={{animationDelay: '0.6s'}}>
            <div className="flex items-center justify-between mb-10">
              <p className="text-muted-foreground text-lg font-medium">
                {searchTerm 
                  ? `Found ${filteredTemplates.length} template${filteredTemplates.length !== 1 ? 's' : ''} matching "${searchTerm}"`
                  : `${filteredTemplates.length} template${filteredTemplates.length !== 1 ? 's' : ''} available`
                }
              </p>
            </div>
            
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredTemplates.map((template, index) => (
                <div 
                  key={template.name} 
                  className="animate-fade-in"
                  style={{animationDelay: `${0.8 + (index * 0.1)}s`}}
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
