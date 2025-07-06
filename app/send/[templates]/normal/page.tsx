"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";
import MailFormLayout from "@/components/MailFormLayout";
import { useUser } from "@/context/UserContext";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { success, failure, container } from "@/lib/toast.util";
import { deductCredits } from "@/utils/auth";
import { addUserMail } from "@/utils/userMail.utils";

export default function NormalEmailForm() {
  const [formData, setFormData] = useState({
    to: "",
    subject: "",
    body: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [schedule, setSchedule] = useState(false);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const { user, loggedIn } = useUser();
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loggedIn || !user) {
      failure("You must be logged in", 2000);
      return;
    }

    setIsLoading(true);
    try {
      // Try to deduct credits upfront
      await deductCredits(user.id, 5); // Assuming scheduling also costs upfront

      const emailPayload = {
        to: formData.to,
        subject: formData.subject,
        bodyMessage: formData.body,
        from: `${user.username}+@gmail.com`,
      };

      if (schedule==true) {
        if (!date || !time) {
          failure("Please select both date and time", 2000);
          return;
        }

        const scheduledTime = new Date(`${date}T${time}`);
        if (scheduledTime <= new Date()) {
          failure("Scheduled time must be in the future", 2000);
          return;
        }

        const res = await fetch("https://my-cron-worker.msaif8747.workers.dev/send", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            time: scheduledTime.toISOString(),
            url: "https://mailassist.abusha.tech/api/send", // Update if needed
            emailData: emailPayload,
          }),
        });

        if (!res.ok) {
          throw new Error("Scheduling failed");
        }
        await deductCredits(user.id, 5);
        await addUserMail({
          userId: user.id,
          mailId: `scheduled-${Date.now()}`, // Use a unique ID for scheduled emails
          status: "scheduled",
          to_email: formData.to,
          subject: formData.subject,
          html: formData.body,
        });

        success("Email scheduled successfully", 2000);

        await new Promise((res) => setTimeout(res, 2000));
        router.push("/dashboard");
      } else {
        // Send immediately
        const res = await fetch("/api/send", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(emailPayload),
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data?.error || "Send failed");

        await deductCredits(user.id, 5);
        await addUserMail({
          userId: user.id,
          mailId: data.id,
          status: "send",
          to_email: formData.to,
          subject: formData.subject,
          html: formData.body,
        });

        success("Email sent successfully", 2000);
        await new Promise((res) => setTimeout(res, 2000));
        router.push("/dashboard");
      }
    } catch (err) {
      console.log(err)
      failure("Sending failed " + `${err}`, 2000);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <MailFormLayout title="Send Normal Email" description="Use the standard email format (5 credits)">
      {container}
      <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="to" className="text-sm font-medium text-foreground">
          To
        </Label>
        <Input 
          id="to" 
          type="email" 
          placeholder="recipient@email.com"
          required 
          value={formData.to} 
          onChange={handleChange}
          className="h-11 border-border focus:border-primary focus:ring-primary"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="subject" className="text-sm font-medium text-foreground">
          Subject
        </Label>
        <Input 
          id="subject" 
          placeholder="Email subject"
          required 
          value={formData.subject} 
          onChange={handleChange}
          className="h-11 border-border focus:border-primary focus:ring-primary"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="body" className="text-sm font-medium text-foreground">
          Message
        </Label>
        <Textarea 
          id="body" 
          placeholder="Write your message here..."
          required 
          value={formData.body} 
          onChange={handleChange} 
          className="min-h-[200px] border-border focus:border-primary focus:ring-primary resize-none"
        />
      </div>

      {/* Schedule Option */}
      <div className="space-y-4">
        <div className="flex items-center space-x-3">
          <input 
            type="checkbox" 
            id="schedule-checkbox"
            checked={schedule} 
            onChange={(e) => setSchedule(e.target.checked)}
            className="w-4 h-4 text-primary border-border rounded focus:ring-primary focus:ring-2"
          />
          <Label htmlFor="schedule-checkbox" className="text-sm font-medium text-foreground cursor-pointer">
            Schedule this email?
          </Label>
        </div>
        
        {schedule && (
          <div className="flex gap-4 pt-2">
            <div className="flex-1">
              <Label htmlFor="schedule-date" className="text-sm font-medium text-foreground mb-2 block">
                Date
              </Label>
              <Input 
                id="schedule-date"
                type="date" 
                value={date} 
                onChange={(e) => setDate(e.target.value)} 
                required 
                className="h-11 border-border focus:border-primary focus:ring-primary"
              />
            </div>
            <div className="flex-1">
              <Label htmlFor="schedule-time" className="text-sm font-medium text-foreground mb-2 block">
                Time
              </Label>
              <Input 
                id="schedule-time"
                type="time" 
                value={time} 
                onChange={(e) => setTime(e.target.value)} 
                required 
                className="h-11 border-border focus:border-primary focus:ring-primary"
              />
            </div>
          </div>
        )}
      </div>

      <Button 
        type="submit" 
        className="w-full h-11 bg-primary hover:bg-primary/90 text-primary-foreground font-medium transition-all duration-200" 
        disabled={isLoading}
      >
        {isLoading ? "Sending..." : (
          <>
            <Send className="mr-2 h-4 w-4" />
            {schedule ? "Schedule Email" : "Send Email"}
          </>
        )}
      </Button>
    </form>
    </MailFormLayout>
  );
}
