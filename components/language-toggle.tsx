"use client"

import { Languages } from "lucide-react"
import { useLanguage } from "@/lib/language-context"
import { Button } from "@/components/ui/button"

export function LanguageToggle() {
  const { language, setLanguage } = useLanguage()

  const toggleLanguage = () => {
    setLanguage(language === "en" ? "ar" : "en")
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleLanguage}
      className="relative"
      aria-label={language === "en" ? "Switch to Arabic" : "Switch to English"}
    >
      <Languages className="h-5 w-5" />
      <span className="absolute -bottom-1 -right-1 text-[10px] font-bold bg-primary text-primary-foreground rounded px-1">
        {language === "en" ? "ع" : "EN"}
      </span>
    </Button>
  )
}
