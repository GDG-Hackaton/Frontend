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
  Shield,
  ArrowLeft,
  MessageCircle
} from 'lucide-react';
import { useChat } from '../../hooks/useChat';
import { useSocket } from '../../hooks/useSocket';
import { useLanguage } from '../../../../lib/i18n';
import { ChatSidebar } from './ChatSidebar';
import { MessageBubble } from './MessageBubble';
import { VideoCallModal } from './VideoCallModal';
import { TrustBadge } from '../profile/TrustBadge';
import { ChatSkeleton } from './ChatSkeleton';
import { toast } from 'sonner';
import { wantedApi } from '../../services/wantedApi';

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
    isLoading 
  } = useChat(roomId);
  
  const { isConnected, socket } = useSocket();
  const [messageInput, setMessageInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const [showVideoCall, setShowVideoCall] = useState(false);
  const [incomingCall, setIncomingCall] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const inputRef = useRef(null);
  const fileInputRef = useRef(null);
  const { user: currentUser } = useAuth();

  // Listen for incoming calls
  useEffect(() => {
    if (!socket) return;

    const handleIncomingCall = (data) => {
      setIncomingCall(data);
      setShowVideoCall(true);
    };

    const handleCallEnded = () => {
      setIncomingCall(null);
      setShowVideoCall(false);
    };

    socket.on('incoming-call', handleIncomingCall);
    socket.on('call-ended', handleCallEnded);

    return () => {
      socket.off('incoming-call', handleIncomingCall);
      socket.off('call-ended', handleCallEnded);
    };
  }, [socket]);

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

  const handleImageSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error(language === 'am' ? 'እባክዎ ፎቶ ብቻ ይላኩ' : 'Please upload only images');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error(language === 'am' ? 'ፋይሉ ከ5MB መብለጥ የለበትም' : 'File size must be less than 5MB');
      return;
    }

    try {
      setIsUploading(true);
      const formData = new FormData();
      formData.append('photo', file);
      
      const response = await wantedApi.uploadChatPhoto(formData);
      
      sendMessage({
        roomId: currentRoom?._id,
        content: response.data.url,
        type: 'photo',
        metadata: {
          photoUrl: response.data.url,
          photoWidth: response.data.width,
          photoHeight: response.data.height,
        }
      });
      
      toast.success(language === 'am' ? 'ፎቶ ተልኳል' : 'Photo sent');
    } catch (error) {
      toast.error(language === 'am' ? 'ፎቶ መላክ አልተሳካም' : 'Failed to upload photo');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const otherParticipant = currentRoom?.participants?.find(
    p => p.user !== currentUser?.id && p.user?._id !== currentUser?.id
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
      <ChatSidebar 
        rooms={rooms}
        currentRoomId={roomId}
        isOpen={showSidebar}
        onClose={() => setShowSidebar(false)}
      />

      <div className="flex-1 flex flex-col bg-white shadow-lg rounded-l-2xl overflow-hidden">
        {/* Chat Header */}
        <header className="flex-shrink-0 bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between shadow-sm">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => navigate('/wanted')}
              className="p-2 rounded-full hover:bg-gray-100 transition"
              title={language === 'am' ? 'ተመለስ' : 'Back'}
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <button
              onClick={() => setShowSidebar(true)}
              className="p-2 rounded-full hover:bg-gray-100 transition"
              title={language === 'am' ? 'ማውጫ' : 'Menu'}
            >
              <ChevronLeft className="w-5 h-5 text-gray-600" />
            </button>
          </div>

          {otherParticipant && (
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center font-semibold text-gray-700 text-lg shadow-md">
                  {otherParticipant.profile?.realName?.[0]?.toUpperCase() || '?'}
                </div>
                {isConnected && (
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full" />
                )}
              </div>
              <div className="flex flex-col">
                <h2 className="text-lg font-semibold text-gray-800">
                  {otherParticipant.profile?.realName || (language === 'am' ? 'ተጠቃሚ' : 'User')}
                </h2>
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

        <div className="bg-gray-100 border-b border-gray-200 px-4 py-2 flex items-center justify-center space-x-2 text-sm text-gray-600">
          <Shield className="w-4 h-4" />
          <span>
            {language === 'am'
              ? 'አሁን በአስተማማኝ ሁኔታ ተገናኝተዋል! በነፃነት ይነጋገሩ።'
              : 'You are now safely connected! Feel free to chat.'
            }
          </span>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-white">
          <AnimatePresence initial={false}>
            {messages.map((msg, index) => (
              <MessageBubble
                key={msg._id || msg.clientId || index}
                message={msg}
                isOwn={msg.sender === currentUser?.id || msg.sender?._id === currentUser?.id}
                showAvatar={index === 0 || messages[index - 1]?.sender !== msg.sender}
              />
            ))}
          </AnimatePresence>

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

        {/* Incoming Call Notification */}
        <AnimatePresence>
          {incomingCall && !showVideoCall && (
            <motion.div
              initial={{ y: -100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -100, opacity: 0 }}
              className="absolute top-4 left-1/2 -translate-x-1/2 z-50 bg-white rounded-2xl shadow-2xl p-4 flex items-center gap-4 border border-gray-200"
            >
              <div className="w-12 h-12 rounded-full bg-terracotta flex items-center justify-center">
                <Video className="w-6 h-6 text-white animate-pulse" />
              </div>
              <div>
                <p className="font-semibold">
                  {language === 'am' ? 'የቪድዮ ጥሪ...' : 'Incoming video call...'}
                </p>
                <p className="text-sm text-stone">{incomingCall.callerName || 'User'}</p>
              </div>
              <button
                onClick={() => setShowVideoCall(true)}
                className="px-4 py-2 bg-green-500 text-white rounded-full hover:bg-green-600"
              >
                {language === 'am' ? 'መቀበል' : 'Accept'}
              </button>
              <button
                onClick={() => setIncomingCall(null)}
                className="px-4 py-2 bg-red-500 text-white rounded-full hover:bg-red-600"
              >
                {language === 'am' ? 'አለመቀበል' : 'Decline'}
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Message Input */}
        <div className="border-t border-gray-200 bg-white p-4 shadow-inner">
          <div className="flex items-center space-x-3">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleImageSelect}
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="p-2 rounded-full hover:bg-gray-100 transition disabled:opacity-50"
              title={language === 'am' ? 'ፎቶ አያይዝ' : 'Attach photo'}
            >
              {isUploading ? (
                <div className="w-5 h-5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
              ) : (
                <ImageIcon className="w-5 h-5 text-gray-600" />
              )}
            </button>
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
            </div>
            <button
              onClick={handleSend}
              disabled={!messageInput.trim()}
              className="p-3 bg-gray-700 text-white rounded-full hover:bg-gray-800 transition shadow-lg disabled:opacity-50"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      <VideoCallModal
        isOpen={showVideoCall}
        onClose={() => {
          setShowVideoCall(false);
          setIncomingCall(null);
        }}
        roomId={currentRoom?._id}
        incomingCall={incomingCall}
      />
    </div>
  );
};
