"use client"

import { useEffect, useRef, useState } from "react"
import { useReducedMotion } from "motion/react"
import { Pause, Play } from "lucide-react"
import { Button } from "@/src/components/ui/button"
import { useIsMobile } from "@/src/hooks/use-mobile"

const reviews = [
    {
      name: "Иван Данилов",
      text: "Семейный ужин: быстрое вежливое обслуживание, отличные чаи и шашлык, особенно понравилась лепешка с сыром и шпинатом.",
      rating: 5
    },
    {
      name: "Светлана",
      text: "Найдено случайно, без брони сели и прекрасно поужинали — вежливый сервис, чисто, вкусно.",
      rating: 5
    },
    {
      name: "Николай Н.",
      text: "Лучшее в районе: блюда (жижиг-галнаш) на высоте, впечатлил вкус и бульон.",
      rating: 5
    },
    {
      name: "Булат Нутфуллин",
      text: "Великолепно: качество мяса и гарниров отличное; чапильг — топ.",
      rating: 5
    },
    {
      name: "Милана Ш.",
      text: "Вкусная вайнахская кухня, уютное помещение и милые официанты; подарки в виде магнитиков — приятный штрих.",
      rating: 5
    },
    {
      name: "Диана Филатова",
      text: "Уютно, добрые официанты, вкусно и в конце подарки — всем советую.",
      rating: 5
    },
    {
      name: "Алиса Гацура",
      text: "Случайно попали — не пожалели: чисто, тихо, вкусные шашлыки и чаи; рекомендую.",
      rating: 5
    },
    {
      name: "Бёден Фарида",
      text: "Вкус мяса как дома: халяль, чисто и очень вкусно; буду ходить только сюда.",
      rating: 5
    },
    {
      name: "Эми Ми",
      text: "Заведение замечательное: отличный персонал, уют, частые посещения после знакомства с этим местом.",
      rating: 5
    },
    {
      name: "Илья",
      text: "Случайно выбрали — теперь любимое место: внимательное обслуживание и великолепная кухня.",
      rating: 5
    },
    {
      name: "Ариша",
      text: "Очень понравилось — вернёмся снова.",
      rating: 4
    },
    {
      name: "Джамиля Р.",
      text: "Праздновали мамин юбилей — большие порции, отличные лимонады и отличный шашлык; придём ещё.",
      rating: 5
    },
    {
      name: "Murad",
      text: "Нежное мясо и отличная кухня вайнахской традиции — обязательно вернусь.",
      rating: 5
    },
    {
      name: "Сергей☮️",
      text: "Кутабы шикарные, кухня в целом на пятёрку, но есть небольшие замечания по овощам.",
      rating: 4
    },
    {
      name: "Диана максимова",
      text: "Лучшее заведение с вкусной едой: порции, соотношение цена/качество и прекрасная кухня.",
      rating: 5
    },
    {
      name: "Samir Samir",
      text: "Еда всегда свежая и вкусная; хожу каждую неделю — персонал заботливый.",
      rating: 5
    },
    {
      name: "Анастасия",
      text: "Потрясающий ресторан: душевное обслуживание, огромные порции и отличная атмосфера — вернёмся ещё.",
      rating: 5
    }
]

const columns = [0, 1, 2].map(column => reviews.filter((_, index) => index % 3 === column))

function ReviewCard({ name, text, rating }: { name: string; text: string; rating: number }) {
  return (
    <figure className="rounded-2xl border border-border bg-background p-5 shadow-sm sm:p-6">
      <div className="mb-4 flex gap-1" role="img" aria-label={`Оценка: ${rating} из 5`}>
        {Array.from({ length: rating }).map((_, index) => (
          <svg key={index} className="size-4 fill-primary" viewBox="0 0 20 20" aria-hidden="true">
            <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
          </svg>
        ))}
      </div>
      <blockquote className="text-sm leading-relaxed text-muted-foreground">{text}</blockquote>
      <figcaption className="mt-4 border-t border-border/60 pt-4 font-medium text-foreground">{name}</figcaption>
    </figure>
  )
}

function ScrollingColumn({ items, direction, paused, label }: {
  items: typeof reviews
  direction: "up" | "down"
  paused: boolean
  label: string
}) {
  const columnRef = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const column = columnRef.current
    if (!column) return
    const observer = new IntersectionObserver(([entry]) => setIsVisible(entry.isIntersecting), { threshold: 0.05 })
    observer.observe(column)
    return () => observer.disconnect()
  }, [])

  return (
    <div ref={columnRef} className="review-viewport relative h-[min(38rem,75svh)] overflow-hidden rounded-2xl outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-4" role="region" aria-label={label} aria-describedby="reviews-instructions" tabIndex={0}>
      <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-12 bg-gradient-to-b from-card to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-12 bg-gradient-to-t from-card to-transparent" />
      <div className="review-track" style={{ animationDirection: direction === "down" ? "reverse" : "normal", animationPlayState: paused || !isVisible ? "paused" : "running" }}>
        <div className="space-y-4 pb-4">
          {items.map(review => <ReviewCard key={review.name} {...review} />)}
        </div>
        <div className="review-copy space-y-4 pb-4" aria-hidden="true">
          {items.map(review => <ReviewCard key={review.name} {...review} />)}
        </div>
      </div>
    </div>
  )
}

export default function Reviews() {
  const isMobile = useIsMobile()
  const reduceMotion = useReducedMotion()
  const [isPaused, setIsPaused] = useState(false)

  return (
    <section id="reviews" aria-labelledby="reviews-title" className="section-space border-b border-border bg-card">
      <div className="section-shell">
        <div className="mb-8 text-center md:mb-12">
          <h2 id="reviews-title" className="reveal-on-scroll font-serif text-4xl font-light text-balance md:text-6xl">Отзывы наших гостей</h2>
          <p id="reviews-instructions" className="sr-only">При наведении отзывы останавливаются. Для чтения с клавиатуры перейдите в колонку отзывов клавишей Tab и прокручивайте её стрелками вверх и вниз.</p>
          {!reduceMotion && (
            <Button variant="outline" className="mt-6 rounded-full px-5" onClick={() => setIsPaused(paused => !paused)} aria-pressed={isPaused}>
              {isPaused ? <Play aria-hidden="true" /> : <Pause aria-hidden="true" />}
              {isPaused ? "Продолжить движение" : "Приостановить отзывы"}
            </Button>
          )}
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {isMobile ? (
            <ScrollingColumn items={reviews} direction="up" paused={isPaused} label="Отзывы гостей" />
          ) : columns.map((items, index) => (
            <ScrollingColumn key={index} items={items} direction={index === 1 ? "down" : "up"} paused={isPaused} label={`Отзывы гостей, колонка ${index + 1}`} />
          ))}
        </div>
      </div>
    </section>
  )
}
