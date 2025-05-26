'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { useUser } from '@/context/UserContext';
import { deductCredits } from '@/utils/auth';
import { addUserMail } from '@/utils/userMail.utils';
import { success, failure, container } from '@/lib/toast.util';
import { PaymentConfirmationTemplate } from '@/templates/PaymentConfirmationTemplate';

export default function PaymentConfirmationPage() {
  const [formData, setFormData] = useState({
    to: '',
    amount: '',
    transactionId: '',
    recipientName: '',
    date: '',
  });

  const { user, loggedIn } = useUser();
  const [isSending, setIsSending] = useState(false);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("form submit start")
    if (!loggedIn || !user) {
      failure('Please login to send email', 2000);
      console.log(loggedIn, user)
      console.log("form submit end failure")
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
          subject: `Payment Confirmation to ${formData.recipientName}`,
          templateType: 'payment-confirmation',
          templateData: {
            amount: formData.amount,
            transactionId: formData.transactionId,
            recipientName: formData.recipientName,
            date: formData.date,
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
        subject: `Payment Confirmation to ${formData.recipientName}`,
        html: data?.html || "",
      });

      success('Payment confirmation sent successfully!', 2000);
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
      <h1 className="text-2xl font-bold mb-6 text-center">Send Payment Confirmation</h1>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        <div className="space-y-4">
          <div>
            <Label htmlFor="to" className="pb-2">Recipient Email</Label>
            <Input
              id="to"
              type="email"
              value={formData.to}
              onChange={handleChange}
              placeholder="recipient@example.com"
            />
          </div>

          <div>
            <Label htmlFor="recipientName" className="pb-2">Recipient Name</Label>
            <Input 
              id="recipientName" 
              value={formData.recipientName} 
              onChange={handleChange} 
              required 
            />
          </div>

          <div>
            <Label htmlFor="amount" className="pb-2">Amount</Label>
            <Input 
              id="amount" 
              value={formData.amount} 
              onChange={handleChange} 
              required 
            />
          </div>

          <div>
            <Label htmlFor="transactionId" className="pb-2">Transaction ID</Label>
            <Input 
              id="transactionId" 
              value={formData.transactionId} 
              onChange={handleChange} 
              required 
            />
          </div>

          <div>
            <Label htmlFor="date" className="pb-2">Payment Date</Label>
            <Input 
              id="date" 
              type="date" 
              value={formData.date} 
              onChange={handleChange} 
              required 
            />
          </div>

          <Button type="submit" disabled={isSending} className="w-full border hover:cursor-pointer">
            {isSending ? 'Sending...' : 'Send Confirmation (10 credits)'}
          </Button>
        </div>

        <div className="border rounded-md p-4 bg-muted text-muted-foreground">
          <h2 className="text-md font-semibold mb-4">📬 Preview:</h2>
          <div className="bg-background p-4 rounded-md shadow">
            <PaymentConfirmationTemplate
              amount={formData.amount || "0.00"}
              transactionId={formData.transactionId || "TRANS12345"}
              recipientName={formData.recipientName || "Recipient Name"}
              date={formData.date || new Date().toISOString().split('T')[0]}
            />
          </div>
        </div>
      </form>
    </div>
  );
}