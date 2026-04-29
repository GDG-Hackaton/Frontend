import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  AlertCircle,
  CheckCircle,
  Phone,
} from 'lucide-react';
import { useLanguage } from '../../lib/i18n';
import { useAuth } from '../../hooks/useAuth';

export const RegisterPage = () => {
  const { language } = useLanguage();
  const { register } = useAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [registerError, setRegisterError] = useState('');

  const validateStep1 = () => {
    const newErrors = {};
    if (!formData.name || formData.name.length < 2) {
      newErrors.name =
        language === 'am'
          ? 'ስም ያስፈልጋል (ቢያንስ 2 ፊደላት)'
          : 'Name is required (min 2 characters)';
    }
    if (!formData.email) {
      newErrors.email = language === 'am' ? 'ኢሜይል ያስፈልጋል' : 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email =
        language === 'am' ? 'ትክክለኛ ኢሜይል አድራሻ አይደለም' : 'Invalid email address';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors = {};
    if (!formData.password || formData.password.length < 6) {
      newErrors.password =
        language === 'am'
          ? 'የይለፍ ቃል ቢያንስ 6 ቁምፊዎች መሆን አለበት'
          : 'Password must be at least 6 characters';
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword =
        language === 'am' ? 'የይለፍ ቃሎች አይዛመዱም' : 'Passwords do not match';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep1()) setStep(2);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setRegisterError('');
    if (!validateStep2()) return;
    setIsLoading(true);
    const result = await register({
      name: formData.name,
      email: formData.email,
      phone: formData.phone || undefined,
      password: formData.password,
    });
    if (result.success) {
      navigate('/wanted/profile/create', {
        state: {
          message:
            language === 'am'
              ? 'እንኳን ደህና መጡ! መገለጫዎን ያጠናቅቁ።'
              : 'Welcome! Complete your profile.',
        },
      });
    } else {
      setRegisterError(result.error);
    }
    setIsLoading(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  /* shared input class builder */
  const inputCls = (field) =>
    `w-full rounded-xl border bg-stone-50 py-3 pl-10 pr-4 text-sm text-charcoal outline-none transition-all duration-200 placeholder:text-stone-400 focus:bg-white focus:ring-2 dark:bg-stone-800 dark:text-white dark:placeholder:text-stone-500 dark:focus:bg-stone-800 ${
      errors[field]
        ? 'border-red-400 focus:border-red-400 focus:ring-red-200 dark:border-red-600 dark:focus:ring-red-900/40'
        : 'border-stone-200 focus:border-terracotta focus:ring-terracotta/20 dark:border-stone-700 dark:focus:border-terracotta'
    }`;

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-stone-50 via-orange-50/30 to-stone-100 px-4 py-12 sm:px-6 lg:px-8 dark:from-stone-950 dark:via-stone-900 dark:to-stone-950">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: 'easeOut' }}
        className="w-full max-w-md"
      >
        {/* Heading */}
        <div className="mb-6 text-center">
          <h2 className="font-display text-3xl font-bold text-charcoal dark:text-white">
            {language === 'am' ? 'መለያ ይፍጠሩ' : 'Create Account'}
          </h2>
          <p className="mt-2 text-sm text-stone-500 dark:text-stone-400">
            {language === 'am' ? 'ዛሬ መፈለግ ይጀምሩ' : 'Start your search today'}
          </p>
        </div>

        {/* Step indicator */}
        <div className="mb-6 flex items-center justify-center gap-3">
          {/* Step 1 */}
          <div
            className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold transition-all duration-300 ${
              step === 1
                ? 'bg-terracotta text-white shadow-sm'
                : 'bg-green-500 text-white'
            }`}
          >
            {step > 1 ? <CheckCircle className="h-4 w-4" /> : '1'}
          </div>
          <div
            className={`h-0.5 w-14 rounded-full transition-all duration-300 ${
              step === 2 ? 'bg-terracotta' : 'bg-stone-200 dark:bg-stone-700'
            }`}
          />
          {/* Step 2 */}
          <div
            className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold transition-all duration-300 ${
              step === 2
                ? 'bg-terracotta text-white shadow-sm'
                : 'bg-stone-200 text-stone-500 dark:bg-stone-700 dark:text-stone-400'
            }`}
          >
            2
          </div>
        </div>

        {/* Card */}
        <div className="rounded-2xl border border-stone-200/80 bg-white p-8 shadow-lg dark:border-stone-700/60 dark:bg-stone-900">

          {/* Global error */}
          {registerError && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 dark:border-red-800/50 dark:bg-red-950/30"
            >
              <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-red-500" />
              <p className="text-sm text-red-700 dark:text-red-400">{registerError}</p>
            </motion.div>
          )}

          <form
            onSubmit={
              step === 1
                ? (e) => { e.preventDefault(); handleNext(); }
                : handleSubmit
            }
          >
            <AnimatePresence mode="wait">
              {step === 1 ? (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-5"
                >
                  {/* Name */}
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-stone-700 dark:text-stone-300">
                      {language === 'am' ? 'ሙሉ ስም' : 'Full Name'}
                    </label>
                    <div className="relative">
                      <User className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder={language === 'am' ? 'ሙሉ ስምዎን ያስገቡ' : 'Enter your full name'}
                        autoComplete="name"
                        className={inputCls('name')}
                      />
                    </div>
                    {errors.name && (
                      <p className="mt-1.5 flex items-center gap-1 text-xs text-red-500">
                        <AlertCircle className="h-3 w-3" />
                        {errors.name}
                      </p>
                    )}
                  </div>

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
                        className={inputCls('email')}
                      />
                    </div>
                    {errors.email && (
                      <p className="mt-1.5 flex items-center gap-1 text-xs text-red-500">
                        <AlertCircle className="h-3 w-3" />
                        {errors.email}
                      </p>
                    )}
                  </div>

                  {/* Phone (optional) */}
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-stone-700 dark:text-stone-300">
                      {language === 'am' ? 'ስልክ ቁጥር (አማራጭ)' : 'Phone Number'}
                      <span className="ml-1.5 text-xs font-normal text-stone-400">
                        ({language === 'am' ? 'አማራጭ' : 'Optional'})
                      </span>
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="+251 912 345 678"
                        autoComplete="tel"
                        className="w-full rounded-xl border border-stone-200 bg-stone-50 py-3 pl-10 pr-4 text-sm text-charcoal outline-none transition-all duration-200 placeholder:text-stone-400 focus:border-terracotta focus:bg-white focus:ring-2 focus:ring-terracotta/20 dark:border-stone-700 dark:bg-stone-800 dark:text-white dark:placeholder:text-stone-500 dark:focus:border-terracotta dark:focus:bg-stone-800"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="flex w-full items-center justify-center gap-2 rounded-full bg-terracotta py-3.5 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:bg-clay hover:shadow-md focus:outline-none focus:ring-2 focus:ring-terracotta/40 focus:ring-offset-2"
                  >
                    <span>{language === 'am' ? 'ቀጥል' : 'Continue'}</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </motion.div>
              ) : (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-5"
                >
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
                        placeholder={language === 'am' ? 'የይለፍ ቃል ይፍጠሩ' : 'Create a password'}
                        autoComplete="new-password"
                        className={`${inputCls('password')} pr-11`}
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

                  {/* Confirm Password */}
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-stone-700 dark:text-stone-300">
                      {language === 'am' ? 'የይለፍ ቃል አረጋግጥ' : 'Confirm Password'}
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        placeholder={language === 'am' ? 'የይለፍ ቃልዎን ያረጋግጡ' : 'Confirm your password'}
                        autoComplete="new-password"
                        className={`${inputCls('confirmPassword')} pr-11`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 rounded p-0.5 text-stone-400 transition-colors duration-150 hover:text-stone-600 dark:hover:text-stone-300"
                        aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                      >
                        {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                    {errors.confirmPassword && (
                      <p className="mt-1.5 flex items-center gap-1 text-xs text-red-500">
                        <AlertCircle className="h-3 w-3" />
                        {errors.confirmPassword}
                      </p>
                    )}
                  </div>

                  <div className="flex gap-3 pt-1">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="flex-1 rounded-full border border-stone-200 py-3.5 text-sm font-medium text-stone-600 transition-all duration-200 hover:bg-stone-50 hover:text-charcoal dark:border-stone-700 dark:text-stone-400 dark:hover:bg-stone-800 dark:hover:text-white"
                    >
                      {language === 'am' ? 'ወደ ኋላ' : 'Back'}
                    </button>
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="flex flex-1 items-center justify-center gap-2 rounded-full bg-terracotta py-3.5 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:bg-clay hover:shadow-md focus:outline-none focus:ring-2 focus:ring-terracotta/40 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {isLoading ? (
                        <>
                          <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                          <span>{language === 'am' ? 'በመመዝገብ ላይ...' : 'Creating...'}</span>
                        </>
                      ) : (
                        <span>{language === 'am' ? 'ተመዝገብ' : 'Sign Up'}</span>
                      )}
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </form>

          {/* Login link */}
          <p className="mt-6 text-center text-sm text-stone-500 dark:text-stone-400">
            {language === 'am' ? 'መለያ አለዎት?' : 'Already have an account?'}{' '}
            <Link
              to="/auth/login"
              className="font-semibold text-terracotta transition-colors duration-150 hover:text-clay"
            >
              {language === 'am' ? 'ግባ' : 'Sign in'}
            </Link>
          </p>
        </div>

        {/* Terms */}
        <p className="mt-6 text-center text-xs text-stone-400 dark:text-stone-500">
          {language === 'am' ? 'በመመዝገብ የእኛን ' : 'By signing up, you agree to our '}
          <Link to="/terms" className="text-terracotta hover:underline">
            {language === 'am' ? 'የአገልግሎት ውል' : 'Terms of Service'}
          </Link>
          {' '}{language === 'am' ? 'እና' : 'and'}{' '}
          <Link to="/privacy" className="text-terracotta hover:underline">
            {language === 'am' ? 'የግላዊነት ፖሊሲ' : 'Privacy Policy'}
          </Link>
        </p>
      </motion.div>
    </div>
  );
};
