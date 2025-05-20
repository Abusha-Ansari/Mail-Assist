'use client'

import Link from "next/link"
import { Button } from "./ui/button"
import { Moon, Sun, Mail, LogIn, UserPlus, CreditCard, Menu, X, LogOut } from "lucide-react"
import { useTheme } from "next-themes"
import { motion, AnimatePresence } from "framer-motion"
import { useEffect, useState } from "react"
import { useUser } from "@/context/UserContext"
import { supabase } from "@/lib/supabaseClient";

export function Navbar() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const { loggedIn, setLoggedIn } = useUser()
  

  useEffect(() => {
    setMounted(true)
  }, [])

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark")
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    setLoggedIn(false) // or call a function to recheck auth status
  }

  const commonLinks = [
    { href: "/send", icon: Mail, label: "Send Mail" },
    { href: "/buy-credits", icon: CreditCard, label: "Buy Credits" },
  ]

  const authLinks = loggedIn
    ? [] // Don't use link for logout, handled separately below
    : [
        { href: "/auth/login", icon: LogIn, label: "Login" },
        { href: "/auth/signup", icon: UserPlus, label: "Sign Up" },
      ]

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 pl-5 pr-5">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Link href="/" className="flex items-center gap-3 font-bold text-xl text-primary">
            <Mail className="h-6 w-6" />
            <span>Mail Assist</span>
          </Link>
        </motion.div>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-3">
          {[...commonLinks, ...authLinks].map(({ href, icon: Icon, label }) => (
            <motion.div key={href} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button variant="ghost" size="lg" asChild className="text-base">
                <Link href={href}>
                  <Icon className="mr-2 h-5 w-5" />
                  {label}
                </Link>
              </Button>
            </motion.div>
          ))}

          {/* Logout Button if logged in */}
          {loggedIn && (
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="ghost"
                size="lg"
                onClick={handleLogout}
                className="text-base flex items-center gap-2"
              >
                <LogOut className="h-5 w-5" />
                Logout
              </Button>
            </motion.div>
          )}

          {/* Theme Toggle */}
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className="text-base"
            >
              {mounted && (theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />)}
            </Button>
          </motion.div>
        </div>

        {/* Mobile Menu Toggle */}
        <div className="md:hidden">
          <Button variant="ghost" size="icon" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu">
            {menuOpen ? <X className="h-10 w-10" /> : <Menu className="h-10 w-10" />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu Panel */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden overflow-hidden"
          >
            <div className="flex flex-col gap-2 px-4 pb-4">
              {[...commonLinks, ...authLinks].map(({ href, icon: Icon, label }) => (
                <Link
                  key={href}
                  href={href}
                  className="flex items-center gap-3 py-3 text-base font-medium text-primary hover:underline"
                >
                  <Icon className="h-5 w-5" />
                  {label}
                </Link>
              ))}

              {loggedIn && (
                <Button
                  variant="ghost"
                  size="lg"
                  onClick={handleLogout}
                  className="flex items-center gap-3 text-base"
                >
                  <LogOut className="h-5 w-5" />
                  Logout
                </Button>
              )}

              <Button
                variant="ghost"
                size="lg"
                onClick={toggleTheme}
                className="flex items-center gap-3 text-base"
              >
                {mounted && (theme === "dark"
                  ? <><Sun className="h-5 w-5" /> Light Mode</>
                  : <><Moon className="h-5 w-5" /> Dark Mode</>
                )}
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}
