"use client";
import { usePathname } from "next/navigation";

export default function NotFound() {
  const pathname: string = usePathname();
  return (
    <div className="flex items-center justify-center h-screen">
      <h1 className="text-4xl font-bold">{pathname.split('/')[1].toLocaleUpperCase()} comming soon.....</h1>
    </div>
  );
}
