"use client"

/**
 * Festive Christmas decorations component
 * - Glowing lights throughout
 * - Decorative ornaments on the sides
 * - Optimized and responsive
 */
export default function ChristmasDecorations() {
  return (
    <>
      {/* Glowing Lights Throughout Page */}
      <div className="fixed inset-0 pointer-events-none z-35 overflow-hidden" aria-hidden="true">
        {/* Top lights */}
        {[...Array(15)].map((_, i) => (
          <div
            key={`top-light-${i}`}
            className="absolute top-0 christmas-glow-light"
            style={{
              left: `${(i * 7 + 3) % 100}%`,
              animationDelay: `${(i * 0.3) % 2}s`,
            }}
          >
            <div 
              className={`w-2 h-2 rounded-full ${
                i % 3 === 0 ? 'bg-red-500' : i % 3 === 1 ? 'bg-green-500' : 'bg-yellow-500'
              } shadow-lg`}
              style={{
                boxShadow: `0 0 10px ${
                  i % 3 === 0 ? 'rgba(239, 68, 68, 0.8)' : 
                  i % 3 === 1 ? 'rgba(34, 197, 94, 0.8)' : 
                  'rgba(234, 179, 8, 0.8)'
                }`
              }}
            />
          </div>
        ))}
      </div>

      {/* Side Ornaments - Left */}
      <div className="fixed left-4 top-1/4 pointer-events-none z-35 hidden lg:block" aria-hidden="true">
        <div className="christmas-ornament-group space-y-6">
          <div className="christmas-ornament bg-red-500/80 shadow-red-500/50" style={{ animationDelay: "0s" }} />
          <div className="christmas-ornament bg-green-500/80 shadow-green-500/50" style={{ animationDelay: "0.5s" }} />
          <div className="christmas-ornament bg-yellow-500/80 shadow-yellow-500/50" style={{ animationDelay: "1s" }} />
        </div>
      </div>

      {/* Side Ornaments - Right */}
      <div className="fixed right-4 top-1/4 pointer-events-none z-35 hidden lg:block" aria-hidden="true">
        <div className="christmas-ornament-group space-y-6">
          <div className="christmas-ornament bg-green-500/80 shadow-green-500/50" style={{ animationDelay: "0.3s" }} />
          <div className="christmas-ornament bg-red-500/80 shadow-red-500/50" style={{ animationDelay: "0.8s" }} />
          <div className="christmas-ornament bg-yellow-500/80 shadow-yellow-500/50" style={{ animationDelay: "1.3s" }} />
        </div>
      </div>

      {/* Floating Stars - top decoration */}
      <div className="fixed top-0 left-0 right-0 pointer-events-none z-30 h-24 overflow-hidden" aria-hidden="true">
        {[...Array(8)].map((_, i) => (
          <div
            key={`star-${i}`}
            className="christmas-star absolute text-yellow-300"
            style={{
              top: `${10 + (i % 3) * 8}px`,
              left: `${(i * 12.5 + 5) % 100}%`,
              animationDelay: `${i * 0.4}s`,
              fontSize: `${10 + (i % 3) * 3}px`,
            }}
          >
            ✦
          </div>
        ))}
      </div>
    </>
  )
}

