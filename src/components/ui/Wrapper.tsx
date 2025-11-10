import { cn } from "@/lib/utils"

const Wrapper = ({className, children }: {className?: string, children: React.ReactNode}) => {
  return (
    <div className={cn("max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full", className)}>
        {children}
    </div>
  )
}

export default Wrapper