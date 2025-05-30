'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useUser } from '@/context/UserContext';
import { deductCredits } from '@/utils/auth';
import { addUserMail } from '@/utils/userMail.utils';
import { success, failure, container } from '@/lib/toast.util';

export default function SendWithTemplate() {
  const { templateId } = useParams();
  const router = useRouter();
  const { user, loggedIn } = useUser();
  const [placeholders, setPlaceholders] = useState<string[]>([]);
  const [form, setForm] = useState<{ [key: string]: string }>({ to: '', subject: '' });
  const [isSending, setIsSending] = useState(false);
  const [templateName, setTemplateName] = useState('');

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from('email_templates')
        .select('name, placeholders')
        .eq('id', templateId)
        .single();

      if (data) {
        setPlaceholders(data.placeholders);
        setTemplateName(data.name);
      }
    })();
  }, [templateId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((f) => ({ ...f, [e.target.id]: e.target.value }));
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!loggedIn || !user) {
      failure('Please login to send email', 2000);
      return;
    }

    setIsSending(true);

    try {
      const res = await fetch('/api/custom-mail', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          templateId,
          to: form.to || `${user.username}@gmail.com`,
          from: `${user?.username}+@gmail.com`,
          subject: form.subject,
          placeholderData: form,
        }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || 'Failed to send');

      await deductCredits(user.id, 10);
      
      await addUserMail({
        userId: user.id,
        mailId: data?.mailResponse?.data?.id,
        status: 'send',
        to_email: form.to || `${user.username}@gmail.com`,
        subject: form.subject,
        html: data?.html || "no html provided",
      });

      success('Email sent successfully!', 2000);
      await new Promise((res) => setTimeout(res, 3000));
      router.push('/dashboard');
    } catch (error) {
      failure('Failed to send email', 2000);
      console.error(error);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="container max-w-4xl mx-auto py-8 px-4">
      {container}
      <h1 className="text-2xl font-bold mb-6 text-center">Send Email: {templateName}</h1>

      <form onSubmit={handleSend} className="grid grid-cols-1 gap-6 mb-10">
        <div className="space-y-4">
          <div>
            <Label htmlFor="to" className="pb-2">Recipient Email</Label>
            <Input 
              id="to" 
              type="email" 
              value={form.to} 
              onChange={handleChange} 
              required 
            />
          </div>

          <div>
            <Label htmlFor="subject" className="pb-2">Email Subject</Label>
            <Input 
              id="subject" 
              type="text" 
              value={form.subject} 
              onChange={handleChange} 
              required 
            />
          </div>

          {placeholders.map((ph) => (
            <div key={ph}>
              <Label htmlFor={ph} className="pb-2">{ph}</Label>
              {ph.toLowerCase().includes('message') || ph.toLowerCase().includes('body') ? (
                <Textarea
                  id={ph}
                  value={form[ph] || ''}
                  onChange={handleChange}
                  required
                />
              ) : (
                <Input
                  id={ph}
                  type="text"
                  value={form[ph] || ''}
                  onChange={handleChange}
                  required
                />
              )}
            </div>
          ))}

          <Button 
            type="submit" 
            disabled={isSending} 
            className="w-full hover:cursor-pointer"
          >
            {isSending ? "Sending..." : "Send Email (10 credits)"}
          </Button>
        </div>
      </form>
    </div>
  );
}