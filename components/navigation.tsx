"use client"

import { useState, useEffect } from "react"
import { Menu, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { ThemeToggle } from "./theme-toggle"
import { LanguageToggle } from "./language-toggle"
import { useLanguage } from "@/lib/language-context"
import { getTranslation } from "@/lib/translations"

export function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { language, isRTL } = useLanguage()
  const t = getTranslation(language)

  const navItems = [
    { label: t.nav.about, href: "/#about" },
    { label: t.nav.experience, href: "/#experience" },
    { label: t.nav.skills, href: "/#skills" },
    { label: t.nav.education, href: "/#education" },
    { label: t.nav.contact, href: "/#contact" },
    { label: t.nav.services, href: "/services" },
  ]

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled ? "bg-background/80 backdrop-blur-md border-b border-border" : "bg-transparent",
      )}
    >
      <nav className="container mx-auto max-w-6xl px-6 lg:px-8 py-4">
        <div className={cn("flex items-center justify-between", isRTL && "flex-row-reverse")}>
          <a href="#" className="text-xl font-semibold text-foreground">
            AO<span className="text-primary">.</span>
          </a>

          {/* Desktop Navigation */}
          <ul className={cn("hidden md:flex items-center gap-8", isRTL && "flex-row-reverse")}>
            {navItems.map((item) => (
              <li key={item.href}>
                <a href={item.href} className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  {item.label}
                </a>
              </li>
            ))}
          </ul>

          <div className={cn("flex items-center gap-2", isRTL && "flex-row-reverse")}>
            <LanguageToggle />
            <ThemeToggle />

            {/* Mobile Menu Button */}
            <button
              className="md:hidden text-foreground"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 pt-4 px-4 -mx-4 bg-background/95 backdrop-blur-md border-t border-border rounded-b-lg shadow-lg">
            <ul className={cn("flex flex-col gap-4", isRTL && "items-end")}>
              {navItems.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    className="text-base text-foreground hover:text-primary transition-colors block py-2 font-medium"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </nav>
    </header>
  )
}
