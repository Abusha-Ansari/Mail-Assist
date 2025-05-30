"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function Page() {
  const router = useRouter();

  return (
    <div className="container flex flex-col items-center justify-center min-h-screen py-12">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[400px]">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-4xl font-bold tracking-tight">
            Welcome to Custom Mail Templater
          </h1>
          <p className="text-lg text-muted-foreground">
            Create and manage your email templates with ease
          </p>
        </div>

        <div className="flex flex-col space-y-4">
          <Button 
            size="lg"
            onClick={() => router.push('/send/all-custom-templates')}
            className="w-full hover:cursor-pointer"
          >
            View Your Templates
          </Button>
          <Button
            size="lg"
            variant="outline"
            onClick={() => router.push('/create-template')}
            className="w-full hover:cursor-pointer"
          >
            Build New Template
          </Button>
        </div>
      </div>
    </div>
  );
}