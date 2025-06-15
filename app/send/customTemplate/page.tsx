"use client";

import { Button } from "@/components/ui/button";
import { FileText, Plus, Sparkles } from "lucide-react";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";

export default function Page() {
  const router = useRouter();
  const { theme, setTheme } = useTheme()
  const originalTheme = useRef<string | undefined>(undefined)

  useEffect(() => {
    // Save the original theme
    originalTheme.current = theme
    
    // Change to the desired theme (e.g., dark)
    setTheme('light')

    return () => {
      // Restore the original theme
      if (originalTheme.current) {
        setTheme('dark')
      }
    }
  }, [theme, setTheme]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/30 relative overflow-hidden">
      {/* Enhanced background decorations */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.1),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(147,51,234,0.1),transparent_50%)]" />
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-blue-400/20 to-cyan-400/20 rounded-full blur-3xl animate-pulse" style={{animationDuration: '4s'}} />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-purple-400/20 to-pink-400/20 rounded-full blur-3xl animate-pulse" style={{animationDuration: '6s', animationDelay: '2s'}} />
      <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-gradient-to-r from-green-400/10 to-blue-400/10 rounded-full blur-2xl animate-pulse -translate-x-1/2 -translate-y-1/2" style={{animationDuration: '8s', animationDelay: '1s'}} />
      
      <div className="container flex flex-col items-center min-h-screen pt-8 sm:pt-12 pb-12 px-4 relative z-10">
        <div className="mx-auto w-full flex flex-col space-y-8 sm:space-y-12 max-w-[500px] pt-20">
          {/* Enhanced Header Section */}
          <div className="flex flex-col space-y-6 sm:space-y-8 text-center animate-fade-in">
            <div className="relative inline-block mx-auto">
              <div className="mx-auto w-32 h-32 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mb-8 shadow-2xl animate-scale-in relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 animate-pulse" />
                <Sparkles className="h-12 w-12 text-purple-500 relative z-10" />
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 blur-2xl -z-10 animate-pulse" />
            </div>
            
            <div className="relative">
              <h1 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight bg-gradient-to-r from-slate-900 via-blue-900 to-purple-900 bg-clip-text text-transparent relative z-10 animate-slide-in-right">
                Welcome to Custom Mail Templater
              </h1>
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 blur-2xl -z-10 animate-pulse" />
            </div>
            
            <p className="text-lg sm:text-2xl text-slate-700 max-w-3xl mx-auto leading-relaxed animate-slide-in-right font-medium" style={{animationDelay: '0.3s'}}>
              Create and manage your email templates with 
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent font-bold"> professional ease</span>
            </p>
          </div>

          {/* Enhanced Button Section */}
          <div className="flex flex-col space-y-6 sm:space-y-8 animate-scale-in" style={{animationDelay: '0.6s'}}>
            <Button 
              size="lg" 
              className="group relative w-full h-16 text-lg font-bold shadow-xl hover:shadow-2xl transition-all duration-500 disabled:opacity-50 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 border-0 rounded-2xl overflow-hidden hover:-translate-y-2 hover:scale-[1.02]"
              onClick={() => router.push('/send/all-custom-templates')}
            >
              <div className="relative flex items-center justify-center gap-4 z-10">
                <FileText className="h-6 w-6 transition-all duration-300 group-hover:scale-110 group-hover:rotate-12" />
                <span className="transition-transform duration-300 group-hover:scale-105">
                  View Your Templates
                </span>
              </div>
              
              {/* Animated background shimmer */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full transition-transform duration-1000 group-hover:translate-x-full" />

              {/* Glow effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur" />
            </Button>

            <Button
              size="lg"
              variant="outline"
              className="group relative w-full h-16 text-lg font-bold shadow-lg hover:shadow-xl transition-all duration-500 border-2 border-slate-300/50 bg-white/80 backdrop-blur-sm hover:bg-white/90 hover:border-blue-500/50 rounded-2xl overflow-hidden hover:-translate-y-2 hover:scale-[1.02]"
              onClick={() => router.push('/create-template')}
            >
              <div className="relative flex items-center justify-center gap-4 z-10">
                <Plus className="h-6 w-6 transition-all duration-300 group-hover:scale-110 group-hover:rotate-90 text-slate-700 group-hover:text-blue-600" />
                <span className="transition-all duration-300 group-hover:scale-105 text-slate-700 group-hover:text-blue-600">
                  Build New Template
                </span>
              </div>

              {/* Animated background */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              {/* Animated border shimmer */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-500/30 to-transparent -translate-x-full transition-transform duration-1000 group-hover:translate-x-full opacity-0 group-hover:opacity-100" />
            </Button>
          </div>

          {/* Enhanced Feature Highlight */}
          <div className="text-center animate-fade-in" style={{animationDelay: '0.9s'}}>
            <div className="relative inline-block">
              <p className="text-slate-600 text-base font-medium bg-white/80 backdrop-blur-sm px-6 py-3 rounded-full shadow-lg border border-slate-200/50">
                ✨ Drag & drop editor • Professional templates • Easy sharing
              </p>
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-full blur opacity-50" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
