"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function Page() {
  const router = useRouter();

  return (
    <div className="container flex flex-col items-center min-h-screen pt-8 sm:pt-12 pb-12 px-4">
  <div className="mx-auto w-full flex flex-col space-y-4 sm:space-y-6 max-w-[400px] pt-20">
    <div className="flex flex-col space-y-1 sm:space-y-2 text-center">
      <h1 className="text-2xl sm:text-4xl font-bold tracking-tight">
        Welcome to Custom Mail Templater
      </h1>
      <p className="text-sm sm:text-lg text-muted-foreground">
        Create and manage your email templates with ease
      </p>
    </div>

    <div className="flex flex-col space-y-3 sm:space-y-4">
      <Button 
        size="sm" 
        className="w-full hover:cursor-pointer text-sm sm:text-base h-10 sm:h-12"
        onClick={() => router.push('/send/all-custom-templates')}
      >
        View Your Templates
      </Button>
      <Button
        size="sm"
        variant="outline"
        className="w-full hover:cursor-pointer text-sm sm:text-base h-10 sm:py-3"
        onClick={() => router.push('/create-template')}
      >
        Build New Template
      </Button>
    </div>
  </div>
</div>
  );
}