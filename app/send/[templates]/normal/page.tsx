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
      const res = await fetch("/api/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: formData.to,
          subject: formData.subject,
          bodyMessage: formData.body,
          from: `${user.username}+@gmail.com`,
        }),
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
    } catch (err) {
      failure("Sending failed "+`${err}`, 2000);
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
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "Sending..." : <><Send className="mr-2 h-4 w-4" />Send Email</>}
        </Button>
      </form>
    </MailFormLayout>
  );
}
