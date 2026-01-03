"use client"

import { Github, Linkedin, Mail, Phone, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/lib/language-context"
import { getTranslation } from "@/lib/translations"
import { cn } from "@/lib/utils"

export function HeroSection() {
  const { language, isRTL } = useLanguage()
  const t = getTranslation(language)

  return (
    <section className="min-h-screen flex flex-col justify-center pt-20 lg:pt-0">
      <div className={cn("grid lg:grid-cols-2 gap-12 items-center", isRTL && "lg:grid-flow-col-dense")}>
        <div className={cn("space-y-6", isRTL && "text-right lg:order-2")}>
          <div className="space-y-2">
            <p className="text-primary font-mono text-sm">{t.hero.greeting}</p>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground text-balance">{t.hero.name}</h1>
            <p className="text-xl md:text-2xl text-muted-foreground">{t.hero.title}</p>
            <p className="text-lg text-primary">{t.hero.specialization}</p>
          </div>

          <p className="text-muted-foreground leading-relaxed max-w-lg">{t.hero.description}</p>

          <div
            className={cn(
              "flex flex-wrap gap-4 text-sm text-muted-foreground",
              isRTL && "flex-row-reverse justify-end",
            )}
          >
            <span className={cn("flex items-center gap-2", isRTL && "flex-row-reverse")}>
              <MapPin size={16} className="text-primary" />
              {t.hero.location}
            </span>
            <a
              href="mailto:AbdullahOmar@outlook.com"
              className={cn(
                "flex items-center gap-2 hover:text-primary transition-colors",
                isRTL && "flex-row-reverse",
              )}
            >
              <Mail size={16} className="text-primary" />
              AbdullahOmar@outlook.com
            </a>
          </div>

          <div className={cn("flex items-center gap-4 pt-4", isRTL && "flex-row-reverse justify-end")}>
            <Button asChild>
              <a href="#contact">{t.hero.getInTouch}</a>
            </Button>
            <Button variant="outline" asChild>
              <a href="#experience">{t.hero.viewExperience}</a>
            </Button>
            <Button variant="outline" asChild>
              <a href="/services">{t.hero.viewServices}</a>
            </Button>
          </div>

          <div className={cn("flex items-center gap-4 pt-4", isRTL && "flex-row-reverse justify-end")}>
            <a
              href="https://linkedin.com/in/AbdullahOmar97"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-primary transition-colors"
              aria-label="LinkedIn"
            >
              <Linkedin size={22} />
            </a>
            <a
              href="https://github.com/AbdullahOmar97"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-primary transition-colors"
              aria-label="GitHub"
            >
              <Github size={22} />
            </a>
            <a
              href="tel:+962787900948"
              className="text-muted-foreground hover:text-primary transition-colors"
              aria-label="Phone"
            >
              <Phone size={22} />
            </a>
          </div>
        </div>

        <div className={cn("hidden lg:flex justify-center", isRTL && "lg:order-1")}>
          <div className="relative">
            <div className="w-72 h-72 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
              <div className="w-60 h-60 rounded-full bg-card border border-border flex items-center justify-center">
                <span className="text-6xl font-bold text-primary">AO</span>
              </div>
            </div>
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-primary/10 rounded-full blur-2xl" />
            <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-primary/10 rounded-full blur-2xl" />
          </div>
        </div>
      </div>
    </section>
  )
}
