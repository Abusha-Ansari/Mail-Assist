'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { Template } from '@/interfaces/interfaces';
import { useUser } from '@/context/UserContext';

export default function TemplateListPage() {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();
const { user } = useUser();

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
          <p className="text-muted-foreground">No templates found.</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 gap-6">
          {filteredTemplates.map((template) => (
            <Card key={template.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-2 text-foreground">{template.name}</h2>
                <p className="text-sm text-muted-foreground mb-4">
                  Placeholders: {template.placeholders.join(', ')}
                </p>

                <p className="text-sm text-muted-foreground mb-4">
                  Template Id: {template.id}
                </p>
                <Button 
                  onClick={() => router.push(`/send/custom-template/${template.id}`)}
                  
                  className="w-full border hover:cursor-pointer"
                >
                  Use Template
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}