"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Send } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { success, container, failure } from "@/lib/toast.util";
import { deductCredits } from "@/utils/auth";
import { useUser } from "@/context/UserContext";
import { addUserMail } from "@/utils/userMail.utils";

export default function SendMailPage() {
  const [formData, setFormData] = useState({
    to: "",
    subject: "",
    body: "",
    from: "mail.assist.user@abusha.tech",
  });

  const { user } = useUser();

  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const storedEmail = localStorage.getItem("email");
    if (storedEmail) {
      setFormData((prev) => ({ ...prev, from: storedEmail }));
    }
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    fetch("/api/send", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        to: formData.to,
        subject: formData.subject,
        bodyMessage: formData.body,
        from: formData.from,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        //* get the mail id from the response
        // console.log(data);
        if (data) {
          setIsLoading(false);
          success("Email sent successfully!", 2000);
          setFormData((prev) => ({
            ...prev,
            to: "",
            subject: "",
            body: "",
          }));
          deductCredits(user!.id)
            .then(() => {
              
              addUserMail({
                userId: user!.id,
                mailId: data.id,
                status: "send",
              });

              router.push("/dashboard")
            })
            .catch((error) => {
              console.error("Error deducting credits:", error);
            });
        }
      })
      .catch((error) => {
        failure("Failed to send email. Please try again.", 2000);
        console.error("Error:", error);
        setIsLoading(false);
      });
  };

  return (
    <div className="container flex flex-col items-center justify-center px-4 sm:px-6 py-12">
      {container}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-2xl space-y-6"
      >
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-bold sm:text-3xl">Compose New Email</h1>
          <p className="text-sm text-muted-foreground">
            Send secure emails to anyone
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2 ">
            <Label htmlFor="to">To</Label>
            <Input
              id="to"
              type="email"
              placeholder="recipient@example.com"
              required
              value={formData.to}
              onChange={handleChange}
              className="border-2"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="subject">Subject</Label>
            <Input
              id="subject"
              placeholder="Email subject"
              required
              value={formData.subject}
              onChange={handleChange}
              className="border-2"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="body">Body</Label>
            <Textarea
              id="body"
              placeholder="Write your message here..."
              className="min-h-[200px] border-2"
              required
              value={formData.body}
              onChange={handleChange}
            />
          </div>

          <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                "Sending..."
              ) : (
                <div className="flex items-center justify-center border-2  rounded-md p-2 ">
                  <Send className="mr-2 h-4 w-4" />
                  Send Email
                </div>
              )}
            </Button>
          </motion.div>
        </form>
      </motion.div>
    </div>
  );
}
