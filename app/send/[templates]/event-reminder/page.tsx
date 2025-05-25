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
import { EventReminderTemplate } from '@/templates/EventReminderTemplate';

export default function EventReminderPage() {
  const { user, loggedIn } = useUser();
  const router = useRouter();

  const [formData, setFormData] = useState({
    to: "",
    subject: "Reminder: Upcoming Event",
    eventName: '',
    date: '',
    time: '',
    venue: '',
  });

  const [isSending, setIsSending] = useState(false);

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
          subject: formData.subject,
          templateType: 'event-reminder',
          templateData: {
            eventName: formData.eventName,
            date: formData.date,
            time: formData.time,
            venue: formData.venue,
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
        subject: formData.subject,
        html: data?.html || "",
      });

      success('Event reminder sent successfully!', 2000);
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
      <h1 className="text-2xl font-bold mb-6 text-center">Send an Event Reminder</h1>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        <div className="space-y-4">
          <div>
            <Label htmlFor="to">To</Label>
            <Input id="to" type="email" value={formData.to} onChange={handleChange} />
          </div>

          <div>
            <Label htmlFor="eventName">Event Name</Label>
            <Input id="eventName" value={formData.eventName} onChange={handleChange} required />
          </div>

          <div>
            <Label htmlFor="date">Date</Label>
            <Input id="date" type="date" value={formData.date} onChange={handleChange} required />
          </div>

          <div>
            <Label htmlFor="time">Time</Label>
            <Input id="time" value={formData.time} onChange={handleChange} required />
          </div>

          <div>
            <Label htmlFor="venue">Venue</Label>
            <Textarea id="venue" value={formData.venue} onChange={handleChange} required />
          </div>

          <Button type="submit" disabled={isSending} className="w-full">
            {isSending ? "Sending..." : "Send Reminder (10 credits)"}
          </Button>
        </div>

        <div className="border rounded-md p-4 bg-muted text-muted-foreground">
          <h2 className="text-md font-semibold mb-4">📬 Preview:</h2>
          <div className="bg-background p-4 rounded-md shadow">
            <EventReminderTemplate
              eventName={formData.eventName || "Event Name"}
              date={formData.date || "Event Date"}
              time={formData.time || "Event Time"}
              venue={formData.venue || "Event Venue"}
            />
          </div>
        </div>
      </form>
    </div>
  );
}