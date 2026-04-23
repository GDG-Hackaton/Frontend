import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, MapPin, Globe, Phone, Shield, Heart, ArrowRight } from 'lucide-react';
import { useLanguage } from '../../../../lib/i18n';
import { useCreateProfile } from '../../hooks/useProfile';

export const CreateProfilePage = () => {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();
  const { mutate: createProfile, isPending } = useCreateProfile();
  
  const from = location.state?.from || '/wanted';
  
  const [formData, setFormData] = useState({
    realName: '',
    displayName: '',
    connectionCity: '',
    connectionCountry: '',
    phoneNumber: '',
    preferredLanguage: language,
    privacySettings: {
      showInSearch: true,
      allowNotifications: true,
    },
  });
  
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    
    if (!formData.realName.trim()) {
      newErrors.realName = language === 'am' ? 'ስም ያስፈልጋል' : 'Name is required';
    }
    if (!formData.connectionCity.trim()) {
      newErrors.connectionCity = language === 'am' ? 'ከተማ ያስፈልጋል' : 'City is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validate()) return;
    
    createProfile(formData, {
      onSuccess: () => {
        navigate(from, { replace: true });
      },
    });
  };

  return (
    <div className="min-h-screen bg-warm-white py-12 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-lg mx-auto"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-terracotta/10 rounded-full mb-4">
            <Heart className="w-8 h-8 text-terracotta" />
          </div>
          <h1 className="font-display text-3xl font-bold text-charcoal mb-2">
            {language === 'am' ? 'መገለጫ ይፍጠሩ' : 'Create Your Profile'}
          </h1>
          <p className="text-stone">
            {language === 'am'
              ? 'ለመቀጠል መገለጫዎን ያጠናቅቁ'
              : 'Complete your profile to continue'
            }
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-xl p-6 md:p-8 space-y-5">
          {/* Real Name */}
          <div>
            <label className="block text-sm font-medium text-charcoal mb-1.5">
              <User className="inline w-4 h-4 mr-1 text-terracotta" />
              {language === 'am' ? 'ሙሉ ስም *' : 'Full Name *'}
            </label>
            <input
              type="text"
              value={formData.realName}
              onChange={(e) => setFormData({ ...formData, realName: e.target.value })}
              placeholder={language === 'am' ? 'ሙሉ ስምዎን ያስገቡ' : 'Enter your full name'}
              className={`w-full px-4 py-3 bg-cream/50 border rounded-xl focus:border-terracotta focus:ring-2 focus:ring-terracotta/20 outline-none transition-all ${
                errors.realName ? 'border-error' : 'border-warm-gray'
              }`}
            />
            {errors.realName && (
              <p className="text-xs text-error mt-1">{errors.realName}</p>
            )}
          </div>

          {/* Display Name */}
          <div>
            <label className="block text-sm font-medium text-charcoal mb-1.5">
              @ {language === 'am' ? 'የማሳያ ስም (አማራጭ)' : 'Display Name (Optional)'}
            </label>
            <input
              type="text"
              value={formData.displayName}
              onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
              placeholder={language === 'am' ? 'የሚታይ ስም' : 'How you want to appear'}
              className="w-full px-4 py-3 bg-cream/50 border border-warm-gray rounded-xl focus:border-terracotta focus:ring-2 focus:ring-terracotta/20 outline-none transition-all"
            />
          </div>

          {/* Location */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-charcoal mb-1.5">
                <MapPin className="inline w-4 h-4 mr-1 text-terracotta" />
                {language === 'am' ? 'ከተማ *' : 'City *'}
              </label>
              <input
                type="text"
                value={formData.connectionCity}
                onChange={(e) => setFormData({ ...formData, connectionCity: e.target.value })}
                placeholder={language === 'am' ? 'አዲስ አበባ' : 'Addis Ababa'}
                className={`w-full px-4 py-3 bg-cream/50 border rounded-xl focus:border-terracotta focus:ring-2 focus:ring-terracotta/20 outline-none transition-all ${
                  errors.connectionCity ? 'border-error' : 'border-warm-gray'
                }`}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-charcoal mb-1.5">
                <Globe className="inline w-4 h-4 mr-1" />
                {language === 'am' ? 'ሀገር' : 'Country'}
              </label>
              <input
                type="text"
                value={formData.connectionCountry}
                onChange={(e) => setFormData({ ...formData, connectionCountry: e.target.value })}
                placeholder={language === 'am' ? 'ኢትዮጵያ' : 'Ethiopia'}
                className="w-full px-4 py-3 bg-cream/50 border border-warm-gray rounded-xl focus:border-terracotta focus:ring-2 focus:ring-terracotta/20 outline-none transition-all"
              />
            </div>
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium text-charcoal mb-1.5">
              <Phone className="inline w-4 h-4 mr-1" />
              {language === 'am' ? 'ስልክ ቁጥር' : 'Phone Number'}
            </label>
            <input
              type="tel"
              value={formData.phoneNumber}
              onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
              placeholder="+251 912 345 678"
              className="w-full px-4 py-3 bg-cream/50 border border-warm-gray rounded-xl focus:border-terracotta focus:ring-2 focus:ring-terracotta/20 outline-none transition-all"
            />
          </div>

          {/* Language Preference */}
          <div>
            <label className="block text-sm font-medium text-charcoal mb-1.5">
              <Globe className="inline w-4 h-4 mr-1" />
              {language === 'am' ? 'የሚመረጥ ቋንቋ' : 'Preferred Language'}
            </label>
            <div className="flex gap-3">
              {[
                { value: 'en', label: 'English', flag: '🇺🇸' },
                { value: 'am', label: 'አማርኛ', flag: '🇪🇹' },
              ].map(option => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setFormData({ ...formData, preferredLanguage: option.value })}
                  className={`flex-1 py-3 px-4 rounded-xl border-2 transition-all ${
                    formData.preferredLanguage === option.value
                      ? 'border-terracotta bg-terracotta/5 text-terracotta'
                      : 'border-warm-gray text-stone hover:border-terracotta/50'
                  }`}
                >
                  <span className="mr-2">{option.flag}</span>
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* Privacy Settings */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-charcoal">
              <Shield className="inline w-4 h-4 mr-1 text-terracotta" />
              {language === 'am' ? 'የግላዊነት ቅንብሮች' : 'Privacy Settings'}
            </label>
            
            <label className="flex items-center justify-between p-3 bg-cream rounded-xl border border-warm-gray/30 cursor-pointer">
              <span className="text-sm text-charcoal">
                {language === 'am' ? 'በፍለጋ ውጤቶች ውስጥ አሳይ' : 'Show in search results'}
              </span>
              <button
                type="button"
                onClick={() => setFormData({
                  ...formData,
                  privacySettings: {
                    ...formData.privacySettings,
                    showInSearch: !formData.privacySettings.showInSearch,
                  },
                })}
                className={`relative w-11 h-6 rounded-full transition-colors ${
                  formData.privacySettings.showInSearch ? 'bg-terracotta' : 'bg-warm-gray'
                }`}
              >
                <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                  formData.privacySettings.showInSearch ? 'translate-x-5' : 'translate-x-0.5'
                }`} />
              </button>
            </label>

            <label className="flex items-center justify-between p-3 bg-cream rounded-xl border border-warm-gray/30 cursor-pointer">
              <span className="text-sm text-charcoal">
                {language === 'am' ? 'ማሳወቂያዎችን ፍቀድ' : 'Allow notifications'}
              </span>
              <button
                type="button"
                onClick={() => setFormData({
                  ...formData,
                  privacySettings: {
                    ...formData.privacySettings,
                    allowNotifications: !formData.privacySettings.allowNotifications,
                  },
                })}
                className={`relative w-11 h-6 rounded-full transition-colors ${
                  formData.privacySettings.allowNotifications ? 'bg-terracotta' : 'bg-warm-gray'
                }`}
              >
                <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                  formData.privacySettings.allowNotifications ? 'translate-x-5' : 'translate-x-0.5'
                }`} />
              </button>
            </label>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isPending}
            className="w-full py-3.5 bg-terracotta text-white rounded-full font-semibold hover:bg-clay transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
          >
            {isPending ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>{language === 'am' ? 'በመፍጠር ላይ...' : 'Creating Profile...'}</span>
              </>
            ) : (
              <>
                <span>{language === 'am' ? 'መገለጫ ፍጠር' : 'Create Profile'}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>
      </motion.div>
    </div>
  );
};
