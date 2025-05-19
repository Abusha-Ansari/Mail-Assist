"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Send } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { motion } from "framer-motion"

export default function SendMailPage() {
  const [to, setTo] = useState("")
  const [subject, setSubject] = useState("")
  const [body, setBody] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const [from,setFrom] = useState<string>();

  useEffect(() => {
    setFrom(localStorage.getItem("email") || "mail.assist.user@abusha.tech")
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    // Simulate API call
    fetch("/api/send", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ to:to, subject:subject, bodyMessage:body, from:from }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data)
        setIsLoading(false);
        router.push("/dashboard");
      })
      .catch((error) => {
        console.error("Error:", error)
        setIsLoading(false)
      });
  }

  return (
    <div className="container flex flex-col items-center justify-center px-4 sm:px-6 py-12">
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
          <div className="space-y-2">
            <Label htmlFor="to">To</Label>
            <Input
              id="to"
              type="email"
              placeholder="recipient@example.com"
              required
              value={to}
              onChange={(e) => setTo(e.target.value)}
              className="border-2 border-black rounded-md p-2 dark:border-white"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="subject">Subject</Label>
            <Input
              id="subject"
              placeholder="Email subject"
              required
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="border-2 border-black rounded-md p-2 dark:border-white"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="body">Body</Label>
            <Textarea
              id="body"
              placeholder="Write your message here..."
              className="min-h-[200px] border-2 border-black rounded-md p-2 dark:border-white"
              required
              value={body}
              onChange={(e) => setBody(e.target.value)}
            />
          </div>

          <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                "Sending..."
              ) : (
                <div className=" flex items-center justify-center border-2 border-black rounded-md p-2 dark:border-white">
                  <Send className="mr-2 h-4 w-4" />
                  Send Email
                </div>
              )}
            </Button>
          </motion.div>
        </form>
      </motion.div>
    </div>
  )
}
