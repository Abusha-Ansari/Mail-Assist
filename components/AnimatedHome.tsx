'use client'

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Mail, Rocket, Shield, Sparkles } from "lucide-react"
import Link from "next/link"

const features = [
  {
    icon: <Shield className="h-8 w-8 text-primary" />,
    title: "Secure",
    description: "End-to-end encryption for all your communications"
  },
  {
    icon: <Rocket className="h-8 w-8 text-primary" />,
    title: "Fast",
    description: "Lightning-fast delivery to any inbox worldwide"
  },
  {
    icon: <Sparkles className="h-8 w-8 text-primary" />,
    title: "Simple",
    description: "Intuitive interface that anyone can use"
  }
]

export default function AnimatedHome() {
  return (
    <section className="container flex flex-col items-center justify-center gap-6 px-4 pb-12 pt-6 md:py-16">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mx-auto flex max-w-[980px] flex-col items-center gap-4 text-center"
      >
        <h1 className="text-3xl font-extrabold leading-tight tracking-tighter sm:text-4xl md:text-5xl">
          <Mail className="inline h-10 w-10 text-primary" /> <br />
          Modern Email Service for Everyone
        </h1>
        <p className="max-w-[700px] text-base text-muted-foreground sm:text-lg">
          Simple, secure, and reliable email service with pay-as-you-go credits.
        </p>
      </motion.div>

      {/* Buttons - Responsive */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="flex flex-col items-center gap-4 sm:flex-row"
      >
        <Button asChild size="lg" className="w-full sm:w-auto">
          <Link href="/signup">Get Started</Link>
        </Button>
        <Button asChild variant="outline" size="lg" className="w-full sm:w-auto">
          <Link href="/auth/login">Login</Link>
        </Button>
      </motion.div>

      {/* Feature Grid */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 w-full"
      >
        {features.map((feature, index) => (
          <motion.div
            key={index}
            whileHover={{ y: -5 }}
            className="flex flex-col items-center gap-3 rounded-lg border p-6 text-center"
          >
            <div className="rounded-full bg-primary/10 p-4">{feature.icon}</div>
            <h3 className="text-xl font-bold">{feature.title}</h3>
            <p className="text-sm text-muted-foreground">{feature.description}</p>
          </motion.div>
        ))}
      </motion.div>
    </section>
  )
}
