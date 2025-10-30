"use client"

import { useEffect, useRef } from "react"
import {useIsMobile} from "@/src/hooks/use-mobile";

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

// Split reviews into 3 columns
const column1 = reviews.slice(0, 3)
const column2 = reviews.slice(3, 6)
const column3 = reviews.slice(6, 9)

function ReviewCard({ name, text, rating }: { name: string; text: string; rating: number }) {
  return (
    <div className="bg-background border border-border rounded-2xl p-6 mb-4 hover:shadow-lg transition-shadow duration-300">
      <div className="flex gap-1 mb-3">
        {Array.from({ length: rating }).map((_, i) => (
          <svg key={i} className="w-4 h-4 fill-primary" viewBox="0 0 20 20">
            <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
          </svg>
        ))}
      </div>
      <p className="text-muted-foreground leading-relaxed mb-4 text-sm">{text}</p>
      <p className="font-medium text-foreground">{name}</p>
    </div>
  )
}

function ScrollingColumn({
  reviews,
  direction,
}: {
  reviews: typeof column1
  direction: "up" | "down"
}) {
  const columnRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const column = columnRef.current
    if (!column) return

    let animationId: number
    let position = direction === "up" ? 0 : -column.scrollHeight / 2

    const animate = () => {
      if (direction === "up") {
        position -= 0.5
        if (position <= -column.scrollHeight / 2) {
          position = 0
        }
      } else {
        position += 0.5
        if (position >= 0) {
          position = -column.scrollHeight / 2
        }
      }
      column.style.transform = `translateY(${position}px)`
      animationId = requestAnimationFrame(animate)
    }

    animationId = requestAnimationFrame(animate)

    return () => cancelAnimationFrame(animationId)
  }, [direction])

  return (
    <div className="h-[600px] overflow-hidden relative">
      <div className="absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-card to-transparent z-10" />
      <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-card to-transparent z-10" />
      <div ref={columnRef} className="will-change-transform">
        {[...reviews, ...reviews].map((review, index) => (
          <ReviewCard key={index} {...review} />
        ))}
      </div>
    </div>
  )
}

export default function Reviews() {
    const IsMobile = useIsMobile();

  return (
    <section id="reviews" className="py-24 px-4 bg-card border-b border-border">
      <div className="max-w-7xl mx-auto">
        <h2 className="font-serif text-4xl md:text-6xl font-light text-center mb-16 text-balance">
          Отзывы наших гостей
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
            {!IsMobile && (
                <>
                <ScrollingColumn reviews={column1} direction="up" />
                <ScrollingColumn reviews={column2} direction="down" />
                 <ScrollingColumn reviews={column3} direction="up" />
                </>
            )}
            {IsMobile && (
                <ScrollingColumn reviews={reviews} direction="up" />
            )}

        </div>
      </div>
    </section>
  )
}
