"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Phone } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { AnimatePresence, motion } from "framer-motion";
import { usePathname } from "next/navigation";
import GradualBlur from "./ui/gradual-blur";

/*
  Изменения:
  - Убран эффект заполнения (hover background) у кнопок.
  - Добавлен ненавязчивый hover: лёгкое масштабирование, небольшая тень и усиление границы.
  - Поправлены опечатки (например, Phone icon).
  - Поддержана доступность: aria-labels и фокус-стили.
*/

export function MobileMenu({ navLinks }: { navLinks: { href: string; label: string }[] }) {
    const [isOpen, setIsOpen] = useState(false);
    const pathname = usePathname();

    const openMobileMenu = () => setIsOpen(true);
    const closeMobileMenu = () => setIsOpen(false);

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth > 768) {
                setIsOpen(false);
            }
        };
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    // Закрываем меню при смене маршрута
    useEffect(() => {
        closeMobileMenu();
    }, [pathname]);

    // Общие классы для ненавязчивого hover-эффекта (чтобы не дублировать)
    const subtleHover =
        "transition-transform duration-200 ease-in-out hover:scale-[1.03] hover:shadow-sm hover:border-primary/80 focus-visible:ring-2 focus-visible:ring-primary/30";

    return (
        <>
            {/* Trigger: visible on mobile only */}
            <Button
                onClick={openMobileMenu}
                aria-label="Open mobile menu"
                variant="outline"
                size="sm"
                className={`md:hidden border-2 border-primary text-primary px-5 py-3 text-sm rounded-full bg-transparent ${subtleHover}`}
            >
                Меню
            </Button>

            <AnimatePresence>
                {isOpen && (
                    <>
                        {/* Fullscreen Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.22, ease: "easeInOut" }}
                            className="fixed inset-0 bg-foreground/30 z-60"
                            onClick={closeMobileMenu}
                            aria-hidden="true"
                        />

                        {/* Panel — fixed full-height container */}
                        <motion.div
                            initial={{ x: "-100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "-100%" }}
                            transition={{ duration: 0.28, ease: "easeInOut" }}
                            className="fixed inset-0 z-60 flex"
                            role="dialog"
                            aria-modal="true"
                        >
                            {/* side panel */}
                            <div className="w-full max-w-[400px] bg-muted p-4 shadow-lg border border-border/40 flex flex-col">
                                <div className="pl-2 flex items-baseline justify-between mb-6">
                                    <p className="text-2xl font-semibold">Меню</p>
                                    <Button
                                        size="sm"
                                        variant="ghost"
                                        aria-label="Close menu"
                                        onClick={closeMobileMenu}
                                        className={`px-3 py-2 rounded ${subtleHover}`}
                                    >
                                        Закрыть
                                    </Button>
                                </div>

                                <nav className="grid grid-cols-2 gap-x-6 gap-y-4 mb-6" aria-label="Mobile navigation">
                                    {navLinks.map((item) => (
                                        <Button
                                            key={item.href}
                                            size="sm"
                                            variant="secondary"
                                            onClick={closeMobileMenu}
                                            className={`uppercase bg-background/50 justify-start px-3 py-2 rounded ${subtleHover}`}
                                            asChild
                                        >
                                            <Link href={item.href} prefetch>
                                                {item.label}
                                            </Link>
                                        </Button>
                                    ))}
                                </nav>

                                {/* Заказать (mobile) — полная ширина, небольшой ненавязчивый эффект */}
                                <div className="mb-3">
                                    <Button
                                        asChild
                                        className={`w-full border-2 border-primary text-primary px-4 py-3 rounded-full bg-transparent ${subtleHover}`}
                                    >
                                        <a
                                            href="https://eda.yandex.ru/r/bashnya_hudma"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            aria-label="Заказать на Яндекс.Еда"
                                        >
                                            Заказать
                                        </a>
                                    </Button>
                                </div>

                                {/* Телефонная CTA в мобильном меню */}
                                <div className="mt-auto mb-4">
                                    <Button
                                        asChild
                                        className={`w-full border-2 border-primary text-primary px-8 py-6 rounded-full bg-transparent ${subtleHover}`}
                                    >
                                        <a
                                            href="tel:+79059775700"
                                            onClick={closeMobileMenu}
                                            aria-label={`Позвонить +7 905 977-57-00`}
                                            className="flex flex-col items-center leading-tight"
                                        >
                                            <span className="text-[11px] uppercase tracking-wider leading-none">Служба доставки</span>
                                            <span className="inline-flex items-center font-semibold leading-tight">
                        <Phone className="w-4 h-4 mr-2" />
                        +7 905 977-57-00
                      </span>
                                        </a>
                                    </Button>
                                </div>

                                <div className="mt-2 text-sm italic tracking-tighter">Вайнахская, восточная и европейская кухня.</div>
                            </div>

                            {/* пустая область справа, чтобы клик по ней закрывал меню (фон) */}
                            <div className="flex-1" />
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}

export function Header() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [activeSection, setActiveSection] = useState<string | null>(null);

    // Phone config
    const phoneDisplay = "+7 905 977-57-00";
    const phoneHref = "tel:+79059775700";
    const orderHref = "https://eda.yandex.ru/r/bashnya_hudma";

    const navLinks = [
        {href: "#about", label: "О нас"},
        {href: "#locations", label: "Локации"},
        {href: "#menu", label: "Меню"},
        {href: "#reviews", label: "Отзывы"},
    ];

    // header scroll state
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        handleScroll();
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // observe sections to highlight active nav item
    useEffect(() => {
        const ids = navLinks.map((l) => l.href.replace("#", ""));
        const targets = ids.map((id) => document.getElementById(id)).filter(Boolean) as HTMLElement[];

        if (!targets.length) return;

        const observer = new IntersectionObserver(
            (entries) => {
                const visible = entries
                    .filter((e) => e.isIntersecting)
                    .sort((a, b) => (b.intersectionRatio ?? 0) - (a.intersectionRatio ?? 0));

                if (visible.length) {
                    setActiveSection(visible[0].target.id);
                }
            },
            {threshold: [0.25, 0.5, 0.75]}
        );

        targets.forEach((t) => observer.observe(t));
        return () => observer.disconnect();
    }, []);

    // subtle hover shared class (keeps consistency)
    const subtleHover =
        "transition-transform duration-200 ease-in-out hover:scale-[1.03] hover:shadow-sm hover:border-primary/80 focus-visible:ring-2 focus-visible:ring-primary/30";

    return (
        <header
            className={`fixed left-0 right-0 z-50 transition-all duration-500 ${
                isScrolled
                    ? "top-4 mx-8 rounded-2xl bg-card shadow-xl border border-border/50"
                    : "top-1 bg-transparent"
            }`}
        >
            <div className={`container mx-auto relative transition-all duration-500 ${isScrolled ? "px-6" : "px-4"}`}>
                <div
                    className={`flex items-center justify-between transition-all duration-500 ${isScrolled ? "h-20" : "h-24"}`}>
                    {/* Logo */}
                    <Link href="/" className="relative group" aria-label="На главную">
                        <div
                            className={`relative transition-all duration-500 group-hover:scale-110 ${isScrolled ? "w-32 h-32" : "w-40 h-40"}`}
                        >
                            <Image src="/logo-text-2.png" alt="Delicieux Restaurant" fill className="object-contain" priority/>
                        </div>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center gap-8" aria-label="Main navigation">
                        {navLinks.map((link) => {
                            const isActive = activeSection === link.href.replace("#", "");
                            return (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className={`relative group text-foreground/80 hover:text-foreground transition-colors duration-300 font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 rounded-md px-1`}
                                >
                                    <span
                                        className={`relative z-10 ${isActive ? "text-foreground" : ""}`}>{link.label}</span>

                                    {/* animated underline */}
                                    <span
                                        className={`absolute -bottom-1 left-0 h-0.5 bg-primary transition-all duration-300 ${
                                            isActive ? "w-full" : "w-0 group-hover:w-full"
                                        }`}
                                    />
                                </Link>
                            );
                        })}
                    </nav>

                    {/* Right-side CTAs (desktop) */}
                    <div className="hidden md:flex items-center gap-3">
                        {/* Телефон */}
                        <Button
                            asChild
                            className={`border-2 border-primary text-primary px-8 py-6 rounded-full bg-transparent ${subtleHover}`}
                        >
                            <a href={phoneHref} aria-label={`Позвонить ${phoneDisplay}`}
                               className="flex flex-col items-center leading-tight">
                                <span
                                    className="text-[11px] uppercase tracking-wider leading-none">Служба доставки</span>
                                <span className="inline-flex items-center font-semibold leading-tight">
                                    <Phone className="w-4 h-4 mr-2"/>
                                    {phoneDisplay}
                                </span>
                            </a>
                        </Button>

                        {/* Заказать */}
                        <Button
                            asChild
                            className={`border-2 border-primary text-primary px-4 py-6 rounded-full bg-transparent ${subtleHover}`}
                        >
                            <a href={orderHref} target="_blank" rel="noopener noreferrer"
                               aria-label="Заказать на Яндекс.Еда">
                                Заказать
                            </a>
                        </Button>
                    </div>

                    {/* Mobile Menu (uses component above) */}
                    <div className="md:hidden">
                        <MobileMenu navLinks={navLinks}/>
                    </div>
                </div>
            </div>

            <GradualBlur
                target="page"
                position="top"
                height="1.5rem"
                strength={2}
                divCount={5}
                curve="bezier"
                exponential={true}
                opacity={1}
            />
        </header>
    );
}
