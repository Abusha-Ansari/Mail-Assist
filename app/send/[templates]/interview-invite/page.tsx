"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { InterviewInviteTemplate } from "@/templates/InterviewInviteTemplate";
import { useRouter } from "next/navigation";
import { useUser } from "@/context/UserContext";
import { deductCredits } from "@/utils/auth";
import { addUserMail } from "@/utils/userMail.utils";
import { success, failure } from "@/lib/toast.util";

export default function InterviewInviteForm() {
  const [form, setForm] = useState({
    to: "",
    company: "",
    position: "",
    date: "",
    time: "",
    location: "",
  });

  const router = useRouter();
  const { user, loggedIn } = useUser();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!loggedIn || !user) {
      failure("Please login to send email", 2000);
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: `${user.username}@gmail.com`,
          from: "mail.assist.user@abusha.tech",
          subject: `Interview Invitation from ${form.company}`,
          bodyMessage: "", // not used in template
          templateType: "interview-invite",
          templateData: form,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to send");
      }

      await deductCredits(user.id, 10);

      await addUserMail({
        userId: user.id,
        mailId: data.id,
        status: "send",
        to_email: `${user.username}@gmail.com`,
        subject: `Interview Invitation from ${form.company}`,
        html: "Interview Invite sent using template.",
      });

      success("Email sent!", 2000);
      router.push("/dashboard");
    } catch (error) {
      failure("Failed to send email", 2000);
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.id]: e.target.value });
  };

  return (
    <>
      <div className="container max-w-4xl mx-auto py-8 px-4">
        <h1 className="text-2xl font-bold mb-6 text-center">
          Send an Interview Invitation
        </h1>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10"
        >
          <div className="space-y-4">
            <div>
              <Label htmlFor="to">To</Label>
              <Input
                id="to"
                type="email"
                value={form.to}
                onChange={handleChange}
              />
            </div>

            <div>
              <Label htmlFor="company">Company</Label>
              <Input
                id="company"
                value={form.company}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <Label htmlFor="position">Position</Label>
              <Input
                id="position"
                value={form.position}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                value={form.date}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <Label htmlFor="time">Time</Label>
              <Input
                id="time"
                value={form.time}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={form.location}
                onChange={handleChange}
                required
              />
            </div>

            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading ? "Sending..." : "Send Invitation (10 credits)"}
            </Button>
          </div>

          <div className="border rounded-md p-4 bg-muted text-muted-foreground">
            <h2 className="text-md font-semibold mb-4">📬 Preview:</h2>
            <div className="bg-background p-4 rounded-md shadow">
              <InterviewInviteTemplate {...form} />
            </div>
          </div>
        </form>
      </div>
    </>
  );
}
