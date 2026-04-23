import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../../../hooks/useAuth';
import { 
  Send, 
  Image as ImageIcon, 
  Phone, 
  Video, 
  MoreVertical,
  ChevronLeft,
  Check,
  CheckCheck,
  Smile,
  Paperclip,
  MessageCircle,
  Shield,
  User,
  ArrowLeft
} from 'lucide-react';
import { useChat } from '../../hooks/useChat';
import { useSocket } from '../../hooks/useSocket';
import { useLanguage } from '../../../../lib/i18n';
import{ChatSidebar} from './ChatSidebar';
import { MessageBubble } from './MessageBubble';
import { VideoCallModal } from './VideoCallModal';
import { TrustBadge } from '../profile/TrustBadge';
import { ChatSkeleton } from './ChatSkeleton';
import { formatMessageTime } from '../../utils/formatters';
import { toast } from 'sonner';

export const ChatPage = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const { language } = useLanguage();
  const { 
    rooms, 
    currentRoom, 
    messages, 
    sendMessage, 
    sendTyping,
    markAsRead,
    isLoading 
  } = useChat(roomId);
  
  const { isConnected } = useSocket();
  const [messageInput, setMessageInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const [showVideoCall, setShowVideoCall] = useState(false);
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const inputRef = useRef(null);
  const { user: currentUser } = useAuth();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleTyping = () => {
    if (!isTyping) {
      setIsTyping(true);
      sendTyping(true);
    }
    
    clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
      sendTyping(false);
    }, 1500);
  };

  const handleSend = () => {
    if (!messageInput.trim()) return;
    
    sendMessage({
      roomId: currentRoom?._id,
      content: messageInput.trim(),
      type: 'text',
    });
    
    setMessageInput('');
    setIsTyping(false);
    inputRef.current?.focus();
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const otherParticipant = currentRoom?.participants?.find(
    p => p.user !== currentUser?.id
  );

  if (isLoading) {
    return <ChatSkeleton />;
  }

  if (!roomId) {
    return (
      <div className="h-screen flex bg-gray-50 font-sans">
        <ChatSidebar 
          rooms={rooms}
          currentRoomId={roomId}
          isOpen={showSidebar}
          onClose={() => setShowSidebar(false)}
        />
        <div className="hidden lg:flex flex-1 items-center justify-center px-8">
          <div className="text-center max-w-md mx-auto text-gray-400 space-y-4">
            <MessageCircle className="w-20 h-20 mx-auto mb-4" />
            <h3 className="text-xl font-semibold">{language === 'am' ? 'ውይይት ይምረጡ' : 'Select a conversation'}</h3>
            <p className="text-sm">
              {language === 'am'
                ? 'ለመጀመር ከግራ በኩል ውይይት ይምረጡ'
                : 'Choose a conversation from the sidebar to start chatting'
              }
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex bg-gray-50 font-sans">
      {/* Sidebar */}
      <ChatSidebar 
        rooms={rooms}
        currentRoomId={roomId}
        isOpen={showSidebar}
        onClose={() => setShowSidebar(false)}
      />

      {/* Main Chat Container */}
      <div className="flex-1 flex flex-col bg-white shadow-lg rounded-l-2xl overflow-hidden">
        {/* Chat Header */}
        <header className="flex-shrink-0 bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between shadow-sm">
          {/* Left Buttons */}
          <div className="flex items-center space-x-2">
            {/* Back Button */}
            <button
              onClick={() => navigate('/wanted')}
              className="p-2 rounded-full hover:bg-gray-100 transition"
              title={language === 'am' ? 'የድምጽ ጥሪ' : 'Back'}
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            {/* Sidebar Toggle */}
            <button
              onClick={() => setShowSidebar(true)}
              className="p-2 rounded-full hover:bg-gray-100 transition"
              title={language === 'am' ? 'ማውጫ' : 'Menu'}
            >
              <ChevronLeft className="w-5 h-5 text-gray-600" />
            </button>
          </div>

          {/* Participant Info */}
          {otherParticipant && (
            <div className="flex items-center space-x-4">
              {/* Avatar */}
              <div className="relative">
                <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center font-semibold text-gray-700 text-lg shadow-md transition-transform hover:scale-105">
                  {otherParticipant.profile?.realName?.[0]?.toUpperCase() || '?'}
                </div>
                {isConnected && (
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full" />
                )}
              </div>
              {/* Name & Status */}
              <div className="flex flex-col">
                <h2 className="text-lg font-semibold text-gray-800">{otherParticipant.profile?.realName || (language === 'am' ? 'ተጠቃሚ' : 'User')}</h2>
                <div className="flex items-center space-x-2 mt-1 text-sm text-gray-500">
                  <TrustBadge score={otherParticipant.profile?.trustScore} size="sm" />
                </div>
                <p className="text-sm text-gray-400 mt-1">
                  {isTyping ? (
                    <span className="text-green-500">{language === 'am' ? 'እየጻፈ ነው...' : 'Typing...'}</span>
                  ) : isConnected ? (
                    language === 'am' ? 'በመስመር ላይ' : 'Online'
                  ) : (
                    language === 'am' ? 'ከመስመር ውጭ' : 'Offline'
                  )}
                </p>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center space-x-2">
            <button
              className="p-2 rounded-full hover:bg-gray-100 transition"
              title={language === 'am' ? 'የድምጽ ጥሪ' : 'Voice Call'}
            >
              <Phone className="w-5 h-5 text-gray-600" />
            </button>
            <button
              onClick={() => setShowVideoCall(true)}
              className="p-2 rounded-full hover:bg-gray-100 transition"
              title={language === 'am' ? 'የቪድዮ ጥሪ' : 'Video Call'}
            >
              <Video className="w-5 h-5 text-gray-600" />
            </button>
            <button
              className="p-2 rounded-full hover:bg-gray-100 transition"
              title={language === 'am' ? 'ተጨማሪ' : 'More'}
            >
              <MoreVertical className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </header>

        {/* Trust Badge Banner */}
        <div className="bg-gray-100 border-b border-gray-200 px-4 py-2 flex items-center justify-center space-x-2 text-sm text-gray-600">
          <Shield className="w-4 h-4" />
          <span>
            {language === 'am'
              ? 'አሁን በአስተማማኝ ሁኔታ ተገናኝተዋል! በነፃነት ይነጋገሩ።'
              : 'You are now safely connected! Feel free to chat.'
            }
          </span>
        </div>

        {/* Messages Section */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-white">
          <AnimatePresence initial={false}>
            {messages.map((msg, index) => (
              <MessageBubble
                key={msg._id || index}
                message={msg}
                isOwn={msg.sender === currentUser?.id}
                showAvatar={index === 0 || messages[index - 1]?.sender !== msg.sender}
              />
            ))}
          </AnimatePresence>

          {/* Typing Indicator */}
          <AnimatePresence>
            {isTyping && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex items-center space-x-3"
              >
                <div className="w-10 h-10 rounded-full bg-gray-200 shadow-md" />
                <div className="bg-gray-50 border border-gray-300 rounded-xl px-4 py-2 shadow-sm">
                  <div className="flex space-x-2">
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          <div ref={messagesEndRef} />
        </div>

        {/* Message Input */}
        <div className="border-t border-gray-200 bg-white p-4 shadow-inner">
          <div className="flex items-center space-x-3">
            {/* Attach Button */}
            <button
              className="p-2 rounded-full hover:bg-gray-100 transition"
              title={language === 'am' ? 'ፎቶ አያይዝ' : 'Attach photo'}
            >
              <ImageIcon className="w-5 h-5 text-gray-600" />
            </button>
            {/* Textarea */}
            <div className="flex-1 relative">
              <textarea
                ref={inputRef}
                value={messageInput}
                onChange={(e) => {
                  setMessageInput(e.target.value);
                  handleTyping();
                }}
                onKeyDown={handleKeyDown}
                placeholder={language === 'am' ? 'መልእክት ይጻፉ...' : 'Type a message...'}
                rows={1}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-full resize-none focus:outline-none focus:ring-2 focus:ring-gray-400 transition"
                style={{ maxHeight: '120px' }}
                onInput={(e) => {
                  e.target.style.height = 'auto';
                  e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px';
                }}
              />
              {/* Emoji Button */}
              <div className="absolute right-2 bottom-2 flex items-center space-x-2">
                <button
                  className="p-1 rounded-full hover:bg-gray-200 transition"
                  title={language === 'am' ? 'ኢሞጂ' : 'Emoji'}
                >
                  <Smile className="w-4 h-4 text-gray-600" />
                </button>
              </div>
            </div>
            {/* Send Button */}
            <button
              onClick={handleSend}
              disabled={!messageInput.trim()}
              className="p-3 bg-gray-700 text-white rounded-full hover:bg-gray-800 transition shadow-lg"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Video Call Modal */}
      <VideoCallModal
        isOpen={showVideoCall}
        onClose={() => setShowVideoCall(false)}
        roomId={currentRoom?._id}
        otherParticipant={otherParticipant}
      />
    </div>
  );
};
