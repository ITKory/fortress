import Hero from "@/src/components/hero"
import About from "@/src/components/about"
import LocationsCarousel from "@/src/components/locations-carousel"
import Menu from "@/src/components/menu"
import Reviews from "@/src/components/reviews"
import Advantages from "@/src/components/advantages"
import Footer from "@/src/components/footer"
import Scene3D from "@/src/components/scene-3d"
import { Header } from "@/src/components/header"
import Image from "next/image"

export default function Home() {
    return (
        <main className="relative min-h-screen overflow-hidden">
            <Scene3D/>
            <Header/>
            <div className="relative z-10">
                <Hero/>

                <section className="relative w-full">
                    <div className="absolute inset-0 -z-20">
                        <Image
                            src="/background.jpg"
                            alt="Фон: наши блюда"
                            fill
                            className="object-cover object-center "
                            priority
                        />
                    </div>

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
