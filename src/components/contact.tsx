"use client"

import { useState } from "react"
import { Button } from "@/src/components/ui/button"
import { Input } from "@/src/components/ui/input"
import { Textarea } from "@/src/components/ui/textarea"
import HandDrawnArrow from "./hand-drawn-arrow"

export default function Contact() {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <section className="py-24 px-4">
      <div className="max-w-4xl mx-auto">
        <h2 className="font-serif text-4xl md:text-6xl font-light text-center mb-16 text-balance">Свяжитесь с нами</h2>
        <form className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <Input placeholder="Ваше имя" className="bg-background border-border rounded-xl px-6 py-6 text-base" />
            <Input
              type="email"
              placeholder="Email"
              className="bg-background border-border rounded-xl px-6 py-6 text-base"
            />
          </div>
          <Input placeholder="Телефон" className="bg-background border-border rounded-xl px-6 py-6 text-base" />
          <Textarea
            placeholder="Ваше сообщение"
            rows={6}
            className="bg-background border-border rounded-xl px-6 py-4 text-base resize-none"
          />
          <div className="text-center relative inline-block w-full">
            <Button
              type="submit"
              size="lg"
              className="bg-primary hover:bg-primary/90 text-primary-foreground px-12 py-6 text-lg rounded-full transition-all duration-300"
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              Отправить
            </Button>
            {isHovered && (
              <div className="absolute -right-16 top-1/2 -translate-y-1/2">
                <HandDrawnArrow />
              </div>
            )}
          </div>
        </form>
      </div>
    </section>
  )
}
