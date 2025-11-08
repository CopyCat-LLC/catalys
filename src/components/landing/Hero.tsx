import { Link } from "@tanstack/react-router"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import StartupCard from "./StartupCard"
import { Highlighter } from "@/components/ui/highlighter"

const Hero = () => {
  return (
    <section className="relative overflow-hidden bg-linear-to-b from-white to-gray-50 dark:from-gray-950 dark:to-gray-900 h-screen flex items-center justify-center">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-grid-gray-100 dark:bg-grid-gray-900 mask-[linear-gradient(0deg,white,rgba(255,255,255,0.6))] dark:mask-[linear-gradient(0deg,rgba(0,0,0,1),rgba(0,0,0,0.6))]" />
      
      {/* Gradient orbs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-300/30 dark:bg-purple-600/20 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-300/30 dark:bg-blue-600/20 rounded-full blur-3xl" />
      
      <div className="relative mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8 lg:py-40">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Text Content */}
          <div className="space-y-8">
            {/* Badge */}
            {/* <div className="inline-flex items-center gap-2 rounded-full bg-purple-50 dark:bg-purple-900/30 px-4 py-2 text-sm font-medium text-purple-700 dark:text-purple-300 ring-1 ring-inset ring-purple-700/10 dark:ring-purple-500/20">
              <TrendingUp className="h-4 w-4" />
              <span>Backed by leading VCs</span>
            </div> */}
            
            {/* Headline */}
            <h1 className="text-5xl font-semibold tracking-tight text-gray-800 dark:text-white sm:text-6xl lg:text-7xl">
              Get funded on{" "}
              <Highlighter action="highlight" color="#4f39f6">
                <span className='text-white font-bold'>
                  your terms.
                </span>
              </Highlighter>
            </h1>
            
            {/* Subheadline */}
            <p className="text-lg leading-8 text-gray-600 dark:text-gray-300 sm:text-xl">
              Let investors compete for your startup — you choose the best partner. Get transparent terms, better valuations, and accelerated growth.
            </p>
            
            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-start gap-4">
              <Button
                asChild
                size="lg"
                className="h-11 group bg-indigo-600 text-white shadow-lg shadow-purple-500/30 w-full sm:w-auto"
              >
                <Link to="/sign-up" className="font-semibold">
                  Launch your campaign
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
              
              <Button
                asChild
                variant="outline"
                size="lg"
                className="h-11 w-full sm:w-auto border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                <Link to="/" className="font-semibold">
                  See active investor bids
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
            
            {/* Social proof */}
            <div className="flex flex-col gap-4">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Trusted by founders from
              </p>
              <div className="flex flex-wrap items-center gap-8 opacity-60 grayscale">
                {/* Add company logos here */}
              </div>
            </div>
          </div>

          {/* Right Column - Startup Card Demo */}
          <div className="lg:pl-8">
            <div className="relative">
              {/* Background card - slightly offset to bottom right */}
              <div className="absolute top-12 left-12 w-full blur-[2px] opacity-40">
                <StartupCard animate={false} />
              </div>
              {/* Main card */}
              <div className="relative z-10">
                <StartupCard animate={true} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero