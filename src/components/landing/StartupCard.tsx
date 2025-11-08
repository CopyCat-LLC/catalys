import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { ArrowRight, TrendingUp } from "lucide-react"
import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"

const bids = [
  { amount: 550000, equity: 9 },
  { amount: 600000, equity: 8.5 },
  { amount: 650000, equity: 8 },
  { amount: 700000, equity: 7.5 },
  { amount: 750000, equity: 7 },
]

interface VisibleBid {
  amount: number
  equity: number
  id: number
}

interface StartupCardProps {
  animate?: boolean
}

const StartupCard = ({ animate = true }: StartupCardProps) => {
  const [visibleBids, setVisibleBids] = useState<VisibleBid[]>([
    { ...bids[1], id: 1 },
    { ...bids[0], id: 0 }
  ])
  const bidIndexRef = useRef(1)

  useEffect(() => {
    if (!animate) return
    
    const interval = setInterval(() => {
      bidIndexRef.current = (bidIndexRef.current + 1) % bids.length
      const newBid = { ...bids[bidIndexRef.current], id: Date.now() }
      
      setVisibleBids((current) => {
        const updated = [newBid, ...current]
        return updated.slice(0, 2) // Keep max 2 bids
      })
    }, 2500)

    return () => clearInterval(interval)
  }, [animate])

  const formatAmount = (amount: number) => new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)

  return (
    <Card className="max-w-md mx-auto backdrop-blur-sm bg-white/95 dark:bg-gray-900/95 border-2 border-indigo-100 dark:border-indigo-900/30 shadow-xl hover:shadow-2xl select-none pointer-events-none transition-all duration-300 gap-0">
      <CardHeader className="pb-4">
        <div className="flex items-start gap-4">
          <Avatar className="h-16 w-16 border-3 border-indigo-200 dark:border-indigo-800 ring-4 ring-indigo-50 dark:ring-indigo-950/50">
            <AvatarFallback className='bg-indigo-600 text-white font-semibold text-2xl'>T</AvatarFallback>
          </Avatar>
          <div className="flex-1 space-y-1.5">
            <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">TechVision AI</CardTitle>
            <CardDescription className="flex items-center gap-2">
              <span className="text-sm text-gray-600 dark:text-gray-400">Founded by John Doe</span>
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-5">
        {/* Startup description */}
        <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
          AI-powered analytics platform helping businesses make data-driven decisions with real-time insights and predictive modeling.
        </p>

        {/* Startup asks */}
        <div className="grid grid-cols-2 gap-4 p-5 rounded-xl bg-gray-50 dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700/50">
          <div className="space-y-1.5">
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">Asking Amount</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">$500,000</p>
          </div>
          <div className="space-y-1.5">
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">For Equity</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">10%</p>
          </div>
        </div>

        {/* Current bids */}
        <div className="space-y-3 min-h-[136px]">
          <AnimatePresence mode="popLayout" initial={false}>
            {visibleBids.map((bid, index) => (
              <motion.div 
                key={bid.id}
                layout
                initial={{ 
                  opacity: 0, 
                  y: -20,
                  scale: 0.95
                }}
                animate={{ 
                  opacity: index === 0 ? 1 : 0.7, 
                  y: 0,
                  scale: index === 0 ? 1 : 0.98
                }}
                exit={{ 
                  opacity: 0, 
                  y: 20,
                  scale: 0.9,
                  transition: { duration: 0.3, ease: "easeInOut" }
                }}
                transition={{ 
                  duration: 0.5,
                  ease: [0.4, 0, 0.2, 1],
                  layout: { duration: 0.4, ease: [0.4, 0, 0.2, 1] }
                }}
                className="flex items-center justify-between p-4 rounded-xl border-2 border-indigo-200 dark:border-indigo-800/50 bg-indigo-50 dark:bg-indigo-950/30"
              >
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                  <span className="text-sm font-semibold text-indigo-900 dark:text-indigo-200">
                    {index === 0 ? 'New Bid' : 'Previous Bid'}
                  </span>
                </div>
                <span className="text-sm font-bold text-indigo-900 dark:text-indigo-200">
                  {formatAmount(bid.amount)} for {bid.equity}%
                </span>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* View details button */}
        <button className="group flex items-center justify-center w-full h-12 px-6 rounded-xl bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-600 dark:hover:bg-indigo-500 text-white font-semibold text-sm gap-2 transition-all duration-200 shadow-lg shadow-indigo-500/25 hover:shadow-xl hover:shadow-indigo-500/30 hover:-translate-y-0.5 active:translate-y-0">
          View Details
          <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
        </button>
      </CardContent>
    </Card>
  )
}

export default StartupCard

