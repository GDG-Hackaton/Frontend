import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MessageCircle, 
  Shield, 
  CheckCircle, 
  AlertCircle,
  Clock,
  X,
  Send,
  User,
  Users,
  ArrowRight
} from 'lucide-react';
import { useLanguage } from '../../../../lib/i18n';
import { useAuth } from '../../../../hooks/useAuth';
import { useSubmitClaim } from '../../hooks/useClaims';

export const ClaimSection = ({ post, onClaimSubmitted }) => {
  const { language } = useLanguage();
  const { user } = useAuth();
  const { mutate: submitClaim, isPending } = useSubmitClaim();
  const [showClaimForm, setShowClaimForm] = useState(false);
  const [message, setMessage] = useState('');
  const [selectedPersonIndex, setSelectedPersonIndex] = useState(null);

  const isOwner = user?.id === post.poster;
  const hasClaimed = post.claims?.some(c => c.claimant === user?.id);
  const canClaim = post.status === 'active' && !isOwner && !hasClaimed;
  const availableSpots = post.isGroupPost 
    ? post.maxClaimants - (post.approvedClaimants?.length || 0)
    : post.status === 'active' ? 1 : 0;

const handleSubmitClaim = () => {
  if (!message.trim() || message.length < 10) {
    toast.error(
      language === 'am' 
        ? 'እባክዎ ቢያንስ 10 ቁምፊዎች ያስገቡ' 
        : 'Please enter at least 10 characters'
    );
    return;
  }

  const claimData = {
    messageToPoster: message.trim(),
  };
  
  if (post.isGroupPost && selectedPersonIndex !== null) {
    claimData.claimedPersonIndex = selectedPersonIndex;
  }

  console.log('📤 Submitting claim with data:', claimData);

  submitClaim(
    { 
      postId: post._id, 
      ...claimData
    },
    {
      onSuccess: () => {
        setShowClaimForm(false);
        setMessage('');
        setSelectedPersonIndex(null);
        onClaimSubmitted?.();
      },
      onError: (error) => {
        console.error('Claim submission failed:', error);
        toast.error(
          error.response?.data?.message || 
          (language === 'am' ? 'ጥያቄ ማቅረብ አልተሳካም' : 'Failed to submit claim')
        );
      },
    }
  );
};

  if (post.status === 'reconnected') {
    return (
      <div className="bg-success/5 rounded-2xl p-6 border border-success/20 text-center">
        <CheckCircle className="w-12 h-12 text-success mx-auto mb-3" />
        <h3 className="font-display text-lg font-semibold text-charcoal mb-2">
          {language === 'am' ? 'በተሳካ ሁኔታ ተገናኝተዋል!' : 'Successfully Reconnected!'}
        </h3>
        <p className="text-stone">
          {language === 'am'
            ? 'ይህ ልጥፍ አሁን ተዘግቷል።'
            : 'This post is now closed.'
          }
        </p>
      </div>
    );
  }

  if (isOwner) {
    return (
      <div className="bg-cream rounded-2xl p-6 border border-warm-gray/30">
        <div className="flex items-center gap-2 mb-4">
          <Shield className="w-5 h-5 text-terracotta" />
          <h3 className="font-display text-lg font-semibold text-charcoal">
            {language === 'am' ? 'የእርስዎ ልጥፍ' : 'Your Post'}
          </h3>
        </div>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-stone">
              {language === 'am' ? 'የቀረቡ ጥያቄዎች' : 'Claims Received'}
            </span>
            <span className="font-medium text-charcoal">
              {post.claims?.length || 0}
            </span>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-stone">
              {language === 'am' ? 'የጸደቁ' : 'Approved'}
            </span>
            <span className="font-medium text-charcoal">
              {post.approvedClaimants?.length || 0}
            </span>
          </div>

          {post.claims?.length > 0 && (
            <Link
              to="/wanted/claims"
              className="w-full mt-4 btn-outline flex items-center justify-center gap-2"
            >
              {language === 'am' ? 'ጥያቄዎችን ይገምግሙ' : 'Review Claims'}
              <ArrowRight className="w-4 h-4" />
            </Link>
          )}
        </div>
      </div>
    );
  }

  if (hasClaimed) {
    const myClaim = post.claims?.find(c => c.claimant === user?.id);
    
    return (
      <div className={`rounded-2xl p-6 border ${
        myClaim?.status === 'approved' 
          ? 'bg-hope-green/5 border-hope-green/20'
          : myClaim?.status === 'pending'
          ? 'bg-warmth/5 border-warmth/20'
          : 'bg-error/5 border-error/20'
      }`}>
        <div className="text-center">
          {myClaim?.status === 'approved' ? (
            <>
              <CheckCircle className="w-12 h-12 text-hope-green mx-auto mb-3" />
              <h3 className="font-display text-lg font-semibold text-charcoal mb-2">
                {language === 'am' ? 'ጥያቄዎ ጸድቋል!' : 'Claim Approved!'}
              </h3>
              <p className="text-stone mb-4">
                {language === 'am'
                  ? 'አሁን መወያየት መጀመር ይችላሉ'
                  : 'You can now start chatting'
                }
              </p>
              <Link
                to={`/wanted/chat/${myClaim.chatRoomId}`}
                className="btn-primary inline-flex items-center gap-2"
              >
                <MessageCircle className="w-4 h-4" />
                {language === 'am' ? 'ቻት ክፈት' : 'Open Chat'}
              </Link>
            </>
          ) : myClaim?.status === 'pending' ? (
            <>
              <Clock className="w-12 h-12 text-warmth mx-auto mb-3" />
              <h3 className="font-display text-lg font-semibold text-charcoal mb-2">
                {language === 'am' ? 'በመገምገም ላይ' : 'Under Review'}
              </h3>
              <p className="text-stone">
                {language === 'am'
                  ? 'ጥያቄዎ በመገምገም ላይ ነው። ውሳኔ ሲደረግ እናሳውቅዎታለን።'
                  : 'Your claim is being reviewed. We\'ll notify you when there\'s a decision.'
                }
              </p>
            </>
          ) : (
            <>
              <X className="w-12 h-12 text-error mx-auto mb-3" />
              <h3 className="font-display text-lg font-semibold text-charcoal mb-2">
                {language === 'am' ? 'አልተሳካም' : 'Not Approved'}
              </h3>
              <p className="text-stone">
                {language === 'am'
                  ? 'በሚያሳዝን ሁኔታ ጥያቄዎ አልጸደቀም።'
                  : 'Unfortunately, your claim was not approved.'
                }
              </p>
            </>
          )}
        </div>
      </div>
    );
  }

  if (!canClaim) {
    return (
      <div className="bg-warmth/5 rounded-2xl p-6 border border-warmth/20 text-center">
        <Users className="w-12 h-12 text-stone mx-auto mb-3 opacity-50" />
        <h3 className="font-display text-lg font-semibold text-charcoal mb-2">
          {language === 'am' ? 'ልጥፉ ሙሉ ነው' : 'Post is Full'}
        </h3>
        <p className="text-stone">
          {language === 'am'
            ? 'ይህ ልጥፍ አሁን ተጨማሪ ጥያቄ አይቀበልም።'
            : 'This post is no longer accepting claims.'
          }
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {!showClaimForm ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-cream rounded-2xl p-8 border border-warm-gray/30 text-center"
        >
          <div className="w-16 h-16 rounded-full bg-terracotta/10 flex items-center justify-center mx-auto mb-4">
            <User className="w-8 h-8 text-terracotta" />
          </div>
          
          <h3 className="font-display text-xl font-semibold text-charcoal mb-2">
            {language === 'am' 
              ? 'ይህ እርስዎ ነዎት?'
              : 'Is this you?'
            }
          </h3>
          
          <p className="text-stone mb-6">
            {language === 'am'
              ? 'ከለጣፊው ጋር ለመገናኘት መልእክት ይላኩ'
              : 'Send a message to connect with the poster'
            }
          </p>

          <button
            onClick={() => setShowClaimForm(true)}
            className="btn-primary inline-flex items-center gap-2"
          >
            <MessageCircle className="w-4 h-4" />
            {language === 'am' ? 'መልእክት ላክ' : 'Send Message'}
          </button>
        </motion.div>
      ) : (
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-cream rounded-2xl p-6 border border-warm-gray/30"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display text-lg font-semibold text-charcoal">
                {language === 'am' ? 'መልእክትዎን ይጻፉ' : 'Write Your Message'}
              </h3>
              <button
                onClick={() => setShowClaimForm(false)}
                className="p-1.5 text-stone hover:text-charcoal rounded-full hover:bg-warm-gray/20"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              {/* Group Post Person Selection */}
              {post.isGroupPost && post.soughtPeople?.length > 0 && (
                <div className="mb-4">
                  <label className="block text-sm font-medium text-charcoal mb-2">
                    {language === 'am' 
                      ? 'ማን ነዎት?'
                      : 'Who are you?'
                    }
                  </label>
                  <div className="space-y-2">
                    {post.soughtPeople.map((person, idx) => (
                      <button
                        key={idx}
                        onClick={() => setSelectedPersonIndex(idx)}
                        disabled={person.claimedBy}
                        className={`w-full p-3 rounded-xl border text-left transition-all ${
                          selectedPersonIndex === idx
                            ? 'border-terracotta bg-terracotta/5'
                            : 'border-warm-gray/30 hover:border-terracotta/50'
                        } ${person.claimedBy ? 'opacity-50 cursor-not-allowed' : ''}`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-charcoal">{person.name}</span>
                          {person.claimedBy ? (
                            <span className="text-xs text-stone">
                              {language === 'am' ? 'ተጠይቋል' : 'Claimed'}
                            </span>
                          ) : selectedPersonIndex === idx && (
                            <CheckCircle className="w-4 h-4 text-terracotta" />
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Message Input */}
              <div>
                <label className="block text-sm font-medium text-charcoal mb-2">
                  {language === 'am' 
                    ? 'እራስዎን ያስተዋውቁ *' 
                    : 'Introduce yourself *'
                  }
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder={language === 'am'
                    ? 'ለምሳሌ፡ ሰላም! እኔ አበበ ነኝ። አብረን ትምህርት ቤት ነበርን...'
                    : 'e.g., Hi! I\'m Abebe. We went to school together...'
                  }
                  rows={5}
                  maxLength={500}
                  className="w-full px-4 py-3 bg-white border border-warm-gray rounded-xl resize-none focus:border-terracotta focus:ring-2 focus:ring-terracotta/20 outline-none transition-all"
                />
                <div className="flex justify-between mt-1">
                  <p className="text-xs text-stone">
                    {language === 'am'
                      ? 'ቢያንስ 10 ቁምፊዎች'
                      : 'Minimum 10 characters'
                    }
                  </p>
                  <p className="text-xs text-stone">
                    {message.length} / 500
                  </p>
                </div>
              </div>

              {/* Privacy Notice */}
              <div className="p-3 bg-warmth/5 rounded-lg border border-warmth/20">
                <p className="text-xs text-stone flex items-start gap-2">
                  <Shield className="w-4 h-4 text-warmth flex-shrink-0 mt-0.5" />
                  <span>
                    {language === 'am'
                      ? 'መልእክትዎ ለለጣፊው ብቻ ይታያል። ማንነትዎ እስኪጸድቅ ድረስ አይገለጽም።'
                      : 'Your message is only visible to the poster. Your identity remains private until approved.'
                    }
                  </span>
                </p>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowClaimForm(false)}
                  className="flex-1 px-6 py-2.5 border border-warm-gray rounded-full text-stone hover:bg-warm-gray/20 transition-colors"
                >
                  {language === 'am' ? 'ይቅር' : 'Cancel'}
                </button>
                <button
                  onClick={handleSubmitClaim}
                  disabled={isPending || message.length < 10}
                  className="flex-1 px-6 py-2.5 bg-terracotta text-white rounded-full font-medium hover:bg-clay transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isPending ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>{language === 'am' ? 'በመላክ ላይ...' : 'Sending...'}</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>{language === 'am' ? 'ላክ' : 'Send'}</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  );
};
