import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  MessageCircle, 
  X, 
  ChevronRight,
  Users,
  Clock,
  CheckCheck,
  Circle,
  Sparkles,
  MessageSquare
} from 'lucide-react';
import { useLanguage } from '../../../../lib/i18n';
import { formatRelativeTime } from '../../utils/formatters';
import { TrustBadge } from '../profile/TrustBadge';

export const ChatSidebar = ({ rooms = [], currentRoomId, isOpen, onClose }) => {
  const { language } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredRooms = rooms.filter(room => {
    const otherParticipant = room.participants?.find(p => p.role !== 'poster' || p.role === 'claimant');
    const name = otherParticipant?.profile?.realName || '';
    return name.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const getOtherParticipant = (room) => {
    return room.participants?.find(p => p.role === 'claimant' || p.role === 'poster');
  };

  const getLastMessagePreview = (room) => {
    if (!room.lastMessage) return null;
    
    const message = room.lastMessage;
    if (message.type === 'photo') {
      return language === 'am' ? '📷 ፎቶ' : '📷 Photo';
    }
    if (message.type === 'voice') {
      return language === 'am' ? '🎤 የድምጽ መልእክት' : '🎤 Voice message';
    }
    if (message.type === 'system') {
      return message.content;
    }
    
    const preview = message.content?.slice(0, 30);
    return preview + (message.content?.length > 30 ? '...' : '');
  };

  return (
    <>
      {/* Mobile Overlay with blur effect */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-gradient-to-br from-charcoal/60 to-charcoal/40 backdrop-blur-sm z-40 lg:hidden"
            onClick={onClose}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        className={`
          fixed lg:relative inset-y-0 left-0 z-50 lg:z-0
          w-80 lg:w-96 bg-gradient-to-b from-cream via-cream/95 to-warmth/10 
          dark:from-charcoal dark:via-charcoal/95 dark:to-terracotta/5
          border-r border-warm-gray/20 dark:border-charcoal/20
          flex flex-col h-screen lg:h-full shadow-2xl lg:shadow-none
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          transition-transform duration-300 ease-in-out
          backdrop-blur-xl
        `}
      >
        {/* Header with gradient */}
        <div className="flex-shrink-0 p-6 bg-gradient-to-b from-cream/80 to-transparent dark:from-charcoal/80 dark:to-transparent backdrop-blur-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-terracotta to-sahara rounded-xl shadow-lg shadow-terracotta/20">
                <MessageSquare className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="font-display text-2xl font-bold text-charcoal dark:text-cream">
                  {language === 'am' ? 'መልእክቶች' : 'Messages'}
                </h2>
                {rooms.length > 0 && (
                  <p className="text-xs text-stone dark:text-warm-gray mt-0.5">
                    {rooms.length} {language === 'am' ? 'ውይይቶች' : 'conversations'}
                  </p>
                )}
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onClose}
              className="lg:hidden p-2 bg-white/80 dark:bg-charcoal/80 text-stone hover:text-charcoal dark:hover:text-cream rounded-xl hover:bg-warm-gray/20 dark:hover:bg-charcoal/40 transition-all shadow-lg backdrop-blur-sm"
            >
              <X className="w-5 h-5" />
            </motion.button>
          </div>

          {/* Enhanced Search Bar */}
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative group"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-terracotta/20 to-sahara/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300 opacity-0 group-hover:opacity-100" />
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone dark:text-warm-gray group-focus-within:text-terracotta transition-colors" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={language === 'am' ? 'ውይይቶችን ይፈልጉ...' : 'Search conversations...'}
                className="w-full pl-12 pr-4 py-3 bg-white/70 dark:bg-charcoal/40 border-2 border-warm-gray/20 dark:border-charcoal/20 rounded-2xl focus:border-terracotta/50 dark:focus:border-terracotta/50 focus:ring-4 focus:ring-terracotta/10 outline-none transition-all text-sm backdrop-blur-sm placeholder:text-stone/50 dark:placeholder:text-warm-gray/50"
              />
              {searchTerm && (
                <motion.button
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-warm-gray/20 dark:hover:bg-charcoal/40 rounded-full transition-colors"
                >
                  <X className="w-3 h-3 text-stone dark:text-warm-gray" />
                </motion.button>
              )}
            </div>
          </motion.div>
        </div>

        {/* Room List with custom scrollbar */}
        <div className="flex-1 overflow-y-auto custom-scrollbar px-3">
          <style jsx>{`
            .custom-scrollbar::-webkit-scrollbar {
              width: 6px;
            }
            .custom-scrollbar::-webkit-scrollbar-track {
              background: transparent;
            }
            .custom-scrollbar::-webkit-scrollbar-thumb {
              background: rgba(168, 124, 109, 0.2);
              border-radius: 10px;
            }
            .custom-scrollbar::-webkit-scrollbar-thumb:hover {
              background: rgba(168, 124, 109, 0.4);
            }
          `}</style>
          
          {filteredRooms.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center justify-center h-full p-8 text-center"
            >
              <motion.div
                animate={{ 
                  y: [0, -10, 0],
                  scale: [1, 1.05, 1]
                }}
                transition={{ 
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="mb-6"
              >
                {searchTerm ? (
                  <Search className="w-16 h-16 text-stone/30 dark:text-warm-gray/30" />
                ) : (
                  <MessageCircle className="w-16 h-16 text-stone/30 dark:text-warm-gray/30" />
                )}
              </motion.div>
              <h3 className="text-lg font-semibold text-charcoal/50 dark:text-cream/50 mb-2">
                {searchTerm 
                  ? (language === 'am' ? 'ምንም ውጤት አልተገኘም' : 'No results found')
                  : (language === 'am' ? 'እስካሁን ምንም መልእክት የለም' : 'No messages yet')
                }
              </h3>
              <p className="text-sm text-stone/40 dark:text-warm-gray/40">
                {searchTerm 
                  ? (language === 'am' ? 'ሌላ ቁልፍ ቃል ይሞክሩ' : 'Try a different search term')
                  : (language === 'am' ? 'የመጀመሪያ ውይይትዎን ይጀምሩ' : 'Start your first conversation')
                }
              </p>
            </motion.div>
          ) : (
            <div className="py-3 space-y-1">
              <AnimatePresence mode="popLayout">
                {filteredRooms.map((room, index) => {
                  const other = getOtherParticipant(room);
                  const isActive = room._id === currentRoomId;
                  const hasUnread = room.unreadCount > 0;

                  return (
                    <motion.div
                      key={room._id}
                      layout
                      initial={{ opacity: 0, x: -30, scale: 0.95 }}
                      animate={{ opacity: 1, x: 0, scale: 1 }}
                      exit={{ opacity: 0, x: -30, scale: 0.95 }}
                      transition={{ 
                        type: "spring",
                        stiffness: 500,
                        damping: 30,
                        delay: index * 0.05 
                      }}
                    >
                      <Link
                        to={`/wanted/chat/${room._id}`}
                        onClick={() => onClose()}
                        className="block group"
                      >
                        <motion.div
                          whileHover={{ scale: 1.02, x: 4 }}
                          whileTap={{ scale: 0.98 }}
                          className={`
                            relative p-4 rounded-2xl transition-all duration-300
                            ${isActive 
                              ? 'bg-gradient-to-r from-terracotta/20 via-terracotta/10 to-transparent border-2 border-terracotta/30 shadow-lg shadow-terracotta/10' 
                              : 'hover:bg-warm-gray/10 dark:hover:bg-charcoal/20 border-2 border-transparent hover:border-warm-gray/20 dark:hover:border-charcoal/20'
                            }
                            ${hasUnread ? 'bg-gradient-to-r from-warmth/10 to-transparent dark:from-terracotta/10 dark:to-transparent' : ''}
                          `}
                        >
                          {/* Active indicator glow */}
                          {isActive && (
                            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-terracotta/5 to-transparent" />
                          )}
                          
                          <div className="flex items-start gap-4 relative">
                            {/* Enhanced Avatar */}
                            <div className="relative flex-shrink-0">
                              <motion.div 
                                whileHover={{ scale: 1.1, rotate: [0, -5, 5, 0] }}
                                transition={{ type: "spring", stiffness: 400, damping: 10 }}
                                className="w-14 h-14 rounded-2xl bg-gradient-to-br from-terracotta via-sahara to-hope-green p-[2px] shadow-xl shadow-terracotta/20 group-hover:shadow-terracotta/30 transition-shadow"
                              >
                                <div className="w-full h-full rounded-2xl bg-gradient-to-br from-terracotta to-sahara flex items-center justify-center text-white font-bold text-xl">
                                  {other?.profile?.realName?.[0]?.toUpperCase() || '?'}
                                </div>
                              </motion.div>
                              
                              {/* Online status indicator */}
                              {hasUnread && (
                                <motion.div
                                  initial={{ scale: 0 }}
                                  animate={{ scale: [0, 1.2, 1] }}
                                  transition={{ delay: 0.2, type: "spring", stiffness: 500 }}
                                  className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-br from-terracotta to-sahara rounded-full border-2 border-cream dark:border-charcoal shadow-lg flex items-center justify-center"
                                >
                                  <Sparkles className="w-2.5 h-2.5 text-white" />
                                </motion.div>
                              )}
                              
                              {isActive && (
                                <motion.div
                                  layoutId="activeIndicator"
                                  className="absolute -bottom-1 -right-1 w-4 h-4 bg-gradient-to-br from-hope-green to-emerald-500 rounded-full border-2 border-cream dark:border-charcoal shadow-lg"
                                />
                              )}
                            </div>

                            {/* Content */}
                            <div className="flex-1 min-w-0 pt-1">
                              <div className="flex items-center justify-between mb-1.5">
                                <div className="flex items-center gap-2 min-w-0">
                                  <span className={`font-semibold truncate text-[15px] ${
                                    hasUnread 
                                      ? 'text-charcoal dark:text-cream' 
                                      : 'text-charcoal/70 dark:text-cream/70'
                                  }`}>
                                    {other?.profile?.realName || (language === 'am' ? 'ተጠቃሚ' : 'User')}
                                  </span>
                                  {room.isGroupChat && (
                                    <motion.div
                                      whileHover={{ scale: 1.1 }}
                                      className="p-1 bg-warm-gray/20 dark:bg-charcoal/30 rounded-lg"
                                    >
                                      <Users className="w-3.5 h-3.5 text-stone dark:text-warm-gray" />
                                    </motion.div>
                                  )}
                                </div>
                                <div className="flex items-center gap-2 flex-shrink-0">
                                  {room.lastMessage?.createdAt && (
                                    <span className="text-[11px] text-stone/60 dark:text-warm-gray/50 font-medium">
                                      {formatRelativeTime(room.lastMessage.createdAt, language)}
                                    </span>
                                  )}
                                </div>
                              </div>

                              <div className="flex items-center justify-between">
                                <p className={`text-[13px] truncate leading-relaxed ${
                                  hasUnread 
                                    ? 'text-charcoal/80 dark:text-cream/80 font-semibold' 
                                    : 'text-stone/60 dark:text-warm-gray/50'
                                }`}>
                                  {getLastMessagePreview(room) || (
                                    <span className="italic">
                                      {language === 'am' ? 'አዲስ ውይይት ጀምር' : 'Start a new conversation'}
                                    </span>
                                  )}
                                </p>
                                
                                <motion.div 
                                  className="flex items-center gap-1.5 ml-2"
                                  initial={false}
                                  animate={hasUnread ? { scale: [1, 1.1, 1] } : {}}
                                  transition={{ repeat: Infinity, duration: 2 }}
                                >
                                  {hasUnread ? (
                                    <motion.span 
                                      whileHover={{ scale: 1.1 }}
                                      className="min-w-[1.5rem] h-6 px-2 bg-gradient-to-r from-terracotta to-sahara text-white text-[11px] font-bold rounded-full flex items-center justify-center shadow-lg shadow-terracotta/30"
                                    >
                                      {room.unreadCount}
                                    </motion.span>
                                  ) : room.lastMessage?.sender === other?.user ? null : (
                                    room.lastMessage?.readBy?.some(r => r.user !== room.lastMessage.sender) ? (
                                      <motion.div whileHover={{ scale: 1.2, rotate: 15 }}>
                                        <CheckCheck className="w-4 h-4 text-hope-green drop-shadow-lg" />
                                      </motion.div>
                                    ) : (
                                      <motion.div whileHover={{ scale: 1.2 }}>
                                        <Circle className="w-4 h-4 text-stone/40 dark:text-warm-gray/40" />
                                      </motion.div>
                                    )
                                  )}
                                </motion.div>
                              </div>

                              {/* Trust Badge with enhanced styling */}
                              {other?.profile?.trustScore && (
                                <motion.div 
                                  initial={{ opacity: 0, y: 5 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  className="mt-2"
                                >
                                  <TrustBadge score={other.profile.trustScore} size="sm" />
                                </motion.div>
                              )}
                            </div>
                          </div>
                        </motion.div>
                      </Link>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          )}
        </div>

        {/* Enhanced Footer */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex-shrink-0 p-4 bg-gradient-to-t from-cream/80 via-cream/50 to-transparent dark:from-charcoal/80 dark:via-charcoal/50 dark:to-transparent backdrop-blur-sm border-t border-warm-gray/20 dark:border-charcoal/20"
        >
          <div className="flex items-center justify-center gap-2">
            <Clock className="w-3.5 h-3.5 text-stone/50 dark:text-warm-gray/50" />
            <p className="text-[11px] text-stone/50 dark:text-warm-gray/50 font-medium">
              {language === 'am'
                ? 'መልእክቶች ከ30 ቀናት በኋላ ያበቃሉ'
                : 'Messages expire after 30 days'
              }
            </p>
          </div>
        </motion.div>
      </motion.aside>
    </>
  );
};
