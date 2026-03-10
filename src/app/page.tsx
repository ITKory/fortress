import Hero from "@/src/components/hero"
import About from "@/src/components/about"
import LocationsCarousel from "@/src/components/locations-carousel"
import Menu from "@/src/components/menu"
import Reviews from "@/src/components/reviews"
import Advantages from "@/src/components/advantages"
import Footer from "@/src/components/footer"
import { Header } from "@/src/components/header"
import Image from "next/image"

export default function Home() {
    return (
        <main className="relative min-h-screen overflow-hidden">
            <Header/>
            <div className="relative z-10">

                <section className="relative w-full ">
                    <div className="absolute inset-0 -z-20">
                        <Image
                            src="/background.jpg"
                            alt="Фон: наши блюда"
                            fill
                            sizes="100vw"
                            quality={65}
                            className="object-cover object-center "
                            priority
                        />
                    </div>
                    <Hero/>

                    <div className="absolute inset-0 -z-10 bg-white/30 pointer-events-none"/>
                    <About/>
                    <LocationsCarousel/>
                    <Advantages/>
                    <Menu/>
                </section>
                <Reviews/>
                <Footer/>
            </div>
        </main>
    )
}
