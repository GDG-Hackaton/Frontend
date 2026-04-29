import { useMemo, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Lock, Eye, EyeOff, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import axios from '../../lib/axios';
import { useLanguage } from '../../lib/i18n';

export const ResetPasswordPage = () => {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = useMemo(() => searchParams.get('token') || '', [searchParams]);

  const [formData, setFormData] = useState({ newPassword: '', confirmPassword: '' });
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setMessage('');

    if (!token) {
      setError(language === 'am' ? 'የመመለሻ ቶከን አልተገኘም።' : 'Missing reset token.');
      return;
    }
    if (formData.newPassword.length < 6) {
      setError(
        language === 'am'
          ? 'አዲሱ የይለፍ ቃል ቢያንስ 6 ፊደላት መሆን አለበት።'
          : 'Password must be at least 6 characters.',
      );
      return;
    }
    if (formData.newPassword !== formData.confirmPassword) {
      setError(language === 'am' ? 'የይለፍ ቃሎቹ አይዛመዱም።' : 'Passwords do not match.');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await axios.post('/api/auth/reset-password', {
        token,
        newPassword: formData.newPassword,
      });
      setMessage(
        response.data.message ||
          (language === 'am' ? 'የይለፍ ቃልዎ ተቀይሯል።' : 'Your password has been reset.'),
      );
      window.setTimeout(() => navigate('/auth/login', { replace: true }), 1500);
    } catch (requestError) {
      setError(
        requestError.response?.data?.message ||
          (language === 'am' ? 'የይለፍ ቃል መቀየር አልተሳካም።' : 'Failed to reset password.'),
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputCls =
    'w-full rounded-xl border border-stone-200 bg-stone-50 py-3 pl-10 pr-11 text-sm text-charcoal outline-none transition-all duration-200 placeholder:text-stone-400 focus:border-terracotta focus:bg-white focus:ring-2 focus:ring-terracotta/20 dark:border-stone-700 dark:bg-stone-800 dark:text-white dark:placeholder:text-stone-500 dark:focus:border-terracotta dark:focus:bg-stone-800';

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-stone-50 via-orange-50/30 to-stone-100 px-4 py-16 sm:px-6 lg:px-8 dark:from-stone-950 dark:via-stone-900 dark:to-stone-950">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: 'easeOut' }}
        className="w-full max-w-md"
      >
        {/* Card */}
        <div className="rounded-2xl border border-stone-200/80 bg-white p-8 shadow-lg dark:border-stone-700/60 dark:bg-stone-900">

          {/* Back link */}
          <Link
            to="/auth/login"
            className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-stone-500 transition-colors duration-150 hover:text-charcoal dark:text-stone-400 dark:hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            {language === 'am' ? 'ወደ መግቢያ ተመለስ' : 'Back to login'}
          </Link>

          <h1 className="font-display text-2xl font-bold text-charcoal dark:text-white">
            {language === 'am' ? 'አዲስ የይለፍ ቃል' : 'Set New Password'}
          </h1>
          <p className="mt-2 mb-7 text-sm text-stone-500 dark:text-stone-400">
            {language === 'am'
              ? 'አዲስ የይለፍ ቃል ያስገቡ።'
              : 'Choose a new password for your account.'}
          </p>

          {/* Success state */}
          {message ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center gap-3 rounded-xl border border-green-200 bg-green-50 p-6 text-center dark:border-green-800/40 dark:bg-green-950/30"
            >
              <CheckCircle className="h-8 w-8 text-green-500" />
              <p className="text-sm font-medium text-green-700 dark:text-green-400">{message}</p>
              <p className="text-xs text-stone-400 dark:text-stone-500">
                {language === 'am' ? 'ወደ መግቢያ እየተዛወሩ ነው...' : 'Redirecting to login...'}
              </p>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">

              {/* New Password */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-stone-700 dark:text-stone-300">
                  {language === 'am' ? 'አዲስ የይለፍ ቃል' : 'New Password'}
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
                  <input
                    type={showNew ? 'text' : 'password'}
                    value={formData.newPassword}
                    onChange={(event) =>
                      setFormData((c) => ({ ...c, newPassword: event.target.value }))
                    }
                    required
                    placeholder={language === 'am' ? 'አዲስ የይለፍ ቃል ያስገቡ' : 'Enter new password'}
                    className={inputCls}
                  />
                  <button
                    type="button"
                    onClick={() => setShowNew(!showNew)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 rounded p-0.5 text-stone-400 transition-colors duration-150 hover:text-stone-600 dark:hover:text-stone-300"
                    aria-label={showNew ? 'Hide password' : 'Show password'}
                  >
                    {showNew ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-stone-700 dark:text-stone-300">
                  {language === 'am' ? 'የይለፍ ቃል ያረጋግጡ' : 'Confirm Password'}
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
                  <input
                    type={showConfirm ? 'text' : 'password'}
                    value={formData.confirmPassword}
                    onChange={(event) =>
                      setFormData((c) => ({ ...c, confirmPassword: event.target.value }))
                    }
                    required
                    placeholder={language === 'am' ? 'የይለፍ ቃልዎን ያረጋግጡ' : 'Confirm your password'}
                    className={inputCls}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 rounded p-0.5 text-stone-400 transition-colors duration-150 hover:text-stone-600 dark:hover:text-stone-300"
                    aria-label={showConfirm ? 'Hide password' : 'Show password'}
                  >
                    {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {/* Error feedback */}
              {error && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600 dark:border-red-800/50 dark:bg-red-950/30 dark:text-red-400"
                >
                  {error}
                </motion.p>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="flex w-full items-center justify-center gap-2 rounded-full bg-terracotta py-3.5 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:bg-clay hover:shadow-md focus:outline-none focus:ring-2 focus:ring-terracotta/40 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    <span>{language === 'am' ? 'በማስቀመጥ ላይ...' : 'Resetting...'}</span>
                  </>
                ) : (
                  language === 'am' ? 'የይለፍ ቃል ቀይር' : 'Reset Password'
                )}
              </button>
            </form>
          )}
        </div>
      </motion.div>
    </div>
  );
};
