import { useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Lock } from "lucide-react";
import axios from "../../lib/axios";
import { useLanguage } from "../../lib/i18n";
import { AuthShell } from "../../components/layout/AuthShell";

export const ResetPasswordPage = () => {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = useMemo(() => searchParams.get("token") || "", [searchParams]);
  const [formData, setFormData] = useState({ newPassword: "", confirmPassword: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setMessage("");

    if (!token) {
      setError(language === "am" ? "የመመለሻ ቶከን አልተገኘም።" : "Missing reset token.");
      return;
    }

    if (formData.newPassword.length < 6) {
      setError(
        language === "am"
          ? "አዲሱ የይለፍ ቃል ቢያንስ 6 ፊደላት መሆን አለበት።"
          : "Password must be at least 6 characters.",
      );
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      setError(language === "am" ? "የይለፍ ቃሎቹ አይዛመዱም።" : "Passwords do not match.");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await axios.post("/api/auth/reset-password", {
        token,
        newPassword: formData.newPassword,
      });

      setMessage(
        response.data.message ||
          (language === "am" ? "የይለፍ ቃልዎ ተቀይሯል።" : "Your password has been reset."),
      );

      window.setTimeout(() => navigate("/auth/login", { replace: true }), 1500);
    } catch (requestError) {
      setError(
        requestError.response?.data?.message ||
          (language === "am" ? "የይለፍ ቃል መቀየር አልተሳካም።" : "Failed to reset password."),
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthShell
      title={language === "am" ? "አዲስ የይለፍ ቃል" : "Set new password"}
      subtitle={
        language === "am"
          ? "የተሻለ ደህንነት ያለው አዲስ የይለፍ ቃል ያስገቡ።"
          : "Choose a secure new password for your account."
      }
      backTo="/auth/login"
      backLabel={language === "am" ? "ወደ መግቢያ ተመለስ" : "Back to login"}
    >

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-charcoal mb-1.5">
              {language === "am" ? "አዲስ የይለፍ ቃል" : "New Password"}
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-stone" />
              <input
                type="password"
                value={formData.newPassword}
                onChange={(event) =>
                  setFormData((current) => ({ ...current, newPassword: event.target.value }))
                }
                required
                className="w-full pl-11 pr-4 py-3 bg-cream/50 border border-warm-gray rounded-xl focus:border-terracotta focus:ring-2 focus:ring-terracotta/20 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-charcoal mb-1.5">
              {language === "am" ? "የይለፍ ቃል ያረጋግጡ" : "Confirm Password"}
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-stone" />
              <input
                type="password"
                value={formData.confirmPassword}
                onChange={(event) =>
                  setFormData((current) => ({
                    ...current,
                    confirmPassword: event.target.value,
                  }))
                }
                required
                className="w-full pl-11 pr-4 py-3 bg-cream/50 border border-warm-gray rounded-xl focus:border-terracotta focus:ring-2 focus:ring-terracotta/20 outline-none"
              />
            </div>
          </div>

          {message ? <p className="text-sm text-hope-green">{message}</p> : null}
          {error ? <p className="text-sm text-error">{error}</p> : null}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 bg-terracotta text-white rounded-full font-semibold hover:bg-clay transition-colors disabled:opacity-50"
          >
            {isSubmitting
              ? language === "am" ? "በማስቀመጥ ላይ..." : "Resetting..."
              : language === "am" ? "የይለፍ ቃል ቀይር" : "Reset Password"}
          </button>
        </form>
    </AuthShell>
  );
};
