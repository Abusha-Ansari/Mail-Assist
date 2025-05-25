// components/MailFormLayout.tsx
"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";
import { container } from "@/lib/toast.util";

interface MailFormLayoutProps {
  title: string;
  description: string;
  children: ReactNode;
}

export default function MailFormLayout({
  title,
  description,
  children,
}: MailFormLayoutProps) {
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
          <h1 className="text-2xl font-bold sm:text-3xl text-foreground">{title}</h1>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
        {children}
      </motion.div>
    </div>
  );
}
