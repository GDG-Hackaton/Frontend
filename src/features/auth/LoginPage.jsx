import React, { useState } from 'react';
import { Link, useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  AlertCircle,
} from 'lucide-react';
import { useLanguage } from '../../lib/i18n';
import { useAuth } from '../../hooks/useAuth';

export const LoginPage = () => {
  const { language } = useLanguage();
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState('');

  const redirectTarget = searchParams.get('redirect');
  const safeRedirect =
    redirectTarget && redirectTarget.startsWith('/') && !redirectTarget.startsWith('//')
      ? redirectTarget
      : null;
  const from = safeRedirect || location.state?.from?.pathname || '/wanted';

  const validate = () => {
    const newErrors = {};
    if (!formData.email) {
      newErrors.email = language === 'am' ? 'ኢሜይል ያስፈልጋል' : 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = language === 'am' ? 'ትክክለኛ ኢሜይል አድራሻ አይደለም' : 'Invalid email address';
    }
    if (!formData.password) {
      newErrors.password = language === 'am' ? 'የይለፍ ቃል ያስፈልጋል' : 'Password is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoginError('');
    if (!validate()) return;
    setIsLoading(true);
    const result = await login(formData.email, formData.password);
    if (result.success) {
      navigate(from, { replace: true });
    } else {
      setLoginError(result.error);
    }
    setIsLoading(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-stone-50 via-orange-50/30 to-stone-100 px-4 py-16 sm:px-6 lg:px-8 dark:from-stone-950 dark:via-stone-900 dark:to-stone-950">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: 'easeOut' }}
        className="w-full max-w-md"
      >
        {/* Heading */}
        <div className="mb-8 text-center">
          <h2 className="font-display text-3xl font-bold text-charcoal dark:text-white">
            {language === 'am' ? 'እንኳን ደህና መጡ' : 'Welcome Back'}
          </h2>
          <p className="mt-2 text-sm text-stone-500 dark:text-stone-400">
            {language === 'am' ? 'ለመቀጠል Sign in ያርጉ' : 'Sign in to continue'}
          </p>
        </div>

        {/* Card */}
        <div className="rounded-2xl border border-stone-200/80 bg-white p-8 shadow-lg dark:border-stone-700/60 dark:bg-stone-900">

          {/* Global error */}
          {loginError && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 dark:border-red-800/50 dark:bg-red-950/30"
            >
              <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-red-500" />
              <p className="text-sm text-red-700 dark:text-red-400">{loginError}</p>
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Email */}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-stone-700 dark:text-stone-300">
                {language === 'am' ? 'ኢሜይል' : 'Email'}
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder={language === 'am' ? 'ኢሜይልዎን ያስገቡ' : 'Enter your email'}
                  autoComplete="email"
                  className={`w-full rounded-xl border bg-stone-50 py-3 pl-10 pr-4 text-sm text-charcoal outline-none transition-all duration-200 placeholder:text-stone-400 focus:bg-white focus:ring-2 dark:bg-stone-800 dark:text-white dark:placeholder:text-stone-500 dark:focus:bg-stone-800 ${
                    errors.email
                      ? 'border-red-400 focus:border-red-400 focus:ring-red-200 dark:border-red-600 dark:focus:ring-red-900/40'
                      : 'border-stone-200 focus:border-terracotta focus:ring-terracotta/20 dark:border-stone-700 dark:focus:border-terracotta'
                  }`}
                />
              </div>
              {errors.email && (
                <p className="mt-1.5 flex items-center gap-1 text-xs text-red-500">
                  <AlertCircle className="h-3 w-3" />
                  {errors.email}
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-stone-700 dark:text-stone-300">
                {language === 'am' ? 'የይለፍ ቃል' : 'Password'}
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder={language === 'am' ? 'የይለፍ ቃልዎትን ያስገቡ' : 'Enter your password'}
                  autoComplete="current-password"
                  className={`w-full rounded-xl border bg-stone-50 py-3 pl-10 pr-11 text-sm text-charcoal outline-none transition-all duration-200 placeholder:text-stone-400 focus:bg-white focus:ring-2 dark:bg-stone-800 dark:text-white dark:placeholder:text-stone-500 dark:focus:bg-stone-800 ${
                    errors.password
                      ? 'border-red-400 focus:border-red-400 focus:ring-red-200 dark:border-red-600 dark:focus:ring-red-900/40'
                      : 'border-stone-200 focus:border-terracotta focus:ring-terracotta/20 dark:border-stone-700 dark:focus:border-terracotta'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 rounded p-0.5 text-stone-400 transition-colors duration-150 hover:text-stone-600 dark:hover:text-stone-300"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1.5 flex items-center gap-1 text-xs text-red-500">
                  <AlertCircle className="h-3 w-3" />
                  {errors.password}
                </p>
              )}
            </div>

            {/* Forgot password */}
            <div className="flex justify-end">
              <Link
                to="/auth/forgot-password"
                className="text-sm font-medium text-terracotta transition-colors duration-150 hover:text-clay"
              >
                {language === 'am' ? 'የይለፍ ቃል ረሳው?' : 'Forgot password?'}
              </Link>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="flex w-full items-center justify-center gap-2 rounded-full bg-terracotta py-3.5 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:bg-clay hover:shadow-md focus:outline-none focus:ring-2 focus:ring-terracotta/40 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  <span>{language === 'am' ? 'ትንሽ ይጠብቁ...' : 'Signing in...'}</span>
                </>
              ) : (
                <>
                  <span>{language === 'am' ? 'ይግቡ' : 'Sign In'}</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-stone-200 dark:border-stone-700" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-white px-3 text-xs text-stone-400 dark:bg-stone-900 dark:text-stone-500">
                {language === 'am' ? 'ወይም' : 'or'}
              </span>
            </div>
          </div>

          {/* Register link */}
          <p className="text-center text-sm text-stone-500 dark:text-stone-400">
            {language === 'am' ? 'አካውንት የሎትም?' : "Don't have an account?"}{' '}
            <Link
              to="/auth/register"
              className="font-semibold text-terracotta transition-colors duration-150 hover:text-clay"
            >
              {language === 'am' ? 'አሁኑኑ ይመዝገቡ' : 'Sign up now'}
            </Link>
          </p>
        </div>

        {/* Trust note */}
        <p className="mt-6 flex items-center justify-center gap-1.5 text-center text-xs text-stone-400 dark:text-stone-500">
          <Lock className="h-3 w-3" />
          {language === 'am'
            ? 'የግል መረጃዎ ደህንነት የተጠበቀ ነው'
            : 'Secure login · Your information is private'}
        </p>
      </motion.div>
    </div>
  );
};
