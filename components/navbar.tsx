'use client'

import Link from "next/link"
import { Button } from "./ui/button"
import { Moon, Sun, Mail, LogIn, UserPlus, CreditCard, Menu, X } from "lucide-react"
import { useTheme } from "next-themes"
import { motion, AnimatePresence } from "framer-motion"
import { useEffect, useState } from "react"

export function Navbar() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark")
  }

  const navLinks = [
    { href: "/send", icon: Mail, label: "Send Mail" },
    { href: "/buy-credits", icon: CreditCard, label: "Buy Credits" },
    { href: "/auth/login", icon: LogIn, label: "Login" },
    { href: "/auth/signup", icon: UserPlus, label: "Sign Up" },
  ]

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center justify-between">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Link href="/" className="flex items-center gap-2 font-bold text-primary">
            <Mail className="h-5 w-5" />
            <span>Mail Assist</span>
          </Link>
        </motion.div>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-2">
          {navLinks.map(({ href, icon: Icon, label }) => (
            <motion.div key={href} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button variant="ghost" size="sm" asChild>
                <Link href={href}>
                  <Icon className="mr-2 h-4 w-4" />
                  {label}
                </Link>
              </Button>
            </motion.div>
          ))}

          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleTheme}
              aria-label="Toggle theme"
            >
              {mounted && (theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />)}
            </Button>
          </motion.div>
        </div>

        {/* Mobile Menu Toggle */}
        <div className="md:hidden">
          <Button variant="ghost" size="icon" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu">
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
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
            <div className="flex flex-col gap-1 px-4 pb-4">
              {navLinks.map(({ href, icon: Icon, label }) => (
                <Link key={href} href={href} className="flex items-center gap-2 py-2 text-sm font-medium text-primary hover:underline">
                  <Icon className="h-4 w-4" />
                  {label}
                </Link>
              ))}
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleTheme}
                className="flex items-center gap-2"
              >
                {mounted && (theme === "dark" ? <><Sun className="h-4 w-4" /> Light Mode</> : <><Moon className="h-4 w-4" /> Dark Mode</>)}
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}
