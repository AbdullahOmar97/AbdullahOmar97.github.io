"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { MessageSquare, X, Send, Mic, Bot, Loader2, Volume2, VolumeX } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/lib/language-context"

interface Message {
  role: "user" | "assistant"
  content: string
  id: string
}

export function AIChatbot() {
  const { language } = useLanguage()
  const [isOpen, setIsOpen] = useState(false)
  const [inputValue, setInputValue] = useState("")
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [autoSpeak, setAutoSpeak] = useState(true)
  const [speechSupported, setSpeechSupported] = useState(false)

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const recognitionRef = useRef<any>(null)
  
  // --- تعريف المرجع الصوتي هنا لحل مشكلة الـ Error ---
  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    const API = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    setSpeechSupported(!!API)
    if (API) {
      const rec = new API()
      rec.continuous = false
      rec.onresult = (e: any) => setInputValue(e.results[0][0].transcript)
      rec.onstart = () => setIsListening(true)
      rec.onend = () => setIsListening(false)
      recognitionRef.current = rec
    }
  }, [])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

 const speakText = (text: string) => {
  if (!autoSpeak) return;

  // إيقاف الصوت الحالي
  if (audioRef.current) {
    audioRef.current.pause();
    audioRef.current = null;
  }

  const cleanText = text.replace(/[*#_]/g, '').trim();
  if (!cleanText) return;

  const langCode = language === "ar" ? "ar" : "en";
  
  const url = `/api/tts?text=${encodeURIComponent(cleanText)}&lang=${langCode}`;

  const audio = new Audio(url);
  audioRef.current = audio;
  
  setIsSpeaking(true);
  
  audio.play().catch(err => {
    console.error("Audio Playback Error:", err);
    setIsSpeaking(false);
  });
  
  audio.onended = () => setIsSpeaking(false);
  audio.onerror = () => setIsSpeaking(false);
};

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    const cleanInput = (inputValue || "").trim()
    if (!cleanInput || isLoading) return

    const userMsg: Message = { role: "user", content: cleanInput, id: Date.now().toString() }
    setMessages(prev => [...prev, userMsg])
    setInputValue("")
    setIsLoading(true)

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        body: JSON.stringify({ messages: [...messages, userMsg] }),
      })

      if (!response.body) throw new Error("No body")
      
      const reader = response.body.getReader()
      const decoder = new TextDecoder()
      let assistantText = ""
      
      const assistantId = (Date.now() + 1).toString()
      setMessages(prev => [...prev, { role: "assistant", content: "", id: assistantId }])

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        
        const chunk = decoder.decode(value, { stream: true })
        assistantText += chunk
        
        setMessages(prev => prev.map(msg => 
          msg.id === assistantId ? { ...msg, content: assistantText } : msg
        ))
      }

      // استدعاء دالة النطق بعد انتهاء استلام النص بالكامل
      if (autoSpeak) speakText(assistantText)
      
    } catch (err) {
      console.error("Chat Error:", err)
    } finally {
      setIsLoading(false)
    }
  }

  const t = {
    en: { title: "AI Assistant", placeholder: "Ask anything...", greeting: "Hello! How can I help you today?" },
    ar: { title: "المساعد الذكي", placeholder: "اسأل عن أي شيء...", greeting: "مرحباً! كيف يمكنني مساعدتك اليوم؟" }
  }[language]

  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full shadow-lg transition-transform ${isOpen ? "scale-0" : "scale-100"}`}
      >
        <MessageSquare className="h-6 w-6" />
      </Button>

      <div
        className={`fixed bottom-6 right-6 z-50 w-[400px] max-w-[calc(100vw-48px)] h-[550px] flex flex-col rounded-2xl bg-background border shadow-2xl transition-all duration-300 ${isOpen ? "scale-100 opacity-100" : "scale-0 opacity-0 pointer-events-none"}`}
        dir={language === "ar" ? "rtl" : "ltr"}
      >
        <div className="flex items-center justify-between p-4 border-b bg-primary/5 rounded-t-2xl">
          <div className="flex items-center gap-2">
            <Bot className="h-5 w-5 text-primary" />
            <span className="font-bold text-sm">{t.title}</span>
          </div>
          <div className="flex gap-1">
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => {
                setAutoSpeak(!autoSpeak)
                if (audioRef.current) audioRef.current.pause()
            }}>
              {autoSpeak ? <Volume2 size={16} /> : <VolumeX size={16} />}
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => {
                setIsOpen(false)
                if (audioRef.current) audioRef.current.pause()
            }}><X size={16} /></Button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <div className="bg-muted p-3 rounded-2xl text-sm max-w-[85%]">{t.greeting}</div>
          {messages.map((msg) => (
            <div key={msg.id} className={`flex gap-2 ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
              <div className={`p-3 rounded-2xl text-sm max-w-[85%] ${msg.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted"}`}>
                {msg.content}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        <form onSubmit={handleSendMessage} className="p-4 border-t flex gap-2">
          <input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={t.placeholder}
            className="flex-1 h-10 bg-muted rounded-full px-4 text-sm focus:outline-none"
          />
          {speechSupported && (
            <Button 
              type="button" 
              variant="ghost" 
              size="icon" 
              onClick={() => isListening ? recognitionRef.current.stop() : (recognitionRef.current.lang = language === 'ar' ? 'ar-SA' : 'en-US', recognitionRef.current.start())}
            >
              <Mic className={`h-4 w-4 ${isListening ? "text-red-500 animate-pulse" : ""}`} />
            </Button>
          )}
          <Button type="submit" size="icon" disabled={!inputValue.trim() || isLoading}>
            {isLoading ? <Loader2 className="animate-spin h-4 w-4" /> : <Send className="h-4 w-4" />}
          </Button>
        </form>
      </div>
    </>
  )
}
