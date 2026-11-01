"use client"

import * as Dialog from "@radix-ui/react-dialog"
import { MapPin, X } from "lucide-react"
import { Button } from "@/src/components/ui/button"
import { getLocationMapUrl, type Location } from "@/src/lib/locations"

export default function LocationMapDialog({ location }: Readonly<{ location: Location }>) {
  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <Button
            type="button"
            variant="outline"
            className="h-auto min-h-11 rounded-xl border-primary/40 bg-card/40 px-3 py-2 text-primary hover:bg-primary hover:text-primary-foreground md:px-4"
            aria-label={`Открыть на карте: ${location.name}`}
        >
          <MapPin aria-hidden="true" />
          На карте
        </Button>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-[70] bg-black/40 backdrop-blur-sm data-[state=open]:animate-in data-[state=open]:fade-in-0 motion-reduce:animate-none" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-[71] max-h-[calc(100dvh-2rem)] w-[calc(100%-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-3xl border border-border bg-card/95 p-6 text-foreground shadow-2xl backdrop-blur-lg outline-none sm:p-8">
          <Dialog.Close asChild>
            <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-3 top-3 size-11 rounded-full hover:bg-primary/10 hover:text-primary"
                aria-label="Закрыть"
            >
              <X aria-hidden="true" />
            </Button>
          </Dialog.Close>

          <Dialog.Title className="pr-8 font-serif text-3xl font-medium">Открыть карты?</Dialog.Title>
          <Dialog.Description className="mt-3 text-sm leading-relaxed text-foreground/80">
            Адрес откроется в Яндекс Картах в новой вкладке.
          </Dialog.Description>
          <div className="my-6 rounded-2xl border border-border bg-primary/5 p-4">
            <p className="font-medium leading-snug">{location.name}</p>
            <p className="mt-2 text-sm leading-relaxed text-foreground/80">{location.address}</p>
            {location.metro && <p className="mt-2 text-xs text-primary">Метро: {location.metro}</p>}
          </div>

          <div className="grid gap-3 min-[380px]:grid-cols-2">
            <Dialog.Close asChild>
              <Button type="button" variant="outline" className="h-12 rounded-xl border-primary/30 hover:bg-primary/10 hover:text-primary">
                Отмена
              </Button>
            </Dialog.Close>
            <Dialog.Close asChild>
              <Button asChild className="h-12 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90">
                <a href={getLocationMapUrl(location)} target="_blank" rel="noopener noreferrer">
                  Открыть карты
                  <span className="sr-only"> (в новой вкладке)</span>
                </a>
              </Button>
            </Dialog.Close>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
