import { motion } from 'framer-motion';

export const ChatSkeleton = () => {
  return (
    <div className="h-screen flex bg-warm-white">
      {/* Sidebar Skeleton */}
      <div className="hidden lg:block w-96 bg-cream border-r border-warm-gray/30 p-4">
        <div className="mb-4">
          <div className="h-8 w-24 bg-warm-gray/30 rounded-lg animate-pulse mb-3" />
          <div className="h-10 w-full bg-warm-gray/30 rounded-xl animate-pulse" />
        </div>
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex items-center gap-3 p-3 animate-pulse">
              <div className="w-12 h-12 rounded-full bg-warm-gray/30" />
              <div className="flex-1 space-y-2">
                <div className="h-4 w-24 bg-warm-gray/30 rounded" />
                <div className="h-3 w-32 bg-warm-gray/30 rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Chat Area Skeleton */}
      <div className="flex-1 flex flex-col">
        {/* Header Skeleton */}
        <div className="flex-shrink-0 bg-cream/95 border-b border-warm-gray/30 px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-warm-gray/30 animate-pulse" />
            <div className="space-y-2">
              <div className="h-4 w-32 bg-warm-gray/30 rounded animate-pulse" />
              <div className="h-3 w-20 bg-warm-gray/30 rounded animate-pulse" />
            </div>
          </div>
        </div>

        {/* Messages Skeleton */}
        <div className="flex-1 p-4 space-y-4 overflow-y-auto">
          {[1, 2, 3, 4].map((i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: i * 0.1 }}
              className={`flex items-end gap-2 ${i % 2 === 0 ? 'flex-row-reverse' : ''}`}
            >
              <div className="w-8 h-8 rounded-full bg-warm-gray/30 animate-pulse flex-shrink-0" />
              <div className={`max-w-[70%] ${i % 2 === 0 ? 'items-end' : 'items-start'}`}>
                <div className={`rounded-2xl px-4 py-2.5 ${
                  i % 2 === 0 
                    ? 'bg-terracotta/20 rounded-br-sm' 
                    : 'bg-cream rounded-bl-sm'
                } animate-pulse`}
                >
                  <div className="h-4 w-48 bg-transparent" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Input Skeleton */}
        <div className="flex-shrink-0 p-4 bg-cream/50 border-t border-warm-gray/30">
          <div className="flex items-end gap-2">
            <div className="w-10 h-10 rounded-full bg-warm-gray/30 animate-pulse" />
            <div className="flex-1 h-12 bg-warm-gray/30 rounded-2xl animate-pulse" />
            <div className="w-10 h-10 rounded-full bg-warm-gray/30 animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );
};
