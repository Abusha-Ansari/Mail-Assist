'use client'

import Link from "next/link"
import { Button } from "./ui/button"
import { 
  Mail, 
  LogIn, 
  UserPlus, 
  CreditCard, 
  Menu, 
  X, 
  LogOut, 
  LayoutDashboard,
  Settings,
  HelpCircle,
  User,
  ChevronDown,
} from "lucide-react"
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion"
import { useEffect, useState } from "react"
import { useUser } from "@/context/UserContext"
import { supabase } from "@/lib/supabaseClient"
import { useRouter } from "next/navigation"

export function Navbar() {
  const [mounted, setMounted] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const { loggedIn, setLoggedIn, user } = useUser()
  const router = useRouter()
  const { scrollY } = useScroll()
  
  const navBlur = useTransform(scrollY, [0, 100], [8, 16])
  const navHeight = useTransform(scrollY, [0, 100], [80, 64])
  const logoScale = useTransform(scrollY, [0, 100], [1, 0.9])

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (userMenuOpen && target && !target.closest('.user-menu')) {
        setUserMenuOpen(false)
      }
    }
    document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [userMenuOpen])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    setLoggedIn(false)
    setMenuOpen(false)
    setUserMenuOpen(false)
    router.push("/auth/login")
  }

  const publicLinks = [
    { href: "/features", label: "Features", badge: null },
    { href: "/help", icon: HelpCircle, label: "Help", badge: null },
  ]

  const userLinks = loggedIn ? [
    { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard", badge: null },
    { href: "/send", icon: Mail, label: "Send Mail", badge: null },
    { href: "/buy-credits", icon: CreditCard, label: "Buy Credits" },
  ] : []

  const authLinks = loggedIn ? [] : [
    { href: "/auth/login", icon: LogIn, label: "Login" },
    { href: "/auth/signup", icon: UserPlus, label: "Sign Up" },
  ]

  const userMenuItems = [
    { href: "/profile", icon: User, label: "Profile" },
    { href: "/settings", icon: Settings, label: "Settings" },
    { href: "/help", icon: HelpCircle, label: "Help Center" },
  ]

  if (!mounted) return null

  return (
    <motion.nav 
      className="sticky top-0 left-0 right-0 z-50 border-b border-border/40 pt-5 backdrop-blur-2xl"
      style={{
        backdropFilter: `blur(${navBlur}px)`,
        height: navHeight,
      }}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-full">
          {/* Logo Section */}
          <motion.div
            style={{ scale: logoScale }}
            className="flex items-center"
          >
            <Link href="/" className="flex items-center gap-3 group">
              <motion.div
                whileHover={{ rotate: 15, scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="relative"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-500 rounded-lg blur opacity-75 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative bg-gradient-to-r from-blue-500 to-purple-600 p-2 rounded-lg">
                  <Mail className="h-6 w-6 text-white" />
                </div>
              </motion.div>
              <div className="flex flex-col">
                <motion.span 
                  className="font-bold text-xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
                  whileHover={{ scale: 1.02 }}
                >
                  Mail Assist
                </motion.span>
                <span className="text-xs text-muted-foreground -mt-1">AI-Powered Email</span>
              </div>
            </Link>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1">
            {/* Public Links */}
            {publicLinks.map(({ href, label, badge }) => (
              <motion.div key={href} whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }}>
                <Button variant="ghost" size="sm" asChild className="relative">
                  <Link href={href} className="text-sm font-medium">
                    {label}
                    {badge && (
                      <span className="absolute -top-1 -right-1 bg-gradient-to-r from-orange-400 to-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                        {badge}
                      </span>
                    )}
                  </Link>
                </Button>
              </motion.div>
            ))}

            {/* User Links */}
            {userLinks.map(({ href, icon: Icon, label, badge }) => (
              <motion.div key={href} whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }}>
                <Button variant="ghost" size="sm" asChild className="relative">
                  <Link href={href} className="text-sm font-medium flex items-center gap-2">
                    <Icon className="h-4 w-4" />
                    {label}
                    {badge && (
                      <span className="absolute -top-1 -right-1 bg-gradient-to-r from-green-400 to-blue-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                        {badge}
                      </span>
                    )}
                  </Link>
                </Button>
              </motion.div>
            ))}
          </div>

          {/* Desktop Right Section */}
          <div className="hidden lg:flex items-center gap-2">

            {loggedIn ? (
              <>
                {/* Notifications */}
                {/* <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button variant="ghost" size="icon" className="relative">
                    <Bell className="h-4 w-4" />
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                  </Button>
                </motion.div> */}

                {/* User Menu */}
                <div className="relative user-menu">
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button
                      variant="ghost"
                      onClick={() => setUserMenuOpen(!userMenuOpen)}
                      className="flex items-center gap-2 px-3"
                    >
                      <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                        <User className="h-4 w-4 text-white" />
                      </div>
                      <span className="text-sm font-medium">{user?.username?.split('@')[0] || 'User'}</span>
                      <motion.div
                        animate={{ rotate: userMenuOpen ? 180 : 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <ChevronDown className="h-4 w-4" />
                      </motion.div>
                    </Button>
                  </motion.div>

                  <AnimatePresence>
                    {userMenuOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        className="absolute right-0 mt-2 w-48 dark:bg-black/80 dark:text-white text-white bg-black/80 backdrop-blur-2xl border rounded-lg shadow-lg py-1"
                      >
                        {userMenuItems.map(({ href, icon: Icon, label }) => (
                          <Link
                            key={href}
                            href={href}
                            onClick={() => setUserMenuOpen(false)}
                            className="flex items-center gap-3 px-4 py-2 text-sm hover:bg-accent/50 transition-colors"
                          >
                            <Icon className="h-4 w-4" />
                            {label}
                          </Link>
                        ))}
                        <hr className="my-1" />
                        <button
                          onClick={handleLogout}
                          className="flex items-center gap-3 px-4 py-2 text-sm hover:bg-accent/50 transition-colors w-full text-left text-red-600"
                        >
                          <LogOut className="h-4 w-4" />
                          Logout
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-2">
                {authLinks.map(({ href, icon: Icon, label }) => (
                  <motion.div key={href} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button
                      variant={label === 'Sign Up' ? 'default' : 'ghost'}
                      size="sm"
                      asChild
                      className={label === 'Sign Up' ? 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700' : ''}
                    >
                      <Link href={href} className="flex items-center gap-2">
                        <Icon className="h-4 w-4" />
                        {label}
                      </Link>
                    </Button>
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <div className="lg:hidden flex items-center gap-2 text-black dark:text-white">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setMenuOpen(!menuOpen)}
                className="relative"
              >
                <motion.div
                  animate={{ rotate: menuOpen ? 90 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                </motion.div>
              </Button>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden overflow-hidden bg-background/95 backdrop-blur-sm border-t"
          >
            <div className="container mx-auto px-4 py-4">
              <div className="flex flex-col gap-2 text-white bg-black/80 backdrop-blur-xl rounded-lg p-4">

                {/* User Info (if logged in) */}
                {loggedIn && (
                  <div className="flex items-center gap-3 p-3 bg-accent/20 rounded-lg mb-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                      <User className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <p className="font-bold text-lg">{user?.username?.split('@')[0] || 'User'}</p>
                      {/* <p className="text-xs text-muted-foreground">{user?.username}</p> */}
                    </div>
                  </div>
                )}

                {/* Navigation Links */}
                {[...publicLinks, ...userLinks].map(({ href, icon: Icon, label, badge }) => (
                  <motion.div
                    key={href}
                    whileHover={{ x: 4 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Link
                      href={href}
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center gap-3 p-3 rounded-lg hover:bg-accent/50 transition-colors relative"
                    >
                      {Icon && <Icon className="h-5 w-5" />}
                      <span className="font-medium">{label}</span>
                      {badge && (
                        <span className="ml-auto bg-gradient-to-r from-green-400 to-blue-500 text-white text-xs px-2 py-1 rounded-full">
                          {badge}
                        </span>
                      )}
                    </Link>
                  </motion.div>
                ))}

                {/* Auth Links */}
                {!loggedIn && (
                  <div className="flex flex-col gap-2 mt-4 pt-4 border-t">
                    {authLinks.map(({ href, icon: Icon, label }) => (
                      <motion.div key={href} whileTap={{ scale: 0.98 }}>
                        <Button
                          variant={label === 'Sign Up' ? 'default' : 'outline'}
                          size="lg"
                          asChild
                          className={`w-full justify-start ${
                            label === 'Sign Up' ? 'bg-gradient-to-r from-blue-500 to-purple-600' : ''
                          }`}
                        >
                          <Link href={href} onClick={() => setMenuOpen(false)}>
                            <Icon className="mr-2 h-5 w-5" />
                            {label}
                          </Link>
                        </Button>
                      </motion.div>
                    ))}
                  </div>
                )}

                {/* Logout Button */}
                {loggedIn && (
                  <motion.div whileTap={{ scale: 0.98 }} className="mt-4 pt-4 border-t">
                    <Button
                      variant="outline"
                      size="lg"
                      onClick={handleLogout}
                      className="w-full justify-start text-red-600 border-red-200 hover:bg-red-50"
                    >
                      <LogOut className="mr-2 h-5 w-5" />
                      Logout
                    </Button>
                  </motion.div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  )
}