"use client";

import { createContext, useCallback, useContext, useMemo, useRef, useState, type ReactNode } from "react";

type MenuContextValue = {
    isOpen: boolean;
    setIsOpen: (open: boolean) => void;
    openMenu: (trigger: HTMLButtonElement) => void;
    restoreFocus: () => void;
};

const MenuContext = createContext<MenuContextValue | null>(null);

export function MenuProvider({ children }: Readonly<{ children: ReactNode }>) {
    const [isOpen, setIsOpen] = useState(false);
    const triggerRef = useRef<HTMLButtonElement | null>(null);
    const openMenu = useCallback((trigger: HTMLButtonElement) => {
        triggerRef.current = trigger;
        setIsOpen(true);
    }, []);
    const restoreFocus = useCallback(() => {
        triggerRef.current?.focus({ preventScroll: true });
    }, []);
    const value = useMemo(() => ({ isOpen, setIsOpen, openMenu, restoreFocus }), [isOpen, openMenu, restoreFocus]);

    return <MenuContext.Provider value={value}>{children}</MenuContext.Provider>;
}

export function useMenu() {
    const context = useContext(MenuContext);
    if (!context) throw new Error("useMenu must be used within MenuProvider");
    return context;
}
