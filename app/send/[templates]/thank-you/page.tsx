'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useRouter } from 'next/navigation';
import { useUser } from '@/context/UserContext';
import { deductCredits } from '@/utils/auth';
import { addUserMail } from '@/utils/userMail.utils';
import { success, failure } from '@/lib/toast.util';
import { ThankYouTemplate } from '@/templates/ThankYouTemplate';

export default function ThankYouPage() {
  const [formData, setFormData] = useState({
    to: '',
    recipientName: '',
    message: '',
  });

  const { user, loggedIn } = useUser();
  const [isSending, setIsSending] = useState(false);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!loggedIn || !user) {
      failure('Please login to send email', 2000);
      return;
    }

    setIsSending(true);

    try {
      const response = await fetch('/api/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: formData.to || `${user.username}@gmail.com`,
          from: `${user?.username}+@gmail.com`,
          subject: `Thank You from ${formData.recipientName}`,
          templateType: 'thank-you',
          templateData: {
            recipientName: formData.recipientName,
            message: formData.message,
          },
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to send');

      await deductCredits(user.id, 10);

      await addUserMail({
        userId: user.id,
        mailId: data.id,
        status: 'send',
        to_email: formData.to || `${user.username}@gmail.com`,
        subject: `Thank You from ${formData.recipientName}`,
        html: data?.html || "",
      });

      success('Thank you email sent successfully!', 2000);
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
      <h1 className="text-2xl font-bold mb-6 text-center">Send a Thank You Email</h1>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        <div className="space-y-4">
          <div>
            <Label htmlFor="to">Recipient Email</Label>
            <Input 
              id="to" 
              type="email" 
              value={formData.to} 
              onChange={handleChange} 
              placeholder="recipient@example.com"
            />
          </div>

          <div>
            <Label htmlFor="recipientName">Your Name</Label>
            <Input 
              id="recipientName" 
              value={formData.recipientName} 
              onChange={handleChange} 
              required 
            />
          </div>

          <div>
            <Label htmlFor="message">Thank You Message</Label>
            <Textarea 
              id="message" 
              value={formData.message} 
              onChange={handleChange} 
              required 
              rows={5}
            />
          </div>

          <Button type="submit" disabled={isSending} className="w-full">
            {isSending ? 'Sending...' : 'Send Thank You (10 credits)'}
          </Button>
        </div>

        <div className="border rounded-md p-4 bg-muted text-muted-foreground">
          <h2 className="text-md font-semibold mb-4">📬 Preview:</h2>
          <div className="bg-background p-4 rounded-md shadow">
            <ThankYouTemplate 
              recipientName={formData.recipientName || "Your Name"}
              message={formData.message || "Your thank you message will appear here..."}
            />
          </div>
        </div>
      </form>
    </div>
  );
}