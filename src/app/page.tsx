import Hero from "@/src/components/hero"
import About from "@/src/components/about"
import LocationsCarousel from "@/src/components/locations-carousel"
import Menu from "@/src/components/menu"
import Reviews from "@/src/components/reviews"
import Advantages from "@/src/components/advantages"
import Footer from "@/src/components/footer"
import { Header } from "@/src/components/header"
import Image from "next/image"
import { MenuProvider } from "@/src/components/menu-provider"
import Interior from "@/src/components/interior"

export default function Home() {
    return (
        <div className="relative min-h-screen overflow-x-clip">
            <Header/>
            <div className="relative z-10">
                <main id="main-content" tabIndex={-1} className="outline-none">
                    <MenuProvider>
                        <section className="relative w-full">
                            <div className="absolute inset-0 -z-20">
                                <Image
                                    src="/background.jpg"
                                    alt=""
                                    fill
                                    sizes="100vw"
                                    quality={65}
                                    className="object-cover object-center"
                                    priority
                                />
                            </div>
                            <Hero/>

                            <div className="absolute inset-0 -z-10 bg-background/50 pointer-events-none"/>
                            <About/>
                            <Interior/>
                            <LocationsCarousel/>
                            <Advantages/>
                            <Menu/>
                        </section>
                    </MenuProvider>
                    <Reviews/>
                </main>
                <Footer/>
            </div>
        </div>
    )
}
