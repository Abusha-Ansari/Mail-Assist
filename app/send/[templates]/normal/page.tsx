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
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="to">To</Label>
          <Input id="to" type="email" required value={formData.to} onChange={handleChange} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="subject">Subject</Label>
          <Input id="subject" required value={formData.subject} onChange={handleChange} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="body">Body</Label>
          <Textarea id="body" required value={formData.body} onChange={handleChange} className="min-h-[200px]" />
        </div>

        {/* Schedule Option */}
        <div className="space-y-2">
          <label className="flex items-center space-x-2">
            <input type="checkbox" checked={schedule} onChange={(e) => setSchedule(e.target.checked)} />
            <span>Schedule this email?</span>
          </label>
          {schedule && (
            <div className="flex gap-4">
              <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
              <Input type="time" value={time} onChange={(e) => setTime(e.target.value)} required />
            </div>
          )}
        </div>

        <Button type="submit" className="w-full" disabled={isLoading}>
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
