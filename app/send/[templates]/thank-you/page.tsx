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
import { success, failure, container } from '@/lib/toast.util';
import { ThankYouTemplate } from '@/templates/ThankYouTemplate';
// import { ToastContainer } from 'react-toastify';

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

      try {
        await deductCredits(user.id, 10);
      } catch (creditError) {
        failure("Not enough credits to send email", 2000);
        console.error("Credit deduction failed:", creditError);
        setIsSending(false);
        return;
      }

      const response = await fetch('/api/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: formData.to || `${user.username}@gmail.com`,
          from: `${user?.username}+@gmail.com`,
          subject: `Thank You from ${user?.username}`,
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
      <h1 className="text-2xl font-bold mb-6 text-center text-foreground">Send a Thank You Email</h1>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        <div className="space-y-4">
          <div>
            <Label htmlFor="to" className="pb-2 text-foreground">Recipient Email</Label>
            <Input 
              id="to" 
              type="email" 
              value={formData.to} 
              onChange={handleChange} 
              placeholder="recipient@example.com"
              className="border-border focus:border-primary focus:ring-primary"
            />
          </div>

          <div>
            <Label htmlFor="recipientName" className="pb-2 text-foreground">Your Name</Label>
            <Input 
              id="recipientName" 
              value={formData.recipientName} 
              onChange={handleChange} 
              required 
              className="border-border focus:border-primary focus:ring-primary"
            />
          </div>

          <div>
            <Label htmlFor="message" className="pb-2 text-foreground">Thank You Message</Label>
            <Textarea 
              id="message" 
              value={formData.message} 
              onChange={handleChange} 
              required 
              rows={5}
              className="border-border focus:border-primary focus:ring-primary"
            />
          </div>

          <Button type="submit" disabled={isSending} className="w-full bg-primary hover:bg-primary/90 text-primary-foreground border-border hover:cursor-pointer">
            {isSending ? 'Sending...' : 'Send Thank You (10 credits)'}
          </Button>
        </div>

        <div className="border border-border rounded-md p-4 bg-muted text-muted-foreground">
          <h2 className="text-md font-semibold mb-4 text-foreground">📬 Preview:</h2>
          <div className="bg-card p-4 rounded-md shadow border border-border">
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