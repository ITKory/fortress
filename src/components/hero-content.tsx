"use client"

export default function HeroContent() {
    return (
        <div className="text-center my-0 p-0 px-0 py-16 rounded-4xl shadow-none bg-background/85 backdrop-blur-sm border-border border-none border-0">
            <div className="flex items-center justify-center flex-col text-center py-4">
                <div
                    className="inline-flex items-center px-4 py-2 rounded-full bg-muted/40 backdrop-blur-md relative border mb-0 border-border/30"
                    style={{
                        filter: "url(#glass-effect)",
                    }}
                >
                    <div className="absolute top-0 left-1 right-1 h-px bg-gradient-to-r from-transparent via-foreground/20 to-transparent rounded-full" />
                    <span className="text-muted-foreground text-sm md:text-base relative z-10 font-medium tracking-wide">
            Сеть премиальных ресторанов
          </span>
                </div>
            </div>

            <h1
                id="main-content"
                className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl tracking-tight font-light text-foreground mb-8 leading-[1.1] scroll-mt-20"
            >
                <span className="instrument text-foreground mx-0 text-center font-medium font-mono">GUSTO</span>
                <br />
                <span className="font-light text-foreground tracking-tight">Ресторан</span>
            </h1>

            <p className="font-normal text-muted-foreground mb-10 leading-relaxed max-w-2xl mx-auto font-sans tracking-normal text-balance text-base md:text-lg px-4">
                Откройте для себя мир изысканных вкусов. Авторская кухня, уютная атмосфера и безупречный сервис в каждом нашем
                заведении.
            </p>

        </div>
    )
}
