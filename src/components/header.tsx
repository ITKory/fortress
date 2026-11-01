"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { usePathname } from "next/navigation";
import { cn } from "@/src/lib/utils";

const navLinks = [
    { href: "#about", label: "О нас" },
    { href: "#locations", label: "Локации" },
    { href: "#menu", label: "Меню" },
    { href: "#reviews", label: "Отзывы" },
];
const orderHref = "https://eda.yandex.ru/r/bashnya_hudma";

export function MobileMenu({ activeSection }: Readonly<{ activeSection: string | null }>) {
    const [isOpen, setIsOpen] = useState(false);
    const pathname = usePathname();

    useEffect(() => {
        const media = window.matchMedia("(min-width: 1024px)");
        const closeOnDesktop = () => {
            if (media.matches) setIsOpen(false);
        };
        media.addEventListener("change", closeOnDesktop);
        return () => media.removeEventListener("change", closeOnDesktop);
    }, []);

    useEffect(() => setIsOpen(false), [pathname]);

    return (
        <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
            <Dialog.Trigger asChild>
                <Button variant="outline" className="rounded-full border-2 border-primary bg-transparent px-5 text-primary hover:bg-primary/10">
                    Меню
                </Button>
            </Dialog.Trigger>
            <Dialog.Portal>
                <Dialog.Overlay className="fixed inset-0 z-60 bg-foreground/30 backdrop-blur-sm data-[state=open]:animate-in data-[state=open]:fade-in-0" />
                <Dialog.Content className="fixed inset-y-0 left-0 z-[61] flex w-[calc(100%-2rem)] max-w-sm flex-col overflow-y-auto overscroll-contain border-r border-border bg-card p-6 pb-[max(1.5rem,env(safe-area-inset-bottom))] text-foreground shadow-2xl outline-none data-[state=open]:animate-in data-[state=open]:slide-in-from-left data-[state=open]:duration-300">
                    <div className="mb-8 flex items-center justify-between gap-4">
                        <Dialog.Title className="text-2xl font-semibold">Разделы сайта</Dialog.Title>
                        <Dialog.Close asChild>
                            <Button variant="ghost" size="icon" className="rounded-full" aria-label="Закрыть меню">
                                <X className="size-5" aria-hidden="true" />
                            </Button>
                        </Dialog.Close>
                    </div>
                    <Dialog.Description className="sr-only">Выберите раздел сайта ресторана «Башня».</Dialog.Description>
                    <nav className="flex flex-col gap-2" aria-label="Мобильная навигация">
                        {navLinks.map(link => {
                            const isActive = activeSection === link.href.slice(1);
                            return (
                                <Dialog.Close asChild key={link.href}>
                                    <Link
                                        href={link.href}
                                        aria-current={isActive ? "location" : undefined}
                                        className={cn("flex min-h-12 items-center rounded-xl px-4 py-3 text-sm font-medium uppercase transition-colors hover:bg-primary/10", isActive && "bg-primary/10")}
                                    >
                                        {link.label}
                                    </Link>
                                </Dialog.Close>
                            );
                        })}
                    </nav>
                    <div className="mt-8 border-t border-border pt-6">
                        <Button asChild size="lg" variant="outline" className="w-full rounded-full border-2 border-primary hover:bg-primary hover:text-primary-foreground">
                            <a href={orderHref} target="_blank" rel="noopener noreferrer">Заказать на Яндекс Еде</a>
                        </Button>
                        <p className="mt-5 text-sm italic tracking-tighter">Вайнахская, Восточная и Европейская кухня.</p>
                    </div>
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    );
}

export function Header() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [activeSection, setActiveSection] = useState<string | null>(null);

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 20);
        handleScroll();
        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    useEffect(() => {
        const targets = navLinks.map(link => document.getElementById(link.href.slice(1))).filter((target): target is HTMLElement => target !== null);
        const observer = new IntersectionObserver(entries => {
            const visible = entries.filter(entry => entry.isIntersecting).sort((first, second) => second.intersectionRatio - first.intersectionRatio);
            if (visible[0]) setActiveSection(visible[0].target.id);
        }, { rootMargin: "-15% 0px -45% 0px", threshold: [0, 0.25, 0.5] });
        targets.forEach(target => observer.observe(target));
        return () => observer.disconnect();
    }, []);

    return (
        <header className={cn(
            "fixed inset-x-0 z-50 border transition-[top,margin,border-radius,background-color,border-color,box-shadow] duration-500 motion-reduce:transition-none",
            isScrolled
                ? "top-4 mx-3 rounded-2xl border-border/50 bg-card shadow-xl sm:mx-8"
                : "top-1 mx-0 rounded-none border-transparent bg-transparent",
        )}>
            <div className={cn(
                "container mx-auto flex items-center justify-between gap-6 transition-[height,padding] duration-500 motion-reduce:transition-none",
                isScrolled ? "h-20 px-6" : "h-24 px-4",
            )}>
                <Link href="/" className="group flex min-h-11 shrink-0 items-center rounded-lg" aria-label="Башня — на главную">
                    <Image
                        src="/logo-text-2.png"
                        alt="Башня"
                        width={160}
                        height={32}
                        sizes="160px"
                        className={cn(
                            "h-auto transition-[width,transform] duration-500 motion-safe:group-hover:scale-110 motion-reduce:transition-none",
                            isScrolled ? "w-32" : "w-40",
                        )}
                        priority
                    />
                </Link>

                <nav className="hidden items-center gap-2 lg:flex xl:gap-4" aria-label="Основная навигация">
                    {navLinks.map(link => {
                        const isActive = activeSection === link.href.slice(1);
                        return (
                            <Link
                                key={link.href}
                                href={link.href}
                                aria-current={isActive ? "location" : undefined}
                                className={cn("group relative flex min-h-11 items-center rounded-lg px-3 font-medium text-foreground/80 transition-colors hover:text-foreground", isActive && "text-foreground")}
                            >
                                {link.label}
                                <span aria-hidden="true" className={cn("absolute inset-x-3 bottom-1 h-0.5 origin-left rounded-full bg-primary transition-transform duration-200", isActive ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100")} />
                            </Link>
                        );
                    })}
                </nav>

                <div className="hidden lg:block">
                    <Button asChild variant="outline" className="rounded-full border-2 border-primary bg-transparent px-6 hover:bg-primary hover:text-primary-foreground">
                        <a href={orderHref} target="_blank" rel="noopener noreferrer" aria-label="Заказать на Яндекс Еде">Заказать</a>
                    </Button>
                </div>
                <div className="lg:hidden">
                    <MobileMenu activeSection={activeSection} />
                </div>
            </div>
        </header>
    );
}
