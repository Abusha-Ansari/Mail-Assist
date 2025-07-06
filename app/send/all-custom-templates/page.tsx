'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, FileText, Send, Users } from "lucide-react";
import { Template } from '@/interfaces/interfaces';
import { useUser } from '@/context/UserContext';
// import { useTheme } from 'next-themes';

export default function TemplateListPage() {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();
  const { user } = useUser();
  // const { theme, setTheme } = useTheme()
  // const originalTheme = useRef<string | undefined>(undefined)

  // useEffect(() => {
  //   // Save the original theme
  //   originalTheme.current = theme
    
  //   // Change to the desired theme (e.g., dark)
  //   setTheme('light')

  //   return () => {
  //     // Restore the original theme
  //     if (originalTheme.current) {
  //       setTheme('dark')
  //     }
  //   }
  // }, [theme, setTheme]);

  useEffect(() => {
    if (!user) return;

    (async () => {
      const { data, error } = await supabase
        .from('email_templates')
        .select('id, name, placeholders')
        .eq('user_id', user.id); 

      if (error) {
        console.error('Error fetching templates:', error);
      }

      setTemplates(data || []);
    })();
  }, [user]);

  const filteredTemplates = templates.filter((template) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      template.name.toLowerCase().includes(searchLower) ||
      template.placeholders.join(' ').toLowerCase().includes(searchLower)
    );
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-muted/30 relative overflow-hidden">
      {/* Enhanced background decorations */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,hsl(var(--primary)/0.1),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,hsl(var(--primary)/0.1),transparent_50%)]" />
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-primary/20 to-primary/10 rounded-full blur-3xl animate-pulse" style={{animationDuration: '4s'}} />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-primary/20 to-primary/10 rounded-full blur-3xl animate-pulse" style={{animationDuration: '6s', animationDelay: '2s'}} />
      <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-gradient-to-r from-accent/10 to-primary/10 rounded-full blur-2xl animate-pulse -translate-x-1/2 -translate-y-1/2" style={{animationDuration: '8s', animationDelay: '1s'}} />
      
      <div className="container relative z-10 p-6 sm:p-12">
        {/* Enhanced Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-12 animate-fade-in">
          <div className="relative">
            <h1 className="text-4xl sm:text-5xl font-black tracking-tight bg-gradient-to-r from-foreground via-primary to-primary/80 bg-clip-text text-transparent relative z-10">
              Choose a Template
            </h1>
            <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-primary/10 blur-2xl -z-10 animate-pulse" />
          </div>
          
          {/* Enhanced Search */}
          <div className="relative w-full sm:w-80 animate-scale-in" style={{animationDelay: '0.2s'}}>
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors duration-300" />
              <Input
                type="search"
                placeholder="Search templates..."
                className="pl-12 h-12 text-base bg-card/80 backdrop-blur-sm border-2 border-border/50 rounded-xl shadow-lg hover:shadow-xl focus:border-primary/50 focus:bg-card/90 transition-all duration-300"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-primary/5 rounded-xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 -z-10" />
            </div>
          </div>
        </div>

        {filteredTemplates.length === 0 ? (
          <div className="text-center py-20 animate-fade-in" style={{animationDelay: '0.4s'}}>
            <div className="relative inline-block">
              <div className="mx-auto w-24 h-24 bg-gradient-to-br from-muted to-primary/10 rounded-full flex items-center justify-center mb-6 shadow-xl">
                <FileText className="h-10 w-10 text-muted-foreground" />
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-primary/10 blur-2xl -z-10 animate-pulse" />
            </div>
            <p className="text-xl text-muted-foreground font-medium">No templates found.</p>
            <p className="text-muted-foreground/80 mt-2">Try adjusting your search terms or create a new template.</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 animate-scale-in" style={{animationDelay: '0.4s'}}>
            {filteredTemplates.map((template, index) => (
              <Card 
                key={template.id} 
                className="group relative bg-card/80 backdrop-blur-sm border-2 border-border/50 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 hover:scale-[1.02] overflow-hidden animate-fade-in"
                style={{animationDelay: `${0.6 + index * 0.1}s`}}
              >
                {/* Card glow effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                <CardContent className="relative z-10 p-8">
                  {/* Template Icon */}
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 bg-gradient-to-br from-primary/10 to-primary/5 rounded-xl flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow duration-300">
                      <FileText className="h-6 w-6 text-primary group-hover:scale-110 transition-transform duration-300" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors duration-300">
                        {template.name}
                      </h2>
                      <p className="text-sm text-muted-foreground font-medium">Template #{template.id}</p>
                    </div>
                  </div>
                  
                  {/* Placeholders */}
                  <div className="mb-6 p-4 bg-muted/80 rounded-xl border border-border/50">
                    <p className="text-sm font-semibold text-foreground mb-2">Available Fields:</p>
                    <div className="flex flex-wrap gap-2">
                      {template.placeholders.map((placeholder, idx) => (
                        <span 
                          key={idx}
                          className="px-3 py-1 bg-primary/10 text-primary text-xs font-medium rounded-full border border-primary/20"
                        >
                          {placeholder}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  {/* Action Buttons */}
                  <div className='flex flex-col gap-4'>
                    <Button 
                      onClick={() => router.push(`/send/custom-template/${template.id}`)}
                      className="group/btn relative w-full h-12 text-sm font-bold shadow-md hover:shadow-lg transition-all duration-300 bg-primary hover:bg-primary/90 border-0 rounded-xl overflow-hidden"
                    >
                      <div className="relative flex items-center justify-center gap-3 z-10">
                        <Send className="h-4 w-4 transition-all duration-300 group-hover/btn:scale-110 group-hover/btn:rotate-12" />
                        <span className="transition-transform duration-300 group-hover/btn:scale-105">
                          Single Email
                        </span>
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary-foreground/20 to-transparent -translate-x-full transition-transform duration-1000 group-hover/btn:translate-x-full" />
                    </Button>
                    
                    <Button 
                      onClick={() => router.push(`/send/batch-email/${template.id}`)}
                      variant="outline"
                      className="group/btn relative w-full h-12 text-sm font-bold shadow-md hover:shadow-lg transition-all duration-300 border-2 border-border/50 bg-card/80 backdrop-blur-sm hover:bg-card/90 hover:border-primary/50 rounded-xl overflow-hidden"
                    >
                      <div className="relative flex items-center justify-center gap-3 z-10">
                        <Users className="h-4 w-4 transition-all duration-300 group-hover/btn:scale-110 group-hover/btn:rotate-12 text-foreground group-hover/btn:text-primary" />
                        <span className="transition-all duration-300 group-hover/btn:scale-105 text-foreground group-hover/btn:text-primary">
                          Bulk Email
                        </span>
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-primary/5 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-500" />
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/30 to-transparent -translate-x-full transition-transform duration-1000 group-hover/btn:translate-x-full opacity-0 group-hover/btn:opacity-100" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
