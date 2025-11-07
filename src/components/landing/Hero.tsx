import { Link } from "@tanstack/react-router"
import { Button } from "@/components/ui/button"
import { ArrowRight} from "lucide-react"

const Hero = () => {
  return (
    <section className="relative overflow-hidden bg-linear-to-b from-white to-gray-50 dark:from-gray-950 dark:to-gray-900 pt-20">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-grid-gray-100 dark:bg-grid-gray-900 mask-[linear-gradient(0deg,white,rgba(255,255,255,0.6))] dark:mask-[linear-gradient(0deg,rgba(0,0,0,1),rgba(0,0,0,0.6))]" />
      
      {/* Gradient orbs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-300/30 dark:bg-purple-600/20 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-300/30 dark:bg-blue-600/20 rounded-full blur-3xl" />
      
      <div className="relative mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8 lg:py-40">
        <div className="mx-auto max-w-3xl text-center">
          {/* Badge */}
          {/* <div className="mb-8 inline-flex items-center gap-2 rounded-full bg-purple-50 dark:bg-purple-900/30 px-4 py-2 text-sm font-medium text-purple-700 dark:text-purple-300 ring-1 ring-inset ring-purple-700/10 dark:ring-purple-500/20">
            <TrendingUp className="h-4 w-4" />
            <span>Backed by leading VCs</span>
          </div> */}
          
          {/* Headline */}
          <h1 className="text-5xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-6xl lg:text-7xl">
            Get funded on{" "}
            <span className="bg-linear-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              your terms
            </span>
          </h1>
          
          {/* Subheadline */}
          <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-300 sm:text-xl">
            Investors compete to back your startup — you choose who to partner with. 
            Transparent offers, better valuations, faster growth.
          </p>
          
          {/* CTAs */}
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              asChild
              size="lg"
              className="group bg-linear-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-lg shadow-purple-500/30 w-full sm:w-auto"
            >
              <Link to="/sign-up">
                Launch your campaign
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
            
            <Button
              asChild
              variant="outline"
              size="lg"
              className="w-full sm:w-auto border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
            >
              <Link to="/">
                See active investor bids
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
          
          {/* Social proof */}
          <div className="mt-16 flex flex-col items-center gap-4">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Trusted by founders from
            </p>
            <div className="flex flex-wrap items-center justify-center gap-8 opacity-60 grayscale">
              {/* Add company logos here */}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero