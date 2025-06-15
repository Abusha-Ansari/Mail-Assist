"use client";

import { JobOfferTemplate } from "@/templates/JobOfferTemplate";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useUser } from "@/context/UserContext";
import { useRouter } from "next/navigation";
import { success, failure, container } from "@/lib/toast.util";
import { deductCredits } from "@/utils/auth";
import { addUserMail } from "@/utils/userMail.utils";

export default function JobOfferTemplatePage() {
  const { user, loggedIn } = useUser();
  const router = useRouter();

  const [formData, setFormData] = useState({
    to: "",
    subject: "You're Hired at Our Company!",
    company: "",
    position: "",
    description: "",
  });

  const [isSending, setIsSending] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSending(true);

    if (!loggedIn || !user) {
      failure("Please login to send email", 2000);
      return;
    }

    
      try {

        try {
        await deductCredits(user.id, 10);
      } catch (creditError) {
        failure("Not enough credits to send email", 2000);
        console.error("Credit deduction failed:", creditError);
        setIsSending(false);
        return;
      }

      const res = await fetch("/api/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: formData.to,
          from: `${user?.username}+@gmail.com`,
          subject: formData.subject,
          templateType: "job-offer",
          templateData: {
            company: formData.company,
            position: formData.position,
            description: formData.description,
          },
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      await deductCredits(user!.id, 10);

      await addUserMail({
        userId: user!.id,
        mailId: data.id,
        status: "send",
        to_email: formData.to,
        subject: formData.subject,
        html: data?.html || "", // if available
      });

      success("Job offer email sent successfully!", 2000);
      await new Promise((res) => setTimeout(res, 3000));
      router.push("/dashboard");
    } catch (err) {
      failure("Failed to send email"+`${err}`, 2000);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="container max-w-4xl mx-auto py-8 px-4">
      {container}
      <h1 className="text-2xl font-bold mb-6 text-center">Send a Job Offer Email</h1>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        <div className="space-y-4">
          <div>
            <Label htmlFor="to" className="pb-2">To</Label>
            <Input id="to" type="email" value={formData.to} onChange={handleChange} required placeholder="Enter Recipient Email" />
          </div>

          <div>
            <Label htmlFor="company" className="pb-2">Company</Label>
            <Input id="company" value={formData.company} onChange={handleChange} required placeholder="Company Name" />
          </div>

          <div>
            <Label htmlFor="position" className="pb-2">Position</Label>
            <Input id="position" value={formData.position} onChange={handleChange} required placeholder="Position" />
          </div>

          <div>
            <Label htmlFor="description" className="pb-2">Job Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={handleChange}
              required
              placeholder="Enter Job Description"
            />
          </div>

          <Button type="submit" disabled={isSending} className="w-full border hover:cursor-pointer">
            {isSending ? "Sending..." : "Send Email (10 credits)"}
          </Button>
        </div>

        <div className="border rounded-md p-4 bg-muted text-muted-foreground">
          <h2 className="text-md font-semibold mb-4">📬 Preview:</h2>
          <div className="bg-background p-4 rounded-md shadow">
            <JobOfferTemplate
              company={formData.company || "Your Company"}
              position={formData.position || "Position Title"}
              description={formData.description || "This is a sample job description..."}
            />
          </div>
        </div>
      </form>
    </div>
  );
}
