import { useState } from "react";
import { Link, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { AlertCircle, ArrowRight, Eye, EyeOff, Lock, Mail } from "lucide-react";
import { useLanguage } from "../../lib/i18n";
import { useAuth } from "../../hooks/useAuth";
import { GoogleSignInButton } from "./GoogleSignInButton";
import { AuthShell } from "../../components/layout/AuthShell";

export const LoginPage = () => {
  const { language } = useLanguage();
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState("");

  const redirectTarget = searchParams.get("redirect");
  const safeRedirect =
    redirectTarget && redirectTarget.startsWith("/") && !redirectTarget.startsWith("//")
      ? redirectTarget
      : null;
  const from = safeRedirect || location.state?.from?.pathname || "/wanted";

  const validate = () => {
    const newErrors = {};
    
    if (!formData.email) {
      newErrors.email = language === "am" ? "ኢሜይል ያስፈልጋል" : "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email =
        language === "am" ? "ትክክለኛ ኢሜይል አድራሻ አይደለም" : "Invalid email address";
    }
    
    if (!formData.password) {
      newErrors.password =
        language === "am" ? "የይለፍ ቃል ያስፈልጋል" : "Password is required";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoginError("");
    
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
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  return (
    <AuthShell
      title={language === "am" ? "እንኳን ደህና መጡ" : "Welcome back"}
      subtitle={
        language === "am" ? "ሪፖርቶችን ለመቀጠል ይግቡ።" : "Sign in to continue your case workflow."
      }
      backTo="/"
      backLabel={language === "am" ? "ወደ መነሻ ተመለስ" : "Back to home"}
    >
          {loginError && (
            <div className="mb-5 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-3">
              <AlertCircle className="w-5 h-5 text-error flex-shrink-0 mt-0.5" />
              <p className="text-sm text-error">{loginError}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-charcoal mb-1.5">
                {language === "am" ? "ኢሜይል" : "Email"}
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-stone" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder={language === "am" ? "ኢሜይልዎን ያስገቡ" : "Enter your email"}
                  className={`w-full rounded-xl border px-11 py-3 outline-none transition focus:border-terracotta focus:ring-2 focus:ring-terracotta/20 ${
                    errors.email ? "border-error" : "border-warm-gray"
                  }`}
                  autoComplete="email"
                />
              </div>
              {errors.email && (
                <p className="text-xs text-error mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.email}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-charcoal mb-1.5">
                {language === "am" ? "የይለፍ ቃል" : "Password"}
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-stone" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder={language === "am" ? "የይለፍ ቃልዎትን ያስገቡ" : "Enter your password"}
                  className={`w-full rounded-xl border px-11 py-3 outline-none transition focus:border-terracotta focus:ring-2 focus:ring-terracotta/20 ${
                    errors.password ? "border-error" : "border-warm-gray"
                  }`}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-stone hover:text-charcoal"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs text-error mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.password}
                </p>
              )}
            </div>

            <div className="flex justify-end">
              <Link
                to="/auth/forgot-password"
                className="text-sm text-terracotta hover:text-clay transition-colors"
              >
                {language === "am" ? "የይለፍ ቃል ረሳው?" : "Forgot password?"}
              </Link>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-terracotta py-3 font-semibold text-white transition hover:bg-clay disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>{language === "am" ? "ትንሽ ይጠብቁ..." : "Signing in..."}</span>
                </>
              ) : (
                <>
                  <span>{language === "am" ? "ይግቡ" : "Sign In"}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="relative my-5">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-warm-gray/40"></div>
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-white px-3 text-stone">
                {language === "am" ? "ወይም" : "or"}
              </span>
            </div>
          </div>

          <GoogleSignInButton
            onSuccess={() => {
              navigate(from, { replace: true });
            }}
          />

          <p className="text-center text-sm text-stone mt-2">
            {language === "am" ? "አካውንት የሎትም?" : "Don't have an account?"}{" "}
            <Link
              to="/auth/register"
              className="text-terracotta hover:text-clay font-medium"
            >
              {language === "am" ? "አሁኑኑ ይመዝገቡ" : "Sign up now"}
            </Link>
          </p>
    </AuthShell>
  );
};
